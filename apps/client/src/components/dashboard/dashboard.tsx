import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";

import DashLogOut from "./DashLogOut";
import Head from "../header/Head";
import React from "react";

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
