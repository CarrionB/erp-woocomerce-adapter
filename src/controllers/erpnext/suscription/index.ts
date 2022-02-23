import { AxiosStatic } from "axios"

const SUBSCRIPTION_URL = "https://erp.initgrammers.com/api/resource/Subscription"

export const erpCreateSubscription = async(
  axios: AxiosStatic, itemData: any, cookieId: string
) => {
  const startDate = itemData.transactionDate
  const startMonth = 
    startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 :  '0' + (startDate.getMonth() + 1)
  const startDateString = 
  `${startDate.getFullYear()}-${startMonth}-${startDate.getDate()}`
  const endDate = new Date(itemData.date_created)
  endDate.setMonth(endDate.getMonth()+ parseInt(itemData.subscriptionLength))
  const endMonth = 
    endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 :  '0' + (endDate.getMonth() + 1)
  const endDateString = 
    `${endDate.getFullYear()}-${endMonth}-${endDate.getDate()}`
  const data = {
    docstatus: 0,
    party_type: "Customer",
    party: `${itemData.first_name} ${itemData.last_name}`,
    company: "Aroma of Italy",
    status: "Active",
    start_date: startDateString,
    end_date: endDateString,
    follow_calendar_months: 1,
    generate_new_invoices_past_due_date: 0,
    days_until_due: 0,
    cancel_at_period_end: 1,
    generate_invoice_at_period_start: 1,
    submit_invoice: 1,
    plans: [
      {
        parentfield: "plans",
        parenttype: "Subscription",
        plan: itemData.name,
        qty: itemData.quantity
      }
    ]
  }
  console.log("subcription data => ", data)
  try {
    const resp = await axios({
      method: 'POST',
      url: `${SUBSCRIPTION_URL}`,
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