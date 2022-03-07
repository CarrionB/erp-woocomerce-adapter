import axios from "axios"

const {ERP_URL, ERP_USER, ERP_PASSWORD} = process.env

export const erpLogin = async () => {
  const respLoginERP = await axios({
      method: 'POST',
      url: `${ERP_URL}/api/method/login`,
      data: {
        usr: ERP_USER,
        pwd: ERP_PASSWORD
        },
      headers: { 'Content-Type': 'application/json' }
    })
  const cookieSettings = respLoginERP.headers['set-cookie'][0]
  const cookieIdStrEnd = cookieSettings.indexOf(';')
  const cookieId = cookieSettings.substring(0, cookieIdStrEnd)
  // console.log("cookie Id -> ", cookieId)
  return cookieId;
}