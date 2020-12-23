import React, {Component} from "react";
import {Checkbox as AntCheckbox} from "antd";
import styles from './checkbox.module.scss';

const { Group: AntGroup } = AntCheckbox;

export default class Checkbox extends Component {
  static Group = AntGroup;
  render() {
    const { className, ...rest} = this.props;
    return <AntCheckbox className={`${styles["override-checkbox"]} ${className ? className : ""}`} {...rest} />
  }
}