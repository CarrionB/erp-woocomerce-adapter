import axios from "axios"

const {ERP_URL} = process.env

const SUBCRIPTION_DOC_URL = `${ERP_URL}/app/subscription/`

const ADD_COMMENTS_URL = `${ERP_URL}/api/method/frappe.desk.form.utils.add_comment`

export const addCommentToOrder = async(
  subscriptionData: any, salesOrderId: string, cookieId: string
) => {

  const {name, start_date, end_date, plans} = subscriptionData

  const linkToSub = `<a href=\"${SUBCRIPTION_DOC_URL}${name}\">View subcription</a>`

  const subPlanName = plans[0].plan

  const comment = `<div class=\"ql-editor+read-mode\"><p>Subcription: ${subPlanName}</p><p>Start date: ${start_date}</p><p>End date: ${end_date}</p>${linkToSub}</div>`

  const data = {
    reference_doctype: "Sales Order",
    reference_name: salesOrderId,
    content: comment,
    comment_email: "Administrator",
    comment_by: "Administrator"
  }

  const resp = await axios({
    method: 'POST',
    url: `${ADD_COMMENTS_URL}`,
    data,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })

  return resp.data.data
}