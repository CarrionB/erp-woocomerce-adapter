import { Request, Response } from "express";
import { WooCommerceApi } from "../controllers/woocomerce";
import { ProductWoo } from "../types/product";
import logger from "../utilities/logger";

export const deleteWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: DeleteItemRequestBody = JSON.parse(bodyPlainText);

  try {
    res.status(200).send({});
    const { data }: { data: ProductWoo } = await WooCommerceApi.delete(
      `products/${body.woocommerce_id}`,
      { force: true }
    );
    logger.info(`Woo deleted product -> ${data.id}`);
  } catch (error) {
    logger.error(error);
  }
};

type DeleteItemRequestBody = {
  woocommerce_id: number;
};
