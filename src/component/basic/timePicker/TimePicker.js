import React, {Component} from "react";
import styles from "./timePicker.module.scss";
import {TimePicker as AntTimePicker} from "antd";

export default class TimePicker extends Component {
  render() {
    const {className, ...rest} = this.props;
    const config = {
      className: `${styles["override-timepicker"]} ${className || ""}`,
      ...rest
    };
    return <AntTimePicker {...config} />
  }
}