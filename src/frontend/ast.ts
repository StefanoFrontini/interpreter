export type NodeType =
  | "Program" // array of statements
  | "NumericLiteral" // expression
  | "NullLiteral" // expression
  | "Identifier" // expression
  | "BinaryExpr"; // expression

// expressions return a value
// assignment expression x = 45
// statements do not return a value. For example, a variable declaration let x = 45 returns undefined

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  operator: string;
  left: Expr;
  right: Expr;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}
