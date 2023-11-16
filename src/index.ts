import { readFileSync } from "node:fs";
import { exit } from "node:process";
import * as readline from "node:readline/promises";
import Parser from "./frontend/parser.js";
import { createGlobalEnv } from "./runtime/environment.js";
import { evaluate } from "./runtime/interpreter.js";

// repl();

run("src/test.txt");

async function repl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const parser = new Parser();
  const env = createGlobalEnv();

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

function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = readFileSync(filename, { encoding: "utf8" });
  const program = parser.produceAST(input);
  const result = evaluate(program, env);
  console.log(result);
}

// for (const token of tokenize(source)) {
//   console.log(token);
// }
