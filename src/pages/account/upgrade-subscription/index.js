import React, { useState, useContext, useRef, useEffect } from "react";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import { Link as ReactRouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components/macro";

import FormError from "../../../components/blocks/FormError";
import Loader from "../../../components/blocks/Loader";
import Section from "../../../components/blocks/Section";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import InputGroup from "../../../components/elements/InputGroup";
import Label from "../../../components/elements/Label";
import InternalMain from "../../../components/wrappers/InternalMain";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import CurrencySymbol from "../../../data/CurrencySymbol";

const Form = styled.form`
  display: grid;
  grid-template-columns: 190px 1fr 150px 100px;
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

  & > div {
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
  grid-column: 1 / 5;
`;

const StyledFormError = styled(FormError)`
  grid-column: 1 / 5;
`;

const StyledRow = styled.div`
  grid-column: 1 / 5;
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
  margin: 0 auto 9rem;
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

const UpgradeSubscription = ({ elements, stripe }) => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  const [showLoader, setShowLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [stripeCustomerId, setStripeCustomerId] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentNameInvalid, setPaymentNameInvalid] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState({});

  const paymentNameRef = useRef(null);

  const refArray = {
    voice_call_session: useRef(null),
    device: useRef(null),
    api_rate: useRef(null),
  };

  // subscription categories
  const [serviceData, setServiceData] = useState([
    {
      category: "voice_call_session",
      service: "Maximum concurrent call sessions",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 10,
      max: 1000,
    },
    {
      category: "device",
      service: "Maximum concurrent device registrations",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 1,
      max: 200,
    },
    {
      category: "api_rate",
      service: "Maximum number of API calls per minute",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 6,
      max: 180,
    },
  ]);

  const initFeesAndCost = (priceData) => {
    serviceData.forEach((service) => {
      const record = priceData.find(
        (item) => item.category === service.category
      );

      if (record) {
        const price = record.prices.find(
          (item) => item.currency === service.currency
        );

        if (price) {
          let fees = "";
          switch (price.billing_scheme) {
            case "per_unit":
              fees = (parseInt(price.unit_amount, 10) * 1) / 100;
              break;
            case "tiered":
              service.tiers = price.tiers;
              if (typeof price.tiers[0].flat_amount === "number") {
                fees = price.tiers[0].flat_amount / 100;
              } else {
                fees = price.tiers[0].unit_amount / 100;
              }
              break;
            default:
              break;
          }
          service.billing_scheme = price.billing_scheme;
          service.stripe_price_id = price.stripe_price_id;
          service.unit_label = record.unit_label;
          service.product_sid = record.product_sid;
          service.stripe_product_id = record.stripe_product_id;
          service.fees = fees;
          service.feesLabel = `${CurrencySymbol[service.currency]}${fees} per ${
            record.unit_label.slice(0, 3) === "per"
              ? record.unit_label.slice(3)
              : record.unit_label
          }`;
        }
      }
    });

    setServiceData([...serviceData]);
  };

  const handleSubmit = async (e) => {
    let isMounted = true;

    try {
      e.preventDefault();
      setErrorMessage("");
      resetInvalidFields();
      let errorMessages = [];
      let focusHasBeenSet = false;

      let services = [...serviceData];
      services.forEach((service, index) => {
        const capacityNum = parseInt(service.capacity || "0", 10);
        if (capacityNum < service.min || capacityNum > service.max) {
          errorMessages.push(
            `"${service.service}" must be greater than or equal to ${service.min}, less than or equal to ${service.max}.`
          );
          services[index] = { ...services[index], invalid: true };
          if (!focusHasBeenSet) {
            refArray[service.category].focus();
            focusHasBeenSet = true;
          }
        } else {
          services[index] = { ...services[index], invalid: false };
        }
      });
      setServiceData(services);

      if (!paymentName) {
        errorMessages.push("You must input the name.");
        setPaymentNameInvalid(true);
        if (!focusHasBeenSet) {
          paymentNameRef.current.focus();
          focusHasBeenSet = true;
        }
      }

      // remove duplicate error messages
      for (let i = 0; i < errorMessages.length; i++) {
        for (let j = 0; j < errorMessages.length; j++) {
          if (i >= j) continue;
          if (errorMessages[i] === errorMessages[j]) {
            errorMessages.splice(j, 1);
            j = j - 1;
          }
        }
      }
      if (errorMessages.length > 1) {
        setErrorMessage(errorMessages);
        setDisabledSubmit(true);
        return;
      } else if (errorMessages.length === 1) {
        setErrorMessage(errorMessages[0]);
        setDisabledSubmit(true);
        return;
      }

      //=============================================================================
      // Submit
      //=============================================================================
      setPaymentLoading(true);
      setPaymentSuccess(false);

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
        await createSubscription(paymentMethod.id);
        setPaymentSuccess(true);
      }
    } catch (err) {
      setPaymentLoading(false);
      setPaymentSuccess(false);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        isMounted = false;
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
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  const createSubscription = async (paymentMethod) => {
    const body = {
      action: "upgrade-to-paid",
      payment_method_id: paymentMethod,
      stripe_customer_id: stripeCustomerId,
      products: serviceData.map((service) => ({
        price_id: service.stripe_price_id,
        product_sid: service.product_sid,
        quantity: service.capacity,
      })),
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
      setPaymentResult(result.data);
    } else if (result.data.status === "action required") {
      const cardElement = elements.getElement(CardElement);
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
        setPaymentSuccess(false);
        setErrorMessage(
          error.message || "Something went wrong, please try again."
        );
      } else {
        if (
          paymentIntent.status === "succeeded" &&
          !paymentIntent.last_payment_error
        ) {
          const result = await axios({
            method: "get",
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Invoices`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          setPaymentResult({
            chargedAmount: result.data.total,
            currency: result.data.currency,
            statementDescriptor: result.data.customer_name,
          });
        } else {
          setPaymentLoading(false);
          setPaymentSuccess(false);
          setErrorMessage(
            paymentIntent.cancellation_reason ||
              "Something went wrong, please try again."
          );
        }
      }
    }
  };

  const resetInvalidFields = () => {
    setServiceData((prev) => {
      prev.forEach((service) => {
        service.invalid = false;
      });
      return prev;
    });
    setPaymentNameInvalid(false);
  };

  const handleServiceData = (index, field, value) => {
    setServiceData((prev) => {
      if (isNaN(value)) {
        prev[index] = {
          ...prev[index],
          invalid: true,
        };
        addErrorMessage(`"${prev[index].service}" should be number.`);
      } else {
        const [fees, feesLabel, cost] = getServicePrice(prev[index], value);
        prev[index] = {
          ...prev[index],
          [field]: value,
          invalid: false,
          fees,
          feesLabel,
          cost,
        };
        removeErrorMessage(`"${prev[index].service}" should be number.`);
      }
      return [...prev];
    });
    setDisabledSubmit(false);
  };

  const getServicePrice = (service, capacity) => {
    let fees = 0;
    let feesLabel = "";
    let cost = 0;
    const capacityNum = parseInt(capacity || "0", 10);
    if (service.billing_scheme === "per_unit") {
      fees = service.fees;
      cost = fees * capacityNum;
    } else if (service.billing_scheme === "tiered") {
      const filteredTiers = service.tiers.filter(
        (item) => !item.up_to || item.up_to >= capacityNum
      );
      if (filteredTiers.length) {
        const tier = filteredTiers[0];
        if (typeof tier.flat_amount === "number") {
          fees = tier.flat_amount / 100;
          cost = fees;
        } else {
          fees = tier.unit_amount / 100;
          cost = fees * capacityNum;
        }
      }
    }
    feesLabel = `${CurrencySymbol[service.currency]}${fees} per ${
      service.unit_label.slice(0, 3) === "per"
        ? service.unit_label.slice(3)
        : service.unit_label
    }`;

    return [fees, feesLabel, cost];
  };

  const addErrorMessage = (error) => {
    setErrorMessage((prev) => {
      if (typeof prev === "object" && prev.length) {
        const index = prev.findIndex((item) => item === error);
        if (index < 0) {
          prev.push(error);
        }
      } else {
        prev = prev && prev !== error ? [prev, error] : error;
      }
      return prev;
    });
  };

  const removeErrorMessage = (error) => {
    setErrorMessage((prev) => {
      if (typeof prev === "object" && prev.length) {
        const index = prev.findIndex((item) => item === error);
        if (index >= 0) {
          prev = [...prev.slice(0, index), ...prev.slice(index + 1)];
          prev = prev.length ? prev : "";
        }
      } else {
        if (prev === error) {
          prev = "";
        }
      }
      return prev;
    });
  };

  const handleRefs = (category, ref) => {
    refArray[category] = ref;
  };

  useEffect(() => {
    setTotal(serviceData.reduce((res, service) => res + service.cost || 0, 0));
  }, [serviceData]);

  useEffect(() => {
    let isMounted = true;

    const getPriceInfo = async () => {
      try {
        const pricePromise = axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Prices`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const stripePromise = axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/StripeCustomerId`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const [priceResult, stripeResult] = await Promise.all([
          pricePromise,
          stripePromise,
        ]);

        initFeesAndCost(priceResult.data);
        setStripeCustomerId(stripeResult.data.stripe_customer_id);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          isMounted = false;
          history.push("/");
          dispatch({
            type: "ADD",
            level: "error",
            message: "Your session has expired. Please log in and try again.",
          });
        } else {
          setErrorMessage("Something went wrong, please try again.");
          dispatch({
            type: "ADD",
            level: "error",
            message:
              (err.response && err.response.data && err.response.data.msg) ||
              "Unable to get carriers",
          });
          console.error(err.response || err);
        }
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    getPriceInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InternalMain
      type="normalTable"
      title="Upgrade your Subscription"
      breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
    >
      <Section normalTable position="relative">
        {paymentLoading && (
          <ProgressContainer>
            {paymentSuccess ? (
              <LoadingContainer direction="column">
                <Text textAlign="center">{`Your paid subscription has been activated.  You will be billed ${
                  CurrencySymbol[paymentResult.currency]
                }${
                  paymentResult.chargedAmount / 100
                } each month, and the charge will appear on your credit card statement as '${
                  paymentResult.statementDescriptor
                }'.`}</Text>
                <Button as={ReactRouterLink} to="/account">
                  OK
                </Button>
              </LoadingContainer>
            ) : (
              <LoadingContainer direction="row">
                <Loader height="64px" />
                <Text>
                  Your subscription is being processed. Please wait and do not
                  hit the back button or leave this page
                </Text>
              </LoadingContainer>
            )}
          </ProgressContainer>
        )}
        {showLoader ? (
          <Loader height="376px" />
        ) : (
          <Form onSubmit={handleSubmit}>
            <Text bold>Service</Text>
            <Text bold textAlign="center">
              Capacity
            </Text>
            <Text bold textAlign="center">
              Price
            </Text>
            <Text bold textAlign="center">
              Cost
            </Text>
            <hr />
            {serviceData.map((service, index) => (
              <React.Fragment key={service.category}>
                <Label htmlFor={service.category}>{service.service}</Label>
                <Input
                  name={service.category}
                  id={service.category}
                  value={service.capacity}
                  onChange={(e) =>
                    handleServiceData(index, "capacity", e.target.value)
                  }
                  placeholder=""
                  invalid={service.invalid}
                  ref={(ref) => handleRefs(service.category, ref)}
                />
                <Label textAlign="center">{service.feesLabel}</Label>
                <Label textAlign="center">
                  {service.cost !== ""
                    ? `${CurrencySymbol[service.currency]}${service.cost}`
                    : ""}
                </Label>
                <hr />
              </React.Fragment>
            ))}
            <Text bold>Total Monthly Cost</Text>
            <div />
            <div />
            <Text bold textAlign="center">
              {`$${total}`}
            </Text>
            <hr />
            <StyledRow>
              <Text bold>Payment Information</Text>
            </StyledRow>
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
            <div />
            <Label textAlign="right">Card</Label>
            <CardElementsWrapper>
              <CardElement options={cardElementsOptions} />
            </CardElementsWrapper>
            <div />
            <div />
            <hr />
            {errorMessage && <StyledFormError grid message={errorMessage} />}
            <StyledInputGroup flexEnd spaced>
              <Button gray="true" as={ReactRouterLink} to="/account">
                Cancel
              </Button>
              <Button disabled={disabledSubmit || !stripe}>
                Upgrade to Paid Plan
              </Button>
            </StyledInputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

const InjectedUpgradeSubscription = () => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <UpgradeSubscription elements={elements} stripe={stripe} />
      )}
    </ElementsConsumer>
  );
};

export default InjectedUpgradeSubscription;
