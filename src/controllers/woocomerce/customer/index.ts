import { WooCommerce } from "..";
import logger from "../../../utilities/logger";

export const getCustomerB2BGroup = async ({ billing }: any) => {
  const { email } = billing;
  try {
    const { data } = await WooCommerce.get(`customers?email=${email}`);
    const { wcb2b_group } = data[0];
    logger.info(`wcb2b_group.name => ${wcb2b_group.name}`);
    return wcb2b_group.name;
  } catch (error) {
    logger.error(error);
  }
};
