import { Request, Response } from "express";
import { WooCommerceApi } from "../controllers/woocomerce";
import logger from "../utilities/logger";

export const deleteWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: DeleteItemRequestBody = JSON.parse(bodyPlainText);

  try {
    res.status(200).send({});
    const respW = await WooCommerceApi.delete(
      `products/${body.woocommerce_id}`,
      { force: true }
    );
    console.log('respW =>', respW)
    logger.info("Woo deleted product -> ", respW.data.id);
  } catch (error) {
    logger.error(error);
  }
};

type DeleteItemRequestBody = {
  woocommerce_id: number;
};
