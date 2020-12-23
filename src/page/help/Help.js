import React, {Component} from "react";
import { Route, NavLink } from "react-router-dom";
import styles from './help.module.scss';

import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import Responsible from './Responsible';
import Banking from './Banking';
import Faqs from './Faqs';
import intl from "react-intl-universal";

const Menu = ({ match }) => {
  return (
    <div className={styles.menu}>
      <NavLink to={`${match.url}`} exact className={styles["menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_1')}</NavLink>
      <NavLink to={`${match.url}/terms`} className={styles["menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_2')}</NavLink>
      <NavLink to={`${match.url}/contact`} className={styles["menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_3')}</NavLink>
      <NavLink to={`${match.url}/faqs`} className={styles["menu-item"]} activeClassName={styles.on + " " + styles.faq}>{intl.get('HELP_TITLE_4')}</NavLink>
      <div className={styles["sub-menu"]}>
        <NavLink to={`${match.url}/faqs`} exact className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_1')}</NavLink>
        <NavLink to={`${match.url}/faqs/account`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_2')}</NavLink>
        <NavLink to={`${match.url}/faqs/dw`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_3')}</NavLink>
        <NavLink to={`${match.url}/faqs/promo`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_4')}</NavLink>
        <NavLink to={`${match.url}/faqs/cash`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_5')}</NavLink>
        <NavLink to={`${match.url}/faqs/slot`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_6')}</NavLink>
        <NavLink to={`${match.url}/faqs/mobile`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_7')}</NavLink>
        <NavLink to={`${match.url}/faqs/cs`} className={styles["sub-menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_4_8')}</NavLink>
      </div>
      <NavLink to={`${match.url}/responsible`} className={styles["menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_5')}</NavLink>
      <NavLink to={`${match.url}/banking`} className={styles["menu-item"]} activeClassName={styles.on}>{intl.get('HELP_TITLE_6')}</NavLink>
      {/*<NavLink to={`${match.url}/rules`} className={styles["menu-item"]} activeClassName={styles.on}>GAME RULES</NavLink>*/}
    </div>
  );
};

const FaqFrame = (props) => {
  return (
    <>
      <Route path={`${props.match.url}`} exact component={Faqs} />
      <Route path={`${props.match.url}/account`} component={Faqs} />
      <Route path={`${props.match.url}/dw`} component={Faqs} />
      <Route path={`${props.match.url}/promo`} component={Faqs} />
      <Route path={`${props.match.url}/cash`} component={Faqs} />
      <Route path={`${props.match.url}/slot`} component={Faqs} />
      <Route path={`${props.match.url}/mobile`} component={Faqs} />
      <Route path={`${props.match.url}/cs`} component={Faqs} />
    </>
  )
};

export default class Help extends Component {
  scrollRef = React.createRef();

  componentDidMount() {
      window.EventBus.on("FAQ_POSITIONED", this.getOffsetTop);
  }
  componentWillUnmount() {
      window.EventBus.off("FAQ_POSITIONED", this.getOffsetTop);
  }

  getOffsetTop = offsetTop => {
      console.log(offsetTop)
    this.scrollRef.current.scrollTop = offsetTop;
  };
  render() {
    const {props} = this;
    let isBanking = false;
    if (props.location.pathname === "/help/banking") {
      isBanking = true;
    }
    return <div className={styles.help}>
      <div className={styles["help-panel"] + " container"}>
        <Menu {...props} />
        <div className={`${styles.content} ${isBanking ? "" : styles.scroll}`} ref={this.scrollRef}>
          <Route path={`${props.match.url}`} exact component={About} />
          <Route path={`${props.match.url}/terms`} component={Terms} />
          <Route path={`${props.match.url}/contact`} component={Contact} />
          <Route path={`${props.match.url}/faqs`} component={FaqFrame} />
          <Route path={`${props.match.url}/responsible`} component={Responsible} />
          <Route path={`${props.match.url}/banking`} component={Banking} />
        </div>
      </div>
    </div>
  }
}