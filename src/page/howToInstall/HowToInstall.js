import React, {Component} from "react";
import styles from "./howToInstall.module.scss";
import {connect} from "react-redux";
import intl from "react-intl-universal";
import hl8 from './HL8-logo.png';
import {Swiper} from "../../component/basic";
import down from './angle-down.png';
import AndroidPhone01 from './AndroidPhone1.png';
import AndroidPhone_th from './AndroidPhone1_th.png';
import AndroidPhone_vn from './AndroidPhone1_vn.png';
import AndroidPhone02 from './AndroidPhone2.png';
import AndroidPhone2_th from './AndroidPhone2_th.png';
import AndroidPhone2_vn from './AndroidPhone2_vn.png';
import AndroidPhone03 from './AndroidPhone3.png';
import AndroidPhone3_th from './AndroidPhone3_th.png';
import AndroidPhone3_vn from './AndroidPhone3_vn.png';
import AndroidPhone04 from './AndroidPhone4.png';
import AndroidPhone4_th from './AndroidPhone4_th.png';
import AndroidPhone4_vn from './AndroidPhone4_vn.png';
import AndroidPhone05 from './AndroidPhone5.png';
import AndroidPhone5_th from './AndroidPhone5_th.png';
import AndroidPhone5_vn from './AndroidPhone5_vn.png';

class HowToInstall extends Component {
    state = {
        platform: 'ios'
    }
    constructor(props) {
        super(props);
        this.swiperRef = React.createRef();
    }
    next () {
        console.log(this.refs.myswiper.next())
        // this.swiperRef.current.slideNext()
    }
    scroll () {
        window.scroll({top: document.body.clientHeight, left: 0, behavior: 'smooth'})
    }
    render() {
        const currentLanKey = this.props.language.currentLanKey
        const swiperConfigs = {
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            // },
        };
        return <div className={styles["how-to-install-contain"]}>
            <div className={styles["how-to-install-top"]}>
                <div className={styles["how-to-install-top-zhenti"]}>
                    <div className={styles["how-to-install-top-bottom"]}>
                        <div className={styles["how-to-install-top-contain"]}>
                            <img src={hl8} alt=""/>
                            <div>HL8 ANDROID</div>
                        </div>
                        {/*<div className={styles["how-to-install-top-contain"]}>*/}
                        {/*    <img src={hl8} alt=""/>*/}
                        {/*    <div>HL8 IOS</div>*/}
                        {/*</div>*/}
                    </div>
                    <div className={styles["how-to-install-below"]} >
                        {intl.get('HOW_TO_INSTALL_BELOW')}
                    </div>
                    <img onClick={() => this.scroll()} src={down} alt=""/>
                </div>

            </div>
            <div className={styles["how-to-install-step"]}>
                <div className={styles["how-to-install-step-button"]}>
                    <button>HL8 ANDROID</button>
                    {/*<button>HL8 IOS</button>*/}
                </div>
                <Swiper configs={swiperConfigs} ref="myswiper">
                    <div className="swiper-slide">
                        {
                            currentLanKey === 'en-US' &&
                            <img src={AndroidPhone01} alt=""/>
                        }
                        {
                            currentLanKey === 'vi-VN' &&
                            <img src={AndroidPhone_vn} alt=""/>
                        }
                        {
                            currentLanKey === 'th-TH' &&
                            <img src={AndroidPhone_th} alt=""/>
                        }

                        <div className={styles["how-to-install-font"]}>{intl.get('HOW_TO_INSTALL_STEP_1')}</div>
                        <button onClick={() => {this.next()}}>{intl.get('HOW_TO_INSTALL_BUTTON_NEXT')}</button>
                    </div>
                    <div className="swiper-slide">
                        {
                            currentLanKey === 'en-US' &&
                            <img src={AndroidPhone02} alt=""/>
                        }
                        {
                            currentLanKey === 'vi-VN' &&
                            <img src={AndroidPhone2_vn} alt=""/>
                        }
                        {
                            currentLanKey === 'th-TH' &&
                            <img src={AndroidPhone2_th} alt=""/>
                        }
                        <div className={styles["how-to-install-font"]}>{intl.get('HOW_TO_INSTALL_STEP_2')}</div>
                        <button onClick={() => {this.next()}}>{intl.get('HOW_TO_INSTALL_BUTTON_NEXT')}</button>
                    </div>
                    <div className="swiper-slide">
                        {
                            currentLanKey === 'en-US' &&
                            <img src={AndroidPhone03} alt=""/>
                        }
                        {
                            currentLanKey === 'vi-VN' &&
                            <img src={AndroidPhone3_vn} alt=""/>
                        }
                        {
                            currentLanKey === 'th-TH' &&
                            <img src={AndroidPhone3_th} alt=""/>
                        }
                        <div className={styles["how-to-install-font"]}>{intl.get('HOW_TO_INSTALL_STEP_3')}</div>
                        <button onClick={() => {this.next()}}>{intl.get('HOW_TO_INSTALL_BUTTON_NEXT')}</button>
                    </div>
                    <div className="swiper-slide">
                        {
                            currentLanKey === 'en-US' &&
                            <img src={AndroidPhone04} alt=""/>
                        }
                        {
                            currentLanKey === 'vi-VN' &&
                            <img src={AndroidPhone4_vn} alt=""/>
                        }
                        {
                            currentLanKey === 'th-TH' &&
                            <img src={AndroidPhone4_th} alt=""/>
                        }
                        <div className={styles["how-to-install-font"]}>{intl.get('HOW_TO_INSTALL_STEP_4')}</div>
                        <button onClick={() => {this.next()}}>{intl.get('HOW_TO_INSTALL_BUTTON_NEXT')}</button>
                    </div>
                    <div className="swiper-slide">
                        {
                            currentLanKey === 'en-US' &&
                            <img src={AndroidPhone05} alt=""/>
                        }
                        {
                            currentLanKey === 'vi-VN' &&
                            <img src={AndroidPhone5_vn} alt=""/>
                        }
                        {
                            currentLanKey === 'th-TH' &&
                            <img src={AndroidPhone5_th} alt=""/>
                        }
                        <div className={styles["how-to-install-font"]}>{intl.get('HOW_TO_INSTALL_STEP_5')}</div>
                        <button onClick={() => {this.next()}}>{intl.get('HOW_TO_INSTALL_BUTTON_NEXT')}</button>
                    </div>
                </Swiper>
            </div>
        </div>
    }
}

export default connect(state => ({
    ...state
}))(HowToInstall);