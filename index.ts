import axios from 'axios';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {erpLogin, erpGetitemById, erpSearchCustomer, erpGetitemByWId, erpCreateSalesOrder, testSubscriptionPlanExistance, erpCreateSubscriptionPlan, erpCreateSubscription} from './src/controllers/erpnext'
import { getVariationById } from './src/controllers/woocomerce/productVariations';

// axios.defaults.withCredentials = true;

const WooCommerce = new WooCommerceRestApi({
  url: 'https://aroma.initgrammers.com',
  consumerKey: 'ck_e1fedaf7c34b10583008e17ba43d771a1fe1c154',
  consumerSecret: 'cs_990ea3d216efd42793dc8a62eb067276a7431b5e',
  version: 'wc/v3'
});

const app = express();
app.use(cookieParser())
const port = 3000;

const jsonParser = bodyParser.json()

const urlencodedParser = bodyParser.urlencoded({ extended: true })

const categories: {[key:string]: number} = {
  Beans: 23,
  Subscription: 25
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

app.get('/', async (req, res) => {
  res.send('Hello World, from express');
  try {
    const cookieId = await erpLogin(axios)
    const resp = await testSubscriptionPlanExistance(axios,"Cafe ASDF 3 ",cookieId)
    console.log(resp)
    // resp.data.forEach(item => {
    //   console.log("item id => ", item.id)
    //   console.log("item metadata => ", item.meta_data)
    // });
  } catch (error) {
    console.log(error)
  }
  
  // Cookies that have been signed
  // try {
  //   const id = 'ABC64'
  //   const cookieId = await erpLogin(axios)
  //   await erpGetitem(axios, id, cookieId)
  //   //   const respUpdateItemERP = await axios.put('https://erp.initgrammers.com/api/resource/Item/ABC64', 
  //   //     {
  //   //       woocommerce_id: id
  //   //     },
  //   //     {
  //   //       withCredentials: true
  //   //     }
  //   //   )
  //   //   console.log("resp update item erp  -> ", respUpdateItemERP)
  //   // }
  // }
  // catch (error) {
  //   console.log(error)
  // }
});

app.post('/', jsonParser, (req, res) => {
  console.log('req headers -> ', req.headers);
  console.log('req body -> ', req.body);
  res.send('Ok');
});

app.post('/incoming_order', jsonParser, async (req, res) => {
  console.log('req body order -> ', req.body);
  const cookieId = await erpLogin(axios)
  await erpSearchCustomer(axios, req.body, cookieId)
  const {id, line_items, billing, shipping_total, date_created} = req.body

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
  const {first_name, last_name} = billing
  const itemsAux = await Promise.all(line_items.map(async (item) => {
    const itemId = await erpGetitemByWId(axios, item.product_id, cookieId)
    console.log("itemid =>", itemId)
    if(itemId !== null){
      if(item.variation_id === 0){
        return{
          item_code: itemId,
          qty: item.quantity,
          rate: item.subtotal
        }
      }
      const variationParameters = await getVariationById(WooCommerce, item.product_id, item.variation_id)
      console.log(variationParameters)
      if(variationParameters.subscriptionPeriod === 'day'){
        return{
          item_code: itemId,
          qty: item.quantity,
          rate: item.subtotal
        }
      }
      const test = await testSubscriptionPlanExistance(axios, item.name, cookieId)
      if(!test){
        await erpCreateSubscriptionPlan(axios, {...item, itemId, shipping_total}, cookieId)
      }
      await erpCreateSubscription(axios, 
        {...item, 
          itemId,
          date_created, 
          transactionDate,
          subscriptionLength: variationParameters.subscriptionLength,
          first_name, last_name
        }, cookieId
      )
    }
  }))

  const items = itemsAux.filter(item => item !== undefined)

  if(items.length > 0){
    const data = {
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
      ]
    }
    console.log(data)
    const resp = await erpCreateSalesOrder(axios, data, cookieId)
    console.log("Sales order created => ", resp)
  }
  res.send('Ok');
})

app.post('/delivered_items', jsonParser, (req, res) => {
  console.log('req headers -> ', req.headers);
  console.log('req body -> ', req.body);
  res.send('Ok');
});

app.post('/itemcreation', urlencodedParser, async (req, res) => {
  console.log('req headers -> ', req.headers);
  console.log('req body -> ', req.body);
  const bodyPlainText = Object.keys(req.body)[0]
  const body = JSON.parse(bodyPlainText);
  console.log("body -> ", body)
  const categoriesAux = []
  const images = []
  if (body.image !== null && body.image !== '')
  {
    images.push({
      src: body.image
    })
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
    console.log('Woocomerceresponde -> ', respW)
    const {id} = respW.data
    const cookieId = await erpLogin(axios)
    if(cookieId){
      const respUpdateItemERP = await axios({
        method: 'PUT',
        url: `https://erp.initgrammers.com/api/resource/Item/${body.item_code}`,
        data: {
          woocommerce_id: id
        },
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Cookie': cookieId
        }
      })
      console.log("resp update item erp  -> ", respUpdateItemERP)
    }
  }
  catch (error) {
    console.log(error)
  }
  res.send('Ok');
});

app.post('/itemchange', urlencodedParser, async (req, res) => {
  console.log('req headers -> ', req.headers);
  console.log('req body -> ', req.body);
  const bodyPlainText = Object.keys(req.body)[0]
  const body = JSON.parse(bodyPlainText);
  console.log("body -> ", body)
  const categoriesAux = []
  const images = []
  if (body.image !== null && body.image !== '')
  {
    images.push({
      src: body.image
    })
  }
  categoriesAux.push({id: categories[body.item_group]})
  const data = {
    name: body.item_name,
    type: "simple",
    regular_price: (body.standard_rate as Number).toFixed(2),
    categories: categoriesAux,
    images: images,
  };
  console.log("data -> ", data)

  try {
    const respW = await WooCommerce.put(`products/${body.woocommerce_id}`, data)
    console.log('Woocomerceresponde -> ', respW.data)
  }
  catch (error) {
    console.log(error)
  }
  res.send('Ok');
});

app.post('/stock', urlencodedParser, async (req, res) => {
  console.log('req headers -> ', req.headers);
  console.log('req body -> ', req.body);
  const bodyPlainText = Object.keys(req.body['{"items": '])[0]
  const body = JSON.parse(bodyPlainText);
  console.log("Stock body -> ", body);
  try {
    const cookieId = await erpLogin(axios)
    const {woocommerce_id} = await erpGetitemById(axios, body.item_code, cookieId)
    const quantity = 
      body.s_warehouse !== null ? 
      body.actual_qty : body.actual_qty + body.transfer_qty;
    const data = {
      manage_stock: true,
      stock_quantity: quantity,
    };
    try {
      const respW = await WooCommerce.put(`products/${woocommerce_id}`, data)
      console.log('Woocomerceresponde -> ', respW)
    }
    catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }

  res.send('Ok');
  // item_code actual_qty
});

