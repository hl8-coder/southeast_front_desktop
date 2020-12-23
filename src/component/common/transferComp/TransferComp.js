import React, {Component} from "react";
import intl from "react-intl-universal";
import {Modal, Select, Field, Checkbox, Button} from "../../../component/basic";
import styles from "./TransferComp.module.scss";
import {Icon, Tooltip} from "antd";
import ConfigurationRequest from "../../../request/Configuration";
import BonusRequest from "../../../request/Bonus";
import GameRequest from "../../../request/Game";
import {connect} from "react-redux";
import ButtonOnHover from "./image/Floating-ButtonOnHover-HL8.png"
const {Option} = Select;

class TransferComp extends Component {
  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
    this.state = {
      transModal: false,
      balance: "",
      transferOpts: [],
      fromOpts: [],
      toOpts: [],
      from_platform_code: undefined,
      to_platform_code: undefined,
      currency: "",
      bonusList: [],
      amount: "",
      bonus_code: []
    }
  }

  componentDidMount() {
    this.initialParams();
  }

  initialParams = () => {

    this.getCurrency();
    this.getDroplist();
  };

  getWallet = (init) => {
    let code;
    if (init) {
      code = this.props.code
      this.onSelectChange("to_platform_code", code);
    } else {
      code = this.state.to_platform_code;
    }
    const {token} = this.props.user;
    if (token) {
      this.getBalance(code);
    }
  };

  getBalance = (code) => {
    GameRequest.getWalletsBalance(code).then(res => {
      this.setState({
        balance: res.balance
      })
    });
  };

  getCurrency () {
    ConfigurationRequest.getCurrency().then(res => {
      this.setState({
        currency: `${res.min_transfer} ${res.name}`
      });
    });
  }

  getDroplist = () => {
    ConfigurationRequest.getDroplist("transfer").then(res => {
      const opts = res.platform_code;
      this.setState({
        transferOpts: opts,
        fromOpts: opts,
        toOpts: opts
      }, () => {
        this.onSelectChange("from_platform_code", !!opts.length ? opts[0].key : "");
        this.getWallet(true);
      });
    });
  };

  onRadioChange = val => {
    const arr = val.filter(item => item !== this.state.bonus_code[0]);
    this.setState({
      bonus_code: arr
    });
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
        this.getWallet(false);
        this.getBonuses();
      });
    }
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
    GameRequest.transfer({
      from_platform_code: this.state.from_platform_code,
      to_platform_code: this.state.to_platform_code,
      amount: this.state.amount,
      bonus_code: this.state.bonus_code[0]
    }).then(res => {
      Modal.info({
        content: intl.get('MESSAGE_transfer_access')
      });
    });
  };

  handleClick = () => {
    this.setState({transModal: true});
  };

  openLiveChat = () => {
    if (window.LC_API) {
      window.LC_API.open_chat_window({source:'button'});
    }
  };

  getQueryParam = (param) => {
    const {location} = this.props;
    const query = location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] === param) {
        return pair[1];
      }
    }
    return false;
  };

  render() {
    return <div className={styles["game-play"]}>
      <div className={styles["btn-group"]}>
        <img onClick={() => {this.setState({transModal: true})}} className={styles["btn-group-img"]} src={ButtonOnHover} alt=""/>
      </div>
      <Modal visible={this.state.transModal}
             width={768}
             onCancel={() => {this.setState({transModal: false})}}
             title={intl.get("TRANSFER_TITLE")}>
        <div className={styles.content}>
          <div className={styles["modal-tip"]}>
            {intl.get("TRANSFER_HEAD_TIP", { currency: this.state.currency })}
            <div className={styles["wallet"]}>
              <span className={styles["wallet-left"]}>{this.state.to_platform_code}</span>
              <span className={styles["wallet-right"]}>{this.state.balance}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>1. {intl.get("TRANSFER_LABEL_FROM")}</div>
            <div className={styles["form-elm"]}>
              <Select value={this.state.from_platform_code} placeholder={intl.get("TRANSFER_PLACEHOLDER_TRANSFER")}
                      suffixIcon={<Icon type="caret-down" />}
                      onChange={val => {this.onSelectChange("from_platform_code", val)}}>
                {
                  this.state.fromOpts.length && this.state.fromOpts.map((item, index) => {
                    return <Option value={item.key} key={"opt" + index}>{item.value}</Option>
                  })
                }
              </Select>
            </div>
            <Tooltip title={intl.get("TRANSFER_FORM_TIP")} placement="right" >
              <div className={styles["form-tip"]} />
            </Tooltip>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>2. {intl.get("TRANSFER_LABEL_TO")}</div>
            <div className={styles["form-elm"]}>
              <Select value={this.state.to_platform_code} placeholder={intl.get("TRANSFER_PLACEHOLDER_TRANSFER")}
                      suffixIcon={<Icon type="caret-down" />}
                      onChange={val => {this.onSelectChange("to_platform_code", val)}}>
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
              <Button type="primary" className={styles["btn-primary"]} onClick={this.submitTrans}>{intl.get("BTN_TRANSFER")}</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  }
}

export default connect(state => ({
  ...state
}))(TransferComp)
