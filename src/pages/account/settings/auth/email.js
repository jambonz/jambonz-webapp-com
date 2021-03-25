import { useState, useRef, useContext, useEffect } from "react";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";

import InternalMain from "../../../../components/wrappers/InternalMain";
import Section from "../../../../components/blocks/Section";
import P from "../../../../components/elements/P";
import Form from "../../../../components/elements/Form";
import Label from "../../../../components/elements/Label";
import Input from "../../../../components/elements/Input";
import PasswordInput from "../../../../components/elements/PasswordInput";
import FormError from "../../../../components/blocks/FormError";
import InputGroup from "../../../../components/elements/InputGroup";
import Button from "../../../../components/elements/Button";
import handleErrors from "../../../../helpers/handleErrors";
import Loader from "../../../../components/blocks/Loader";
import { NotificationDispatchContext } from "../../../../contexts/NotificationContext";
import { isValidEmail } from "../../../../utils/validate";
import generateActivationCode from "../../../../helpers/generateActivationCode";

const SettingsAuthEmail = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const history = useHistory();
  const jwt = localStorage.getItem("jwt");

  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  // Refs
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refConfirmPassword = useRef(null);

  const resetInvalidFields = () => {
    setEmailInvalid(false);
    setPasswordInvalid(false);
    setConfirmPasswordInvalid(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      resetInvalidFields();
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!email) {
        errorMessages.push("Email is required");
        setEmailInvalid(true);
        if (!focusHasBeenSet) {
          refEmail.current.focus();
          focusHasBeenSet = true;
        }
      } else if (!isValidEmail(email)) {
        errorMessages.push("Email is invalid");
        setEmailInvalid(true);
        if (!focusHasBeenSet) {
          refEmail.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!password) {
        errorMessages.push("Password is required");
        setPasswordInvalid(true);
        if (!focusHasBeenSet) {
          refPassword.current.focus();
          focusHasBeenSet = true;
        }
      } else {
        if (password.length < 6) {
          errorMessages.push("Password must be at least 6 characters long.");
          setPasswordInvalid(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[a-zA-Z]/.test(password)) {
          errorMessages.push("Password must contain a letter.");
          setPasswordInvalid(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[0-9]/.test(password)) {
          errorMessages.push("Password must contain a number.");
          setPasswordInvalid(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
            focusHasBeenSet = true;
          }
        }
      }

      if (!confirmPassword) {
        errorMessages.push("Confirm your password");
        setConfirmPasswordInvalid(true);
        if (!focusHasBeenSet) {
          refConfirmPassword.current.focus();
          focusHasBeenSet = true;
        }
      } else if (confirmPassword !== password) {
        errorMessages.push("Confirm your password");
        setConfirmPasswordInvalid(true);
        if (!focusHasBeenSet) {
          refConfirmPassword.current.focus();
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

      setShowLoader(true);

      //===============================================
      // Submit
      //===============================================
      const email_activation_code = generateActivationCode();

      const response = await axios({
        method: "post",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: "/register",
        data: {
          service_provider_sid: process.env.REACT_APP_SERVICE_PROVIDER_SID,
          provider: "local",
          name: user.name,
          email,
          password,
          email_activation_code,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 200) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("email", email);
        localStorage.setItem("user_sid", response.data.user_sid);
        localStorage.setItem("account_sid", response.data.account_sid);
        history.push("/account/settings/auth/email-verify");
      }
    } catch (err) {
      handleErrors({ err, history, dispatch, setErrorMessage });
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getAPIData = async () => {
      try {
        const userDataResponse = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          const user = userDataResponse.data;
          setUser(user.user || {});
        }
      } catch (err) {
        handleErrors({ err, history, dispatch, setErrorMessage });
      } finally {
        setShowLoader(false);
      }
    };

    getAPIData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <InternalMain
      type="form"
      title="Sign In With Email"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section>
        {showLoader ? (
          <Loader height="376px" />
        ) : (
          <>
            <P>
              The following information is required to use your email address
              for authentication.
            </P>
            <Form large onSubmit={handleSubmit}>
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={emailInvalid}
                autoFocus
                ref={refEmail}
              />
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                allowShowPassword
                name="password"
                id="password"
                password={password}
                setPassword={setPassword}
                setErrorMessage={setErrorMessage}
                invalid={passwordInvalid}
                ref={refPassword}
              />
              <Label htmlFor="confirmPassword">Confirm</Label>
              <PasswordInput
                allowShowPassword
                name="confirmPassword"
                id="confirmPassword"
                password={confirmPassword}
                setPassword={setConfirmPassword}
                setErrorMessage={setErrorMessage}
                invalid={confirmPasswordInvalid}
                ref={refConfirmPassword}
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

export default SettingsAuthEmail;
