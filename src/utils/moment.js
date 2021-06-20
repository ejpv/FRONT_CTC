import moment from 'moment'
moment.locale('es')
var formato = 'dddd Do MMMM YYYY'

export function getFecha(item) {
  return moment(item).format(formato)
}
