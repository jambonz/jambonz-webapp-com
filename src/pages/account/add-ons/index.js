import InternalMain from '../../../components/blocks/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AddOnsIndex = () => {
  return (
    <InternalMain title="Add-Ons">
      <Section>
        <div><Link to="/account/add-ons/test/add">Test Add</Link></div>
        <div><Link to="/account/add-ons/test/remove">Test Remove</Link></div>
      </Section>
    </InternalMain>
  );
};

export default AddOnsIndex;
