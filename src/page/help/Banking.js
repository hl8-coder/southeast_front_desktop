import React, {Component} from "react";
import styles from './content.module.scss';

import intl from "react-intl-universal";
import {Link} from "react-router-dom";
import PaymentPlatformRequest from "../../request/PaymentPlatform";
import {Helmet} from "react-helmet";

class CardItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCard: null,
      cardList: [],
    };
  }

  componentDidMount() {
    PaymentPlatformRequest.getPaymentAll().then(res => {
      this.setState({
        cardList: res.data,
        selectedCard: res.data[0]
      });
      this.props.callback(res.data[0]);
    });
  }

  handleItemClick = (item) => {
    this.props.callback(item);
    this.setState({
      selectedCard: item
    });
  };

  render() {
    const {cardList, selectedCard} = this.state;
    return cardList.map((item, index) =>
      <div className={`${styles["card-item"]} ${selectedCard.id === item.id ? styles["on"] : ""}`}
           key={"item" + index} onClick={() => this.handleItemClick(item)}>
        <div className={styles["card-sub"]} style={{backgroundImage: "url(" + item.image_path + ")"}} >
            <div className={`${selectedCard.id === item.id ? styles["card-on"] : ""}`}>{selectedCard.id === item.id ? intl.get('HELP_BANKING_CARD_ON') : ''}</div>
        </div>
        <div className={styles["card-name"]}>{item.name}</div>

      </div>
    );
  }
}

export default class Banking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCard: null
    };
  }

  callback(data) {
    this.setState({
      selectedCard: data
    })
  }

  render() {
    const {selectedCard} = this.state;
    return <>
      <Helmet>
        <title>{intl.get('SEO_BANKING_TITLE')}</title>
        <meta name="description" content={intl.get('SEO_BANKING_DESCRIPTION')} />
        <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help/banking`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
      </Helmet>
      <div className={styles.title}>{intl.get('HELP_BANKING_OPTIONS')}</div>
      <div className={styles.card}>
        <div className={styles["card-panel"]}>
          <div className={styles["panel-left"]}>
            <div className={styles["bank-img"]} style={{backgroundImage: `url(${selectedCard && selectedCard.image_path})`}} />
            <div className={styles["card-name"]}>{selectedCard && selectedCard.name}</div>
          </div>
          <div className={styles["panel-right"]}>
            <div className={styles["card-title"]}>{intl.get('HELP_BANKING_DEPOSIT_DESCRIPTION')}</div>
            <div className={styles["card-info"]}>
              <ul>
                {
                  selectedCard && <li>
                    <span>{intl.get('HELP_BANKING_Limit')}: </span>
                    {selectedCard.min_deposit} {selectedCard.currencies} / {selectedCard.max_deposit} {selectedCard.currencies}
                  </li>
                }
                <li><span>{intl.get('HELP_BANKING_PROCESS_TIME')}:</span>{intl.get('HELP_BANKING_5_15_MINUTES')}</li>
                <li><span>{intl.get('HELP_BANKING_DAILY_LIMITED')}:</span>{intl.get('HELP_BANKING_UNLIMITED')}</li>
                <li><span>{intl.get('HELP_BANKING_MODE')}:</span>{intl.get('HELP_BANKING_ONLINE_OFFLINE')}</li>
                <li><span>{intl.get('HELP_BANKING_FEE')}:</span>{intl.get('HELP_BANKING_25THB')}</li>
              </ul>
            </div>
            <div className={styles["card-title"]}>{intl.get('HELP_BANKING_WITHDRAWAL_DESCRIPTION')}</div>
            <div className={styles["card-info"]}>
              <ul>
                <li><span>{intl.get('HELP_BANKING_Limit')}:</span>{intl.get('HELP_BANKING_500THB')}</li>
                <li><span>{intl.get('HELP_BANKING_PROCESS_TIME')}:</span>{intl.get('HELP_BANKING_15_MINUTES')}</li>
                <li><span>{intl.get('HELP_BANKING_DAILY_LIMITED')}:</span>{intl.get('HELP_BANKING_DAILY_WITHDRAWAL')}</li>
                <li><span>{intl.get('HELP_BANKING_INTERBANK')}:</span>{intl.get('HELP_BANKING_INTERBANK_VALUE')}</li>
              </ul>
            </div>
            <div className={styles["info-reminder"]}>
              <p>{intl.get('HELP_BANKING_REMINDER')}:</p>
              <p>{intl.get('HELP_BANKING_REMINDER_1')}</p>
              <p>{intl.get('HELP_BANKING_REMINDER_2')}</p>
              <p>{intl.get('HELP_BANKING_REMINDER_3')}</p>
              <p>{intl.get('HELP_BANKING_REMINDER_4_1')} <Link to={`/${window.location.pathname.split("/")[1]}/help/terms`}>{intl.get('HELP_BANKING_REMINDER_4_2')}</Link> {intl.get('HELP_BANKING_REMINDER_4_3')}{intl.get('HELP_BANKING_REMINDER_5')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cards}>
        <CardItem callback={this.callback.bind(this)} />
      </div>
    </>
  }
}
