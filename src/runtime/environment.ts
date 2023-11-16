import { MK_BOOL, MK_NULL, RuntimeVal } from "./values.js";

export function createGlobalEnv() {
  const env = new Environment();
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);

  return env;
}

export default class Environment {
  #parent?: Environment;
  variables: Map<string, RuntimeVal>;
  #constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.#parent = parentEnv;
    this.variables = new Map();
    this.#constants = new Set();
  }
  declareVar(
    varName: string,
    value: RuntimeVal,
    constant: boolean
  ): RuntimeVal {
    if (this.variables.has(varName)) {
      throw `Cannot declare variable ${varName} as it is already defined`;
    }

    this.variables.set(varName, value);
    if (constant) {
      this.#constants.add(varName);
    }
    return value;
  }

  assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varName);
    if (env.#constants.has(varName)) {
      throw `Cannot reassign constant variable ${varName}`;
    }
    env.variables.set(varName, value);
    return value;
  }

  lookupVar(varName: string): RuntimeVal {
    const env = this.resolve(varName);
    return env.variables.get(varName);
  }

  resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this;
    }
    if (!this.#parent) {
      throw new ReferenceError(`Variable ${varName} is not defined`);
    }
    return this.#parent.resolve(varName);
  }
}
