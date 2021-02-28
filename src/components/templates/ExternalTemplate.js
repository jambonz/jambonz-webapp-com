import Nav from '../blocks/Nav';
import styled from 'styled-components/macro';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12rem 1rem 8rem;

  ${props => props.fullPage && `
    height: calc(100vh - 20rem);
    justify-content: center;
  `}

  ${props => props.theme.mobileOnly} {
    margin: 5.5rem 1rem;
  }
`;

const ContentContainer = styled.div`
  width: ${props => props.theme.externalMaxWidth};
  max-width: 100%;
`;

const ExternalTemplate = props => (
  <>
    <Nav
      topLeft={[
        { type: 'linkExternal', text: 'jambonz',  url: 'https://www.jambonz.org',         desktopOnly: false },
      ]}
      topRight={[
        { type: 'linkExternal', text: 'Pricing',  url: 'https://www.jambonz.org/pricing', desktopOnly: true  },
        { type: 'linkExternal', text: 'Docs',     url: 'https://www.jambonz.org/docs',    desktopOnly: true  },
        { type: 'link',         text: 'Register', url: '/register',                       desktopOnly: true  },
        { type: 'link',         text: 'Sign In',  url: '/sign-in',                        desktopOnly: false },
      ]}
      drawer={[
        { type: 'linkExternal', text: 'Home',     url: 'https://www.jambonz.org'         },
        { type: 'linkExternal', text: 'Pricing',  url: 'https://www.jambonz.org/pricing' },
        { type: 'linkExternal', text: 'Docs',     url: 'https://www.jambonz.org/docs'    },
        { type: 'link',         text: 'Register', url: '/register'                       },
        { type: 'link',         text: 'Sign In',  url: '/sign-in'                        },
        { type: 'horizontal-rule' },
        { type: 'linkExternal', text: 'Terms of Service',    url: 'https://www.jambonz.org/docs/terms-of-service' },
        { type: 'linkExternal', text: 'support@jambonz.org', url: 'mailto:support@jambonz.org'                    },
      ]}
      drawerAlignment="center"
    />
    <PageContainer fullPage={props.fullPage}>
      <ContentContainer>
        {props.children}
      </ContentContainer>
    </PageContainer>
  </>
);

export default ExternalTemplate;
