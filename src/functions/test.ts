import { Request, Response } from "express";
// import { erpLogin } from "../controllers/erpnext";
// import { storage } from "../utilities/storage";
import { erpGetitemById } from "../controllers/erpnext/item";

export const testFunction = async (req: Request, res: Response) => {
  // console.log("order data => ", req.body);
  res.send("Hello World, from erp-to-woocomerce-adapter");
  // logger.info("tryryry", "tututuyt")
  // const variable = storage.getItem('asd')
  // console.log(variable)
  // const cookieId = await erpLogin();
  // logger.info("cookieId", cookieId);
  const data = await erpGetitemById('item-005')
  console.log(data)
  // await addTagToOrder("SAL-ORD-2022-00005", "Subscription", cookieId);
};