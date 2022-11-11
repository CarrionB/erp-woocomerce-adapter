import axios from "axios"
import logger from "../../../utilities/logger"

const {ERP_URL} = process.env

const ITEM_URL = `${ERP_URL}/api/resource/Item`

export const erpGetitem = async (id: string) => {
  const resp = await axios({
      method: 'GET',
      url: `${ITEM_URL}/${id}`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': process.env.ERP_LOGIN_COOKIE_ID
      }
    })
  const data = resp.data.data
  const {woocommerce_id, item_code, standard_rate, item_name, item_group} = data
  return {woocommerce_id, item_code, standard_rate, item_name, item_group}
}

export const erpSetWoocomerceId = async (item_code: string, id: string, cookieId: string) => {
  const resp = await axios({
    method: 'PUT',
    url: `${ITEM_URL}/${item_code}`,
    data: {
      woocommerce_id: id
    },
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  const data = resp.data.data
  logger.info(data)
  return data.name
}

export const erpGetitemById = async (id: string, cookieId: string) => {
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

export const erpGetitemByWId = async (wid: number, cookieId: string) => {
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