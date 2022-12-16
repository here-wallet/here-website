export const validatePhone = (phone: string) => {
  const p = formatPhone(phone);
  return !isNaN(+p) && p.length > 6;
};

export const formatPhone = (phone: string) => {
  if (phone === "+") return "";
  return phone.replaceAll(/[\-\(\) \+]/g, "");
};

export const formatAmount = (amt: string) => {
  const [a = "0", b = ""] = amt.replaceAll(",", ".").split(".");
  if (amt.includes(".")) {
    return a.replaceAll(/\D/g, "") + "." + b.replaceAll(/\D/g, "");
  }

  return a.replaceAll(/\D/g, "");
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
