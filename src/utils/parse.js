import moment from "moment";

const getPastDays = (date) => {
  const current = moment();
  const certainDate = moment(date);
  const diff = current.diff(certainDate, "days");

  return diff === 1 ? `1 day ago` : `${diff} days ago`;
};

export { getPastDays };
