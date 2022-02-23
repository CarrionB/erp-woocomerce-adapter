import { AxiosStatic } from "axios"

const SUBSCRIPTION_PLAN_URL = "https://erp.initgrammers.com/api/resource/Subscription Plan"

export const testSubscriptionPlanExistance = async (
  axios: AxiosStatic, 
  subscriptionName: string, 
  cookieId: string) => 
{
try {
  const resp = await axios({
    method: 'GET',
    url: `${SUBSCRIPTION_PLAN_URL}/${subscriptionName}`,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data
} catch (error) {
  console.log(error.response.status)
  return false
}
}

export const erpCreateSubscriptionPlan = async(
axios: AxiosStatic, itemData: any, cookieId: string
) => {
const totalPeriodCost = parseFloat(itemData.subtotal) + parseFloat(itemData.shipping_total)
const data = {
  name: itemData.name,
  docstatus: 0,
  plan_name: itemData.name,
  item: itemData.itemId,
  price_determination: "Monthly Rate",
  cost: totalPeriodCost.toFixed(2),
  billing_interval: "Month",
  billing_interval_count: 1
}
console.log("subcription plan => ", data)
try {
  const resp = await axios({
    method: 'POST',
    url: `${SUBSCRIPTION_PLAN_URL}`,
    data,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  console.log(resp.data)
} catch (error) {
  console.log(error)
}
}