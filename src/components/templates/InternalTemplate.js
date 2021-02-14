import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import styled from 'styled-components/macro';
import H1 from '../elements/H1';
import AddButton from '../elements/AddButton';
import Breadcrumbs from '../blocks/Breadcrumbs';

const PageMain = styled.main`
  height: calc(100vh - 4rem);
  width: calc(100% - 15rem);
  overflow: auto;
  ${props => props.type === 'fullWidthTable' ? `
    display: flex;
    flex-direction: column;
    padding-top: 2.5rem;
  ` : `
    padding: 2.5rem 3rem;
  `};
`;

const TopSection = styled.section`
  ${props => props.type === 'fullWidthTable' && `
    padding: 0 3rem;
  `}
`;

const Subtitle = styled.p`
  margin: -0.5rem 0 1.5rem;
`;

const ContentContainer = styled.div`
  ${props => props.type === 'form' && `
    max-width: 61rem;
  `}
  ${props => props.type === 'fullWidthTable' && `
    flex-grow: 1;
  `}
`;

const InternalTemplate = props => {
  const history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      history.push('/');
      dispatch({
        type: 'ADD',
        level: 'error',
        message: 'You must log in to view that page.',
      });
    }
  }, [history, dispatch]);

  return (
    <PageMain type={props.type}>
      {props.breadcrumbs && (
        <Breadcrumbs breadcrumbs={props.breadcrumbs} />
      )}
      <TopSection type={props.type}>
        <H1>{props.title}</H1>
        {props.addButtonText && (
          <AddButton
            addButtonText={props.addButtonText}
            to={props.addButtonLink}
          />
        )}
        {props.subtitle
          ? <Subtitle>{props.subtitle}</Subtitle>
          : null
        }
      </TopSection>
      <ContentContainer
        type={props.type}
      >
        {props.children}
      </ContentContainer>

      {props.additionalTable && (
        <ContentContainer>
          {props.additionalTable}
        </ContentContainer>
      )}
    </PageMain>
  );
};

export default InternalTemplate;
