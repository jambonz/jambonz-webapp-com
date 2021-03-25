import { useState, useRef, useContext } from "react";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";

import InternalMain from "../../../../components/wrappers/InternalMain";
import Section from "../../../../components/blocks/Section";
import P from "../../../../components/elements/P";
import Form from "../../../../components/elements/Form";
import Label from "../../../../components/elements/Label";
import Input from "../../../../components/elements/Input";
import FormError from "../../../../components/blocks/FormError";
import InputGroup from "../../../../components/elements/InputGroup";
import Button from "../../../../components/elements/Button";
import handleErrors from "../../../../helpers/handleErrors";
import Loader from "../../../../components/blocks/Loader";
import { NotificationDispatchContext } from "../../../../contexts/NotificationContext";

const SettingsAuthEmailVerify = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const user_sid = localStorage.getItem('user_sid');
  const email = localStorage.getItem('email');
  const history = useHistory();

  const [showLoader, setShowLoader] = useState(false);
  const [code, setCode] = useState("");
  const [invalidCode, setInvalidCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs
  const refCode = useRef(null);

  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      e.preventDefault();
      setErrorMessage("");
      setInvalidCode(false);

      if (!code) {
        setErrorMessage('Verification code is required.');
        setInvalidCode(true);
        refCode.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      setShowLoader(true);
      const response = await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/ActivationCode/${code}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          user_sid,
          type: 'email',
        },
      });

      if (response.status !== 204) {
        throw new Error(`Unable to verify email. Please try again.`);
      }

      dispatch({
        type: 'ADD',
        level: 'success',
        message: 'Your authentication method has been changed.',
      });
      history.push('/account/settings');
    } catch (err) {
      if (isMounted) {
        handleErrors({ err, history, dispatch, setErrorMessage });
      }
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
      localStorage.removeItem('email');
    }
  };

  return (
    <InternalMain
      type="form"
      title="Verify Your Email"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section>
        {showLoader ? (
          <Loader height="376px" />
        ) : (
          <>
            <P>{`Please enter the code we just sent to ${email}`}</P>
            <Form large wideLabel onSubmit={handleSubmit}>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                name="code"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Verification Code"
                invalid={invalidCode}
                autoFocus
                ref={refCode}
              />
              {errorMessage && <FormError grid message={errorMessage} />}
              <InputGroup flexEnd spaced>
                <Button gray="true" as={ReactRouterLink} to="/account/settings">
                  Cancel
                </Button>
                <Button>Continue</Button>
              </InputGroup>
            </Form>
          </>
        )}
      </Section>
    </InternalMain>
  );
};

export default SettingsAuthEmailVerify;
