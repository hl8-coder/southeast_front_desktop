import React, {Component} from 'react';
import intl from "react-intl-universal";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import styles from './sport.module.scss';
import bgImg from './image/shutterstock_1087094309.png';
import GameRequest from "../../request/Game";
import NewsRequest from "../../request/News";
import {Button} from "../../component/basic";
import {Helmet} from "react-helmet";

class Sport extends Component {
  game_type = 4;
  state = {
    bannerList: [],
    gameList: []
  };

  componentDidMount() {
    this.getBanner();
    this.getGames();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const thisLan = this.props.language;
    const thisUser = this.props.user;
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLanKey = thisLan.currentLanKey;
    const prevToken = prevProps.user.token;
    const thisToken = thisUser.token;
    if (prevToken !== thisToken || prevLanKey !== thisLanKey) {
      this.getBanner();
      this.getGames();
    }
  }

  getBanner () {
    NewsRequest.getBanners({
      show_type: this.game_type
    }).then(res => {
      this.setState({
        bannerList: res.data.filter((item, index) => index === 0)
      });
    });
  }

  getGames = () => {
    GameRequest.getGames({
      type: this.game_type
    }).then(res => {
      this.setState({
        gameList: res.data
      })
    })
  };
  handleGameClick = (item, type) => {
    if (type === "login") {
      GameRequest.loginGame(item.id).then(res => {
        if (item.is_iframe) {
          window.location.href = `${window.location.origin}/${window.location.pathname.split("/")[1]}/sports/${item.id}/${item.platform_code}/?url=${encodeURIComponent(res.url)}`
        } else {
          window.open(res.url, "_blank");
        }
      });
    } else {
      GameRequest.tryGame(item.id).then(res => {
        if (item.is_iframe) {
          window.location.href = `${window.location.origin}/${window.location.pathname.split("/")[1]}/sports/${item.id}/${item.platform_code}/?url=${encodeURIComponent(res.url)}`
        } else {
          window.open(res.url, "_blank");
        }
      });
    }
  };
  render() {
    const {gameList, bannerList} = this.state;
    return <div className={styles["sports-book"]} style={{ backgroundImage: "url(" + bgImg + ")"}}>
    <Helmet>
        <title>{intl.get('SEO_SPORT_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_SPORT_DESCRIPTION')} />
        <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/sports`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
    </Helmet>
    <div className="container">
      {
        bannerList.map((item, index) => <Link to={item.web_link_url} className={styles.banner} style={{backgroundImage: `url(${item.web_img_path})`}} key={`item${index}`} />)
      }
      <div className={styles["sub-container"]}>
        {
          gameList.map((item, index) => {
            return <a className={styles["sub-banner"]} style={{backgroundImage: `url(${item.web_img_path})`}} key={"item" + index}>
              <h2 className={styles.title}>{item.name}</h2>
              <div className={styles["desc-row"]}>
                <div className={styles.desc}>{item.description}</div>
                {
                  item.is_maintain ?
                      <div className={styles["btn-group"]}>
                        <Button disabled className={styles["btn-maintenance"]}>{intl.get("BTN_MAINTENANCE")}</Button>
                      </div> :
                      <div className={styles["btn-group"]}>
                        {
                          item.is_can_try && <Button className={styles["btn-try"]}
                                                     onClick={() => this.handleGameClick(item, "try")}>
                            {intl.get("LINK_TRY_NOW").toUpperCase()}
                          </Button>
                        }
                        <span onClick={() => this.handleGameClick(item, "login")} className={styles["btn-banner"]}>{intl.get("BTN_PLAYNOW")}</span>
                      </div>
                }
                {/*Link to={item.is_maintain ? '/sports' : `/sports/${item.id}/${item.platform_code}`}*/}
                {/*to={`/sports/${item.id}/${item.platform_code}`}*/}
                {/*{*/}
                {/*  item.is_maintain ?*/}
                {/*    <Button disabled className={styles["btn-maintenance"]}>{intl.get("BTN_MAINTENANCE")}</Button> :*/}
                {/*    <Link to={`/sports/${item.id}/${item.platform_code}`} className={styles["btn-banner"]}>{intl.get("BTN_PLAYNOW")}</Link>*/}
                {/*}*/}
              </div>
            </a>
          })
        }
      </div>
    </div>
  </div>
  }
}

export default connect(state => ({
    ...state
}))(Sport);
