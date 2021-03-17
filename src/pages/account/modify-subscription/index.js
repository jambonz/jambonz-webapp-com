import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";

import InternalMain from "../../../components/wrappers/InternalMain";
import Section from "../../../components/blocks/Section";
import Loader from "../../../components/blocks/Loader";
import FormError from "../../../components/blocks/FormError";
import InputGroup from "../../../components/elements/InputGroup";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import Label from "../../../components/elements/Label";
import Link from "../../../components/elements/Link";
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

const StyledLink = styled(Link)`
  color: #707070;
`;

const ModifySubscription = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  const [showLoader, setShowLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [disableSubmit, setDisabledSubmit] = useState(true);

  const refArray = {
    voice_call_session: useRef(null),
    device: useRef(null),
    api_rate: useRef(null),
  };

  // subscription categories
  const [serviceData, setServiceData] = useState([
    {
      category: "voice_call_session",
      name: "concurrent call session",
      service: "Maximum concurrent call sessions",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 10,
      max: 1000,
      dirty: false,
    },
    {
      category: "device",
      name: "registered device",
      service: "Maximum concurrent device registrations",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 1,
      max: 200,
      dirty: false,
    },
    {
      category: "api_rate",
      name: "api call",
      service: "Maximum number of API calls per minute",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 6,
      max: 180,
      dirty: false,
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

  const handleServiceData = (index, field, value) => {
    setDisabledSubmit(false);
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
          dirty: true,
        };
        removeErrorMessage(`"${prev[index].service}" should be number.`);
      }
      return [...prev];
    });
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

  const setProductsInfo = (data) => {
    const { products } = data.subscription || {};

    const services = serviceData.map((service) => {
      const { quantity } =
        products.find((item) => item.name === service.name) || {};
      const [fees, feesLabel, cost] = getServicePrice(service, quantity || 0);
      return {
        ...service,
        capacity: quantity || 0,
        invalid: false,
        fees,
        feesLabel,
        cost,
      };
    });

    setServiceData(services);
  };

  const resetInvalidFields = () => {
    setServiceData((prev) => {
      prev.forEach((service) => {
        service.invalid = false;
      });
      return prev;
    });
  };

  const handleSubmit = async (e) => {
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
      setShowLoader(true);
      await upgradeQuantities();
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

  const upgradeQuantities = async () => {
    const updatedProducts = serviceData
      // .filter((product) => !!product.dirty)
      .map((product) => ({
        price_id: product.stripe_price_id,
        product_sid: product.product_sid,
        quantity: product.capacity,
      }));

    const result = await axios({
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE_URL,
      url: `/Subscriptions`,
      data: {
        action: "update-quantities",
        products: updatedProducts,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (result.data.status === "success") {
      dispatch({
        type: "ADD",
        level: "success",
        message: "Your subscription capacity has been successfully modified.",
      });
      history.push("/account/settings");
    } else {
      setErrorMessage(
        "The additional capacity you that you requested could not be granted due to a failure processing payment.  Please configure a valid credit card for your account and the upgrade will be automatically processed"
      );
    }
  };

  useEffect(() => {
    setTotal(serviceData.reduce((res, service) => res + service.cost || 0, 0));
  }, [serviceData]);

  useEffect(() => {
    let isMounted = true;

    const getPriceInfo = async () => {
      try {
        const priceResult = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Prices`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        initFeesAndCost(priceResult.data);

        const productsInfo = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        setProductsInfo(productsInfo.data);
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
      title="Configure Your Subscription"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section normalTable position="relative">
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
            {errorMessage && <StyledFormError grid message={errorMessage} />}
            <StyledInputGroup spaced>
              <InputGroup spaced style={{ flex: 1 }}>
                <StyledLink to="/account/return-to-free">
                  Return to free plan
                </StyledLink>
                <StyledLink to={"#"}>Delete Account</StyledLink>
              </InputGroup>
              <InputGroup flexEnd spaced>
                <Button gray="true" as={ReactRouterLink} to="/account/settings">
                  Cancel
                </Button>
                <Button disabled={disableSubmit}>Continue →</Button>
              </InputGroup>
            </StyledInputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default ModifySubscription;
