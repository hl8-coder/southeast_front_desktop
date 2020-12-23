import React from "react";
import styles from "./content.module.scss";
import intl from "react-intl-universal";
import {Helmet} from "react-helmet";

export default () => {
  return <>
    <Helmet>
      <title>{intl.get('SEO_ABOUT_TITLE')}</title>
      <meta name="description" content={intl.get('SEO_ABOUT_TITLE')} />
      <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
    </Helmet>
    <div className={styles["inner-bottom"]}>
      <div className={styles.title}>{intl.get('HELP_ABOUT_TITLE_1')}</div>
      <div className={styles.paragraph}>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_1_1')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_1_2')}
        </div>
      </div>
      <div className={styles.title}>{intl.get('HELP_ABOUT_TITLE_2')}</div>
      <div className={styles.paragraph}>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_2_1')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_2_2')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_2_3')}
        </div>
      </div>
      <div className={styles.title}>{intl.get('HELP_ABOUT_TITLE_3')}</div>
      <div className={styles.paragraph}>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_1')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_1')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_2')}
        </div>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_2')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_3')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_4')}
        </div>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_3')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_5')}
        </div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_6')}
        </div>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_4')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_7')}
        </div>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_5')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_8')}
        </div>
        <div className={styles["num-title"]}>{intl.get('HELP_ABOUT_NUM_TITLE_3_6')}</div>
        <div className={styles.section}>
          {intl.get('HELP_ABOUT_SECTION_3_9')}
        </div>
      </div>
      <div className={styles.title}>{intl.get('HELP_ABOUT_TITLE_4')}</div>
      <div className={styles.paragraph + " " + styles["flex-row"]}>
        <div className={styles["pagcor-logo"]} />
        <div className={styles["flex-unit"]}>
          {intl.get('HELP_ABOUT_FLEX_UNIT_4_1')}
        </div>
      </div>
    </div>
  </>
}
