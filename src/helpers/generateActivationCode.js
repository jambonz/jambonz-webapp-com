
const rNum = () => Math.floor(Math.random() * 10);

export default function generateActivationCode() {
  return `${rNum()}${rNum()}${rNum()}${rNum()}${rNum()}${rNum()}`;
}
