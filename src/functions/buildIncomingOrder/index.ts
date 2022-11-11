import { Request, Response } from "express";

import { erpLogin } from "../../controllers/erpnext";
import {
  addSubscriptionCommentToOrder,
  addCustomerGroupCommentToOrder,
} from "../../controllers/erpnext/comments";
import { erpSearchCustomer } from "../../controllers/erpnext/customer";
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
import { WooSalesOrder } from "../../types/salesOrder";
import logger from "../../utilities/logger";

export const buildIncomingOrder = async (
  req: Request<WooSalesOrder>,
  res: Response
) => {
  const cookieId = await erpLogin();
  const wooOrder: WooSalesOrder = req.body;
  await erpSearchCustomer(wooOrder, cookieId);
  const { line_items, shipping_total, date_created } = wooOrder;
  logger.info("body => ", req.body);

  const dateAux = new Date(date_created);
  dateAux.setDate(dateAux.getDate() + 5);
  const transactionDate = new Date(date_created);
  const transactionDateString = `${transactionDate.getFullYear()}-${
    transactionDate.getMonth() + 1
  }-${transactionDate.getDate()}`;
  const deliveryDate = dateAux;
  const deliveryDateString = `${deliveryDate.getFullYear()}-${
    deliveryDate.getMonth() + 1
  }-${deliveryDate.getDate()}`;

  const itemsAux = await Promise.all(
    line_items.map(async (item) => {
      const itemId = await erpGetitemByWId(item.product_id, cookieId);
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
        const test = await testSubscriptionPlanExistance(item.name, cookieId);

        if (!test) {
          await erpCreateSubscriptionPlan(
            { ...item, itemId, shipping_total },
            cookieId
          );
        }

        const subscriptionExists = await testSubscriptionExistance(
          wooOrder,
          item,
          subscriptionLength,
          subscriptionInterval,
          cookieId
        );

        logger.info("subscriptionExists => ", subscriptionExists);

        const subscriptionId = !!subscriptionExists
          ? subscriptionExists
          : await erpCreateSubscription(
              wooOrder,
              item,
              subscriptionLength,
              cookieId
            );

        const subcriptionData = await getSubscriptionById(
          subscriptionId,
          cookieId
        );

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
          cookieId,
          true
        );

        logger.info(`Sales order created => ${orderForSub.name}`);

        const createdInvoiceForSub = await createInvoiceForOrder(
          wooOrder,
          orderForSub,
          cookieId
        );

        await erpAddInvoiceToSub(
          subscriptionId,
          createdInvoiceForSub.name,
          cookieId
        );
        logger.info("Invoice created => ", createdInvoiceForSub.name);

        await addSubscriptionCommentToOrder(
          subcriptionData,
          orderForSub.name,
          cookieId
        );
      }
    })
  );

  const items = itemsAux.filter((item) => item !== undefined);

  if (items.length > 0) {
    const orderGenerated = await erpCreateSalesOrder(
      wooOrder,
      transactionDateString,
      deliveryDateString,
      items,
      cookieId
    );
    logger.info(`Sales order created => ${orderGenerated.name}`);
    const customerGroup = await getCustomerB2BGroup(wooOrder);
    if (customerGroup !== "Guest" && Boolean(customerGroup)) {
      await addTagToOrder(
        orderGenerated.name,
        customerGroup || "Guest",
        cookieId
      );
      await addCustomerGroupCommentToOrder(
        orderGenerated.name,
        customerGroup,
        cookieId
      );
    }
    const createdInvoice = await createInvoiceForOrder(
      wooOrder,
      orderGenerated,
      cookieId
    );
    logger.info(`Invoice created => ${createdInvoice.name} `);
  }
  res.send("Ok");
};
