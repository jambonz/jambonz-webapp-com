import React from "react";

import Subscription from "./subscription";
import InternalMain from "../../../components/wrappers/InternalMain";

const UpgradeSubscription = () => (
  <InternalMain
    type="form"
    title="Upgrade your Subscription"
    breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
  >
    <Subscription />
  </InternalMain>
);

export default UpgradeSubscription;
