import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/th';
import LiveChat from 'react-livechat'
import './App.css';
import intl from "react-intl-universal";
import {connect} from "react-redux";
import {ConfigProvider} from "antd";
import Utils from './util/Utils';
import actions from "./store/actions";
import "moment/locale/vi";
import UserRequest from "./request/User";
import enUS from "antd/lib/locale-provider/en_US";
import viVN from "antd/lib/locale-provider/vi_VN";
import thTH from "antd/lib/locale-provider/th_TH";
import en from "./locales/en-US";
import vn from "./locales/vi-VN";
import th from "./locales/th-TH";
import AppRouter from "./AppRouter";
import {Helmet} from "react-helmet";
import AuthRequest from "./request/Authorization";
import {EventEmitter2} from "eventemitter2";
const emitter = new EventEmitter2();

window.EventBus = emitter;
const antLocales = {
  "en-US": enUS,
  "vi-VN": viVN,
  "th-TH": thTH
};

const localLocales = {
  "en-US": en,
  "vi-VN": vn,
  "th-TH": th,
};

class App extends Component {
  state = {
    initDone: false
  };
  banlanceInterval = null
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.getTokenFromCode();
    this.setLocale();
    this.accessLogs();

  }
  judgeLanguage () {
    let language = window.location.pathname.split("/")[1]
    if (language === 'en') {
      this.props.selectLan('en-US')
    } else if (language === 'vn') {
      this.props.selectLan('vi-VN')
    } else if (language === 'th') {
      this.props.selectLan('th-TH')
    } else {
      this.props.selectLan('en-US')
    }
  }
  returnLanguage() {
    let language = window.location.pathname.split("/")[1]
    return Utils.returnLanguageLong(language)
  }
  refresh () {

  }
  componentWillUnmount () {
    clearInterval(this.banlanceInterval)
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    const {token} = this.props.user;
    if (prevLanKey !== thisLanKey) {
      this.loadLocales(thisLanKey);
      if (token) {
        this.getUserInfo();
      }
    }
  }

  getTokenFromCode() {
    const code = Utils.getQueryString('t_code');
    if (code) {
      AuthRequest.getTokenByCode(code).then(res => {
        this.props.saveUserToken(res.access_token);
        this.getUserInfo()
      })
    }
  }

  setLocale() {
    const {currentLanKey, defaultLanKey} = this.props.language;
    if (currentLanKey === 'th-TH') {
      moment.locale('th');
    }
    if(window.location.pathname === '/' && !currentLanKey) {
      this.setLocaleFromIPAddress();
      return
    }
    if(window.location.pathname === '/' && currentLanKey) {
      this.setDefaultLanguage(currentLanKey);
      return
    }
    if (this.returnLanguage() === currentLanKey) {
      this.loadLocales(currentLanKey);
    } else {
      this.props.selectLan(this.returnLanguage())
    }
  }
  setDefaultLanguage(currentLanKey) {
    if (currentLanKey === 'vi-VN') {
      window.location.href= window.location.protocol + "//" + window.location.host + '/vn'
    }else if (currentLanKey === 'en-US') {
      window.location.href= window.location.protocol + "//" + window.location.host + '/en'
    }else {
      window.location.href= window.location.protocol + "//" + window.location.host + '/th'
    }
  }
  setLocaleFromIPAddress(defaultLanKey) {
    UserRequest.getLanguage().then(res => {
      let currentKey = res.language;
      // const languageList = this.props.language.languageList;
      // const filteredLan = languageList.filter(item => item.key === currentKey);
      // currentKey = !!filteredLan.length ? filteredLan[0].key : defaultLanKey;
      if (currentKey === 'vi-VN') {
        window.location.href= window.location.protocol + "//" + window.location.host + '/vn'
      }else if (currentKey === 'en-US') {
        window.location.href= window.location.protocol + "//" + window.location.host + '/en'
      }else {
        window.location.href= window.location.protocol + "//" + window.location.host + '/th'
      }
    })
  }

  // 判断是否有 tracking_id 和affiliate_code ac
  accessLogs() {
    if ( Utils.getQueryString('affiliate_code') && Utils.getQueryString('affiliate_id') ) {
      sessionStorage.setItem('affiliate_code', Utils.getQueryString('affiliate_code'));
      let dataList = {
        affiliate_code: Utils.getQueryString('affiliate_code'),
        tracking_id: Utils.getQueryString('tracking_id'),
        affiliate_id: Utils.getQueryString('affiliate_id'),
        url: document.referrer.split('?')[0]
      };
      UserRequest.accessLogs(dataList);
    }
    if(Utils.getQueryString('ac')) {
        sessionStorage.setItem('affiliate_code', Utils.getQueryString('ac'))
        window.location.href = window.location.protocol + '//' + window.location.host + '/reg?affiliate_code=' + Utils.getQueryString('ac')
        // this.props.history.push('reg')
    }
  }

  getUserInfo() {
    UserRequest.getUserInfo().then(res => {
      this.props.saveUserInfo(res);
    });
  }
  getUserBalance = () => {
      UserRequest.getUserBalance().then(res => {
          const {userInfo} = this.props.user;
          userInfo.account.available_balance = res.available_balance;
          userInfo.account.total_point_balance = res.total_point_balance;
          this.props.saveUserInfo(userInfo);
      });
  };
  loadLocales = localeKey => {
    intl.init({
      currentLocale: localeKey,
      locales: localLocales
    }).then(() => {
      this.setState({initDone: true});
    });
  };

  render() {
    return <>
      <Helmet>
        <title>{intl.get('SEO_APP_TITLE')}</title>
        <meta property="og:title" content={intl.get('SEO_APP_TITLE')} />
        <meta name="twitter:title" content={intl.get('SEO_APP_TITLE')} />
        <meta name="description" content={intl.get('SEO_APP_DESCRIPTION')} />
        <meta property="og:description" content={intl.get('SEO_APP_DESCRIPTION')} />
        <meta name="twitter:description" content={intl.get('SEO_APP_DESCRIPTION')} />
        <meta name="keywords" content={intl.get('SEO_APP_KEYWORDS')} />
        <meta property="og:locale" content={intl.get('SEO_APP_LANGUAGE')} />
        <meta property="og:type" content="blog" />
        <meta property="og:site_name" content={intl.get('SEO_APP_TITLE')} />
        <link rel="alternate" href={`https://www.hl8vietnam.com/${window.location.pathname.split("/")[1]}`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />

        {/* Global site tag (gtag.js) - Google Analytics  */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${intl.get('SEO_GACODE')}`}></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', "${intl.get('SEO_GACODE')}");
          `}
        </script>

      </Helmet>
        {
            this.props.language.currentLanKey === 'en-US' &&
            <LiveChat license={10670562} />
        }
        {
            this.props.language.currentLanKey === 'vi-VN' &&
            <LiveChat license={10670562} group={2} />
        }
        {
            this.props.language.currentLanKey === 'th-TH' &&
            <LiveChat license={9593185} />
        }
      {/*<LiveChat*/}
          {/*license={this.props.language.currentLanKey === 'th-TH'? 9593185 : 10670562}*/}
          {/*group={this.props.language.currentLanKey === 'th-TH'? 1 : this.props.language.currentLanKey === 'en-US'? 1 : 2}*/}
      {/*/>*/}

      {/*<div className="app-weihu">*/}
          {/*<OnlineService></OnlineService>*/}
      {/*</div>*/}
      {
        
      }
      {
        this.state.initDone && <ConfigProvider locale={antLocales[this.props.language.currentLanKey]}>
          <AppRouter/>

        </ConfigProvider>
      }
    </>
  }
}

export default connect(state => ({
  ...state
}), actions)(App);
