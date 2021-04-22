import { Link as ReactRouterLink } from "react-router-dom";
import styled from "styled-components/macro";

import InternalMain from "../../../components/wrappers/InternalMain";
import P from "../../../components/elements/P";
import Section from "../../../components/blocks/Section";
import Copy from "../../../components/elements/Copy";
import Button from "../../../components/elements/Button";
import InputGroup from "../../../components/elements/InputGroup";

const StyledInputGroup = styled(InputGroup)`
  @media (max-width: 575px) {
    & > * {
      width: 100%;

      span {
        width: 100%;
      }
    }
  }
`;

const ApiKeyNew = (props) => {
  const { token } = props.location.state || {};
  return (
    <InternalMain
      title="New API Key"
      breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
    >
      <Section>
        <P>
          Below is your new API key. To view this key in the future, go to the
          API Keys section of your account home page.
        </P>
        <P>
          {token} <Copy title="API Key" value={token} />
        </P>
        <StyledInputGroup flexEnd spaced>
          <Button
            rounded="true"
            as={ReactRouterLink}
            to="/account"
            gray="true"
          >
            Back to Account Home
          </Button>
        </StyledInputGroup>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyNew;
