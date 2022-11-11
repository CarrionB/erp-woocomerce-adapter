import axios from "axios"
import logger from "../../../utilities/logger"

const {ERP_URL} = process.env

const CONTACT_URL = `${ERP_URL}/api/resource/Contact`

export const erpCreateContact = async(
  first_name: string, 
  last_name: string, 
  email: string, 
  phone: string, 
  cookieId: string
) =>{
  const contactData = {
    first_name: first_name,
    last_name: last_name,
    email_id: email,
    status: "Passive",
    phone: phone,
    mobile_no: phone,
    is_primary_contact: 1,
    is_billing_contact: 1,
    unsubscribed: 0,
    email_ids: [
      {
        parentfield: "email_ids",
        parenttype: "Contact",
        is_primary: 1,
        email_id: email
      }
    ],
    phone_nos: [
      {
        is_primary_phone: 1,
        is_primary_mobile_no: 1,
        phone: phone
      }
    ],
    links: [
      {
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`
      }
    ]
  }
  try {
    const resp = await axios({
      method: 'POST',
      url: `${CONTACT_URL}`,
      data: contactData,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })

    return `Contact created with id: ${resp.data.id}`
    
  } catch (error) {
    logger.error(error)
  }
}