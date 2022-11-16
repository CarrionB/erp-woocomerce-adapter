import erpApi from "..";
import { AddressWoo } from "../../../types/salesOrder";
import logger from "../../../utilities/logger";
import { parseContactData } from "./parse";

const CONTACT_URL = `/api/resource/Contact`;

export const erpCreateContact = async (billing: AddressWoo) => {
  const contactData = parseContactData(billing)
  try {
    const {data} = await erpApi.post(`${CONTACT_URL}`, contactData);
    return `Contact created with id: ${data.id}`;
  } catch (error) {
    logger.error(error);
  }
};
