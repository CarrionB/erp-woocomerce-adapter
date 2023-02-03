import { Request, Response } from "express";
import { WooCommerceApi } from "../controllers/woocomerce";
import { ProductCategooryWoo } from "../types/productCategory";
import logger from "../utilities/logger";

export const createWoocomerceProductCategory = async (
  req: Request,
  res: Response
) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: CreateProductCategoryBody = JSON.parse(bodyPlainText);
  const dataToSend = {
    name: body.item_group_name,
  };
  res.status(200).send({});
  try {
    const { data }: { data: ProductCategooryWoo } = await WooCommerceApi.post(
      "products/categories",
      dataToSend
    );
    logger.info(`Woo created category -> ${data.id}`);
  } catch (error) {
    logger.error(error);
  }
};

type CreateProductCategoryBody = {
  item_group_name: string;
};
