import React from "react";

import styles from "./Header.module.css";

export interface HeaderProps {
  logsShowing: boolean;
  onToggleLogs: () => void;
  classNames?: string;
}

const Header: React.FunctionComponent<HeaderProps> = ({
  logsShowing,
  onToggleLogs,
  classNames = ""
}) => (
  <div className={`${styles.Header} ${classNames}`}>
    <a
      href="https://github.com/seamusleahy/amplify-tic-tac-toe"
      className={styles.description}
    >
      A technical exploration of AWS Amplify and AppSync. The focus of the
      exploration is to use AppSync's GraphQL subscription feature as a PubSub.{" "}
      <span className={styles.readMore}>Read More on Github→</span>
    </a>

    <button className={styles.toggleLogs} onClick={onToggleLogs}>
      {logsShowing ? "Hide Logs" : "Show Logs"}
    </button>
  </div>
);

export default Header;
