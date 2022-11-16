export interface SalesOrderWoo {
  id:                   number;
  parent_id:            number;
  status:               string;
  currency:             string;
  version:              string;
  prices_include_tax:   boolean;
  date_created:         string;
  date_modified:        string;
  discount_total:       string;
  discount_tax:         string;
  shipping_total:       string;
  shipping_tax:         string;
  cart_tax:             string;
  total:                string;
  total_tax:            string;
  customer_id:          number;
  order_key:            string;
  billing:              AddressWoo;
  shipping:             AddressWoo;
  payment_method:       string;
  payment_method_title: string;
  transaction_id:       string;
  customer_ip_address:  string;
  customer_user_agent:  string;
  created_via:          string;
  customer_note:        string;
  date_completed:       null;
  date_paid:            Date;
  cart_hash:            string;
  number:               string;
  meta_data:            MetaDatumElement[];
  line_items:           SalesOrderItemWoo[];
  tax_lines:            any[];
  shipping_lines:       ShippingLine[];
  fee_lines:            any[];
  coupon_lines:         any[];
  refunds:              any[];
  payment_url:          string;
  is_editable:          boolean;
  needs_payment:        boolean;
  needs_processing:     boolean;
  date_created_gmt:     Date;
  date_modified_gmt:    Date;
  date_completed_gmt:   null;
  date_paid_gmt:        Date;
  currency_symbol:      string;
  _links:               Links;
}

export interface Links {
  self:       Array<null[] | CollectionClass>;
  collection: Array<null[] | CollectionClass>;
  customer:   Array<null[] | CollectionClass>;
}

export interface CollectionClass {
  href: string;
}

export interface AddressWoo {
  first_name: string;
  last_name:  string;
  company:    string;
  address_1:  string;
  address_2:  string;
  city:       string;
  state:      string;
  postcode:   string;
  country:    string;
  email?:     string;
  phone:      string;
}

export interface SalesOrderItemWoo {
  id:           number;
  name:         string;
  product_id:   number;
  variation_id: number;
  quantity:     number;
  tax_class:    string;
  subtotal:     string;
  subtotal_tax: string;
  total:        string;
  total_tax:    string;
  taxes:        any[];
  meta_data:    Array<SOItemMetaDatum | null>;
  sku:          string;
  price:        number;
  image:        null[] | ImageClass;
  parent_name:  null | string;
}

export interface ImageClass {
  id:  number;
  src: string;
}

export interface SOItemMetaDatum {
  id:            number;
  key:           string;
  value:         string;
  display_key:   string;
  display_value: string;
}

export interface MetaDatumElement {
  id:    number;
  key:   string;
  value: string;
}

export interface ShippingLine {
  id:           number;
  method_title: string;
  method_id:    string;
  instance_id:  string;
  total:        string;
  total_tax:    string;
  taxes:        any[];
  meta_data:    Array<SOItemMetaDatum | null>;
}