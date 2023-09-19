import { getInput } from './input.js';
import { Printer } from './Printer.js';

const pos = new Printer();

['첫번째 메시지 출력!!', '두번째 메시지 출력!!', '세번째 메시지 출력'].forEach(
  (each) => pos.add(each)
);
while (1) {
  const result = await getInput();
  pos.add(result);
}
