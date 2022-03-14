import axios from "axios"

const {ERP_URL} = process.env

const ADD_COMMENTS_URL = `${ERP_URL}/api/method/frappe.desk.form.utils.add_comment`

export const addCommentToOrder = async(
  subscriptionData: any, salesOrderId: string, cookieId: string
) => {

  const {start_date, end_date, plans} = subscriptionData

  const subPlanName = plans[0].plan

  const comment = `<div class=\"ql-editor+read-mode\"><p>Subcription: ${subPlanName}</p><p>Start date: ${start_date}</p><p>End date: ${end_date}</p></div>`

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