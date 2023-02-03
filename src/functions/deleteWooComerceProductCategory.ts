import { Request, Response } from "express";
import { WooCommerceApi } from "../controllers/woocomerce";
import { ProductCategooryWoo } from "../types/productCategory";
import logger from "../utilities/logger";

export const deleteWooComerceProductCategory = async (
  req: Request,
  res: Response
) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: DeleteProductCategoryBody = JSON.parse(bodyPlainText);
  const name = body.item_group_name;
  try {
    res.status(200).send({});
    const { data }: { data: ProductCategooryWoo[] } = await WooCommerceApi.get(
      `products/categories`
    );
    const categories = data.map((cat) => ({ id: cat.id, name: cat.name }));
    const categoryFound = categories.find((cat) => cat.name === name);
    const respW = await WooCommerceApi.delete(
      `products/categories/${categoryFound.id}`,
      { force: true }
    );
    logger.info(`Woo deleted category -> ${respW.data.id}`);
  } catch (error) {
    logger.error(error);
  }
};

type DeleteProductCategoryBody = {
  item_group_name: string;
};
