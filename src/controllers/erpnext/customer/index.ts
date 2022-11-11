import axios from "axios";
import logger from "../../../utilities/logger";
import { erpCreateBillingAddress, erpCreateShippingAddress } from "../address";
import { erpCreateContact } from "../contact";

const { ERP_URL } = process.env;

const CUSTOMER_URL = `${ERP_URL}/api/resource/Customer`;

interface IShipping {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export const erpSearchCustomer = async (
  { billing, shipping }: any,
  cookieId: string
) => {
  const { email } = billing;
  try {
    const resp = await axios({
      method: "GET",
      url: `${CUSTOMER_URL}?filters=[["woocommerce_email","=","${email}"]]`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookieId,
      },
    });
    const { data } = resp.data;

    if (data.length === 0) {
      const respCustomer = await erpCreateCustomer(billing, shipping, cookieId);
      logger.info("Created customer => ", respCustomer);
    }
  } catch (error) {
    logger.error("error =>", error);
  }
};

const erpCreateCustomer = async (
  billing: any,
  shipping: IShipping,
  cookieId: string
) => {
  const {
    first_name,
    last_name,
    address_1,
    city,
    state,
    postcode,
    email,
    phone,
  } = billing;

  const userData = {
    woocommerce_email: email,
    customer_name: `${first_name} ${last_name}`,
    customer_type: "Individual",
    customer_group: "Guest",
    territory: "United States",
  };
  try {
    const resp = await axios({
      method: "POST",
      url: `${CUSTOMER_URL}`,
      data: userData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookieId,
      },
    });
    if (resp.data) {
      const respBilling = await erpCreateBillingAddress(
        first_name,
        last_name,
        email,
        address_1,
        city,
        state,
        postcode,
        cookieId
      );

      const respShipping = await erpCreateShippingAddress(
        shipping.first_name,
        shipping.last_name,
        shipping.address_1,
        shipping.city,
        shipping.state,
        shipping.postcode,
        cookieId
      );

      const respContact = await erpCreateContact(
        first_name,
        last_name,
        email,
        phone,
        cookieId
      );

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
