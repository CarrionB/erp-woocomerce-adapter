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

  app.post("/item/create", urlencodedParser, createWooComerceProduct);
  
  app.post("/item/update", urlencodedParser, updateWooComerceProduct);

  app.post("/item/delete", urlencodedParser, deleteWooComerceProduct);
  
  app.post("/item/category/create", urlencodedParser, createWoocomerceProductCategory);
  
  app.post("/item/category/delete", urlencodedParser, deleteWooComerceProductCategory);
  
  app.post("/stock/update", urlencodedParser, manageStock);

  app.post("/order/create", jsonParser, buildIncomingOrder);
};

export default routes;
