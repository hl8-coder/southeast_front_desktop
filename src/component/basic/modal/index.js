import React, {Component} from "react";
import styles from "./modal.module.scss";
import { Modal as AntModal } from "antd";
import intl from "react-intl-universal";

export default class Modal extends Component {
  static info = (props) => {
    const {className, ...rest} = props;
    const config = {
      type: 'info',
      className: `${styles["override-modal"]} ${className || ""}`,
      centered: true,
      width: 400,
      icon: null,
      okCancel: false,
      okText: intl.get("BTN_OKAY"),
      ...rest,
    };
    return AntModal.confirm(config);
  };
  // static success = AntModal.success;
  // static error = AntModal.error;
  // static warning = AntModal.warning;
  // static warn = AntModal.warn;
  static confirm = (props) => {
    const {className, ...rest} = props;
    const config = {
      type: 'confirm',
      className: `${styles["override-modal"]} ${className || ""}`,
      centered: true,
      width: 400,
      okCancel: true,
      icon: null,
      cancelText: intl.get("BTN_CANCEL").toUpperCase(),
      okText: intl.get("BTN_OKAY"),
      ...rest,
    };
    return AntModal.confirm(config);
  };
  static destroyAll = AntModal.destroyAll;

  render() {
    const {className, ...rest} = this.props;
    const config = {
      className: `${styles["override-modal"]} ${className || ""}`,
      centered: true,
      width: 400,
      footer: null,
      ...rest
    };
    return <AntModal {...config} />
  }
}

