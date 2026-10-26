import { DateTime } from "luxon";
import { AdminPanelLocale } from "../models/locale";
import { APP_LOCALE } from "../config/config";

export const shortDate = (date: DateTime): string => {
  return date.toFormat("dd.MM.yyyy");
};

export const longDateTime = (date: DateTime): string => {
  return date.toFormat("dd.MM.yyyy HH:mm");
};

const locale = APP_LOCALE as AdminPanelLocale;
const numberFormatLocale =
  locale === AdminPanelLocale.NO ? "nb-NO" : locale === AdminPanelLocale.SV ? "sv-SE" : "en-US";

export const thousandize = (number: number | null | undefined) =>
  number !== null && number !== undefined
    ? Intl.NumberFormat(numberFormatLocale).format(number)
    : "-";

// Amounts are stored with two decimals (Donations.sum_confirmed is DECIMAL(16,2)).
// Accepts a partially typed amount, with "," or "." as decimal separator.
const amountInputPattern = /^\d*([.,]\d{0,2})?$/;

export const isValidAmountInput = (text: string) => amountInputPattern.test(text);

export const parseAmountInput = (text: string): number | undefined => {
  if (!isValidAmountInput(text)) return undefined;
  const value = parseFloat(text.replace(",", "."));
  return Number.isNaN(value) ? undefined : value;
};

export const amountToInput = (amount: number | undefined): string =>
  amount === undefined || Number.isNaN(amount) ? "" : String(Math.round(amount * 100) / 100);
