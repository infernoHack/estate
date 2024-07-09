export function capitalizeWord(word: string): string {
  return word.charAt(0).toUpperCase().concat(word.slice(1));
}

export function capitalizeAllWords(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ");
}

export function capitalizeSentence(sentence: string): string {
  // If the first word is whitespace
  let isWhiteSpace = false;

  return sentence
    .split(" ")
    .map((word, idx) => {
      if (idx === 0) {
        if (word.length === 0) isWhiteSpace = true;
        return capitalizeWord(word);
      } else if (idx === 1 && isWhiteSpace) {
        return capitalizeWord(word);
      } else {
        return word;
      }
    })
    .join(" ");
}

export function capitalizeParagraph(paragraph: string): string {
  return paragraph
    .split(".")
    .map((sentence) => capitalizeSentence(sentence))
    .join(".");
}
