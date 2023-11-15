import { exit } from "node:process";
import {
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
} from "../frontend/ast.js";
import Environment from "./environment.js";
import { MK_NULL, NumberVal, RuntimeVal } from "./values.js";

function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

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
function evaluate_binary_expr(binOp: BinaryExpr, env: Environment): RuntimeVal {
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

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  return env.lookupVar(ident.symbol);
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;

    case "Identifier":
      return eval_identifier(astNode as Identifier, env);

    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr, env);

    case "Program":
      return eval_program(astNode as Program, env);

    default:
      console.error("This AST Node has not yet been setup for interpretation");
      exit(0);
  }
}
