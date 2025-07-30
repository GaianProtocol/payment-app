import BigNumber from "bignumber.js";
import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";

const decimalSeparator = ".";
const groupSeparator = ",";

function getDecimalSeparator() {
  return decimalSeparator;
}

export function getGroupSeparator() {
  return groupSeparator;
}

const removeTrailingZeroes = (amountString: string) => {
  let formattedString = amountString;
  while (
    formattedString.length > 0 &&
    ((formattedString.includes(getDecimalSeparator()) &&
      formattedString[formattedString.length - 1] === "0") ||
      formattedString[formattedString.length - 1] === getDecimalSeparator())
  ) {
    formattedString = formattedString.slice(0, formattedString.length - 1);
  }

  return formattedString;
};

const toFixed = ({
  number,
  decimals = 4,
}: {
  number: string | number;
  decimals: number;
}) => {
  const _number = Number(number);
  if (isNumber(_number) && !isNaN(_number)) {
    return removeTrailingZeroes(
      _number.toFixed(decimals).replace(".", getDecimalSeparator())
    );
  }
  return number;
};

const getDecimalsFromHumanAmount = (
  humanAmount: number,
  defaultDecimals: number
) => {
  let decimals;
  if (humanAmount > 10) {
    decimals = 2;
  } else if (humanAmount > 1) {
    decimals = 3;
  } else if (humanAmount > 1e-1) {
    decimals = 4;
  } else if (humanAmount > 1e-2) {
    decimals = 5;
  } else {
    decimals = Math.max(defaultDecimals, 6);
  }
  return decimals;
};

const amount = (number: number, decimals?: number) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };
    if (isNumber(number) && !isNaN(number)) {
      const _amount = new BigNumber(number).toNumber();
      const _decimals = getDecimalsFromHumanAmount(_amount, decimals || 0);
      return _amount
        ? removeTrailingZeroes(
          new BigNumber(_amount).toFormat(
            _decimals,
            BigNumber.ROUND_DOWN,
            fmt
          )
        )
        : 0;
    }
    return number;
  } catch (e) {
    return number;
  }
};
export const secondsToDHMS = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: s,
  };
};

export default {
  toFixed,
  amount,
};
