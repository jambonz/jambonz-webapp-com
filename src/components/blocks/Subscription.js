import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from 'react-router-dom';
import PropTypes from "prop-types";

import H2 from '../../components/elements/H2';
import Button from '../../components/elements/Button';
import P from '../../components/elements/P';
import InputGroup from '../../components/elements/InputGroup';

const Subscription = ({ data }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const planType = data.account.plan_type;
    const { products } = data.subscription || {};
    const registeredDeviceRecord = products.find(item => item.name === 'registered device') || {};
    const callSessionRecord = products.find(item => item.name === 'concurrent call session') || {};
    let description = '';

    switch (planType) {
      case 'trial':
        description = `You are currently on the Free plan (trial period). You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
        break;
      case 'free':
        description = `You are currently on the Free plan. You are limited to ${callSessionRecord.quantity} simultaneous calls and ${registeredDeviceRecord.quantity} registered devices`;
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
      <InputGroup flexEnd spaced>
        <Button as={ReactRouterLink} to="#">Upgrade to a Paid Subscription</Button>
      </InputGroup>
    </>
  );
};

Subscription.propTypes = {
  data: PropTypes.object,
};

Subscription.defaultProps = {
  data: {},
};

export default Subscription;
