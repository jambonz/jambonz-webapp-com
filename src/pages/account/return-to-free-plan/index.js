import React, { useState, useContext } from "react";
import axios from "axios";
import { Link as ReactRouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";

import InternalMain from "../../../components/wrappers/InternalMain";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import Section from "../../../components/blocks/Section";
import P from "../../../components/elements/P";
import Button from "../../../components/elements/Button";
import InputGroup from "../../../components/elements/InputGroup";
import FormError from "../../../components/blocks/FormError";
import Loader from "../../../components/blocks/Loader";

const ReturnToFreePlan = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const description = `Returning to the free plan will reduce your capacity to a maximum of 1 simultaneous call session and 1 registered device. Your current plan and capacity will continue through the rest of the billing cycle and your plan change will take effect at the beginning of the next billing cycle. Are you sure you want to continue?`;

  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const history = useHistory();

  const downloadToFreePlan = async () => {
    try {
      setErrorMessage("");
      setShowLoader(true);

      await axios({
        method: "post",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Subscriptions`,
        data: {
          action: "downgrade-to-free",
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setShowLoader(false);
      history.push("/account");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        history.push("/");
        dispatch({
          type: "ADD",
          level: "error",
          message: "Your session has expired. Please log in and try again.",
        });
      } else {
        setErrorMessage(
          (err.response && err.response.data && err.response.data.msg) ||
            "Something went wrong, please try again."
        );
        console.error(err.response || err);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const StyledInputGroup = styled(InputGroup)`
    @media (max-width: 575px) {
      flex-direction: column;

      & > * {
        width: 100%;

        &:first-child {
          margin-right: 0;
          margin-bottom: 1rem;
        }

        span {
          width: 100%;
        }
      }
    }
  `;

  return (
    <InternalMain
      title="Return to Free Plan"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section position="relative">
        {showLoader ? (
          <Loader height="116px" />
        ) : (
          <>
            <P>{description}</P>
            <StyledInputGroup flexEnd spaced>
              <Button gray="true" as={ReactRouterLink} to="/account/settings">
                Cancel
              </Button>
              <Button onClick={downloadToFreePlan}>Return to Free Plan</Button>
            </StyledInputGroup>
            {errorMessage && <FormError grid message={errorMessage} />}
          </>
        )}
      </Section>
    </InternalMain>
  );
};

export default ReturnToFreePlan;
