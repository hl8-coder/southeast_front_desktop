import React, {Component} from "react";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import styles from "../content.module.scss";
import PaymentPlatformRequest from "../../../../request/PaymentPlatform";
import {Modal, Table} from "../../../../component/basic";

class CardList extends Component {
  constructor(props) {
    super(props);
    this.handleViewDisplay = this.handleViewDisplay.bind(this);
    this.handleCardSelect = this.handleCardSelect.bind(this);
    this.handleItemCopy = this.handleItemCopy.bind(this);
    this.state = {
      listType: "cards",
      cardsInfo: JSON.parse(localStorage.getItem('COMPANY_BANK_ACCOUNT')) || [],
      channelOpts: null,
      selectedBank: null
    }
  }

  componentDidMount() {
    this.getPaymentMethods(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getPaymentMethods(false);
    }
  }

  getPaymentMethods(init) {
    PaymentPlatformRequest.getPaymentPlatforms({
      "filter[id]": "",
      "filter[payment_type]": 1
    }).then(res => {
      let { data } = res;
      data = data.map(item => {
        const payment_platform_id = item.id;
        const payment_type = item.payment_type;
        item.companyBankAccount.payment_platform_id = payment_platform_id;
        item.companyBankAccount.payment_type = payment_type;
        item.companyBankAccount.min_deposit = item.min_deposit;
        item.companyBankAccount.max_deposit = item.max_deposit;
        return item.companyBankAccount;
      });
      this.setState({
        cardsInfo: data
      });
      localStorage.setItem('COMPANY_BANK_ACCOUNT', JSON.stringify(data));
      if (init) {
        this.handleCardSelect("cards", data[0]);
      }
    });
  }

  handleViewDisplay(type) {
    this.setState({
      listType: type
    });
  }

  handleCardSelect(type, item) {
    this.handleViewDisplay(type);
    this.setState({
      selectedBank: item
    });
    this.props.onCardSelect(item);
  }

  handleItemCopy() {
    const item = this.state.selectedBank;
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.setAttribute("readonly", "readonly");
    textarea.value = `
      ${intl.get("BANKING_CARD_LABEL_NAME")}: ${item.bank_code}\n
      ${intl.get("BANKING_CARD_LABEL_ACCOUNT")}: ${item.account_no}\n
      ${intl.get("BANKING_CARD_LABEL_ACCOUNT_NAME")}: ${item.account_name}\n
      ${intl.get("BANKING_CARD_LABEL_BRANCH")}: ${item.branch}\n
    `;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      Modal.info({
        content: <div className={styles["modal-tip-center"]}>{intl.get("MESSAGE_BANKING_COPIED")}</div>
      });
    }
    document.body.removeChild(textarea);
  }

  render() {
    const tableColumns = [
      {title: intl.get("BANKING_TABLE_TITLE_BANK"), dataIndex: "bank_code"},
      {title: intl.get("BANKING_TABLE_TITLE_ACCOUNT"), dataIndex: "account_name",
        render: (text, record) => {
          const {selectedBank} = this.state;
          if (selectedBank && selectedBank.id === record.id) {
            return text;
          } else {
            return text.replace(/\w/g, "*");
          }
        }
      },
      {title: intl.get("BANKING_TABLE_TITLE_ACCOUNT_NUMBER"), dataIndex: "account_no",
        render: (text, record) => {
          const {selectedBank} = this.state;
          if (selectedBank && selectedBank.id === record.id) {
            return text;
          } else {
            return text.replace(/[0-9]/g, "*");
          }
        }
      },
      {
        title: intl.get("BANKING_TABLE_TITLE_BANK_BRANCH"),
        dataIndex: "branch",
        className: styles["last-column"],
        render: (text, record) => {
          const { selectedBank } = this.state;
          return <>
            { text }
            {
              <div className={styles["btn-copy"] + " " + (selectedBank.id === record.id && styles.show)}
                                                                                  onClick={this.handleItemCopy}>
                {intl.get("BTN_COPY")}
              </div>
            }
            {/*{*/}
            {/*  selectedBank && this.props.user.userInfo.currency !== 'THB' && <div className={styles["btn-copy"] + " " + (selectedBank.id === record.id && styles.show)}*/}
            {/*                       onClick={this.handleItemCopy}>*/}
            {/*    {intl.get("BTN_COPY")}*/}
            {/*  </div>*/}
            {/*}*/}
            {/*{*/}
            {/*  selectedBank && this.props.user.userInfo.currency === 'THB' && <div className={styles["btn-copy"] + " " + (selectedBank.id === record.id && styles.show)}*/}
            {/*                  onClick={() => window.LC_API.open_chat_window({source:'button'})}>*/}
            {/*      {intl.get("FOOTER_MENU_CONTACT")}*/}
            {/*  </div>*/}
            {/*}*/}
          </>
        }
      }
    ];
    const rowSelection = {
      type: "radio",
      columnTitle: intl.get("USER_SELECT"),
      selectedRowKeys: this.state.selectedBank ? [this.state.selectedBank.payment_platform_id] : [],
      hideDefaultSelections: true,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedBank: selectedRows[0]
        });
        this.props.onCardSelect(selectedRows[0]);
      }
    };
    const cards = <div style={this.props.maintenance.length !== 0  ? {width: '590px'} : {}} className={styles.cards}>
      {
        this.state.cardsInfo && this.state.cardsInfo.map((item, index) =>
          <div className={styles["card-wrap"]} key={"card" + index}
               onClick={() => {this.handleCardSelect("details", item)}}>
            <div className={styles["card-item"]} style={{backgroundImage: `url(${item.image})`}}>
              {item.account_no.replace(/\d/g, "*")}<br/>
              {intl.get("BANKING_CARD_SELECT_DETAILS")}
              { this.state.selectedBank && item.payment_platform_id === this.state.selectedBank.payment_platform_id &&
              <div className={styles.selection}>{intl.get("BANKING_CARD_SELECTED")}</div>
              }
            </div>
            <div className={styles["card-text"]}>{item.bank_code}</div>
          </div>)
      }
    </div>;
    const cardDetail = this.state.selectedBank && <div className={styles["card-details"]}>
      <div className={styles["back-row"]}>
        <div className={styles["back-btn"]} onClick={() => {this.handleViewDisplay("cards")}} />
        {intl.get("BANKING_CARD_DETAILS_TITLE")}
      </div>
      <div className={styles["card-content"]}>
        <div className={styles["content-left"]}>
          <div className={styles["card-item"]} style={{backgroundImage: `url(${this.state.selectedBank.image})`}}>
            <div className={styles["selection"]}>{intl.get("BANKING_CARD_SELECTED")}</div>
          </div>
          <div className={styles["bank-name"]}>{this.state.selectedBank.bank_code}</div>
          {/*<div className={styles["bank-desc"]}>Min: 50.00 - Max: 100,000.00</div>*/}
        </div>
        <div className={styles["content-right"]}>
          <div className={styles["card-info"]}>
            <span className={styles.lab}>{intl.get("BANKING_CARD_LABEL_NAME")}</span>
            <span className={styles.val}>{this.state.selectedBank.bank_code}</span>
          </div>
          <div className={styles["card-info"]}>
            <span className={styles.lab}>{intl.get("BANKING_CARD_LABEL_ACCOUNT")}</span>
            <span className={styles.val}>{this.state.selectedBank.account_no}</span>
          </div>
          <div className={styles["card-info"]}>
            <span className={styles.lab}>{intl.get("BANKING_CARD_LABEL_ACCOUNT_NAME")}</span>
            <span className={styles.val}>{this.state.selectedBank.account_name}</span>
          </div>
          <div className={styles["card-info"]}>
            <span className={styles.lab}>{intl.get("BANKING_CARD_LABEL_BRANCH")}</span>
            <span className={styles.val}>{this.state.selectedBank.branch}</span>
          </div>
          <div className={styles["details-controls"]}>
            <div className={styles["btn-contempt"]} onClick={() => {this.handleCardSelect("cards", null)}}>{intl.get("BTN_CHOOSE_BANK")}</div>
            <div className={styles["btn-copy"]} onClick={this.handleItemCopy}>{intl.get("BTN_COPY")}</div>
            {/*{*/}
            {/*  this.props.user.userInfo.currency !== 'THB' &&*/}
            {/*  <div className={styles["btn-copy"]} onClick={this.handleItemCopy}>{intl.get("BTN_COPY")}</div>*/}
            {/*}*/}
            {/*{*/}
            {/*    this.props.user.userInfo.currency === 'THB' &&*/}
            {/*    <div className={styles["btn-copy"]} onClick={() => window.LC_API.open_chat_window({source:'button'})}>{intl.get("FOOTER_MENU_CONTACT")}</div>*/}
            {/*}*/}

          </div>
        </div>
      </div>
    </div>;
    const list = <div className={styles["card-list"]}>
      <Table style={this.props.maintenance.length !== 0  ? {marginTop: '120px'} : {}} columns={tableColumns}
             dataSource={this.state.cardsInfo}
             rowKey={record => record.payment_platform_id}
             rowSelection={rowSelection}
             pagination={false}
             onRow={record => {
               return {
                 onClick: () => {
                   this.setState({
                     selectedBank: record
                   });
                   this.props.onCardSelect(record);
                 }
               }
             }}/>
    </div>;
    return <>
      <div className={styles.row}>
        <div className={styles.label}>2. {intl.get("BANKING_LABEL_SELECT")} <span className={styles.hl}>*</span></div>
        <div className={styles["form-elm"]}>
          <div className={styles["view-switch"] + " " + styles.card + " " + (this.state.listType === "cards" || this.state.listType === "details" ? styles.on : "")} onClick={() => {this.handleViewDisplay("cards")}}>{intl.get("BANKING_CARD_BTN_CARD")}</div>
          <div className={styles["view-switch"] + " " + styles.list + " " + (this.state.listType === "list" ? styles.on : "")} onClick={() => {this.handleViewDisplay("list")}}>{intl.get("BANKING_CARD_BTN_LIST")}</div>
        </div>
      </div>
      { this.state.listType === "cards" && cards }
      { this.state.listType === "details" && cardDetail }
      { this.state.listType === "list" && list }
    </>
  }
}

export default connect(state => ({
  ...state
}))(CardList);
