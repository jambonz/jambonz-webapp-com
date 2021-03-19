import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components/macro";

import ExternalMain from "../../components/wrappers/ExternalMain";
import Form from "../../components/elements/Form";
import Button from "../../components/elements/Button";
import Input from "../../components/elements/Input";
import FormError from "../../components/blocks/FormError";
import P from "../../components/elements/P";
import { NotificationDispatchContext } from "../../contexts/NotificationContext";
import Loader from "../../components/blocks/Loader";
import InputGroup from "../../components/elements/InputGroup";

const StyledFormError = styled(FormError)`
  margin-top: 1rem;
`;

const ForgotPassword = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  // Refs
  const refEmail = useRef(null);

  // Form inputs
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  // Invalid form inputs
  const [invalidEmail, setInvalidEmail] = useState(false);

  const isValidEmail = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  };

  const handleSubmit = async (e) => {
    let isMounted = true;

    console.log("**** handleSubmit function called");
    try {
      e.preventDefault();
      setErrorMessage("");
      setInvalidEmail(false);

      if (!email) {
        setErrorMessage("Email is required.");
        setInvalidEmail(true);
        refEmail.current.focus();
        return;
      }

      if (!isValidEmail(email)) {
        setErrorMessage("Email is invalid.");
        setInvalidEmail(true);
        refEmail.current.focus();
        return;
      }

      setShowLoader(true);

      const result = await axios({
        method: "post",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/forgot-password`,
        data: {
          email,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (result.status === 204) {
        dispatch({
          type: "ADD",
          level: "success",
          message:
            "Please check your email for password reset instructions that we have sent for the email on file.",
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.error);
        setInvalidEmail(true);
      } else if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        isMounted = false;
        history.push("/");
        dispatch({
          type: "ADD",
          level: "error",
          message: "Your session has expired. Please log in and try again.",
        });
      } else {
        setErrorMessage("Something went wrong, please try again.");
        dispatch({
          type: "ADD",
          level: "error",
          message:
            (err.response && err.response.data && err.response.data.msg) ||
            "Unable to get carriers",
        });
        console.error(err.response || err);
      }
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  const onEmailChange = (value) => {
    setEmail(value);
    setInvalidEmail(false);
    setErrorMessage("");
  };

  return (
    <ExternalMain title="Forgot Password">
      {showLoader ? (
        <Loader height="150px" />
      ) : (
        <Form left onSubmit={handleSubmit}>
          <P>Enter your email and we will send you a password reset link</P>
          <Input
            fullWidth
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            ref={refEmail}
            invalid={invalidEmail}
            autoFocus
          />
          <InputGroup spaced>
            <Button fullWidth>Send me a reset password link</Button>
          </InputGroup>
          {errorMessage && <StyledFormError grid message={errorMessage} />}
        </Form>
      )}
    </ExternalMain>
  );
};

export default ForgotPassword;
