import React, {Component} from 'react';
import { Spin } from 'antd';
import intl from "react-intl-universal";
import {connect} from "react-redux";
import {Link, NavLink, withRouter} from 'react-router-dom';
import Cookies from "universal-cookie";
import actions from "../../../store/actions";
import styles from './header.module.scss';
import AuthRequest from "../../../request/Authorization";
import {Button, Modal, Field, Swiper, Checkbox} from "../../basic";
import GameRequest from "../../../request/Game";
import UserRequest from "../../../request/User";
import RiskControlRequest from "../../../request/RiskControlRequest";
import NewsRequest from "../../../request/News";
import ConfigurationRequest from "../../../request/Configuration";
import './header.scss';
import icon01 from "./image/baht-icon.png";
import icon02 from "./image/icon-deposit.png";
import store from "../../../store"
import Utils from '../../../util/Utils'
var banlanceInterval = null;
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.handleSignInModeClick = this.handleSignInModeClick.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      btnLoginLoading: false,
      signInMode: false,
      forgotModal: false,
      hasToken: false,
      name: "",
      password: ""
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.handleKeyEnter);
      store.subscribe(() => {

          if (!store.getState().user.token) {
            clearInterval(banlanceInterval)
          }

      })
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyEnter);
    clearTimeout(this.timeoutsPop)

  }

  handleSignInModeClick(signInMode) {
    if (signInMode) {
      this.setState({
        signInMode: true
      })
    } else {
      this.setState({
        signInMode: false
      })
    }
  }

  handlePassForgot = () => {
    const data = {
      name: this.state.forgotUsername,
      email: this.state.forgotEmail
    };
    UserRequest.forgotPass(data).then(() => {
      this.setState({
        forgotModal: false
      });
      Modal.info({
        content: intl.get("HEADER_MODAL_FORGOT_SUCCESS")
      });
    });
  };

  handleKeyEnter = (e) => {
    if (this.state.signInMode && e.keyCode === 13)
      this.handleLogin();
  };

  handleLogin() {
    this.setState({
      btnLoginLoading: true
    });

    AuthRequest.login({
      name: this.state.name,
      password: this.state.password
    }).then(res => {
        banlanceInterval = setInterval(() => {
            UserRequest.getUserBalance().then(res => {
                const {userInfo} = this.props.user;
                userInfo.account.available_balance = res.available_balance;
                userInfo.account.total_point_balance = res.total_point_balance;
                this.props.saveUserInfo(userInfo);
            });
        }, 10000);
      const {meta, ...userInfo} = res;
      this.props.saveUserToken(meta.access_token);
      this.props.saveUserInfo(userInfo);
      AuthRequest.getHome().then(res => {
        window.EventBus.emit("MENU_STATUS", res);
      })
      if (res.is_need_change_password) {
        Modal.info({
          content: intl.get("MESSAGE_need_change_pwd"),
          onOk: () => {
            this.props.history.push(`/${window.location.pathname.split("/")[1]}/user/account/pwd`);
          }
        });
      }
      NewsRequest.getAnnouncements({is_login_pop_up: 1, pop_up: 1}).then(res => {
        this.props.saveAnnouncements(res.data);
        if (res.data.length && res.data[0].pop_up) {
          const cookies = new Cookies();
          const popupId = res.data[0].pop_up ? res.data[0].id : null;
          const recordMutedId = cookies.get(`2S_ANNOUNCEMENT_MUTED_ID`);

            const delay_sec = res.data[0].pop_up_setting ? res.data[0].pop_up_setting.delay_sec : 0
            this.timeoutsPop = setTimeout(()=> {
                if (popupId !== null && !recordMutedId && res.data[0].is_login_pop_up)
                    this.props.switchPopup(true);
            }, delay_sec ? delay_sec * 1000 : 0)

        }
      });
      const blackbox = window.IGLOO.getBlackbox().blackbox;
      RiskControlRequest.login({blackbox});
      if (this.props.location.pathname === `/${window.location.pathname.split("/")[1]}/reg`) {
        this.props.history.push(`/${window.location.pathname.split("/")[1]}`);
      }
    }).finally(() => {
      this.setState({
        name: "",
        password: "",
        btnLoginLoading: false
      });
    });
  }

  handleLogout() {
    AuthRequest.logout().then(() => {
      this.props.deleteUser();
        AuthRequest.getHome().then(res => {
            window.EventBus.emit("MENU_STATUS", res);
        })
    });
  }

  render() {
    const {user} = this.props;
    const {token} = user;
    const loginModule = this.state.signInMode ? <>
      <div className={`${styles["input-wrap"]} ${styles.acnt}`}>
        <Field type="text" inputClass={styles["login-input"]} placeholder={intl.get("HEADER_PLACEHOLDER_USERNAME")}
               value={this.state.name}
               onChange={val => {this.setState({name: val})}} />
      </div>
      <div className={`${styles["input-wrap"]} ${styles.pwd}`}>
        <Field type="password" inputClass={styles["login-input"]} placeholder={intl.get("HEADER_PLACEHOLDER_PASSWORD")}
               value={this.state.password}
               onChange={val => {this.setState({password: val})}} />
        <span className={styles.link} onClick={() => this.setState({forgotModal: true})}>{intl.get("HEADER_FORGOT")}</span>
      </div>
      <Button type="info" className={styles["btn-info"]} loading={this.state.btnLoginLoading}
              onClick={this.handleLogin}>{intl.get("BTN_SIGN_IN").toUpperCase()}</Button>
      <div className={styles["cancel-link"]} onClick={() => {this.handleSignInModeClick(false)}}>
        <span>{intl.get("BTN_CANCEL").toUpperCase()}</span>
      </div>
      <Modal visible={this.state.forgotModal}
             title={intl.get("HEADER_MODAL_TITLE")}
             onCancel={() => {this.setState({forgotModal: false})}}
      >
        <div className={styles["modal-content"]}>
          <div className={styles["modal-label"]}>{intl.get("HEADER_MODAL_LABEL_USERNAME")} *<span className={styles.info}/></div>
          <Field className={styles["modal-field"]} onChange={val => {this.setState({forgotUsername: val})}} />
          <div className={styles["modal-label"]}>{intl.get("HEADER_MODAL_LABEL_EMAIL")} *<span className={styles.info}/></div>
          <Field className={styles["modal-field"]} onChange={val => {this.setState({forgotEmail: val})}} />
          <div className={styles["btn-row"]}>
            <button className={styles["modal-btn-cancel"]} onClick={() => {this.setState({forgotModal: false})}}>{intl.get("BTN_CANCEL").toUpperCase()}</button>
            <button className={styles["modal-btn-submit"]} onClick={this.handlePassForgot}>{intl.get("BTN_SUBMIT")}</button>
          </div>
        </div>
      </Modal>
    </>
    :
    <>
      <Button type="default" className={styles["btn-default"]} onClick={() => {this.handleSignInModeClick(true)}}>{intl.get("BTN_SIGN_IN").toUpperCase()}</Button>
      <Button type="primary"  className={styles["btn-primary"]} onClick={() => {this.props.history.push(`/${window.location.pathname.split("/")[1]}/reg`)}}>{intl.get("BTN_REGISTER").toUpperCase()}</Button>
    </>;
    const userInfoModule = user.userInfo ? <>
      <div className={`${styles["user-info"]} ${styles.profile}`}>{intl.get("HEADER_WELCOME")} <Link to={"/" + window.location.pathname.split("/")[1] + "/user/account"} className={styles.link}>{user.userInfo.name}</Link></div>
      <div className={`${styles["user-info"]} ${styles.balance}`}>{intl.get("HEADER_BALANCE")} <Link to={"/" + window.location.pathname.split("/")[1] + "/user/transfer"} className={styles.link}>{user.userInfo.account.available_balance}</Link></div>
      <div style={this.props.user.userInfo.currency === 'THB' ? {backgroundImage: 'url('+ icon01 +')', backgroundSize: 'contain',backgroundRepeat: 'no-repeat'} : {backgroundImage: 'url('+ icon02 +')', backgroundSize: 'contain',backgroundRepeat: 'no-repeat'}} className={`${styles["user-info"]} ${styles.deposit}`}><Link to={"/" + window.location.pathname.split("/")[1] + "/user/deposit"} className={styles.link}>{intl.get("HEADER_DROP_DEPOSIT").toUpperCase()}</Link></div>
      <Button type="secondary" onClick={this.handleLogout} icon={<span className={styles["icon-exit"]} />}>{intl.get("BTN_SIGN_OUT").toUpperCase()}</Button>
    </> : null;
    return token ? userInfoModule : loginModule;
  }
}

const UserInfoContainer = connect(state => ({
  ...state
}), actions)(withRouter(UserInfo));

class Menu extends Component {
  timer = null;
  state = {
    type: "",
    subShow: false,
    subShowTow: false,
    menus: [],
    filteredMenus: [],
    gameList: [],
    gameListAll: [],
    loading: true,
    menuStatus: {
      e_sport: 1,
      games: 1,
      live_casino: 1,
      lottery: 1,
      p2p: 1,
      promotion: 1,
      slots: 1,
      sport: 1,
      vip_hl8: 1
    }
  };

  componentDidMount() {
    this.getVendors();
    this.getGamesNoSolts();
    window.EventBus.on("MENU_STATUS", this.getMenuState.bind(this))
    AuthRequest.getHome().then(res => {
      this.setState({
        menuStatus: res
      })
    })
  }
  getMenuState (menuStatus) {
    console.log(menuStatus)
    this.setState({
      menuStatus: menuStatus
    })
  }
  getVendors () {
    GameRequest.getGamePlatforms().then(res => {
      const slotVendors = res.data.filter(item => item.type === 2);
      this.props.saveSlotVendors(slotVendors);
      this.setState({
        menus: res.data
      });
    });
  };

  handleMouseOver (vendorType) {
    clearTimeout(this.timer);
    const arr = this.state.menus.filter(item => item.type === vendorType);
    let type;
    switch (vendorType) {
      case 1: type = "games"; break;
      case 2: type = "slots"; break;
      case 3: type = "lives"; break;
      case 4: type = "sports"; break;
      case 5: type = "lottos"; break;
      case 6: type = "p2p"; break;
      default: type = "";
    }
    console.log(arr)
    this.setState({
      filteredMenus: arr,
      subShow: true,
      subShowTow: false,
      type
    });
  }

  handleMouseOut = () => {
    this.timer = setTimeout(() => {
      this.setState({
        filteredMenus: [],
        subShow: false,
      });
    }, 0);
  };
  closeMenu = () => {
    this.timer = setTimeout(() => {
      this.setState({
        subShow: false,
        subShowTow: false,
      });
    }, 0);
  };
  handleDropMouseOver = () => {
    clearTimeout(this.timer)
  };

  handleDropMouseOut = () => {
    this.timer = setTimeout(() => {
      this.setState({
        subShow: false,
        subShowTow: false
      })
    }, 0);
  };

  handleDirectToMobile = () => {
    // const domain = document.domain.replace("www.", ".");
    // const cookies = new Cookies();
    // cookies.set("2S_DEVICE", "2", { path: "/", domain });
    // window.location.reload();
    const domain = document.domain;
    const protocol = document.location.protocol;
    const port = document.location.port;
    window.location.href = `${protocol}//${domain.replace("www.", "m.")}:${port}`;
  };
  getGames = (type) => {
    this.setState({
      loading: true
    })
    GameRequest.getGames({
      type: type
    }).then(res => {
      this.setState({
        gameList: res.data,
        subShowTow: true,
        subShow: false,
        loading: false,
      })
    })
  };
  getGamesNoSolts () {
    GameRequest.getGamesNoSolts().then(res => {
      this.setState({
        loading: false,
        gameListAll: res.data,
      })
    })
  }
  handleMouseOverOneGame (type) {

    const arr = this.state.gameListAll.filter(item => item.type === type);
    this.setState({
      loading: false,
      gameList: arr,
      subShowTow: true,
      subShow: false,
    })
  }
  handleGameClick = (item, type) => {
    if (item.is_maintain) {
      return
    }
    if (type === "login") {
      GameRequest.loginGame(item.id).then(res => {
        if (item.is_iframe) {
          window.open(`${window.location.origin}/${window.location.pathname.split("/")[1]}/game_play?url=${encodeURIComponent(res.url)}&code=${item.platform_code}`,  "_blank");
        } else {
          window.open(res.url, "_blank");
        }
      });
    } else {
      GameRequest.tryGame(item.id).then(res => {
        if (item.is_iframe) {
          window.open(`${window.location.origin}/${window.location.pathname.split("/")[1]}/game_play?url=${encodeURIComponent(res.url)}&code=${item.platform_code}`,  "_blank");
        } else {
          window.open(res.url, "_blank")
        }
      });
    }
  };
  backgroundRender(index) {
    if (index ===0 || index ===5 || index ===10 || index ===15 || index ===20 || index ===25 || index ===30 || index ===35 || index ===40 || index ===45 || index ===50 ){
      return <div className={`${styles["sub-menu-item-background-bottom"]}`}></div>
    }
  }
  render() {
    return <>
      <div className={styles.menu}>
        <div className={`${styles["menu-container"]} container`}>
          {
            this.state.menuStatus.sport === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/sports"} className={styles["menu-item"]}
                     onMouseOver={() => {this.handleMouseOverOneGame(4)}}
                     onMouseOut={this.handleMouseOut}
                     activeClassName={styles.on}>{intl.get("HEADER_MENU_SPORTS")}</NavLink>
          }
          {
            this.state.menuStatus.e_sport === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/esports"}
                     onMouseOver={this.closeMenu}
                     className={styles["menu-item"]}
                     activeClassName={styles.on}>{intl.get("HEADER_MENU_ESPORTS")}</NavLink>
          }
          {
            this.state.menuStatus.live_casino === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/lives"} className={styles["menu-item"]} activeClassName={styles.on}
                     onMouseOver={() => {this.handleMouseOverOneGame(3)}}
                     onMouseOut={this.handleMouseOut}>{intl.get("HEADER_MENU_LIVE")}</NavLink>
          }
          {
            this.state.menuStatus.slots === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/slots"} className={styles["menu-item"]} activeClassName={styles.on}
                     onMouseOver={() => {this.handleMouseOver(2)}}
                     onMouseOut={this.handleMouseOut}>{intl.get("HEADER_MENU_SLOTS")}</NavLink>
          }
          {
            this.state.menuStatus.games === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/games"} className={styles["menu-item"]} activeClassName={styles.on}
                     onMouseOver={() => {this.handleMouseOverOneGame(1)}}
                     onMouseOut={this.handleMouseOut}>{intl.get("HEADER_MENU_GAMES")}</NavLink>
          }
          {
            this.state.menuStatus.lottery === 1&&
            <NavLink to={"/" + window.location.pathname.split("/")[1] + "/lottos"} className={styles["menu-item"]}
                     onMouseOver={() => {this.handleMouseOverOneGame(5)}}
                     onMouseOut={this.handleMouseOut}
                     activeClassName={styles.on}>{intl.get("HEADER_MENU_LOTTERY")}</NavLink>
          }
          {
            this.state.menuStatus.p2p === 1&&
            <div className={`${styles["menu-item"]} ${styles.disabled}`}>
              <span className={styles.text}>
                {intl.get("HEADER_MENU_P2P")}
                <span className={styles.soon}>{intl.get("TEXT_SOON")}</span>
              </span>
            </div>
          }




          {/*<NavLink to="/pokers" className={styles["menu-item"]} activeClassName={styles.on}*/}
          {/*         onMouseOver={() => {this.handleMouseOver(6)}}*/}
          {/*         onMouseOut={this.handleMouseOut}>{intl.get("HEADER_MENU_P2P")}</NavLink>*/}
          {
            this.state.menuStatus.promotion === 1&&
            <NavLink onMouseOver={this.closeMenu} to={"/" + window.location.pathname.split("/")[1] + "/promos"} className={styles["menu-item"]} activeClassName={styles.on}>{intl.get("HEADER_MENU_PROMOTION")}</NavLink>
          }
          {
            this.state.menuStatus.vip_hl8 === 1&&
            <div className={`${styles["menu-item"]} ${styles.disabled}`}>
              <span className={styles.text}>
                {intl.get("HEADER_MENU_VIP")}
                <span className={styles.soon}>{intl.get("TEXT_SOON")}</span>
              </span>
            </div>
          }
          {
            <NavLink onMouseOver={this.closeMenu} to={"/" + window.location.pathname.split("/")[1] + "/app"} className={styles["menu-item"]} activeClassName={styles.on}>APP</NavLink>
          }
        </div>
        {
          <div className={`${styles["sub-menu-tow"]} ${this.state.subShow ? "" : "hidden"} ${styles[this.state.type]}`}
               onMouseOver={this.handleDropMouseOver}
               onMouseOut={this.handleDropMouseOut}>
            <div className={`${styles["menu-container"]} container`}>
              {
                this.state.filteredMenus.map((item, index) => {
                  return (
                      <div key={`item${index}`} className={`${styles["sub-menu-item-tow"]}`}>
                        <img onClick={() => window.location.href=`${window.location.origin}/${window.location.pathname.split("/")[1]}/${this.state.type}/${item.code}`} src={item.one_web_img_path} alt=""/>
                        <div className={`${styles["sub-menu-item-button"]}`}>
                          <div style={{padding: '10px', paddingBottom: '20px'}}>
                            <Button type="primary" className={styles["btn-play-gameList"]}
                                    onClick={() => window.location.href=`${window.location.origin}/${window.location.pathname.split("/")[1]}/${this.state.type}/${item.code}`}>{intl.get("BTN_PLAY")}</Button>
                          </div>
                        </div>
                        <div>
                          {
                            this.backgroundRender(index)
                          }
                        </div>
                      </div>
                  )
                })
              }
            </div>
          </div>
        }
        {
          <div className={`${styles["sub-menu-tow"]} ${this.state.subShowTow ? "" : "hidden"} ${styles[this.state.type]}`}
               onMouseOver={this.handleDropMouseOver}
               onMouseOut={this.handleDropMouseOut}>
            {
              this.state.loading ? <div className={styles["loading-style"]}><Spin tip="Loading..."/></div> :
              <div className={`${styles["menu-container-tow"]} container`}>
                    {
                      this.state.gameList.map((item, index) => {
                        return (
                            <div key={`item${index}`} className={`${styles["sub-menu-item-tow"]}`}>
                              <img onClick={() => this.handleGameClick(item, "login")} src={item.droplist_img_path} alt=""/>
                              <div className={`${styles["sub-menu-item-button"]}`}>

                                <div style={{padding: '10px', paddingBottom: '20px'}}>
                                  {
                                    item.is_maintain ?
                                        <div className={styles["btn-group"]}>
                                          <Button type="primary" className={styles["btn-maintenance-gameList"]}>{intl.get("BTN_MAINTENANCE")}</Button>
                                        </div> :
                                        <div className={styles["btn-group"]}>
                                          {
                                            item.is_can_try && <Button className={styles["btn-try-gameList"]}
                                                                       onClick={() => this.handleGameClick(item, "try")}>
                                              {intl.get("BTN_TRY").toUpperCase()}
                                            </Button>
                                          }
                                          <Button type="primary" className={styles["btn-play-gameList"]}
                                                  onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_PLAY")}</Button>
                                        </div>
                                  }
                                </div>

                              </div>
                              <div>
                                {
                                  this.backgroundRender(index)
                                }
                              </div>
                            </div>
                        )
                      })
                    }
                </div>
            }

          </div>
        }
      </div>
    </>
  }
}

const MenuContainer = connect(state => ({
  ...state
}), actions)(withRouter(Menu));


class Header extends Component {
  timer = null;
  state = {
    date: new Date(),
    showLanDropdown: false,
    tipCheck: false,
    announcements: []
  };

  constructor(props) {
      super(props);
  }

  componentDidMount() {

    document.addEventListener("click",  this.handleLanDropHide);
    this.getAnnounceCategories();
    this.getAnnouncements();
    this.setTimer();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getAnnounceCategories();
      this.getAnnouncements();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleLanDropHide);
    clearInterval(this.timer);
    clearInterval(this.timeoutsPop);
  }

  getAnnounceCategories() {
    ConfigurationRequest.getDroplist("announcement").then(res => {
      this.props.saveCategories(res.category);
      this.props.selectCategory(res.category[0].key);
    })
  }

  setTimer = () => {
    this.timer = setInterval(() => {
      this.setState({
        date: new Date()
      });
    }, 1000);
  };

  handleLanDropHide = () => {
    this.setState({showLanDropdown: false});
  };

  toggleDropdown = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    const {showLanDropdown} = this.state;
    this.setState({showLanDropdown: !showLanDropdown})
  };

  getAnnouncements() {
      let datalist = this.props.user.token ? {is_login_pop_up: 1, pop_up: 1} : {pop_up: 1}
      NewsRequest.getAnnouncements(datalist).then(res => {
        if (res.data.length === 0) {return}
        this.props.saveAnnouncements(res.data);
        const cookies = new Cookies();
        const recordMutedId = cookies.get(`2S_ANNOUNCEMENT_MUTED_ID`);

          const delay_sec = res.data[0].pop_up_setting ? res.data[0].pop_up_setting.delay_sec : 0;
          this.timeoutsPop = setTimeout(()=> {
              if (!res.data[0].is_login_pop_up && !this.props.user.token && !recordMutedId) {
                  this.props.switchPopup(true);
              }
              if (res.data[0].is_login_pop_up && this.props.user.token && !recordMutedId) {
                  this.props.switchPopup(true);
              }
          }, delay_sec ? delay_sec * 1000 : 0)

      });
      let datalist1 = this.props.user.token ? {is_login_pop_up: 1} : {}
      NewsRequest.getAnnouncements(datalist1).then(res => {
        this.setState({
          announcements: res.data
        })
      });
  }

  closePopup() {
    const {tipCheck} = this.state;
    if (tipCheck) {
      const cookie = new Cookies();
      const {announcement, user} = this.props;
      const muteId = announcement.announcements[0].id;
      var millisecond = new Date().getTime();
      var expiresTime = new Date(millisecond + announcement.announcements[0].pop_up_setting.frequency * 1000)

      cookie.set(`2S_ANNOUNCEMENT_MUTED_ID`, muteId, {
        path: "/",
        expires: expiresTime
      })
    }
    this.props.switchPopup(false);
    this.setState({
      tipCheck: false
    });
  }
  selectLanguage(language) {
    let pathname = window.location.pathname.split("/")
    pathname[1] = Utils.returnLanguageShort(language)
    pathname = pathname.join('/')
    window.location.href = window.location.protocol + '//' + window.location.host + pathname + window.location.search
  }
  imageLink (item) {
    if (item.is_game) {
      if (this.props.user.token) {
        GameRequest.loginGame(item.pop_up_setting.web_redirect_url).then(res => {
          window.open(res.url, "_blank");
        });
      } else {
        GameRequest.tryGame(item.pop_up_setting.web_redirect_url).then(res => {
          window.open(res.url, "_blank");
        });
      }
    } else  {
      window.location.href = item.pop_up_setting.web_redirect_url
    }

  }
  render() {
    let _this = this
    const swiperConfigs = {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    };
      const swiperConfigs1 = {
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          pagination: {
              el: '.swiper-pagination',
              clickable: true
          },
          autoplay: {
              disableOnInteraction: false
          },
          loop: true,
          on: {
            tap (e) {
              if(e.target.getAttribute('data-url')) {
                let objectItem = {
                  is_game: e.target.getAttribute('data-is_game'),
                  pop_up_setting: {
                    web_redirect_url: e.target.getAttribute('data-url')
                  }
                }
                _this.imageLink(objectItem)
              }

            }
          }
      };
    const {selectLan, language, announcement, location} = this.props;
    let {currentLanKey, languageList, defaultLanKey} = language;
    currentLanKey = currentLanKey || defaultLanKey;
    const currentLan = languageList.filter(item => item.key === currentLanKey)[0];
    const restLans = languageList.filter(item => item.key !== currentLanKey);
    const {date, showLanDropdown, tipCheck, announcements} = this.state;
    const selectedAnnouncements = announcements.filter(item => item.category === announcement.selectedCategory);
    return <nav>
      <div className={styles.control}>
        <div className={styles["control-container"] + " container"}>
          <Link to={"/" + window.location.pathname.split("/")[1]} className={styles.logo} />
          <div className={styles["control-info"]}>
            <div className={styles["system-time"]}>{intl.get("DATE", { date: date })} {intl.get("TIME", { time: date })}</div>
            <div className={`${styles.language} ${styles[currentLan.style]}`} onClick={this.toggleDropdown}>
              {currentLan.style.toUpperCase()}
              <div className={`${styles["language-dropdown"]} ${showLanDropdown ? styles.show : ""}`}>
                {
                  restLans.map((item, index) => {
                    return <div className={`${styles.language} ${styles[item.style]}`}
                                onClick={() => this.selectLanguage(item.key)}
                                key={`item${index}`}>
                      {item.style.toUpperCase()}
                    </div>
                  })
                }
              </div>
            </div>
            <div className={styles["announcement"]} onClick={() => this.props.switchModal(true)} />
            <UserInfoContainer />
          </div>
        </div>
      </div>
      <MenuContainer />
      <Modal visible={announcement.modalState} width={768}
             className={styles["announce-modal"]}
             title={intl.get("HEADER_ANNOUNCEMENTS")}
             onCancel={() => this.props.switchModal(false)}>
        <div className={styles["announce-category"]}>
          {
            announcement.categories.map((item, index) => {
              return <div className={`${styles["category-item"]} ${announcement.selectedCategory === item.key ? styles.on : ""}`}
                          key={`item${index}`} onClick={() => this.props.selectCategory(item.key)}>{item.value}</div>
            })
          }
        </div>
        {
          !!selectedAnnouncements.length ? selectedAnnouncements.map((item, index) =>{
            return item.category === announcement.selectedCategory && <div className={styles["announce-item"]} key={`item${index}`}>
              <div className={styles["title-row"]}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.date}>{item.created_at.split(" ")[0]}</div>
              </div>
              <div className={styles.content}>{item.content}</div>
            </div>
          }) : <div className={styles["empty-data"]}>{intl.get("MESSAGE_ANNOUNCE_TIP_EMPTY")}</div>
        }
      </Modal>
      {/*<Modal visible={announcement.popupState} width={768}*/}
             {/*className={styles["announce-popup"]}*/}
             {/*title={intl.get("HEADER_ANNOUNCEMENTS")}*/}
             {/*destroyOnClose={true}*/}
             {/*onCancel={() => this.closePopup()}>*/}
        {/*{*/}
          {/*!!announcement.announcements.length && <Swiper configs={swiperConfigs}>*/}
            {/*{*/}
              {/*announcement.announcements.map((item, index) => {*/}
                {/*return <div className="swiper-slide" key={`item${index}`}>*/}
                  {/*<div className={styles.title}>{item.title}</div>*/}
                  {/*<div className={styles.date}>{item.created_at.split(" ")[0]}</div>*/}
                  {/*<div className={styles.content}>{item.content}</div>*/}
                  {/*{*/}
                    {/*index === 0 && <>*/}
                      {/*<Button type="info" className={styles["btn-popup"]} onClick={() => this.closePopup()}>{intl.get("BTN_GOT_IT")}</Button>*/}
                      {/*<div className={styles["popup-tip"]}>*/}
                        {/*<Checkbox checked={tipCheck} onChange={e => this.setState({tipCheck: e.target.checked})} /> {intl.get("MODAL_ANNOUNCEMENT_POPUP_TIP")}*/}
                      {/*</div>*/}
                    {/*</>*/}
                  {/*}*/}
                {/*</div>*/}
              {/*})*/}
            {/*}*/}
          {/*</Swiper>*/}
        {/*}*/}
      {/*</Modal>*/}
        {
            !!announcement.announcements.length && announcement.announcements[0].content_type !== 'image' && (location.pathname === '/en' || location.pathname === '/vn' || location.pathname === '/th') &&
            <Modal visible={announcement.popupState} width={768}
                   className={styles["announce-popup"]}
                   title={intl.get("HEADER_ANNOUNCEMENTS")}
                   destroyOnClose={true}
                   onCancel={() => this.closePopup()}>
                {
                    <Swiper configs={swiperConfigs}>
                        {
                            announcement.announcements.map((item, index) => {
                                return <div className="swiper-slide" key={`item${index}`}>
                                    <div className={styles.title}>{item.title}</div>
                                    <div className={styles.date}>{item.created_at.split(" ")[0]}</div>
                                    <div className={styles.content}>{item.content}</div>
                                    {
                                        index === 0 && <>
                                            {/*<Button type="info" className={styles["btn-popup"]} onClick={() => this.closePopup()}>{intl.get("BTN_GOT_IT")}</Button>*/}
                                            <div className={styles["popup-tip"]}>
                                                <Checkbox checked={tipCheck} onChange={e => this.setState({tipCheck: e.target.checked})} /> {intl.get("MODAL_ANNOUNCEMENT_POPUP_TIP")}
                                            </div>
                                        </>
                                    }
                                </div>
                            })
                        }
                    </Swiper>
                }
            </Modal>
        }
        {
            !!announcement.announcements.length && announcement.announcements[0].content_type === 'image' && (location.pathname === '/en' || location.pathname === '/vn' || location.pathname === '/th') && announcement.announcements.length ===1 &&
            <Modal visible={announcement.popupState} width={600}
                   className="announce-popup-image"
                   destroyOnClose={true}
                   onCancel={() => this.closePopup()}>
                <div>
                    <div
                    onClick={() => this.imageLink(announcement.announcements[0])}
                    className="announce-popup-image-background" style={{
                        backgroundImage: 'url("' + announcement.announcements[0].web_img_path + '")',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        width: '600px',
                        height: '420px'
                    }}>
                        <div className="announce-popup-image-title-button">
                            {/*<div className="announce-popup-image-title-left">*/}
                                {/*<div className="announce-popup-image-title">{announcement.announcements[0].title}</div>*/}
                                {/*<div className="announce-popup-image-time">{announcement.announcements[0].start_at.split(" ")[0]} ~ {announcement.announcements[0].end_at.split(" ")[0]}</div>*/}
                            {/*</div>*/}
                            {/*<div className="announce-popup-image-title-right">*/}
                                {/*<Button onClick={() => window.open(announcement.announcements[0].pop_up_setting.web_redirect_url)} className={styles["btn-popup-play"]}>{intl.get("BTN_PLAYNOW")}</Button>*/}
                            {/*</div>*/}
                        </div>

                    </div>
                    <div className="announce-popup-image-bottom">
                        {/*<Button type="info" className={styles["btn-popup"]} onClick={() => this.closePopup()}>{intl.get("BTN_GOT_IT")}</Button>*/}
                        <div className={styles["popup-tip"]}>
                            <Checkbox checked={tipCheck} onChange={e => this.setState({tipCheck: e.target.checked})} /> {intl.get("MODAL_ANNOUNCEMENT_POPUP_TIP")}
                        </div>
                    </div>
                </div>
              </Modal>
        }
        {
            !!announcement.announcements.length && announcement.announcements[0].content_type === 'image' && (location.pathname === '/en' || location.pathname === '/vn' || location.pathname === '/th') && announcement.announcements.length >1 &&
            <Modal visible={announcement.popupState} width={600}
                   className="announce-popup-image"
                   destroyOnClose={true}
                   onCancel={() => this.closePopup()}>
                <div>
                  <Swiper configs={swiperConfigs1}>
                      {
                          announcement.announcements.map((item, index) => {
                              return <div data-is_game={item.is_game ? 1 : ''} data-url={item.pop_up_setting.web_redirect_url}  className="swiper-slide" key={`item${index}`}>
                                  <div
                                      data-is_game={item.is_game ? 1 : ''} data-url={item.pop_up_setting.web_redirect_url}
                                      className="announce-popup-image-background" style={{
                                      backgroundImage: 'url("' + item.web_img_path + '")',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundSize: 'cover',
                                      width: '600px',
                                      height: '420px'
                                  }}>

                                  </div>
                              </div>
                          })
                      }

                  </Swiper>

                    <div className="announce-popup-image-bottom">
                        {/*<Button type="info" className={styles["btn-popup"]} onClick={() => this.closePopup()}>{intl.get("BTN_GOT_IT")}</Button>*/}
                        <div className={styles["popup-tip"]}>
                            <Checkbox checked={tipCheck} onChange={e => this.setState({tipCheck: e.target.checked})} /> {intl.get("MODAL_ANNOUNCEMENT_POPUP_TIP")}
                        </div>
                    </div>
                </div>
            </Modal>
        }
      </nav>
  }
}

export default connect(state => ({
  ...state
}), actions)(withRouter(Header));
