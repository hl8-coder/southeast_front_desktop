import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import styles from "./content.module.scss";
import intl from "react-intl-universal";
import {Helmet} from "react-helmet";
import {Popover} from "antd";
import connect from "react-redux/es/connect/connect";
import actions from "../../store/actions";

class Contact extends Component {
  constructor(props) {
    super(props);
  }
  render() {
      const viberPop = <>
          <div className={styles["qr-title"]}>{intl.get("HELP_CONTACT_VIBER_TITLE")}</div>
          <div className={styles["qr-code"]} />
      </>;
      const currentLanKey = this.props.language.currentLanKey
      return <>
          <Helmet>
              <title>{intl.get('SEO_CONTACT_TITLE')}</title>
              <meta name="description" content={intl.get('SEO_CONTACT_DESCRIPTION')}/>
              <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help/contact`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
          </Helmet>
          <div className={styles.title}>{intl.get('HELP_CONTACT_TITLE_1')}</div>
          <div className={styles.paragraph}>
              <div className={styles.section}>
                  {intl.get('HELP_CONTACT_SECTION_1_1')}
              </div>
              <div className={styles.section + " " + styles.italics}>
                  {intl.get('HELP_CONTACT_SECTION_1_2_1')} <Link to={`/${window.location.pathname.split("/")[1]}/help/faqs`} className={styles["section-link"]}>{intl.get('HELP_CONTACT_SECTION_1_2_link')}</Link> {intl.get('HELP_CONTACT_SECTION_1_2_2')}
              </div>
          </div>
          <div className={styles["contact-title"]}>{intl.get('HELP_CONTACT_TITLE_2')}</div>
          {
              currentLanKey === 'en-US' &&
              <div className={styles["contacts"]}>
                  <div onClick={() => {
                      // window.open("https://direct.lc.chat/10670562/")
                      window.LC_API && window.LC_API.open_chat_window({source:'button'});
                  }} className={styles["contact-item"]}>
                      <div className={styles["icon-chat"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_1')}</div>
                      <div className={styles["contact-item-desc"]}>{intl.get('HELP_CONTACT_DESC_2_1')}</div>
                  </div>

                  <a href="mailto:hi8@hl8.com" className={styles["contact-item"]}>
                      <div className={styles["icon-mail"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_3')}</div>
                      <div className={styles["contact-item-desc"] + " " + styles["underline"]}>hi8@hl8.com</div>
                  </a>
              </div>
          }
          {
              currentLanKey === 'vi-VN' &&
              <div className={styles["contacts"]}>
                  <div onClick={() => {
                      window.LC_API && window.LC_API.open_chat_window({source:'button'});
                  }} className={styles["contact-item"]}>
                      <div className={styles["icon-chat"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_1')}</div>
                      <div className={styles["contact-item-desc"]}>{intl.get('HELP_CONTACT_DESC_2_1')}</div>
                  </div>

                  <a href="mailto:csvn@hl8viet.com" className={styles["contact-item"]}>
                      <div className={styles["icon-mail"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_3')}</div>
                      <div className={styles["contact-item-desc"] + " " + styles["underline"]}>csvn@hl8viet.com</div>
                  </a>
              </div>
          }
          {
              currentLanKey === 'th-TH' &&
              <div className={styles["contacts"]}>
                  <div onClick={() => {
                      // window.open("https://direct.lc.chat/9593185")
                      window.LC_API.open_chat_window({source:'button'});
                  }} className={styles["contact-item"]}>
                      <div className={styles["icon-chat"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_1')}</div>
                      <div className={styles["contact-item-desc"]}>{intl.get('HELP_CONTACT_DESC_2_1')}</div>
                  </div>
                  <a href="mailto:csthai@hl8.com" className={styles["contact-item"]}>
                      <div className={styles["icon-mail"]} />
                      <div className={styles["contact-item-name"]}>{intl.get('HELP_CONTACT_NAME_2_3')}</div>
                      <div className={styles["contact-item-desc"] + " " + styles["underline"]}>csthai@hl8.com</div>
                  </a>
              </div>
          }
          {
              currentLanKey !== 'en-US' &&
              <div className={styles["contact-title"]}>{intl.get('HELP_CONTACT_TITLE_3')}</div>
          }

          {
              currentLanKey === 'vi-VN' &&
              <div className={styles["contacts"]}>
                  <a href="https://zalo.me/00639065578817" target="_blank" rel="noreferrer noopener" className={styles["contact-item"]}>
                      <div className={styles["icon-zalo"]} />
                      <div className={styles["contact-item-name"]}>{intl.get("HELP_CONTACT_NAME_3_1")}</div>
                      <div className={styles["contact-item-desc"]}>+63 9065578817</div>
                  </a>
                  <a href="http://bit.ly/HL8FB" target="_blank" rel="noreferrer noopener" className={styles["contact-item"]}>
                      <div className={styles["icon-fb"]} />
                      <div className={styles["contact-item-name"]}>Facebook Messenger</div>
                      <div className={styles["contact-item-desc"]}>m.me/dudoanthethao</div>
                  </a>
                  <Popover placement="bottom" content={viberPop} trigger="click" overlayClassName={styles["popover"]}>
                      <div className={styles["contact-item"]}>
                          <div className={styles["icon-viber"]} />
                          <div className={styles["contact-item-name"]}>{intl.get("HELP_CONTACT_NAME_3_3")}</div>
                          <div className={styles["contact-item-desc"]}>+63 9065578817</div>
                      </div>
                  </Popover>
                  <a href="skype:live:df34b4e07f60561a?chat" className={styles["contact-item"]}>
                      <div className={styles["icon-skype"]} />
                      <div className={styles["contact-item-name"]}>Skype</div>
                      <div className={styles["contact-item-desc"]}>VietCS HL8</div>
                  </a>
              </div>
          }
          {
              currentLanKey === 'th-TH' &&
              <div className={styles["contacts"]}>
                  <a href="https://line.me/R/ti/p/%40165qlfpj" target="_blank" rel="noreferrer noopener" className={styles["contact-item"]}>
                      <div className={styles["icon-line"]} />
                      <div className={styles["contact-item-name"]}>{intl.get("HELP_CONTACT_NAME_3_line")}</div>
                      <div className={styles["contact-item-desc"]}>@hl8th</div>
                  </a>
                  <a href="https://m.me/HL8THAI" target="_blank" rel="noreferrer noopener" className={styles["contact-item"]}>
                      <div className={styles["icon-fb"]} />
                      <div className={styles["contact-item-name"]}>Facebook Messenger</div>
                      <div className={styles["contact-item-desc"]}>HL8 Support</div>
                  </a>

              </div>
          }
      </>
  }

}
export default connect(state => ({
    ...state
}), actions)(withRouter(Contact));
