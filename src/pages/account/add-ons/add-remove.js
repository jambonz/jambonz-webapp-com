import InternalMain from '../../../components/wrappers/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AddOnsAddRemove = () => {
  return (
    <InternalMain title="Add/Remove Add-On">
      <Section>
        <Link to="/account/add-ons">← Back to Add-Ons</Link>
      </Section>
    </InternalMain>
  );
};

export default AddOnsAddRemove;
