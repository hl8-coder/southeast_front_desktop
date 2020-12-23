import React from "react";
import styles from './content.module.scss';
import intl from "react-intl-universal";
import {Helmet} from "react-helmet";

export default () => {
  return <>
    <Helmet>
      <title>{intl.get('SEO_RESPONSIBLE_TITLE')}</title>
      <meta name="description" content={intl.get('SEO_RESPONSIBLE_DESCRIPTION')} />
      <link rel="alternate" href={`${window.location.origin}/${window.location.pathname.split("/")[1]}/help/responsible`} hrefLang={intl.get('SEO_APP_LANGUAGE')} />
    </Helmet>
    <div className={styles.title}>{intl.get('HELP_RESPONSIBLE_TITLE_1')}</div>
    <div className={styles.paragraph + " " + styles.tab}>
      <div className={styles.section}>
        {intl.get('HELP_PARAGRAPH_1')}
      </div>
      <div className={styles.section}>
        {intl.get('HELP_PARAGRAPH_2')}
      </div>
      <ul>
        <li>{intl.get('HELP_PARAGRAPH_LI_1')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_2')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_3')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_4')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_5')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_6')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_7')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_8')}</li>
        <li>{intl.get('HELP_PARAGRAPH_LI_9')}</li>
      </ul>
      <div className={styles.section}>
        {intl.get('HELP_PARAGRAPH_3')}
      </div>
    </div>
    <div className={styles.title}>{intl.get('HELP_RESPONSIBLE_TITLE_2')}</div>
    <div className={styles.paragraph + " " + styles.tab}>
      <div className={[styles.section]}>{intl.get('HELP_PARAGRAPH_4')}</div>
      <div className={styles["web-link"] + " " + styles.tab}>
        <a rel="nofollow noopener noreferrer" href="http://www.gamecare.org.uk" target="_blank">{intl.get('HELP_PARAGRAPH_LINK_1')}</a>
      </div>
      <div className={styles["web-link"] + " " + styles.tab}>
        <a rel="nofollow noopener noreferrer" href="https://www.gamblingtherapy.org" target="_blank">{intl.get('HELP_PARAGRAPH_LINK_2')}</a>
      </div>
    </div>
    <div className={styles.title}>{intl.get('HELP_RESPONSIBLE_TITLE_4')}</div>
    <div className={styles.paragraph + " " + styles.tab}>
      {intl.get('HELP_PARAGRAPH_6')}
    </div>
    <div className={styles.title}>{intl.get('HELP_RESPONSIBLE_TITLE_5')}</div>
    <div className={styles.paragraph + " " + styles.tab}>
      <div className={styles.section}>
        {intl.get('HELP_PARAGRAPH_7')}
      </div>
      <ul>
        <li>{intl.get('HELP_PARAGRAPH_LI_10')} <a rel="nofollow noopener noreferrer" href="https://www.netnanny.com" target="_blank">www.netnanny.com</a></li>
        <li>{intl.get('HELP_PARAGRAPH_LI_11')} <a rel="nofollow noopener noreferrer" href="https://www.cybersitter.com/" target="_blank">www.cybersitter.com</a></li>
      </ul>
    </div>
  </>
}
