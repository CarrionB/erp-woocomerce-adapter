import logger from "./logger"

export const isLastDayOfMonth = (date: Date) => {
  const dateAux = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  logger.info("comparison : ",date.getUTCDate(), dateAux.getDate())
  return date.getUTCDate() === dateAux.getDate()
}

export const formatDateToString = (date: Date) => {
  const startMonth = 
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 :  '0' + (date.getMonth() + 1)
  const dateNumber =
    date.getDate() > 9 ? date.getDate() + 1 :  '0' + date.getDate()
  return `${date.getFullYear()}-${startMonth}-${dateNumber}`
}