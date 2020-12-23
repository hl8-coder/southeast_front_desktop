import React, {Component} from "react";
import ISwiper from "swiper";
import "swiper/css/swiper.min.css";

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
  }

  componentDidMount() {
    this.initSwiper();
  }
  
  initSwiper() {
    const configs = this.props.configs || {};
    this.mySwiper = new ISwiper(this.swiperRef.current, {
      ...configs
    });
  }
  next () {
    this.mySwiper.slideNext();
  }
  render() {
    const {children, className, configs} = this.props;
    const swiperProps = {
      className: `${className ? className : ""} swiper-container`
    };
    return <div {...swiperProps} ref={this.swiperRef}>
      <div className="swiper-wrapper">
        {children}
      </div>
      <div className="swiper-pagination" />
      {
        configs.navigation && <>
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
        </>
      }
    </div>
  }
}

export default Swiper;