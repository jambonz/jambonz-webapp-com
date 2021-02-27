import Nav from '../blocks/Nav';
import styled from 'styled-components/macro';
import H1 from '../elements/H1';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8rem 1rem;

  ${props => props.fullPage && `
    height: calc(100vh - 20rem);
    justify-content: center;
  `}
`;

const StyledH1 = styled(H1)`
  text-align: center;
  margin-bottom: 3rem;
`;

const ContentContainer = styled.div`
  width: 32rem;
  max-width: 100%;
`;

const ExternalTemplate = props => (
  <>
    <Nav
      topLeft={[
        { type: 'linkExternal', text: 'jambonz', url: 'https://www.jambonz.org' },
      ]}
      topRight={[
        { type: 'linkExternal', text: 'Pricing',  url: 'https://www.jambonz.org/pricing' },
        { type: 'linkExternal', text: 'Docs',     url: 'https://www.jambonz.org/docs'    },
        { type: 'link',         text: 'Register', url: '/register'                       },
        { type: 'link',         text: 'Sign In',  url: '/sign-in'                        },
      ]}
    />
    <PageContainer fullPage={props.fullPage}>
      {props.title && (
        <StyledH1>{props.title}</StyledH1>
      )}
      <ContentContainer>
        {props.children}
      </ContentContainer>
    </PageContainer>
  </>
);

export default ExternalTemplate;
