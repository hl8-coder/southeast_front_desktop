import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from './sider.scss';
import line from './image/component2.png'
import kefu from './image/component.png'
import QR from './image/component4.png'
import button1 from './image/component3.png'
import button2 from './image/component1.png'
import connect from "react-redux/es/connect/connect";
import actions from "../../../store/actions";
import {withRouter} from "react-router-dom";

class Sider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topHover: JSON.parse(localStorage.getItem('TOP_CLICK')) || false,
            bottomHover: false
        };
    }

    handleServiceClick (e) {
        e.stopPropagation();
        window.LC_API.open_chat_window({source:'button'});
    }
    handletopHover (value) {
        this.setState({
            topHover: value
        })
    }
    handlebottomHover (value) {
        this.setState({
            bottomHover: value
        })
    }
    handletopClick (value) {
        localStorage.setItem('TOP_CLICK', JSON.stringify(value))
        this.setState({
            topHover: value
        })
    }
    render() {
        const currentLanKey = this.props.language.currentLanKey
        return (
            currentLanKey === 'th-TH' &&
            <div>
                <div
                    className={`online-sidler-top ${this.state.topHover ? '' : 'active'}`}
                    onClick={this.handletopClick.bind(this, !this.state.topHover)}
                >
                    <div className="online-sidler-left">
                        <img src={line} alt=""/>
                        <div className="online-sidler-90">LINE</div>
                    </div>
                    <div className="online-sidler-QR">
                        <div>Line ID: @hl8th</div>
                        <img src={QR} alt=""/>
                    </div>
                </div>
                <div
                    className={`online-sidler-bottom ${this.state.bottomHover ? 'active' : ''}`}
                    onMouseEnter={this.handlebottomHover.bind(this, true)}
                    onMouseLeave={this.handlebottomHover.bind(this, false)}
                >
                    <div className="online-sidler-left">
                        <img src={kefu} alt=""/>
                        <div className="online-sidler-90 online-sidler-chat">{intl.get('SIDLER_CHAT_24_7')}</div>
                    </div>
                    <div className="online-sidler-buton-group">
                        <div className="online-sidler-button" onClick={this.handleServiceClick.bind(this)}>
                            <img src={button1} alt=""/>
                            <span>{intl.get('SIDLER_LIVE_CHAT')} 24/7</span>
                        </div>
                        <div className="online-sidler-button"
                             onClick={(e) => {e.stopPropagation();window.open('https://m.me/HL8THAI')}}
                        >
                            <img src={button2} alt=""/>
                            <span>Facebook Messenger</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(state => ({
    ...state
}), actions)(withRouter(Sider));
