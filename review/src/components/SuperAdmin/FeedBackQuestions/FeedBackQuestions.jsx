import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./FeedBackQuestions.module.scss";
import breadcrumbIcon from "../../../assets/menu-burger.svg";
import editIcon from "../../../assets/edit.svg";
import trashIcon from "../../../assets/trash.svg";
import dragIcon from "../../../assets/menu-burger.svg";
import DashBoardBreadCrumb from "../DashBoard/DashBoardBreadCrumb";

const initialQuestions = [
  {
    id: 1,
    title: "Quality of food",
    question: "How would you rate the overall quality of our service?",
    active: true,
  },
  {
    id: 2,
    title: "Menu Variety",
    question: "How would you rate the overall quality of our service?",
    active: true,
  },
  {
    id: 3,
    title: "Friendliness of Staff",
    question: "How would you rate the overall quality of our service?",
    active: true,
  },
  {
    id: 4,
    title: "Promptness of Service",
    question: "How would you rate the overall quality of our service?",
    active: true,
  },
  {
    id: 5,
    title: "Cleanliness & Hygiene",
    question: "How would you rate the overall quality of our service?",
    active: true,
  },
  {
    id: 6,
    title: "Extra Bonus",
    question: "How would you rate the overall quality of our service?",
    active: false,
  },
];

export default function FeedBackQuestions() {
  const [questions] = useState(initialQuestions);

  const columns = useMemo(
    () => [
      {
        id: "drag",
        cell: () => (
          <div className={styles.dragHandle}>
            <img src={dragIcon} alt="" aria-hidden="true" />
          </div>
        ),
      },
      {
        id: "question",
        cell: ({ row }) => (
          <div className={styles.questionText}>
            <strong>{row.original.title}</strong>
            <span>{row.original.question}</span>
          </div>
        ),
      },
      {
        id: "status",
        cell: ({ row }) => (
          <div className={styles.statusArea}>
            <span
              className={
                row.original.active
                  ? styles.statusActive
                  : styles.statusInactive
              }
            >
              {row.original.active ? "Active" : "In active"}
            </span>
            <button type="button" className={styles.iconButton}>
              <img src={editIcon} alt="Edit question" />
            </button>
            <button type="button" className={styles.iconButton}>
              <img src={trashIcon} alt="Delete question" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <DashBoardBreadCrumb />
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              {/* <img
                src={breadcrumbIcon}
                alt=""
                aria-hidden="true"
                className={styles.breadcrumbIcon}
              /> */}
              <h2>Feedback Questions</h2>
            </div>
            <p>Create and manage feedback criteria for users</p>
          </div>
          <button type="button" className={styles.addButton}>
            + Add Question
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>All Questions</h3>
            <p>Drag to reorder, toggle status, or edit questions</p>
          </div>

          <div className={styles.table}>
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className={styles.questionRow}>
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={`${styles.cell} ${styles[cell.column.id] || ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
