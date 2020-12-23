import React, {Component} from 'react';
import moment from "moment";
import {Helmet} from "react-helmet";
import intl from "react-intl-universal";
import {Icon} from "antd";
import {connect} from "react-redux";
import styles from './promotion.module.scss';
import BonusRequest from "../../request/Bonus";
import {Button, Modal, Select, Field} from "../../component/basic";
import Utils from "../../util/Utils";

const {Option} = Select;

class Promotion extends Component {
  state = {
    loading: true,
    selectedType: null,
    selectedDetails: null,
    detailsModal: false,
    applyModal: false,
    promoTypeList: [],
    promoList: [],
    promoId: "",
    promoCodes: [],
    promoCode: "",
    remark: "",
    days: "",
    hours: "",
    mins: ""
  };

  componentDidMount() {
    window.scrollToTnc = this.scrollToTnc;
    const promoId = this.props.match.params.id;
    if (promoId) {
      this.getPromoDetails(promoId);
    } else {
      this.getPromoType();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    const prevPromoId = prevProps.match.params.id;
    const thisPromoId = this.props.match.params.id;
    if (prevLanKey !== thisLanKey) {
      if (thisPromoId) {
        this.getPromoDetails(thisPromoId);
      } else {
        this.getPromoType();
      }
    }
    if (prevPromoId !== thisPromoId) {
      if (thisPromoId) {
        this.getPromoDetails(thisPromoId);
      } else {
        this.getPromoType();
      }
    }
  }

  getPromoType = type_code => {
    BonusRequest.getPromoType().then(res => {
      const typeList = res.data.filter(item => !!item.is_has_promotion);
      let selectedType;
      if (type_code) {
        selectedType = typeList.filter(item => item.code === type_code)[0] || typeList[0];
      } else {
        selectedType = typeList[0];
      }
      this.setState({
        selectedType,
        promoTypeList: typeList
      }, () => {
        this.getPromoList();
      })
    })
  };

  getPromoList = () => {
    const {selectedType} = this.state;
    this.setState({
      loading: true
    });
    const code = selectedType ? selectedType.code : null;
    BonusRequest.getPromoList(code).then(res => {
      this.setState({
        promoList: res.data,
        loading: false
      });
    });
  };

  handleMenuChange = item => {
    this.setState({
      selectedType: item
    }, () => {
      this.getPromoList();
    })
  };

  showDetails = promoId => {
    const id = this.props.match.params.id;
    if (promoId.toString() === id) {
      this.setState({
        detailsModal: true
      });
    } else {
      this.props.history.push(`/${window.location.pathname.split("/")[1]}/promos/${promoId}`);
    }
  };

  getPromoDetails = promoId => {
    BonusRequest.getPromoDetails(promoId).then(res => {
      const endDate = moment(res.display_end_at).diff(moment());
      if (endDate < 0) {
        this.setState({
          days: 0, hours: 0, mins: 0
        });
      } else {
        const leftSeconds = parseInt(endDate / 1000);
        const days = Math.floor(leftSeconds/ 60 / 60 / 24);
        const hours = Math.floor((leftSeconds - days * 24 * 60 * 60) / 3600);
        const mins = Math.floor((leftSeconds - days * 24 * 60 * 60 - hours * 3600) / 60);
        this.setState({
          days, hours, mins
        });
      }
      this.setState({
        selectedDetails: res,
        detailsModal: true
      });
      this.getPromoType(res.promotion_type_code);
    });
  };

  handleClaim = item => {
    const {user} = this.props;
    const isLoggedIn = !!user.token;
    if (isLoggedIn) {
      this.setState({
        detailsModal: false,
        applyModal: true,
        promoId: item.id,
        promoCodes: item.codes,
        promoCode: item.codes.length ===0 ? '' : item.codes[0].key,
        remark: ""
      });
    } else {
      this.props.history.push(`/${window.location.pathname.split("/")[1]}/reg`);
    }
  };

  handleClaimApply = () => {
    const {promoId, promoCode, remark} = this.state;
    if (!promoCode) {
      Modal.info({
        content: <>{intl.get("MESSAGE_BOUNS_CODE")}</>
      });
      return
    }
    let data = {
      code: promoCode,
      front_remark: remark
    };
    data = Utils.adaptParams(data);
    BonusRequest.applyBonus(promoId, data).then(() => {
      this.setState({
        applyModal: false,
        remark: ""
      });
      Modal.info({
        content: <>
          {intl.getHTML("PROMO_MODAL_SUCCESS_1")}<span className={styles.hl} onClick={() => {
          window.LC_API.open_chat_window({source:'button'});
        }}>{intl.get("PROMO_MODAL_SUCCESS_2")}</span>{intl.get("PROMO_MODAL_SUCCESS_3")}
        </>
      });
      this.getPromoList();
    });
  };
  handleClaimApply1 = () => {
    const {promoId, promoCode, remark} = this.state;
    let data = {
      code: promoCode,
      front_remark: remark
    };
    data = Utils.adaptParams(data);
    BonusRequest.applyBonus(promoId, data).then(() => {
      this.setState({
        applyModal: false,
        remark: ""
      });
      Modal.info({
        content: <>
          {intl.getHTML("PROMO_MODAL_SUCCESS_1")}<span className={styles.hl} onClick={() => {
          window.LC_API.open_chat_window({source:'button'});
        }}>{intl.get("PROMO_MODAL_SUCCESS_2")}</span>{intl.get("PROMO_MODAL_SUCCESS_3")}
        </>
      });
      this.getPromoList();
    });
  };
  scrollToTnc() {
    const element = document.getElementById("generaltnc");
    const position = element.getBoundingClientRect();
    Utils.scrollSmoothTo(position.top);
  }

  render() {
    const {loading, promoTypeList, promoList, selectedType, detailsModal, applyModal, selectedDetails, promoCodes, remark, days, hours, mins} = this.state;
    const {user} = this.props;
    const {userInfo} = user;
    const isLoggedIn = !!user.token;
    return <>
      <Helmet>
        <title>{intl.get('SEO_PROMOTION_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_PROMOTION_DESCRIPTION')}/>
        <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/promos`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
      </Helmet>
      <div className={styles["promo-classify"]}>
        <h2 className={`${styles["classify-container"]} container`}>
          {
            promoTypeList.map((item, index) => {
              const isCurrent = selectedType.id === item.id;
              return <div className={`${styles["classify-item"]} ${isCurrent ? styles.on : ""}`}
                          onClick={() => {this.handleMenuChange(item)}}
                          key={`item${index}`}>
                {item.title}
              </div>
            })
          }
        </h2>
      </div>
      {
        loading ?
          <div className={styles["promo-loading"]}>{intl.get("LOADING")}</div>
          :
          <div className={styles.promotion}>
            <div className={`${styles["promo-container"]} container`}>
              {
                promoList.map((item, index) => {
                  const isClaimed = item.is_claimed;
                  const isCanClaim = item.is_can_claim;
                  const isDisabled = isClaimed;
                  const claimBtnText = isLoggedIn ? (isClaimed ? intl.get("BTN_CLAIMED") : intl.get("BTN_CLAIMNOW")) : intl.get("BTN_JOINNOW");
                  return <div className={styles["promotion-item"]} key={`item${index}`}>
                    <div className={styles["item-img"]} style={{ backgroundImage: `url(${item.web_img_path})` }} />
                    <div className={styles["item-footer"]}>
                      <div>
                        <div className={styles["footer-title"]}>{item.title}</div>
                        <div className={styles["footer-desc"]}>{item.description}</div>
                      </div>
                      <div className={styles["btn-row"]}>
                        <Button onClick={() => this.showDetails(item.id)} className={styles["btn-default"]}>{intl.get("BTN_DETAILS").toUpperCase()}</Button>
                        {
                          isCanClaim && <Button type="primary" className={styles["btn-primary"]}
                                                disabled={isDisabled}
                                                onClick={() => this.handleClaim(item)}>
                            {claimBtnText}
                          </Button>
                        }
                      </div>
                    </div>
                  </div>
                })
              }
            </div>
            <div className={`${styles["promo-terms"]} container`} id="generaltnc">
              <div className={styles["terms-title"]}>{intl.get("PROMO_TERMS_TITLE")}</div>
              <ol className={styles["terms-list"]}>
                <li>{intl.get("PROMO_TERMS_LI_1")}</li>
                <li>{intl.get("PROMO_TERMS_LI_2")}</li>
                <li>{intl.get("PROMO_TERMS_LI_3")}</li>
                <li>{intl.get("PROMO_TERMS_LI_4")}</li>
                <li>{intl.get("PROMO_TERMS_LI_5")}</li>
                <li>{intl.get("PROMO_TERMS_LI_6")}</li>
                <li>{intl.get("PROMO_TERMS_LI_7")}</li>
                <li>{intl.get("PROMO_TERMS_LI_8")}</li>
              </ol>
            </div>
          </div>
      }
      {
        selectedDetails && <Modal visible={detailsModal} maskClose={true} width={960}
                               onCancel={() => this.setState({detailsModal: false})}>
          <div className={styles["term-banner"]}>
            <div className={styles["banner-img"]} style={{backgroundImage: `url(${selectedDetails.web_content_img_path})`}} />
            <div className={styles["banner-info"]}>
              <div className={styles.title}>{selectedDetails.title}</div>
              <div className={styles.desc}>{selectedDetails.description}</div>
              <div className={styles.control}>
                {
                  selectedDetails.display_end_at && <div className={styles.countdown}>
                    <span className={styles["countdown-label"]}>{intl.get("PROMO_TERMS_LABEL")}</span>
                    <span className={styles["countdown-wrap"]}>
                    <div className={styles.num}>{days}</div>
                    <div className={styles.unit}>{intl.get("PROMO_TERMS_DAYS")}</div>
                  </span>
                    <span className={styles["countdown-wrap"]}>
                    <div className={styles.num}>{hours}</div>
                    <div className={styles.unit}>{intl.get("PROMO_TERMS_HOURS")}</div>
                  </span>
                    <span className={styles["countdown-wrap"]}>
                    <div className={styles.num}>{mins}</div>
                    <div className={styles.unit}>{intl.get("PROMO_TERMS_MINS")}</div>
                  </span>
                  </div>
                }
                {
                  selectedDetails.is_can_claim && <Button type="info" className={styles["btn-primary"]}
                                                       disabled={selectedDetails.is_claimed}
                                                       onClick={() => this.handleClaim(selectedDetails)}>
                    {isLoggedIn ? (selectedDetails.is_claimed ? intl.get("BTN_CLAIMED") : intl.get("BTN_CLAIMNOW")) : intl.get("BTN_JOINNOW")}
                  </Button>
                }
              </div>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{
            __html: selectedDetails.content
          }} />
          <div className={styles["modal-control"]}>
            <div onClick={() => this.scrollToTnc()} className={styles["scroll-link"]}>{intl.get("PROMO_MODAL_SCROLL_TNC")}</div>
            {
              selectedDetails.is_can_claim && <Button type="info" className={styles["btn-primary"]}
                                                      disabled={selectedDetails.is_claimed}
                                                      onClick={() => this.handleClaim(selectedDetails)}>
                {isLoggedIn ? (selectedDetails.is_claimed ? intl.get("BTN_CLAIMED") : intl.get("BTN_CLAIMNOW")) : intl.get("BTN_JOINNOW")}
              </Button>
            }
          </div>
        </Modal>
      }
      <Modal visible={applyModal} maskClosable={false}
             title={intl.get("PROMO_CLASSIFY_MODAL_TITLE")}
             onCancel={() => this.setState({applyModal: false})}>
        <div className={styles["modal-info"]}>{intl.get("PROMO_LABEL_USERNAME")}: <span className={styles.hl}>{userInfo && userInfo.name}</span></div>
        {
          !!promoCodes.length && promoCodes.length === 1 &&
          <div className={styles["modal-info"]}>{intl.get("PROMO_LABEL_PROMOCODE")}: <span className={styles.hl}>{promoCodes[0].value}</span></div>
        }
        <div className={styles["modal-form"]}>
          {
            !!promoCodes.length && promoCodes.length > 1 &&
            <>
              <div className={styles["modal-form-title"]}>{intl.get("PROMO_APPLY_LABEL")}</div>
              <Select placeholder={intl.get("PROMO_APPLY_PLACEHOLDER")} suffixIcon={<Icon type="caret-down" />}
                      value={this.state.promoCode}
                      onChange={val => {this.setState({promoCode: val})}}
                      className={styles["modal-select"]}>
                {
                  promoCodes.map((item, index) => {
                    return <Option value={item.key} key={`item${index}`}>{item.value}</Option>
                  })
                }
              </Select>
            </>
          }
          {
            !!promoCodes.length && promoCodes.length === 1 &&
            <>
              <div className={styles["modal-form-title"]}>{intl.get("PROMO_LABEL_CODE")}:</div>
              <Field value={remark} onChange={val => this.setState({remark: val})} />
            </>
          }
        </div>
        <div className={styles["modal-btn-group"]}>
          <button className={styles["modal-cancel"]} onClick={() => {this.setState({applyModal: false})}}>{intl.get("BTN_CANCEL")}</button>
          {
            !!promoCodes.length && promoCodes.length > 1 &&
            <button className={styles["modal-confirm"]} onClick={this.handleClaimApply}>{intl.get("BTN_CLAIM")}</button>
          }
          {
            promoCodes.length <= 1 &&
            <button className={styles["modal-confirm"]} onClick={this.handleClaimApply1}>{intl.get("BTN_CLAIM")}</button>
          }

        </div>
        <div className={styles["modal-tip"]}>{intl.get("PROMO_MODAL_TIP")}</div>
      </Modal>
    </>
  }
}

export default connect(state => ({
  ...state
}))(Promotion);
