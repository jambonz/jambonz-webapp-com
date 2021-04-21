import { useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import { ModalStateContext } from '../../contexts/ModalContext';
import styled from 'styled-components/macro';

const StyledButton = styled.button`
  display: inline-flex;
  padding: 0;
  border: ${props => props.border ? 'solid 2px #da1c5c' : '0'};
  outline: 0;
  background: none;
  cursor: pointer;
  border-radius: ${props => props.rounded ? '30px' : '0.25rem'};
  grid-column: 2;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.font || "16px"};

  ${props => props.fullWidth
    ? `width: 100%;`
    : `justify-self: start;`
  }

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    outline: 0;
    height: ${props => props.size === "small" ? "2rem" : '3rem'};
    ${props => props.fullWidth && `
      width: 100%;
    `}
    ${props => props.square
      ? `width: 2.25rem;`
      : props.size === "small" ? `padding: 0 27px;` : `padding: 0 2rem;`
    }
    border-radius: ${props => props.rounded ? '30px' : '0.25rem'};
    background: ${
      props => props.text || props.hollow
        ? 'none'
        : props.gray
          ? '#E3E3E3'
          : '#D91C5C'
    };
    color: ${
      props => props.gray
        ? '#565656'
        : props.text || props.hollow
          ? '#D91C5C'
          : '#FFF'
    };
  }

  &:focus > span {
    box-shadow: ${props => props.text
                  ? ''
                  : '0 0.125rem 0.25rem rgba(0,0,0,0.12),'
                }
                inset 0 0 0
                ${props => props.text
                  ? '0.125rem'
                  : '0.25rem'
                }
                ${props => props.gray
                  ? '#767676'
                  : '#890934'
                };
  }

  &:hover:not([disabled]) > span {
    background: ${props => {
      if (props.hollow) {
        return '#da1c5c';
      } else if (props.text) {
        return '#E3E3E3';
      } else if (props.gray) {
        return '#C6C6C6';
      }
      return '#BD164E';
    }};
    color: ${
      props => props.gray
        ? '#565656'
        : props.text || props.hollow
          ? '#FFF'
          : '#FFF'
    };
  }

  &:active:not([disabled]) > span  {
    background: ${props => {
      if (props.hollow) {
        return '#da1c5c';
      } else if (props.text) {
        return '#E3E3E3';
      } else if (props.gray) {
        return '#C6C6C6';
      }
      return '#BD164E';
    }};
    color: ${
      props => props.gray
        ? '#565656'
        : props.text || props.hollow
          ? '#FFF'
          : '#FFF'
    };
  }

  ${props => props.formLink && `
    justify-self: start;

    & > span {
      height: auto;
      padding: 0;
    }

    &:focus > span {
      padding: 0.25rem;
      margin: -0.25rem;
      border-radius: 0.25rem;
      box-shadow: 0 0 0 0.125rem #D91C5C;
    }

    &:hover:not([disabled]) > span,
    &:active:not([disabled]) > span {
      background: none;
      box-shadow: 0 0.125rem 0 #D91C5C;
      border-radius: 0;
      color: #D91C5C;
    }

    &:active > span {
      background: none;
    }
  `}

  ${props => props.tableHeaderLink && `
    & > span {
      padding: 0;
    }

    &:focus > span,
    &:hover:not([disabled]) > span,
    &:active:not([disabled]) > span {
      padding: 0.625rem;
      margin: -0.625rem;
    }

    & > span > *:last-child {
      color: #8F8F8F;
      margin-left: 1rem;
    }
  `}

  ${props => props.right && `
    justify-self: end;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;

  }

  //=============================================================================
  // Table Menu (3 dots on right of each row)
  //=============================================================================
  ${props => props.tableMenu && `
    border-radius: 50%;
    overflow: hidden;

    & > span {
      height: 3rem;
      width: 3rem;
      padding: 0;
      border-radius: 50%;
      outline: 0;
      background: ${props.selected
        ? '#E3E3E3'
        : 'none'
      };
      fill: #767676;

      ${props.theme.mobileOnly} {
        height: 2rem;
        width: 2rem;
      }
    }

    &:focus > span {
      border: 2px solid #D91C5C;
      background: ${props.selected
        ? 'RGBA(217, 28, 92, 0.15)'
        : 'none'
      };
      fill: #D91C5C;
      box-shadow: none;
    }

    &:hover:not([disabled]) > span,
    &:active:not([disabled]) > span {
      background: ${props.selected
        ? 'RGBA(217, 28, 92, 0.15)'
        : 'none'
      };
      fill: #D91C5C;
    }
  `}

  //=============================================================================
  // "Check All" button for bulk editing in table
  //=============================================================================
  ${props => props.checkbox && `
    position: relative;
    display: block;

    & > span {
      width: 1.5rem;
      height: 1.5rem;
      border: 1px solid #A5A5A5;
      border-radius: 0.125rem;
      background: #FFF;
      padding: 0;
    }

    &:focus > span {
      border-color: #565656;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.12);
    }

    &:hover:not([disabled]) > span,
    &:active:not([disabled]) > span  {
      background: none;
    }
  `}

  ${props => (props.checkbox === 'all' || props.checkbox === 'partial') && `
    & > span,
    &:hover:not([disabled]) > span {
      background: #D91C5C;
      border-color: #D91C5C;
    }

    &:focus > span {
      border: 3px solid #890934;
    }
  `}

  ${props => props.checkbox === 'all' && `
    &::after {
      content: '';
      position: absolute;
      top: 0.35rem;
      left: 0.25rem;
      height: 8px;
      width: 15px;
      border-left: 2px solid #FFF;
      border-bottom: 2px solid #FFF;
      transform: rotate(-45deg);
    }
  `}

  ${props => props.checkbox === 'partial' && `
    &::after {
      content: '';
      position: absolute;
      top: 0.6875rem;
      left: 0.1875rem;
      height: 0.125rem;
      width: 1.125rem;
      background: #FFF;
    }
  `}

  ${props => props.navMenuButton && `
    display: none;

    & > span {
      height: 2.5rem;
      width: 2.5rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    ${props.theme.mobileOnly} {
      display: block;
    }
  `}

  ${props => props.close && `
    align-self: flex-end;
    margin: -1.5rem -1.25rem 0 0;
    & > span {
      height: 3rem;
      width: 3rem;
      padding: 0;
    }
  `}

  ${props => props.desktopOnly && `
    ${props.theme.mobileOnly} {
      display: none;
    }
  `}
`;

const Button = (props, ref) => {
  const modalOpen = useContext(ModalStateContext);
  const buttonRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      buttonRef.current.focus();
    }
  }));
  return (
    <StyledButton
      {...props}
      ref={buttonRef}
      disabled={(modalOpen && !props.inModal) || props.disabled}
    >
      <span tabIndex="-1">
        {props.children}
      </span>
    </StyledButton>
  );
};

export default forwardRef(Button);
