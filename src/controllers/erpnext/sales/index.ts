import erpApi from "..";
import { SalesOrderERP, SalesOrderWoo } from "../../../types/salesOrder";
import logger from "../../../utilities/logger";
import { addTagToOrder } from "../tag";

const { ERP_URL } = process.env;

const SALES_ORDER_URL = `${ERP_URL}/api/resource/Sales Order`;
const SALES_INVOICE_URL = `${ERP_URL}/api/resource/Sales Invoice`;

export const testOrderExistance = async (wId: any, cookieId: string) => {
  try {
    const {data: resp} = await erpApi.get(
      `${SALES_ORDER_URL}?filters=[["woocommerce_id","=","${wId}"]]`
    );
    const { data } = resp;
    if (data.length === 0) {
      return null;
    }
    return data;
  } catch (error) {
    logger.error(error);
  }
};

export const erpCreateSalesOrder = async (
  body: SalesOrderWoo,
  transactionDateString: string,
  deliveryDateString: string,
  items: Array<any>,
  isSubscription?: boolean
) => {
  const { id, billing, shipping_total } = body;
  const { first_name, last_name } = billing;

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
        doctype: "Sales Taxes and Charges",
      },
    ],
  };

  logger.info("data to send in order => ", data);

  const { data: resp } = await erpApi.post(`${SALES_ORDER_URL}`, data);

  if (isSubscription) {
    await addTagToOrder(resp.data.name, "Subscription");
  }

  return resp.data as SalesOrderERP;
};

export const createInvoiceForOrder = async (
  body: SalesOrderWoo,
  order: SalesOrderERP
) => {
  const { id, billing, shipping_total } = body;
  const { first_name, last_name } = billing;
  const { items, name } = order;

  const itemsWithOrder = items.map((item) => {
    return {
      item_code: item.item_code,
      qty: item.qty,
      rate: item.rate,
      sales_order: name,
      so_detail: item.name,
    };
  });

  const totalByItem = items.map((item) => {
    return item.qty * item.rate;
  });

  let total = totalByItem.reduce((acc, curr) => {
    return acc + curr;
  });
  total = total + parseFloat(shipping_total);

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
    // set_warehouse: "Stores - AOI",
    // set_warehouse: "Aroma Warehouse - AOI",
    update_stock: 1,
    against_income_account: "Sales - AOI",
    items: itemsWithOrder,
    taxes: [
      {
        charge_type: "Actual",
        account_head: "Freight and Forwarding Charges - AOI",
        description: "Shipping Total",
        tax_amount: shipping_total,
      },
    ],
    payments: [
      {
        mode_of_payment: "Cash",
        amount: total,
      },
    ],
  };

  // console.log("invoice data => ", invoiceData)

  const { data: resp } = await erpApi.post(`${SALES_INVOICE_URL}`, invoiceData);
  return resp.data;
};
