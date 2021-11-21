import moment from "moment";

function formateDate(date) {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''
}

export { formateDate }