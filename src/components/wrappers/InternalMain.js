import { useEffect, useContext } from 'react';
import styled from 'styled-components/macro';
import { CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import H1 from '../elements/H1';
import AddButton from '../elements/AddButton';
import Breadcrumbs from '../blocks/Breadcrumbs';

const PageMain = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem);
  width: calc(100% - 15rem);
  margin-top: 4rem;
  padding: 2.5rem 3rem;
  overflow: auto;

  ${props => props.theme.mobileOnly} {
    width: 100%;
    padding: 1.5rem 1rem;
  }
`;

const TopSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.centerVertical ? 'center' : 'flex-start'};
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  margin: 1rem 0 0;
`;

const ContentContainer = styled.div`
  ${props => props.type === 'form' && `
    max-width: 61rem;
  `}
  ${props => props.type === 'fullWidthTable' && `
    flex-grow: 1;
    margin: 0 -3rem -2.5rem;
  `}

  ${props => props.theme.mobileOnly} {
    ${props => (
      props.type === 'normalTable' ||
      props.type === 'fullWidthTable'
    ) && `
      flex-grow: 1;
      margin: 0 -1rem -1.5rem;
    `}
  }
`;

const InternalMain = props => {
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  useEffect(() => {
    setCurrentMenu(null);
    document.title = `${props.metaTitle || props.title} | jambonz`;
  }, [ setCurrentMenu, props.metaTitle, props.title ]);

  return (
    <PageMain type={props.type}>
      {props.breadcrumbs && (
        <Breadcrumbs breadcrumbs={props.breadcrumbs} />
      )}
      <TopSection type={props.type} centerVertical={!props.subtitle}>
        <div>
          <H1>{props.title}</H1>
          {props.subtitle
            ? <Subtitle>{props.subtitle}</Subtitle>
            : null
          }
        </div>
        {props.addButtonText && (
          <AddButton
            addButtonText={props.addButtonText}
            to={props.addButtonLink}
          />
        )}
      </TopSection>
      <ContentContainer
        type={props.type}
      >
        {props.children}
      </ContentContainer>
    </PageMain>
  );
};

export default InternalMain;
