import { AxiosStatic } from "axios"

const ITEM_URL = "https://erp.initgrammers.com/api/resource/Item"

export const erpGetitemById = async (axios: AxiosStatic, id: string, cookieId: string) => {
  const resp = await axios({
      method: 'GET',
      url: `${ITEM_URL}/${id}`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
  const data = resp.data.data
  const {woocommerce_id, item_code, standard_rate, item_name, item_group} = data
  return {woocommerce_id, item_code, standard_rate, item_name, item_group}
}

export const erpGetitemByWId = async (axios: AxiosStatic, wid: string, cookieId: string) => {
  const resp = await axios({
      method: 'GET',
      url: `${ITEM_URL}?filters=[["woocommerce_id", "=", "${wid}"]]`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
  const data = resp.data.data
  if(data.length > 0){
    return data[0].name
  }
  return null
}