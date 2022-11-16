import { format } from 'date-fns'

export const formatDateString = (date: string) => {
  const _date = new Date(date);
  return format(_date, 'yyyy-MM-dd');
};
