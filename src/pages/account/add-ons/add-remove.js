import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AddOnsAddRemove = () => {
  return (
    <InternalTemplate title="Add/Remove Add-On">
      <Section>
        <Link to="/account/add-ons">← Back to Add-Ons</Link>
      </Section>
    </InternalTemplate>
  );
};

export default AddOnsAddRemove;
