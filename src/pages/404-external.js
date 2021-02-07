import styled from 'styled-components/macro';
import ExternalTemplate from '../components/templates/ExternalTemplate';
import Link from '../components/elements/Link';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
`;

const InvalidRoute = () => {
  return (
    <ExternalTemplate title="Invalid Route">
      <Container>
        <p>That page doesn't exist.</p>
        <p><Link to="/">Log In</Link></p>
      </Container>
    </ExternalTemplate>
  );
};

export default InvalidRoute;
