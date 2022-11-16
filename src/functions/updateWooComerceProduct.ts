import { Request, Response } from "express";

import { WooCommerceApi } from "../controllers/woocomerce";
import logger from "../utilities/logger";
import { ERP_URL } from "./constants";

export const updateWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body = JSON.parse(bodyPlainText);
  if (body.woocommerce_id) {
    const images = [];
    if (body.image !== null && body.image !== "") {
      if ("/files/" === body.image.substring(0, 7)) {
        images.push({
          src: `${ERP_URL}${body.image}`,
        });
      } else {
        images.push({
          src: body.image,
        });
      }
    }
    const data = {
      name: body.item_name,
      regular_price: (body.standard_rate as Number).toFixed(2),
      images: images,
    };

    logger.info("data -> ", data);

    try {
      const respW = await WooCommerceApi.put(
        `products/${body.woocommerce_id}`,
        data
      );
      logger.info("updateWooComerceProduct");
      logger.info("Woocomerce response -> ");
      logger.info(respW);
    } catch (error) {
      logger.error(error);
    }
  }
  res.send("Ok");
};