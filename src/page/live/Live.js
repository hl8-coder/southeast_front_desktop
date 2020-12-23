import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from "react-redux";
import styles from './live.module.scss';
import GameRequest from "../../request/Game";
import {Button} from "../../component/basic";
import {Helmet} from "react-helmet";

class Live extends Component {
  game_type = 3;
  state = {
    product_code: this.props.match.params.code,
    firstTwoGames: [],
    restGames: []
  };

  componentDidMount() {
    this.getLiveGames();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevUrl = prevProps.match.url;
    const currUrl = this.props.match.url;
    if (prevUrl !== currUrl) {
      const product_code = this.props.match.params.code;
      this.setState({
        product_code
      }, () => {
        this.getLiveGames();
      });
    }
    // 语言切换
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getLiveGames();
    }
  }

  getLiveGames = () => {
    const {product_code} = this.state;
    let data = { type: this.game_type };
    if (product_code) {
      data = {...data, product_code};
    }
    GameRequest.getGames(data).then(res => {
      const firstTwoGames = res.data.filter((item, index) => index < 2);
      const restGames = res.data.filter((item, index) => index >= 2);
      this.setState({
        firstTwoGames,
        restGames
      });
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

  render() {
    const {firstTwoGames, restGames} = this.state;
    return <>
      <Helmet>
        <title>{intl.get('SEO_LIVE_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_LIVE_DESCRIPTION')} />
        <link href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/lives`} rel="canonical" hrefLang={intl.get('SEO_APP_LANGUAGE')}/>
      </Helmet>
      <div className={styles["live-casino"]}>
        <div className={styles["ls-container"] + " container"}>
          {
            firstTwoGames.map((item, index) => {
              return <div className={styles["ls-large-item"]} key={`item${index}`}>
                  <div className={styles["ls-img-large"]} style={{ backgroundImage: `url(${item.web_img_path})` }} />
                  {
                      item.is_maintain ?
                          <div className={styles["item-footer"]}>
                              <Button type="primary" className={styles["footer-maintenance"]} >{intl.get("BTN_MAINTENANCE")}</Button>
                          </div> :
                          <div className={styles["item-footer"]}>
                              <div className={styles["footer-content"]}>
                                  <h2 className={styles["content-title"]}>{item.name}</h2>
                                  <div className={styles["content-desc"]}>{item.description}</div>
                              </div>
                              {
                                  item.is_can_try && <span className={styles["link-try"]} onClick={() => {this.handleGameClick(item, "try")}}>{intl.get("BTN_TRY").toUpperCase()}</span>
                              }
                              <Button type="primary" className={styles["footer-btn"]} disabled={item.is_soon}
                                      onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_PLAY")}</Button>
                          </div>
                  }
                </div>
            })
          }
        </div>
        <div className={styles["ls-container"] + " container " + styles.small}>
          {
            restGames.map((item, index) => {
              return <div className={styles["ls-small-item"]} key={`item${index}`}>
                <div className={styles["ls-img-small"]} style={{ backgroundImage: `url(${item.web_img_path})` }} />
                <div className={styles["item-footer"]}>
                  <div className={styles["footer-content"]}>
                    <div className={styles["content-title"]}>{item.name}</div>
                    <div className={styles["content-desc"]}>{item.description}</div>
                  </div>
                  {
                    item.is_maintain ?
                    <div className={styles["btn-wrap"]}>
                        <Button type="primary" className={styles["footer-maintenance"]} >{intl.get("BTN_MAINTENANCE")}</Button>
                    </div> :
                    <div className={styles["btn-wrap"]}>
                        <Button type="primary" className={styles["footer-btn"]} disabled={item.is_soon}
                                onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_PLAY")}</Button>
                        {
                            item.is_can_try && <span className={styles["link-try"]} onClick={() => {this.handleGameClick(item, "try")}}>{intl.get("BTN_TRY").toUpperCase()}</span>
                        }
                    </div>
                  }

                </div>
              </div>
            })
          }
        </div>
      </div>
    </>
  }
}

export default connect(state => ({
  ...state
}))(Live);
