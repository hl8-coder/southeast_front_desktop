import React from "react";
import { Table } from "antd";
import styles from "./table.module.scss";

export default props => {
  const { className, style, ...tableProps } = props;
  return <div className={styles["override-table"] + " " + className} style={style}>
    <Table {...tableProps} />
  </div>
}