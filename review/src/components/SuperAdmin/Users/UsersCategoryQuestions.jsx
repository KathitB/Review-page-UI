import React, { useMemo, useState, useEffect } from "react";
import DashBoardBreadCrumb from "../DashBoard/DashBoardBreadCrumb";
import UserRoutingBar from "../UserRouting/UserRoutingBar";
import UsersQuestionsModal from "./UsersQuestionsModal";
import styles from "./UsersCategoryQuestions.module.scss";
import editIcon from "../../../assets/edit.svg";
import trashIcon from "../../../assets/trash.svg";
import DeleteConfirmModal from "../../ui/DeleteConfirmModel";
import {
  deleteAPICallFunction,
  getAPICallFunction,
} from "../../Reactquery/ReactQuery";
import { questionGetApi, questionDeleteApi } from "../../Api/udsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ReactTable from "../../ReactTable";
import { toast } from "react-toastify";
import ShimmerTableLoader from "../../ShimmerTable/ShimmerTableLoader";
import Pagination from "../../Pagination/Pagination";
import useStore from "../../../store/store";
export default function UsersCategoryQuestions() {
  const { categoryId } = useParams();
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const setIsLoading =useStore((state) => state.setIsLoading);


     const [pageIndex, setPageIndex] = useState(1);
      const [pageSize, setPageSize] = useState(10);


  const openAddModal = () => {
    setSelectedRow(null);
    setModalMode("add");
    setIsModalOpen(true);
  };


  const openEditModal = (row) => {
    setSelectedRow(row);
    setModalMode("edit");
    setIsModalOpen(true);
  };


  // const openDeleteModal = (row) => {
  //   setDeleteTarget(row);
  //   setIsDeleteOpen(true);
  // };


  const {
    data: questionResponse,
    refetch: questionDataListRefetch,
    isFetching: questionDataListIsFetching,
  } = useQuery({
    queryKey: ["QuestionDataList", categoryId, pageIndex, pageSize, searchQuery],
    queryFn: async () => {
      const response = await getAPICallFunction({
        url: `${questionGetApi}/${categoryId}`,
        params: {
          search: searchQuery,
          page: pageIndex,
          limit: pageSize,
        },
      });
      if (response.status.code == 200) {
      }
      return response;
    },
    enabled: categoryId !== "",
  });


  useEffect(() => {
    const apiRows = questionResponse?.data?.questions || [];
    setRows(apiRows);
  }, [questionResponse]);


  const questionDeleteMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await deleteAPICallFunction({
        url: questionDeleteApi,
        id: deleteTarget?._id,
      });
      if (response.data.status.code == 200) {
        toast.success(response.data.status.message);
        // usersDataListIsFetching();
        setIsDeleteOpen(false);
        setDeleteTarget(null);
        questionDataListRefetch();
      }
      setIsLoading(false);
      return response;
    },
  });
  const openDeleteModal = (row) => {
    setDeleteTarget(row);
    setIsDeleteOpen(true);
  };


  const handleDeleteConfirm = () => {
    if (deleteTarget != null) {
      questionDeleteMutation.mutate();
      return;
    }
    // setRows((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };


  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return rows;
    }
    return rows.filter((row) => {
      return (
        (row.question || "").toLowerCase().includes(query) ||
        (row.description || "").toLowerCase().includes(query) ||
        (row.status || "").toLowerCase().includes(query)
      );
    });
  }, [rows, searchQuery]);


  const handleSubmit = (values) => {
    if (modalMode === "edit" && selectedRow) {
      setRows((prev) =>
        prev.map((item) =>
          item.id === selectedRow.id ? { ...item, ...values } : item,
        ),
      );
      return;
    }


    const nextId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    const newRow = {
      id: nextId,
      question: values.question || "New Question",
      description: values.description || "New description",
      status: values.status,
    };
    setRows((prev) => [newRow, ...prev]);
  };


  const columns = useMemo(
    () => [
        {
        Header: "S No",
        accessor: (row, i) => (pageIndex - 1) * pageSize + i + 1,
        id: "serial",
      },
      {
        Header: "Question",
        accessor: "name",
        Cell: ({ cell }) => <div>{cell.row.original.name}</div>,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell }) => <div>{cell.row.original.description}</div>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const statusValue = String(row.original.status || "").toLowerCase();
          const isActive = statusValue === "active";
          return (
            <div className={styles.statusCell}>
              <span
                className={
                  isActive ? styles.statusActive : styles.statusInactive
                }
              >
                {isActive ? "Active" : "In active"}
              </span>
              <span
                className={`${styles.statusToggle} ${
                  isActive ? styles.toggleActive : styles.toggleInactive
                }`}
                aria-hidden="true"
              />
            </div>
          );
        },
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => (
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => openEditModal(row.original)}
            >
              <img src={editIcon} alt="Edit" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => openDeleteModal(row.original)}
            >
              <img src={trashIcon} alt="Delete" />
            </button>
          </div>
        ),
      },
    ],
    [questionResponse],
  );


  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <DashBoardBreadCrumb />
        <UserRoutingBar />


        <div className={styles.card}>
          <div className={styles.toolbar}>
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
                placeholder="Search Questions"
                aria-label="Search questions"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={openAddModal}
            >
              Add
            </button>
          </div>


          <div className={styles.tableWrapper}>
            <div className={styles.table}>
              {questionDataListIsFetching?
            <ShimmerTableLoader 
              rows={3}/>:
            

            <ReactTable
              columns={columns}
              data={questionResponse?.data?.questions}
              className={styles.table}
              />}
              </div>
          </div>
            <Pagination
                  totalCount={questionResponse?.data?.total}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
        </div>
      </div>


      <UsersQuestionsModal
        open={isModalOpen}
        mode={modalMode}
        // ini={selectedRow}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        refetch={questionDataListRefetch}
        editData={selectedRow}
        categoryId={categoryId}
      />


      <DeleteConfirmModal
        open={isDeleteOpen}
        text={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this question?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}


