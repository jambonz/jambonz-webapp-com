import React, { useState, useRef, useContext, useEffect } from "react";
import { Link as ReactRouterLink, useHistory } from "react-router-dom";
import axios from "axios";

import InternalMain from "../../../components/wrappers/InternalMain";
import Form from "../../../components/elements/Form";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import P from "../../../components/elements/P";
import InputGroup from "../../../components/elements/InputGroup";
import Loader from "../../../components/blocks/Loader";
import Section from "../../../components/blocks/Section";
import FormError from "../../../components/blocks/FormError";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import handleErrors from "../../../helpers/handleErrors";

const SipRealmEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);

  const refSubdomain = useRef(null);

  const [showLoader, setShowLoader] = useState(true);
  const [subdomain, setSubdomain] = useState("");
  const [invalidSubdomain, setInvalidSubdomain] = useState(false);
  const [quickValid, setQuickValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rootDomain, setRootDomain] = useState("");

  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  const subdomainValidation = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

  const handleSubmit = async (e) => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage("");
      setInvalidSubdomain(false);

      if (!subdomain) {
        setErrorMessage("Subdomain is required.");
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (subdomain.length < 3) {
        setErrorMessage("Subdomain must be at least 3 characters long.");
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (subdomain.length > 64) {
        setErrorMessage("Subdomain must not be more than 64 characters long.");
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(subdomain)) {
        setErrorMessage(
          "Subdomains can only include lower case letters, numbers, and hyphens. Hyphens cannot be used as the first or last characters."
        );
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const availabilityResponse = await axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Availability/?type=subdomain&value=${subdomain}.${rootDomain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (availabilityResponse.data.available !== true) {
        setErrorMessage("That subdomain is not available.");
        setInvalidSubdomain(true);
        setShowLoader(false);
        refSubdomain.current.focus();
        return;
      }

      const createResponse = await axios({
        method: "POST",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SipRealms/${subdomain}.${rootDomain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (createResponse.status !== 204) {
        throw new Error(
          `Unable to save subdomain. Please try a different subdomain.`
        );
      }

      dispatch({
        type: "ADD",
        level: "success",
        message: `"Your SIP Realm has been changed to ${subdomain}.${rootDomain}`,
      });

      isMounted = false;
      history.push("/account");
    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
          err.message ||
          "Something went wrong, please try again."
      );
      console.error(err.response || err);
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  const handleChange = async (e) => {
    setSubdomain(e.target.value);
    setInvalidSubdomain(false);
    setErrorMessage("");

    if (subdomainValidation.test(e.target.value)) {
      const availabilityResponse = await axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Availability/?type=subdomain&value=${e.target.value}.${rootDomain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (availabilityResponse.data.available) {
        setQuickValid(true);
      } else {
        setQuickValid(false);
      }
      return;
    }

    setQuickValid(null);
  };

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      try {
        const userResponse = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Users/me",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          setRootDomain((userResponse.data.account || {}).root_domain);
        }
      } catch (err) {
        handleErrors({ err, history, dispatch, setErrorMessage });
      } finally {
        setShowLoader(false);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InternalMain
      title="Edit SIP Realm"
      type="form"
      breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
    >
      <Section>
        <Form left onSubmit={handleSubmit}>
          {showLoader ? (
            <Loader height="161px" />
          ) : (
            <React.Fragment>
              <P>
                This is the domain name where your carrier will send calls, and
                where you can register devices to.
              </P>
              <Input
                fullWidth
                type="text"
                name="subdomain"
                id="subdomain"
                placeholder="your-name-here"
                value={subdomain}
                onChange={handleChange}
                ref={refSubdomain}
                invalid={invalidSubdomain}
                quickValid={quickValid}
                autoFocus
              />
              {subdomain && (
                <P>
                  FQDN: {subdomain}.{rootDomain}
                </P>
              )}
              {errorMessage && <FormError message={errorMessage} />}
              <InputGroup flexEnd spaced>
                <Button gray="true" as={ReactRouterLink} to="/account">
                  Cancel
                </Button>
                <Button>Change SIP Realm</Button>
              </InputGroup>
            </React.Fragment>
          )}
        </Form>
      </Section>
    </InternalMain>
  );
};

export default SipRealmEdit;
