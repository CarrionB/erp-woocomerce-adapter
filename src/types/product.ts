export interface ProductWoo {
  id:                      number;
  name:                    string;
  slug:                    string;
  permalink:               string;
  date_created:            Date;
  date_created_gmt:        Date;
  date_modified:           Date;
  date_modified_gmt:       Date;
  type:                    string;
  status:                  string;
  featured:                boolean;
  catalog_visibility:      string;
  description:             string;
  short_description:       string;
  sku:                     string;
  price:                   string;
  regular_price:           string;
  sale_price:              string;
  date_on_sale_from:       null;
  date_on_sale_from_gmt:   null;
  date_on_sale_to:         null;
  date_on_sale_to_gmt:     null;
  on_sale:                 boolean;
  purchasable:             boolean;
  total_sales:             number;
  virtual:                 boolean;
  downloadable:            boolean;
  downloads:               any[];
  download_limit:          number;
  download_expiry:         number;
  external_url:            string;
  button_text:             string;
  tax_status:              string;
  tax_class:               string;
  manage_stock:            boolean;
  stock_quantity:          number;
  backorders:              string;
  backorders_allowed:      boolean;
  backordered:             boolean;
  low_stock_amount:        null;
  sold_individually:       boolean;
  weight:                  string;
  dimensions:              Dimensions;
  shipping_required:       boolean;
  shipping_taxable:        boolean;
  shipping_class:          string;
  shipping_class_id:       number;
  reviews_allowed:         boolean;
  average_rating:          string;
  rating_count:            number;
  upsell_ids:              any[];
  cross_sell_ids:          any[];
  parent_id:               number;
  purchase_note:           string;
  categories:              Array<null[]>;
  tags:                    any[];
  images:                  any[];
  attributes:              any[];
  default_attributes:      any[];
  variations:              any[];
  grouped_products:        any[];
  menu_order:              number;
  price_html:              string;
  related_ids:             number[];
  meta_data:               any[];
  stock_status:            string;
  has_options:             boolean;
  wcb2b_group_prices:      any[];
  wcb2b_group_tier_prices: any[];
  wcb2b_barcode:           any[];
  wcb2b_min_quantity:      any[];
  wcb2b_max_quantity:      any[];
  wcb2b_package_quantity:  any[];
  wcb2b_group_hide_prices: any[];
  _links:                  Links;
}
export interface ProductVariation {
  id:                      number;
  date_created:            Date;
  date_created_gmt:        Date;
  date_modified:           Date;
  date_modified_gmt:       Date;
  description:             string;
  permalink:               string;
  sku:                     string;
  price:                   string;
  regular_price:           string;
  sale_price:              string;
  date_on_sale_from:       null;
  date_on_sale_from_gmt:   null;
  date_on_sale_to:         null;
  date_on_sale_to_gmt:     null;
  on_sale:                 boolean;
  status:                  string;
  purchasable:             boolean;
  virtual:                 boolean;
  downloadable:            boolean;
  downloads:               any[];
  download_limit:          number;
  download_expiry:         number;
  tax_status:              string;
  tax_class:               string;
  manage_stock:            string;
  stock_quantity:          number;
  stock_status:            string;
  backorders:              string;
  backorders_allowed:      boolean;
  backordered:             boolean;
  low_stock_amount:        null;
  weight:                  string;
  dimensions:              Dimensions;
  shipping_class:          string;
  shipping_class_id:       number;
  image:                   Image;
  attributes:              Attribute[];
  menu_order:              number;
  meta_data:               MetaDatum[];
  wcb2b_group_prices:      { [key: string]: string }[];
  wcb2b_group_tier_prices: string[];
  wcb2b_barcode:           string[];
  wcb2b_min_quantity:      any[];
  wcb2b_max_quantity:      any[];
  wcb2b_package_quantity:  any[];
  wcb2b_group_hide_prices: Array<any[]>;
  _links:                  Links;
}

interface Links {
  self:       Collection[];
  collection: Collection[];
  up?:         Collection[];
}

export interface Collection {
  href: string;
}

export interface Attribute {
  id:     number;
  name:   string;
  option: string;
}

export interface Dimensions {
  length: string;
  width:  string;
  height: string;
}

export interface Image {
  id:                number;
  date_created:      Date;
  date_created_gmt:  Date;
  date_modified:     Date;
  date_modified_gmt: Date;
  src:               string;
  name:              string;
  alt:               string;
}

export interface MetaDatum {
  id:    number;
  key:   string;
  value: string;
}
