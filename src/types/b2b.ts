export interface CustomerB2BGroup {
  id:                  number;
  date_created:        string;
  date_created_gmt:    string;
  date_modified:       Date;
  date_modified_gmt:   Date;
  email:               string;
  first_name:          string;
  last_name:           string;
  role:                string;
  username:            string;
  billing:             Billing;
  shipping:            Shipping;
  is_paying_customer:  boolean;
  avatar_url:          string;
  meta_data:           MetaDatum[];
  wcb2b_invoice_email: string;
  wcb2b_vat_number:    string;
  wcb2b_unpaid_limit:  string;
  wcb2b_status:        number;
  wcb2b_group:         Wcb2BGroup;
  _links:              Links;
}

export interface Links {
  self:       Collection[];
  collection: Collection[];
}

export interface Collection {
  href: string;
}

export interface Billing {
  first_name:    string;
  last_name:     string;
  company:       string;
  address_1:     string;
  address_2:     string;
  city:          string;
  postcode:      string;
  country:       string;
  state:         string;
  email:         string;
  phone:         string;
  vat_number:    string;
  invoice_email: string;
}

export interface MetaDatum {
  id:    number;
  key:   string;
  value: string[] | string;
}

export interface Shipping {
  first_name: string;
  last_name:  string;
  company:    string;
  address_1:  string;
  address_2:  string;
  city:       string;
  postcode:   string;
  country:    string;
  state:      string;
}

export interface Wcb2BGroup {
  id:       number;
  name:     string;
  discount: string;
}
