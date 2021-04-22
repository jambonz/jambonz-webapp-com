import { useEffect, useContext } from 'react';
import { ModalDispatchContext } from '../../contexts/ModalContext';
import styled from 'styled-components/macro';
import Button from '../elements/Button';
import Loader from '../blocks/Loader';
import PropTypes from "prop-types";
import H1 from "../elements/H1";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 90;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  max-height: calc(100% - 2rem);
  max-width: 700px;
  overflow: auto;
  margin: 1rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #FFF;
  & h1 {
    margin-top: 0;
    font-size: 1.25rem;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: -1.5rem;
  height: 100%;
  width: calc(100% + 3rem);
  background: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  ${props => props.normalPadding ? `
    margin-top: 1rem;
  ` : `
    margin: 1rem -0.5rem -0.5rem 0;
  `}
  & > * {
    margin-left: 1rem;
  }
`;

const Modal = props => {

  // Handle modal context, which tells other elements to be disabled while modal is open
  const setModalOpen = useContext(ModalDispatchContext);
  useEffect(() => {
    setModalOpen(true);
    return () => setModalOpen(false);
  });

  // Lock scroll on desktop and Android
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  });

  // Lock scroll on iOS
  useEffect(() => {
    const stopTouchScroll = e => e.preventDefault();
    window.addEventListener('touchmove', stopTouchScroll);
    return () => window.removeEventListener('touchmove', stopTouchScroll);
  });

  // Close modal on Escape
  useEffect(() => {
    const closeOnEsc = e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        props.handleCancel();
      }
    };
    window.addEventListener('keydown', closeOnEsc);
    return () => window.removeEventListener('keydown', closeOnEsc);
  });

  return (
    <Overlay onClick={() => props.maskClosable && props.handleCancel()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <H1 bold>{props.title}</H1>
        <ContentContainer>
          {props.content}
          {!props.hideButtons && (
            <ButtonContainer normalPadding={props.normalButtonPadding}>
              <Button
                rounded="true"
                inModal
                gray
                onClick={props.handleCancel}
              >
                {props.closeText || "Cancel"}
              </Button>
              {props.actionText && (
                <Button
                  rounded="true"
                  inModal
                  disabled={props.loader}
                  onClick={props.handleSubmit}
                >
                  {props.actionText}
                </Button>
              )}
            </ButtonContainer>
          )}
          {props.loader && (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          )}
        </ContentContainer>
      </ModalContainer>
    </Overlay>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  hideButtons: PropTypes.bool,
  normalButtonPadding: PropTypes.bool,
  maskClosable: PropTypes.bool,
  closeText: PropTypes.string,
  actionText: PropTypes.string,
  loader: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
};

Modal.defaultProps = {
  title: "",
  content: "",
  hideButtons: false,
  normalButtonPadding: false,
  maskClosable: true,
  closeText: "",
  actionText: "",
  loader: false,
  handleSubmit: () => {},
  handleCancel: () => {},
};

export default Modal;
