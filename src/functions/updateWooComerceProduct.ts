import { Request, Response } from "express";

import { WooCommerceApi } from "../controllers/woocomerce";
import { removeHTMLTags } from "../utilities";
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
    const dataToSend = {
      name: body.item_name,
      description: removeHTMLTags(body.description),
      regular_price: (body.standard_rate as Number).toFixed(2),
      images: images,
    };
    try {
      const respW = await WooCommerceApi.put(
        `products/${body.woocommerce_id}`,
        dataToSend
      );
      logger.info("Woocomerce updated product -> ");
      logger.info(respW.data.id);
    } catch (error) {
      logger.error(error);
    }
  }
  res.status(200).send({})
};