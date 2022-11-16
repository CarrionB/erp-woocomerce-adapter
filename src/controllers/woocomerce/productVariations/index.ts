import { WooCommerceApi } from "..";
import { ProductVariation } from "../../../types/product";
import logger from "../../../utilities/logger";

export const listVariationById = async (productId: number) => {
  try {
    const resp: GetVariationListResponse = await WooCommerceApi.get(
      `products/${productId}/variations`
    );
    return resp.data;
  } catch (error) {
    logger.error(error);
  }
};

export const getVariationById = async (
  productId: number,
  variationId: number
) => {
  try {
    const resp: GetVariationResponse = await WooCommerceApi.get(
      `products/${productId}/variations/${variationId}`
    );

    const data = {
      subscriptionPeriod: "",
      subscriptionLength: 0,
      subscriptionInterval: 0,
    };

    logger.info("cvariation data => ", resp.data);

    const values = resp.data.meta_data.filter((item) => {
      if (item.key === "_subscription_period") {
        return item;
      }
      if (item.key === "_subscription_period_interval") {
        return item;
      }
      if (item.key === "_subscription_length") {
        return item;
      }
    });

    data.subscriptionPeriod = values[0].value;
    data.subscriptionInterval = parseInt(values[1].value);
    data.subscriptionLength = parseInt(values[2].value);

    return data;
  } catch (error) {
    logger.error(error);
  }
};

type GetVariationListResponse = {
  data: ProductVariation[];
};

type GetVariationResponse = {
  data: ProductVariation;
};
