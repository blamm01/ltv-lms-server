import { TextConstant } from 'src/constants/text.constant';

export function getText(code: keyof typeof TextConstant) {
  return TextConstant[code];
}
