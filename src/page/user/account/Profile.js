import React, {Component} from "react";
import styles from "./content.module.scss";
import {Icon} from "antd";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import {Modal, Field, Select} from "../../../component/basic";
import ConfigurationRequest from "../../../request/Configuration";
import UserRequest from "../../../request/User";
import actions from "../../../store/actions";
import Utils from "../../../util/Utils";

const {Option} = Select;

class Profile extends Component {
  constructor(props) {
    super(props);
    const {userInfo} = this.props.user;
    this.state = {
      pageType: "view",
      userInfo: userInfo,
      lanOpts: [],
      genderOpts: [],
      oddOpts: [],
      securityQuestOpts: [],
      language: userInfo.language,
      password: "",
      gender: "",
      address: userInfo.info.address,
      odds: userInfo.odds,
      security_question: userInfo.security_question,
      security_question_answer: ""
    };
  }

  componentDidMount() {
    this.initialRegModal();
    this.getDroplist();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDroplist();
    }
  }

  initialRegModal = () => {
    const {state} = this.props.location;
    if (state && state.isRegSuc) {
      Modal.info({
        content: <>
          <span className={styles["modal-text-hl"]}>{intl.get("USER_PROFILE_MODAL_REGSUC_TIP1")}</span> {intl.get("USER_PROFILE_MODAL_REGSUC_TIP2")}
        </>
      })
    }
  };

  getDroplist = () => {
    ConfigurationRequest.getDroplist("user").then(res => {
      this.setState({
        lanOpts: res.language,
        genderOpts: res.gender,
        oddOpts: res.odds,
        securityQuestOpts: res.security_question
      });
    });
  };

  goEdit = () => {
    this.setState({
      pageType: "edit"
    });
  };

  handleProfileUpdate = () => {
    const {password, odds, address, gender, language, security_question, security_question_answer} = this.state;
    const data = {
      password,
      odds,
      address,
      gender,
      language,
      security_question,
      security_question_answer
    };
    const params = Utils.adaptParams(data);
    UserRequest.updateUserInfo(params).then(res => {
      Modal.info({
        content: intl.get('MESSAGE_Profile_update_successfully')
      });
      this.props.saveUserInfo(res);
      this.setState({
        pageType: "view"
      });
    });
  };

  render() {
    const {pageType, genderOpts, oddOpts, securityQuestOpts, lanOpts, gender, language, address, odds, security_question} = this.state;
    const {userInfo} = this.props.user;
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get('USER_PROFILE')}</div>
        {
          pageType === "view" ? <div className={styles["btn-edit"]} onClick={this.goEdit}>{intl.get('USER_PROFILE_EDIT')}</div>
            :
          <div className={`${styles["btn-primary"]} ${styles["with-checker"]}`} onClick={this.handleProfileUpdate}>{intl.get('BTN_UPDATE')}</div>
        }
      </div>
      {
        userInfo && <div className={styles["profile-info-wrap"]}>
          <div className={styles["info-block"]}>
            <div className={styles["info-title"]}>{intl.get('USER_PROFILE_GENERAL')}</div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_USERNAME')}:</div>
              <div className={styles["info-val"]}>{userInfo.name}</div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_EMAIL')}:</div>
              <div className={styles["info-val"]}>{userInfo.info.email}</div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_CONTACT')}:</div>
              <div className={styles["info-val"]}>{userInfo.info.phone}</div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_FULL')}:</div>
              <div className={styles["info-val"]}>{userInfo.info.full_name}</div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_DATE')}:</div>
              <div className={styles["info-val"]}>{userInfo.info.birth_at}</div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_GENDER')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" && (userInfo.info.gender || "-")
                }
                {
                  pageType === "edit" && (userInfo.info.gender || <Select value={gender} suffixIcon={<Icon type="caret-down" />} placeholder="Select Gender"
                                                                          onChange={val => { this.setState({gender: val}) }}>
                    {
                      genderOpts.map((item, index) => {
                        return <Option value={item.key} key={`opt${index}`}>{item.value}</Option>
                      })
                    }
                  </Select>)
                }
              </div>
            </div>
          </div>
          <div className={styles["info-block"]}>
            <div className={styles["info-title"]}>{intl.get('USER_PROFILE_DELIVERY')}:</div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_ADDRESS')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? (userInfo.info.address || "-")
                  :
                  <Field value={address} onChange={val => { this.setState({address: val}) }} />
                }
              </div>
            </div>
            {/*<div className={styles["info-wrap"]}>*/}
            {/*  <div className={styles["info-label"]}>City:</div>*/}
            {/*  <div className={styles["info-val"]}>-</div>*/}
            {/*</div>*/}
            {/*<div className={styles["info-wrap"]}>*/}
            {/*  <div className={styles["info-label"]}>ZIP Code:</div>*/}
            {/*  <div className={styles["info-val"]}>-</div>*/}
            {/*</div>*/}
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_COUNTRY')}:</div>
              <div className={styles["info-val"]}>{userInfo.country}</div>
            </div>
          </div>
        </div>
      }
      {
        userInfo && <div className={styles["profile-info-wrap"]}>
          <div className={styles["info-block"]}>
            <div className={styles["info-title"]}>{intl.get('USER_PROFILE_PREFERENCE')}:</div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_LANGUAGE')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? userInfo.display_language
                    :
                    <Select value={language} suffixIcon={<Icon type="caret-down" />}
                            onChange={val => this.setState({language: val})}>
                      {
                        lanOpts.map((item, index) => {
                          return <Option value={item.key} key={`opt${index}`}>{item.value}</Option>
                        })
                      }
                    </Select>
                }
              </div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_ODDS')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? (userInfo.display_odds || "-")
                  :
                  <Select value={odds} suffixIcon={<Icon type="caret-down" />}
                          onChange={val => { this.setState({odds: val}) }}>
                    {
                      oddOpts.map((item, index) => {
                        return <Option value={item.key} key={`opt${index}`}>{item.value}</Option>
                      })
                    }
                  </Select>
                }
              </div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_CURRENCY')}:</div>
              <div className={styles["info-val"]}>{userInfo.currency}</div>
            </div>
          </div>
          <div className={styles["info-block"]}>
            <div className={styles["info-title"]} />
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_SECURITY')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? "************"
                  :
                  <Select value={security_question} suffixIcon={<Icon type="caret-down" />} placeholder="Select your security question"
                          onChange={val => {
                            this.setState({
                              security_question: val
                            });
                          }}>
                    {
                      securityQuestOpts.map((item, index) => {
                        return <Option value={item.key} key={`opt${index}`}>{item.value}</Option>
                      })
                    }
                  </Select>
                }
              </div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_ANSWER')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? "************"
                  :
                  <Field onChange={val => {
                    this.setState({ security_question_answer: val });
                  }} />
                }
              </div>
            </div>
            <div className={styles["info-wrap"]}>
              <div className={styles["info-label"]}>{intl.get('USER_PROFILE_PASSWORD')}:</div>
              <div className={styles["info-val"]}>
                {
                  pageType === "view" ? "************"
                  :
                  <Field type="password" onChange={val => {
                    this.setState({password: val});
                  }} />
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  }
}

export default connect(state => ({
  ...state
}), actions)(Profile)
