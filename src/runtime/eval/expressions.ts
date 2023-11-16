import { evaluate } from "../interpreter.js";

import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  ObjectLiteral,
} from "../../frontend/ast.js";
import Environment from "../environment.js";
import { MK_NULL, NumberVal, ObjectVal, RuntimeVal } from "../values.js";

function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): RuntimeVal {
  let result: number;
  if (operator === "+") {
    result = lhs.value + rhs.value;
  } else if (operator === "-") {
    result = lhs.value - rhs.value;
  } else if (operator === "*") {
    result = lhs.value * rhs.value;
  } else if (operator === "/") {
    result = lhs.value / rhs.value;
  } else {
    result = lhs.value % rhs.value;
  }

  return {
    value: result,
    type: "number",
  } as NumberVal;
}
export function evaluate_binary_expr(
  binOp: BinaryExpr,
  env: Environment
): RuntimeVal {
  const lhs = evaluate(binOp.left, env);
  const rhs = evaluate(binOp.right, env);

  if (lhs.type === "number" && rhs.type === "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binOp.operator
    );
  }

  return MK_NULL();
}
export function eval_identifier(
  ident: Identifier,
  env: Environment
): RuntimeVal {
  return env.lookupVar(ident.symbol);
}

export function eval_assignment(
  node: AssignmentExpr,
  env: Environment
): RuntimeVal {
  if (node.assigne.kind !== "Identifier") {
    throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assigne)}`;
  }

  const varName = (node.assigne as Identifier).symbol;
  return env.assignVar(varName, evaluate(node.value, env));
}

export function eval_object_expr(
  obj: ObjectLiteral,
  env: Environment
): RuntimeVal {
  const object = {
    type: "object",
    properties: new Map(),
  } as ObjectVal;

  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value === undefined ? env.lookupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal);
  }

  return object;
}
