import React from "react";
import intl from "react-intl-universal";
import {Modal} from "../component/basic";
import {Link} from "react-router-dom";

export default {
  // 适配参数，过滤null、""，包装参数的key到filter
  adaptParams(obj, filtered = false) {
    return Object.keys(obj)
      .map(item => {
        return filtered ? {[`filter[${item}]`]: obj[item]} : {[item]: obj[item]}
      }).filter(item => {
        return !!Object.values(item)[0];
      })
      .reduce((x, y) => ({...x, ...y}), {});
  },
  thirdPartPayCallback(data) {
    const error_msg = data.request_error;
    if (error_msg) {
      Modal.info({
        content: error_msg
      });
    } else {
      if (data.request_type === 1) {
        var idObject = document.getElementById('callbackForm')
        if (idObject != null) {
            idObject.parentNode.removeChild(idObject);
        }

        const reqData = data.request_data;
        const _html = `
        <form name="callbackForm" id="callbackForm" method="post" action="${data.request_url}" target="_blank" dangerouslySetInnerHTML={{__html: html_string}}>
        ${Object.keys(reqData).map(item => `
          <input type="hidden" name="${item}" value="${reqData[item]}" />
        `).join("")}
        </form>
      `;
        document.body.insertAdjacentHTML('beforeend', _html);
        document.forms["callbackForm"].submit();
      } else if (data.request_type === 5) {
        window.open(data.request_url, "_blank");
      } else if (data.request_type === 6) {
        Modal.info({
          content: intl.get('MESSAGE_deposit_success')
        });
      }
    }
  },
  breadItemRender(paths, pathNameMap) {
    let url = "";
    return paths.map((item, index) => {
      url += "/" + item;
      if (index === paths.length - 1) {
        return <span key={`link${index}`}>{pathNameMap[url]}</span>;
      } else {
        return <Link to={url} key={`link${index}`}>{pathNameMap[url]}</Link>
      }
    });
  },
  isLeapYear(year) {
    return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))
  },
  getDateFromMonth(month, isLeap) {
    const month31 = [1, 3, 5, 7, 8, 10, 12];
    const month30 = [4, 6, 9, 11];
    let feb = isLeap ? 29 : 30;
    if (month31.indexOf(month) > -1) {
      return 31;
    } else if (month30.indexOf(month) > -1) {
      return 30;
    } else {
      return feb;
    }
  },
  isMobile() {
    const ua = navigator.userAgent;
    const agents = ["Android", "iPhone", "iPad"];
    let flag = false;
    agents.forEach(item => {
      if (ua.indexOf(item) > -1) {
        flag = true;
      }
    });
    return flag;
  },
  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
  },
  scrollSmoothTo(position) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        return setTimeout(callback, 17);
      };
    }
    // 当前滚动高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    let step = function () {
      // 距离目标滚动距离
      let distance = position - scrollTop;
      // 目标滚动位置
      scrollTop = scrollTop + distance / 5;
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, position);
      } else {
        window.scrollTo(0, scrollTop);
        requestAnimationFrame(step);
      }
    };
    step();
  },
  returnLanguageShort(language) {
    if (language === 'en-US') {
      return 'en'
    } else if (language === 'vi-VN') {
      return 'vn'
    } else if (language === 'th-TH') {
      return 'th'
    } else {
      return 'en'
    }
  },
  returnLanguageLong(language) {
    if (language === 'en') {
      return 'en-US'
    } else if (language === 'vn') {
      return 'vi-VN'
    } else if (language === 'th') {
      return 'th-TH'
    } else {
      return 'en-US'
    }
  },
}
