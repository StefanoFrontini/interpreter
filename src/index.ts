import { exit } from "node:process";
import * as readline from "node:readline/promises";
import Parser from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const source = readFileSync("src/test.txt", "utf-8");

// for (const token of tokenize(source)) {
//   console.log(token);
// }
console.log("Repl v0.1");
while (true) {
  const input = await rl.question("> ");

  if (!input || input.includes("exit")) {
    rl.close();
    exit(0);
  }

  const parser = new Parser();

  const program = parser.produceAST(input);

  const result = evaluate(program);
  console.log(result);
  //   console.dir(program, { depth: null });
}
