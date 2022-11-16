export const round2Decimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
