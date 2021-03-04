const getPastDays = (date) => {
  let res = "Never used";
  if (date) {
    const currentDate = new Date();
    const lastUsedDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    lastUsedDate.setHours(0, 0, 0, 0);
    const daysDifference = Math.round(
      (currentDate - lastUsedDate) / 1000 / 60 / 60 / 24
    );
    res =
      daysDifference > 1
        ? `${daysDifference} days ago`
        : daysDifference === 1
        ? "Yesterday"
        : daysDifference === 0
        ? "Today"
        : "Never used";
  }

  return res;
};

export { getPastDays };
