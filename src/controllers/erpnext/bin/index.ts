import erpApi from ".."

const BIN_URL = `/api/resource/Bin`

export const erpGetStockStateRegistry = async (item_code: string) => {
  const resp = await erpApi.get(`${BIN_URL}?filters=[["item_code","=","${item_code}"]]`)
  const {data} = resp.data
  if(data.length > 0){
    const quantities = await Promise.all(
      data.map(async(item)=>{
        const stockState = await erpGetStockState(item.name)
        return stockState.actual_qty
      })
    )
    const actualQuantity = quantities.reduce((acc, curr) => acc + curr)
    return actualQuantity
  }
}

const erpGetStockState = async (bin_id: string) => {
  const resp = await erpApi.get(`${BIN_URL}/${bin_id}`)
  return resp.data.data
}