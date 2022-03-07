import axios from "axios"

const {ERP_URL} = process.env

const SUBSCRIPTION_URL = `${ERP_URL}/api/resource/Subscription`

export const erpCreateSubscription = async(
  itemData: any, cookieId: string
) => {
  const startDate = itemData.transactionDate
  const startMonth = 
    startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 :  '0' + (startDate.getMonth() + 1)
  const startDateNumber =
    startDate.getDate() > 9 ? startDate.getDate() + 1 :  '0' + startDate.getDate()
  const startDateString = 
  `${startDate.getFullYear()}-${startMonth}-${startDateNumber}`
  const endDate = new Date(itemData.date_created)
  endDate.setMonth(endDate.getMonth()+ parseInt(itemData.subscriptionLength))
  const endMonth = 
    endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 :  '0' + (endDate.getMonth() + 1)
  const endDateNumber =
    endDate.getDate() > 9 ? endDate.getDate() + 1 :  '0' + endDate.getDate()
  const endDateString = 
    `${endDate.getFullYear()}-${endMonth}-${endDateNumber}`
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
    generate_invoice_at_period_start: 0,
    submit_invoice: 0,
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
    return resp.data.data
  } catch (error) {
    console.log(error)
  }
}

export const erpAddInvoiceToSub = async(
  subid: string, invoiceId: string, cookieId: string
)=>{
  const data = {
    doctype: "Subscription",
    invoices: [
      {
        document_type: "Sales Invoice",
        invoice: invoiceId,
      }
    ]
  }
  try {
    const resp = await axios({
      method: 'PUT',
      url: `${SUBSCRIPTION_URL}/${subid}`,
      data,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    return resp.data.data
  } catch (error) {
    console.log(error)
  }
}

