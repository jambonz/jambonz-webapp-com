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
  padding: ${props => props.fullWidthTable ? '2.5rem 0 0' : '2.5rem 3rem'};
  ${props => props.fullWidthTable ? `
    display: flex;
    flex-direction: column;
  ` : ``};
`;

const TopSection = styled.section`
  ${props => props.fullWidthTable ? `
    padding: 0 3rem;
  ` : ``}
`;

const ContentContainer = styled.div`
  margin-top: 1.5rem;
  background: #FFF;
  ${props => props.fullWidthTable ? '' : 'border-radius: 0.5rem;'}
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.1),
  0px 0px 0.25rem rgba(0, 0, 0, 0.1);
  ${props => props.type === 'form' &&
    'max-width: 61rem;'
  }
  ${props => props.fullWidthTable ? '' : `
    min-width: ${props => props.type === 'form'
      ? '58rem'
      : '38rem'
    };
  `}

  @media (max-width: 34rem) {
    width: 100%;
  }
  ${props => props.fullWidthTable ? `
    flex-grow: 1;
    overflow: auto;
  ` : ``}
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
    <PageMain fullWidthTable={props.fullWidthTable}>
      {props.breadcrumbs && (
        <Breadcrumbs breadcrumbs={props.breadcrumbs} />
      )}
      <TopSection fullWidthTable={props.fullWidthTable}>
        <H1>{props.title}</H1>
        {props.addButtonText && (
          <AddButton
            addButtonText={props.addButtonText}
            to={props.addButtonLink}
          />
        )}
        {props.subtitle
          ? <div>{props.subtitle}</div>
          : null
        }
      </TopSection>
      <ContentContainer
        type={props.type}
        fullWidthTable={props.fullWidthTable}
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
