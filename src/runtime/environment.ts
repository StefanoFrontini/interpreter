import { RuntimeVal } from "./values.js";

export default class Environment {
  #parent?: Environment;
  variables: Map<string, RuntimeVal>;

  constructor(parentEnv?: Environment) {
    this.#parent = parentEnv;
    this.variables = new Map();
  }
  declareVar(varName: string, value: RuntimeVal): RuntimeVal {
    if (this.variables.has(varName)) {
      throw `Cannot declare variable ${varName} as it is already defined`;
    }

    this.variables.set(varName, value);
    return value;
  }

  assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varName);
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
