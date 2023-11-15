import { exit } from "node:process";
import * as readline from "node:readline/promises";
import Parser from "./frontend/parser.js";
import Environment from "./runtime/environment.js";
import { evaluate } from "./runtime/interpreter.js";
import { MK_BOOL, MK_NULL, MK_NUMBER } from "./runtime/values.js";

repl();

async function repl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const parser = new Parser();
  const env = new Environment();
  env.declareVar("x", MK_NUMBER(100));
  env.declareVar("true", MK_BOOL(true));
  env.declareVar("false", MK_BOOL(false));
  env.declareVar("null", MK_NULL());

  console.log("Repl v0.1");

  while (true) {
    try {
      const input = await rl.question("> ");

      if (!input || input.includes("exit")) {
        rl.close();
        exit(0);
      }

      const program = parser.produceAST(input);

      const result = evaluate(program, env);
      console.log(result);
      //   console.dir(program, { depth: null });
    } catch (error) {
      if (error instanceof ReferenceError) {
        throw new ReferenceError(error.message);
      }
      throw new Error(error);
    }
  }
}

// const source = readFileSync("src/test.txt", "utf-8");

// for (const token of tokenize(source)) {
//   console.log(token);
// }
