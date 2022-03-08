import { Request, Response } from 'express';

import { WooCommerce } from '../controllers/woocomerce';

import { erpLogin } from "../controllers/erpnext";
import { erpSearchCustomer } from '../controllers/erpnext/customer';
import { erpGetitemById, erpGetitemByWId, erpSetWoocomerceId } from "../controllers/erpnext/item";
import { getVariationById } from '../controllers/woocomerce/productVariations';
import { erpCreateSubscriptionPlan, testSubscriptionPlanExistance } from '../controllers/erpnext/subscriptionPlan';
import { createInvoiceForOrder, erpCreateSalesOrder} from '../controllers/erpnext/sales';
import { erpGetStockStateRegistry } from '../controllers/erpnext/bin';

const {ERP_URL} = process.env

const categories: {[key:string]: number} = {
  Beans: 23,
  Subscription: 25
}

export const testFunction = async (req: Request, res: Response) => {
  res.send('Hello World, from erp-to-woocomerce-adapter');
}

export const createWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0]
  const body = JSON.parse(bodyPlainText);
  console.log(body)
  const categoriesAux = []
  const images = []
  if (body.image !== null && body.image !== '')
  {
    if("/files/"  === body.image.substring(0, 7)) {
      images.push({
        src: `${ERP_URL}${body.image}`
      })
    }
    else {
      images.push({
        src: body.image
      })
    }
  }
  categoriesAux.push({id: categories[body.item_group]})
  const data = {
    name: body.item_name,
    type: "simple",
    manage_stock: true,
    stock_quantity: body.opening_stock,
    regular_price: (body.valuation_rate as Number).toFixed(2),
    categories: categoriesAux,
    images: images,
  };
  console.log("data -> ", data)
  
  try {
    const respW = await WooCommerce.post("products", data)
    console.log('Woocomerceresponde -> ', respW.data)
    const {id} = respW.data
    const cookieId = await erpLogin()
    if(cookieId){
      const respUpdateItemERP = await erpSetWoocomerceId(body.item_code, id, cookieId)
      console.log("resp update item erp  -> ", respUpdateItemERP)
    }
  }
  catch (error) {
    console.log(error)
  }
  res.send('Ok');
}

export const updateWooComerceProduct = async (req: Request, res: Response) => {
  const bodyPlainText = Object.keys(req.body)[0]
  const body = JSON.parse(bodyPlainText);
  if(body.woocommerce_id) {
    const images = []
    if (body.image !== null && body.image !== '')
    {
      if("/files/"  === body.image.substring(0, 7)) {
        images.push({
          src: `${ERP_URL}${body.image}`
        })
      }
      else {
        images.push({
          src: body.image
        })
      }
    }
    const data = {
      name: body.item_name,
      regular_price: (body.standard_rate as Number).toFixed(2),
      images: images,
    };

    console.log("data -> ", data)

    try {
      const respW = await WooCommerce.put(`products/${body.woocommerce_id}`, data)
      console.log('Woocomerce response -> ', respW.data)
    }
    catch (error) {
      console.log(error)
    }
  }
  res.send('Ok');
}


export const updateWooComerceStock = async (req: Request, res: Response) => {
  const bodyPlainText = `{"items": [${Object.keys(req.body['{"items": '])[0]}]}`
  const body = JSON.parse(bodyPlainText);
  const itemCodes = body.items.map(item => item.item_code)
  try {
    const cookieId = await erpLogin()
    const stockToUpdate = await Promise.all(itemCodes.map(async (itemCode) => {
      const quantity = await erpGetStockStateRegistry(itemCode, cookieId)
      const {woocommerce_id} = await erpGetitemById(itemCode, cookieId)
      return {
        woocommerce_id,
        quantity
      }
    }))
    await Promise.all(stockToUpdate.map(async ({woocommerce_id, quantity}) => {
        const data = {
          manage_stock: true,
          stock_quantity: quantity,
        };
        const respW = await WooCommerce.put(`products/${woocommerce_id}`, data)
        console.log('Woocomerce response -> ', respW.data)
    }))
  } catch (error) {
    console.log(error)
  }
  
  res.send('Ok');
}

export const buildIncomingOrder = async (req: Request, res: Response) => {
  const cookieId = await erpLogin()
  await erpSearchCustomer(req.body, cookieId)
  const {id, line_items, billing, shipping_total, date_created} = req.body
  console.log(req.body)

  const dateAux = new Date(date_created)
  dateAux.setDate(dateAux.getDate()+5)
  const transactionDate = new Date(date_created)
  const transactionDateString = 
    `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}-${transactionDate.getDate()}`
  const deliveryDate = dateAux
  const deliveryDateString = 
    `${deliveryDate.getFullYear()}-${deliveryDate.getMonth() + 1}-${deliveryDate.getDate()}`

  line_items.forEach(element => {
    console.log("name => ", element.name)
    console.log("metadata => ", element.meta_data)
  });
  const itemsAux = await Promise.all(line_items.map(async (item) => {
    const itemId = await erpGetitemByWId(item.product_id, cookieId)
    console.log("itemid =>", itemId)
    if(itemId !== null){
      if(item.variation_id === 0){
        return{
          item_code: itemId,
          qty: item.quantity,
          rate: item.total
        }
      }
      const variationParameters = await getVariationById(item.product_id, item.variation_id)
      console.log(variationParameters)
      if(variationParameters.subscriptionPeriod === 'day'){
        return{
          item_code: itemId,
          qty: item.quantity,
          rate: item.total
        }
      }
      const test = await testSubscriptionPlanExistance(item.name, cookieId)
      if(!test){
        await erpCreateSubscriptionPlan({...item, itemId, shipping_total}, cookieId)
      }
      
      const itemForSubscription = [
        {
          item_code: itemId,
          qty: item.quantity,
          rate: item.total
        }
      ]

      const orderForSub = await erpCreateSalesOrder(
        req.body, 
        transactionDateString,
        deliveryDateString,
        itemForSubscription,
        cookieId,
        true
      )
      console.log("Sales order created => ", orderForSub)
      const createdInvoiceForSub = await createInvoiceForOrder(
        req.body, orderForSub.data.name,
        itemForSubscription,
        cookieId
      )
      console.log(createdInvoiceForSub)
    }
  }))

  const items = itemsAux.filter(item => item !== undefined)

  if(items.length > 0) {
    const resp = await erpCreateSalesOrder(
      req.body, 
      transactionDateString,
      deliveryDateString,
      items,
      cookieId
    )
    console.log("Sales order created => ", resp)
    const createdInvoice = await createInvoiceForOrder(req.body, resp.data.name, items, cookieId)
    console.log(createdInvoice)
  }
  res.send('Ok');
}

export const manageStock = async (req: Request, res: Response) => {
  const bodyPlainText = `{"items": [${Object.keys(req.body['{"items": '])[0]}]}`
  const body = JSON.parse(bodyPlainText);
  const itemCodes = body.items.map(item => item.item_code)
  try {
    const cookieId = await erpLogin()
    const stockToUpdate = await Promise.all(itemCodes.map(async (itemCode) => {
      const quantity = await erpGetStockStateRegistry(itemCode, cookieId)
      const {woocommerce_id} = await erpGetitemById(itemCode, cookieId)
      return {
        woocommerce_id,
        quantity
      }
    }))
    await Promise.all(stockToUpdate.map(async ({woocommerce_id, quantity}) => {
        const data = {
          manage_stock: true,
          stock_quantity: quantity,
        };
        const respW = await WooCommerce.put(`products/${woocommerce_id}`, data)
        console.log(
          'Woocomerce response -> ', respW.data.id, 
          "quantity", respW.data.stock_quantity
        )
    }))
  } catch (error) {
    console.log(error)
  }
  res.send('Ok');
}