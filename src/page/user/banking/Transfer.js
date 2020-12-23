import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./content.module.scss";
import {connect} from "react-redux";
import { Icon } from "antd";
import {Modal, Field, Select, Checkbox, Button} from "../../../component/basic";
import ConfigurationRequest from "../../../request/Configuration";
import BonusRequest from "../../../request/Bonus";
import GameRequest from "../../../request/Game";
import UserRequest from "../../../request/User";
import actions from "../../../store/actions";

const { Option } = Select;

class Transfer extends Component {
  state = {
    btnLoading: false,
    transferOpts: [],
    fromOpts: [],
    toOpts: [],
    from_platform_code: undefined,
    to_platform_code: undefined,
    bonusList: [],
    currency: "",
    amount: "",
    bonus_code: []
  };

  componentDidMount() {
    this.getDroplist();
    this.getCurrency();
    const propState = this.props.location.state;
    if (propState) {
      const toCode = this.props.location.state.to_platform_code;
      this.onSelectChange("to_platform_code", toCode);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevData = prevProps.location.state,
      currentData = this.props.location.state;
    if ((!prevData && !!currentData) || (currentData && prevData.to_platform_code !== currentData.to_platform_code)) {
      this.onSelectChange("to_platform_code", currentData.to_platform_code);
    }
    // 语言切换
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDroplist();
      this.getCurrency();
    }
  }

  getDroplist () {
    ConfigurationRequest.getDroplist("transfer").then(res => {
      const opts = res.platform_code;
      this.setState({
        transferOpts: opts,
        fromOpts: opts,
        toOpts: opts
      }, () => {
        this.onSelectChange("from_platform_code", !!opts.length ? opts[0].key : "");
      });
    });
  }

  getCurrency () {
    ConfigurationRequest.getCurrency().then(res => {
      this.setState({
        currency: `${res.min_transfer} ${res.name}`
      });
    });
  }

  onRadioChange = val => {
    const arr = val.filter(item => item !== this.state.bonus_code[0]);
    this.setState({
      bonus_code: arr
    });
  };

  getUserBalance = () => {
      this.setState({
          freshLoad: true
      });
      UserRequest.getUserBalance().then(res => {
          const {userInfo} = this.props.user;
          userInfo.account.available_balance = res.available_balance;
          userInfo.account.total_point_balance = res.total_point_balance;
          this.props.saveUserInfo(userInfo);
      });
      this.getWallets();
  };
  
  onSelectChange = (key, val) => {
    if (key === "from_platform_code") {
      // const opts = this.state.transferOpts.filter(item => item.key !== val);
      this.setState({
        [key]: val,
        toOpts: this.state.transferOpts
      }, () => {
        this.getBonuses();
      });
    } else {
      // const opts = this.state.transferOpts.filter(item => item.key !== val);
      this.setState({
        [key]: val,
        fromOpts: this.state.transferOpts
      }, () => {
        this.getBonuses();
      });
    }
  };

  onWalletExchange = () => {
    const originFrom = this.state.from_platform_code;
    const originTo = this.state.to_platform_code;
    this.setState({
      from_platform_code: originTo,
      to_platform_code: originFrom
    }, () => {
      this.getBonuses();
    })
  };

  getBonuses = () => {
    const params = {
      from_platform_code: this.state.from_platform_code,
      to_platform_code: this.state.to_platform_code
    };
    BonusRequest.getBonuses(params).then(res => {
      this.setState({
        bonusList: res.data,
        bonus_code: []
      });
    });
  };

  submitTrans = () => {
    this.setState({
      btnLoading: true
    });
    const bonus_code = this.state.bonus_code instanceof Array ? this.state.bonus_code[0] : this.state.bonus_code;
    GameRequest.transfer({
      from_platform_code: this.state.from_platform_code,
      to_platform_code: this.state.to_platform_code,
      amount: this.state.amount,
      bonus_code
    }).then(() => {
      Modal.confirm({
        content: intl.get('MESSAGE_transfer_access'),
        okText: intl.get("BTN_VIEW_HISTORY").toUpperCase(),
        onOk: () => {
          this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/history/h_transfer`);
        },
        onCancel: () => {
          this.setState({
            from_platform_code: undefined,
            to_platform_code: undefined,
            amount: '',
            bonus_code: [],
          })
        }
      });
      this.getUserInfo();
    }).finally(() => {
      this.setState({
        btnLoading: false
      });
    });
  };

  getUserInfo = () => {
    UserRequest.getUserInfo().then(res => {
      this.props.saveUserInfo(res);
    });
  };

  render() {
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={`${styles.title} ${styles.flex1}`}>{intl.get("TRANSFER_TITLE")}</div>
        <div className={`${styles.tips} ${styles.flex1}`}>
          {intl.get("TRANSFER_HEAD_TIP", { currency: this.state.currency })}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles["form-tip"]}>{intl.get("TRANSFER_FORM_TIP")}</div>
        <div className={styles.row}>
          <div className={styles.label}>1. {intl.get("TRANSFER_LABEL_FROM")}</div>
          <div className={styles["form-elm"]}>
            <Select value={this.state.from_platform_code} placeholder={intl.get("TRANSFER_PLACEHOLDER_TRANSFER")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.onSelectChange("from_platform_code", val)}}>
              {
                this.state.fromOpts.length && this.state.fromOpts.map((item, index) => {
                  return <Option value={item.key} key={"opt" + index}>{item.value}</Option>
                })
              }
            </Select>
            <div className={styles["switch-btn"]} onClick={this.onWalletExchange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>2. {intl.get("TRANSFER_LABEL_TO")}</div>
          <div className={styles["form-elm"]}>
            <Select value={this.state.to_platform_code} placeholder={intl.get("TRANSFER_PLACEHOLDER_TRANSFER")} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.onSelectChange("to_platform_code", val)}}>
              {
                this.state.toOpts.length && this.state.toOpts.map((item, index) => {
                  return <Option value={item.key} key={"opt" + index}>{item.value}</Option>
                })
              }
            </Select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>3. {intl.get("TRANSFER_LABEL_AMOUNT")}</div>
          <div className={styles["form-elm"]}>
            <Field type="number" value={this.state.amount} placeholder={intl.get("TRANSFER_PLACEHOLDER_AMOUNT")} onChange={val => {this.setState({amount: val})}} />
          </div>
        </div>
        {
          !!this.state.bonusList.length ?
            <div className={`${styles.row} ${styles.special}`}>
              <div className={styles.label}>4. {intl.get("TRANSFER_LABLE_CODE")}</div>
              <div className={styles["bonus-wrap"]}>
                <Field type="text" placeholder={intl.get("TRANSFER_PLACEHOLDER_CODE")} value={this.state.bonus_code} />
                {
                  <div className={styles.list}>
                    <Checkbox.Group onChange={this.onRadioChange} value={this.state.bonus_code}>
                      {
                        this.state.bonusList.map((item, index) => {
                          return <div className={styles["list-item"]} key={"opt" + index}>
                            <Checkbox value={item.code} className={styles["list-radio"]} />
                            {item.title} <span className={styles.num}>({item.code})</span>
                          </div>
                        })
                      }
                    </Checkbox.Group>
                  </div>
                }
              </div>
            </div>
            :
            <div className={styles.row}>
              <div className={styles.label}>4. {intl.get("TRANSFER_LABLE_CODE")}</div>
              <div className={styles["form-elm"]}>
                <Field type="text" value={this.state.bonus_code}
                       placeholder={intl.get("TRANSFER_PLACEHOLDER_CODE")}
                       onChange={val => {this.setState({bonus_code: val})}} />
              </div>
            </div>
        }
        <div className={styles.row}>
          <div className={styles.label} />
          <div className={styles["form-elm"]}>
            <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                    onClick={this.submitTrans}>{intl.get("BTN_TRANSFER")}</Button>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}), actions)(Transfer);
