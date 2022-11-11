export interface ERPSalesOrder {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  idx: number;
  docstatus: number;
  woocommerce_id: string;
  title: string;
  naming_series: string;
  customer: string;
  customer_name: string;
  order_type: string;
  skip_delivery_note: number;
  company: string;
  transaction_date: Date;
  delivery_date: Date;
  po_no: string;
  customer_address: string;
  address_display: string;
  contact_person: string;
  contact_display: string;
  contact_phone: string;
  contact_mobile: string;
  contact_email: string;
  shipping_address_name: string;
  shipping_address: string;
  customer_group: string;
  territory: string;
  currency: string;
  conversion_rate: number;
  selling_price_list: string;
  price_list_currency: string;
  plc_conversion_rate: number;
  ignore_pricing_rule: number;
  total_qty: number;
  base_total: number;
  base_net_total: number;
  total_net_weight: number;
  total: number;
  net_total: number;
  tax_category: string;
  exempt_from_sales_tax: number;
  other_charges_calculation: string;
  base_total_taxes_and_charges: number;
  total_taxes_and_charges: number;
  loyalty_points: number;
  loyalty_amount: number;
  apply_discount_on: string;
  base_discount_amount: number;
  additional_discount_percentage: number;
  discount_amount: number;
  base_grand_total: number;
  base_rounding_adjustment: number;
  base_rounded_total: number;
  base_in_words: string;
  grand_total: number;
  rounding_adjustment: number;
  rounded_total: number;
  in_words: string;
  advance_paid: number;
  disable_rounded_total: number;
  is_internal_customer: number;
  language: string;
  group_same_items: number;
  status: string;
  delivery_status: string;
  per_delivered: number;
  per_billed: number;
  billing_status: string;
  amount_eligible_for_commission: number;
  commission_rate: number;
  total_commission: number;
  doctype: string;
  items: SalesOrderItem[];
  packed_items: any[];
  pricing_rules: any[];
  taxes: Tax[];
  payment_schedule: PaymentSchedule[];
  sales_team: any[];
  _user_tags: string;
}

export interface SalesOrderItem {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  idx: number;
  docstatus: number;
  item_code: string;
  ensure_delivery_based_on_produced_serial_no: number;
  delivery_date: Date;
  item_name: string;
  description: string;
  item_group: string;
  image: string;
  qty: number;
  stock_uom: string;
  uom: string;
  conversion_factor: number;
  stock_qty: number;
  price_list_rate: number;
  base_price_list_rate: number;
  margin_type: string;
  margin_rate_or_amount: number;
  rate_with_margin: number;
  discount_percentage: number;
  discount_amount: number;
  base_rate_with_margin: number;
  rate: number;
  amount: number;
  base_rate: number;
  base_amount: number;
  stock_uom_rate: number;
  is_free_item: number;
  grant_commission: number;
  net_rate: number;
  net_amount: number;
  base_net_rate: number;
  base_net_amount: number;
  billed_amt: number;
  valuation_rate: number;
  gross_profit: number;
  delivered_by_supplier: number;
  weight_per_unit: number;
  total_weight: number;
  warehouse: string;
  against_blanket_order: number;
  blanket_order_rate: number;
  projected_qty: number;
  actual_qty: number;
  ordered_qty: number;
  planned_qty: number;
  work_order_qty: number;
  delivered_qty: number;
  produced_qty: number;
  returned_qty: number;
  page_break: number;
  item_tax_rate: string;
  transaction_date: Date;
  doctype: string;
}

export interface PaymentSchedule {
  name: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  idx: number;
  docstatus: number;
  due_date: Date;
  invoice_portion: number;
  discount: number;
  payment_amount: number;
  outstanding: number;
  paid_amount: number;
  discounted_amount: number;
  base_payment_amount: number;
  doctype: string;
}

interface Tax {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  idx: number;
  docstatus: number;
  charge_type: string;
  account_head: string;
  description: string;
  included_in_print_rate: number;
  included_in_paid_amount: number;
  cost_center: string;
  rate: number;
  account_currency: string;
  tax_amount: number;
  total: number;
  tax_amount_after_discount_amount: number;
  base_tax_amount: number;
  base_total: number;
  base_tax_amount_after_discount_amount: number;
  item_wise_tax_detail: string;
  dont_recompute_tax: number;
  doctype: string;
}

export interface WooSalesOrder {
  id:                   number;
  parent_id:            number;
  status:               string;
  currency:             string;
  version:              string;
  prices_include_tax:   boolean;
  date_created:         Date;
  date_modified:        Date;
  discount_total:       string;
  discount_tax:         string;
  shipping_total:       string;
  shipping_tax:         string;
  cart_tax:             string;
  total:                string;
  total_tax:            string;
  customer_id:          number;
  order_key:            string;
  billing:              Address;
  shipping:             Address;
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
  line_items:           LineItem[];
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

export interface Address {
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

export interface LineItem {
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
  meta_data:    Array<LineItemMetaDatum | null>;
  sku:          string;
  price:        number;
  image:        null[] | ImageClass;
  parent_name:  null | string;
}

export interface ImageClass {
  id:  number;
  src: string;
}

export interface LineItemMetaDatum {
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
  meta_data:    Array<LineItemMetaDatum | null>;
}
