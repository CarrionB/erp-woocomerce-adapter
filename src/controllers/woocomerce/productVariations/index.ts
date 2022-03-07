import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WooCommerce } from "..";

export const listVariationById = async (
  productId: number,
) => {
  try {
    const resp = await WooCommerce.get(`products/${productId}/variations`)
    return resp.data
  } catch (error) {
    console.log(error)
  }
}

export const getVariationById = async (
  productId: number,
  variationId: number
) => {
  try {
    const resp = await WooCommerce.get(`products/${productId}/variations/${variationId}`)
    const data = {
      subscriptionPeriod: "",
      subscriptionLength: 0
    }

    const values = resp.data.meta_data.filter(
      item => {
        if(item.key === "_subscription_period"){
          return item
        }
        if(item.key === "_subscription_length"){
          return item
        }
      })
    data.subscriptionPeriod = values[0].value
    data.subscriptionLength = values[1].value
    return data
  } catch (error) {
    console.log(error)
  }
}