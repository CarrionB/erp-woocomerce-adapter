import { Request, Response } from "express";
import { erpSetWoocomerceId } from "../controllers/erpnext/item";
import { WooCommerceApi } from "../controllers/woocomerce";
import { categories, ERP_URL } from "./constants";
import logger from "../utilities/logger";

export const createWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const body: AddItemRequestBody = JSON.parse(bodyPlainText);
  // const bodyFromreq = JSON.parse(bodyPlainText);
  // console.log('bodyFromreq', bodyFromreq)
  // const body = {
  //   item_name: 'TEST001',
  //   item_group: 'Beans',
  //   image: '',
  //   item_code: 'TEST001',
  //   opening_stock: 0,
  //   valuation_rate: 0
  // };
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

  try {
    res.status(200).send()
    const respW = await WooCommerceApi.post("products", dataToSend);
    logger.info("Woo added product -> ", respW.data.id);
    const { id } = respW.data;
    const respUpdateItemERP = await erpSetWoocomerceId(body.item_code, id);
    logger.info("Updated item erp  -> ", respUpdateItemERP);
    // await new Promise((r)=>setTimeout(r, 4000))
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
