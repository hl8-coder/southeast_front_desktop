import React, {Component} from "react";
import {DatePicker as AntDatePicker} from "antd";
import styles from "./datePicker.module.scss";
import suffix from "./image/calendar-alt.png";
export default class DatePicker extends Component {
  render() {
    const {className, suffixIcon, ...rest} = this.props;
    const config = {
      className: `${styles["override-datepicker"]} ${className || ""}`,
      suffixIcon: suffixIcon || <img src={suffix} alt="calendar" />,
      ...rest
    };
    return <AntDatePicker {...config} />
  }
}


