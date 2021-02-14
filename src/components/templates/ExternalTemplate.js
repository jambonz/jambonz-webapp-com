import React from 'react';
import styled from 'styled-components/macro';
import H1 from '../elements/H1';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8rem 1rem;
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
  <PageContainer>
    <StyledH1>{props.title}</StyledH1>
    {props.subtitle
      ? <Subtitle>{props.subtitle}</Subtitle>
      : null
    }
    <ContentContainer wide={props.wide}>
      {props.children}
    </ContentContainer>
  </PageContainer>
);

export default ExternalTemplate;
