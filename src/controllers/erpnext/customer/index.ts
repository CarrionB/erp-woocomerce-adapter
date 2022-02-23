import { AxiosStatic } from "axios"
import { erpCreateBillingAddress, erpCreateShippingAddress } from "../address"
import { erpCreateContact } from "../contact"

const CUSTOMER_URL = "https://erp.initgrammers.com/api/resource/Customer"

export const erpSearchCustomer = async (axios: AxiosStatic, {billing}: any, cookieId: string) => {
  const {email} = billing
  try{
    const resp = await axios({
      method: 'GET',
      url: `${CUSTOMER_URL}?filters=[["woocommerce_email","=","${email}"]]`,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    const {data} = resp.data
    if(data.length === 0){
      const respCustomer = await erpCreateCustomer(axios, billing, cookieId)
      console.log("Created customer => ",respCustomer)
    }
  }catch(error) {
    console.log(error)
  }
}

const erpCreateCustomer = async (axios: AxiosStatic, billing: any, cookieId: string) => {
  const {first_name, last_name, address_1, city, state, postcode, email, phone} = billing

  const userData = {
    woocommerce_email: email,
    customer_name: `${first_name} ${last_name}`,
    customer_type: "Individual",
    customer_group: "Guest",
    territory: "United States"
  }
  try{
    const resp = await axios({
      method: 'POST',
      url: `${CUSTOMER_URL}`,
      data: userData,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })
    if(resp.data){
      const respBilling = await erpCreateBillingAddress(
        axios, 
        first_name, 
        last_name, 
        email, 
        address_1, 
        city, 
        state, 
        postcode, 
        cookieId
      )

      const respShipping = await erpCreateShippingAddress(
        axios, 
        first_name, 
        last_name, 
        address_1, 
        city, 
        state, 
        postcode, 
        cookieId
      )

      const respContact = await erpCreateContact(axios, first_name, last_name, email, phone, cookieId)

      console.log("Billing address -> ", respBilling)
      console.log("Shipping address -> ", respShipping)
      console.log("Contact address -> ", respContact)
    }
    return `Customer ${first_name} ${last_name} created`
  }catch(error) {
    console.log(error)
  }
}