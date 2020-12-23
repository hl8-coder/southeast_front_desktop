import React, {Component} from "react";
import intl from "react-intl-universal";
import {Icon} from "antd";
import styles from "./content.module.scss";
import Utils from "../../../util/Utils";
import PaymentPlatformRequest from "../../../request/PaymentPlatform";
import DepositRequest from "../../../request/Deposit";
import {Button, Field, Select} from "../../../component/basic";
import {connect} from "react-redux";

const { Option } = Select;

class StretchCard extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name: "",
      btnLoading: false,
      cardOpts: [],
      is_need_type_amount: 1,
      min_deposit: "",
      max_deposit: "",
      payment_type: "",
      payment_platform_id: "",
      payment_platform_code: "",
      amount: 0,
      card_type: "",
      pin_number: "",
      serial_number: ""
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
        min_deposit: data[0].min_deposit,
        max_deposit: data[0].max_deposit,
        payment_type: data[0].payment_type,
        payment_platform_id: data[0].id,
        payment_platform_code: data[0].code,
        cardOpts: data[0].card_types,
        is_need_type_amount: data[0].is_need_type_amount
      })
    });
  };

  handleSubmit() {
    const data = {
      payment_type: this.state.payment_type,
      payment_platform_id: this.state.payment_platform_id,
      amount: this.state.amount,
      card_type: this.state.card_type,
      pin_number: this.state.pin_number,
      serial_number: this.state.serial_number
    };
    this.setState({
      btnLoading: true,
    });
    const finalData = Utils.adaptParams(data);
    DepositRequest.deposit(finalData).then(res => {
      Utils.thirdPartPayCallback(res);
    }).finally(() => {
      this.setState({
        btnLoading: false,
        pin_number: '',
        serial_number: '',
        amount: 0,
        card_type: '',
      });
    })

  }

  render() {
    return <>
      <div className={styles["panel-content"]}>
        <div className={styles["content-header"]}>
          <div className={styles.title + " " + styles.flex5}>{this.state.name}</div>
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
            <div className={styles.label}>1. {intl.get("STRETCH_LABEL_NETWORK")} <span className={styles.hl}>*</span></div>
            <div className={styles["form-elm"]}>
              <Select value={this.state.card_type} placeholder={intl.get("STRETCH_PLACEHOLDER_NETWORK")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({card_type: val})}}>
                {
                  this.state.cardOpts.map((item, index) => <Option value={item.key} key={"otp" + index}>{item.value}</Option>)
                }
              </Select>
            </div>
          </div>
          {
            !!this.state.is_need_type_amount && 'Doicard5s-card' !== this.state.payment_platform_code  && <div className={styles.row}>
              <div className={styles.label}>2. {intl.get("STRETCH_LABEL_VALUE")} <span className={styles.hl}>*</span></div>
              <div className={styles["form-elm"]}>
                <Select value={this.state.amount} placeholder={intl.get("STRETCH_PLACEHOLDER_VALUE")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({amount: val})}}>
                  <Option value="50">50 VND</Option>
                  <Option value="100">100 VND</Option>
                  <Option value="200">200 VND</Option>
                  <Option value="300">300 VND</Option>
                  <Option value="500">500 VND</Option>
                </Select>
              </div>
            </div>
          }
          {
            !!this.state.is_need_type_amount && 'Doicard5s-card' === this.state.payment_platform_code && <div className={styles.row}>
              <div className={styles.label}>2. {intl.get("STRETCH_LABEL_VALUE")} <span className={styles.hl}>*</span></div>
              <div className={styles["form-elm"]}>
                <Select value={this.state.amount} placeholder={intl.get("STRETCH_PLACEHOLDER_VALUE")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({amount: val})}}>
                  <Option value="10">10 VND</Option>
                  <Option value="20">20 VND</Option>
                  <Option value="30">30 VND</Option>
                  <Option value="40">40 VND</Option>
                  <Option value="50">50 VND</Option>
                  <Option value="100">100 VND</Option>
                  <Option value="200">200 VND</Option>
                  <Option value="300">300 VND</Option>
                  <Option value="400">400 VND</Option>
                  <Option value="500">500 VND</Option>
                  <Option value="1000">1000 VND</Option>
                </Select>
              </div>
          </div>
          }
          <div className={styles.row}>
            <div className={styles.label}>{!!this.state.is_need_type_amount ? "3" : "2"}. {intl.get("STRETCH_LABEL_PIN")} <span className={styles.hl}>*</span></div>
            <div className={styles["form-elm"]}>
              <Field value={this.state.pin_number} type="text" placeholder={intl.get("STRETCH_PLACEHOLDER_PIN")} className={styles["form-elm"]} onChange={val => this.setState({pin_number: val})} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{!!this.state.is_need_type_amount ? "4" : "3"}. {intl.get("STRETCH_LABEL_SERIAL")} <span className={styles.hl}>*</span></div>
            <div className={styles["form-elm"]}>
              <Field value={this.state.serial_number} type="text" placeholder={intl.get("STRETCH_PLACEHOLDER_SERIAL")} className={styles["form-elm"]} onChange={val => this.setState({serial_number: val})} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label} />
            <div className={styles["form-elm"]}>
              <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                      onClick={this.handleSubmit}>{intl.get("BTN_DEPOSIT")}</Button>
            </div>
          </div>
          <div className={styles["tips-card"]}>
            <div className={`${styles["card-title"]} ${styles.stretch}`}>
              <span>{intl.get("STRETCH_CARD_TITLE")}</span>
              <div className={styles.fee}>
                {
                  this.state.cardOpts.map((item, index) => <div key={`item${index}`}>{item.value} - {item.fee}%</div>)
                }
              </div>
            </div>
            <div className={styles["card-desc"]}>{intl.get("STRETCH_CARD_TIP1")}</div>
            <div className={styles["card-desc"]}>{intl.get("STRETCH_CARD_TIP2")}</div>
            {
              this.state.name === "FGO" ? <>
                  <div className={styles["card-desc"]}>{intl.getHTML("STRETCH_CARD_TIP_FGO1")}</div>
                  <div className={styles["card-desc"]}>{intl.get("STRETCH_CARD_TIP_FGO2")}</div>
                  <div className={styles["card-desc"]}>{intl.getHTML("STRETCH_CARD_TIP_FGO3")}</div>
                </>
                :
                  this.state.payment_platform_code !== "Doicard5s-card" ? (
                    <div className={styles["card-desc"]}>{intl.get("STRETCH_CARD_TIP3")}</div>
                  ) : (
                  <>
                      <div className={styles["card-desc"]}>{intl.getHTML("STRETCH_CARD_DOICARD_TIP3")}</div>
                      <div className={styles["card-desc"]}>{intl.getHTML("STRETCH_CARD_DOICARD_TIP4")}</div>
                  </>
                  )
            }
          </div>
        </div>
      </div>
    </>
  }
}

export default connect(state => ({
  ...state
}))(StretchCard);
