import React from "react";
import styles from "./navbar.module.scss";
import reviewLogo from "../../assets/review-logo.svg";
import logout from "../../assets/user-logout.svg";
import useStore from "../../store/store";

const Navbar = () => {
  const user = useStore((state) => state.user.user);
  console.log(user, "dkllkslkdakklad");
  return (
    <div>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <img src={reviewLogo} alt="" aria-hidden="true" />
          </span>
          <span className={styles.brandText}>Feedback Hub</span>
        </div>
        <div className={styles.userSection}>
          <div className={styles.userBadge}>
            {/* <img src={userLogo} alt="User avatar" /> */}
            {user.firstname.slice(0, 1).toUpperCase() +
              user.lastname.slice(0, 1).toUpperCase()}
          </div>
          <span className={styles.userName}>
            {user.firstname + " " + user.lastname}
          </span>

          <div className={styles.logout}>
            <img src={logout} className={styles.logouticon} alt="logouticon" />
            <span className={styles.logouttext}>Log out</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
