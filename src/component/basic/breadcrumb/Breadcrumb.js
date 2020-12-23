import React from "react";
import styles from "./breadcrumb.module.scss";

export default props => {
  const { children, history } = props;
  return <ul className={styles["breadcrumbs"]}>
      <li><div className={styles.back} onClick={() => {history.goBack()}}/></li>
      {
        children.map((item, index) => {
          return <li className={styles.link} key={`breadcrumb${index}`}>{item}</li>;
        })
      }
    </ul>
}