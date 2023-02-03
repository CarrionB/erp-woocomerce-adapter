import { Request, Response } from "express";
import { erpSetWoocomerceId } from "../controllers/erpnext/item";
import { WooCommerceApi } from "../controllers/woocomerce";
import { ERP_URL } from "./constants";
import logger from "../utilities/logger";
import { ProductCategooryWoo } from "../types/productCategory";
import { ProductWoo } from "../types/product";

export const createWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: AddItemRequestBody = JSON.parse(bodyPlainText);
  const categoriesAux = [];
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
  const { data: categories }: { data: ProductCategooryWoo[] } =
    await WooCommerceApi.get(`products/categories`);

  try {
    res.status(200).send({});
    const categoryFound = categories.find(
      (cat) => cat.name === body.item_group
    );

    categoriesAux.push({ id: categoryFound.id });
    const dataToSend = {
      name: body.item_name,
      type: "simple",
      status: "draft",
      manage_stock: true,
      stock_quantity: body.opening_stock,
      regular_price: body.valuation_rate.toFixed(2),
      categories: categoriesAux,
      images: images,
    };
    logger.info("dataToSend -> ", dataToSend);

    const { data }: { data: ProductWoo } = await WooCommerceApi.post(
      "products",
      dataToSend
    );
    logger.info(`Woo added product -> ${data.id}`);
    const { id } = data;
    const respUpdateItemERP = await erpSetWoocomerceId(body.item_code, id);
    logger.info(`Updated item erp -> ${respUpdateItemERP}`);
  } catch (error) {
    logger.error(error);
  }
};

type AddItemRequestBody = {
  item_name: string;
  item_group: string;
  image: string | null;
  item_code: string;
  opening_stock: number;
  valuation_rate: number;
};
