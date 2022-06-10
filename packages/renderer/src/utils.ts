export const AVAILABLE_NOMIALS = [5, 10, 20, 50, 100];
export const formatCentsText = (cents: number | string, convertToDollar = true) => {
  if (Number.isNaN(+cents)) return 'INVALID';
  if (cents >= 100 && convertToDollar) return `$${(+cents / 100).toFixed(2)}`;
  return `${cents}C`;
};
