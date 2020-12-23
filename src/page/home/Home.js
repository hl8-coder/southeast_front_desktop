import React, {Component} from 'react';
import intl from "react-intl-universal";
import styles from './home.module.scss';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import NewsRequest from "../../request/News";
import actions from "../../store/actions";
import {Swiper} from "../../component/basic";
import Cookies from "universal-cookie";
import GameRequest from "../../request/Game";
class Home extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
    this.banner_type = 10;
    this.state = {
      bannerList: [],
      bottomList: [],
      popupModalBanner: '',
      popupModalCookie: 'popupModal',
      popupModalCookieDayExpire: 1,
      announcements: []
    };
  }

  componentDidMount() {
    this.getBanners();
    this.popupModalBanner();
    this.getAnnouncements();

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getBanners();
      this.popupModalBanner();
    }

  }
  handleGameClick = (id) => {
    if (this.props.user.token) {
      GameRequest.loginGame(id).then(res => {
        window.open(res.url, "_blank");
      });
    } else {
      GameRequest.tryGame(id).then(res => {
        window.open(res.url, "_blank");
      });
    }
  };
  popupModalBanner() {

    // -- Modal banner quick fix
    const {language} = this.props
    const bannerEN = 'https://bo.hl8vn.prodenv.net/static/uploads/images/202003/12/56_1583987386_HOl8E6C87r.png'
    const bannerVN = 'https://www.hl8vietnam.com/static/uploads/images/202003/12/56_1583986771_0UWfnUhFgz.png'
    let languageUse = language.defaultLanKey;

    if (language.currentLanKey !== undefined) {
      languageUse = language.currentLanKey
    }

    if (languageUse === "vi-VN"){
      let bannerSrc = bannerVN
      this.setState({
        popupModalBanner: bannerSrc
      })
    } else {
      let bannerSrc = bannerEN
      this.setState({
        popupModalBanner: bannerSrc
      })
    }
  }


  getBanners() {
    NewsRequest.getBanners({
      show_type: this.banner_type
    }).then(res => {
      const bannerList = res.data.filter(item => item.display_position === "banner");
      const bottomList = res.data.filter(item => item.display_position === "bottom");
      this.setState({
        bannerList,
        bottomList
      }, () => {
        // if (bannerList.length > 1)
        //   this.swiperRef.current.initSwiper();
      });
    });
  }

  getAnnouncements() {
      let datalist = this.props.user.token ? {is_login_pop_up: 1} : {}
      NewsRequest.getAnnouncements(datalist).then(res => {
          this.setState({
              announcements: res.data
          })


      });
  }

  closePopup() {
    const cookies = new Cookies();
    const {popupModalCookie, popupModalCookieDayExpire} = this.state;
    const cookie = new Cookies();
    const today = new Date();
    const expiredYear = today.getFullYear();
    const expiredMonthIndex = today.getMonth();
    const expiredDay = today.getDate() + popupModalCookieDayExpire;
    const expiredDate = new Date(expiredYear, expiredMonthIndex, expiredDay);
    cookies.set(popupModalCookie, 'y', {
      path: "/",
      expires: expiredDate
    })
    var modal = document.getElementById("popupModal");
    modal.style.display = "none";
  }

  render() {
    let _this = this
    // const cookies = new Cookies();
    const swiperConfigs = {
      effect : 'fade',
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      autoplay: {
        disableOnInteraction: false,
      },
      loop: true,
      on: {
        click (e) {
          e.stopPropagation();
          e.preventDefault();
          if (e.target.getAttribute('data-target_type') && e.target.getAttribute('data-target_type') == 4) {
            _this.handleGameClick(e.target.getAttribute('data-url'))
          }
        }
      }
    };
    const {bannerList, bottomList, announcements} = this.state;

    // let hasCookie = cookies.get(`${popupModalCookie}`);
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
          <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
      </Helmet>
      <div className={styles.home}>
        {
          !!bannerList.length && bannerList.length > 1  && <Swiper configs={swiperConfigs}>
            {
              bannerList.map((item, index) => {
                const hasLink = !!item.web_link_url;
                const isInnerLink = !item.web_link_url.startsWith('http');
                if (item.target_type === 4) {
                  return <div data-target_type={item.target_type} data-url={item.web_link_url} className="swiper-slide" key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} >
                  </div>;
                } else if (!hasLink) {
                  return <div className="swiper-slide" key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} />;
                } else {
                  if (isInnerLink) {
                    return <Link to={item.web_link_url} className="swiper-slide" key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} />;
                  } else {
                    return <a href={item.web_link_url} className="swiper-slide" key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} > </a>;
                  }
                }
              })
            }
          </Swiper>
        }
        {
          !!bannerList.length && bannerList.length === 1 && bannerList[0].target_type === 4 && <>
            {
              !!bannerList[0].web_link_url &&
              <div className="swiper-slide" onClick={() => {this.handleGameClick(bannerList[0].web_link_url)}} style={{backgroundImage: `url(${bannerList[0].web_img_path})`}}/>
            }
          </>
        }
        {
          !!bannerList.length && bannerList.length === 1 && bannerList[0].target_type !== 4 &&<>
            {
              !bannerList[0].web_link_url && <div className="swiper-slide" style={{backgroundImage: `url(${bannerList[0].web_img_path})`}} />
            }
            {
              !!bannerList[0].web_link_url && !!bannerList[0].web_link_url.startsWith('http') && <Link to={bannerList[0].web_link_url} className="swiper-slide" style={{backgroundImage: `url(${bannerList[0].web_img_path})`}} />
            }
            {
              !!bannerList[0].web_link_url && !bannerList[0].web_link_url.startsWith('http') && <a href={bannerList[0].web_link_url} className="swiper-slide" style={{backgroundImage: `url(${bannerList[0].web_img_path})`}}> </a>
            }
          </>
        }
        {
          !!announcements.length && <AnnouceBar data={announcements}/>
        }
        <div className={styles["features"]}>
          <div className={styles["features-wrap"] + " container"}>
            <div className={styles["feature-item"]}>
              <div className={`${styles["feature-icon"]} ${styles.icon1}`} />
              <div className={styles["feature-text"]}>{intl.get("HOME_FEATURE_1")}</div>
            </div>
            <div className={styles["feature-item"]}>
              <div className={`${styles["feature-icon"]} ${styles.icon2}`} />
              <div className={styles["feature-text"]}>{intl.get("HOME_FEATURE_2")}</div>
            </div>
            <div className={styles["feature-item"]}>
              <div className={`${styles["feature-icon"]} ${styles.icon3}`} />
              <div className={styles["feature-text"]}>{intl.get("HOME_FEATURE_3")}</div>
            </div>
          </div>
        </div>
        <div className={`${styles["cate-container"]} container`}>
          {
            bottomList.map((item, index) => {
              const hasLink = !!item.web_img_path;
              const isInnerLink = !item.web_img_path.startsWith('http');
              if (!hasLink) {
                return <div key={`item${index}`}>
                  <div className={styles["category-img"]} style={{ backgroundImage: `url(${item.web_img_path})`}} />
                  <h2 className={styles["category-title"]}>{item.title}</h2>
                </div>;
              } else {
                if (isInnerLink) {
                  return <Link to={item.web_link_url} key={`item${index}`}>
                    <div className={styles["category-img"]} style={{ backgroundImage: `url(${item.web_img_path})`}} />
                    <h2 className={styles["category-title"]}>{item.title}</h2>
                  </Link>;
                } else {
                  return <a href={item.web_link_url} key={`item${index}`}>
                    <div className={styles["category-img"]} style={{ backgroundImage: `url(${item.web_img_path})`}} />
                    <h2 className={styles["category-title"]}>{item.title}</h2>
                  </a>;
                }
              }
            })
          }
        </div>
      </div>

      {/*{*/}
        {/*!! !hasCookie && <>*/}
        {/*<div className={styles.modal} id="popupModal" onClick={()=> this.closePopup()} >*/}
          {/*<div className={styles.modalcontent}>*/}
          {/*<span>*/}
            {/*<a href="/slots"><img src={popupModalBanner} alt=""/></a>*/}
            {/*</span>*/}
          {/*</div>*/}
        {/*</div>*/}
        {/*</>*/}
      {/*}*/}

    </>
  }
}

export default connect(state => ({
  ...state
}), actions)(Home);

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.speed = 20;
    this.scrollWrap = React.createRef();
    this.scrollList1 = React.createRef();
    this.scrollList2 = React.createRef();
  }

  componentDidMount() {
    this.scrollLeft();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      clearInterval(this.timer);
      this.scrollLeft();
    }
  }

  scrollLeft() {
    this.scrollList2.current.innerHTML = this.scrollList1.current.innerHTML;
    this.announceScroll();
    this.timer = setInterval(() => {this.announceScroll()}, this.speed);
    this.scrollWrap.current.onmouseover = () => {clearInterval(this.timer)};
    this.scrollWrap.current.onmouseout = () => {this.timer = setInterval(() => {this.announceScroll()}, this.speed)};
  }

  announceScroll() {
    if (this.scrollWrap.current.scrollLeft === this.scrollList2.current.offsetWidth) {
      this.scrollWrap.current.scrollLeft = 0;
    } else {
      this.scrollWrap.current.scrollLeft ++;
    }
  }

  render() {
    const {data} = this.props;
    return <div className={styles["announcements"]}>
      <div className={`${styles["announce-wrap"]} container`}>
        <div className={styles.content} ref={this.scrollWrap} onClick={() => this.props.switchModal(true)}>
          <div className={styles.wrap}>
            <ul ref={this.scrollList1}>
              {
                data.map((item, index) => <li key={`item${index}`}>{item.content}</li>)
              }
            </ul>
            <ul ref={this.scrollList2}/>
          </div>
        </div>
      </div>
    </div>
  }
}

const AnnouceBar = connect(state => ({
  ...state
}), actions)(Announcements);
