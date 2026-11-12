import React from "react";
import styles from "./dashboard.module.scss";
import reviewLogo from "../../../assets/review-logo.svg";
import userLogo from "../../../assets/user.svg";
import logoutIcon from "../../../assets/user-logout.svg";
import DashBoardBreadCrumb from "./DashBoardBreadCrumb";
import DashBoardContent from "./DashBoardContent";

export default function DashBoard() {
  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <DashBoardBreadCrumb />
        <DashBoardContent />
      </div>
    </div>
  );
}
