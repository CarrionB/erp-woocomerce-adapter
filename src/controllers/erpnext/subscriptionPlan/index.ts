import erpApi from "..";
import { SalesOrderItemWoo } from "../../../types/salesOrder";
import logger from "../../../utilities/logger";
import { parseSubPlanData } from "./parse";

const SUBSCRIPTION_PLAN_URL = `/api/resource/Subscription Plan`;

export const testSubscriptionPlanExistance = async (
  subscriptionName: string
) => {
  try {
    const resp = await erpApi.get(
      `${SUBSCRIPTION_PLAN_URL}/${subscriptionName}`
    );
    return resp.data;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const erpCreateSubscriptionPlan = async (itemData: SubPlanInput) => {
  const {total, shipping_total} = itemData;
  const totalPeriodCost =
    parseFloat(total) + parseFloat(shipping_total);
  const data = parseSubPlanData(itemData, totalPeriodCost);
  logger.info("subcription plan => ", data);
  try {
    const resp = await erpApi.post(`${SUBSCRIPTION_PLAN_URL}`, data);
    logger.info("Subscription plan");
    logger.info(resp.data);
  } catch (error) {
    logger.error(error);
  }
};

export interface SubPlanInput extends Partial<SalesOrderItemWoo> {
  shipping_total: string;
  itemId: string;
}
