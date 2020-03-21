import React from "react";

import styles from "./NamePrompt.module.css";

export interface NamePromptProps {
  onNameValue: (name: string) => void;
}

export interface NamePromptState {
  name: string;
}

export default class NamePrompt extends React.Component<
  NamePromptProps,
  NamePromptState
> {
  state = { name: "" };

  onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    this.setState({ name: event.target.value });
  };

  onSubmit: React.FormEventHandler = event => {
    const { name } = this.state;
    if (name) {
      this.props.onNameValue(name);
    }
    event.preventDefault();
  };

  render() {
    const { name } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <h2 className={styles.header}>Enter your name</h2>
        <input
          className={styles.field}
          type="text"
          required
          minLength={1}
          onChange={this.onChange}
        />
        <button className={styles.button} type="submit" disabled={!name.length}>
          Play
        </button>
      </form>
    );
  }
}
