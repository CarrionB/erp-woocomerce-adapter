import erpApi from "..";

const SUBCRIPTION_DOC_URL = `/app/subscription/`;

const ADD_COMMENTS_URL = `/api/method/frappe.desk.form.utils.add_comment`;

export const addSubscriptionCommentToOrder = async (
  subscriptionData: any,
  salesOrderId: string
) => {
  const { name, start_date, end_date, plans } = subscriptionData;

  const linkToSub = `<a href=\"${SUBCRIPTION_DOC_URL}${name}\">View subscription</a>`;

  const subPlanName = plans[0].plan;

  const comment = `<div class=\"ql-editor+read-mode\"><p>Subcription: ${subPlanName}</p><p>Start date: ${start_date}</p><p>End date: ${end_date}</p>${linkToSub}</div>`;

  const data = {
    reference_doctype: "Sales Order",
    reference_name: salesOrderId,
    content: comment,
    comment_email: "Administrator",
    comment_by: "Administrator",
  };

  const { data: resp } = await erpApi.post(`${ADD_COMMENTS_URL}`, data);

  return resp.data;
};

export const addCustomerGroupCommentToOrder = async (
  salesOrderId: string,
  customerGroup: string
) => {
  const comment = `<div class=\"ql-editor+read-mode\"><p>WooComerce group: ${customerGroup}</p></div>`;

  const data = {
    reference_doctype: "Sales Order",
    reference_name: salesOrderId,
    content: comment,
    comment_email: "Administrator",
    comment_by: "Administrator",
  };

  const {data: resp} = await erpApi.post(`${ADD_COMMENTS_URL}`, data);

  return resp.data;
};
