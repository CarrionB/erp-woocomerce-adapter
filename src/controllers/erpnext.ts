import { AxiosStatic } from "axios"

const ITEM_URL = "https://erp.initgrammers.com/api/resource/Item"
const CUSTOMER_URL = "https://erp.initgrammers.com/api/resource/Customer"
const ADDRESS_URL = "https://erp.initgrammers.com/api/resource/Address"
const CONTACT_URL = "https://erp.initgrammers.com/api/resource/Contact"
const SALES_URL = "https://erp.initgrammers.com/api/resource/Sales Order"
const SUBSCRIPTION_PLAN_URL = "https://erp.initgrammers.com/api/resource/Subscription Plan"
const SUBSCRIPTION_URL = "https://erp.initgrammers.com/api/resource/Subscription"

export const erpLogin = async (axios: AxiosStatic) => {
  const respLoginERP = await axios({
      method: 'POST',
      url: 'https://erp.initgrammers.com/api/method/login',
      data: {
        usr: "erpnext.aroma.italy.owner@gmail.com",
        pwd: "Contrasen4_de.3rp"
        }, 
      headers: { 'Content-Type': 'application/json' }
    })
  const cookieSettings = respLoginERP.headers['set-cookie'][0]
  const cookieIdStrEnd = cookieSettings.indexOf(';')
  const cookieId = cookieSettings.substring(0, cookieIdStrEnd)
  console.log("cookie Id -> ", cookieId)
  return cookieId;
}

export const erpGetitemById = async (axios: AxiosStatic, id: string, cookieId: string) => {
  const resp = await axios({
      method: 'GET',
      url: `https://erp.initgrammers.com/api/resource/Item/${id}`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
  const data = resp.data.data
  const {woocommerce_id, item_code, standard_rate, item_name, item_group} = data
  return {woocommerce_id, item_code, standard_rate, item_name, item_group}
}

export const erpGetitemByWId = async (axios: AxiosStatic, wid: string, cookieId: string) => {
  const resp = await axios({
      method: 'GET',
      url: `${ITEM_URL}?filters=[["woocommerce_id", "=", "${wid}"]]`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
  const data = resp.data.data
  if(data.length > 0){
    return data[0].name
  }
  return null
}

export const erpSearchCustomer = async (axios: AxiosStatic, {billing}: any, cookieId: string) => {
  const {email} = billing
  try{
    const resp = await axios({
      method: 'GET',
      url: `${CUSTOMER_URL}?filters=[["woocommerce_email","=","${email}"]]`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    const {data} = resp.data
    if(data.length === 0){
      const respCustomer = await erpCreateCustomer(axios, billing, cookieId)
      console.log("Created customer => ",respCustomer)
    }
  }catch(error) {
    console.log(error)
  }
}

const erpCreateCustomer = async (axios: AxiosStatic, billing: any, cookieId: string) => {
  const {first_name, last_name, address_1, city, state, postcode, email, phone} = billing

  const userData = {
    woocommerce_email: email,
    customer_name: `${first_name} ${last_name}`,
    customer_type: "Individual",
    customer_group: "Guest",
    territory: "United States"
  }
  try{
    const resp = await axios({
      method: 'POST',
      url: `${CUSTOMER_URL}`,
      data: userData,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    if(resp.data){
      const billingData = {
        name: `${first_name} ${last_name}-Billing`,
        address_title: `${first_name} ${last_name}`,
        address_type: "Billing",
        address_line1: address_1,
        address_line2: "",
        city: city,
        state: state,
        country: "United States",
        pincode: postcode,
        email_id: email,
        phone: "123456789",
        links: [
          {
            parent: `${first_name} ${last_name}-Billing`,
            parentfield: "links",
            parenttype: "Address",
            link_doctype: "Customer",
            link_name: `${first_name} ${last_name}`,
            link_title: `${first_name} ${last_name}`,
            doctype: "Dynamic Link"
          }
        ]
      }
      const  shippingData = {
        name: `${first_name} ${last_name}-Shipping`,
        address_title: `${first_name} ${last_name}`,
        address_type: "Shipping",
        address_line1: address_1,
        address_line2: "",
        city: city,
        state: state,
        country: "United States",
        pincode: postcode,
        phone: "123456789",
        links: [
          {
            parent: `${first_name} ${last_name}-Shipping`,
            parentfield: "links",
            parenttype: "Address",
            link_doctype: "Customer",
            link_name: `${first_name} ${last_name}`,
            link_title: `${first_name} ${last_name}`,
            doctype: "Dynamic Link"
          }
        ]
      }
      const respBilling = await axios({
        method: 'POST',
        url: `${ADDRESS_URL}`,
        data: billingData,
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Cookie': cookieId
        }
      })

      const respShipping = await axios({
        method: 'POST',
        url: `${ADDRESS_URL}`,
        data: shippingData,
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Cookie': cookieId
        }
      })

      const contactData = {
        first_name: first_name,
        last_name: last_name,
        email_id: email,
        status: "Passive",
        phone: phone,
        mobile_no: phone,
        is_primary_contact: 1,
        is_billing_contact: 1,
        unsubscribed: 0,
        email_ids: [
          {
            parentfield: "email_ids",
            parenttype: "Contact",
            is_primary: 1,
            email_id: email
          }
        ],
        phone_nos: [
          {
            is_primary_phone: 1,
            is_primary_mobile_no: 1,
            phone: phone
          }
        ],
        links: [
          {
            link_doctype: "Customer",
            link_name: `${first_name} ${last_name}`,
            link_title: `${first_name} ${last_name}`
          }
        ]
      }

      const respContact = await axios({
        method: 'POST',
        url: `${CONTACT_URL}`,
        data: contactData,
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Cookie': cookieId
        }
      })

      console.log("Billing address -> ", respBilling.data)
      console.log("Shipping address -> ", respShipping.data)
      console.log("Contact address -> ", respContact.data)
    }
    return `Customer ${first_name} ${last_name} created`
  }catch(error) {
    console.log(error)
  }
}

export const erpCreateSalesOrder = async (axios: AxiosStatic, data: any, cookieId: string) => {
  const resp = await axios({
    method: 'POST',
    url: `${SALES_URL}`,
    data: data,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data
}

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



