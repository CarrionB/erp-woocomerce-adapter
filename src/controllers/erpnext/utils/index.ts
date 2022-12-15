import { storage } from "../../../utilities/storage";

export const isCookieInvalid = () => {
  const storedCookie = storage.getItem("cookieId");
  const storedExpDateString = storage.getItem("expirationDateString");
  const expirationDate = new Date(storedExpDateString);
  const isExpired = new Date().getTime() > expirationDate.getTime();
  
  if (!storedCookie) {
    return isExpired;
  }

  return isExpired;
};
