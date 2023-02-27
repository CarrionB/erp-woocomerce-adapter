import { Request, Response } from "express";

import { WooCommerceApi } from "../controllers/woocomerce";
import { ProductCategooryWoo } from "../types/productCategory";
import { removeHTMLTags } from "../utilities";
import logger from "../utilities/logger";
import { ERP_URL } from "./constants";

export const updateWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const {
    image,
    item_name,
    item_group,
    description,
    standard_rate,
    woocommerce_id,
  }: UpdatedItemRequestBody = JSON.parse(bodyPlainText);
  if (woocommerce_id) {
    const images = [];
    const categoriesAux = [];

    if (image !== null && image !== "") {
      if ("/files/" === image.substring(0, 7)) {
        images.push({
          src: `${ERP_URL}${image}`,
        });
      } else {
        images.push({
          src: image,
        });
      }
    }
    const { data: categories }: { data: ProductCategooryWoo[] } =
      await WooCommerceApi.get(`products/categories`);

    res.status(200).send({});

    try {
      console.log("categories =>", categories);
      const categoryFound = categories.find((cat) => cat.name === item_group);
      categoriesAux.push({ id: categoryFound.id });
      const dataToSend = {
        name: item_name,
        description: removeHTMLTags(description),
        regular_price: standard_rate.toFixed(2),
        images: images,
        categories: categoriesAux,
      };
      const { data } = await WooCommerceApi.put(
        `products/${woocommerce_id}`,
        dataToSend
      );
      logger.info(`Woocomerce updated -> ${data.id}`);
    } catch (error) {
      logger.error(error);
    }
  }
};

type UpdatedItemRequestBody = {
  woocommerce_id: string;
  description: string;
  item_group: string;
  item_name: string;
  image: string;
  standard_rate: number;
};
