import { AddressERP } from "../../../types/address";
import { AddressWoo } from "../../../types/salesOrder";

export const parseBillingData = (billing: AddressWoo): Partial<AddressERP> => {
  const { first_name, last_name, email, address_1, city, state, postcode } =
    billing;
  return {
    name: `${first_name} ${last_name}-Billing`,
    address_title: `${first_name} ${last_name}`,
    address_type: "Billing",
    address_line1: address_1,
    address_line2: "",
    city: city,
    state: state,
    country: "United States",
    pincode: postcode,
    email_id: email,
    phone: "123456789",
    links: [
      {
        parent: `${first_name} ${last_name}-Billing`,
        parentfield: "links",
        parenttype: "Address",
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`,
        doctype: "Dynamic Link",
      },
    ],
  };
};

export const parseShippingData = (
  shippping: AddressWoo
): Partial<AddressERP> => {
  const { first_name, last_name, email, address_1, city, state, postcode } =
    shippping;

  return {
    name: `${first_name} ${last_name}-Shipping`,
    address_title: `${first_name} ${last_name}`,
    address_type: "Shipping",
    address_line1: address_1,
    address_line2: "",
    city: city,
    state: state,
    country: "United States",
    pincode: postcode,
    phone: "123456789",
    links: [
      {
        parent: `${first_name} ${last_name}-Shipping`,
        parentfield: "links",
        parenttype: "Address",
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`,
        doctype: "Dynamic Link",
      },
    ],
  };
};
