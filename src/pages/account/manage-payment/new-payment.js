import React, { useState, useContext, useRef } from "react";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import { Link as ReactRouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components/macro";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import FormError from "../../../components/blocks/FormError";
import Loader from "../../../components/blocks/Loader";
import Section from "../../../components/blocks/Section";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import H2 from "../../../components/elements/H2";
import InputGroup from "../../../components/elements/InputGroup";
import Label from "../../../components/elements/Label";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";

const stripePromise = loadStripe("pk_test_EChRaX9Tjk8csZZVSeoGqNvu00lsJzjaU0");

const Form = styled.form`
  display: grid;
  grid-template-columns: auto 1fr 250px;
  grid-row-gap: 1.5rem;
  grid-column-gap: 0.75rem;
  align-items: center;

  & hr {
    margin: 0 -2rem;
    background: none;
    border: 0;
    border-top: 1px solid #c6c6c6;
    grid-column: 1 / 5;
  }
`;

const Text = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: ${(props) => (props.bold ? "600" : "normal")};
  color: #707070;
  text-align: ${(props) => props.textAlign || "left"};
`;

const StyledInputGroup = styled(InputGroup)`
  grid-column: 1 / 4;
`;

const StyledFormError = styled(FormError)`
  grid-column: 1 / 4;
`;

const CardElementsWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #b6b6b6;
  width: 100%;
  height: 36px;
  padding: 0 1rem;

  & .StripeElement {
    width: 100%;
  }
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  padding: 1rem;
  background: #ffffff55;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: center;
  align-items: center;
  padding: 2rem;
  max-width: 650px;
  background: white;
  border: 1px solid #767676;
  border-radius: 4px;
  box-shadow: 0 0.375rem 0.25rem rgba(0, 0, 0, 0.12),
    0 0 0.25rem rgba(0, 0, 0, 0.18);

  a {
    width: 100px;
    margin-top: 1.5rem;

    span {
      width: 100%;
    }
  }
`;

const cardElementsOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #B6B6B6 !important",
    },
  },
  hidePostalCode: true,
};

const NewPaymentInfo = ({ elements, stripe, edit }) => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentNameInvalid, setPaymentNameInvalid] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const paymentNameRef = useRef(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
      resetInvalidFields();
      let errorMessage = "";
      let focusHasBeenSet = false;

      if (!paymentName) {
        errorMessage = "You must input the name.";
        setPaymentNameInvalid(true);
        if (!focusHasBeenSet) {
          paymentNameRef.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (errorMessage) {
        setErrorMessage(errorMessage);
        setDisabledSubmit(true);
        return;
      }

      //=============================================================================
      // Submit
      //=============================================================================
      setPaymentLoading(true);

      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.log("[error]", error);
        setErrorMessage(
          error.message || "Something went wrong, please try again."
        );
        setPaymentLoading(false);
      } else {
        const success = await createSubscription(paymentMethod.id, cardElement);
        if (success) {
          dispatch({
            type: "ADD",
            level: "success",
            message: "Your card details have been saved.",
          });
          history.push("/account");
        }
      }
    } catch (err) {
      setPaymentLoading(false);
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
    }
  };

  const createSubscription = async (paymentMethod, cardElement) => {
    let body = {};
    let res = false;

    body = {
      action: "update-payment-method",
      payment_method_id: paymentMethod,
    };

    const result = await axios({
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE_URL,
      url: `/Subscriptions`,
      data: body,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (result.data.status === "success") {
      res = true;
    } else if (result.data.status === "action required") {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        result.data.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentName,
            },
          },
        }
      );

      if (error) {
        setPaymentLoading(false);
        setErrorMessage(
          error.message || "Something went wrong, please try again."
        );
      } else {
        if (
          paymentIntent.status === "succeeded" &&
          !paymentIntent.last_payment_error
        ) {
          res = true;
        } else {
          setPaymentLoading(false);
          setErrorMessage(
            paymentIntent.cancellation_reason ||
              "Something went wrong, please try again."
          );
        }
      }
    } else if (result.data.status === "card error") {
      setPaymentLoading(false);
      setErrorMessage(
        result.data.reason || "Something went wrong, please try again."
      );
    } else {
      setPaymentLoading(false);
      setErrorMessage("Something went wrong, please try again.");
    }

    return res;
  };

  const resetInvalidFields = () => {
    setPaymentNameInvalid(false);
  };

  return (
    <Section normalTable position="relative">
      {paymentLoading && (
        <ProgressContainer>
          <LoadingContainer direction="row">
            <Loader height="64px" />
            <Text>
              Your subscription is being processed. Please wait and do not
              hit the back button or leave this page
            </Text>
          </LoadingContainer>
        </ProgressContainer>
      )}
      <H2>New payment information</H2>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="payment_name" textAlign="right">
          Cardholder Name
        </Label>
        <Input
          name="payment_name"
          id="payment_name"
          value={paymentName}
          onChange={(e) => {
            setPaymentName(e.target.value);
            setPaymentNameInvalid(false);
            setDisabledSubmit(false);
          }}
          placeholder=""
          invalid={paymentNameInvalid}
          ref={paymentNameRef}
        />
        <div />
        <Label textAlign="right">Card</Label>
        <CardElementsWrapper>
          <CardElement options={cardElementsOptions} />
        </CardElementsWrapper>
        <div />
        {errorMessage && <StyledFormError grid message={errorMessage} />}
        <StyledInputGroup flexEnd spaced>
          <Button gray="true" as={ReactRouterLink} to="/account">
            Cancel
          </Button>
          <Button disabled={disabledSubmit || !stripe}>
            Save New Card
          </Button>
        </StyledInputGroup>
      </Form>
    </Section>
  );
};

const NewPaymentInfoContainer = ({ edit }) => {
  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ elements, stripe }) => (
          <NewPaymentInfo edit={edit} elements={elements} stripe={stripe} />
        )}
      </ElementsConsumer>
    </Elements>
  );
};

export default NewPaymentInfoContainer;
