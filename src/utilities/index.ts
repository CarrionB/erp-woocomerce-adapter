export const isLastDayOfMonth = (date: Date) => {
  const dateAux = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  console.log("comparison : ",date.getUTCDate(), dateAux.getDate())
  return date.getUTCDate() === dateAux.getDate()
}