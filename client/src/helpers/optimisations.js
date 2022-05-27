import { differenceInCalendarDays, format, formatISO, startOfToday } from "date-fns";
import skLocale from "date-fns/locale/sk";

export const debounce = (callback, wait = 500, immediate) => {
  let timeout;

  return (...args) => {
    const context = this;

    const execute = () => {
      timeout = null;
      if (!immediate) callback.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(execute, wait);

    if (callNow) callback.apply(context, args);
  };
};

export const wrapInt = (int, max) => {
  const r = int % max;
  return r < 0 ? r + max : r;
};

export const toDateOnlyFormat = (dateString) => {
  return formatISO(new Date(dateString), { representation: "date" });
};

export const dateToReadableString = (date) => {
  const daysDiff = differenceInCalendarDays(date, startOfToday());
  const absDiff = Math.abs(daysDiff);

  if (absDiff === 0) return "Dnes";
  else if (absDiff === 1) return daysDiff > 0 ? "Zajtra" : "Včera";
  else return format(date, "d. MMM RR", { locale: skLocale });
};

/**
 * A very cheap and unsafe check if the color is supported by the CSS or not.
 * @param {*} color
 */
export const isCSSColor = (color) => {
  const reg = /^(#|rgb|rgba|hsl)/i;
  return reg.test(color);
};
