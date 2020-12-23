import React, {Component} from "react";
import styles from "./verifyCode.module.scss";

export default class VerifyCode extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  };

  componentDidMount() {
    this.inputRef.current.focus();
  }

  handleInputFocus = () => {
    this.inputRef.current.focus();
  };

  handleInput = e => {
    const val = e.target.value;
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  };

  onFocus = () => {
    this.inputRef.current.focus();
  };

  render() {
    const {value, length = 4} = this.props;
    const valLen = value.length;
    return <div className={styles.verify}>
      {
        [...Array(length)].map((item, index) => <div className={`${styles["verify-item"]} ${valLen === index ? styles.on : ""}`}
                                                     key={`item${index}`}
                                                     onClick={this.handleInputFocus}>
          {value.substring(index, index + 1)}
        </div>)
      }
      <input className={styles["verify-input"]}
             type="text" value={value}
             onChange={this.handleInput}
             ref={this.inputRef}
             maxLength={length} />
    </div>
  }
}