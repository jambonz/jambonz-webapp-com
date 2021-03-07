import moment from 'moment';

const dateTimeFormat = (date, format) => {
  if (date) {
    return moment(date, format).format('YYYY-MM-DD h:mm a');
  }
  return ;
};

export default dateTimeFormat;
