import React, {Component} from "react";
import {Link, NavLink, Route, Switch, Redirect} from 'react-router-dom';
import intl from "react-intl-universal";
import PaymentPlatformRequest from "../../request/PaymentPlatform";
import styles from "./user.module.scss";

import actions from "../../store/actions";

import Profile from './account/Profile';
import Inbox from './account/Inbox';
import Password from './account/Password';

import DepositWithdrawal from './account/DepositWithdrawal';
import HTransfer from "./account/Transfer";
import Adjustment from "./account/Adjustment";
import Claim from "./account/Claim";
import Rebate from "./account/Rebate";
import Cashback from "./account/Cashback";

import Banking from "./banking/banking/Banking";
import Quickpay from "./banking/Quickpay";
import Mpay from "./banking/Mpay";
import StretchCard from "./banking/StretchCard";
import Transfer from "./banking/Transfer";
import Withdrawal from "./banking/Withdrawal";
import Details from "./banking/Details";
import Bet from "./banking/Bet";
import GameRequest from "../../request/Game";
import {connect} from "react-redux";
import {Icon, Popover} from "antd";
import UserRequest from "../../request/User";
import {Modal, Select, VerifyCode, Button} from "../../component/basic";
import ConfigurationRequest from "../../request/Configuration";

const {Option} = Select;

class PanelRightCore extends Component {
  state = {
    depositMenu: [],
    subMenu: []
  };
  
  componentDidMount() {
    this.findDepositMenu();
    this.userInfo();
    console.log(this.props)
    console.log(window.location.pathname)
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.findDepositMenu();
    }
  }
  
  userInfo() {
    UserRequest.getUserInfo().then(res => {
      this.props.saveUserInfo(res);
    })
  }
  
  filterSubMenu = (menus, url) => {
    let subMenu = [];
    for (let item of menus) {
      if (item.sub) {
        for (let item2 of item.sub) {
          if (url === item2.url) {
            subMenu = item.sub;
          }
        }
      }
    }
    return subMenu;
  };
  
  findDepositMenu = () => {
    PaymentPlatformRequest.getPaymentMenu().then(res => {
      this.setState({
        depositMenu: res.data
      });
    });
  };
  
  render() {
    const menus = [{
      name: intl.get("USER_MENU_ACCOUNT").toUpperCase(),
      url: `${this.props.match.url}/account`,
      sub: [{
        name: intl.get("USER_MENU_PROFILE"),
        url: `${this.props.match.url}/account`
      }, {
        name: intl.get("USER_MENU_INBOX"),
        url: `${this.props.match.url}/account/inbox`
      }, {
        name: intl.get("USER_MENU_PASSWORD"),
        url: `${this.props.match.url}/account/pwd`
      }]
    }, {
      name: intl.get("USER_MENU_HISTORY").toUpperCase(),
      url: `${this.props.match.url}/history`,
      sub: [{
        name: intl.get("USER_MENU_HDW"),
        url: `${this.props.match.url}/history`
      }, {
        name: intl.get("USER_MENU_HTRANSFER"),
        url: `${this.props.match.url}/history/h_transfer`
      }, {
        name: intl.get("USER_MENU_HADJUST"),
        url: `${this.props.match.url}/history/h_adjustment`
      }, {
        name: intl.get("USER_MENU_HCLAIM"),
        url: `${this.props.match.url}/history/h_claim`
      }, {
        name: intl.get("USER_MENU_REBATE"),
        url: `${this.props.match.url}/history/h_rebate`
      }
        // , {
        //   name: intl.get("USER_MENU_CASHBACK"),
        //   url: `${this.props.match.url}/history/h_cashback`
        // }
      ]
    }, {
      name: intl.get("USER_MENU_DEPOSIT").toUpperCase(),
      url: `${this.props.match.url}/deposit`
    }, {
      name: intl.get("USER_MENU_TRANSFER").toUpperCase(),
      url: `${this.props.match.url}/transfer`
    }, {
      name: intl.get("USER_MENU_WITHDRAWAL").toUpperCase(),
      url: `${this.props.match.url}/withdrawal`
    }, {
      name: intl.get("USER_MENU_DETAILS").toUpperCase(),
      url: `${this.props.match.url}/details`
    }
      // , {
      //   name: intl.get("USER_MENU_BET"),
      //   url: `${this.props.match.url}/bet`
      // }
    ];
    const {match, location} = this.props;
    const {depositMenu} = this.state;
    const subMenu = this.filterSubMenu(menus, location.pathname);
    return <>
      <div className={styles.menu}>
        {
          menus.map((item, index) => {
            let noChild = true;
            if (item.sub || location.pathname.indexOf("/user/deposit") > -1) {
              noChild = false;
            }
            return <NavLink to={item.url} className={`${styles["menu-item"]} ${noChild ? styles["no-child"] : ""}`}
                            activeClassName={styles.on}
                            key={`menu${index}`}>
              {item.name}
            </NavLink>
          })
        }
      </div>
      {
        <div className={styles["sub-menu"]}>
          {
            subMenu.map((item, index) => {
              return <NavLink to={item.url} exact className={styles["sub-menu-item"]} activeClassName={styles.on}
                              key={`menu${index}`}>
                {item.name}
              </NavLink>
            })
          }
        </div>
      }
      {
        location.pathname.indexOf("/user/deposit") > -1 && <div className={styles["sub-menu"]}>
          {
            depositMenu.map((item, index) => {
              if (item.payment_type === 1) {
                const pathname = match.url === location.pathname ? `${match.url}` : `${match.url}/deposit`;
                return <NavLink to={pathname} exact className={styles["sub-menu-item"]} activeClassName={styles.on}
                                key={"nav" + index}>{item.name}</NavLink>
              } else {
                const pathname = `${match.url}/deposit/${item.payment_type}/${item.id}`;
                return <NavLink to={pathname} className={styles["sub-menu-item"]} activeClassName={styles.on}
                                key={"nav" + index}>{item.name}</NavLink>
              }
            })
          }
        </div>
      }
      <Switch>
        <Route path={`${match.url}`} exact component={Profile}/>
        <Route path={`${match.url}/account`} exact component={Profile}/>
        <Route path={`${match.url}/account/profile`} component={Profile}/>
        <Route path={`${match.url}/account/inbox`} component={Inbox}/>
        <Route path={`${match.url}/account/pwd`} component={Password}/>
        <Route path={`${match.url}/history`} exact component={DepositWithdrawal}/>
        <Route path={`${match.url}/history/h_dw`} component={DepositWithdrawal}/>
        <Route path={`${match.url}/history/h_transfer`} component={HTransfer}/>
        <Route path={`${match.url}/history/h_adjustment`} component={Adjustment}/>
        <Route path={`${match.url}/history/h_claim`} component={Claim}/>
        <Route path={`${match.url}/history/h_rebate`} component={Rebate}/>
        <Route path={`${match.url}/history/h_cashback`} component={Cashback}/>
        <Route path={`${match.url}/deposit`} exact component={Banking}/>
        <Route path={`${match.url}/deposit/:type/:id`} render={routeProps => {
          const {match} = routeProps;
          if (match.params.type === "2") {
            return <Quickpay {...routeProps} key={routeProps.location.pathname}/>
          } else if (match.params.type === "3") {
            return <Mpay {...routeProps} key={routeProps.location.pathname}/>
          } else if (match.params.type === "4") {
            return <StretchCard {...routeProps} key={routeProps.location.pathname}/>
          } else {
            return null;
          }
        }}/>
        <Route path={`${match.url}/withdrawal`} component={Withdrawal}/>
        <Route path={`${match.url}/transfer`} component={Transfer}/>
        <Route path={`${match.url}/details`} component={Details}/>
        <Route path={`${match.url}/bet`} component={Bet}/>
        <Redirect to="/:language"/>
      </Switch>
    </>;
  }
}

const PanelRight = connect(state => ({
  ...state
}))(PanelRightCore);

class User extends Component {
  emailRef = React.createRef();
  phoneRef = React.createRef();
  
  state = {
    freshLoad: false,
    verifyPhoneModal: false,
    verifyPhoneCode: "",
    phoneKey: "",
    verifyEmailModal: false,
    verifyEmailCode: "",
    emailKey: "",
    wallets: [],
    prizeModal: false,
    prizeBtnLoading: false,
    affirmPrizeModal: false,
    wallet: '',
    walletSelect: []
  };
  
  componentDidMount() {
    if (this.props.user.userInfo.info.is_can_claim_verify_prize) {
      this.showPrizeModal();
    }
    this.getWallets();
    this.getWalletSelect();
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getWallets();
    }
  }
  
  getWallets = () => {
    GameRequest.getWallets().then(res => {
      this.setState({
        wallets: res.data
      }, () => {
        res.data.forEach(item => {
          this.getWalletsBalance(item);
        });
      });
    });
  };
  
  getWalletsBalance = (item) => {
    GameRequest.getWalletsBalance(item.platform_code).then(res => {
      const wallets = this.state.wallets.map(item2 => {
        if (item2.platform_code === res.platform_code) {
          item2.balance = res.balance;
        }
        return item2;
      });
      this.setState({
        wallets: wallets
      });
    });
  };
  
  showPrizeModal = () => {
    this.setState({prizeModal: true});
  };
  
  getWalletSelect() {
    ConfigurationRequest.getDroplist("user").then(res => {
      this.setState({
        walletSelect: res.platform_code
      });
    });
  }
  
  handleClaimPrize = () => {
    if (!this.state.wallet) {
      Modal.info({
        content: intl.get("MESSAGE_WALLET_NOT")
      });
      return
    }
    this.setState({
      prizeBtnLoading: true
    });
    UserRequest.claimVerifyPrize({platform_code: this.state.wallet}).then(res => {
      const {userInfo} = this.props.user;
      userInfo.info.is_can_claim_verify_prize = res.info.is_can_claim_verify_prize;
      this.props.saveUserInfo(userInfo);
      this.setState({prizeModal: false, affirmPrizeModal: true});
    }).finally(() => {
      this.setState({
        prizeBtnLoading: false
      })
    })
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
  
  handleAnimationEnd = () => {
    this.setState({
      freshLoad: false
    });
  };
  
  doTransfer = (item) => {
    const path = {
      pathname: `/${window.location.pathname.split("/")[1]}/user/transfer`,
      state: {
        to_platform_code: item.platform_code
      }
    };
    this.props.history.push(path);
  };
  
  sendPhoneCode = () => {
    if (!this.props.user.userInfo.info.is_phone_verified) {
      UserRequest.sendPhoneCode().then(res => {
        this.setState({
          verifyPhoneModal: true,
          phoneKey: res.key
        });
      });
    }
  };
  
  sendEmailCode = () => {
    if (!this.props.user.userInfo.info.is_email_verified) {
      UserRequest.sendEmailCode().then(res => {
        this.setState({
          verifyEmailModal: true,
          emailKey: res.key
        });
      });
    }
  };
  
  handleVerify = (type) => {
    const state = {
      type: type,
      verification_key: type === "phone" ? this.state.phoneKey : this.state.emailKey,
      code: type === "phone" ? this.state.verifyPhoneCode : this.state.verifyEmailCode
    };
    UserRequest.verifyCode(state).then(() => {
      if (type === "phone") {
        this.setState({
          verifyPhoneModal: false
        });
        Modal.info({
          content: intl.get("MESSAGE_PHONE_VERIFY_SUCCESS")
        });
      } else {
        this.setState({
          verifyEmailModal: false
        });
        Modal.info({
          content: intl.get("MESSAGE_PHONE_EMAIL_SUCCESS")
        });
      }
      UserRequest.getUserInfo().then(res => {
        this.props.saveUserInfo(res);
      });
    }).catch(() => {
      if (type === "phone") {
        this.setState({
          verifyPhoneCode: ""
        });
        this.phoneRef.current.onFocus();
      } else {
        this.setState({
          verifyEmailCode: ""
        });
        this.emailRef.current.onFocus();
      }
    });
  };
  
  onSelectChange(val) {
    this.setState({
      wallet: val
    });
  }
  
  render() {
    const {userInfo} = this.props.user;
    const securityTips = <div className={styles["security-tips"]}>
      <div>{intl.get("USER_ACCOUNT_SECURITY_TIP1")}</div>
      <div>{intl.get("USER_ACCOUNT_SECURITY_TIP2")}</div>
      <div>{intl.get("USER_ACCOUNT_SECURITY_TIP3")}</div>
    </div>;
    return <div className={styles.user}>
      <div className={styles["user-panel"] + " container"}>
        <div className={styles["panel-left"]}>
          <div className={styles["profile-info"]}>
            <div className={styles["profile-security"]}>
              <div className={styles["security-lvl"]}>
                <div className={`${styles["security-icon"]} ${styles["percent" + userInfo.info.verified_percent]}`}/>
                <div className={styles["security-txt"]}>{userInfo.info.verified_percent + ""}%</div>
              </div>
              <div>
                <div className={styles["profile-txt"]}>
                  <span>{intl.get("USER_ACCOUNT_SECURITY")}</span>
                  <Popover placement="bottomLeft" content={securityTips} trigger="click" arrowPointAtCenter>
                    <span className={styles["icon-info"]}/>
                  </Popover>
                </div>
                <div className={styles["security-links"]}>
                  <Link to={`/${window.location.pathname.split("/")[1]}/user/account`}
                        className={`${styles["security-user"]} ${userInfo.info.is_profile_verified ? styles.on : ""}`}/>
                  <div className={`${styles["security-mail"]} ${userInfo.info.is_email_verified ? styles.on : ""}`}
                       onClick={this.sendEmailCode}/>
                  <div className={`${styles["security-phone"]} ${userInfo.info.is_phone_verified ? styles.on : ""}`}
                       onClick={this.sendPhoneCode}/>
                  <div
                    className={`${styles["security-dollar"]} ${userInfo.info.is_bank_account_verified ? styles.on : ""}`}/>
                </div>
              </div>
            </div>
            <div className={styles["security-info"]}>
              <div className={styles["security-title"]}>
                <span>{intl.get("USER_MAIN_WALLET")}:</span>
                <span className={styles["icon-info"]}/>
              </div>
              <div className={styles["security-val"]}>
                <span>{userInfo.account.available_balance}</span>
                <span className={`${styles["icon-sync"]} ${this.state.freshLoad ? styles.rotate : ""}`}
                      onAnimationEnd={this.handleAnimationEnd}
                      onClick={() => {
                        this.getUserBalance()
                      }}/>
              </div>
              <div className={`${styles["security-title"]} ${styles.disabled}`}>
                <span>{intl.get("USER_MY_REWARDS")}:</span>
              </div>
              <div className={`${styles["security-val"]} ${styles.disabled}`}>
                <span>{userInfo.account.total_point_balance}</span>
              </div>
            </div>
          </div>
          <div className={styles.wallets}>
            <div className={styles["wallets-title"]}>{intl.get("USER_ALL_WALLETS")}:</div>
            {
              this.state.wallets.map((item, index) => {
                return <div className={styles["wallet-item"]} key={`item${index}`}
                            onClick={() => this.doTransfer(item)}>
                  <div className={styles["wallet-inner"]}>
                    <div className={styles["inner-left"]}>{item.platform_name}</div>
                    <div className={styles["inner-right"]}>{item.balance}</div>
                  </div>
                  <div className={styles["wallet-desc"]}>{item.types}</div>
                </div>
              })
            }
          </div>
        </div>
        <div className={styles["panel-right"]}>
          <PanelRight {...this.props} />
        </div>
      </div>
      <Modal visible={this.state.verifyPhoneModal} title={intl.get("USER_PHONE_MODAL_TITLE")}
             onCancel={() => {
               this.setState({verifyPhoneModal: false})
             }}>
        <div className={styles["phone-tip"]}>{intl.get("USER_PHONE_MODAL_TIP_1")}</div>
        {
          userInfo && <div className={styles["phone-num"]}>{userInfo.info.country_code}-{userInfo.info.phone}</div>
        }
        <div className={styles["phone-tip"]}>{intl.get("USER_PHONE_MODAL_TIP_2")}</div>
        <div className={styles["verify-wrap"]}>
          <VerifyCode onChange={val => {
            this.setState({verifyPhoneCode: val})
          }} value={this.state.verifyPhoneCode} ref={this.phoneRef}/>
        </div>
        <button className={styles["btn-primary"]} onClick={() => {
          this.handleVerify("phone")
        }}>{intl.get("BTN_VERIFY")}</button>
      </Modal>
      <Modal visible={this.state.verifyEmailModal} title={intl.get("USER_EMAIL_MODAL_TITLE")}
             onCancel={() => {
               this.setState({verifyEmailModal: false})
             }}>
        <div className={styles["phone-tip"]}>{intl.get("USER_EMAIL_MODAL_TIP_1")}</div>
        {
          userInfo && <div className={styles["phone-num"]}>{userInfo.info.email}</div>
        }
        <div className={styles["phone-tip"]}>{intl.get("USER_EMAIL_MODAL_TIP_2")}</div>
        <div className={styles["verify-wrap"]}>
          <VerifyCode onChange={val => {
            this.setState({verifyEmailCode: val})
          }} value={this.state.verifyEmailCode} ref={this.emailRef}/>
        </div>
        <button className={styles["btn-primary"]} onClick={() => {
          this.handleVerify("email")
        }}>{intl.get("BTN_VERIFY")}</button>
      </Modal>
      <Modal visible={this.state.prizeModal} title={intl.get("USER_MODAL_SECURITY_TITLE")}
             onCancel={() => {
               this.setState({prizeModal: false})
             }}>
        <div className={styles["security-modal-content"]}>
          <p>{intl.getHTML("USER_SECURITY_MODAL_TIP1")}</p>
          <p>{intl.getHTML("USER_SECURITY_MODAL_TIP2")}</p>
        </div>
        <Select value={this.state.wallet} placeholder={intl.get("TRANSFER_PLACEHOLDER_TRANSFER")}
                suffixIcon={<Icon type="caret-down"/>} onChange={val => {
          this.onSelectChange(val)
        }}>
          {
            this.state.walletSelect.length && this.state.walletSelect.map((item, index) => {
              return <Option value={item.key} key={"opt" + index}>{item.value}</Option>
            })
          }
        </Select>
        <Button loading={this.state.prizeBtnLoading} className={styles["btn-primary"]}
                onClick={this.handleClaimPrize}>{intl.get("BTN_CLAIM_1")}</Button>
      </Modal>
      <Modal visible={this.state.affirmPrizeModal} title={intl.get("MESSAGE_SUCCESS")}
             onCancel={() => {
               this.setState({affirmPrizeModal: false})
             }}>
        <div className={styles["security-modal-content"]}>
          <p>{intl.getHTML("USER_SECURITY_MODAL_AFFILIATE")}</p>
        </div>
        <button className={styles["btn-primary"]} onClick={() => {
          this.getUserBalance();
          this.setState({affirmPrizeModal: false})
        }}>{intl.get("BTN_OKAY")}</button>
      </Modal>
    </div>
  }
}

export default connect(state => ({
  ...state
}), actions)(User);
