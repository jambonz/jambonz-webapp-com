import React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as Chevron } from '../../images/Chevron.svg';
import Link from '../elements/Link';

const BreadcrumbsContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
`;

/*
 * Breadcrumbs can be used for either a series of links at the top of the page
 * or as a single "Back" link with an arrow. Pass a prop called breadcrumbs as
 * an array. If there is one item in the array it will be treated as a back
 * button. If there are multiple items it will be treated as breadcrumbs.
 */

const Breadcrumbs = props => {
  return (
    <BreadcrumbsContainer>
      {props.breadcrumbs.length === 1 ? (
        <Link to={props.breadcrumbs[0].url}>← {props.breadcrumbs[0].name}</Link>
      ) : (
        props.breadcrumbs.map((b, i) => (
          b.url ? (
            <React.Fragment key={i}>
              <Link to={b.url}>{b.name}</Link>
              <Chevron style={{ margin: '0 0.75rem' }} />
            </React.Fragment>
          ) : (
            <span key={i}>{b.name}</span>
          )
      )))}
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;
