import { Request, Response } from "express";

export const testFunction = async (req: Request, res: Response) => {
  res.send("Hello World, from erp-to-woocomerce-adapter");
};
