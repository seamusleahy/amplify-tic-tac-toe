import React, { useState, createContext } from "react";

import OpenReduxDevTools from "./OpenReduxDevTools";
import DisplayLogs from "./DisplayLogs";
import Header from "./Header";
import LogoImage from "./Logo";

import styles from "./Wrapper.module.css";

export enum Background {
  HOME,
  DEFAULT,
  WINNER,
  ERROR,
  LOADING
}

export enum Logo {
  HOME,
  DEFAULT
}

interface WrapperContentInterface {
  setBackground: (bg: Background) => void;
  setLogo: (logo: Logo) => void;
}

export const WrapperContext = createContext<WrapperContentInterface>({
  setBackground: (bg: Background) => {},
  setLogo: (logo: Logo) => {}
});

const backgroundClasses = new Map<Background, string>([
  [Background.HOME, styles.bgOrangePink],
  [Background.DEFAULT, styles.bgDark],
  [Background.WINNER, styles.bgDarkGlow],
  [Background.LOADING, styles.bgDarkLoading],
  [Background.ERROR, styles.bgRedError]
]);

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({ children }) => {
  const [background, setBackground] = useState(Background.HOME);
  const [logo, setLogo] = useState(Logo.HOME);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const contextValue: WrapperContentInterface = {
    setBackground: setBackground,
    setLogo: setLogo
  };

  const bgClass = backgroundClasses.get(background) || "";

  return (
    <div className={`${styles.Wrapper} ${bgClass}`}>
      <Header
        onToggleLogs={() => setDrawerOpen(!isDrawerOpen)}
        logsShowing={isDrawerOpen}
      />
      <main className={styles.main}>
        <LogoImage
          className={`${styles.logo} ${
            logo === Logo.HOME ? styles.logoHome : ""
          }`}
          isHome={logo === Logo.HOME}
        />
        <WrapperContext.Provider value={contextValue}>
          {children}
        </WrapperContext.Provider>
      </main>
      {isDrawerOpen && (
        <div className={styles.drawer}>
          <OpenReduxDevTools />
          <DisplayLogs />
        </div>
      )}
    </div>
  );
};

export default Wrapper;
