import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactTable from "../../ReactTable";
import DashBoardBreadCrumb from "../DashBoard/DashBoardBreadCrumb";
import UserRoutingBar from "../UserRouting/UserRoutingBar";
import UsersCategoryModal from "./UsersCategoryModal";
import styles from "./UsersCategory.module.scss";
import editIcon from "../../../assets/edit.svg";
import trashIcon from "../../../assets/trash.svg";
import DeleteConfirmModal from "../../ui/DeleteConfirmModel";
import {
  deleteAPICallFunction,
  getAPICallFunction,
} from "../../Reactquery/ReactQuery";
import { categoryListGetApi } from "../../Api/udsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { categoryUpdateDeleteApi } from "../../Api/udsApi";
import { toast } from "react-toastify";
import Pagination from "../../Pagination/Pagination";
import ShimmerTableLoader from "../../ShimmerTable/ShimmerTableLoader";
import useStore from "../../../store/store";

export default function UsersCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
   const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
  const setIsLoading =useStore((state) => state.setIsLoading);


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
    data: categoryResponse,
    refetch: categoryDataListRefetch,
    isFetching: categoryDataListIsFetching,
  } = useQuery({
    queryKey: ["categoryDataList", id, pageIndex, pageSize, searchQuery],
    queryFn: async () => {
      
      const response = await getAPICallFunction({
        url: `${categoryListGetApi}/${id}`,
        params: {
          search: searchQuery,
          page: pageIndex,
          limit: pageSize,
        }
      });
      if (response.status.code == 200) {
      }
      return response;
    },
    enabled: id !== "",
  });

  useEffect(() => {
    const apiRows = categoryResponse?.data?.categories || [];
    setRows(apiRows);
  }, [categoryResponse]);

  const categoryDeleteMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await deleteAPICallFunction({
        url: categoryUpdateDeleteApi,
        id: deleteTarget?._id,
      });
      setIsLoading(false);
      if (response.data.status.code == 200) {
        toast.success(response.data.status.message);
        // usersDataListIsFetching();
        setIsDeleteOpen(false);
        setDeleteTarget(null);
        categoryDataListRefetch();
      }
      return response;
    },
  });
  const openDeleteModal = (row) => {
    setDeleteTarget(row);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Dasdjkakjdkjaksd", deleteTarget);
    if (deleteTarget != null) {
      categoryDeleteMutation.mutate();
      return;
    }
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
        (row.name || "").toLowerCase().includes(query) ||
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
      name: values.name || "New Category",
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
        Header: "Category Name",
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
        Cell: ({ cell }) => {
          const statusValue = String(
            cell.row.original.status || "",
          ).toLowerCase();
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
        Header: "Questions",
        id: "questions",
        Cell: ({ row }) => (
          <button
            type="button"
            className={styles.viewButton}
            onClick={() =>
              navigate(`/questions/${row.original._id}?userId=${id}`)
            }
          >
            View
          </button>
        ),
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
    [rows, modalMode, selectedRow, id, navigate],
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
                placeholder="Search Category"
                aria-label="Search category"
                value={searchQuery}
                onChange={(event) => {
                  setPageIndex(1);
                  setSearchQuery(event.target.value)}}
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
               {categoryDataListIsFetching?
              <ShimmerTableLoader 
              rows={3}/>:
              <ReactTable
                columns={columns}
                data={categoryResponse?.data?.category || []}
                className={styles.table}
              />}
            </div>
          </div>
             <Pagination
                  totalCount={categoryResponse?.data?.total}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
        </div>
      </div>

      <UsersCategoryModal
        open={isModalOpen}
        mode={modalMode}
        editData={selectedRow}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        refetch={categoryDataListRefetch}
        id={id}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        text={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this category?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
