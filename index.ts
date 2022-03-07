import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { 
  buildIncomingOrder, 
  createWooComerceProduct, 
  manageStock, 
  testFunction,
  updateWooComerceProduct, 
} from './src/functions';

const {PORT} = process.env;

const app = express();
app.use(cookieParser())

const jsonParser = bodyParser.json()

const urlencodedParser = bodyParser.urlencoded({ extended: true })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get('/', testFunction);

app.post('/', testFunction);

app.post('/item_creation', urlencodedParser, createWooComerceProduct);

app.post('/item_update', urlencodedParser, updateWooComerceProduct);

app.post('/stock', urlencodedParser, manageStock);

app.post('/stock_discount', urlencodedParser, manageStock);

app.post('/delivered_items', urlencodedParser, manageStock);

app.post('/incoming_order', jsonParser, buildIncomingOrder)
