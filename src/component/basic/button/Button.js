import React from "react";
import styles from "./button.module.scss";

export default props => {
  const {
    type = "default",
    loading = false,
    onClick,
    disabled,
    className,
    children,
    icon,
    ...rest
  } = props;

  const onClickFn = (loading || disabled) ? () => {} : onClick;

  const config = {
    className: `${styles["hl8-btn"]} ${styles["btn-" + type]} ${icon ? styles["with-icon"] : ""} ${loading ? styles.loading : ""} ${className || ""}`,
    onClick: onClickFn,
    disabled,
    ...rest
  };

  return <button type="button" {...config}>
    {
      loading ? <div className={styles.spinner}>
        <div className={styles.bounce1} />
        <div className={styles.bounce2} />
        <div />
      </div>
      :
      <>
        {icon}
        {children}
      </>
    }
  </button>
}