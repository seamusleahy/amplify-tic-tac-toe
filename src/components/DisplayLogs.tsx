import React from "react";

import * as logGraphQl from "../logGraphQl";

import styles from "./DisplayLogs.module.css";

function graphQlSyntaxHighlight(query: string) {
  return query
    .replace(
      /^(\s*)(mutation|query|subscribe)(\s+)(\w+)/g,
      (_, s0, type, s1, name) =>
        `${s0}<span class="${styles.type}">${type}</span>${s1}<span class="${styles.queryName}">${name}</span>`
    )
    .replace(
      /([{}])/g,
      (_, bracket) => `<span class="${styles.bracket}">${bracket}</span>`
    )
    .replace(/\(([^)]+)\)/g, (_, parenContents: string) => {
      const formattedContent = parenContents
        .replace(
          /(\s*)(\S+)(\s*):(\s*)(\S+)(\s*)/g,
          (_, s0, lhs, s1, s2, rhs, s3) =>
            `${s0}<span class="${styles.paramLeftSide}">${lhs}</span>${s1}:${s2}<span class="${styles.paramRightSide}">${rhs}</span>${s3}`
        )
        .replace(/\$\w+/g, variable => `<span class="${styles.vars}">${variable}</span>`)
        .replace(
          /(String|Boolean|\[String\])[!]?/g,
          glType => `<span class="${styles.type}">${glType}</span>`
        );

      return `(${formattedContent})`;
    });
}

function jsonSyntaxHighlight(obj: {} | null) {
  let json = JSON.stringify(obj, null, 2);
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function(match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = styles.key;
        } else {
          cls = styles.stringValue;
        }
      } else if (/true|false/.test(match)) {
        cls = styles.booleanValue;
      } else if (/null/.test(match)) {
        cls = styles.nullValue;
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function formatTime(time: Date) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  return `${hours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
}

export default class DisplayLogs extends React.Component<{}> {
  componentDidMount() {
    logGraphQl.subscribe(() => this.forceUpdate());
  }

  render() {
    const logs = logGraphQl.getLogs().map((log, index) => {
      switch (log.type) {
        case logGraphQl.LogTypes.MUTATION:
          return (
            <details key={index} className={styles.log}>
              <summary>
                <span><span role="img" aria-label="">⬆️</span> mutation:</span>
                <span>{log.name}</span>
                <span>{formatTime(log.time)}</span>
              </summary>
              {log.comment && <p>{log.comment}</p>}
              <pre
                className={styles.preformatted}
                dangerouslySetInnerHTML={{
                  __html: graphQlSyntaxHighlight(log.query)
                }}
              />
              <pre
                className={styles.preformatted}
                dangerouslySetInnerHTML={{
                  __html: jsonSyntaxHighlight(log.variables)
                }}
              />
              <details>
                <summary>Stack Trace</summary>
                <pre>{log.stack}</pre>
              </details>
            </details>
          );

        case logGraphQl.LogTypes.SUBSCRIBING:
          return (
            <details key={index} className={styles.log}>
              <summary>
                <span><span role="img" aria-label="">👂</span> subscribe:</span>
                <span>{log.name}</span>
                <span>{formatTime(log.time)}</span>
              </summary>
              {log.comment && <p>{log.comment}</p>}
              <pre
                className={styles.preformatted}
                dangerouslySetInnerHTML={{
                  __html: graphQlSyntaxHighlight(log.query)
                }}
              />
              <pre
                className={styles.preformatted}
                dangerouslySetInnerHTML={{
                  __html: jsonSyntaxHighlight(log.variables)
                }}
              />
              <details>
                <summary>Stack Trace</summary>
                <pre>{log.stack}</pre>
              </details>
            </details>
          );

        case logGraphQl.LogTypes.SUBSCRIPTION_EVENT:
          return (
            <details key={index} className={styles.log}>
              <summary>
                <span><span role="img" aria-label="">⬇️</span> receive subscription:</span>
                <span>{log.name}</span>
                <span>{formatTime(log.time)}</span>
              </summary>
              {log.comment && <p>{log.comment}</p>}
              <pre
                className={styles.preformatted}
                dangerouslySetInnerHTML={{
                  __html: jsonSyntaxHighlight(log.variables)
                }}
              />
              <details>
                <summary>Stack Trace</summary>
                <pre className={styles.preformatted}>{log.stack}</pre>
              </details>
            </details>
          );
      }

      return null;
    });

    return <div>{logs}</div>;
  }
}
