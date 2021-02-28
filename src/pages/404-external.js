import styled from 'styled-components/macro';
import Section from '../components/blocks/Section';
import H1 from '../components/elements/H1';
import Link from '../components/elements/Link';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
`;

const InvalidRoute = () => {
  return (
    <>
      <H1 external>Invalid Route</H1>
      <Section>
        <Container>
          <p>That page doesn't exist.</p>
          <p><Link to="/">Log In</Link></p>
        </Container>
      </Section>
    </>
  );
};

export default InvalidRoute;
