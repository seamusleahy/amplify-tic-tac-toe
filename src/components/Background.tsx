import React, { useContext } from "react";

import {
  Background as BackgroundSettings,
  WrapperContext,
  Logo as LogoOptions
} from "./Wrapper";
export {
  Background as BackgroundOptions,
  Logo as LogoOptions
} from "./Wrapper";

export interface BackgroundProps {
  background: BackgroundSettings;
  logo: LogoOptions;
}

const Background: React.FunctionComponent<BackgroundProps> = ({background, logo}) => {
    const wrapperContext = useContext(WrapperContext);
    setTimeout(() => {
      wrapperContext.setBackground(background);
      wrapperContext.setLogo(logo);
    }, 20);
    
    return null;
};

export default Background;
