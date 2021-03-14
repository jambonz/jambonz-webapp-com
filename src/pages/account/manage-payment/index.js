import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components/macro";

import InternalMain from "../../../components/wrappers/InternalMain";
import H2 from "../../../components/elements/H2";
import Section from "../../../components/blocks/Section";
import Button from "../../../components/elements/Button";
import InputGroup from "../../../components/elements/InputGroup";
import Loader from "../../../components/blocks/Loader";
import NewPaymentInfo from "./new-payment";

const PaymentInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: fit-content;
  grid-gap: 16px 30px;
  margin-bottom: 1.5rem;
`;

const Cell = styled.span`
  font-family: "WorkSans";
  font-size: 16px;
  line-height: 19px;
`;

const ManagePaymentInfo = () => {
  const jwt = localStorage.getItem("jwt");

  const [showLoader, setShowLoader] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [paymentEditMode, setPaymentEditMode] = useState(false);

  const showPaymentEditPanel = () => {
    setPaymentEditMode(true);
  };

  useEffect(() => {
    let isMounted = true;

    const getUserData = async () => {
      try {
        const userResponse = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Users/me",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const { subscription } = userResponse.data;
        setPaymentInfo({
          last4: (subscription || {}).last4,
          exp_month: (subscription || {}).exp_month,
          exp_year: (subscription || {}).exp_year,
          card_type: (subscription || {}).card_type,
        });
      } catch (err) {
        isMounted = false;
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InternalMain
      type="normalTable"
      title="Manage Payment Information"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section>
        {showLoader ? (
          <Loader height="calc(100vh - 24rem)" />
        ) : (
          <>
            <H2>Current payment information</H2>
            <PaymentInfo>
              <Cell>Card Type</Cell>
              <Cell>{paymentInfo.card_type || ""}</Cell>
              <Cell>Card Number</Cell>
              <Cell>{paymentInfo.last4 ? `**** **** **** ${paymentInfo.last4}`: ''}</Cell>
              <Cell>Expiration</Cell>
              <Cell>{paymentInfo.exp_year ? `${paymentInfo.exp_month}/${paymentInfo.exp_year}`: ''}</Cell>
            </PaymentInfo>
            <InputGroup flexEnd spaced>
              <Button onClick={showPaymentEditPanel}>Change Payment Info</Button>
            </InputGroup>
          </>
        )}
      </Section>
      {paymentEditMode && (
        <NewPaymentInfo />
      )}
    </InternalMain>
  );
};

export default ManagePaymentInfo;
