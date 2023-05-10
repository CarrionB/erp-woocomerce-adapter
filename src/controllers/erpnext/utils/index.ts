import { storage } from "../../../utilities/storage";

export const isCookieInvalid = () => {
  const storedCookie = storage.getItem("cookieId");

  if (
    storedCookie === null ||
    storedCookie === undefined ||
    storedCookie === ""
  ) {
    return !Boolean(storedCookie);
  }

  const storedExpDateString = storage.getItem("expirationDateString");
  const expirationDate = new Date(storedExpDateString);
  const isExpired = new Date().getTime() > expirationDate.getTime();
  return isExpired;
};
