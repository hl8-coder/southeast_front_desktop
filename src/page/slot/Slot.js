import React, {Component} from "react";
import styles from "./slot.module.scss";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import GameRequest from "../../request/Game";
import {Button, Field, Swiper} from "../../component/basic";
import { CountUp } from "countup.js";
import {Helmet} from "react-helmet";
// import {Swiper} from "../../component/basic";
// import PromoJPG from './image/PromotionImage.jpg';
// import en_pic from './image/en_pic.jpg';
import NewsRequest from "../../request/News";
import {Link} from "react-router-dom";


class Slot extends Component {
  constructor(props) {
    super(props);
    this.game_type = 2;
    this.swiperRef = React.createRef();
    this.jackpot = React.createRef();
    this.state = {
      bannerList: [],
      product_code: props.match.params.code,
      vendorMenus: props.slot.vendors,
      category: 0,
      name: "",
      jackpot: "",
      games: [],
      isLoading: false,
      page: 1,
      per_page: 30,
      total_pages: 0
    };
  }

  componentDidMount() {
    this.getBanners();
    document.addEventListener("scroll", this.loadMore);
    this.getJackpot();
    this.getGames(true);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.loadMore)

  }

  getBanners() {
      NewsRequest.getBanners({
          show_type: 2
      }).then(res => {
          const bannerList = res.data.filter(item => item.display_position === "banner");
          this.setState({
              bannerList
          }, () => {
              // if (bannerList.length > 1)
              //     this.swiperRef.current.initSwiper();
          });
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevUrl = prevProps.match.url;
    const currUrl = this.props.match.url;
    if (prevUrl !== currUrl) {
      const product_code = this.props.match.params.code;
      this.setState({
        page: 1,
        product_code
      }, () => {
        this.getGames(true);
      });
    }
    // 语言切换
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getBanners();
      this.setState({
        page: 1,
      }, () => {
        this.getGames(true);
      });
    }
  }

  loadMore = () => {
    let {page, total_pages, isLoading} = this.state;
    const bodyHeight = document.body.scrollHeight;
    const viewHeight = document.documentElement.clientHeight;
    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0;
    const showBackTop = scrollTop > 0;
    this.setState({
      showBackTop: showBackTop
    });
    if ((viewHeight + scrollTop) > (bodyHeight - 400)
      && page < total_pages && !isLoading) { //(bodyHeight * 0.6) or (bodyHeight - 400)
      page = page + 1;
      this.setState({
        isLoading: true,
        page
      }, () => {
        this.getGames(false);
      });
    }
  };

  getJackpot = () => {
    GameRequest.getJackpot().then(res => {
      const countUp = new CountUp(this.jackpot.current, res.jackpot);
      countUp.start();
      this.setState({
        jackpot: res.jackpot
      });
    })
  };

  getGames = (resetGames) => {
    const {product_code, category, vendorMenus, name, games, page, per_page} = this.state;
    let data = {type: this.game_type};
    if (category === 1) {
      data = {...data, is_hot: 1};
    } else if (category === 2) {
      data = {...data, is_new: 1};
    }
    if (name) {
      data = {...data, name};
    }
    if (product_code) {
      data = {...data, product_code};
    } else {
      if (vendorMenus && !!vendorMenus.length) {
        data = {...data, product_code: vendorMenus[0].code};
        this.setState({
          product_code: vendorMenus[0].code
        });
      } else {
        data = {...data};
      }
    }
    data.page = resetGames ? 1 : page;
    data.per_page = per_page;
    GameRequest.getGames(data).then(res => {
      let result = resetGames ? res.data : games.concat(res.data);
      this.setState({
        isLoading: false,
        games: result,
        total_pages: res.meta.pagination.total_pages
      });
    });
  };

  handleVendorChange = item => {
    this.setState({
      page: 1,
      product_code: item.code
    }, () => {
      this.getGames(true);
    });
  };

  handleCategoryChange = category => {
    this.setState({
      page: 1,
      category
    }, () => {
      this.getGames(true);
    })
  };

  handleSearchInput = val => {
    this.setState({
      name: val
    }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getGames(true);
      }, 300);
    });
  };

  handleGameClick = (item, type) => {
    if (type === "login") {
      GameRequest.loginGame(item.id).then(res => {
        if (item.is_iframe) {
          window.open(`${window.location.origin}/${window.location.pathname.split("/")[1]}/game_play?url=${encodeURIComponent(res.url)}&code=${item.platform_code}`,  "_blank");
        } else {
          window.open(res.url, "_blank");
        }
      });
    } else {
      GameRequest.tryGame(item.id).then(res => {
        if (item.is_iframe) {
          window.open(`${window.location.origin}/${window.location.pathname.split("/")[1]}/game_play?url=${encodeURIComponent(res.url)}&code=${item.platform_code}`,  "_blank");
        } else {
          window.open(res.url, "_blank");
        }
      });
    }
  };
  handleGameClick1 = (id) => {
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
  render() {
    let _this = this
    const {vendorMenus, games, product_code, jackpot, bannerList} = this.state;
      const swiperConfigs = {
          effect : 'fade',
          pagination: {
              el: '.swiper-pagination',
              clickable: true
          },
          autoplay: {
              disableOnInteraction: false
          },
          loop: true,
          on: {
            click (e) {

              if (e.target.getAttribute('data-target_type') && e.target.getAttribute('data-target_type') == 4) {
                _this.handleGameClick1(e.target.getAttribute('data-url'))

              }
            }
          }
      };
    return <>
      <Helmet>
        <title>{intl.get('SEO_SLOT_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_SLOT_DESCRIPTION')} />
        <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/slots`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
      </Helmet>
      <div className={styles.slot}>
        <div className="container">
            {
                !!bannerList.length && bannerList.length > 1 && <Swiper configs={swiperConfigs}>
                    {
                        bannerList.map((item, index) => {
                            const hasLink = !!item.web_link_url;
                            const isInnerLink = !item.web_link_url.startsWith('http');
                            if (item.target_type === 4) {
                              return <div className="swiper-slide" data-target_type={item.target_type} data-url={item.web_link_url} key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} />;
                            } else if (!hasLink) {
                                return <div className={`swiper-slide ${styles["banner"]}`} key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} />;
                            } else {
                                if (isInnerLink) {
                                    return <Link to={item.web_link_url} className={`swiper-slide ${styles["banner"]}`} key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} />;
                                } else {
                                    return <a href={item.web_link_url} className={`swiper-slide ${styles["banner"]}`} key={`item${index}`} style={{backgroundImage: `url(${item.web_img_path})`}} > </a>;
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
                  <div className="swiper-slide" onClick={() => {this.handleGameClick1(bannerList[0].web_link_url)}} style={{backgroundImage: `url(${bannerList[0].web_img_path})`}}/>
                }
              </>
            }
            {
                !!bannerList.length && bannerList.length === 1 && bannerList[0].target_type !== 4 &&<>
                    {
                        !bannerList[0].web_link_url && <div className={`swiper-slide ${styles["banner"]}`} style={{backgroundImage: `url(${bannerList[0].web_img_path})`}} />
                    }
                    {
                        !!bannerList[0].web_link_url && !!bannerList[0].web_link_url.startsWith('http') && <Link to={bannerList[0].web_link_url} className={`swiper-slide ${styles["banner"]}`} style={{backgroundImage: `url(${bannerList[0].web_img_path})`}} />
                    }
                    {
                        !!bannerList[0].web_link_url && !bannerList[0].web_link_url.startsWith('http') && <a href={bannerList[0].web_link_url} className={`swiper-slide ${styles["banner"]}`} style={{backgroundImage: `url(${bannerList[0].web_img_path})`}}> </a>
                    }
                </>
            }
            {/*{*/}
                {/*this.props.language.currentLanKey === 'vi-VN' ?*/}
                {/*<a href="https://www.hl8viet.fun/promos/143" target="_blank"><img className={styles["banner"]} src={PromoJPG} /></a> :*/}
                {/*<a href="https://www.hl8viet.fun/promos/143" target="_blank"><img className={styles["banner"]} src={en_pic} /></a>*/}
            {/*}*/}

          <div className={styles["jackpot-banner"]}><span ref={this.jackpot}>{jackpot}</span>
            {
                this.props.language.currentLanKey === 'th-TH' ? " THB" : this.props.language.currentLanKey === 'vi-VN' ? " VND" : " USD"
            }
          </div>
          <div className={styles.games}>
            <div className={styles["games-vendor"]}>
              {
                vendorMenus && vendorMenus.map((item, index) => {
                  return <div className={`${styles["vendor-item"]} ${item.code === product_code ? styles.on : ""}`}
                              key={`item${index}`}
                              onClick={() => {this.handleVendorChange(item)}}>
                    <img className={styles["inline-block"]} src={item.icon}  alt=""/>
                    <span className={styles["inline-block"]}>{item.platform_name}</span>
                  </div>
                })
              }
              <Field type="search" size="small" className={styles["search-inp"]} useDrop={false}
                     placeholder={intl.get("SLOT_SEARCH_PLACEHOLDER")}
                     onChange={this.handleSearchInput} />
            </div>
            {/*<div className={styles["vendor-category"]}>*/}
              {/*<div className={`${styles["category-item"]} ${category === 0 ? styles.on : ""}`} onClick={() => this.handleCategoryChange(0)}>{intl.get("SLOT_CATEGORY_ALL").toUpperCase()}</div>*/}
              {/*<div className={`${styles["category-item"]} ${category === 1 ? styles.on : ""}`} onClick={() => this.handleCategoryChange(1)}>{intl.get("SLOT_CATEGORY_HOT").toUpperCase()}</div>*/}
              {/*<div className={`${styles["category-item"]} ${category === 2 ? styles.on : ""}`} onClick={() => this.handleCategoryChange(2)}>{intl.get("SLOT_CATEGORY_NEW").toUpperCase()}</div>*/}
            {/*</div>*/}
            <div className={styles["game-list"]}>
              {
                games.map((item, index) => {
                  return <div className={styles["list-item"]} key={`item${index}`}>
                    <div className={styles["item-image"]} style={{backgroundImage: `url(${item.web_img_path})`}}>
                        {
                          item.is_maintain ?
                          <div className={styles["list-control"]}>
                              <Button
                                  type="primary"
                                  className={styles["btn-maintenance"]}
                              >
                                {intl.get("BTN_MAINTENANCE")}
                              </Button>
                          </div> :
                          <div className={styles["list-control"]}>
                            <Button type="primary" className={styles["btn-play"]}
                                    onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_PLAYNOW")}</Button>
                            {
                              item.is_can_try && <span className={styles["try-link"]} onClick={() => this.handleGameClick(item, "try")}>
                                {intl.get("LINK_TRY_NOW").toUpperCase()}
                              </span>
                            }
                          </div>
                        }

                    </div>
                    <h2 className={styles["item-text"]}>{item.name}</h2>
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  }
}

export default connect(state => ({
  ...state
}))(Slot);
