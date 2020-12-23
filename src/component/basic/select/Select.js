import React, {Component} from "react";
import { Select as AntSelect } from 'antd';
import styles from './select.module.scss';

const { Option: AntOption, OptGroup: AntOptGroup } = AntSelect;

export default class Select extends Component {
  static Option = AntOption;
  static OptGroup = AntOptGroup;

  render() {
    const { className, style, ...props} = this.props;
    return <div className={styles["override-select"] + " " + className} style={style}>
      <AntSelect {...props} />
    </div>
  }
}