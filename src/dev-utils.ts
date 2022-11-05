import chalk from "chalk";
import fs from "fs";
import { Log } from "./utils";

export function LogError(error: string) {
  Log.error(chalk.red(error));
  throw new Error(error);
}

export function writeToFile(fileName: string, content: string) {
  fs.writeFileSync(fileName, content);
  Log.write("wrote to file: " + fileName);
}
export const isDev = () => process.env.NODE_ENV === "dev";
