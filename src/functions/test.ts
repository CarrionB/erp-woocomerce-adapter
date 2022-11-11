import { Request, Response } from "express";

export const testFunction = async (req: Request, res: Response) => {
  // console.log("order data => ", req.body);
  res.send("Hello World, from erp-to-woocomerce-adapter");
  // logger.info("tryryry", "tututuyt")
  // const cookieId = await erpLogin();
  // logger.info("cookieId", cookieId);
  // await addTagToOrder("SAL-ORD-2022-00005", "Subscription", cookieId);
};