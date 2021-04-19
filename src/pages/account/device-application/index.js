import React, { useState, useEffect, useContext, useRef } from "react";
import { useParam, useHistory } from "react-router-dom";
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import Loader from '../../../components/blocks/Loader';

const DeviceApplicationAddEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const { device_calling_application_sid } = useParams();
  const type = device_calling_application_sid ? 'edit' : 'add';

  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  return (
    <InternalMain
      type="form"
      title={`${type === 'edit' ? 'Edit' : 'Add'} Device calling application`}
      breadcrumbs={[
        { name: 'Back to Account Home', url: '/account' },
      ]}
    >
      <Section>

      </Section>
    </InternalMain>
  );
};

export default DeviceApplicationAddEdit;
