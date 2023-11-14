import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });

export const getInput = async () => {
  const result = await rl.question('> ');
  return result;
};
