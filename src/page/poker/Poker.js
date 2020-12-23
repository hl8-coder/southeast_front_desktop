import React, {Component} from 'react';
import intl from "react-intl-universal";
import {connect} from "react-redux";
import styles from './poker.module.scss';
import GameRequest from "../../request/Game";
import {Button} from "../../component/basic";

class Poker extends Component {
  game_type = 6;
  state = {
    product_code: this.props.match.params.code,
    gameList: []
  };

  componentDidMount() {
    this.getGames();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
    const {gameList} = this.state;
    return <div className={styles.games}>
      <div className={styles["games-container"]}>
        {
          gameList.map((item, index) => {
            return <div className={styles["games-item"]} key={`item${index}`}
                        style={{backgroundImage: `url(${item.web_img_path})`}}>
                    {
                        item.is_maintain ?
                        <Button type="primary" className={styles["item-maintenance"]}
                                onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_MAINTENANCE")}</Button>:
                        <Button type="primary" className={styles["item-btn"]}
                                onClick={() => this.handleGameClick(item, "login")}>{intl.get("BTN_PLAYNOW")}</Button>
                    }

            </div>
          })
        }
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}))(Poker);
