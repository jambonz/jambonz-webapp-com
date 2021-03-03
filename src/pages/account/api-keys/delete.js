import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import P from '../../../components/elements/P';
import Button from '../../../components/elements/Button';
import InputGroup from '../../../components/elements/InputGroup';

const ApiKeyDelete = () => {
  return (
    <InternalMain title="Delete API Key" topMenu={{ label: "← Back to Account Home", link: "/account" }}>
      <Section>
        <P>Are you sure you want to delete this API key? This cannot be undone, but you can always create new API keys.</P>
        <InputGroup flexEnd spaced>
          <Button gray="true">Cancel</Button>
          <Button>Delete</Button>
        </InputGroup>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyDelete;
