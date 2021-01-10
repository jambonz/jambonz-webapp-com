import styled from 'styled-components/macro';
import SetupTemplate from '../components/templates/SetupTemplate';
import Link from '../components/elements/Link';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
`;

const InvalidRoute = () => {
  return (
    <SetupTemplate title="Invalid Route">
      <Container>
        <p>That page doesn't exist.</p>
        <p><Link to="/">Log In</Link></p>
      </Container>
    </SetupTemplate>
  );
};

export default InvalidRoute;
