import React, {Component} from "react";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import styles from "./content.module.scss";
import {Icon} from "antd";
import {Link} from "react-router-dom";
import CardRequest from "../../../request/Card";
import WithdrawalRequest from "../../../request/Withdrawal";
import {Modal, Field, Select, Button} from "../../../component/basic";
import UserRequest from "../../../request/User";
import actions from "../../../store/actions";
import ConfigurationRequest from "../../../request/Configuration";

const { Option } = Select;

class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    const {userInfo} = this.props.user;
    this.state = {
      btnLoading: false,
      currency: userInfo.currency,
      currencyUnit: userInfo.currency === "VND" ? ".000" : "",
      amount: "",
      user_bank_account_id: undefined,
      cardOpts: [],
      min_withdrawal: "",
      max_withdrawal: "",
      max_daily_withdrawal: ""
    }
  }

  componentDidMount() {
    this.getCards();
    this.getCurrencyLimit();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getCards();
      this.getCurrencyLimit();
    }
  }

  getCurrencyLimit() {
    ConfigurationRequest.getCurrency().then(res => {
      this.setState({
        min_withdrawal: res.min_withdrawal,
        max_withdrawal: res.max_withdrawal,
        max_daily_withdrawal: res.max_daily_withdrawal
      })
    })
  }

  getCards = () => {
    CardRequest.getCards().then(res => {
      this.setState({
        cardOpts: res.data
      })
    });
  };

  handleSelectChange(val) {
    this.setState({
      user_bank_account_id: val
    });
  }

  handleSubmit() {
    const {cardOpts, currency, currencyUnit, ...data} = this.state;
    this.setState({
      btnLoading: true
    });
    WithdrawalRequest.withdrawal(data).then(() => {
      Modal.confirm({
        content: intl.get('MESSAGE_withdrawal_success'),
        okText: intl.get("BTN_VIEW_HISTORY").toUpperCase(),
        onOk: () => {
          this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/history/h_dw`);
        }
      });
      this.getUserInfo();
    }).finally(() => {
      this.setState({
        btnLoading: false
      });
    });
  }

  getUserInfo = () => {
    UserRequest.getUserInfo().then(res => {
      this.props.saveUserInfo(res);
    });
  };

  render() {
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={`${styles.title} ${styles.flex5}`}>{intl.get("WITHDRAWAL_TITLE")}</div>
        <div className={styles.tips + " " + styles.flex5}>
          {intl.get("BANKING_HEAD_TIP_1")}<span className={styles.hl}>*</span>{intl.get("BANKING_HEAD_TIP_2")}<br />
          {intl.get("BANKING_HEAD_TIP_3", {time: "15 - 30"})}<br />
          {intl.get("BANKING_HEAD_TIP_4")}
        </div>
        <div className={styles.tips + " " + styles.flex4}>
          <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_MODE")}</span> {intl.get("BANKING_HEAD_VALUE_MODE")}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_PER_WITHDRAWAL")}</span> {this.state.min_withdrawal} / {this.state.max_withdrawal}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_MAX_PER_DAY")}</span> {this.state.max_daily_withdrawal}</div>
        </div>
        {/*<div className={styles.tips + " " + styles.flex3}>*/}
        {/*  <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_DAILY")}</span> 1,000,000.00</div>*/}
        {/*  <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_TOTAL")}</span> 10 times per day</div>*/}
        {/*</div>*/}
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>1. {intl.get("WITHDRAWAL_LABEL_AMOUNT")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field type="number" placeholder={intl.get("WITHDRAWAL_PLACEHOLDER_AMOUNT")} className={styles["form-elm"]} value={this.state.amount} onChange={val => {this.setState({amount: val})}} />
          </div>
          <div className={styles.unit}>{this.state.currencyUnit} {this.state.currency}</div>
        </div>
        <div className={styles.row + " " + styles["with-link"] + " " + styles.multi}>
          <div className={styles.label}>2. {intl.get("WITHDRAWAL_LABEL_NUMBER")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Select value={this.state.user_bank_account_id} placeholder={intl.get("WITHDRAWAL_PLACEHOLDER_NUMBER")} suffixIcon={<Icon type="caret-down" />} onChange={this.handleSelectChange}>
              {
                this.state.cardOpts.map((item, index) => <Option value={item.id} key={"otp" + index}>{item.bank.code + "-" + item.account_no}</Option>)
              }
            </Select>
            <Link to={`/${window.location.pathname.split("/")[1]}/user/details`}><div className={styles.link}>{intl.get("LINK_MANAGE_ACCOUNT")}</div></Link>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label} />
          <div className={styles["form-elm"]}>
            <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                    onClick={this.handleSubmit}>{intl.get("BTN_WITHDRAWAL")}</Button>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}), actions)(Withdrawal);
