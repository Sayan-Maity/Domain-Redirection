export function shortenString(str) {
  if (str.length <= 8) {
    return str;
  }
  return str.slice(0, 6) + '...' + str.slice(-4);
}