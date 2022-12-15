import erpApi from "..";
import { SalesOrderWoo } from "../../../types/salesOrder";
import logger from "../../../utilities/logger";
import { erpCreateBillingAddress, erpCreateShippingAddress } from "../address";
import { erpCreateContact } from "../contact";

const CUSTOMER_URL = `/api/resource/Customer`;

export const erpSearchCustomer = async ({ billing }: SalesOrderWoo) => {
  const { email } = billing;
  try {
    const resp = await erpApi.get(
      `${CUSTOMER_URL}?filters=[["woocommerce_email","=","${email}"]]`
    );

    const { data } = resp.data;

    if (data.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    logger.error("error =>", error);
  }
};

export const erpCreateCustomer = async ({
  billing,
  shipping,
}: SalesOrderWoo) => {
  const { first_name, last_name, email } = billing;

  const userData = {
    woocommerce_email: email,
    customer_name: `${first_name} ${last_name}`,
    customer_type: "Individual",
    customer_group: "Guest",
    territory: "United States",
  };
  try {
    const { data } = await erpApi.post(`${CUSTOMER_URL}`, userData);
    if (data) {
      const respBilling = await erpCreateBillingAddress(billing);

      const respShipping = await erpCreateShippingAddress(shipping);

      const respContact = await erpCreateContact(billing);

      logger.info("Billing address -> ", respBilling);
      logger.info("Shipping address -> ", respShipping);
      logger.info("Contact address -> ", respContact);
    }
    return `Customer ${first_name} ${last_name} created`;
  } catch (error) {
    logger.error("status =>", error.response.status);
    logger.error("message =>", error.response.statusText);
    logger.error("url =>", error.response.config.url);
    logger.error("data sent =>", error.response.config.data);
    logger.error("error data =>", error.response.data);
  }
};
