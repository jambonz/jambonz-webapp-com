
const length = 6;
const digit = () => Math.floor(Math.random() * 10);

export default function generateActivationCode() {
  let activationCode = '';
  for (let i = 0; i < length; i++) {
    activationCode += digit();
  }
  return activationCode;
}
