import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const {WOOCOMERCE_URL, WOOCOMERCE_KEY, WOOCOMERCE_SECRET} = process.env

export const WooCommerce = new WooCommerceRestApi({
  url: WOOCOMERCE_URL,
  consumerKey: WOOCOMERCE_KEY,
  consumerSecret: WOOCOMERCE_SECRET,
  version: 'wc/v3'
});