import React, {Component} from "react";
import styles from "./content.module.scss";
import intl from "react-intl-universal";
import {connect} from "react-redux";
import {Icon} from "antd";
import Utils from "../../../util/Utils";
import HistoryRequest from "../../../request/History";
import ConfigurationRequest from "../../../request/Configuration";
import {Modal, DatePicker, Table, Select, Button} from "../../../component/basic";
const {Option} = Select;

class Rebate extends Component {
  state = {
    btnLoading: false,
    productOpts: [],
    dataSource: [],
    product_code: "",
    date_from: "",
    date_to: "",
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

  componentDidMount() {
    this.getDropList();
    this.getRebateData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getDropList();
      this.getRebateData();
    }
  }

  getDropList = () => {
    ConfigurationRequest.getDroplist("history_rebate").then(res => {
      this.setState({
        productOpts: res.product
      })
    })
  };

  getRebateData = () => {
    const {btnLoading, dataSource, pagination, productOpts, ...rest} = this.state;
    let params = Utils.adaptParams(rest, true);
    params.page = pagination.current;
    params.per_page = pagination.pageSize;
    HistoryRequest.getRebate(params).then(res => {
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
      this.getRebateData();
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
      btnLoading: true,
    });
    this.getRebateData();
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
      title: intl.get('TABLE_HEAD_PRODUCTS'),
      dataIndex: 'product',
      key: 'product',
      align: "center",
      width: 280
    }, {
      title: intl.get('TABLE_HEAD_TOTAL_ELIFIBLE_BETS'),
      dataIndex: 'calculate_rebate_bet',
      key: 'calculate_rebate_bet',
      align: "center",
      width: 190
    }, {
      title: intl.get('TABLE_HEAD_PRECENT_REFUNDS'),
      dataIndex: 'multipiler',
      key: 'multipiler',
      align: "center",
      width: 190
    }, {
      title: intl.get('TABLE_HEAD_REFUND_AMOUNT'),
      dataIndex: 'amount',
      key: 'amount',
      align: "center"
    }];

    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get("USER_REBATE")}</div>
      </div>
      <div className={styles.conditions}>
        <div className={styles["conditions-wrap"]}>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_FROM')}:</div>
            <DatePicker className={styles["form-elm"]} format="YYYY-MM-DD"
                        placeholder={intl.get("DATEPICKER_PH_SELECT_DATE")}
                        onChange={(date, dateString) => {this.setState({date_from: dateString})}} />
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_TO_DATE')}:</div>
            <DatePicker className={styles["form-elm"]} format="YYYY-MM-DD"
                        placeholder={intl.get("DATEPICKER_PH_SELECT_DATE")}
                        onChange={(date, dateString) => {this.setState({date_to: dateString})}} />
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["form-label"]}>{intl.get('FORM_LABEL_PRODUCT')}:</div>
            <Select defaultValue="" className={styles["form-elm"]} suffixIcon={<Icon type="caret-down" />}
                    onChange={val => {this.setState({product_code: val})}}>
              <Option value="">{intl.get("USER_SELECT_OPTION_ALL")}</Option>
              {
                this.state.productOpts.map((item, index) => {
                  return <Option key={`opt${index}`} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </div>
        </div>
        <div className={`${styles["btn-wrap"]} ${styles.order}`}>
          <Button type="primary" className={styles["btn-primary"]} loading={this.state.btnLoading}
                  onClick={this.doSearch}>{intl.get('BTN_CONFIRM')}</Button>
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
}))(Rebate);
