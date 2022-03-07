import axios from "axios"

const {ERP_URL} = process.env

const ADDRESS_URL = `${ERP_URL}/api/resource/Address`

export const erpCreateBillingAddress = async(
  first_name: string, 
  last_name: string, 
  email: string, 
  address_1: string, 
  city: string, 
  state: string,
  postcode: string,
  cookieId: string
) =>{
  const billingData = {
    name: `${first_name} ${last_name}-Billing`,
    address_title: `${first_name} ${last_name}`,
    address_type: "Billing",
    address_line1: address_1,
    address_line2: "",
    city: city,
    state: state,
    country: "United States",
    pincode: postcode,
    email_id: email,
    phone: "123456789",
    links: [
      {
        parent: `${first_name} ${last_name}-Billing`,
        parentfield: "links",
        parenttype: "Address",
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`,
        doctype: "Dynamic Link"
      }
    ]
  }
  try {
    const resp = await axios({
      method: 'POST',
      url: `${ADDRESS_URL}`,
      data: billingData,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })

    return `Billing  address created with id: ${resp.data.data.id}`
    
  } catch (error) {
    console.log(error)
  }
}

export const erpCreateShippingAddress = async(
  first_name: string, 
  last_name: string, 
  address_1: string, 
  city: string, 
  state: string,
  postcode: string,
  cookieId: string
) =>{
  const  shippingData = {
    name: `${first_name} ${last_name}-Shipping`,
    address_title: `${first_name} ${last_name}`,
    address_type: "Shipping",
    address_line1: address_1,
    address_line2: "",
    city: city,
    state: state,
    country: "United States",
    pincode: postcode,
    phone: "123456789",
    links: [
      {
        parent: `${first_name} ${last_name}-Shipping`,
        parentfield: "links",
        parenttype: "Address",
        link_doctype: "Customer",
        link_name: `${first_name} ${last_name}`,
        link_title: `${first_name} ${last_name}`,
        doctype: "Dynamic Link"
      }
    ]
  }
  try {
    const resp = await axios({
      method: 'POST',
      url: `${ADDRESS_URL}`,
      data: shippingData,
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Cookie': cookieId
      }
    })

    return `Shipping address created with id: ${resp.data.data.id}`

  } catch (error) {
    console.log(error)
  }
}