import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const getVariationById = async (WooCommerce: WooCommerceRestApi, productId: number, variationId: number) => {
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