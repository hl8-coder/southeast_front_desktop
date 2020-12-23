import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./content.module.scss";
import Field from "../../../component/basic/field/Field";
import PaymentPlatformRequest from "../../../request/PaymentPlatform";
import {Icon} from "antd";
import Select from "../../../component/basic/select/Select";
import DepositRequest from "../../../request/Deposit";
import Utils from "../../../util/Utils";
import {connect} from "react-redux";
import {Button} from "../../../component/basic";

const { Option } = Select;

class Quickpay extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    const {userInfo} = this.props.user;
    this.state = {
      btnLoading: false,
      name: "",
      currency: userInfo.currency,
      currencyUnit: userInfo.currency === "VND" ? ".000" : "",
      cardInfo: null,
      bankOpts: null,
      min_deposit: "",
      max_deposit: "",
      payment_type: null,
      payment_platform_id: null,
      amount: '',
      bank_code: '',
      redirect: window.location.origin
    }
  }

  componentDidMount() {
    this.getPaymentPlatform();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getPaymentPlatform();
    }
  }

  getPaymentPlatform = () => {
    const params = this.props.match.params;
    PaymentPlatformRequest.getPaymentPlatforms({
      "filter[id]": params.id,
      "filter[payment_type]": params.type
    }).then(res => {
      let { data } = res;
      this.setState({
        name: data[0].name,
        cardInfo: data[0],
        bankOpts: data[0].banks,
        payment_type: data[0].payment_type,
        payment_platform_id: data[0].id,
        min_deposit: data[0].min_deposit,
        max_deposit: data[0].max_deposit
      })
    });
  };

  handleSubmit() {
    const data = {
      payment_type: this.state.payment_type,
      payment_platform_id: this.state.payment_platform_id,
      amount: this.state.amount,
      bank_code: this.state.bank_code,
      redirect: this.state.redirect,
    };
    this.setState({
      btnLoading: true
    });
    const finalData = Utils.adaptParams(data);
    DepositRequest.deposit(finalData).then(res => {
      Utils.thirdPartPayCallback(res);
    }).finally(() => {
      this.setState({
        btnLoading: false,
        amount: '',
        bank_code: ''
      });
    });
  }

  render() {
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={`${styles.title} ${styles.flex5}`}>{this.state.name}</div>
        <div className={styles.tips + " " + styles.flex5}>
          {intl.get("BANKING_HEAD_TIP_1")}<span className={styles.hl}>*</span>{intl.get("BANKING_HEAD_TIP_2")}<br />
          {intl.get("BANKING_HEAD_TIP_3", {time: "3 - 5"})}
        </div>
        <div className={styles.tips + " " + styles.flex4}>
          <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_MODE")}</span> {intl.get("BANKING_HEAD_VALUE_MODE_ONLINE")}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_MINMAX")}</span> {this.state.min_deposit} / {this.state.max_deposit}</div>
        </div>
        <div className={styles.tips + " " + styles.flex3}>
          <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_DAILY")}</span> {intl.get("BANKING_HEAD_VALUE_LIMIT")}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_TOTAL")}</span> {intl.get("BANKING_HEAD_VALUE_LIMIT")}</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>1. {intl.get("QUICKPAY_LABEL_AMOUNT")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field value={this.state.amount} type="number" placeholder={intl.get("QUICKPAY_PLACEHOLDER_AMOUNT")} className={styles["form-elm"]} onChange={val => this.setState({amount: val})} />
          </div>
          <div className={styles.unit}>{this.state.currencyUnit} {this.state.currency}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>2. {intl.get("QUICKPAY_LABEL_METHOD")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            {
              this.state.cardInfo && <div className={styles["card-wrap"]}>
                <div className={styles["card-item"]} style={{backgroundImage: `url(${this.state.cardInfo.image_path})`}}>
                  {intl.get("QUICKPAY_CARD_TIP")}
                </div>
                <div className={styles["card-text"]}>{this.state.cardInfo.name}</div>
              </div>
            }
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>3. {intl.get("QUICKPAY_LABEL_SELECT")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Select value={this.state.bank_code} placeholder={intl.get("QUICKPAY_PLACEHOLDER_SELECT")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({bank_code: val})}}>
              {
                this.state.bankOpts && this.state.bankOpts.map((item, index) => <Option value={item.key} key={"otp" + index}>{item.value}</Option>)
              }
            </Select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label} />
          <div className={styles["form-elm"]}>
            <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                    onClick={this.handleSubmit}>{intl.get("BTN_DEPOSIT")}</Button>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}))(Quickpay);