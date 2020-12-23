import React, {Component} from "react";
import {Radio as AntRadio} from "antd";
import styles from "./radio.module.scss";

const { Group } = AntRadio;

export default class Radio extends Component {
  static Group = Group;
  render() {
    const { className, ...props} = this.props;
    return <AntRadio {...props} className={`${styles["override-radio"]} ${className ? className : ""}`} />
  }
}