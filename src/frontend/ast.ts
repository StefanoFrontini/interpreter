// ----------------------------------------------------------
// --------------------AST types ---------------------------
// -------Defines the structure of our languages AST ------
// ----------------------------------------------------------
export type NodeType =
  // STATEMENTS
  | "Program" // array of statements
  | "VarDeclaration"

  // EXPRESSIONS
  | "AssignmentExpr"

  // LITERALS
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral" // expression
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

export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value: Expr;
}

export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assigne: Expr;
  value: Expr;
}

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

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}
