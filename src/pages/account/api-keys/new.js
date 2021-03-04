import { Link as ReactRouterLink } from 'react-router-dom';
import InternalMain from '../../../components/wrappers/InternalMain';
import P from '../../../components/elements/P';
import Section from '../../../components/blocks/Section';
import Copy from '../../../components/elements/Copy';
import Button from '../../../components/elements/Button';
import InputGroup from '../../../components/elements/InputGroup';

const ApiKeyNew = (props) => {
  const { token } = props.location.state || {};
  return (
    <InternalMain title="New API Key" topMenu={{ label: "← Back to Account Home", link: "/account" }}>
      <Section>
        <P>Below is your new API key. To view this key in the future, go to the API Keys section of your account home page.</P>
        <P>{token} <Copy title="API Key" value={token} /></P>
        <InputGroup flexEnd spaced>
          <Button as={ReactRouterLink} to="/account" gray="true" disabled={true}>Back to Account Home</Button>
        </InputGroup>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyNew;
