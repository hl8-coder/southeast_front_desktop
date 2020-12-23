import React, {Component} from "react";
import styles from "./content.module.scss";
import intl from "react-intl-universal";
import moment from "moment";
import {Icon} from "antd";
import {connect} from "react-redux";
import Utils from "../../../util/Utils";
import HistoryRequest from "../../../request/History";
import ConfigurationRequest from "../../../request/Configuration";
import {Modal, DatePicker, Select, Table, Button} from "../../../component/basic";
const {Option} = Select;

class Transfer extends Component {
  state = {
    btnLoading: false,
    statusOpts: [],
    typeOpts: [],
    dataSource: [],
    date_from: "",
    date_to: "",
    fo_status: "",
    platform_code: "",
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
    this.getTransferData();
    this.loop();
  }
  loop() {
     this.historyInterval = setInterval(() => {
        this.getTransferData();
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
      this.getTransferData();
    }
  }

  getDropList() {
    ConfigurationRequest.getDroplist("history_fund_transfer").then(res => {
      this.setState({
        statusOpts: res.fo_status,
        typeOpts: res.platform_code
      });
    });
  }

  getTransferData = () => {
    const {btnLoading, statusOpts, typeOpts, dataSource, pagination, ...rest} = this.state;
    let params = Utils.adaptParams(rest, true);
    params.page = pagination.current;
    params.per_page = pagination.pageSize;
    HistoryRequest.getTransfer(params).then(res => {
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

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager
    }, () => {
      this.getTransferData();
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
    this.getTransferData();
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
      title: intl.get('TABLE_HEAD_FROM_WALLET'),
      dataIndex: 'from',
      key: 'from',
      align: "center",
      width: 160
    }, {
      title: intl.get('TABLE_HEAD_TO_WALLET'),
      dataIndex: 'to',
      key: 'to',
      align: "center",
      width: 160
    }, {
      title: intl.get('TABLE_HEAD_AMOUNT'),
      dataIndex: 'amount',
      key: 'amount',
      align: "center",
      width: 160
    }, {
      title: intl.get('TABLE_HEAD_STATUS'),
      dataIndex: 'display_status',
      key: 'display_status',
      align: "center",
      render: (text, record) => {
        switch (record.status) {
          case 1: return <span className={styles["status-success"]}>{text}</span>;
          case 2: return <span className={styles["status-failed"]}>{text}</span>;
          case 3: return <span className={`${styles["status-pending"]} ${styles["no-click"]}`}>{text}</span>;
          default: return text;
        }
      }
    }];

    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get("USER_FUND_TRANSFER")}</div>
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
                    onChange={val => {this.setState({platform_code: val})}}>
              <Option value="">{intl.get("USER_SELECT_OPTION_ALL")}</Option>
              {
                this.state.typeOpts.map((item, index) => {
                  return <Option key={`opt${index}`} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_STATUS')}:</div>
            <Select defaultValue="" className={styles["form-elm"]} suffixIcon={<Icon type="caret-down" />}
                    onChange={val => {this.setState({fo_status: val})}}>
              <Option value="">{intl.get("USER_SELECT_OPTION_ALL")}</Option>
              {
                this.state.statusOpts.map((item, index) => {
                  return <Option key={`opt${index}`} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </div>
        </div>
        <div className={styles["btn-wrap"]}>
          <Button loading={this.state.btnLoading} className={styles["btn-primary"]} onClick={this.doSearch}>{intl.get('BTN_CONFIRM')}</Button>
        </div>
      </div>
      <Table dataSource={this.state.dataSource} rowKey={record => record.id} columns={columns}
             locale={{
               emptyText: <div className={styles["table-empty-tip"]}>
                 {intl.get("TABLE_EMPTY_DATA_TIP")}
               </div>
             }}
             pagination={this.state.pagination} onChange={this.handleTableChange} />
    </div>
  }
}

export default connect(state => ({
  ...state
}))(Transfer);