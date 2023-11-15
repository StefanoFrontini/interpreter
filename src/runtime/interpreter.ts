import { exit } from "node:process";
import { BinaryExpr, NumericLiteral, Program, Stmt } from "../frontend/ast.js";
import { NullVal, NumberVal, RuntimeVal } from "./values.js";

function eval_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {
    type: "null",
    value: "null",
  } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
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
function evaluate_binary_expr(binOp: BinaryExpr): RuntimeVal {
  const lhs = evaluate(binOp.left);
  const rhs = evaluate(binOp.right);

  if (lhs.type === "number" && rhs.type === "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binOp.operator
    );
  }

  return {
    type: "null",
    value: "null",
  } as NullVal;
}
export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;

    case "NullLiteral":
      return {
        value: "null",
        type: "null",
      } as NullVal;

    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr);

    case "Program":
      return eval_program(astNode as Program);

    default:
      console.error("This AST Node has not yet been setup for interpretation");
      exit(0);
  }
}
