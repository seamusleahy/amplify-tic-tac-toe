import React from 'react';

import styles from './Error.module.css';

export interface ErrorProps {
  message: string;
}

const Error: React.FunctionComponent<ErrorProps> = ({message}) => (
  <div className={styles.error}>{message}</div>
);

export default Error;