import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/blocks/InternalMain';
import Section from '../../../components/blocks/Section';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import Label from '../../../components/elements/Label';
import InputGroup from '../../../components/elements/InputGroup';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import Loader from '../../../components/blocks/Loader';

const SettingsChangeName = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const user_sid = localStorage.getItem('user_sid');

  const pageTitle = `Edit Name`;
  useEffect(() => {
    document.title = `${pageTitle} | jambonz`;
  });

  const refName = useRef(null);
  const [ name, setName ] = useState('');
  const [ invalidName, setInvalidName ] = useState(false);
  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const userResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!userResponse.data || !userResponse.data.user || !userResponse.data.user.name) {
          throw new Error('Unable to get name');
        }

        if (userResponse.data.user.provider !== 'local') {
          throw new Error('You cannot change your name on an OAuth account');
        }

        setName(userResponse.data.user.name);
        setShowLoader(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('jwt');
          sessionStorage.clear();
          isMounted = false;
          history.push('/');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: 'Your session has expired. Please log in and try again.',
          });
        } else {
          isMounted = false;
          history.push('/account/settings');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (
              (err.response && err.response.data && err.response.data.msg) ||
              err.message || 'That registration webhook does not exist'
            ),
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

  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidName(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!name) {
        errorMessages.push('Please provide your name.');
        setInvalidName(true);
        if (!focusHasBeenSet) {
          refName.current.focus();
          focusHasBeenSet = true;
        }
      }

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
      await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Users/${user_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          name,
        },
      });

      isMounted = false;
      history.push('/account/settings');
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `Name updated successfully`,
      });

    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('jwt');
        sessionStorage.clear();
        isMounted = false;
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Your session has expired. Please log in and try again.',
        });
      } else {
        setErrorMessage((err.response && err.response.data && err.response.data.msg) || 'Something went wrong, please try again.');
        console.error(err.response || err);
      }
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <InternalMain
      type="form"
      title="Edit Name"
      breadcrumbs={[
        { name: 'Back to Settings', url: '/account/settings' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height="611px" />
        ) : (
          <Form
            large
            onSubmit={handleSubmit}
          >
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              invalid={invalidName}
              autoFocus
              ref={refName}
            />

            {errorMessage && (
              <FormError grid message={errorMessage} />
            )}

            <InputGroup flexEnd spaced>
              <Button
                gray
                type="button"
                onClick={() => {
                  history.push('/account/settings');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: 'Changes canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button>Save</Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default SettingsChangeName;
