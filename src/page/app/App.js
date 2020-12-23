import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from "react-redux";
import styles from './app.module.scss';
import {Helmet} from "react-helmet";

import QRCode from 'qrcode.react';
import ios from './ios.png';
import android from './android.png';
import h5 from './h5.png';
import download_en from './download_en.png';
import download_vn from './download_vn.png';
import download_th from './download_th.png';

class App extends Component {

    state = {
    };

    componentDidMount() {

    }

    howToInstall(platform) {
        this.props.history.push({pathname: `/${window.location.pathname.split("/")[1]}/howToInstall`, state: {platform: platform}});
    }
    render() {
        const currentLanKey = this.props.language.currentLanKey
        console.log(currentLanKey)
        return <>
            <Helmet>
                <link href={window.location.href} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
            </Helmet>
            <div className={styles["app-contain"]}>
                <div className="container">
                    {
                        currentLanKey === 'en-US' &&
                        <img src={download_en} alt=""/>
                    }
                    {
                        currentLanKey === 'vi-VN' &&
                        <img src={download_vn} alt=""/>
                    }
                    {
                        currentLanKey === 'th-TH' &&
                        <img src={download_th} alt=""/>
                    }
                    <div className={styles["app-bottom"]}>
                        <div style={{opacity: .5}} className={styles["app-bottom-contain"]}>
                            <div className={styles["app-bottom-contain-top"]}>
                                <img src={ios} alt="ios"/>
                                {/*<div className={styles["app-bottom-contain-qr-code"]}>*/}
                                {/*    <QRCode*/}
                                {/*        value={'https://hl8download.com/vn/app/ipa'} //value参数为生成二维码的链接*/}
                                {/*        size={80} // 二维码的宽高尺寸*/}
                                {/*        fgColor="#000000" // 二维码的颜色*/}
                                {/*    />*/}
                                {/*</div>*/}
                            </div>
                            <div className={styles["app-bottom-contain-title"]}>{intl.get('APP_HL8_IOS')}</div>
                            <div className={styles["app-bottom-contain-p"]}>{intl.get('APP_IOS_P')}</div>
                            {/*<div className={styles["app-bottom-contain-download"]}*/}
                            {/*     onClick={() => {window.open('https://hl8download.com/vn/app/ipa')}}*/}
                            {/*>{intl.get('APP_DOWNLOAD_NOW')}</div>*/}
                            {/*<div className={styles["app-bottom-contain-how-to"]}>{intl.get('APP_HOW_TO_INSTALL')}</div>*/}
                        </div>
                        <div style={{margin: '0 20px'}} className={styles["app-bottom-contain"]}>
                            <div className={styles["app-bottom-contain-top"]}>
                                <img src={android} alt="ios"/>
                                <div className={styles["app-bottom-contain-qr-code"]}>
                                    <QRCode
                                        value={'https://s3-ap-southeast-1.amazonaws.com/hl8download.vn.app.apk/HL8.Android.apk'} //value参数为生成二维码的链接
                                        size={80} // 二维码的宽高尺寸
                                        fgColor="#000000" // 二维码的颜色
                                    />
                                </div>
                            </div>
                            <div className={styles["app-bottom-contain-title"]}>{intl.get('APP_HL8_ANDROID')}</div>
                            <div className={styles["app-bottom-contain-p"]}>{intl.get('APP_ANDROID_P')}</div>
                            <div className={styles["app-bottom-contain-download"]}
                                 onClick={() => {window.open('https://s3-ap-southeast-1.amazonaws.com/hl8download.vn.app.apk/HL8.Android.apk')}}
                            >{intl.get('APP_DOWNLOAD_NOW')}</div>
                            <div className={styles["app-bottom-contain-how-to"]}
                                 onClick={() => {this.howToInstall('android')}}
                            >{intl.get('APP_HOW_TO_INSTALL')}</div>
                        </div>
                        <div className={styles["app-bottom-contain"]}>
                            <div className={styles["app-bottom-contain-top"]}>
                                <img src={h5} alt="ios"/>
                                <div className={styles["app-bottom-contain-qr-code"]}>
                                    <QRCode
                                        value={'https://m.hl8viet.fun/'} //value参数为生成二维码的链接
                                        size={80} // 二维码的宽高尺寸
                                        fgColor="#000000" // 二维码的颜色
                                    />
                                </div>
                            </div>
                            <div className={styles["app-bottom-contain-title"]}>{intl.get('APP_HL8_H5')}</div>
                            <div className={styles["app-bottom-contain-p"]}>{intl.get('APP_H5_P')}</div>
                            <div className={styles["app-bottom-contain-download"]}
                                 onClick={() => {window.open('https://m.hl8viet.fun/')}}
                            >{intl.get('APP_MOBILE_SITE')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}

export default connect(state => ({
    ...state
}))(App);
