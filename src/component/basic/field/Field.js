import React, { Component } from 'react';
import styles from './field.module.scss';

export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passOn: false,
      type: props.type,
      value: props.value,
      searchVisible: true,
    };
  }

  handlePassShow = () => {
    let passOn, type;
    if (this.state.passOn) {
      passOn = false;
      type = "password"
    } else {
      passOn = true;
      type = "text"
    }
    this.setState({
      passOn: passOn,
      type: type
    });
  };

  handlePassInput = evt => {
    this.setState({
      value: evt.target.value
    });
    if (this.props.onChange)
      this.props.onChange(evt.target.value);
  };

  handleInputBlur = () => {
    if (this.props.onBlur)
      this.props.onBlur();
  };

  render() {
    const {passOn, type, searchVisible} = this.state;
    const {
      type: type2,
      className,
      inputClass,
      style,
      size = "default",
      useDrop = true,
      children,
      ...props
    } = this.props;
    let sizeStyle;
    switch (size) {
      case "default": sizeStyle = ""; break;
      case "small": sizeStyle = styles.sm; break;
      default: sizeStyle = "";
    }
    return (
      <div className={`${styles["field-wrap"]} ${className ? className : ""}`} style={style}>
        { type === "search" && <div className={styles["search-icon"]} />}
        <input type={type} {...props}
               className={`${styles.field} ${inputClass ? inputClass : ""} ${type === "search" ? styles["prefix-icon"] : ""} ${sizeStyle}`}
               autoComplete="off"
               onBlur={this.handleInputBlur}
               onChange={this.handlePassInput}
        />
      { type2 === "password" &&
          <div className={styles["pass-switch"] + " " + styles[passOn ? 'on' : 'off']} onClick={this.handlePassShow}/>
        }
        {
          type === "search" && useDrop && searchVisible && <div className={styles["search-result"]}>
            <div className={styles["search-item"]}>Age of the Gods: Fortune Finder</div>
            <div className={styles["search-item"]}>Age of the Gods: Goddess of Wisdom</div>
            <div className={styles["search-item"]}>Age of the Gods: The Furious Four</div>
            <div className={styles["search-item"]}>Age of Thunder</div>
            <div className={styles["search-item"]}>Aggressive Jackpot</div>
            <div className={styles["search-item"]}>Aggressive Jackpot: Total Bonus</div>
            <div className={styles["search-item"]}>Aggressive Jackpot: Zion’s Revenge</div>
          </div>
        }
        { children }
      </div>
    );
  };
}
