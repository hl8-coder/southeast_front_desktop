import React, {Component} from "react";
import styles from "./content.module.scss";
import Field from "../../../component/basic/field/Field";
import UserRequest from "../../../request/User";
import intl from "react-intl-universal";

export default class Password extends Component {
  state = {
    old_password: "",
    new_password: "",
    new_password_confirmation: ""
  };

  handleSubmit = () => {
    UserRequest.modifyPwd(this.state).then(() => {
      this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/account`);
    });
  };

  render() {
    return <div className={styles["panel-content"]}>
        <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get('USER_PASSWORD_CHANGE_PASSWORD')}</div>
      <div className={`${styles.tips} ${styles.flex1}`}>
          {intl.get('USER_PASSWORD_INFORMATION')} (<span className={styles.hl}>*</span>) {intl.get('USER_PASSWORD_REQUIRED')}.<br />
      </div>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>{intl.get('USER_PASSWORD_CURRENT')}: <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field type="password" onChange={val => {this.setState({old_password: val})}} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>{intl.get('USER_PASSWORD_NEW')}: <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field type="password" onChange={val => {this.setState({new_password: val})}} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>{intl.get('USER_PASSWORD_CONFIRM')}: <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field type="password" onChange={val => {this.setState({new_password_confirmation: val})}} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label} />
          <div className={styles["form-elm"]}>
            <button className={styles["btn-primary"]} onClick={this.handleSubmit}>{intl.get('BTN_UPDATE')}</button>
          </div>
        </div>
      </div>
    </div>
  }
}
