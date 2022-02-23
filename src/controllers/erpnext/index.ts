import { AxiosStatic } from "axios"

export const erpLogin = async (axios: AxiosStatic) => {
  const respLoginERP = await axios({
      method: 'POST',
      url: 'https://erp.initgrammers.com/api/method/login',
      data: {
        usr: "erpnext.aroma.italy.owner@gmail.com",
        pwd: "Contrasen4_de.3rp"
        }, 
      headers: { 'Content-Type': 'application/json' }
    })
  const cookieSettings = respLoginERP.headers['set-cookie'][0]
  const cookieIdStrEnd = cookieSettings.indexOf(';')
  const cookieId = cookieSettings.substring(0, cookieIdStrEnd)
  // console.log("cookie Id -> ", cookieId)
  return cookieId;
}