import React from "react";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

import Head from "../header/Head";
import DashLogOut from "./DashLogOut";

const dashboard = () => {
  return (
    <div>
      <ShowOnLogout>
        <DashLogOut />
      </ShowOnLogout>

      <ShowOnLogin>
        <Head />
      </ShowOnLogin>
    </div>
  );
};

export default dashboard;
