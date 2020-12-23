import React from "react";
import styles from "./content.module.scss";
import intl from "react-intl-universal";
import {Helmet} from "react-helmet";

export default () => {
  return <>
    <Helmet>
      <title>{intl.get('SEO_TERMS_TITLE')}</title>
      <meta name="description" content={intl.get('SEO_TERMS_DESCRIPTION')} />
      <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help/terms`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
    </Helmet>
    <div className={styles["inner-bottom"]}>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_1')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl2"]} type="1">
          <li>{intl.get('HELP_TERMS_LI_1_1')}</li>
          <li>{intl.get('HELP_TERMS_LI_1_2')}</li>
          <li>{intl.get('HELP_TERMS_LI_1_3')}</li>
          <li>{intl.get('HELP_TERMS_LI_1_4')}</li>
          <li>{intl.get('HELP_TERMS_LI_1_5')}</li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_2')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl1"]} type="I">
          <li>
            {intl.get('HELP_TERMS_LI_2_0')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_2_1')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_2')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_3')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_4')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_5')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_6')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_7')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_8')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_9')}</li>
              <li>{intl.get('HELP_TERMS_LI_2_10')}</li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_3_0')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_3_1')}</li>
              <li>{intl.get('HELP_TERMS_LI_3_2')}</li>
              <li>{intl.get('HELP_TERMS_LI_3_3')}</li>
              <li>{intl.get('HELP_TERMS_LI_3_4')}</li>
              <li>{intl.get('HELP_TERMS_LI_3_5')}</li>
              <li>{intl.get('HELP_TERMS_LI_3_6')}</li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_4_0')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>
                {intl.get('HELP_TERMS_LI_4_1')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_4_2')}</li>
                  <li>{intl.get('HELP_TERMS_LI_4_3')}</li>
                  <li>{intl.get('HELP_TERMS_LI_4_4')}</li>
                  <li>{intl.get('HELP_TERMS_LI_4_5')}</li>
                </ol>
              </li>
              <li>{intl.get('HELP_TERMS_LI_4_6')}</li>
            </ol>
          </li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_3')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl1"]} type="I">
          <li>
            {intl.get('HELP_TERMS_LI_5_1')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>
                {intl.get('HELP_TERMS_LI_5_2')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_5_3')}</li>
                  <li>{intl.get('HELP_TERMS_LI_5_4')}</li>
                  <li>{intl.get('HELP_TERMS_LI_5_5')}</li>
                  <li>{intl.get('HELP_TERMS_LI_5_6')}</li>
                </ol>
              </li>
              <li>{intl.get('HELP_TERMS_LI_5_7')}</li>
              <li>
                {intl.get('HELP_TERMS_LI_5_8')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_5_9')}</li>
                  <li>{intl.get('HELP_TERMS_LI_5_10')}</li>
                </ol>
              </li>
              <li>{intl.get('HELP_TERMS_LI_5_11')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_12')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_13')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_14')}</li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_5_15')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_5_16')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_17')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_18')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_19')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_20')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_21')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_22')}</li>
              <li>{intl.get('HELP_TERMS_LI_5_23')}</li>
            </ol>
          </li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_4')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl2"]} type="1">
          <li>{intl.get('HELP_TERMS_LI_6_1')}</li>
          <li>{intl.get('HELP_TERMS_LI_6_2')}</li>
          <li>{intl.get('HELP_TERMS_LI_6_3')}</li>
          <li>{intl.get('HELP_TERMS_LI_6_4')}</li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_5')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl1"]} type="I">
          <li>
            {intl.get('HELP_TERMS_LI_7_1')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_7_2')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_3')}</li>
              <li>
                {intl.get('HELP_TERMS_LI_7_4')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_7_5')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_6')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_7')}</li>
                </ol>
              </li>
              <li>{intl.get('HELP_TERMS_LI_7_8')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_9')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_10')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_11')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_12')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_13')}</li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_7_14')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_7_15')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_16')}</li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_7_17')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_7_18')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_19')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_20')}</li>
              <li>
                {intl.get('HELP_TERMS_LI_7_21')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_7_22')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_23')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_24')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_25')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_26')}</li>
                  <li>{intl.get('HELP_TERMS_LI_7_27')}</li>
                </ol>
              </li>
              <li>{intl.get('HELP_TERMS_LI_7_28')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_29')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_30')}</li>
              <li>{intl.get('HELP_TERMS_LI_7_31')}</li>
            </ol>
          </li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_6')}</div>
      <div className={styles.paragraph}>
        {intl.get('HELP_TERMS_LI_8_1')}
        <ol className={styles["ol-lvl1"]} type="I">
          <li>
            {intl.get('HELP_TERMS_LI_8_2')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_8_3')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_4')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_5')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_6')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_7')}</li>
              <li>
                {intl.get('HELP_TERMS_LI_8_8')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_8_9')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_10')}</li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_8_11')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>
                {intl.get('HELP_TERMS_LI_8_12')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_8_13')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_14')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_15')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_16')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_17')}</li>
                </ol>
              </li>
              <li>
                {intl.get('HELP_TERMS_LI_8_18')}
                <ol className={styles["ol-lvl3"]} type="a">
                  <li>{intl.get('HELP_TERMS_LI_8_19')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_20')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_21')}</li>
                  <li>{intl.get('HELP_TERMS_LI_8_22')}</li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            {intl.get('HELP_TERMS_LI_8_23')}
            <ol className={styles["ol-lvl2"]} type="1">
              <li>{intl.get('HELP_TERMS_LI_8_24')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_25')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_26')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_27')}</li>
              <li>{intl.get('HELP_TERMS_LI_8_28')}</li>
            </ol>
          </li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_7')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl2"]} type="1">
          <li>{intl.get('HELP_TERMS_LI_9_1')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_2')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_3')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_4')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_5')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_6')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_7')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_8')}</li>
          <li>{intl.get('HELP_TERMS_LI_9_9')}</li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_8')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl2"]} type="1">
          <li>{intl.get('HELP_TERMS_LI_10_1')}</li>
          <li>{intl.get('HELP_TERMS_LI_10_2')}</li>
          <li>{intl.get('HELP_TERMS_LI_10_3')}</li>
          <li>{intl.get('HELP_TERMS_LI_10_4')}</li>
        </ol>
      </div>
      <div className={styles.title}>{intl.get('HELP_TERMS_TITLE_9')}</div>
      <div className={styles.paragraph}>
        <ol className={styles["ol-lvl2"]} type="1">
          <li>{intl.get('HELP_TERMS_LI_11_1')}</li>
          <li>{intl.get('HELP_TERMS_LI_11_2')}</li>
          <li>{intl.get('HELP_TERMS_LI_11_3')}</li>
        </ol>
      </div>
    </div>
  </>
}
