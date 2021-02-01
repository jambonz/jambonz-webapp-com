import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const PhoneNumbersIndex = () => {
  return (
    <InternalTemplate title="Phone Numbers">
      <Link to="/account/phone-numbers/add">Add Phone Number</Link>
    </InternalTemplate>
  );
};

export default PhoneNumbersIndex;
