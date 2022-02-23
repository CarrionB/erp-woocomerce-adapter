import { AxiosStatic } from "axios"

const SALES_URL = "https://erp.initgrammers.com/api/resource/Sales Order"

export const erpCreateSalesOrder = async (axios: AxiosStatic, data: any, cookieId: string) => {
  const resp = await axios({
    method: 'POST',
    url: `${SALES_URL}`,
    data: data,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data
}