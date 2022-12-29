import { Request, Response } from "express";

import { erpGetStockStateRegistry } from "../controllers/erpnext/bin";
import { erpGetitemById } from "../controllers/erpnext/item";
import { WooCommerceApi } from "../controllers/woocomerce";
import logger from "../utilities/logger";

export const manageStock = async (req: Request, res: Response) => {
  try {
    const bodyPlainText = `{"items": [${
      Object.keys(req.body['{"items": '])[0]
    }]}`;
    const body = JSON.parse(bodyPlainText);
    const itemCodes = body.items.map((item) => item.item_code);
    const stockToUpdate = await Promise.all(
      itemCodes.map(async (itemCode) => {
        const quantity = await erpGetStockStateRegistry(itemCode);
        const { woocommerce_id } = await erpGetitemById(itemCode);
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
        const respW = await WooCommerceApi.put(`products/${woocommerce_id}`, data);
        logger.info(`Woocomerce response -> ${respW.data.id}`);
        logger.info(`quantity => ${respW.data.stock_quantity}`);
      })
    );
  } catch (error) {
    logger.error(error);
  }
  res.status(200).send({})
};
