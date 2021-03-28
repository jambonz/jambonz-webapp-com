
const maskApiToken = (token, mobile) => {
  if (mobile) {
    const maskLength = token.length - 4;
    return `****** ${token.substring(maskLength)}`;
  }

  const maskLength = token.length - 4;
  const maskedPortion = token.substring(0, maskLength).replace(/[a-zA-Z0-9]/g, '*');
  const revealedPortion = token.substring(maskLength);
  const maskedToken = `${maskedPortion}${revealedPortion}`;

  return maskedToken;
};

export default maskApiToken;
