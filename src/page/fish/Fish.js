import React, {Component} from 'react';
import intl from "react-intl-universal";
import {connect} from "react-redux";
import styles from './fish.module.scss';
import GameRequest from "../../request/Game";
import {Button} from "../../component/basic";
import {Helmet} from "react-helmet";

class Fish extends Component {
  game_type = 1;
  state = {
    product_code: this.props.match.params.code,
    gameList: []
  };

  componentDidMount() {
    this.getGames();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevUrl = prevProps.match.url;
    const currUrl = this.props.match.url;
    if (prevUrl !== currUrl) {
      const product_code = this.props.match.params.code;
      this.setState({
        product_code
      }, () => {
        this.getGames();
      });
    }
    // 语言切换
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getGames();
    }
  }

  getGames = () => {
    const {product_code} = this.state;
    let data = { type: this.game_type };
    if (product_code) {
      data = {...data, product_code};
    }
    GameRequest.getGames(data).then(res => {
      this.setState({
        gameList: res.data
      })
    })
  };

  handleGameClick = (item, type) => {
    if (type === "login") {
      GameRequest.loginGame(item.id).then(res => {
        if (item.is_iframe) {
          window.open(`${window.location.origin}/${window.location.pathname.split("/")[1]}/game_play?url=${encodeURIComponent(res.url)}&code=${item.platform_code}`, "_blank");
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
    const {gameList} = this.state;
    return <>
      <Helmet>
        <title>{intl.get('SEO_FISH_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_FISH_DESCRIPTION')}/>
        <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/fishs`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
      </Helmet>
      <div className={styles.games}>
        <div className={styles["games-container"]}>
          {
            gameList.map((item, index) => {
              return <div className={styles["games-item"]} key={`item${index}`}
                          style={{backgroundImage: `url(${item.web_img_path})`}}>
                  {
                      item.is_maintain ?
                          <div className={styles["btn-group"]}>
                              <Button type="primary" className={styles["item-maintenance"]}>{intl.get("BTN_MAINTENANCE")}</Button>
                          </div> :
                          <div className={styles["btn-group"]}>
                              {
                                  item.is_can_try && <Button className={styles["btn-try"]} onClick={() => this.handleGameClick(item, "try")}>
                                      {intl.get("BTN_TRY").toUpperCase()}
                                  </Button>
                              }
                              <Button type="primary" className={styles["item-btn"]}
                                      onClick={() => this.handleGameClick(item, "login")}>
                                  {intl.get("BTN_PLAY")}
                              </Button>
                          </div>
                  }

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
}))(Fish)
