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
  ${(props) => props.theme.mobileOnly} {
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

const Subscription = ({ data, hasDelete }) => {
  const [description, setDescription] = useState("");
  const [planType, setPlanType] = useState("");
  const [invoiceData, setInvoiceData] = useState({});
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const pType = (data.account || {}).plan_type;
    setPlanType(pType);
    const { products } = data.subscription || {};
    const registeredDeviceRecord =
      products.find((item) => item.name === "registered device") || {};
    const callSessionRecord =
      products.find((item) => item.name === "concurrent call session") || {};
    const apiCallRecord =
      products.find((item) => item.name === "api call") || {};
    let description = "";
    const { trial_end_date } = data.account || {};

    switch (pType) {
      case PlanType.TRIAL:
        description = `You are currently on the Free plan (trial period). You are limited to ${
          callSessionRecord.quantity
        } simultaneous calls and ${
          registeredDeviceRecord.quantity
        } registered devices${
          trial_end_date
            ? ".<br /><br /> Your free trial will end on " +
              moment(trial_end_date).format("MMMM DD, YYYY")
            : ""
        }.`;
        break;
      case PlanType.FREE:
        description = `You are currently on the Free plan (trial period expired). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
        break;
      case PlanType.PAID:
        description = `Your paid subscription includes capacity for ${
          callSessionRecord.quantity
        } simultaneous calls, ${
          registeredDeviceRecord.quantity
        } registered devices, and ${
          apiCallRecord.quantity
        } api calls per minute. You are billed ${
          CurrencySymbol[invoiceData.currency || "usd"]
        }${invoiceData.total || 0} on ${
          invoiceData.next_payment_attempt || ""
        }.`;
        break;
      default:
        break;
    }

    setDescription(description);
  }, [data, invoiceData]);

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

  return (
    <>
      <H2>Your Subscription</H2>
      <P dangerouslySetInnerHTML={{ __html: description }} />
      {planType === PlanType.PAID ? (
        <StyledInputGroup flexEnd spaced>
          <Button as={ReactRouterLink} gray="true" to="/account/manage-payment">
            Manage Payment Info
          </Button>
          <Button
            gray="true"
            as={ReactRouterLink}
            to="/account/modify-subscription"
          >
            Modify My Subscription
          </Button>
        </StyledInputGroup>
      ) : (
        <StyledInputGroup flexEnd spaced>
          {hasDelete && (
            <Button
              gray="true"
              as={ReactRouterLink}
              to="/account/settings/delete-account"
            >
              Delete Account
            </Button>
          )}
          <Button
            style={{ whiteSpace: "nowrap" }}
            as={ReactRouterLink}
            to="/account/subscription"
          >
            Upgrade to a Paid Subscription
          </Button>
        </StyledInputGroup>
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
