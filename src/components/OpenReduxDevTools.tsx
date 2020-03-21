import React from "react";

import styles from "./OpenReduxDevTools.module.css";

const OpenReduxDevTools: React.FunctionComponent = () => {
  if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    return (
      <div className={styles.reduxtools}>
        <a className={styles.link} href="http://extension.remotedev.io/">
          Install Redux Devtools to inspect game state
        </a>
      </div>
    );
  }

  return (
    <div className={styles.reduxtools}>
      <button
        className={styles.button}
        onClick={() =>
          (window as any).__REDUX_DEVTOOLS_EXTENSION__.open("bottom")
        }
      >
        Open Redux Devtools
      </button>
    </div>
  );
};

export default OpenReduxDevTools;
