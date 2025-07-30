import JSBI from "jsbi";

export function fromReadableAmount(amount: number, decimals: number): JSBI {
  const extraDigits = Math.pow(10, countDecimals(amount));

  const adjustedAmount = amount * extraDigits;

  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

export function toReadableAmount(
  rawAmount: number | string,
  decimals: number
): string {
  const bigIntRawAmount = JSBI.BigInt(rawAmount);
  const divisor = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals));

  return JSBI.divide(bigIntRawAmount, divisor).toString();
}

function countDecimals(x: number): number {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}
