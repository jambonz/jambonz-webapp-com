import styled from 'styled-components/macro';
import InternalTemplate from '../components/templates/InternalTemplate';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
`;

const InvalidRoute = () => {
  return (
      <InternalTemplate title="Invalid Route">
        <Container>
          That page doesn't exist.
        </Container>
      </InternalTemplate>
  );
};

export default InvalidRoute;
