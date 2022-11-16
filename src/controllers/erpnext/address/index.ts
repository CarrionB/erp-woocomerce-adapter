import erpApi from "..";
import { AddressWoo } from "../../../types/salesOrder";
import logger from "../../../utilities/logger";
import { parseBillingData, parseShippingData } from "./parse";

const ADDRESS_URL = `/api/resource/Address`;

export const erpCreateBillingAddress = async (billing: AddressWoo) => {
  const billingData = parseBillingData(billing);
  try {
    const { data: resp } = await erpApi.post(`${ADDRESS_URL}`, billingData);
    return `Billing  address created with id: ${resp}`;
  } catch (error) {
    logger.error(error);
  }
};

export const erpCreateShippingAddress = async (shipping: AddressWoo) => {
  const shippingData = parseShippingData(shipping);
  try {
    const { data: resp } = await erpApi.post(`${ADDRESS_URL}`, shippingData);
    return `Shipping address created with id: ${resp}`;
  } catch (error) {
    logger.error(error);
  }
};
