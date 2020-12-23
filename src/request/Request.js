import React from "react";
import axios from 'axios';
import intl from "react-intl-universal";
import {BrowserRouter} from 'react-router-dom';
import { Modal } from "../component/basic";
import store from "../store";
import userAction from "../store/actions";

let base_url = {
  dev: '/api',
  prod: '/api'
};

let modal = null;

let instance = axios.create({
  baseURL: base_url.dev,
  timeout: 1000 * 30
});

instance.interceptors.request.use(
  config => {
    const accessToken = store.getState().user.token;
    let {currentLanKey, languageList, defaultLanKey} = store.getState().language;
    currentLanKey = currentLanKey || defaultLanKey;
    const lanObj = languageList.filter(item => item.key === currentLanKey)[0];
    config.headers['currency'] = lanObj.currency;
    if (accessToken && accessToken.length !== 0) {
      config.headers['Authorization'] = "Bearer " + accessToken;
    }
    config.headers['device'] = "1";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    return response.data;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        /**
         *  未授权跳转到登录
         *  1. 清空localstorage accessToken
         *  2. 跳转登录页
         */
        store.dispatch(userAction.deleteUser());
        const router = new BrowserRouter();
        router.history.push('/');
        if (!modal) {
          modal = Modal.info({
            content: <div style={{color: "#666", textAlign: "center"}}>{intl.get('MESSAGE_please_login')}</div>,
            onOk: () => {
              modal = null;
            }
          });
        }
      } else if (error.response.status >= 300 || error.response.status < 200) {
        if (error.response.data && error.response.data.message !== "-1") {
          if (!modal) {
            modal = Modal.info({
              content: <div style={{color: "#666", textAlign: "center"}}>{error.response.data.message}</div>,
              onOk: () => {
                modal = null;
              }
            });
          }
        }
      }
    }
    return Promise.reject(error.response); //请求错误时，直接结束
  }
);

export default instance;
