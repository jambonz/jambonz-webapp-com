import { useState, useRef, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import ExternalMain from "../../components/wrappers/ExternalMain";
import Form from "../../components/elements/Form";
import Button from "../../components/elements/Button";
import PasswordInput from "../../components/elements/PasswordInput";
import FormError from "../../components/blocks/FormError";
import { NotificationDispatchContext } from "../../contexts/NotificationContext";
import Loader from "../../components/blocks/Loader";
import InputGroup from "../../components/elements/InputGroup";
import P from "../../components/elements/P";

const ResetPassword = () => {
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");

  const history = useHistory();

  const { id: passwordResetLink } = useParams();
  // Refs
  const refPassword = useRef(null);

  // Form inputs
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  // Invalid form inputs
  const [invalidPassword, setInvalidPassword] = useState(false);

  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      e.preventDefault();
      setErrorMessage("");
      setInvalidPassword(false);
      let errorMessages = [];

      if (!password) {
        errorMessages.push("Password is required");
        setInvalidPassword(true);
        refPassword.current.focus();
      } else {
        if (password.length < 6) {
          errorMessages.push("Password must be at least 6 characters long.");
          setInvalidPassword(true);
          refPassword.current.focus();
        }

        if (!/[a-zA-Z]/.test(password)) {
          errorMessages.push("Password must contain a letter.");
          setInvalidPassword(true);
          refPassword.current.focus();
        }

        if (!/[0-9]/.test(password)) {
          errorMessages.push("Password must contain a number.");
          setInvalidPassword(true);
          refPassword.current.focus();
        }
      }

      if (errorMessages.length > 1) {
        setErrorMessage(errorMessages);
        return;
      } else if (errorMessages.length === 1) {
        setErrorMessage(errorMessages[0]);
        return;
      }

      //===============================================
      // Submit
      //===============================================
      await axios({
        method: "post",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/change-password`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          old_password: passwordResetLink,
          new_password: password,
        },
      });

      isMounted = false;
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
        setErrorMessage((err.response && err.response.data && err.response.data.msg) || 'Something went wrong, please try again.');
        console.error(err.response || err);
      }
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const autoSignIn = async () => {
      try {
        const result = await axios({
          method: "post",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/signin`,
          data: {
            link: passwordResetLink,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted && result.status === 200) {
          localStorage.setItem("jwt", result.data.jwt);
          localStorage.setItem("user_sid", result.data.user_sid);
          localStorage.setItem("account_sid", result.data.account_sid);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 401) {
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
        }
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    autoSignIn();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ExternalMain title="Set a New Password">
      {showLoader ? (
        <Loader height="130px" />
      ) : (
        <Form left onSubmit={handleSubmit}>
          <P>Enter a new password.</P>
          <PasswordInput
            allowShowPassword
            name="password"
            id="password"
            placeholder="Password"
            password={password}
            setPassword={setPassword}
            setErrorMessage={setErrorMessage}
            ref={refPassword}
            invalid={invalidPassword}
          />
          {errorMessage && <FormError message={errorMessage} />}
          <InputGroup flexEnd spaced>
            <Button fullWidth>Save</Button>
          </InputGroup>
        </Form>
      )}
    </ExternalMain>
  );
};

export default ResetPassword;
