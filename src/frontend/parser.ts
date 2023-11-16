import { exit } from "node:process";
import {
  AssignmentExpr,
  BinaryExpr,
  Expr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  Stmt,
  VarDeclaration,
} from "./ast.js";
import { Token, TokenType, tokenize } from "./lexer.js";

export default class Parser {
  #tokens: Token[] = [];

  #not_eof(): boolean {
    return this.#tokens[0].type !== TokenType.EOF;
  }

  #at() {
    return this.#tokens[0];
  }

  #eat() {
    return this.#tokens.shift();
  }

  #expect(type: TokenType, err: string) {
    // const prev = this.#tokens.shift();

    const prev = this.#eat();
    if (!prev || prev.type !== type) {
      console.error("Parser Error:\n", err, prev, " - Expecting:", type);
      exit(0);
    }
    return prev;
  }

  produceAST(sourceCode: string): Program {
    this.#tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.#not_eof()) {
      program.body.push(this.#parse_stmt());
    }

    return program;
  }

  #parse_stmt(): Stmt {
    switch (this.#at().type) {
      case TokenType.Let:

      case TokenType.Const:
        return this.#parse_var_declaration();

      default:
        return this.#parse_expr();
    }
  }
  // LET IDENT;
  // (LET | CONST) IDENT EQUALS expr
  #parse_var_declaration(): Stmt {
    const isConstant = this.#eat().type === TokenType.Const;
    const identifier = this.#expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords"
    ).value;

    if (this.#at().type === TokenType.Semicolon) {
      this.#eat();
      if (isConstant) {
        throw "Must assign value to constant expression. No value provided";
      }
      return {
        kind: "VarDeclaration",
        constant: isConstant,
        identifier,
      } as VarDeclaration;
    }
    this.#expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration"
    );

    const declaration = {
      kind: "VarDeclaration",
      constant: isConstant,
      identifier,
      value: this.#parse_expr(),
    } as VarDeclaration;

    this.#expect(TokenType.Semicolon, "Expected semicolon after declaration");
    return declaration;
  }

  #parse_expr(): Expr {
    return this.#parse_assignment_expr();
  }
  #parse_assignment_expr(): Expr {
    const left = this.#parse_object_expr();

    if (this.#at().type === TokenType.Equals) {
      this.#eat();
      const value = this.#parse_assignment_expr();
      return {
        value,
        assigne: left,
        kind: "AssignmentExpr",
      } as AssignmentExpr;
    }
    return left;
  }
  #parse_object_expr(): Expr {
    if (this.#at().type !== TokenType.OpenBrace) {
      return this.#parse_additive_expr();
    }
    this.#eat();
    const properties = new Array<Property>();

    while (this.#not_eof() && this.#at().type !== TokenType.CloseBrace) {
      const key = this.#expect(
        TokenType.Identifier,
        "Object literal key expected"
      ).value;

      if (this.#at().type === TokenType.Comma) {
        this.#eat();
        properties.push({
          kind: "Property",
          key,
        } as Property);
        continue;
      } else if (this.#at().type === TokenType.CloseBrace) {
        properties.push({ key, kind: "Property" });
        continue;
      }
      this.#expect(
        TokenType.Colon,
        "Missing colon following identifier in ObjectExpr"
      );
      const value = this.#parse_expr();

      properties.push({
        kind: "Property",
        key,
        value,
      });

      if (this.#at().type !== TokenType.CloseBrace) {
        this.#expect(
          TokenType.Comma,
          "Expected comma or closing bracket following Property"
        );
      }
    }

    this.#expect(TokenType.CloseBrace, "Object literal missing closing brace.");
    return {
      kind: "ObjectLiteral",
      properties,
    } as ObjectLiteral;
  }

  #parse_additive_expr(): Expr {
    let left = this.#parse_multiplicative_expr();

    while (this.#at().value === "+" || this.#at().value === "-") {
      const operator = this.#eat().value;
      const right = this.#parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        operator,
        left,
        right,
      } as BinaryExpr;
    }
    return left;
  }

  #parse_multiplicative_expr(): Expr {
    let left = this.#parse_primary_expr();

    while (
      this.#at().value === "/" ||
      this.#at().value === "*" ||
      this.#at().value === "%"
    ) {
      const operator = this.#eat().value;
      const right = this.#parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        operator,
        left,
        right,
      } as BinaryExpr;
    }
    return left;
  }
  // Order of Precedence
  // AssignmentExpr
  // MemberExpr
  // FunctionCall
  // LogicalExpr
  // ComparisonExpr
  // AdditiveExpr
  // MultiplicativeExpr
  // UnaryExpr
  // PrimaryExpr - we want to parse the primary expression last because it gives a higher order of precedence in the tree

  #parse_primary_expr(): Expr {
    const tk = this.#at().type;

    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.#eat().value } as Identifier;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.#eat().value),
        } as NumericLiteral;

      case TokenType.OpenParen: {
        this.#eat(); // eat the opening paren
        const value = this.#parse_expr();
        this.#expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesis expression. Expected closing parenthesis."
        );
        return value;
      }

      default:
        console.error("Unexpected token: ", this.#at());
        // console.log(`Unexpected token: ${this.#at()} `);
        exit(0);
      // throw new Error(`Unexpected token: ${this.#at()}`);
    }
  }
}
