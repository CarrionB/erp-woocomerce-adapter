import { Request, Response } from "express";
import { erpSetWoocomerceId } from "../controllers/erpnext/item";
import { WooCommerceApi } from "../controllers/woocomerce";
import { ERP_URL } from "./constants";
import logger from "../utilities/logger";
import { ProductCategooryWoo } from "../types/productCategory";
import { ProductWoo } from "../types/product";

export const createWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0];
  const {
    item_code,
    item_name,
    item_group,
    opening_stock,
    standard_rate,
    image,
  }: AddItemRequestBody = JSON.parse(bodyPlainText);
  const isSubscription = item_group === "Subscription";
  const categoriesAux = [];
  const images = [];
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

  try {
    res.status(200).send({});
    const categoryFound = categories.find((cat) => cat.name === item_group);

    categoriesAux.push({ id: categoryFound.id });
    const dataToSend = isSubscription
      ? {
          name: item_name,
          type: "variable-subscription",
          status: "draft",
          manage_stock: true,
          stock_quantity: opening_stock,
          regular_price: standard_rate.toFixed(2),
          categories: categoriesAux,
          images: images,
          attributes: [
            {
              name: "Choose subscription type",
              visible: true,
              variation: true,
              options: [
                "[Auto-delivery] 1/mo - 15%",
                "[Auto-delivery] 2/mo - 10%",
                "[Auto-delivery] 3/mo - 5%",
              ],
            },
          ],
        }
      : {
          name: item_name,
          type: "simple",
          status: "draft",
          manage_stock: true,
          stock_quantity: opening_stock,
          regular_price: standard_rate.toFixed(2),
          categories: categoriesAux,
          images: images,
          weight: "2.2",
        };
    logger.info("dataToSend -> ", dataToSend);

    const { data }: { data: ProductWoo } = await WooCommerceApi.post(
      "products",
      dataToSend
    );
    logger.info(`Woo added product -> ${data.id}`);
    const { id } = data;
    const respUpdateItemERP = await erpSetWoocomerceId(item_code, id);
    logger.info(`Updated item erp -> ${respUpdateItemERP}`);
    if (isSubscription) {
      addVariations(id, standard_rate);
    }
  } catch (error) {
    logger.error(error);
  }
};

const addVariations = async (id: number, valuation_rate: number) => {
  const options = [
    {
      discount: 0.85,
      option: "[Auto-delivery] 1/mo - 15%",
    },
    {
      discount: 0.9,
      option: "[Auto-delivery] 2/mo - 10%",
    },
    {
      discount: 0.95,
      option: "[Auto-delivery] 3/mo - 5%",
    },
  ];
  let menuPosition = 1;
  for (const { option, discount } of options) {
    const dataVariation = {
      regular_price: (valuation_rate * discount).toFixed(2),
      menu_order: menuPosition,
      attributes: [
        {
          id: 0,
          name: "Choose subscription type",
          option,
        },
      ],
      weight: "2.2",
      meta_data: [
        {
          "key": "_subscription_period",
          "value": "month",
        },
        {
          "key": "_subscription_period_interval",
          "value": `${menuPosition}`
        },
        {
          "key": "_subscription_length",
          "value": "0"
        },
        {
          "key": "_subscription_trial_period",
          "value": "month"
        },
        {
          "key": "wcb2b_barcode",
          "value": ""
        },
        {
          "key": "wcb2b_product_group_hide_prices",
          "value": []
        },
        {
          "key": "wcb2b_product_group_hide_stocks",
          "value": []
        },
        {
          "key": "wcb2b_product_group_prices",
          "value": {
            "654": {
              "regular_price": "",
              "sale_price": ""
            },
            "686": {
              "regular_price": "",
              "sale_price": ""
            },
            "1200": {
              "regular_price": "",
              "sale_price": ""
            },
            "1816": {
              "regular_price": "",
              "sale_price": ""
            }
          }
        },
        {
          "key": "wcb2b_product_group_tier_prices",
          "value": ""
        },
        {
          "key": "_subscription_sign_up_fee",
          "value": "0"
        },
        {
          "key": "_subscription_price",
          "value": (valuation_rate * discount).toFixed(2)
        },
        {
          "key": "_subscription_trial_length",
          "value": "0"
        },
        {
          "key": "_subscription_payment_sync_date",
          "value": "0"
        },
      ],
    };

    const { data: variation } = await WooCommerceApi.post(
      `products/${id}/variations`,
      dataVariation
    );

    logger.info(`variation => ${variation.id}`);

    menuPosition++;
  }
};

type AddItemRequestBody = {
  item_name: string;
  item_group: string;
  image: string | null;
  item_code: string;
  opening_stock: number;
  standard_rate: number;
};
