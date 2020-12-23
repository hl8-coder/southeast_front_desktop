import React, {Component} from "react";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import styles from "./content.module.scss";
import Checkbox from "../../../component/basic/checkbox/Checkbox";
import NotificationRequest from "../../../request/Notification";

const CheckboxGroup = Checkbox.Group;

class Inbox extends Component {
  chatScroll = React.createRef();
  state = {
    displayType: "list",
    msgList: [],
    selectedMsg: null,
    checkGroupIds: [],
    indeterminate: false,
    checkedList: [],
    checkAll: false,
    replyMsg: ""
  };

  componentDidMount() {
    this.getNotificationList();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getNotificationList();
    }
  }

  scrollToBottom = () => {
    const element = this.chatScroll.current;
    element.scrollTop = element.scrollHeight;
  };

  getNotificationList = () => {
    NotificationRequest.getNotificationList(true).then(res => {
      this.setState({
        msgList: res.data,
        checkGroupIds: res.data.map(item => item.id)
      });
    });
  };

  deleteAll = () => {
    this.deleteNotification(this.state.checkedList);
  };

  deleteSelected = () => {
    const {selectedMsg} = this.state;
    const dataIds = [selectedMsg.id];
    this.deleteNotification(dataIds);
  };

  deleteNotification = (ids) => {
    NotificationRequest.deleteNotifications(ids).then(() => {
      this.getNotificationList();
      this.setState({
        displayType: "list"
      });
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? this.state.checkGroupIds : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  onGroupChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.checkGroupIds.length,
      checkAll: checkedList.length === this.state.checkGroupIds.length
    })
  };

  showDetails = (item) => {
    this.setState({
      displayType: "details",
      selectedMsg: item
    }, () => {
      this.scrollToBottom();
      if (!item.read_at) {
        let dataIds = [item.id];
        NotificationRequest.updateNotificationRead(dataIds);
      }
    });
  };

  handleMsgReply = () => {
    const data = {
      message: this.state.replyMsg
    };
    NotificationRequest.replyNotification(this.state.selectedMsg.id, data).then(res => {
      const {selectedMsg} = this.state;
      selectedMsg.replies.data.push(res);
      this.setState({
        selectedMsg: selectedMsg,
        replyMsg: ""
      }, () => {
        this.scrollToBottom();
      });
    });
  };

  render() {
    const {displayType, msgList, selectedMsg} = this.state;
    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get('USER_INBOX_MESSAGES_INBOX')}</div>
        {
          displayType === "list" && msgList.length !== 0 && <div className={styles["header-controls"]}>
            <div className={styles.delete} onClick={this.deleteAll}><span>{intl.get("BTN_DELETE")}</span></div>
            <div>
                {intl.get('SELECT_ALL')} <Checkbox className={styles["ml17"]}
                                   indeterminate={this.state.indeterminate}
                                   onChange={this.onCheckAllChange}
                                   checked={this.state.checkAll} />
            </div>
          </div>
        }
      </div>
      {
        displayType === "list" ? <div className={`${styles.content} ${styles.inbox}`}>
          <CheckboxGroup value={this.state.checkedList}
                         onChange={this.onGroupChange}
                         className={styles["checkbox-group"]}>
            {
              msgList.map((item, index) => {
                return <div className={styles["inbox-item"]} key={"item" + index}>
                  <div className={styles["item-inner"]} onClick={() => {this.showDetails(item)}}>
                    <div className={styles["inner-info"]}>
                      <div className={styles.title}>{item.message}</div>
                      <div>
                        <span className={styles.classify}>{intl.get('USER_INBOX_SUPPORT')}</span>
                        <span className={styles.split}>|</span>
                        <span className={styles.time}>{item.created_at}</span>
                      </div>
                    </div>
                    <Checkbox value={item.id} onClick={e => {e.stopPropagation()}} />
                  </div>
                </div>
              })
            }
          </CheckboxGroup>
        </div>
          :
        <div className={`${styles.content} ${styles.inbox}`}>
          <div className={styles["inbox-item"]}>
            <div className={`${styles["item-inner"]} ${styles.details}`}>
              <div className={styles["inner-info"]}>
                <div className={styles.title}>{selectedMsg.message}</div>
                <div>
                  <span className={styles.classify}>{intl.get('USER_INBOX_SUPPORT')}</span>
                  <span className={styles.split}>|</span>
                  <span className={styles.time}>{selectedMsg.created_at}</span>
                </div>
              </div>
              <div className={styles["item-control"]}>
                <div className={styles.back} onClick={() => {this.setState({displayType: "list"})}}><span>{intl.get('BACK')}</span></div>
                <div className={styles.delete} onClick={this.deleteSelected}><span>Delete</span></div>
              </div>
            </div>
          </div>
          <div className={styles["inbox-main"]}>
            <div className={styles["inbox-content"]} ref={this.chatScroll}>
              {
                selectedMsg.replies && selectedMsg.replies.data.map((item, index) =>
                  <div key={`reply${index}`}
                       className={`${styles["chat-line"]} 
                       ${item.is_admin ? styles.admin : ""}`}>
                    <div className={styles.chat}>{item.message}</div>
                  </div>
                )
              }
            </div>
            <textarea className={styles["text-area"]} value={this.state.replyMsg} onChange={e => {this.setState({replyMsg: e.target.value})}} />
            <div className={styles["btn-row"]}>
              <div className={styles["btn-primary"]} onClick={this.handleMsgReply}>{intl.get("BTN_SEND")}</div>
            </div>
          </div>
        </div>
      }
    </div>
  }
}

export default connect(state => ({
  ...state
}))(Inbox);