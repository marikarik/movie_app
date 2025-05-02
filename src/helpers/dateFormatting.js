import { format } from 'date-fns'
 export function dateFormatting(date) {
    return format(new Date(date), 'MMMM dd, yyyy')
  }