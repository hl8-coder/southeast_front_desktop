import React, {Component} from "react";
import styles from "./content.module.scss";
import moment from "moment";
import {connect} from "react-redux";
import intl from "react-intl-universal";
import Utils from "../../../util/Utils";
import HistoryRequest from "../../../request/History";
import {Modal, DatePicker, Table, Button} from "../../../component/basic";

class Claim extends Component {
  state = {
    btnLoading: false,
    dataSource: [],
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
    this.getPromoClaimData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevLanKey = prevProps.language.currentLanKey;
    const thisLan = this.props.language;
    const thisLanKey = thisLan.currentLanKey;
    if (prevLanKey !== thisLanKey) {
      this.getPromoClaimData();
    }
  }

  getPromoClaimData = () => {
    const {btnLoading, dataSource, pagination, ...rest} = this.state;
    let params = Utils.adaptParams(rest, true);
    params.page = pagination.current;
    params.per_page = pagination.pageSize;
    HistoryRequest.getPromoClaim(params).then(res => {
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
      this.getPromoClaimData();
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
    this.getPromoClaimData();
  };

  render() {
    const columns = [{
      title: intl.get('TABLE_HEAD_NUMBER'),
      dataIndex: 'id',
      key: 'id',
      align: "center",
      width: 140
    }, {
      title: intl.get('TABLE_HEAD_DATE_AND_TIME'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: "center",
      width: 300,
      render: text => {
        const element = text.split(" ");
        return <>
          <div className={styles["table-date"]}>{element[0]}</div>
          <div className={styles["table-time"]}>{element[1]}</div>
        </>;
      }
    }, {
      title: intl.get('TABLE_HEAD_CODE_PROMOTION_ID'),
      dataIndex: 'code',
      key: 'code',
      align: "center",
      width: 250
    }, {
        title: intl.get('TABLE_HEAD_STATUS'),
        dataIndex: 'status',
        key: 'status',
        align: "center"
    }];

    return <div className={styles["panel-content"]}>
      <div className={styles["content-header"]}>
        <div className={styles.title}>{intl.get("USER_PROMO_CLAIM")}</div>
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
        </div>
        <div className={styles["btn-wrap"]}>
          <Button type="primary" loading={this.state.btnLoading} className={styles["btn-primary"]}
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
}))(Claim);
