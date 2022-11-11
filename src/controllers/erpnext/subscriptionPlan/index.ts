import axios from "axios";
import logger from "../../../utilities/logger";

const { ERP_URL } = process.env;

const SUBSCRIPTION_PLAN_URL = `${ERP_URL}/api/resource/Subscription Plan`;

export const testSubscriptionPlanExistance = async (
  subscriptionName: string,
  cookieId: string
) => {
  try {
    const resp = await axios({
      method: "GET",
      url: `${SUBSCRIPTION_PLAN_URL}/${subscriptionName}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookieId,
      },
    });
    return resp.data;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const erpCreateSubscriptionPlan = async (
  itemData: any,
  cookieId: string
) => {
  const totalPeriodCost =
    parseFloat(itemData.total) + parseFloat(itemData.shipping_total);
  const data = {
    name: itemData.name,
    docstatus: 0,
    plan_name: itemData.name,
    item: itemData.itemId,
    price_determination: "Monthly Rate",
    cost: totalPeriodCost.toFixed(2),
    billing_interval: "Month",
    billing_interval_count: 1,
  };
  logger.info("subcription plan => ", data);
  try {
    const resp = await axios({
      method: "POST",
      url: `${SUBSCRIPTION_PLAN_URL}`,
      data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookieId,
      },
    });
    logger.info('Subscription plan')
    logger.info(resp.data);
  } catch (error) {
    logger.error(error);
  }
};
