import bodyParser from "body-parser";
import { Express } from "express";
import {
  testFunction,
  createWooComerceProduct,
  updateWooComerceProduct,
  deleteWooComerceProduct,
  manageStock,
  buildIncomingOrder,
  createWoocomerceProductCategory,
  deleteWooComerceProductCategory,
} from "../functions";

const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

const routes = (app: Express) => {
  app.get("/", testFunction);

  app.post("/", jsonParser, testFunction);

  app.post("/item_creation", urlencodedParser, createWooComerceProduct);
  
  app.post("/item_update", urlencodedParser, updateWooComerceProduct);

  app.post("/item_deletion", urlencodedParser, deleteWooComerceProduct);
  
  app.post("/item_category_creation", urlencodedParser, createWoocomerceProductCategory);
  
  app.post("/item_category_deletion", urlencodedParser, deleteWooComerceProductCategory);
  
  app.post("/stock", urlencodedParser, manageStock);

  app.post("/stock_discount", urlencodedParser, manageStock);

  app.post("/delivered_items", urlencodedParser, manageStock);

  app.post("/incoming_order", jsonParser, buildIncomingOrder);
};

export default routes;
