import styled from 'styled-components/macro';
import Link from '../../components/elements/Link';
import { ReactComponent as CheckGreen } from '../../images/CheckGreen.svg';

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Li = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Span = styled.span`
  margin-right: 0.75rem;
`;

const EmptyCircle = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  border: 1px solid #B6B6B6;
  border-radius: 50%;
`;

const AccountSetupList = () => {
  return (
    <Ul>
      <Li>
        <Span>
          <CheckGreen style={{ display: 'block' }} aria-label="complete" />
        </Span>
        <span>Add a <Link to="/account/carriers">carrier</Link> to route calls</span>
      </Li>
      <Li>
        <Span>
          <EmptyCircle aria-label="incomplete" />
        </Span>
        <span>
          Add <Link to="/account/speech-services">speech</Link> credentials for
          text-to-speech and speech-to-text
        </span>
      </Li>
      <Li>
        <Span>
          <EmptyCircle aria-label="incomplete" />
        </Span>
        <span>
          Create an <Link to="/account/applications">application</Link> to
          handle call routing
        </span>
      </Li>
      <Li>
        <Span>
          <EmptyCircle aria-label="incomplete" />
        </Span>
        <span>
          Add a <Link to="/account/phone-numbers">phone number</Link> to receive calls
        </span>
      </Li>
    </Ul>
  );
};

export default AccountSetupList;