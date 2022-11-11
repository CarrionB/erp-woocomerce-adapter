import { Request, Response } from "express";

import { erpLogin } from "../controllers/erpnext";
import { erpGetStockStateRegistry } from "../controllers/erpnext/bin";
import { erpGetitemById } from "../controllers/erpnext/item";
import { WooCommerce } from "../controllers/woocomerce";
import logger from "../utilities/logger";

export const manageStock = async (req: Request, res: Response) => {
  const bodyPlainText = `{"items": [${
    Object.keys(req.body['{"items": '])[0]
  }]}`;
  const body = JSON.parse(bodyPlainText);
  const itemCodes = body.items.map((item) => item.item_code);
  try {
    const cookieId = await erpLogin();
    const stockToUpdate = await Promise.all(
      itemCodes.map(async (itemCode) => {
        const quantity = await erpGetStockStateRegistry(itemCode, cookieId);
        const { woocommerce_id } = await erpGetitemById(itemCode, cookieId);
        return {
          woocommerce_id,
          quantity,
        };
      })
    );
    await Promise.all(
      stockToUpdate.map(async ({ woocommerce_id, quantity }) => {
        const data = {
          manage_stock: true,
          stock_quantity: quantity,
        };
        const respW = await WooCommerce.put(`products/${woocommerce_id}`, data);
        logger.info(`Woocomerce response -> ${respW.data.id}`);
        logger.info(`quantity => ${respW.data.stock_quantity}`);
      })
    );
  } catch (error) {
    logger.error(error);
  }
  res.status(200).send("Ok");
};
