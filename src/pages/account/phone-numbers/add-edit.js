import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components/macro";

import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import Label from '../../../components/elements/Label';
import Select from '../../../components/elements/Select';
import InputGroup from '../../../components/elements/InputGroup';
import FormError from '../../../components/blocks/FormError';
import Loader from '../../../components/blocks/Loader';
import Button from '../../../components/elements/Button';
import phoneNumberFormat from '../../../helpers/phoneNumberFormat';

const StyledButtonGroup = styled(InputGroup)`
  @media (max-width: 576.98px) {
    width: 100%;

    & > *:first-child {
      width: 100%;
      flex: 1;

      & > * {
        width: 100%;
      }
    }

    & > *:last-child {
      width: 100%;
      flex: 1;

      & > * {
        width: 100%;
      }
    }
  }
  ${props => props.type === 'add' ? `
    @media (max-width: 449.98px) {
      & > *:first-child {
        flex: 0;
      }
    }
  ` : ''}
`;

const StyledForm = styled(Form)`
  ${props => props.theme.mobileOnly} {
    flex-direction: column;
    display: flex;
    align-items: flex-start;

    & > * {
      width: 100%;
    }
  }
`;

const PhoneNumbersAddEdit = () => {
  const { phone_number_sid } = useParams();
  const type = phone_number_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Phone Number' : 'Add Phone Number';

  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  // Refs
  const refPhoneNumber = useRef(null);

  // Form inputs
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ carrier,     setCarrier     ] = useState('');
  const [ application, setApplication ] = useState('');

  // Select list values
  const [ carrierValues,     setCarrierValues     ] = useState([]);
  const [ applicationValues, setApplicationValues ] = useState([]);

  // Invalid form inputs
  const [ invalidPhoneNumber, setInvalidPhoneNumber ] = useState(false);

  const [ phoneNumbers, setPhoneNumbers ] = useState('');
  const [ showLoader,   setShowLoader   ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const carriersPromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/VoipCarriers',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const applicationsPromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Applications',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const phoneNumbersPromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/PhoneNumbers',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const [
          carriersResponse,
          applicationsResponse,
          phoneNumbersResponse,
        ] = await Promise.all([
          carriersPromise,
          applicationsPromise,
          phoneNumbersPromise,
        ]);

        const carriers = carriersResponse.data;
        const applications = applicationsResponse.data;
        const phoneNumbers = phoneNumbersResponse.data;

        setCarrierValues(carriers);
        setApplicationValues(applications);
        setPhoneNumbers(phoneNumbers);

        if (type === 'edit') {
          const phoneNumberData = phoneNumbers.filter(p => {
            return p.phone_number_sid === phone_number_sid;
          });

          if (!phoneNumberData.length) {
            isMounted = false;
            history.push('/account/phone-numbers');
            dispatch({
              type: 'ADD',
              level: 'error',
              message: 'That phone number does not exist.',
            });
            return;
          }

          setPhoneNumber (( phoneNumberData[0] && phoneNumberFormat(phoneNumberData[0].number)) || '');
          setCarrier     (( phoneNumberData[0] && phoneNumberData[0].voip_carrier_sid         ) || '');
          setApplication (( phoneNumberData[0] && phoneNumberData[0].application_sid          ) || '');
        }

        setShowLoader(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          isMounted = false;
          history.push('/');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: 'Your session has expired. Please log in and try again.',
          });
        } else {
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (err.response && err.response.data && err.response.data.msg) || 'Something went wrong, please try again.',
          });
          console.error(err.response || err);
        }
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };
    getAPIData();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async e => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidPhoneNumber(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!phoneNumber) {
        errorMessages.push('Please provide a phone number');
        setInvalidPhoneNumber(true);
        if (!focusHasBeenSet) {
          refPhoneNumber.current.focus();
          focusHasBeenSet = true;
        }
      }

      // check if phone number is already in use
      for (const num of phoneNumbers) {
        if (num.phone_number_sid === phone_number_sid) {
          continue;
        }

        if (num.number === phoneNumber) {
          errorMessages.push(
            'The phone number you have entered is already in use.'
          );
          setInvalidPhoneNumber(true);
          if (!focusHasBeenSet) {
            refPhoneNumber.current.focus();
            focusHasBeenSet = true;
          }
        }
      };

      if (errorMessages.length > 1) {
        setErrorMessage(errorMessages);
        return;
      } else if (errorMessages.length === 1) {
        setErrorMessage(errorMessages[0]);
        return;
      }

      //=============================================================================
      // Submit
      //=============================================================================
      const method = type === 'add'
        ? 'post'
        : 'put';

      const url = type === 'add'
        ? `/PhoneNumbers`
        : `/PhoneNumbers/${phone_number_sid}`;

      const data = {
        application_sid: application || null,
      };

      const cleanedUpNumber = phoneNumber.trim().replace(/[\s-()+]/g,'');

      if (type === 'add') {
        data.number = cleanedUpNumber;
        data.voip_carrier_sid = carrier || null;
      }

      await axios({
        method,
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data
      });

      const dispatchMessage = type === 'add'
        ? 'Phone number created successfully'
        : 'Phone number updated successfully';

      dispatch({
        type: 'ADD',
        level: 'success',
        message: dispatchMessage
      });

      isMounted = false;
      history.push('/account/phone-numbers');
    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
        'Something went wrong, please try again.'
      );
      console.error(err.response || err);
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <InternalMain
      type="form"
      title={pageTitle}
      breadcrumbs={[
        { name: 'Back to Phone Numbers', url: '/account/phone-numbers' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height={'310px'}/>
        ) : (
          <StyledForm
            large
            onSubmit={handleSubmit}
          >
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              name="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="Phone number that will be sending calls to this service"
              invalid={invalidPhoneNumber}
              autoFocus
              ref={refPhoneNumber}
              disabled={type === 'edit'}
            />

            <Label htmlFor="carrier">Carrier</Label>
            <Select
              name="carrier"
              id="carrier"
              value={carrier}
              onChange={e => setCarrier(e.target.value)}
              disabled={type === 'edit'}
            >
              <option value="">
                {type === 'add'
                  ? '-- OPTIONAL: Carrier this number belongs to --'
                  : '-- NONE --'
                }
              </option>
              {carrierValues.map(s => (
                <option
                  key={s.voip_carrier_sid}
                  value={s.voip_carrier_sid}
                >
                  {s.name}
                </option>
              ))}
            </Select>

            <Label htmlFor="application">Application</Label>
            <Select
              name="application"
              id="application"
              value={application}
              onChange={e => setApplication(e.target.value)}
            >
              <option value="">
                {type === 'add'
                  ? '-- OPTIONAL: Application to invoke --'
                  : '-- NONE --'
                }
              </option>
              {applicationValues.map(a => (
                <option
                  key={a.application_sid}
                  value={a.application_sid}
                >
                  {a.name}
                </option>
              ))}
            </Select>

            {errorMessage && (
              <FormError grid message={errorMessage} />
            )}

            <StyledButtonGroup flexEnd spaced type={type}>
              <Button
                rounded="true"
                gray
                type="button"
                onClick={() => {
                  history.push('/account/phone-numbers');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: type === 'add' ? 'New phone number canceled' :'Changes canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button rounded="true">
                {type === 'add'
                  ? 'Add Phone Number'
                  : 'Save'
                }
              </Button>
            </StyledButtonGroup>
          </StyledForm>
        )}
      </Section>
    </InternalMain>
  );
};

export default PhoneNumbersAddEdit;
