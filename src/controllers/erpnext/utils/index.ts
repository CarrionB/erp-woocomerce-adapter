import { storage } from "../../../utilities/storage";

export const isCookieInvalid = () => {
  const storedCookie = storage.getItem("cookieId");
  const storedExpDateString = storage.getItem("expirationDateString");
  const expirationDate = new Date(storedExpDateString);
  if (!storedCookie) {
    return true;
  }

  const isExpired = new Date().getTime() > expirationDate.getTime();

  return isExpired;
};
