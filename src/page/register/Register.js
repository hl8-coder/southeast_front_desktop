import React, {Component} from 'react';
import styles from './register.module.scss';
import {connect} from "react-redux";
import moment from "moment";
import {Form, Icon, Tooltip} from 'antd';
import {Field, Select, Button} from '../../component/basic';
import UserRequest from "../../request/User";
import Utils from "../../util/Utils";
import actions from "../../store/actions";
import ConfigurationRequest from "../../request/Configuration";
import intl from "react-intl-universal";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import RiskControlRequest from "../../request/RiskControlRequest";
import regist02 from './image/shutterstock_325910192.png';
import regist01 from './image/regist01.png';

const { Option } = Select;

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.limitDate = moment().subtract(18, "year");
    this.state = {
      btnLoading: false,
      yearOpts: [],
      monthOpts: [],
      dateOpts: [],
      countryOpts: [],
      currencyOpts: [],
      year: this.limitDate.year(),
      month: this.limitDate.month() + 1, // is actual month not an index
      date: this.limitDate.date(),
      name: "",
      password: "",
      password_confirmation: "",
      phone: "",
      country_code: this.props.language.currentLanKey === 'en-US' ? "+44" : this.props.language.currentLanKey === 'vi-VN' ? "+84" : "+66",
      full_name: "",
      email: "",
      birth_at: "",
      currency: this.props.language.currentLanKey === 'en-US' ? "" : this.props.language.currentLanKey === 'vi-VN' ? "VND" : "THB",
      affiliate_code: sessionStorage.getItem('affiliate_code') || ""
    };
    console.log(this.props.language)
  }

  componentDidMount() {
    this.getCountryDroplist();
    this.getCurrencies();
    this.setDateOpts();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      window.location.reload()
      // this.getCountryDroplist();
      // this.getCurrencies();
      // this.setDateOpts();
    }
  }

  getCountryDroplist = () => {
    ConfigurationRequest.getDroplist("user").then(res => {
      this.setState({
        countryOpts: res.country_code
      });
    });
  };

  getCurrencies() {
    ConfigurationRequest.getCurrencies().then(res => {
      this.setState({
        currencyOpts: res.data
      });
    });
  }

  setDateOpts = () => {
    const year = this.state.year,
      month = this.state.month,
      isLeap = Utils.isLeapYear(year),
      dateCount = Utils.getDateFromMonth(month, isLeap);
    const limitStart = moment().subtract(100, "year");
    const yearOpts = [], monthOpts = [], dateOpts = [];
    for (let i = 1; i <= 100; i++) {
      const disabled = limitStart.year() + i > this.limitDate.year();
      yearOpts.push({
        key: limitStart.year() + i,
        value: limitStart.year() + i,
        disabled: disabled
      });
    }
    for (let i = 1; i <= 12; i++) {
      let disabled;
      if (this.state.year < this.limitDate.year()) {
        disabled = false;
      } else {
        disabled = i > (this.limitDate.month() + 1);
      }
      monthOpts.push({
        key: i,
        value: i,
        disabled: disabled
      });
    }
    for (let i = 1; i <= dateCount; i++) {
      let disabled;
      if (this.state.year < this.limitDate.year()) {
        disabled = false;
      } else {
        if (this.state.month < (this.limitDate.month() + 1)) {
          disabled = false;
        } else {
          disabled = i > this.limitDate.date();
        }
      }
      dateOpts.push({
        key: i,
        value: i,
        disabled: disabled
      })
    }
    this.setState({
      yearOpts: yearOpts,
      monthOpts: monthOpts,
      dateOpts: dateOpts
    })
  };

  async handleSubmit() {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        const data = {
          name: this.state.name,
          password: this.state.password,
          password_confirmation: this.state.password_confirmation,
          country_code: this.state.country_code,
          phone: this.state.phone,
          full_name: this.state.full_name,
          email: this.state.email,
          currency: this.state.currency,
          birth_at: `${this.state.year}-${this.state.month}-${this.state.date}`,
          affiliate_code: this.state.affiliate_code
        };
        this.setState({
          btnLoading: true
        });
        const regRes = await UserRequest.reg(data).finally(() => {
          this.setState({
            btnLoading: false
          });
        });
        const {meta, ...userInfo} = regRes;
        this.props.saveUserToken(meta.access_token);
        this.props.saveUserInfo(userInfo);
        const blackbox = window.IGLOO.getBlackbox().blackbox;
        RiskControlRequest.reg({blackbox});
        this.props.history.push({
          pathname: `/${window.location.pathname.split("/")[1]}/user/account`,
          state: {
            isRegSuc: true
          }
        });
      }
    });
  }

  render() {
    const {
      btnLoading,
      countryOpts,
      country_code,
      currencyOpts,
      date,
      dateOpts,
      month,
      monthOpts,
      year,
      yearOpts
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    return <>
      <Helmet>
        <title>{intl.get('SEO_REGISTER_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_REGISTER_DESCRIPTION')}/>
        <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/reg`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
      </Helmet>
      <div className={styles.register}>
        <div className={styles["register-panel"]}>
          <div style={this.props.language.currentLanKey === 'th-TH' ? {backgroundImage: 'url('+ regist01 +')'} : {backgroundImage: 'url('+ regist02 +')'}} className={styles["panel-pic"]}>
            <div className={styles["pic-desc"]}>
              {/* <div className={styles["pic-desc-s"]}>JOIN NOW</div>
              <div className={styles["pic-desc-l"]}>UP TO 1 MILLION VND</div>
              <div className={styles["pic-desc-s"]}>SPORTS WELCOME BONUS</div> */}
            </div>
          </div>
          <div className={styles["panel-content"]}>
            <div className={styles["panel-title-line"]}>
              <h2 className={styles["panel-title"]}>{intl.get("REGISTER_TITLE")}</h2>
              <div className={styles["panel-desc"]}>{intl.getHTML("REGISTER_DESC")}</div>
            </div>
            <div className={styles["panel-form"]}>
              <div className={styles["form-column"]}>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_USERNAME")}:</div>
                  <Tooltip placement="right" title={intl.get("MESSAGE_USERNAME_TIP")} overlayStyle={{fontSize: 12}}>
                    <div className={styles["label-info"]} />
                  </Tooltip>
                </div>
                <Form.Item>
                  {getFieldDecorator('name', {
                    initialValue: this.state.name,
                    rules: [
                      { required: true, message: intl.get("MESSAGE_register_name_error1") },
                      { min: 5, message: intl.get("MESSAGE_register_name_error2") },
                      { max: 16, message: intl.get("MESSAGE_register_name_error2") },
                      { pattern: /^[a-z0-9]+$/, message: intl.get("MESSAGE_register_name_error3") },
                      {
                        validator: (rule, value, callback) => {
                          const data = {
                            field: "name",
                            value
                          };
                          if (!value) {
                            callback();
                            return false;
                          }
                          // clearTimeout(this.timer);
                          // this.timer = setTimeout(() => {
                          UserRequest.checkUnique(data).then(() => {
                            callback();
                          }).catch(() => {
                            callback(intl.get("MESSAGE_register_name_error4"));
                          });
                          // }, 300);
                        }
                      }
                    ],
                  })(
                    <Field type="text" placeholder={intl.get("REGISTER_PLACEHOLDER_USERNAME")}
                           onChange={(val) => {this.setState({name: val})}} />
                  )}
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_PASSWORD")}:</div>
                  <Tooltip placement="right" title={intl.get("MESSAGE_PASSWORD_TIP")} overlayStyle={{fontSize: 12}}>
                    <div className={styles["label-info"]} />
                  </Tooltip>
                </div>
                <Form.Item>
                  {getFieldDecorator('password', {
                    initialValue: this.state.password,
                    rules: [
                      { required: true, message: intl.get("MESSAGE_register_password_error1") },
                      { min: 6, message: intl.get("MESSAGE_register_password_error2") },
                      { max: 20, message: intl.get("MESSAGE_register_password_error3") }
                    ],
                  })(
                    <Field type="password" placeholder={intl.get("REGISTER_PLACEHOLDER_PASSWORD")}
                           onChange={(val) => {this.setState({password: val})}} />
                  )}
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_CONFIRM")}:</div>
                </div>
                <Form.Item>
                  {getFieldDecorator('password_confirmation', {
                    initialValue: this.state.password_confirmation,
                    rules: [
                      { required: true, message: intl.get("MESSAGE_register_confirm_required") },
                      {
                        validator: (rule, value, callback) => {
                          if (value !== this.state.password) {
                            callback(intl.get("MESSAGE_register_confirm_pwd_error"));
                          } else {
                            callback();
                          }
                        }
                      }
                    ],
                  })(
                    <Field type="password" placeholder={intl.get("REGISTER_PLACEHOLDER_CONFIRM")}
                           onChange={(val) => {this.setState({password_confirmation: val})}} />
                  )}
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_FULLNAME")}:</div>
                  <Tooltip placement="right" title={intl.get("MESSAGE_FULLNAME_TIP")} overlayStyle={{fontSize: 12}}>
                    <div className={styles["label-info"]} />
                  </Tooltip>
                </div>
                <Form.Item>
                  {getFieldDecorator('full_name', {
                    initialValue: this.state.full_name,
                    rules: [
                      { required: true, message: intl.get("MESSAGE_register_fullname_error") },
                      {
                          validator: (rule, value, callback) => {
                              var tag = true
                              for(var i = 0;i<value.length; i++){
                                  var temp = value[i].charCodeAt();
                                  if(temp>=48 &&temp<=57){
                                      tag = false
                                  }
                              }
                              if (!tag) {
                                  callback(intl.get("MESSAGE_register_fullname_error_number"));
                              } else {
                                  callback();
                              }
                          }
                      }
                    ],
                  })(
                    <Field type="text" placeholder={intl.get("REGISTER_PLACEHOLDER_FULLNAME")}
                           onChange={(val) => {this.setState({full_name: val})}} />
                  )}
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_CURRENCY")}:</div>
                </div>
                <Form.Item>
                  <Select defaultValue={this.state.currency} className={styles.ft16}
                          onChange={val => {
                            this.setState({
                              currency: val
                            });
                          }}
                          suffixIcon={<Icon type="caret-down" />}>
                    {
                      currencyOpts.map((item, index) => {
                        return <Option value={item.code} key={`item${index}`}>{item.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </div>
              <div className={styles["form-column"]}>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_MOBILE")}:</div>
                  <Tooltip placement="right" title={intl.get("MESSAGE_MOBILE_TIP")} overlayStyle={{fontSize: 12}}>
                    <div className={styles["label-info"]} />
                  </Tooltip>
                </div>
                <Form.Item>
                  <div className={styles["field-wrap"]}>
                    <Select defaultValue={country_code}
                            suffixIcon={<Icon type="caret-down" />}
                            className={styles.select}
                            onChange={val => {
                              this.setState({
                                country_code: val
                              });
                            }}
                    >
                      {
                        countryOpts.map((item, index) => <Option value={item.key} key={`opt${index}`}>{item.value}</Option>)
                      }
                    </Select>
                    {getFieldDecorator('phone', {
                      initialValue: this.state.phone,
                      rules: [
                        { required: true, message: intl.get("MESSAGE_register_phone_error1") },
                        { pattern: country_code === "+84" ? /^\d{9,10}$/ : /^[0-9]+$/ , message: country_code === "+84" ? intl.get("MESSAGE_register_name_error5") : intl.get("MESSAGE_register_phone_error2") },
                        {
                          validator: (rule, value, callback) => {
                            const data = {
                              field: "phone",
                              value
                            };
                            if (!value) {
                              callback();
                              return false;
                            }
                            // clearTimeout(this.timer);
                            // this.timer = setTimeout(() => {
                            UserRequest.checkUnique(data).then(() => {
                              callback();
                            }).catch(() => {
                              callback(intl.get("MESSAGE_register_phone_error3"));
                            });
                            // }, 300);
                          }
                        }
                      ],
                    })(
                      <Field type="tel" placeholder={intl.get("REGISTER_PLACEHOLDER_MOBILE")} onChange={(val) => {this.setState({phone: val})}} />
                    )}
                  </div>
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_EMAIL")}:</div>
                </div>
                <Form.Item>
                  {getFieldDecorator('email', {
                    initialValue: this.state.email,
                    rules: [
                      { required: true, message: intl.get("MESSAGE_register_email_error2") },
                      { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: intl.get("MESSAGE_register_email_error") },
                      {
                        validator: (rule, value, callback) => {
                          const data = {
                            field: "email",
                            value
                          };
                          if (!value) {
                            callback();
                            return false;
                          }
                          // clearTimeout(this.timer);
                          // this.timer = setTimeout(() => {
                          UserRequest.checkUnique(data).then(() => {
                            callback();
                          }).catch(() => {
                            callback(intl.get("MESSAGE_register_email_error3"));
                          });
                          // }, 300);
                        }
                      }
                    ],
                  })(
                    <Field type="text" placeholder={intl.get("REGISTER_PLACEHOLDER_EMAIL")}
                           onChange={(val) => {this.setState({email: val})}} />
                  )}
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={`${styles["label-txt"]} ${styles.required}`}>{intl.get("REGISTER_LABEL_BIRTH")}:</div>
                  <Tooltip placement="right" title={intl.get("MESSAGE_BIRTH_TIP")} overlayStyle={{fontSize: 12}}>
                    <div className={styles["label-info"]} />
                  </Tooltip>
                </div>
                <Form.Item>
                  <div className={styles["field-wrap"]}>
                    <Select value={date}
                            suffixIcon={<Icon type="caret-down" />}
                            style={{flex: 1, marginRight: 10}}
                            onChange={val => {
                              this.setState({
                                date: val
                              });
                            }}>
                      {
                        dateOpts.map((item, index) => (
                          <Option key={`opt${index}`} value={item.key} disabled={item.disabled}>
                            {item.value}
                          </Option>
                        ))
                      }
                    </Select>
                    <Select value={month}
                            suffixIcon={<Icon type="caret-down" />}
                            style={{flex: 1, marginRight: 10}}
                            onChange={val => {
                              this.setState({
                                month: val
                              }, () => {
                                this.setDateOpts();
                              });
                            }}>
                      {
                        monthOpts.map((item, index) => (
                          <Option key={`opt${index}`} value={item.key} disabled={item.disabled}>
                            {item.value}
                          </Option>
                        ))
                      }
                    </Select>
                    <Select value={year}
                            suffixIcon={<Icon type="caret-down" />}
                            style={{flex: 1}}
                            onChange={val => {
                              this.setState({
                                year: val
                              }, () => {
                                this.setDateOpts();
                              });
                            }}>
                      {
                        yearOpts.map((item, index) => (
                          <Option key={`opt${index}`} value={item.key} disabled={item.disabled}>
                            {item.value}
                          </Option>
                        ))
                      }
                    </Select>
                  </div>
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={styles["label-txt"]}>{intl.get("REGISTER_LABEL_CODE")}:</div>
                </div>
                <Form.Item>
                  <Field type="text" onChange={() => {}} />
                </Form.Item>
                <div className={styles["form-label"]}>
                  <div className={styles["label-txt"]}>{intl.get("REGISTER_LABEL_AFFILIATE")}:</div>
                </div>
                <Form.Item>
                  <Field type="text" disabled={sessionStorage.getItem('affiliate_code')} value={this.state.affiliate_code} onChange={(val) => {this.setState({affiliate_code: val})}} />
                </Form.Item>
              </div>
            </div>
            <div className={styles["reg-action"]}>
              <div className={styles.terms}>
                {intl.getHTML("REGISTER_TIPS_1")} <Link to={`/${window.location.pathname.split("/")[1]}/help/terms`} className={styles["term-link"]}>{intl.get("REGISTER_TIPS_2")}</Link>
              </div>
              <Button type="primary" className={styles["reg-btn"]} loading={btnLoading}
                      onClick={this.handleSubmit}>{intl.get("BTN_REGISTER")}</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  }
}

const RegisterContainer = connect(state => ({
  ...state
}), actions)(RegisterPage);

export default Form.create()(RegisterContainer);
