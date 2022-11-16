import { Request, Response } from "express";
import { erpLogin } from "../controllers/erpnext";
import { erpSetWoocomerceId } from "../controllers/erpnext/item";
import { WooCommerceApi } from "../controllers/woocomerce";
import { categories, ERP_URL } from "./constants";
import logger from "../utilities/logger";

export const createWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body = JSON.parse(bodyPlainText);
  // console.log(body);
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
  categoriesAux.push({ id: categories[body.item_group] });
  const data = {
    name: body.item_name,
    type: "simple",
    status: "draft",
    manage_stock: true,
    stock_quantity: body.opening_stock,
    regular_price: (body.valuation_rate as Number).toFixed(2),
    categories: categoriesAux,
    images: images,
  };
  logger.info("data -> ", data);

  try {
    const respW = await WooCommerceApi.post("products", data);
    logger.info("Woocomerceresponde -> ", respW.data);
    const { id } = respW.data;
    const cookieId = await erpLogin();
    if (cookieId) {
      const respUpdateItemERP = await erpSetWoocomerceId(
        body.item_code,
        id,
      );
      logger.info("resp update item erp  -> ", respUpdateItemERP);
    }
  } catch (error) {
    logger.error(error);
  }
  res.send("Ok");
};