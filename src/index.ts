import { readFileSync } from "fs";
import { tokenize } from "./lexer.js";

const source = readFileSync("src/test.txt", "utf-8");

for (const token of tokenize(source)) {
  console.log(token);
}
