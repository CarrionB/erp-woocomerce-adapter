export interface ProductCategooryWoo {
  id:          number;
  name:        string;
  slug:        string;
  parent:      number;
  description: string;
  display:     string;
  image:       null;
  menu_order:  number;
  count:       number;
  meta:        Meta;
  _links:      Links;
}

export interface Links {
  self:       null[];
  collection: null[];
}

export interface Meta {
  order:                     null[];
  product_count_product_cat: null[];
  wcb2b_group_visibility:    null[];
  display_type:              null[];
  thumbnail_id:              null[];
}