import React, {Component} from 'react';
import intl from "react-intl-universal";
import styles from './sport.module.scss';
import bgImg from './image/shutterstock_1087094309.png';
import GameRequest from "../../request/Game";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import TransferComp from "../../component/common/transferComp/TransferComp"
import Utils from '../../util/Utils'


class SportDetail extends Component {
  state = {
    url: ""
  };

  componentDidMount() {
    this.showGame();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const thisLan = this.props.language;
    const thisUser = this.props.user;
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLanKey = thisLan.currentLanKey;
    const prevToken = prevProps.user.token;
    const thisToken = thisUser.token;
    if (prevToken !== thisToken || prevLanKey !== thisLanKey) {
      this.showGame();
    }
  }

  showGame () {
    console.log()
    const {user, match} = this.props;
    const id = match.params.id;
    // if (!!user.token) {
    //   GameRequest.loginGame(id).then(res => {
    //     if (res.is_iframe) {
    //         this.setState({
    //             url: res.url
    //         });
    //     } else {
    //         window.open(res.url)
    //     }
    //   });
    // } else {
    //   GameRequest.tryGame(id).then(res => {
    //     if (res.is_iframe) {
    //         this.setState({
    //             url: res.url
    //         });
    //     } else {
    //         window.open(res.url)
    //     }
    //   })
    // }
  }

  render() {
    const {url} = this.state;
    return <>
      <Helmet>
        <title>{intl.get('SEO_SPORT_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_SPORT_DESCRIPTION')} />
      </Helmet>
      <div className={styles["sports-book"]} style={{ backgroundImage: "url(" + bgImg + ")"}}>
        <div className={styles["sb-container"] + " container"}>
          <iframe title="game-play" src={Utils.getQueryString('url')} className={styles["game-iframe"]} />
        </div>
        {
          this.props.user.token &&
          <TransferComp
              code={this.props.match.params.code}
          />
        }
      </div>
    </>
  }
}

export default connect(state => ({
  ...state
}))(SportDetail);
