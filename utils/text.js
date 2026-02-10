export function Capitalize(text) {
  const capitalizedSentence = text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return capitalizedSentence
}
