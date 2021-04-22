import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import InternalMain from "../../../components/wrappers/InternalMain";
import Section from "../../../components/blocks/Section";
import Loader from "../../../components/blocks/Loader";
import Form from "../../../components/elements/Form";
import Label from "../../../components/elements/Label";
import Select from "../../../components/elements/Select";
import FormError from "../../../components/blocks/FormError";
import InputGroup from "../../../components/elements/InputGroup";
import Button from "../../../components/elements/Button";
import handleErrors from "../../../helpers/handleErrors";

const DeviceApplicationAddEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  const { device_calling_application_sid } = useParams();
  const type = device_calling_application_sid ? "edit" : "add";

  const [showLoader, setShowLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [application, setApplication] = useState(
    device_calling_application_sid || ""
  );
  const [applicationList, setApplicationList] = useState([]);
  const [applicationInvalid, setApplicationInvalid] = useState(false);

  const refSelect = useRef(null);

  const handleSubmit = async (e) => {
    let isMounted = true;

    try {
      e.preventDefault();
      setErrorMessage("");
      setApplicationInvalid(false);

      if (!application) {
        setErrorMessage("Please provide a application.");
        setApplicationInvalid(true);
        if (refSelect && refSelect.current) {
          refSelect.current.focus();
        }

        return;
      }

      setShowLoader(true);

      await axios({
        method: "put",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          device_calling_application_sid: application,
        },
      });

      isMounted = false;
      history.push("/account");
      dispatch({
        type: "ADD",
        level: "success",
        message: `Device calling application ${
          type === "add" ? "created" : "updated"
        } successfully`,
      });
    } catch (err) {
      console.log(err);
      handleErrors({ err, history, dispatch, setErrorMessage });
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  useEffect(() => {
    const getApplication = async () => {
      let isMounted = true;

      try {
        const result = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Applications",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (result && result.data) {
          setApplicationList(
            result.data.sort((a, b) =>
              a.name ? a.name.localeCompare(b.name) : -1
            )
          );
        }
      } catch (err) {
        console.log(err);
        handleErrors({ err, history, dispatch, setErrorMessage });
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    getApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InternalMain
      type="form"
      title={`${type === "edit" ? "Edit" : "Add"} Device calling application`}
      breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
    >
      <Section>
        {showLoader ? (
          <Loader height={type === "edit" ? "646px" : "611px"} />
        ) : (
          <Form large onSubmit={handleSubmit}>
            <Label htmlFor="application">Application</Label>
            <Select
              name="application"
              id="application"
              value={application}
              ref={refSelect}
              invalid={applicationInvalid}
              onChange={(e) => setApplication(e.target.value)}
            >
              <option value="">-- NONE --</option>
              {applicationList.map((a) => (
                <option key={a.application_sid} value={a.application_sid}>
                  {a.name}
                </option>
              ))}
            </Select>
            {errorMessage && <FormError grid message={errorMessage} />}
            <InputGroup flexEnd spaced>
              <Button
                rounded="true"
                gray
                type="button"
                onClick={() => {
                  history.push("/account");
                  dispatch({
                    type: "ADD",
                    level: "info",
                    message: "Changes canceled",
                  });
                }}
              >
                Cancel
              </Button>
              <Button rounded="true">
                {type === "add" ? "Add Device Calling Application" : "Save"}
              </Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default DeviceApplicationAddEdit;
