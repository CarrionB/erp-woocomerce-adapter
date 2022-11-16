import { SubPlanInput } from ".";
import { SubscriptionPlan } from "../../../types/subscription";
import { round2Decimals } from "./utils";

export const parseSubPlanData = (
  input: SubPlanInput,
  total: number
): Partial<SubscriptionPlan> => {
  const { name, itemId } = input;
  return {
    name: name,
    docstatus: 0,
    plan_name: name,
    item: itemId,
    price_determination: "Monthly Rate",
    cost: round2Decimals(total),
    billing_interval: "Month",
    billing_interval_count: 1,
  };
};
