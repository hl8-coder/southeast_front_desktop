import React, {Component} from 'react';
import intl from "react-intl-universal";
import {Link, NavLink, withRouter} from "react-router-dom";
import styles from './footer.module.scss';
import connect from "react-redux/es/connect/connect";
import actions from "../../../store/actions";

class Footer extends Component {

  constructor(props) {
      super(props);
  }
  replaceHost (host) {
    if(host.indexOf('www')!= -1) {
      return host.replace(/www/, "aff")
    } else {
      return 'aff.' + host
    }
  }
  render() {
      const {userInfo} = this.props.user
      return <div className={styles.footer}>
          <div className={styles["link-container"] + " container"}>
              <div className={styles.links}>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help"} className={styles.link}>{intl.get("FOOTER_MENU_ABOUT")}</Link>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help/contact"} className={styles.link}>{intl.get("FOOTER_MENU_CONTACT")}</Link>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help/faqs"} className={styles.link}>{intl.get("FOOTER_MENU_FAQS")}</Link>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help/responsible"} className={styles.link}>{intl.get("FOOTER_MENU_RESPONSIBLE")}</Link>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help/terms"} className={styles.link}>{intl.get("FOOTER_MENU_TERMS")}</Link>
                  <Link to={"/" + window.location.pathname.split("/")[1] + "/help/banking"} className={styles.link}>{intl.get("FOOTER_MENU_BANKING")}</Link>
                  <a href={window.location.protocol + '//' + this.replaceHost(window.location.host)} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {intl.get("FOOTER_MENU_AFFILIATE")}
                  </a>
              </div>
              {
                  this.props.language.currentLanKey !== 'en-US' &&
                  <div className={styles.media}>
                      <div className={styles["media-txt"]}>{intl.get("FOOTER_MEDIA_TITLE")}</div>
                      <a href={this.props.language.currentLanKey === 'vi-VN' ? 'http://bit.ly/2Tg9Te6' : 'https://web.facebook.com/HL8THAI/'} target="_blank" rel='noreferrer noopener'>
                          <svg className={styles["logo-facebook"]} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                               xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                               viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }} xmlSpace="preserve">
                              <g>
                                  <path d="M500,53.6v392.9c0,29.6-24,53.6-53.6,53.6H293.2V330h64.5l12.3-80h-76.8v-52c0-21.9,10.7-43.2,45.1-43.2h34.9V86.7
                c0,0-31.7-5.4-62-5.4c-63.2,0-104.5,38.3-104.5,107.7v61h-70.3v80h70.3v170H53.6C24,500,0,476,0,446.4V53.6C0,24,24,0,53.6,0h392.9
                C476,0,500,24,500,53.6z"/>
                              </g>
                          </svg>
                      </a>
                      <a href={this.props.language.currentLanKey === 'vi-VN' ? "https://www.youtube.com/channel/UClHq2-A30PNxi5UjoBfPSRA/videos?view_as=subscriber" : "https://www.youtube.com/channel/UCpNj5M7lYsvqlwCQsLQoLmQ" } target="_blank" rel='noreferrer noopener'>
                          <svg className={styles["logo-youtube"]} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                               xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                               viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }} xmlSpace="preserve">
                              <g>
                                  <path d="M500,250.4c0,0,0,81.9-10.4,121.1c-5.8,21.7-22.7,38-44.2,43.8c-39,10.5-195.3,10.5-195.3,10.5s-156.4,0-195.3-10.5
                c-21.5-5.8-38.5-22.1-44.2-43.8C0,332.2,0,250.4,0,250.4s0-81.9,10.4-121.1c5.8-21.7,22.7-38.7,44.2-44.5
                C93.6,74.2,250,74.2,250,74.2s156.4,0,195.3,10.5c21.5,5.8,38.5,22.8,44.2,44.5C500,168.5,500,250.4,500,250.4z M329.5,250.4
                L198.9,176v148.7L329.5,250.4z"/>
                              </g>
                          </svg>
                      </a>
                      <a href={this.props.language.currentLanKey === 'vi-VN' ? "http://bit.ly/2M7KdzR" : "https://twitter.com/HL8thai"} target="_blank" rel='noreferrer noopener'>
                          <svg className={styles["logo-twitter"]} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                               xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                               viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }} xmlSpace="preserve">
                              <g>
                                  <path d="M449.1,161.4c0,135.6-103.2,291.8-291.8,291.8c-58.1,0-112.1-16.8-157.5-46c8.3,1,16.2,1.3,24.8,1.3
                c47.9,0,92.1-16.2,127.3-43.8c-45.1-1-82.9-30.5-95.9-71.1c6.4,1,12.7,1.6,19.4,1.6c9.2,0,18.4-1.3,27-3.5
                c-47-9.5-82.2-50.8-82.2-100.7v-1.3c13.7,7.6,29.5,12.4,46.4,13c-27.6-18.4-45.7-49.9-45.7-85.4c0-19.1,5.1-36.5,14-51.8
                c50.5,62.2,126.4,102.9,211.5,107.3c-1.6-7.6-2.5-15.6-2.5-23.5c0-56.5,45.7-102.6,102.6-102.6c29.5,0,56.2,12.4,74.9,32.4
                c23.2-4.4,45.4-13,65.1-24.8c-7.6,23.8-23.8,43.8-45.1,56.5c20.6-2.2,40.6-7.9,59.1-15.9c-14,20.3-31.4,38.4-51.4,53
                C449.1,152.5,449.1,157,449.1,161.4z"/>
                              </g>
                          </svg>
                      </a>
                      <a href={this.props.language.currentLanKey === 'vi-VN' ? "http://bit.ly/2YmJ6lo" : "https://www.instagram.com/hl8thai8/"} target="_blank" rel='noreferrer noopener'>
                          <svg className={styles["logo-ins"]} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                               xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                               viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }} xmlSpace="preserve">
                              <g>
                                  <path d="M498.4,353.1c-2,40.1-11.2,75.5-40.4,104.8c-29.2,29.3-64.7,38.5-104.8,40.4c-41.3,2.3-165,2.3-206.3,0
                c-40.1-2-75.4-11.2-104.8-40.4C12.8,428.6,3.7,393.1,1.8,353.1c-2.3-41.3-2.3-165,0-206.3c2-40.1,11-75.5,40.4-104.8
                C71.5,12.8,107,3.7,146.9,1.8c41.3-2.3,165-2.3,206.3,0c40.1,2,75.5,11.2,104.8,40.4c29.3,29.2,38.5,64.7,40.4,104.8
                C500.7,188.2,500.7,311.8,498.4,353.1z M455.1,250c0-36.4,3-114.5-10-147.4c-8.8-22-25.7-38.8-47.5-47.5
                c-32.8-12.9-111-10-147.4-10c-36.4,0-114.5-3-147.4,10c-22,8.8-38.8,25.7-47.5,47.5c-12.9,32.8-10,111-10,147.4
                c0,36.4-3,114.5,10,147.4c8.8,22,25.7,38.8,47.5,47.5c32.8,12.9,111,10,147.4,10c36.4,0,114.5,3,147.4-10
                c22-8.8,38.8-25.7,47.5-47.5C458.1,364.6,455.1,286.4,455.1,250z M378.3,250c0,71-57.2,128.2-128.2,128.2
                c-71,0-128.2-57.2-128.2-128.2c0-71,57.2-128.2,128.2-128.2C321.1,121.8,378.3,179,378.3,250z M333.5,250c0-46-37.4-83.3-83.3-83.3
                c-46,0-83.3,37.4-83.3,83.3c0,46,37.5,83.3,83.3,83.3C296,333.3,333.5,296,333.5,250z M383.5,146.5c-16.6,0-29.9-13.4-29.9-29.9
                s13.4-29.9,29.9-29.9c16.5,0,29.9,13.4,29.9,29.9C413.4,133.2,400.1,146.5,383.5,146.5z"/>
                              </g>
                          </svg>
                      </a>
                  </div>
              }

          </div>
          <div className={styles["sponsor"]}>
              <div className={styles["sponsor-inner"] + " container"}>
                  <div className={`${styles["logo"]} ${styles["logo-ibc"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-pinnacle"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-sbo"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-inplay"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-isoft"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-simple"]}`} />
              </div>
              <div className={styles["sponsor-inner"] + " container"}>
                  <div className={`${styles["logo"]} ${styles["logo-micro"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-gameplay"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-global"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-n2live"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-sa"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-ebet"]}`} />
              </div>
          </div>
          <div className={styles["payment"]}>
              <div className={styles["payment-logos"] + " container"}>
                  <div className={`${styles["logo"]} ${styles["logo-paytrust"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-help2pay"]}`} />
                  <div className={`${styles["logo"]} ${styles["logo-eziepay"]}`} />
                  {
                      this.props.language.currentLanKey === 'th-TH' &&
                      <>
                          <div className={`${styles["logo"]} ${styles["logo-tpay"]}`} />
                          <div className={`${styles["logo"]} ${styles["logo-trueWallet"]}`} />
                      </>
                  }
                  {
                      this.props.language.currentLanKey !== 'th-TH' &&
                    <>
                        <div className={`${styles["logo"]} ${styles["logo-zpay"]}`} />
                        <div className={`${styles["logo"]} ${styles["logo-mpay"]}`} />
                        <div className={`${styles["logo"]} ${styles["logo-congthe"]}`} />
                        <div className={`${styles["logo"]} ${styles["logo-1click"]}`} />
                        <div className={`${styles["logo"]} ${styles["logo-fgo"]}`} />
                    </>
                  }
              </div>
              <div className={styles["hl8-info"] + " container"}>
                  <div className={styles["info-column1"]}>
                      <div className={styles["info-title"]}>{intl.get("FOOTER_TITLE_1")}</div>
                      <div className={styles["info-desc"]}>{intl.get("FOOTER_DESC_1")}</div>
                  </div>
                  <div className={styles["info-column2"]}>
                      <div className={styles["info-title"]}>{intl.get("FOOTER_TITLE_2")}</div>
                      <div className={styles["info-desc"]}>{intl.get("FOOTER_DESC_2")}</div>
                  </div>
                  <div className={styles["info-column2"]}>
                      <div className={styles["info-title"]}>{intl.get("FOOTER_TITLE_3")}</div>
                      <div className={styles["info-desc"]}>{intl.get("FOOTER_DESC_3")}</div>
                      {/*<div className={`${styles["info-sub-title"]} ${styles.mt20}`}>{intl.get("FOOTER_SUB_TITLE_2")}</div>*/}
                      {/*<div className={styles["info-desc"]}>{intl.get("FOOTER_DESC_4")}</div>*/}
                  </div>
              </div>
          </div>
          <div className={styles["copyright"]}>
              <div className={styles.text}>{intl.get("FOOTER_COPYRIGHT")}</div>
              <div className={styles["logo-pagcor"]} />
              <div className={styles["logo-pagcor2"]} />
          </div>
      </div>
  }
}
export default connect(state => ({
    ...state
}), actions)(withRouter(Footer));
