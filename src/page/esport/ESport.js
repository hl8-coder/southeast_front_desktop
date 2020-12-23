import React, {Component} from "react";
import intl from 'react-intl-universal';
import styles from "./esport.module.scss";
import {connect} from "react-redux";
import GameRequest from "../../request/Game";
import {Helmet} from "react-helmet";

class ESport extends Component {
  state = {
    url: ""
  };
  
  componentDidMount() {
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
      this.getGames();
    }
  }
  
  getGames() {
    const {token} = this.props.user;
    if (token) {
      GameRequest.loginGame("972").then(res => {
        this.setState({
          url: res.url
        });
      });
    } else {
      GameRequest.tryGame("972").then(res => {
        this.setState({
          url: res.url
        });
      });
    }
  }
  
  render() {
    const {url} = this.state;
    return <div className={styles["sports-details"]}>
      <Helmet>
        <title>{intl.get('SEO_ESPORT_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_ESPORT_DESCRIPTION')} />
      </Helmet>
      <div className="container">
        <iframe title="game-play" src={url} className={styles["game-iframe"]} />
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state
}))(ESport);