import React, {Component} from "react";
import intl from "react-intl-universal";
import PaymentPlatformRequest from "../../../request/PaymentPlatform";
import DepositRequest from "../../../request/Deposit";
import styles from "./content.module.scss";
import Field from "../../../component/basic/field/Field";
import Utils from "../../../util/Utils";
import {Button, Modal, Select} from "../../../component/basic";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import actions from "../../../store/actions";
import UserRequest from "../../../request/User";
import {Icon} from "antd";
const { Option } = Select;

class TrueWallet extends Component {
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
            min_deposit: "",
            max_deposit: "",
            related_name: "",
            related_no: "",
            mpay_number: "",
            payment_type: null,
            payment_platform_id: null,
            amount: 0,
            user_mpay_number: null,
            mpay_trading_code: null,
            user_mpay_numbers: []
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

    getPaymentPlatform () {
        const params = this.props.match.params;
        PaymentPlatformRequest.getPaymentPlatforms({
            "filter[id]": params.id,
            "filter[payment_type]": params.type
        }).then(res => {
            let { data } = res;
            this.setState({
                name: data[0].name,
                cardInfo: data[0],
                payment_type: data[0].payment_type,
                payment_platform_id: data[0].id,
                min_deposit: data[0].min_deposit,
                max_deposit: data[0].max_deposit,
                related_name: data[0].related_name || "",
                related_no: data[0].related_no || "",
                mpay_number: data[0].user_mpay_numbers ? `${data[0].user_mpay_numbers[0].country_code}-${data[0].user_mpay_numbers[0].number}` : "",
                user_mpay_numbers:  data[0].user_mpay_numbers ? data[0].user_mpay_numbers : []
            })
        });
    }

    handleSubmit() {
        const data = {
            payment_type: this.state.payment_type,
            payment_platform_id: this.state.payment_platform_id,
            amount: this.state.amount,
            user_mpay_number: this.state.mpay_number,
            mpay_trading_code: this.state.mpay_trading_code
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
    }

    render() {
        return <>
            <div className={styles["panel-content"]}>
                <div className={styles["content-header"]}>
                    <div className={styles.title + " " + styles.flex5}>{this.state.name}</div>
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
                        <div className={styles.label}>1. {intl.get("MPAY_LABEL_AMOUNT")} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            <Field type="number" placeholder={intl.get("MPAY_PLACEHOLDER_AMOUNT")} className={styles["form-elm"]} onChange={val => this.setState({amount: val})} />
                        </div>
                        <div className={styles.unit}>{this.state.currencyUnit} {this.state.currency}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>2. {intl.get("MPAY_LABEL_ACCOUNT_NAME")} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            <Field className={styles["form-elm"]} value={this.state.related_name} disabled />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>3. {intl.get("MPAY_LABEL_PHONE_NUMBER")} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            <Field className={styles["form-elm"]} value={this.state.related_no} disabled />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>4. {intl.get("MPAY_LABEL_METHOD")} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            {
                                this.state.cardInfo && <div className={styles["card-wrap"]}>
                                    <div className={styles["card-item"]} style={{backgroundImage: `url(${this.state.cardInfo.image_path})`}}>
                                        {intl.get("MPAY_CARD_TIP")}
                                    </div>
                                    <div className={styles["card-text"]}>{this.state.cardInfo.name}</div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.row + " " + styles["with-link"] + " " + styles.multi}>
                        <div className={styles.label}>5. {intl.get("MPAY_LABEL_NUMBER", {type: this.state.name})} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            <Select value={this.state.mpay_number} suffixIcon={<Icon type="caret-down" />} onChange={val => {this.setState({mpay_number: val})}}>
                                {
                                    this.state.user_mpay_numbers.map((item, index) => <Option value={`${item.country_code}-${item.number}`} key={"otp" + index}>{`${item.country_code}-${item.number}`}</Option>)
                                }
                            </Select>
                            {/*<Field className={styles["form-elm"]} value={this.state.mpay_number} disabled />*/}
                            <Link to={`/${window.location.pathname.split("/")[1]}/user/details`}><div className={styles.link}>{intl.get("LINK_MANAGE_MPAY")}</div></Link>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>6. {intl.get("MPAY_LABEL_CODE")} <span className={styles.hl}>*</span></div>
                        <div className={styles["form-elm"]}>
                            <Field type="number" placeholder={intl.get("MPAY_PLACEHOLDER_CODE")} className={styles["form-elm"]} onChange={val => this.setState({mpay_trading_code: val})} />
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
        </>
    }
}

export default connect(state => ({
    ...state
}), actions)(TrueWallet);
