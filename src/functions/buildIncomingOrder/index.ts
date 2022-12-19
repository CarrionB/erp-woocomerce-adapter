import { Request, Response } from "express";

import {
  addSubscriptionCommentToOrder,
  addCustomerGroupCommentToOrder,
} from "../../controllers/erpnext/comments";
import {
  erpCreateCustomer,
  erpSearchCustomer,
} from "../../controllers/erpnext/customer";
import { erpGetitemByWId } from "../../controllers/erpnext/item";
import {
  erpCreateSalesOrder,
  createInvoiceForOrder,
} from "../../controllers/erpnext/sales";
import {
  testSubscriptionExistance,
  erpCreateSubscription,
  getSubscriptionById,
  erpAddInvoiceToSub,
} from "../../controllers/erpnext/subscription";
import {
  testSubscriptionPlanExistance,
  erpCreateSubscriptionPlan,
} from "../../controllers/erpnext/subscriptionPlan";
import { addTagToOrder } from "../../controllers/erpnext/tag";
import { getCustomerB2BGroup } from "../../controllers/woocomerce/customer";
import { getVariationById } from "../../controllers/woocomerce/productVariations";
import { SalesOrderWoo } from "../../types/salesOrder";
import logger from "../../utilities/logger";
import {
  formatDateString,
  isObjectEmpty,
  testIfIntegrationRequest,
} from "./utils";

export const buildIncomingOrder = async (
  req: Request<SalesOrderWoo>,
  res: Response
) => {
  const bodyEmpty = isObjectEmpty(req.body);

  if (bodyEmpty) {
    logger.info("Body empty, testing if integration request...");

    const isIntegrationRequest = testIfIntegrationRequest(req);
    if (isIntegrationRequest) {
      logger.info(
        `Webhook integration request from ${req.headers["x-forwarded-for"]} accepted`
      );
      res.status(200).send();
      return;
    }
    logger.info(
      `No integration request from ${req.headers["x-forwarded-for"]}, rejecting...`
    );
    res.status(401).send();
    return;
  }

  const wooOrder: SalesOrderWoo = req.body;
  console.log("wooorder => ", wooOrder);

  const customerExists = await erpSearchCustomer(wooOrder);

  if (!customerExists) {
    await erpCreateCustomer(wooOrder);
  }

  const { line_items, shipping_total, date_created } = wooOrder;

  const transactionDateString = formatDateString(date_created);
  const deliveryDateString = formatDateString(date_created);

  const itemsAux = await Promise.all(
    line_items.map(async (item) => {
      const itemId = await erpGetitemByWId(item.product_id);
      logger.info("itemid =>", itemId);
      if (itemId !== null) {
        if (item.variation_id === 0) {
          return {
            item_code: itemId,
            qty: item.quantity,
            rate: item.total,
          };
        }
        const variationParameters = await getVariationById(
          item.product_id,
          item.variation_id
        );

        logger.info("variationParameters", variationParameters);

        const { subscriptionLength, subscriptionInterval, subscriptionPeriod } =
          variationParameters;
        if (subscriptionPeriod === "day") {
          return {
            item_code: itemId,
            qty: item.quantity,
            rate: item.total,
          };
        }

        const test = await testSubscriptionPlanExistance(item.name);

        if (!test) {
          await erpCreateSubscriptionPlan({ ...item, itemId, shipping_total });
        }

        const subscriptionExists = await testSubscriptionExistance(
          wooOrder,
          item,
          subscriptionLength,
          subscriptionInterval
        );

        logger.info("subscriptionExists => ", subscriptionExists);

        const subscriptionId = !!subscriptionExists
          ? subscriptionExists
          : await erpCreateSubscription(wooOrder, item, subscriptionLength);

        const subcriptionData = await getSubscriptionById(subscriptionId);

        const itemForSubscription = [
          {
            item_code: itemId,
            qty: item.quantity,
            rate: item.total,
          },
        ];

        const orderForSub = await erpCreateSalesOrder(
          wooOrder,
          transactionDateString,
          deliveryDateString,
          itemForSubscription,
          true
        );

        logger.info(`Sales order created => ${orderForSub.name}`);

        const createdInvoiceForSub = await createInvoiceForOrder(
          wooOrder,
          orderForSub
        );

        await erpAddInvoiceToSub(subscriptionId, createdInvoiceForSub.name);
        logger.info("Invoice created => ", createdInvoiceForSub.name);

        await addSubscriptionCommentToOrder(subcriptionData, orderForSub.name);
      }
    })
  );

  const items = itemsAux.filter((item) => item !== undefined);

  if (items.length > 0) {
    const orderGenerated = await erpCreateSalesOrder(
      wooOrder,
      transactionDateString,
      deliveryDateString,
      items
    );
    logger.info(`Sales order created =>`);
    logger.info(orderGenerated.name);
    const customerGroup = await getCustomerB2BGroup(wooOrder);
    logger.info("customerGroup =>", customerGroup);
    if (customerGroup !== "Guest" && Boolean(customerGroup)) {
      await addTagToOrder(orderGenerated.name, customerGroup);
      await addCustomerGroupCommentToOrder(orderGenerated.name, customerGroup);
    }
    const createdInvoice = await createInvoiceForOrder(
      wooOrder,
      orderGenerated
    );
    logger.info(`Invoice created => ${createdInvoice.name} `);
  }
  res.status(200).send();
};
