import { exit } from "node:process";
import {
  BinaryExpr,
  Expr,
  Identifier,
  NullLiteral,
  NumericLiteral,
  Program,
  Stmt,
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
    return this.#parse_expr();
  }

  #parse_expr(): Expr {
    return this.#parse_additive_expr();
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

      case TokenType.Null:
        this.#eat();
        return { kind: "NullLiteral", value: "null" } as NullLiteral;

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
