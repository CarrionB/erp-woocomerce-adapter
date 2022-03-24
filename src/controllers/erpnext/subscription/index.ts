import axios from "axios"
import { formatDateToString, isLastDayOfMonth } from "../../../utilities"

const {ERP_URL} = process.env

const SUBSCRIPTION_URL = `${ERP_URL}/api/resource/Subscription`

export const getSubscriptionById = async(
  subid: string, cookieId: string
)=>{
  const resp = await axios({
    method: 'GET',
    url: `${SUBSCRIPTION_URL}/${subid}`,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data.data
}

export const testSubscriptionExistance = async(
  body: any, 
  item: any, 
  subLength: number,
  subInterval: number,
  cookieId:string
) => {
  const {billing, date_created} = body
  const {first_name, last_name} = billing

  const startDate = new Date(date_created)
  const startDay = startDate.getDate()
  let dateAux = new Date(date_created)
  
  try {
    let searchTries = 0
    if(subLength > 0){
      while(searchTries != subLength){
        const startMonth = 
          dateAux.getMonth() + 1 > 9 ? dateAux.getMonth() + 1 : '0' + (dateAux.getMonth() + 1)
        const startDateNumber =
          dateAux.getDate() > 9 ? dateAux.getDate() + 1 : '0' + dateAux.getDate()
        const startDateString = 
          `${dateAux.getFullYear()}-${startMonth}-${startDateNumber}`
        const resp = await axios({
          method: 'GET',
          url: `${SUBSCRIPTION_URL}?filters=[["party","=","${first_name} ${last_name}"], ["start_date","=","${startDateString}"], ["Subscription+Plan+Detail","plan","=","${item.name}"]]`,
          headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Cookie': cookieId
          }
        })
        const {data} = resp.data
        if (data.length > 0) {
          return data[0].name
        }
        if(isLastDayOfMonth(startDate)){
          if(dateAux.getDate() === startDay || dateAux.getDate() < startDay){
            searchTries++
            dateAux.setDate(-1)
          }
          else
          {
            dateAux.setDate(dateAux.getDate() - 1)
          }
        }
        else{
          searchTries++
          dateAux.setMonth(dateAux.getMonth() - 1)
        }
      }
    }
    else
    {
      const resp = await axios({
        method: 'GET',
        url: `${SUBSCRIPTION_URL}?filters=[["party","=","${first_name} ${last_name}"], ["Subscription+Plan+Detail","plan","=","${item.name}"]]`,
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Cookie': cookieId
        }
      })
      const {data} = resp.data
      if (data.length > 0) {
        for (const subId of data) {
          const sub = await getSubscriptionById(subId.name, cookieId)
          const subDate = new Date(sub.start_date)
          const dateStringAux = formatDateToString(dateAux)
          dateAux = new Date(dateStringAux)
          if(subDate.getDate() === dateAux.getDate()){
            while(subDate.getTime() <= dateAux.getTime()){
              if(subDate.getMonth() === dateAux.getMonth()){
                return subId.name
              }
              if(isLastDayOfMonth(startDate)){
                if(dateAux.getDate() === startDay || dateAux.getDate() < startDay){
                  searchTries++
                  dateAux.setDate(-1)
                }
                else
                {
                  dateAux.setDate(dateAux.getDate() - subInterval)
                }
              }
              else{
                searchTries++
                dateAux.setMonth(dateAux.getMonth() - subInterval)
              }
            }
          }
        }
      }
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export const erpCreateSubscription = async(
  body: any, item: any, subscriptionLength: number, cookieId: string
) => {
  const {billing,  date_created} = body
  const {first_name, last_name} = billing
  const {name, quantity} = item
  const isNeverEnd = subscriptionLength === 0

  const startDate = new Date(date_created)
  const startMonth = 
    startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 :  '0' + (startDate.getMonth() + 1)
  const startDateNumber =
    startDate.getDate() > 9 ? startDate.getDate() + 1 :  '0' + startDate.getDate()
  const startDateString = 
  `${startDate.getFullYear()}-${startMonth}-${startDateNumber}`
  const endDate = !isNeverEnd ? new Date(date_created) : new Date(9998, 12, 30)
  endDate.setMonth(endDate.getMonth()+ subscriptionLength)
  const endMonth = 
    endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 :  '0' + (endDate.getMonth() + 1)
  const endDateNumber =
    endDate.getDate() > 9 ? endDate.getDate() + 1 :  '0' + endDate.getDate()
  const endDateString = 
    `${endDate.getFullYear()}-${endMonth}-${endDateNumber}`
  const data = {
    docstatus: 0,
    party_type: "Customer",
    party: `${first_name} ${last_name}`,
    company: "Aroma of Italy",
    status: "Active",
    start_date: startDateString,
    end_date: endDateString,
    follow_calendar_months: 1,
    generate_new_invoices_past_due_date: 0,
    days_until_due: 0,
    cancel_at_period_end: isNeverEnd ? 0 : 1,
    generate_invoice_at_period_start: 0,
    submit_invoice: 0,
    plans: [
      {
        parentfield: "plans",
        parenttype: "Subscription",
        plan: name,
        qty: quantity
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
    return resp.data.data.name
  } catch (error) {
    console.log(error)
  }
}

export const erpAddInvoiceToSub = async(
  subid: string, invoiceId: string, cookieId: string
)=>{
  
  try {
    const respForInvoices = await axios({
      method: 'GET',
      url: `${SUBSCRIPTION_URL}/${subid}`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })

    const {invoices} = respForInvoices.data.data

    const data = {
      doctype: "Subscription",
      invoices: [
        ...invoices,
        {
          document_type: "Sales Invoice",
          invoice: invoiceId,
        }
      ]
    }

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

