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
  up:         Collection[];
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
