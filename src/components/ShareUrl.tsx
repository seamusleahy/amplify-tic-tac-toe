import React, { createRef } from "react";

import styles from "./ShareUrl.module.css";

export interface ShareUrlProps {
  url: string;
  onCopied?: () => void;
}

const ShareUrl: React.FunctionComponent<ShareUrlProps> = ({
  url,
  onCopied = () => {}
}) => {
  const inputRef = createRef<HTMLInputElement>();

  const copy: React.MouseEventHandler<HTMLButtonElement> = e => {
    if (inputRef.current !== null) {
      inputRef.current.select();
      document.execCommand("copy");
      (e.target as HTMLButtonElement).focus();
      onCopied();
    }
  };

  return (
    <div>
      <h3 className={styles.header}>Share the URL with your friend to play</h3>
      <div>
        <input
          className={styles.url}
          type="text"
          value={url}
          size={url.length}
          readOnly
          ref={inputRef}
        />
        <button className={styles.copyButton} onClick={copy}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareUrl;
