import erpApi from "..";

const ADD_TAG_URL = `/api/method/frappe.desk.doctype.tag.tag.add_tag`;

export const addTagToOrder = async (salesOrderId: string, tag: string) => {
  const data = {
    tag: tag,
    dt: "Sales Order",
    dn: salesOrderId,
  };

  const resp = await erpApi.post(ADD_TAG_URL, data);

  return resp.data;
};
