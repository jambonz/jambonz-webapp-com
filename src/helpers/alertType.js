import AlertType from '../data/AlertType';

const alertType = alert => {
  const index = AlertType.findIndex(item => item.value === alert);

  return index >= 0 ? AlertType[index].text : '';
};

export default alertType;
