import { exit } from "node:process";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  VarDeclaration,
} from "../frontend/ast.js";
import Environment from "./environment.js";
import {
  eval_assignment,
  eval_identifier,
  eval_object_expr,
  evaluate_binary_expr,
} from "./eval/expressions.js";
import { eval_program, eval_var_declaration } from "./eval/statements.js";
import { NumberVal, RuntimeVal } from "./values.js";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;

    case "Identifier":
      return eval_identifier(astNode as Identifier, env);

    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);

    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);

    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr, env);

    case "Program":
      return eval_program(astNode as Program, env);

    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);

    default:
      console.error("This AST Node has not yet been setup for interpretation");
      console.dir(astNode, { depth: null });
      exit(0);
  }
}
