import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./UserRoutingBar.module.scss";

export default function UserRoutingBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const userIdFromQuery = searchParams.get("userId");
  const resolvedUserId = id || userIdFromQuery;

  const crumbs = useMemo(() => {
    const isCategoryRoute = location.pathname.startsWith("/category/");
    const isQuestionsRoute = location.pathname.startsWith("/questions/");

    if (isQuestionsRoute) {
      return [
        { label: "User", path: "/users" },
        {
          label: "Category",
          path: resolvedUserId ? `/category/${resolvedUserId}` : null,
        },
        { label: "Questions", path: null },
      ];
    }

    if (isCategoryRoute) {
      return [
        { label: "User", path: "/users" },
        { label: "Category", path: null },
      ];
    }

    return [{ label: "User", path: null }];
  }, [location.pathname, resolvedUserId]);

  return (
    <nav className={styles.routingCrumb} aria-label="User routing breadcrumb">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const canNavigate = Boolean(crumb.path) && !isLast;

        return (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {canNavigate ? (
              <button
                type="button"
                className={styles.crumbLink}
                onClick={() => navigate(crumb.path)}
              >
                {crumb.label}
              </button>
            ) : (
              <span className={isLast ? styles.currentCrumb : styles.crumbText}>
                {crumb.label}
              </span>
            )}
            {!isLast && <span className={styles.separator}>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
