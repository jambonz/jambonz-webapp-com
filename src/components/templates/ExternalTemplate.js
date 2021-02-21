import React from 'react';
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
`;

const Subtitle = styled.div`
  margin: -0.25rem 0 0.25rem;
  text-align: center;
`;

const ContentContainer = styled.div`
  width: ${props => props.wide
    ? '61rem'
    : '32rem'
  };
  @media (max-width: ${props => props.wide
    ? '61rem'
    : '32rem'
  }) {
    width: 100%;
  }
  margin-top: 1.25rem;
  ${props => props.wide && `
    min-width: 58rem;
  `}
  @media (max-width: 58rem) {
    align-self: flex-start;
  }
  @media (max-width: 34rem) {
    width: 100%;
  }
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
      {props.subtitle
        ? <Subtitle>{props.subtitle}</Subtitle>
        : null
      }
      <ContentContainer wide={props.wide}>
        {props.children}
      </ContentContainer>
    </PageContainer>
  </>
);

export default ExternalTemplate;
