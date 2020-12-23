import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import intl from "react-intl-universal";
import { Modal } from "./component/basic";

import Header from './component/common/header/Header';
import Sider from './component/common/sider/Sider';
import Footer from './component/common/footer/Footer';
import Home from './page/home/Home';
import Register from './page/register/Register';
import Sport from './page/sport/Sport';
import App from './page/app/App';
import ESport from './page/esport/ESport';
import SportDetail from './page/sport/Detail';
import Live from './page/live/Live';
import Fish from './page/fish/Fish';
import Lottery from './page/lotto/Lottery';
import Poker from './page/poker/Poker';
import HowToInstall from './page/howToInstall/HowToInstall';
import Slot from './page/slot/Slot';
import GamePlay from './page/gameplay/GamePlay';
import Promotion from './page/promotion/Promotion';
import Help from "./page/help/Help";
import User from "./page/user/User";
import Exclude from "./page/exclude/Exclude";
import OnlineService from "./component/common/onlineService/OnlineService";
import actions from "./store/actions";

// import {Result, Button} from "antd";
import {connect} from "react-redux";

const PrivateRoute = (props) => {
  const { component: Component, ...rest } = props;
  const {user} = rest;
  const token = user.token;
  const authTip = user.authTip;
  let route = <Route {...rest} render={routeProps =>
    <RouteLayout {...routeProps} component={Component} />
  }/>;
  if (!token) {
    route = <Redirect to={{
      pathname: `/${window.location.pathname.split("/")[1]}`,
      state: { from: rest.location }
    }}/>;
    if (authTip) {
      Modal.info({
        content: intl.get('MESSAGE_please_login')
      });
      props.resetTip();
    }
  }
  return route;
};

const PrivateRouteContainer = connect(state => ({
  ...state
}), actions)(PrivateRoute);

const RouteLayout = ({ component: Component, ...rest }) => {
  const pathname = rest.location.pathname;
  return <>
    <Header />
    <Route {...rest} render={routeProps =>
      <Component {...routeProps}/>
    }/>
    <Footer />
    <Sider />
    <OnlineService pathname={pathname} />
  </>
};

// const NoMatch = (props) => <Result
//   status="404"
//   title="404"
//   subTitle="Sorry, the page you visited does not exist."
//   extra={<Button type="primary" onClick={() => {props.history.goBack();}}>Back Home</Button>}
// />;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <RouteLayout path="/:language" exact component={Home} />
        <RouteLayout path="/:language/reg" component={Register} />
        <RouteLayout path="/:language/sports" exact component={Sport} />
        <RouteLayout path="/:language/app" exact component={App} />
        <RouteLayout path="/:language/esports" exact component={ESport} />
        <RouteLayout path="/:language/howToInstall" exact component={HowToInstall} />
        <RouteLayout path="/:language/sports/:id/:code" component={SportDetail} />
        <RouteLayout path="/:language/lives" exact component={Live} />
        <RouteLayout path="/:language/lives/:code" component={Live} />
        <RouteLayout path="/:language/slots" exact component={Slot} />
        <RouteLayout path="/:language/slots/:code" component={Slot} />
        <RouteLayout path="/:language/games" exact component={Fish} />
        <RouteLayout path="/:language/games/:code" component={Fish} />
        <RouteLayout path="/:language/promos" exact component={Promotion} />
        <RouteLayout path="/:language/promos/:id" component={Promotion} />
        <RouteLayout path="/:language/lottos" exact component={Lottery} />
        <RouteLayout path="/:language/lottos/:code" component={Lottery} />
        <RouteLayout path="/:language/pokers" exact component={Poker} />
        <RouteLayout path="/:language/pokers/:code" component={Poker} />
        <Route path="/:language/game_play" component={GamePlay} />
        <Route path="/:language/exclude" component={Exclude} />
        <RouteLayout path="/:language/help" component={Help} />
        <PrivateRouteContainer path="/:language/user" component={User} />
        <Redirect to="/:language" />
        {/*<Route component={NoMatch}/>*/}
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
