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
import P from "../../../components/elements/P";
import Label from "../../../components/elements/Label";
import Link from "../../../components/elements/Link";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import CurrencySymbol from "../../../data/CurrencySymbol";
import Modal from "../../../components/blocks/Modal";
import handleErrors from "../../../helpers/handleErrors";

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

  @media (max-width: 977.98px) {
    grid-template-columns: 100px 1fr 100px 50px;
  }

  ${(props) => props.theme.mobileOnly} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    grid-row-gap: 1rem;

    & > * {
      width: 100%;
    }

    hr {
      width: calc(100% + 3rem);
    }
  }
`;

const LabelInDesktop = styled(Label)`
  ${(props) => props.theme.mobileOnly} {
    display: none;
  }
`;

const DivInMobile = styled.div`
  display: none;

  ${(props) => props.theme.mobileOnly} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const MobileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-column: 1 / 5;
  width: 100%;

  @media (max-width: 977.98px) {
    grid-template-columns: 1fr 50px;
  }

  ${(props) => props.theme.mobileOnly} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Text = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: ${(props) => (props.bold ? "600" : "normal")};
  color: #707070;
  text-align: ${(props) => props.textAlign || "left"};
`;

const FormHeader = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: ${(props) => (props.bold ? "600" : "normal")};
  color: #707070;
  text-align: ${(props) => props.textAlign || "left"};

  ${(props) => props.theme.mobileOnly} {
    display: none;

    & + hr {
      display: none;
    }
  }
`;

const StyledInputGroup = styled(InputGroup)`
  grid-column: 1 / 5;

  @media (max-width: 978.98px) {
    flex-direction: column;

    & > * {
      width: 100%;

      span {
        width: 100%;
      }
    }
  }
`;

const InnerInputGroup = styled(InputGroup)`
  @media (max-width: 978.98px) {
    justify-content: space-between;
    margin-top: 1.5rem;

    & > * {
      width: 100%;
    }
  }

  @media (max-width: 400px) {
    flex-direction: column;

    & > *:first-child {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
`;

const StyledFormError = styled(FormError)`
  grid-column: 1 / 5;
`;

const StyledLink = styled(Link)`
  color: #707070;
`;

const UL = styled.ul`
  list-style-type: none;
  padding-left: 1rem;
`;

const LoadingContainer = styled.div`
  width: 500px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

const DeviceRow = styled.div`
  grid-column: 1 / 5;
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > * {
    text-align: left;
  }

  @media (max-width: 575.98px) {
    display: block;
  }
`;

const StyledInput = styled(Input)`
  max-width: 500px;
`;

const ModifySubscription = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  const [showLoader, setShowLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [disableSubmit, setDisabledSubmit] = useState(true);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showModalLoader, setShowModalLoader] = useState(false);
  const [billingChange, setBillingChange] = useState({});
  const [applyingChange, setApplyingChange] = useState(false);
  const [accountData, setAccountData] = useState({});

  const refArray = {
    voice_call_session: useRef(null),
    device: useRef(null),
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
      visible: true,
      required: true,
    },
    {
      category: "device",
      name: "registered device",
      service: "Additional device registrations",
      fees: 0,
      feesLabel: "",
      cost: "",
      capacity: "",
      invalid: false,
      currency: "usd",
      min: 1,
      max: 200,
      dirty: false,
      visible: false,
      required: false,
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
        visible: quantity > 0,
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

  const handleChangeSubscription = async () => {
    try {
      setApplyingChange(true);
      await upgradeQuantities();
    } catch (err) {
      handleErrors({ err, history, dispatch, setErrorMessage });
    } finally {
      setShowChangeModal(false);
      setApplyingChange(false);
    }
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
        if (service.required) {
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
      setShowChangeModal(true);
      setShowModalLoader(true);
      await retrieveBillingChanges();
      setShowModalLoader(false);
    } catch (err) {
      handleErrors({ err, history, dispatch, setErrorMessage });
      setShowChangeModal(false);
      setShowModalLoader(false);
    } finally {
      setShowLoader(false);
    }
  };

  const retrieveBillingChanges = async () => {
    const updatedProducts = serviceData
      // .filter((product) => !!product.dirty)
      .map((product) => ({
        price_id: product.stripe_price_id,
        product_sid: product.product_sid,
        quantity: product.capacity || 0,
      }));

    const result = await axios({
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE_URL,
      url: `/Subscriptions`,
      data: {
        action: "update-quantities",
        dry_run: true,
        products: updatedProducts,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (result.status === 201) {
      setBillingChange(result.data);
    } else {
      setShowChangeModal(false);
      setShowModalLoader(false);
    }
  };

  const showDeviceRow = () => {
    setServiceData((prev) => {
      prev[1].visible = true;
      return [...prev];
    });
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

        if (isMounted) {
          initFeesAndCost(priceResult.data);
        }

        const productsInfo = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          setAccountData(productsInfo.data.account);
          setProductsInfo(productsInfo.data);
        }
      } catch (err) {
        handleErrors({ err, history, dispatch, setErrorMessage });
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
            <FormHeader bold>Service</FormHeader>
            <FormHeader bold textAlign="center">
              Capacity
            </FormHeader>
            <FormHeader bold textAlign="center">
              Price
            </FormHeader>
            <FormHeader bold textAlign="center">
              Cost
            </FormHeader>
            <hr />
            {serviceData
              .filter((service) => service.visible)
              .map((service, index) => (
                <React.Fragment key={service.category}>
                  <Label htmlFor={service.category}>{service.service}</Label>
                  <StyledInput
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
                  <LabelInDesktop textAlign="center">
                    {service.feesLabel}
                  </LabelInDesktop>
                  <LabelInDesktop textAlign="center">
                    {service.cost !== ""
                      ? `${CurrencySymbol[service.currency]}${service.cost}`
                      : ""}
                  </LabelInDesktop>
                  <DivInMobile>
                    <Label textAlign="center">{service.feesLabel}</Label>
                    <Label textAlign="center">
                      {service.cost !== ""
                        ? `${CurrencySymbol[service.currency]}${service.cost}`
                        : ""}
                    </Label>
                  </DivInMobile>
                  <hr />
                </React.Fragment>
              ))}
            {serviceData[0].capacity && !serviceData[1].visible && (
              <React.Fragment>
                <DeviceRow>
                  <Label>
                    {`With ${
                      serviceData[0].capacity
                    } call sessions you can register ${
                      parseInt(serviceData[0].capacity, 10) *
                      accountData.device_to_call_ratio
                    } concurrent devices`}
                  </Label>
                  <Button text formLink type="button" onClick={showDeviceRow}>
                    Would you like to purchase additional device registrations?
                  </Button>
                </DeviceRow>
                <hr />
              </React.Fragment>
            )}
            <MobileContainer>
              <Text bold>Total Monthly Cost</Text>
              <Text bold textAlign="center">
                {`$${total}`}
              </Text>
            </MobileContainer>
            <hr />
            {errorMessage && <StyledFormError grid message={errorMessage} />}
            <StyledInputGroup spaced>
              <InnerInputGroup spaced style={{ flex: 1 }}>
                <StyledLink to="/account/return-to-free">
                  Return to free plan
                </StyledLink>
                <StyledLink to={"#"}>Delete Account</StyledLink>
              </InnerInputGroup>
              <InnerInputGroup flexEnd spaced>
                <Button gray="true" as={ReactRouterLink} to="/account/settings">
                  Cancel
                </Button>
                <Button disabled={disableSubmit}>Review Changes</Button>
              </InnerInputGroup>
            </StyledInputGroup>
          </Form>
        )}
      </Section>
      {showChangeModal && (
        <Modal
          title={showModalLoader || applyingChange ? "" : "Confirm Changes"}
          loader={showModalLoader}
          hideButtons={applyingChange}
          maskClosable={false}
          content={
            applyingChange ? (
              <LoadingContainer>
                {`Your requested changes are being processed.  Please do not leave the page or hit the back button until complete.`}
              </LoadingContainer>
            ) : (
              <div>
                <P>
                  By pressing "Confirm Changes" below, your plan will be
                  immediately adjusted to the following levels:
                </P>
                <UL style={{ listStyleType: "none" }}>
                  <li>{`- ${serviceData[0].capacity} simultaneous calls`}</li>
                  <li>{`- ${
                    accountData.device_to_call_ratio *
                      parseInt(serviceData[0].capacity, 0) +
                      parseInt(serviceData[1].capacity, 10) || 0
                  } registered devices`}</li>
                </UL>
                <P>
                  {billingChange.prorated_cost > 0 &&
                    `Your new monthly charge will be $${
                      billingChange.monthly_cost / 100
                    }, and you will immediately be charged a one-time prorated amount of $${
                      billingChange.prorated_cost / 100
                    } to cover the remainder of the current billing period.`}
                  {billingChange.prorated_cost === 0 &&
                    `Your monthly charge will be $${
                      billingChange.monthly_cost / 100
                    }.`}
                  {billingChange.prorated_cost < 0 &&
                    `Your new monthly charge will be $${
                      billingChange.monthly_cost / 100
                    }, and you will receive a credit of $${
                      -billingChange.prorated_cost / 100
                    } on your next invoice to reflect changes made during the current billing period.`}
                </P>
              </div>
            )
          }
          actionText="Confirm Changes"
          handleCancel={() => setShowChangeModal(false)}
          handleSubmit={handleChangeSubscription}
        />
      )}
    </InternalMain>
  );
};

export default ModifySubscription;
