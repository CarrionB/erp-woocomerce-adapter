import axios from "axios"

const {ERP_URL} = process.env

const BIN_URL = `${ERP_URL}/api/resource/Bin`

export const erpGetStockStateRegistry = async (item_code: string, cookieId: string) => {
  const resp = await axios({
    method: 'GET',
    url: `${BIN_URL}?filters=[["item_code","=","${item_code}"]]`,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  const {data} = resp.data
  if(data.length > 0){
    const quantities = await Promise.all(
      data.map(async(item)=>{
        const stockState = await erpGetStockState(item.name, cookieId)
        return stockState.actual_qty
      })
    )
    const actualQuantity = quantities.reduce((acc, curr) => acc + curr)
    return actualQuantity
  }
}

const erpGetStockState = async (bin_id: string, cookieId: string) => {
  const resp = await axios({
    method: 'GET',
    url: `${BIN_URL}/${bin_id}`,
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Cookie': cookieId
    }
  })
  return resp.data.data
}