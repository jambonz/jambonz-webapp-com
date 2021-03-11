import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";

import H2 from "../../components/elements/H2";
import Button from "../../components/elements/Button";
import P from "../../components/elements/P";
import InputGroup from "../../components/elements/InputGroup";
import PlanType from "../../data/PlanType";
import CurrencySymbol from "../../data/CurrencySymbol";

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

    switch (pType) {
      case PlanType.TRIAL:
        description = `You are currently on the Free plan (trial period). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
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

        setInvoiceData({
          total: result.data.total / 100,
          currency: result.data.currency,
          next_payment_attempt: moment(
            result.data.next_payment_attempt * 1000
          ).format("MMMM DD, YYYY"),
        });
      } catch (err) {
        console.log(err);
        setInvoiceData({});
      }
    };

    if (planType === PlanType.PAID) {
      getInvoiceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planType]);

  return (
    <>
      <H2>Your Subscription</H2>
      <P>{description}</P>
      {planType === PlanType.PAID ? (
        <InputGroup flexEnd spaced>
          <Button gray="true">Manage Payment Info</Button>
          <Button gray="true">Modify My Subscription</Button>
        </InputGroup>
      ) : (
        <InputGroup flexEnd spaced>
          {hasDelete && (
            <Button
              gray="true"
              as={ReactRouterLink}
              to="/account/settings/delete-account"
            >
              Delete Account
            </Button>
          )}
          <Button as={ReactRouterLink} to="/account/subscription">
            Upgrade to a Paid Subscription
          </Button>
        </InputGroup>
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
