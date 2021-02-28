import styled from 'styled-components/macro';
import InternalMain from '../components/wrappers/InternalMain';
import Section from '../components/blocks/Section';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
`;

const InvalidRoute = () => {
  return (
      <InternalMain
        type="simple"
        title="Invalid Route"
      >
        <Section>
          <Container>
            That page doesn't exist.
          </Container>
        </Section>
      </InternalMain>
  );
};

export default InvalidRoute;
