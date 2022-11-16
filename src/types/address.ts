export interface AddressERP {
  name:                    string;
  owner:                   string;
  creation:                Date;
  modified:                Date;
  modified_by:             string;
  idx:                     number;
  docstatus:               number;
  address_title:           string;
  address_type:            string;
  address_line1:           string;
  address_line2:           string;
  city:                    string;
  state:                   string;
  country:                 string;
  pincode:                 string;
  email_id?:               string;
  phone:                   string;
  is_primary_address:      number;
  is_shipping_address:     number;
  disabled:                number;
  is_your_company_address: number;
  doctype:                 string;
  links:                   Partial<LinkAddress>[];
}

export interface LinkAddress {
  name:         string;
  owner:        string;
  creation:     Date;
  modified:     Date;
  modified_by:  string;
  parent:       string;
  parentfield:  string;
  parenttype:   string;
  idx:          number;
  docstatus:    number;
  link_doctype: string;
  link_name:    string;
  link_title:   string;
  doctype:      string;
}
