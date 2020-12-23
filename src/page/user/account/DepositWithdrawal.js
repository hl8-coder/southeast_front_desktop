import React, {Component} from "react";
import intl from "react-intl-universal";
import styles from "./content.module.scss";
import moment from "moment";
import {Icon} from "antd";
import {connect} from "react-redux";
import Utils from "../../../util/Utils";
import HistoryRequest from "../../../request/History";
import ConfigurationRequest from "../../../request/Configuration";
import WithdrawalRequest from "../../../request/Withdrawal";
import {Modal, DatePicker, Select, Table, Button} from "../../../component/basic";

const {Option} = Select;

class DepositWithdrawal extends Component {
  state = {
    btnLoading: false,
    statusOpts: [],
    typeOpts: [],
    dataSource: [],
    date_from: "",
    date_to: "",
    status: "",
    type: "",
    pendingModal: {
      visible: false,
      modalInfo: null
    },
    pagination: {
      position: "both",
      size: "small",
      showSizeChanger: true,
      hideOnSinglePage: true,
      current: 1,
      pageSize: 5,
      pageSizeOptions: ["5", "10", "20"],
      showTotal: (total, range) => {
        return intl.get("TABLE_TOTAL_ITEM", {total: total});
      }
    }
  };
  historyInterval = null;
  componentDidMount() {
    this.getDropList();
    this.getDepositWithdrawalData();
    this.loop();
  }
  loop() {
     this.historyInterval = setInterval(() => {
        this.getDepositWithdrawalData();
      }, 30000);
  }
  componentWillUnmount() {
    clearTimeout(this.historyInterval)

  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDropList();
      this.getDepositWithdrawalData();
    }
  }

  getDropList = () => {
    ConfigurationRequest.getDroplist("history_deposit_withdrawal").then(res => {
      this.setState({
        statusOpts: res.status,
        typeOpts: res.type
      });
    });
  };

  getDepositWithdrawalData = () => {
    const data = {
      date_from: this.state.date_from,
      date_to: this.state.date_to,
      status: this.state.status,
      type: this.state.type,
    };
    const pagination = this.state.pagination;
    let params = Utils.adaptParams(data, true);
    params.page = pagination.current;
    params.per_page = pagination.pageSize;
    HistoryRequest.getDepositWithdrawal(params).then(res => {
      pagination.total = res.meta.pagination.total;
      this.setState({
        dataSource: res.data,
        pagination
      });
    }).finally(() => {
      this.setState({
        btnLoading: false
      });
    });
  };

  openCancelModal = (item) => {
    WithdrawalRequest.getWithdrawlDetails(item.id).then(res => {
      this.setState({
        pendingModal: {
          visible: true,
          modalInfo: res
        }
      });
    });
  };

  handleCancelWithdrawal = () => {
    const withdrawalId = this.state.pendingModal.modalInfo.id;
    WithdrawalRequest.cancelWithdrawal(withdrawalId).then(() => {
      this.setState({
        pendingModal: {
          visible: false
        }
      });
      this.getDepositWithdrawalData();
    });
  };

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager
    }, () => {
      this.getDepositWithdrawalData();
    });
  };

  doSearch = () => {
    const dateFrom = new Date(this.state.date_from),
      dateTo = new Date(this.state.date_to);
    if (dateFrom > dateTo) {
      Modal.info({
        content: intl.get('MESSAGE_To_date_cannot_earlier_than_from_date')
      });
      return false;
    }
    this.setState({
      btnLoading: true
    });
    this.getDepositWithdrawalData();
  };

  render() {
    const columns = [{
      title: intl.get('TABLE_HEAD_DATE_AND_TIME'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: "center",
      width: 140,
      render: text => {
        const element = text.split(" ");
        return <>
          <div className={styles["table-date"]}>{element[0]}</div>
          <div className={styles["table-time"]}>{element[1]}</div>
        </>;
      }
    }, {
      title: intl.get('TABLE_HEAD_TRANSACTION_ID'),
      dataIndex: 'order_no',
      key: 'order_no',
      align: "center",
      width: 180
    }, {
      title: intl.get('TABLE_HEAD_TYPE'),
      dataIndex: 'type',
      key: 'type',
      align: "center",
      width: 280
    }, {
      title: intl.get('TABLE_HEAD_AMOUNT'),
      dataIndex: 'amount',
      key: 'amount',
      align: "center",
      width: 200
    }, {
      title: intl.get('TABLE_HEAD_STATUS'),
      dataIndex: 'display_status',
      key: 'display_status',
      align: "center",
      render: (text, record) => {
        switch (record.status) {
          case 1: return <span className={styles["status-success"]}>{text}</span>;
          case 2: return <span className={styles["status-failed"]}>{text}</span>;
          case 3:
            if (record.is_can_cancel) {
              return <span className={styles["status-pending"]}
                           onClick={() => {this.openCancelModal(record)}}>{text}</span>;
            } else {
              return <span className={`${styles["status-pending"]} ${styles["no-click"]}`}>{text}</span>;
            }
          case 4: return <span className={styles["status-cancel"]}>{text}</span>;
          case 5: return <span className={styles["status-processing"]}>{text}</span>;
          default: return text;
        }
      }
    }];

    const {
      statusOpts,
      dataSource,
      pagination,
      typeOpts,
      pendingModal
    } = this.state;

    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get("USER_DEPOSIT_WITHDRAW")}</div>
      </div>
      <div className={styles.conditions}>
        <div className={styles["conditions-wrap"]}>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_FROM')}:</div>
            <DatePicker className={styles["form-elm"]} format="YYYY-MM-DD"
                        placeholder={intl.get("DATEPICKER_PH_SELECT_DATE")}
                        disabledDate={current => {
                          return current && current < moment().subtract(60,'day')
                        }}
                        onChange={(date, dateString) => {this.setState({date_from: dateString})}} />
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_TO_DATE')}:</div>
            <DatePicker className={styles["form-elm"]} format="YYYY-MM-DD"
                        placeholder={intl.get("DATEPICKER_PH_SELECT_DATE")}
                        disabledDate={current => {
                          return current && current < moment().subtract(60,'day')
                        }}
                        onChange={(date, dateString) => {this.setState({date_to: dateString})}} />
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_TYPE')}:</div>
            <Select defaultValue="" className={styles["form-elm"]} suffixIcon={<Icon type="caret-down" />}
                    onChange={val => {this.setState({type: val})}}>
              <Option value="">{intl.get("USER_SELECT_OPTION_ALL")}</Option>
              {
                typeOpts.map((item, index) => {
                  return <Option key={`opt${index}`} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_STATUS')}:</div>
            <Select defaultValue="" className={styles["form-elm"]} suffixIcon={<Icon type="caret-down" />}
                    onChange={val => {this.setState({status: val})}}>
              <Option value="">{intl.get("USER_SELECT_OPTION_ALL")}</Option>
              {
                statusOpts.map((item, index) => {
                  return <Option key={`opt${index}`} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </div>
        </div>
        <div className={styles["btn-wrap"]}>
          <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                  onClick={this.doSearch}>{intl.get('BTN_CONFIRM')}</Button>
        </div>
      </div>
      <Table dataSource={dataSource} rowKey={record => record.id} columns={columns}
             locale={{
               emptyText: <div className={styles["table-empty-tip"]}>
                 {intl.get("TABLE_EMPTY_DATA_TIP")}
               </div>
             }}
             pagination={pagination} onChange={this.handleTableChange} />
      <Modal visible={pendingModal.visible} title={intl.get("USER_DW_MODAL_TITLE")}
             onCancel={() => {
               this.setState({
                 pendingModal: {
                   visible: false
                 }
               });
             }}>
        {
          pendingModal.modalInfo && <>
            <div className={styles["modal-info"]}>
              <div className={styles["info-row"]}>
                <span className={styles.label}>{intl.get("USER_DW_MODAL_LABEL_REFER")}</span>
                <span>{pendingModal.modalInfo.order_no}</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles.label}>{intl.get("USER_DW_MODAL_LABEL_BANK")}</span>
                <span>{pendingModal.modalInfo.bank.code}</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles.label}>{intl.get("USER_DW_MODAL_LABEL_BANK_NAME")}</span>
                <span>{pendingModal.modalInfo.bank.name}</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles.label}>{intl.get("USER_DW_MODAL_LABEL_BANK_NO")}</span>
                <span>{pendingModal.modalInfo.account_no}</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles.label}>{intl.get("USER_DW_MODAL_LABEL_AMOUNT")}</span>
                <span>{pendingModal.modalInfo.amount} {pendingModal.modalInfo.bank.currency}</span>
              </div>
            </div>
            <div className={styles["modal-tip"]}>{intl.get("USER_DW_MODAL_TIP")}</div>
            <div className={styles["modal-btn-row"]}>
              <button className={styles["modal-btn-cancel"]}
                      onClick={() => {
                        this.setState({
                          pendingModal: {
                            visible: false
                          }
                        });
                      }}>{intl.get("BTN_NO")}</button>
              <button className={styles["modal-btn-confirm"]} onClick={this.handleCancelWithdrawal}>{intl.get("BTN_YES")}</button>
            </div>
          </>
        }
      </Modal>
    </div>
  }
}

export default connect(state => ({
  ...state
}))(DepositWithdrawal)