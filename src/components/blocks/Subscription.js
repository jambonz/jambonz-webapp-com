import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from 'react-router-dom';
import PropTypes from "prop-types";

import H2 from '../../components/elements/H2';
import Button from '../../components/elements/Button';
import P from '../../components/elements/P';
import InputGroup from '../../components/elements/InputGroup';
import PlanType from '../../data/PlanType';

const Subscription = ({ data, hasDelete }) => {
  const [description, setDescription] = useState('');
  const [planType, setPlanType] = useState('');

  useEffect(() => {
    const pType = (data.account || {}).plan_type;
    setPlanType(pType);
    const { products } = data.subscription || {};
    const registeredDeviceRecord = products.find(item => item.name === 'registered device') || {};
    const callSessionRecord = products.find(item => item.name === 'concurrent call session') || {};
    let description = '';

    switch (pType) {
      case PlanType.TRIAL:
        description = `You are currently on the Free plan (trial period). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
        break;
      case PlanType.FREE:
        description = `You are currently on the Free plan (trial period expired). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
        break;
      case PlanType.PAID:
        description = `Your paid subscription includes capacity for ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices.  You are billed $920 on the 8th of the month.`;
        break;
      default:
        break;
    }

    setDescription(description);
  }, [data]);

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
            <Button gray="true" as={ReactRouterLink} to="/account/settings/delete-account">
              Delete Account
            </Button>
          )}
          <Button as={ReactRouterLink} to="#">Upgrade to a Paid Subscription</Button>
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
