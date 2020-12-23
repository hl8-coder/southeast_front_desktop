import React, {Component} from "react";
import styles from './content.module.scss';
import intl from "react-intl-universal";
import {Helmet} from "react-helmet";
class FaqModule extends Component {
  elmRef = React.createRef();

  componentDidMount() {
    const {data, match} = this.props;
    const len = match.url.split("/").length;
    const elm = match.url.split("/")[len - 1];
    const offsetTop = this.elmRef.current.offsetTop - 190;
    if (elm === data.id) {
      window.EventBus.emit("FAQ_POSITIONED", offsetTop);
    }
  }
  render() {
    const { data } = this.props;
    return (
      <div className={styles["faq-module"]} ref={this.elmRef} id={data.id}>
        <Helmet>
            <title>{intl.get('SEO_DETAIL_TITLE')}</title>
            <meta name="description" content={intl.get('SEO_DETAIL_DESCRIPTION')} />
            <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help/faqs`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
        </Helmet>
        <div className={styles["faq-module-title"]}>{data.module}</div>
        {
          data.faqs.map((item, index) => <Faq data={item} key={"q" + index}/>)
        }
      </div>
    );
  }
}

class Faq extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isCheck: false
    }
  }

  handleClick() {
    let isCheck = !this.state.isCheck;
    this.setState({
      isCheck: isCheck
    });
  }

  render() {
    const {data} = this.props;
    return (
      <>
        <div className={styles["faq-title"] + " " + (this.state.isCheck ? styles.on : "")} onClick={this.handleClick}>{data.q}</div>
        <div className={styles["faq-content"]}>{data.a}</div>
      </>
    )
  }
}
export default props => {
  const data = [{
    id: "faqs",
    module: intl.get('FAQ_MODULE_1'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_1_1'),
      a: intl.getHTML('FAQ_ANSWER_1_1')
    }, {
      q: intl.get('FAQ_QUESTION_1_2'),
      a: intl.getHTML('FAQ_ANSWER_1_2')
    }, {
      q: intl.get('FAQ_QUESTION_1_3'),
      a: intl.getHTML('FAQ_ANSWER_1_3')
    }]
  }, {
    id: "account",
    module: intl.get('FAQ_MODULE_2'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_2_1'),
      a: intl.getHTML('FAQ_ANSWER_2_1')
    }, {
      q: intl.get('FAQ_QUESTION_2_2'),
      a: intl.getHTML('FAQ_ANSWER_2_2')
    }, {
      q: intl.get('FAQ_QUESTION_2_3'),
      a: intl.getHTML('FAQ_ANSWER_2_3')
    }, {
      q: intl.get('FAQ_QUESTION_2_4'),
      a: intl.getHTML('FAQ_ANSWER_2_4')
    }, {
      q: intl.get('FAQ_QUESTION_2_5'),
      a: intl.getHTML('FAQ_ANSWER_2_5')
    }]
  }, {
    id: "dw",
    module: intl.get('FAQ_MODULE_3'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_3_1'),
      a: intl.getHTML('FAQ_ANSWER_3_1')
    }, {
      q: intl.get('FAQ_QUESTION_3_2'),
      a: intl.getHTML('FAQ_ANSWER_3_2')
    }, {
      q: intl.get('FAQ_QUESTION_3_3'),
      a: intl.getHTML('FAQ_ANSWER_3_3')
    }, {
      q: intl.get('FAQ_QUESTION_3_4'),
      a: intl.getHTML('FAQ_ANSWER_3_4')
    }, {
      q: intl.get('FAQ_QUESTION_3_5'),
      a: intl.getHTML('FAQ_ANSWER_3_5')
    }, {
      q: intl.get('FAQ_QUESTION_3_6'),
      a: intl.getHTML('FAQ_ANSWER_3_6')
    }, {
      q: intl.get('FAQ_QUESTION_3_7'),
      a: intl.getHTML('FAQ_ANSWER_3_7')
    }, {
      q: intl.get('FAQ_QUESTION_3_8'),
      a: intl.getHTML('FAQ_ANSWER_3_8')
    }, {
      q: intl.get('FAQ_QUESTION_3_9'),
      a: intl.getHTML('FAQ_ANSWER_3_9')
    }, {
      q: intl.get('FAQ_QUESTION_3_10'),
      a: intl.getHTML('FAQ_ANSWER_3_10')
    }, {
      q: intl.get('FAQ_QUESTION_3_11'),
      a: intl.getHTML('FAQ_ANSWER_3_11')
    }, {
      q: intl.get('FAQ_QUESTION_3_12'),
      a: intl.getHTML('FAQ_ANSWER_3_12')
    }]
  }, {
    id: "promo",
    module: intl.get('FAQ_MODULE_4'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_4_1'),
      a: intl.getHTML('FAQ_ANSWER_4_1')
    }, {
      q: intl.get('FAQ_QUESTION_4_2'),
      a: intl.getHTML('FAQ_ANSWER_4_2')
    }, {
      q: intl.get('FAQ_QUESTION_4_3'),
      a: intl.getHTML('FAQ_ANSWER_4_3')
    }]
  }, {
    id: "cash",
    module: intl.get('FAQ_MODULE_5'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_5_1'),
      a: intl.getHTML('FAQ_ANSWER_5_1')
    }, {
      q: intl.get('FAQ_QUESTION_5_2'),
      a: intl.getHTML('FAQ_ANSWER_5_2')
    }, {
      q: intl.get('FAQ_QUESTION_5_3'),
      a: intl.getHTML('FAQ_ANSWER_5_3')
    }]
  }, {
    id: "slot",
    module: intl.get('FAQ_MODULE_6'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_6_1'),
      a: intl.getHTML('FAQ_ANSWER_6_1')
    }, {
      q: intl.get('FAQ_QUESTION_6_2'),
      a: intl.getHTML('FAQ_ANSWER_6_2')
    }, {
      q: intl.get('FAQ_QUESTION_6_3'),
      a: intl.getHTML('FAQ_ANSWER_6_3')
    }, {
      q: intl.get('FAQ_QUESTION_6_4'),
      a: intl.getHTML('FAQ_ANSWER_6_4')
    }]
  }, {
    id: "mobile",
    module: intl.get('FAQ_MODULE_7'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_7_1'),
      a: intl.getHTML('FAQ_ANSWER_7_1')
    }, {
      q: intl.get('FAQ_QUESTION_7_2'),
      a: intl.getHTML('FAQ_ANSWER_7_2')
    }, {
      q: intl.get('FAQ_QUESTION_7_3'),
      a: intl.getHTML('FAQ_ANSWER_7_3')
    }, {
      q: intl.get('FAQ_QUESTION_7_4'),
      a: intl.getHTML('FAQ_ANSWER_7_4')
    }]
  }, {
    id: "cs",
    module: intl.get('FAQ_MODULE_8'),
    faqs: [{
      q: intl.get('FAQ_QUESTION_8_1'),
      a: intl.getHTML('FAQ_ANSWER_8_1')
    }, {
      q: intl.get('FAQ_QUESTION_8_2'),
      a: intl.getHTML('FAQ_ANSWER_8_2')
    }, {
      q: intl.get('FAQ_QUESTION_8_3'),
      a: intl.getHTML('FAQ_ANSWER_8_3')
    }, {
      q: intl.get('FAQ_QUESTION_8_4'),
      a: intl.getHTML('FAQ_ANSWER_8_4')
    }]
  }];

  return data.map(item => (
    <FaqModule data={item} key={"module" + item.id} {...props} />
  ));
}
