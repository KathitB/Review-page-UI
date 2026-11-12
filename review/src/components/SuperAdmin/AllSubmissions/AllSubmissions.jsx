import React, { useMemo, useState } from "react";
import DashBoardBreadCrumb from "../DashBoard/DashBoardBreadCrumb";
import ReactTable from "../../ReactTable";
import StarRating from "../../ui/StarRating";
import styles from "./AllSubmissions.module.scss";
import dropdownIcon from "../../../assets/inputDropDownArrow.svg";
import questionIcon from "../../../assets/questionmenuicon.svg";
import actionIcon from "../../../assets/allsubmissionaction.svg";
import { allsubmissionGetApi } from "../../Api/udsApi";
import { useQuery } from "@tanstack/react-query";
import { getAPICallFunction } from "../../Reactquery/ReactQuery";
import ShimmerTableLoader from "../../ShimmerTable/ShimmerTableLoader";
import Pagination from "../../Pagination/Pagination";
import SubmissionsCalendar from "./SubmissionsCalendar";

export default function AllSubmissions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [questionFilterOpen, setQuestionFilterOpen] = useState(false);
  const [questionFilter, setQuestionFilter] = useState("All Questions");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: submissionDataList, isFetching: submissisonDataListIsFetching } = useQuery({
    queryKey: ["submissionDataList", pageIndex, pageSize, searchQuery],
    queryFn: async () => {
      const response = await getAPICallFunction({
        url: allsubmissionGetApi,
        params: {
          search: searchQuery,
          page: pageIndex,
          limit: pageSize,
        },
      });
      return response;
    },
  });

  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "username",
        Cell: ({ cell }) => <div>{cell.row.original.username}</div>,
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ cell }) => <div>{cell.row.original.createdAt}</div>,
      },
      {
        Header: "Average Rating",
        accessor: "averageRating",
        Cell: ({ cell }) => (
          <div className={styles.ratingCell}>
            <StarRating
              value={Math.round(cell.row.original.averageRating)}
              readOnly
            />
            <span className={styles.ratingValue}>
              {cell.row.original.averageRating.toFixed(1)}
            </span>
          </div>
        ),
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: () => (
          <button type="button" className={styles.actionButton}>
            <img src={actionIcon} alt="View details" />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <DashBoardBreadCrumb />

        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2>All Submission</h2>
              <p>Create and manage feedback criteria for users</p>
            </div>
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <svg
                  className={styles.searchIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#ff6b2c"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line
                    x1="16.5"
                    y1="16.5"
                    x2="21"
                    y2="21"
                    stroke="#ff6b2c"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search...."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.filterButton}
                  onClick={() => setQuestionFilterOpen((prev) => !prev)}
                >
                  <img src={questionIcon} alt="" aria-hidden="true" />
                  <span>{questionFilter}</span>
                  <img
                    src={dropdownIcon}
                    alt=""
                    aria-hidden="true"
                    className={styles.dropdownIcon}
                  />
                </button>
                {questionFilterOpen && (
                  <div className={styles.dropdownMenu}>
                    {[
                      "All Questions",
                      "Quality of food",
                      "Menu variety",
                      "Staff friendliness",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => {
                          setQuestionFilter(option);
                          setQuestionFilterOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <SubmissionsCalendar />

          <div className={styles.tableWrapper}>
            <div className={styles.table}>
              {submissisonDataListIsFetching ? (
                <ShimmerTableLoader />
              ) : (
                <ReactTable
                  columns={columns}
                  data={submissionDataList?.data?.answers || []}
                  className={styles.table}
                />
              )}
            </div>
          </div>
          <Pagination
            totalCount={submissionDataList?.data?.total}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        </div>
      </div>
    </div>
  );
}
