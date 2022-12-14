export const maskedPhone = (value) => {
  const mask = "+X (XXX) XXX-XX-XXXX".split("");

  const numbers = value.replace(/\D/g, "").split("");
  const isValid = numbers.length >= 6;

  let result = "";
  for (let i = 0; i < mask.length; i++) {
    if (numbers.length == 0) break;
    const char = mask[i];
    if ([" ", "(", ")", "+", "-"].includes(char)) {
      if (numbers.length) result += char;
      else break;
      continue;
    }

    result += numbers.shift();
  }

  return { value: result, isValid };
};
