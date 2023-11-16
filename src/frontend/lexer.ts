//------------------------------------------
//                            LEXER
// --- Responsible for producing tokens from source code
//------------------------------------------

// Represents tokens that our language understands in parsing.
export enum TokenType {
  // Literal Types
  Number,
  Identifier,

  // Keywords
  Let,
  Const,

  // Grouping + Operators
  BinaryOperator,
  Equals,
  Comma,
  Colon,
  Semicolon,
  OpenParen,
  CloseParen,
  OpenBrace, //
  CloseBrace,
  EOF, // end of file
}

// Constant lookup for keywords and known identifier + symbols.
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value: string, type: TokenType): Token {
  return {
    value,
    type,
  };
}

function isAlpha(src: string): boolean {
  return src.toUpperCase() !== src.toLowerCase();
}
function isSkippable(src: string): boolean {
  return src === " " || src === "\n" || src === "\t" || src === "\r";
}

function isInt(str: string): boolean {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
  const tokens: Token[] = [];
  const src = sourceCode.split("");

  while (src.length > 0) {
    if (src[0] === "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] === "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] === "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] === ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (
      src[0] === "+" ||
      src[0] === "-" ||
      src[0] === "*" ||
      src[0] === "/" ||
      src[0] === "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] === "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] === ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } else if (src[0] === ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (src[0] === ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else {
      // Handle multicharacter tokens
      if (isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isAlpha(src[0])) {
          ident += src.shift();
        }
        // check for reserved keyword
        const reserved = KEYWORDS[ident];
        if (typeof reserved === "number") {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift();
      } else {
        throw new Error(`Unrecognized character found in source: ${src[0]}`);
      }
    }
  }
  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}
