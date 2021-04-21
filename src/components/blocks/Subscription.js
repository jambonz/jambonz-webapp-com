import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import styled from "styled-components/macro";

import H2 from "../../components/elements/H2";
import Button from "../../components/elements/Button";
import P from "../../components/elements/P";
import InputGroup from "../../components/elements/InputGroup";
import PlanType from "../../data/PlanType";
import CurrencySymbol from "../../data/CurrencySymbol";

const StyledInputGroup = styled(InputGroup)`
  ${(props) =>
    props.hasDelete
      ? `
    @media (max-width: 850px) {
      display: flex;
      flex-direction: column;

      & > a {
        width: 100%;

        span {
          width: 100%;
        }

        &:first-child {
          margin-right: 0;
          margin-bottom: 1rem;
        }
      }
    }
  `
      : ""}

  @media (max-width: 767px) {
    & > * {
      width: 100%;

      span {
        width: 100%;
      }
    }
  }

  @media (max-width: 575px) {
    display: flex;
    flex-direction: column;

    & > a:first-child {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
`;

const Footer = styled.div`
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100%;
  margin-top: -0.5rem;

  & > p {
    margin-bottom: 0;
  }

  @media (max-width: ${(props) =>
      props.hasDelete ? "1199.98px" : "977.98px"}) {
    flex-direction: column;
    align-items: flex-start !important;

    & > div {
      width: 100%;
      margin-top: 1rem;
    }
  }
`;

const Subscription = ({ data, hasDelete }) => {
  const [description, setDescription] = useState("");
  const [otherDescription, setOtherDescription] = useState("");
  const [planType, setPlanType] = useState("");
  const [invoiceData, setInvoiceData] = useState({});
  const [accountData, setAccountData] = useState({});
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const pType = (data.account || {}).plan_type;
    setPlanType(pType);
    const { products } = data.subscription || {};
    const registeredDeviceRecord =
      products.find((item) => item.name === "registered device") || {};
    const callSessionRecord =
      products.find((item) => item.name === "concurrent call session") || {};
    let description = "";
    let otherDescription = "";
    const { trial_end_date } = data.account || {};
    const quantity =
      (accountData.device_to_call_ratio || 0) * callSessionRecord.quantity +
      (registeredDeviceRecord.quantity || 0);

    switch (pType) {
      case PlanType.TRIAL:
        description = `You are currently on the Free plan (trial period). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${quantity} registered devices.`;
        if (trial_end_date) {
          otherDescription = `Your free trial will end on ${moment(
            trial_end_date
          ).format("MMMM DD, YYYY")}.`;
        } else {
          otherDescription = "";
        }
        break;
      case PlanType.FREE:
        description = `You are currently on the Free plan (trial period expired). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${quantity} registered devices`;
        otherDescription = "";
        break;
      case PlanType.PAID:
        description = `Your paid subscription includes capacity for ${
          callSessionRecord.quantity
        } simultaneous calls, and ${quantity} registered devices. You are billed ${
          CurrencySymbol[invoiceData.currency || "usd"]
        }${invoiceData.total || 0} on ${
          invoiceData.next_payment_attempt || ""
        }.`;
        otherDescription = "";
        break;
      default:
        break;
    }

    setDescription(description);
    setOtherDescription(otherDescription);
  }, [data, invoiceData, accountData]);

  useEffect(() => {
    let isMounted = true;

    const getInvoiceData = async () => {
      try {
        const result = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Invoices`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          setInvoiceData({
            total: result.data.total / 100,
            currency: result.data.currency,
            next_payment_attempt: moment(
              result.data.next_payment_attempt * 1000
            ).format("MMMM DD, YYYY"),
          });
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setInvoiceData({});
        }
      }
    };

    if (planType === PlanType.PAID) {
      getInvoiceData();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planType]);

  useEffect(() => {
    let isMounted = true;

    const getAccountData = async () => {
      try {
        const userResult = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Users/me",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          setAccountData(userResult.data.account);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAccountData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <H2 bold>Your Subscription</H2>
      <P>{description}</P>
      {planType === PlanType.PAID ? (
        <StyledInputGroup flexEnd spaced>
          <Button
            rounded="true"
            font="12px"
            as={ReactRouterLink}
            gray="true"
            to="/account/manage-payment"
          >
            Manage Payment Info
          </Button>
          <Button
            rounded="true"
            font="12px"
            gray="true"
            as={ReactRouterLink}
            to="/account/modify-subscription"
          >
            Modify My Subscription
          </Button>
        </StyledInputGroup>
      ) : (
        <Footer hasDelete={hasDelete ? "true" : ""}>
          <P>{otherDescription}</P>
          <StyledInputGroup flexEnd spaced hasDelete={hasDelete ? "true" : ""}>
            {hasDelete && (
              <Button
                rounded="true"
                font="12px"
                gray="true"
                as={ReactRouterLink}
                to="/account/settings/delete-account"
              >
                Delete Account
              </Button>
            )}
            <Button
              rounded="true"
              font="12px"
              style={{ whiteSpace: "nowrap" }}
              as={ReactRouterLink}
              to="/account/subscription"
            >
              Upgrade to a Paid Subscription
            </Button>
          </StyledInputGroup>
        </Footer>
      )}
    </>
  );
};

Subscription.propTypes = {
  data: PropTypes.object,
  hasDelete: PropTypes.bool,
};

Subscription.defaultProps = {
  data: {},
  hasDelete: false,
};

export default Subscription;
