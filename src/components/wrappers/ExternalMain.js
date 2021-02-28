import { useContext, useEffect } from 'react';
import { CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import H1 from '../../components/elements/H1';
import Section from '../../components/blocks/Section';

const ExternalMain = props => {
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  useEffect(() => {
    setCurrentMenu(null);
    document.title = `${props.title} | jambonz`;
  });

  return (
    <>
      <H1 external>{props.title}</H1>
      <Section>
        {props.children}
      </Section>
    </>
  );
};

export default ExternalMain;
