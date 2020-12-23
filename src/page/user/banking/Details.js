import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./content.module.scss";
import {Icon} from "antd";
import {connect} from "react-redux";
import ConfigurationRequest from "../../../request/Configuration";
import CardRequest from "../../../request/Card";
import MpayRequest from "../../../request/Mpay";
import {Modal, Checkbox, Field, Select, Button} from "../../../component/basic";

import mpayImage from "./image/MPay-MobileCard.png";
import truewallet from "./image/truewallet.jpeg";
import actions from "../../../store/actions";

const { Option } = Select;

class ListCore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankList: [],
      mpayList: []
    };
  }
  componentDidMount() {
    this.getCards();
    this.getMpayList();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getCards();
      this.getMpayList();
    }
  }

  getCards() {
    CardRequest.getCards().then(res => {
      this.setState({
        bankList: res.data
      });
    });
  }

  getMpayList() {
    MpayRequest.getMpays().then(res => {
      this.setState({
        mpayList: res.data
      })
    })
  }

  render() {
    const {bankList, mpayList} = this.state;

    return <>
      <div className={styles["content-title"]}>{intl.get("DETAILS_LIST_TITLE")} {this.props.user.userInfo.currency !== 'THB' && intl.get("DETAILS_LIST_TITLE_1")}</div>
      {
        (!bankList.length && !mpayList.length) ? <>
          <div className={styles["content-text"]}>{intl.get("DETAILS_LIST_TIP_1")} <span className={styles.link} onClick={() => {this.props.onAddBank()}}>{intl.get("DETAILS_LIST_LINK_1")}</span></div>
          <div style={{width: '540px'}} className={styles["content-text"]}>{intl.get("DETAILS_LIST_TIP_2", {type: this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})} <span className={styles.link} onClick={() => {this.props.onAddMPay()}}>{intl.get("DETAILS_LIST_LINK_2", {type: this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})}</span></div>
        </>
        :
        <div className={styles["details-cards"]}>
          {
            bankList.map((item, index) => {
              return <div className={styles["card-wrap"]} key={"card" + index}>
                <div className={styles.card} style={{backgroundImage: `url(${item.bank.image})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>
                  <div className={styles.controls}>
                    <div className={styles.edit} onClick={() => {this.props.onEditBank(item)}}>Edit</div>
                  </div>
                  <div>
                    <div className={styles["card-no"]}>{item.bank.name} - {item.account_no}</div>
                    <div className={styles["account-name"]}>
                      {/*<span>{intl.get("DETAILS_LIST_CARD_ACCOUNT")}</span>*/}
                      <span>{item.account_name}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["card-text"]}>{item.bank.name}</div>
              </div>
            })
          }
          {
            mpayList.map((item, index) => {
              return <div className={styles["card-wrap"]} key={"card" + index}>
                <div className={styles.card} style={{backgroundImage: `url(${this.props.user.userInfo.currency === 'THB'? truewallet : mpayImage})`, backgroundSize: 'cover'}}>
                  <div className={styles.controls}>
                    <div className={styles.edit} onClick={() => {this.props.onEditMpay(item)}}>Edit</div>
                  </div>
                  <div>
                    <div className={styles["card-no"]}>{item.area_code} - {item.number}</div>
                    <div className={styles["account-name"]}>
                      <span>{this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"} {intl.get("DETAILS_TEXT_NUMBER")}</span>
                    </div>
                  </div>
                </div>
                <div className={styles["card-text"]}>{this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"} {item.number}</div>
              </div>
            })
          }
        </div>
      }
    </>;
  }
}

const List = connect(state => ({
  ...state
}))(ListCore);

class AddBankComponent extends Component {
  constructor(props) {
    super(props);
    const {userInfo} = props.user;
    this.state = {
      id: "",
      account_name: userInfo.info.full_name,
      bank_id: undefined,
      province: "",
      city: "",
      branch: "",
      account_no: "",
      bankOpts: [],
      is_preferred: false
    }
  }

  componentDidMount() {
    this.initialEditItem();
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDataFromApi();
    }
  }

  initialEditItem = () => {
    const {mode, editItem} = this.props;
    if (mode === "edit") {
      this.setState({
        btnLoading: false,
        id: editItem.id,
        bank_id: editItem.bank_id,
        branch: editItem.branch,
        province: editItem.province,
        city: editItem.city,
        account_no: editItem.account_no,
        is_preferred: editItem.is_preferred === "YES"
      });
    }
  };

  getDataFromApi = () => {
    ConfigurationRequest.getDroplist("bank").then(res => {
      this.setState({
        bankOpts: res.bank
      });
    });
  };

  handleSubmit = async () => {
    if (this.props.mode === "add") {
      const { bankOpts, id, ...data } = this.state;
      this.setState({
        btnLoading: true
      });
      await CardRequest.addCard(data).finally(() => {
        this.setState({
          btnLoading: false
        });
      });
      Modal.info({
        content: intl.get('MESSAGE_add_bank_successful'),
        onOk: () => {
          this.props.onBack();
        }
      });
    } else {
      const id = this.state.id;
      const data = {
        bank_id: this.state.bank_id,
        branch: this.state.branch,
        province: this.state.province,
        city: this.state.city
      };
      this.setState({
        btnLoading: true
      });
      await CardRequest.updateCard(id, data).finally(() => {
        this.setState({
          btnLoading: false
        });
      });
      Modal.info({
        content: intl.get('MESSAGE_edit_bank_successful'),
        onOk: () => {
          this.props.onBack();
        }
      });
    }
  };

  render() {
    const {mode} = this.props;
    return <>
      <div className={styles["sub-title"]}>{ mode === "add" ? intl.get("DETAILS_BANK_TITLE"): intl.get("DETAILS_BANK_TITLE_EDIT") }</div>
      <div className={styles.row}>
        <div className={styles.label}>1. {intl.get("DETAILS_BANK_LABLE_ACCOUNT")} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          {
            this.state.account_name ? <Field type="text" value={this.state.account_name} disabled /> : null
          }
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>2. {intl.get("DETAILS_BANK_LABEL_BANK")} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          {
            <Select placeholder={intl.get("DETAILS_BANK_PLACEHOLDER_BANK")} suffixIcon={<Icon type="caret-down" />}
                    value={this.state.bank_id}
                    onChange={val => {this.setState({bank_id: val})}}>
              {
                this.state.bankOpts.map((item, index) => <Option value={item.key} key={"otp" + index}>{item.value}</Option>)
              }
            </Select>
          }
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>3. {intl.get("DETAILS_BANK_LABEL_BRANCH")} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          <Field type="text" placeholder={intl.get("DETAILS_BANK_PLACEHOLDER_BRANCH")} value={this.state.branch} onChange={(val) => {this.setState({branch: val})}} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>4. {intl.get("DETAILS_BANK_LABEL_ADDRESS")}</div>
        <div className={styles["form-elm"]}>
          <Field type="text" placeholder={intl.get("DETAILS_BANK_PLACEHOLDER_ADDRESS_1")} className={styles.mr10} value={this.state.city} onChange={(val) => {this.setState({city: val})}} />
          <Field type="text" placeholder={intl.get("DETAILS_BANK_PLACEHOLDER_ADDRESS_2")} value={this.state.province} onChange={(val) => {this.setState({province: val})}} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>5. {intl.get("DETAILS_BANK_LABEL_NUMBER")} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          <Field type="text" placeholder={intl.get("DETAILS_BANK_PLACEHOLDER_NUMBER")}
                 value={this.state.account_no} disabled={mode === "edit"}
                 onChange={(val) => {this.setState({account_no: val})}} />
        </div>
        <Checkbox className={styles["number-check"]} checked={this.state.is_preferred}
                  onChange={e => {this.setState({is_preferred: e.target.checked})}}>{intl.get("DETAILS_BANK_CHECKER_LABEL")}</Checkbox>
      </div>
      <div className={styles.row}>
        <div className={styles.label} />
        <div className={styles["form-elm"]}>
          <Button className={styles["btn-back"]} onClick={() => {this.props.onBack()}}>{intl.get("BTN_BACK")}</Button>
          <Button type="primary" loading={this.state.btnLoading} className={styles["btn-primary"]} onClick={this.handleSubmit}>
            { mode === "add" ? intl.get("BTN_ADD_ACCOUNT") : intl.get("BTN_UPDATE") }
          </Button>
        </div>
      </div>
    </>;
  }
}

const AddBank = connect(state => ({
  ...state
}))(AddBankComponent);

class AddMPay extends Component {
  state = {
    countryOpts: [],
    area_code: this.props.props.user.userInfo.currency ? "+66" : "+84",
    number: ""
  };
  constructor(props) {
    super(props);
    console.log(this.props)
  }
  componentDidMount() {
    this.getCountryCodes();
    this.initialEditItem();
  }

  initialEditItem = () => {
    const {mode, editItem} = this.props;
    if (mode === "edit") {
      this.setState({
        area_code: editItem.area_code,
        number: editItem.number
      });
    }
  };

  getCountryCodes() {
    ConfigurationRequest.getDroplist("user").then(res => {
      this.setState({
        countryOpts: res.country_code
      });
    });
  }

  async handleSubmit() {
    const {mode, editItem} = this.props;
    const data = {
      area_code: this.state.area_code,
      number: this.state.number
    };
    if (mode === "add") {
      await MpayRequest.addMpay(data);
      Modal.info({
        content: intl.get('MESSAGE_add_Mpay_successful',{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})
      });
    } else {
      await MpayRequest.updateMpay(editItem.id, data);
      Modal.info({
        content: intl.get('MESSAGE_update_Mpay_successful',{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})
      });
    }
    this.props.onBack();
  }

  render() {
    const {countryOpts, area_code, number} = this.state;
    const {mode} = this.props;
    return <>
      <div className={styles["sub-title"]}>{intl.get("DETAILS_MPAY_TITLE",{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})}</div>
      <div className={styles.row}>
        <div className={styles.label}>1. {intl.get("DETAILS_MPAY_LABEL" ,{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          <Select value={area_code} style={{ width: 80, marginRight: 10 }}
                  suffixIcon={<Icon type="caret-down" />}
                  onChange={val => {this.setState({area_code: val})}}>
            {
              countryOpts.map((item, index) => <Option value={item.key} key={`opt${index}`}>{item.value}</Option>)
            }
          </Select>
          <Field type="text" value={number} placeholder={intl.get("DETAILS_MPAY_PLACEHOLDER",{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})} onChange={(val) => {this.setState({number: val})}} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label} />
        <div className={styles["form-elm"]}>
          <Button className={styles["btn-back"]} onClick={() => {this.props.onBack()}}>{intl.get("BTN_BACK")}</Button>
          <Button type="primary" className={styles["btn-primary"]} onClick={this.handleSubmit.bind(this)}>{mode === "add" ? intl.get("BTN_ADD_MPAY",{type: this.props.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"}) : intl.get("BTN_UPDATE")}</Button>
        </div>
      </div>
    </>;
  }
}

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 1,
      mode: "add",
      editItem: null
    }
  }

  render() {
    let view;
    if (this.state.view === 1) {
      view = <List onAddBank={() => {
                     this.setState({view: 2, mode: "add", editItem: null})
                   }}
                   onAddMPay={() => {
                     this.setState({view: 3, mode: "add", editItem: null})
                   }}
                   onEditBank={(item) => {
                     this.setState({view: 2, mode: "edit", editItem: item})
                   }}
                   onEditMpay={(item) => {
                     this.setState({view: 3, mode: "edit", editItem: item})
                   }}/>;
    } else if (this.state.view === 2) {
      view = <AddBank mode={this.state.mode} editItem={this.state.editItem} onBack={() => {this.setState({view: 1, mode: "list"})}} />;
    } else {
      view = <AddMPay props={this.props} mode={this.state.mode} editItem={this.state.editItem} onBack={() => {this.setState({view: 1, mode: "list"})}} />;
    }

    let {userInfo} = this.props.user
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={`${styles.title} ${styles.flex1}`}>{intl.get("DETAILS_TITLE")}</div>
        <div className={styles["link-row"]}>
          <div className={styles["link"]} onClick={() => {this.setState({view: 2, mode: "add"})}}>{intl.get("DETAILS_LINK_BANK")}</div>
          <div className={styles["link"]} onClick={() => {this.setState({view: 3, mode: "add"})}}>{intl.get("DETAILS_LINK_MPAY", {type: this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})}</div>


        </div>
      </div>
      <div className={styles["content"]}>
        {
          this.state.mode !== "edit" && <div className={styles["tips-card"]}>
            <div className={styles["card-title"]}>{intl.get("DETAILS_TIP_CARD_TITLE")}</div>
            <div className={styles["card-desc"] + " " + styles.mb15}>{intl.get("DETAILS_TIP_CARD_TIP_1")} <span className={styles.hl}>{intl.get("DETAILS_TIP_CARD_TIP_2")}</span> {intl.get("DETAILS_TIP_CARD_TIP_3")}</div>
            <div className={styles["card-desc"]}>{intl.get("DETAILS_TIP_CARD_TIP_4")} <span className={styles.hl}>{intl.get("DETAILS_TIP_CARD_TIP_5",{type: this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})}</span> {intl.get("DETAILS_TIP_CARD_TIP_6")}</div>
            <div className={styles["card-desc"]}>{intl.get("DETAILS_TIP_CARD_TIP_7",{type: this.props.user.userInfo.currency === 'THB'? "TrueWallet" : "MPay/ZPay"})}</div>
              {
                  this.props.user.userInfo.currency !== 'THB' &&
                      <>
                        <div className={styles["card-desc"]}>{intl.get("DETAILS_TIP_CARD_TIP_8")}</div>
                      </>

              }
          </div>
        }
        {view}
      </div>
    </div>
  }
}
export default connect(state => ({
    ...state
}), actions)(Details);
