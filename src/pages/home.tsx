import React from "react";

import NewGameLink from "../components/NewGameLink";
import Background, {BackgroundOptions, LogoOptions} from '../components/Background';

import styles from "./home.module.css";

const HomePage: React.FunctionComponent = () => (
  <div className={styles.HomePage}>
    <Background background={BackgroundOptions.HOME} logo={LogoOptions.HOME} />
    <div className={styles.contents}>
      <NewGameLink />
    </div>
  </div>
);

export default HomePage;
