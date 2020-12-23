import React from "react";
import styles from "./pagination.module.scss";
import {Pagination} from "antd";

export default props => {
  const {className, ...rest} = props;
  return <Pagination className={`${styles["override-pagination"]} ${className || ""}`} {...rest} />
}