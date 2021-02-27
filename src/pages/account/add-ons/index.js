import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AddOnsIndex = () => {
  return (
    <InternalTemplate title="Add-Ons">
      <Section>
        <div><Link to="/account/add-ons/test/add">Test Add</Link></div>
        <div><Link to="/account/add-ons/test/remove">Test Remove</Link></div>
      </Section>
    </InternalTemplate>
  );
};

export default AddOnsIndex;
