import { ACCENTS_CODES, ACCENTS_COMBINATOR, ACCENTS_MAP } from "../consts";
import { Accents } from "../enums";

export const getAccentCode = (
  code: string,
  shiftKey: boolean,
): Accents | string | null => {
  if (shiftKey && code === Accents.QUOTE) return Accents.DIAERESIS;
  if (shiftKey && code === Accents.BRACKET_LEFT) return Accents.CARET;
  return ACCENTS_CODES.includes(code) ? code : null;
};

export const normalizeAccents = (
  character: string,
): { character: string; accent: string } => ({
  character: ACCENTS_MAP[character] ? ACCENTS_MAP[character].base : character,
  accent: ACCENTS_MAP[character] ? ACCENTS_MAP[character].accent : "",
});

export const processAccents = (
  text: string,
): { character: string; accent: string }[] => {
  if (!text) return [];
  return text.split("").map((char) => normalizeAccents(char));
};

export const combineAccentAndChar = (
  accent: string,
  char: string,
): string | null => {
  if (ACCENTS_COMBINATOR[accent] && ACCENTS_COMBINATOR[accent][char]) {
    return ACCENTS_COMBINATOR[accent][char];
  }
  return null;
};
