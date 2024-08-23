export function shortenString(str) {
  if (str.length <= 8) {  // If the string is very short, return it as is
    return str;
  }
  return str.slice(0, 6) + '...' + str.slice(-4);
}