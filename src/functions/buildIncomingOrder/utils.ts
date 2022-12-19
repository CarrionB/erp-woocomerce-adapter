import { Request } from "express";
import { format } from "date-fns";
import { SalesOrderWoo } from "../../types/salesOrder";

export const isObjectEmpty = (obj: Object) => {
  const sameBasePrototype = Object.getPrototypeOf(obj) === Object.prototype;
  const noKeys = Object.keys(obj).length === 0;
  return noKeys && sameBasePrototype;
};

export const formatDateString = (date: string) => {
  const _date = new Date(date);
  return format(_date, "yyyy-MM-dd");
};

export const testIfIntegrationRequest = (req: Request<SalesOrderWoo>) => {
  const legnthTwelve = req.headers["content-length"] === "12";
  const isIpWoocomerce = req.headers["x-forwarded-for"] === "161.35.117.37";
  return legnthTwelve && isIpWoocomerce;
};
