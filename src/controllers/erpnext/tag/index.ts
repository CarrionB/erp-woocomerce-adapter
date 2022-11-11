import axios from "axios";

const { ERP_URL } = process.env;
const ADD_TAG_URL = `${ERP_URL}/api/method/frappe.desk.doctype.tag.tag.add_tag`;

export const addTagToOrder = async (
  salesOrderId: string,
  tag: string,
  cookieId: string
) => {
  const data = {
    tag: tag,
    dt: "Sales Order",
    dn: salesOrderId,
  };

  const resp = await axios({
    method: "POST",
    url: ADD_TAG_URL,
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: cookieId,
    },
  });

  return resp.data;
};
