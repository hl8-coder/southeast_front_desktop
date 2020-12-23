import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./onlineService.module.scss";
import Cookies from "universal-cookie";
import connect from "react-redux/es/connect/connect";
import actions from "../../../store/actions";
import {withRouter} from "react-router-dom";
import {Popover} from "antd";

class OnlineService extends Component {
  state = {
    open: false
  };
  constructor(props) {
    super(props);
  }
  handleDirectToMobile = () => {
    const domain = document.domain.replace("www.", ".");
    const cookies = new Cookies();
    cookies.set("2S_DEVICE", "2", { path: "/", domain });
    window.location.reload();
  };

  render() {
    const {open} = this.state;
    const currentLanKey = this.props.language.currentLanKey
  const viberPop = <>
      <div className={styles["qr-title"]}>{intl.get("HELP_CONTACT_VIBER_TITLE")}</div>
      <div className={styles["qr-code"]} />
  </>;
    return (
        currentLanKey !== 'th-TH' &&
        <div className={styles["online-service"]}>
            <div>
                <div className={`${styles["service-item"]} ${styles.contact}`} onClick={() => this.setState({open: !open})}>
                    <span className={styles.text}>{intl.get("ONLINE_SERVICE_CONTACT").toUpperCase()}</span>
                </div>
                {/*<div className={`${styles["service-item"]} ${styles.mobile} ${open ? styles.off : ""}`} onClick={() => this.handleDirectToMobile()}>
                    <span className={styles.text}>{intl.get("ONLINE_SERVICE_MOBILE").toUpperCase()}</span>
                </div>*/}
            </div>
            {/*<div className={`${styles["service-list"]} ${open ? styles.on : ""}`}>*/}
                {/*<div rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.live}`} onClick={() => {*/}
                    {/*window.LC_API && window.LC_API.open_chat_window({source:'button'});*/}
                {/*}}>{intl.get("ONLINE_SERVICE_LIVE_CHAT")}</div>*/}
                {/*<a href="tel:+84 786854643" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.phone}`}>+84 786854643</a>*/}
                {/*<a href="tel:+63 9065578817" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.phone}`}>+63 9065578817</a>*/}
                {/*<div className={`${styles["list-item"]} ${styles.zalo}`}>+63 9065578817</div>*/}
                {/*<div className={`${styles["list-item"]} ${styles.facebook}`}>dudoanthethao</div>*/}
                {/*<a href="mailto:csvn@hl8viet.com" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.email}`}>csvn@hl8viet.com</a>*/}
                {/*<div className={`${styles["list-item"]} ${styles.skype}`}>VietCS HL8</div>*/}
                {/*<div className={`${styles["list-item"]} ${styles.viber}`}>+63 9065578817</div>*/}
            {/*</div>*/}
            {
                currentLanKey === 'vi-VN' &&
                <div className={`${styles["service-list"]} ${open ? styles.on : ""}`}>
                    <div rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.live}`} onClick={() => {
                        window.LC_API && window.LC_API.open_chat_window({source:'button'});
                    }}>{intl.get("ONLINE_SERVICE_LIVE_CHAT")}</div>
                    <a href="tel:+84 786854643" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.phone}`}>+84 786854643</a>
                    <a href="tel:+63 9065578817" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.phone}`}>+63 9065578817</a>
                    <a href="https://zalo.me/00639065578817" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.zalo}`}>+63 9065578817</a>
                    <a href="http://bit.ly/HL8FB" target="_blank" rel="noreferrer noopener"  className={`${styles["list-item"]} ${styles.facebook}`}>dudoanthethao</a>
                    <a href="mailto:csvn@hl8viet.com" target="_blank" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.email}`}>csvn@hl8viet.com</a>
                    <a href="skype:live:df34b4e07f60561a?chat" rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.skype}`}>VietCS HL8</a>
                    <Popover placement="left" content={viberPop} trigger="click" overlayClassName={styles["popover"]}>
                        <div className={`${styles["list-item"]} ${styles.viber}`}>
                            <div className={styles["contact-item-desc"]}>+63 9065578817</div>
                        </div>
                    </Popover>
                </div>
            }
            {
                currentLanKey === 'en-US' &&
                <div className={`${styles["service-list"]} ${open ? styles.on : ""}`}>
                    <div rel="noreferrer noopener" className={`${styles["list-item"]} ${styles.live}`} onClick={() => {
                        window.LC_API && window.LC_API.open_chat_window({source:'button'});
                    }}>{intl.get("ONLINE_SERVICE_LIVE_CHAT")}</div>
                </div>
            }
        </div>
    )
  }
}
export default connect(state => ({
    ...state
}), actions)(withRouter(OnlineService));
