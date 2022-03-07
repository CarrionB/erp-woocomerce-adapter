import axios from "axios"
import { addTagToOrder } from "../tag"

const {ERP_URL} = process.env

const SALES_ORDER_URL = `${ERP_URL}/api/resource/Sales Order`
const SALES_INVOICE_URL = `${ERP_URL}/api/resource/Sales Invoice`

export const testOrderExistance = async(wId: any, cookieId: string) =>{
  try {
    const resp = await axios({
      method: 'GET',
      url: `${SALES_ORDER_URL}?filters=[["woocommerce_id","=","${wId}"]]`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    const {data} = resp.data
    if(data.length === 0){
      return null
    }
    return data
  } catch (error) {
    console.log(error)
  }
}

export const erpCreateSalesOrder = async (
  body: any,
  transactionDateString: string,
  deliveryDateString: string,
  items: Array<any>,
  cookieId: string,
  isSubscription?: boolean
) => {
  const {id, billing, shipping_total} = body
  const {first_name, last_name} = billing

  const data = {
    docstatus: 1,
    woocommerce_id: id,
    title: "{customer_name}",
    customer: `${first_name} ${last_name}`,
    customer_name: `${first_name} ${last_name}`,
    order_type: "Sales",
    transaction_date: transactionDateString,
    delivery_date: deliveryDateString,
    po_no: id,
    customer_address: `${first_name} ${last_name}-Billing`,
    contact_person: `${first_name} ${last_name}-${first_name} ${last_name}`,
    shipping_address_name: `${first_name} ${last_name}-Shipping`,
    territory: "United States",
    currency: "USD",
    selling_price_list: "Standard Selling",
    items: items,
    taxes: [
      {
        tax_amount: shipping_total,
        charge_type: "Actual",
        account_head: "Freight and Forwarding Charges - AOI",
        description: "Shipping Total",
        doctype: "Sales Taxes and Charges"
      }
    ],
  }

  console.log("data to send in order => ", data)

  const resp = await axios({
    method: 'POST',
    url: `${SALES_ORDER_URL}`,
    data: data,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })

  if(isSubscription){
    await addTagToOrder(resp.data.data.name, "Subscription", cookieId)
  }

  return resp.data
}

export const createInvoiceForOrder  = async (body: any, salesOrderId: string, items: Array<any>, cookieId: string) => {
  const {id, billing, shipping_total} = body
  const {first_name, last_name} = billing

  const itemsWithOrder = items.map(item => {
    return{
      ...item,
      sales_order: salesOrderId
    }
  })

  const totalByItem = items.map(item => {
    return item.qty * parseFloat(item.rate)
  })

  let total = totalByItem.reduce((acc, curr)=>{
    return acc + curr
  })
  total = total + parseFloat(shipping_total)

  const invoiceData = {
    docstatus: 0,
    naming_series: "ACC-SINV-.YYYY.-",
    customer: `${first_name} ${last_name}`,
    is_pos: 1,
    company: "Aroma of Italy",
    po_no: id,
    customer_address: `${first_name} ${last_name}-Billing`,
    contact_person: `${first_name} ${last_name}-${first_name} ${last_name}`,
    territory: "United States",
    shipping_address_name: `${first_name} ${last_name}-Shipping`,
    set_warehouse: "Aroma Warehouse - AOI",
    update_stock: 1,
    against_income_account: "Sales - AOI",
    items: itemsWithOrder,
    taxes: [
      {
        charge_type: "Actual",
        account_head: "Freight and Forwarding Charges - AOI",
        description: "Shipping Total",
        tax_amount: shipping_total
      }
    ],
    payments: [
      {
        mode_of_payment: "Cash",
        amount: total
      }
    ]
  }

  console.log("invoice data => ", invoiceData)

  const resp = await axios({
    method: 'POST',
    url: `${SALES_INVOICE_URL}`,
    data: invoiceData,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data.data
}

export const createInvoice  = async (body: any, itemId: string, item: any, cookieId: string) => {
  const {id, billing, shipping_total} = body
  const {first_name, last_name} = billing

  const items = [
    {
      item_code: itemId,
      qty: item.quantity,
      rate: item.total,
      conversion_factor: 1.0,
    }
  ]

  const totalByItem = items.map(item => {
    return item.qty * parseFloat(item.rate)
  })

  let total = totalByItem.reduce((acc, curr)=>{
    return acc + curr
  })
  total = total + parseFloat(shipping_total)

  const invoiceData = {
    docstatus: 0,
    naming_series: "ACC-SINV-.YYYY.-",
    customer: `${first_name} ${last_name}`,
    is_pos: 1,
    company: "Aroma of Italy",
    po_no: id,
    customer_address: `${first_name} ${last_name}-Billing`,
    contact_person: `${first_name} ${last_name}-${first_name} ${last_name}`,
    territory: "United States",
    shipping_address_name: `${first_name} ${last_name}-Shipping`,
    set_warehouse: "Aroma Warehouse - AOI",
    update_stock: 1,
    against_income_account: "Sales - AOI",
    items: items,
    taxes: [
      {
        charge_type: "Actual",
        account_head: "Freight and Forwarding Charges - AOI",
        description: "Shipping Total",
        tax_amount: shipping_total
      }
    ],
    payments: [
      {
        mode_of_payment: "Cash",
        amount: total
      }
    ]
  }

  console.log("invoice data => ", invoiceData)

  const resp = await axios({
    method: 'POST',
    url: `${SALES_INVOICE_URL}`,
    data: invoiceData,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data.data
}