import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const AddOnsIndex = () => {
  return (
    <InternalTemplate title="Add-Ons">
      <div><Link to="/account/add-ons/test/add">Test Add</Link></div>
      <div><Link to="/account/add-ons/test/remove">Test Remove</Link></div>
    </InternalTemplate>
  );
};

export default AddOnsIndex;
