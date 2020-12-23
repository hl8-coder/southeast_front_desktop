import React, {Component} from "react";
import moment from "moment";
import intl from "react-intl-universal";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import styles from "../content.module.scss";
import CardList from './CardList';
import {Icon} from "antd";
import ConfigurationRequest from "../../../../request/Configuration";
import CardRequest from "../../../../request/Card";
import DepositRequest from "../../../../request/Deposit";
import Utils from "../../../../util/Utils";
import Upload from "../../../../component/common/upload/Upload";
import { Modal, Field, Select, DatePicker, Button } from "../../../../component/basic";
import actions from "../../../../store/actions";
import UserRequest from "../../../../request/User";
import img1 from '../image/component.png';
import img2 from '../image/component1.png';
import img3 from '../image/component2.png';
import img4 from '../image/component3.png';

const { Option } = Select;

class Banking extends Component {
  constructor(props) {
    super(props);
    const {userInfo} = this.props.user;
    this.initialState = {
      btnLoading: false,
      currency: userInfo.currency,
      currencyUnit: userInfo.currency === "VND" ? ".000" : "",
      channelType: null,
      channelOpts: null,
      cardOpts: null,
      bankOpts: null,
      min_deposit: "",
      max_deposit: "",
      amount: "",
      payment_platform_id: null,
      payment_type: null,
      company_bank_account_id: null,
      deposit_date: moment(),
      online_banking_channel: null,
      user_bank_account_id: null,
      user_bank_account_name: userInfo.info.full_name,
      user_bank_id: null,
      reference_id: null,
      receipts: null,
      maintenance: []
    };
    this.state = {...this.initialState};
  }

  componentDidMount() {
    this.getDroplist();
    this.getBanks();
    this.getUserBanks();
    this.getBankMaintenance();
  }
  getBankMaintenance() {
    ConfigurationRequest.getBankMaintenance().then(res => {
      this.setState({
        maintenance: res.data
      })
    })
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDroplist();
      this.getBanks();
      this.getUserBanks();
    }
  }

  getUserBanks = () => {
    CardRequest.getCards().then(res => {
      if (res.data.length === 0) {
        const modal = Modal.confirm({
          content: <>
            {intl.get("BANKING_MODAL_TIP1")} <span className={styles["modal-link"]} onClick={() => {
            if (window.LC_API) {
                window.LC_API.open_chat_window({source:'button'});
            } else {
                this.props.history.push(`/${window.location.pathname.split("/")[1]}/help/contact`);
                modal.destroy();
            }
          }}>{intl.get("BANKING_MODAL_TIP2")}</span> {intl.get("BANKING_MODAL_TIP3")}
          </>,
          onOk: () => this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/details`)
        });
      }
      this.setState({
        cardOpts: res.data
      })
    })
  };

  getDroplist() {
    ConfigurationRequest.getDroplist("payment_platform").then(res => {
      this.setState({
        channelOpts: res.online_banking_channel
      });
    });
  }

  getBanks() {
    ConfigurationRequest.getDroplist("bank").then(res => {
      this.setState({
        bankOpts: res.bank
      })
    });
  }

  handleSelectChange = value => {
    let channelType;
    if (value === 1 || value === 2 || value === 3) {
      channelType = "start";
    } else {
      channelType = "end";
    }
    this.setState({
      channelType: channelType,
      online_banking_channel: value
    });
  };

  handleSubmit = () => {
    const data = {
      amount: this.state.amount,
      payment_platform_id: this.state.payment_platform_id,
      payment_type: this.state.payment_type,
      company_bank_account_id: this.state.company_bank_account_id,
      deposit_date: this.state.deposit_date,
      online_banking_channel: this.state.online_banking_channel,
      user_bank_account_id: this.state.user_bank_account_id,
      user_bank_account_name: this.state.user_bank_account_name,
      user_bank_id: this.state.user_bank_id,
      reference_id: this.state.reference_id,
      receipts: this.state.receipts,
    };
    this.setState({
      btnLoading: true
    });
    const finalData = Utils.adaptParams(data);
    DepositRequest.deposit(finalData).then(() => {
      UserRequest.getUserInfo().then(res => {
        this.props.saveUserInfo(res);
      });
      Modal.confirm({
        content: intl.get('MESSAGE_deposit_success'),
        okText: intl.get("BTN_VIEW_HISTORY").toUpperCase(),
        onOk: () => {
          this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/history/h_dw`);
        },
        onCancel: () => {
          window.location.reload()
        }
      });
    }).finally(() => {
      this.setState({
        btnLoading: false
      });
    });
  };

  handleCardSelect = item => {
    let payment_platform_id, payment_type, company_bank_account_id, min_deposit, max_deposit;
    if (item) {
      min_deposit = item.min_deposit;
      max_deposit = item.max_deposit;
      payment_platform_id = item.payment_platform_id;
      payment_type = item.payment_type;
      company_bank_account_id = item.id;
    } else {
      min_deposit = null;
      max_deposit = null;
      payment_platform_id = null;
      payment_type = null;
      company_bank_account_id = null;
    }
    this.setState({
      min_deposit,
      max_deposit,
      payment_platform_id,
      payment_type,
      company_bank_account_id
    });
  };

  handleFileUpload = item => {
    this.setState({
      receipts: item.id
    })
  };

  render() {
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={`${styles.title} ${styles.banking} ${styles.flex5}`}>{intl.get("BANKING_TITLE")}</div>
        <div className={styles.tips + " " + styles.flex5}>
          {intl.get("BANKING_HEAD_TIP_1")}<span className={styles.hl}>*</span>{intl.get("BANKING_HEAD_TIP_2")}<br />
          {intl.get("BANKING_HEAD_TIP_3", {time: "5 - 15"})}
        </div>
        <div className={styles.tips + " " + styles.flex4}>
          <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_MODE")}</span> {intl.get("BANKING_HEAD_VALUE_MODE_OFFLINE")}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_MINMAX")}</span> {this.state.min_deposit} / {this.state.max_deposit}</div>
        </div>
        <div className={styles.tips + " " + styles.flex3}>
          <div><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_DAILY")}</span> {intl.get("BANKING_HEAD_VALUE_LIMIT")}</div>
          <div className={styles.mt10}><span className={styles["desc-label"]}>{intl.get("BANKING_HEAD_LABEL_TOTAL")}</span> {intl.get("BANKING_HEAD_VALUE_LIMIT")}</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>1. {intl.get("BANKING_LABEL_AMOUNT")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Field type="number" placeholder={intl.get("BANKING_PLACEHOLDER_AMOUNT")}
                   value={this.state.amount}
                   onChange={val => {this.setState({amount: val})}} />
          </div>
          <div className={styles.unit}>{this.state.currencyUnit} {this.state.currency}</div>
          {
            this.state.maintenance.length !== 0 &&
            <div className={styles.bankMaintenance}>
              <div className={styles.bankMaintenanceTitle}>{intl.get("BANKING_DAILY_MAINTENANCE_SCHEDULE")}</div>
              {
                this.state.maintenance.map(item => {
                  return (
                      <div className={styles.row1}>
                        <img src={item.icon}alt=""/>
                        <div>
                          {
                            item.maintenance_schedules.map(item1 => {
                              return <div>{item1}</div>
                            })
                          }
                        </div>
                      </div>
                  )
                })
              }
            </div>
          }

        </div>
        <CardList maintenance={this.state.maintenance} paymentMenuData={this.props.location.state} onCardSelect={this.handleCardSelect} />
        <div className={styles.row}>
          <div className={styles.label}>3. {intl.get("BANKING_LABEL_DATETIME")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <DatePicker defaultValue={moment()} placeholder={intl.get("DATEPICKER_PH_SELECT_DATE")} showTime={{ format: 'HH:mm' }} style={{flex: 1}} onChange={(date, dateString) => {this.setState({deposit_date: dateString})}} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>4. {intl.get("BANKING_LABEL_CHANNEL")} <span className={styles.hl}>*</span></div>
          <div className={styles["form-elm"]}>
            <Select placeholder={intl.get("BANKING_PLACEHOLDER_CHANNEL")} suffixIcon={<Icon type="caret-down" />} onChange={this.handleSelectChange}>
              {
                this.state.channelOpts && this.state.channelOpts.map((item, index) => <Option value={item.key} key={"otp" + index}>{item.value}</Option>)
              }
            </Select>
          </div>
          <div className={styles["upload-wrap"]}>
            <div className={styles["upload-tip-wrap"]}>
              <div className={styles["upload-tip-label"]}>{intl.get("BANKING_UPLOAD_TIP_1")}</div>
              <div className={styles["upload-tip-val"]}>{intl.get("BANKING_UPLOAD_TIP_2")} 1MB</div>
            </div>
            <Upload onFileUpload={this.handleFileUpload}/>
          </div>
        </div>
        {
          this.state.channelType && (
            <>
            {
              this.state.channelType === "start" ?
                <div className={styles.row + " " + styles["with-link"] + " " + styles.multi}>
                  <div className={styles.label}>5. {intl.get("BANKING_LABEL_ACCOUNT")} <span className={styles.hl}>*</span></div>
                  <div className={styles["form-elm"]}>
                    <Select placeholder={intl.get("BANKING_PLACEHOLDER_ACCOUNT")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({user_bank_account_id: val})}}>
                      {
                        this.state.cardOpts && this.state.cardOpts.map((item, index) => <Option value={item.id} key={"otp" + index}>{item.bank.code + "-" + item.account_no}</Option>)
                      }
                    </Select>
                    <Link to={`/${window.location.pathname.split("/")[1]}/user/details`}><div className={styles.link}>{intl.get("LINK_MANAGE_ACCOUNT")}</div></Link>
                  </div>
                </div>
                :
                <>
                  <div className={styles.row + " " + styles["with-link"]}>
                    <div className={styles.label}>5. {intl.get("BANKING_LABEL_ACCOUNT_NAME")} <span className={styles.hl}>*</span></div>
                    <div className={styles["form-elm"]}>
                      {
                        this.state.user_bank_account_name ? <Field type="text" placeholder="Enter the deposit amount" value={this.state.user_bank_account_name} disabled /> : null
                      }
                      <Link to={`/${window.location.pathname.split("/")[1]}/banking/details`} className={styles.link}>{intl.get("LINK_MANAGE_ACCOUNT")}</Link>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>6. {intl.get("BANKING_LABEL_SELECT_BANK")} <span className={styles.hl}>*</span></div>
                    <div className={styles["form-elm"]}>
                      <Select placeholder={intl.get("BANKING_PLACEHOLDER_SELECT_BANK")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({user_bank_id: val})}}>
                        {
                          this.state.bankOpts && this.state.bankOpts.map((item, index) => <Option value={item.key} key={"otp" + index}>{item.value}</Option>)
                        }
                      </Select>
                    </div>
                  </div>
                </>
              }
              <div className={styles.row}>
                <div className={styles.label}>{this.state.channelType === "start" ? "6" : "7"}. {intl.get("BANKING_LABEL_REFER")}</div>
                <div className={styles["form-elm"]}>
                  <Field type="text" onChange={val => this.setState({reference_id: val})} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.label} />
                <div className={styles["form-elm"]}>
                  <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                          onClick={this.handleSubmit}>{intl.get("BTN_DEPOSIT")}</Button>
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}), actions)(Banking);
