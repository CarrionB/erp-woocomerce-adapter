import { ContactERP } from "../../../types/contact";
import { AddressWoo } from "../../../types/salesOrder";

export const parseContactData = (billing: AddressWoo): Partial<ContactERP> => {
  const { first_name, last_name, email, phone } = billing;
  return {
    first_name: first_name,
    last_name: last_name,
    email_id: email,
    status: "Passive",
    phone: phone,
    mobile_no: phone,
    is_primary_contact: 1,
    is_billing_contact: 1,
    unsubscribed: 0,
    email_ids: [
      {
        parentfield: "email_ids",
        parenttype: "Contact",
        is_primary: 1,
        email_id: email,
      },
    ],
    phone_nos: [
      {
        is_primary_phone: 1,
        is_primary_mobile_no: 1,
        phone: phone,
      },
    ],
    links: [
      {
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`,
      },
    ],
  };
};
