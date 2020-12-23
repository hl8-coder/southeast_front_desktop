import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./upload.module.scss";
import ConfigurationRequest from "../../../request/Configuration";

/**
 * 目前网络请求依赖类库axios以及本地service请求，
 * 所以暂时规划为common组件
 */
export default class extends Component {
  state = {
    fileName: null
  };

  selectMedia = e => {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    Object.keys(files).forEach(key => {
      const file = files[key];
      ConfigurationRequest.uploadImg(file).then(res => {
        this.setState({
          fileName: file.name
        });
        this.props.onFileUpload(res);
      });
    });
  };

  render() {
    return <div className={styles.upload}>
      <label className={styles.button}>
        {intl.get("UPLOAD_BTN_TEXT")}
        <input type="file" accept="image/*" className={styles.hidden} onChange={this.selectMedia}/>
      </label>
      <div className={`${styles.text} ${this.state.fileName || styles.none}`}>{this.state.fileName || intl.get("UPLOAD_FILE_TIP")}</div>
    </div>
  }
}