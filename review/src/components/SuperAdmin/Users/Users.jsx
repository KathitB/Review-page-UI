import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DashBoardBreadCrumb from "../DashBoard/DashBoardBreadCrumb";
import UserRoutingBar from "../UserRouting/UserRoutingBar";
import UsersFormModal from "./UsersFormModal";
import styles from "./Users.module.scss";
import editIcon from "../../../assets/edit.svg";
import trashIcon from "../../../assets/trash.svg";
import {
  deleteAPICallFunction,
  getAPICallFunction,
} from "../../Reactquery/ReactQuery";
import { userListDeleteApi, userListGetApi } from "../../Api/udsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ReactTable from "../../ReactTable";
import DeleteConfirmModal from "../../ui/DeleteConfirmModel";
import Pagination from "../../Pagination/Pagination";
import ShimmerTableLoader from "../../ShimmerTable/ShimmerTableLoader";
import useStore from "../../../store/store";

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const buildEmail = (firstName, lastName) => {
  const safeFirst = firstName.trim().toLowerCase() || "user";
  const safeLast = lastName.trim().toLowerCase() || "demo";
  return `${safeFirst}.${safeLast}@demo.com`;
};

export default function UsersPage() {
  const navigate = useNavigate();
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
  const {
    data: usersDataList,
    refetch: usersDataListRefetch,
    isFetching: usersDataListIsFetching,
  } = useQuery({
    queryKey: ["usersDataList", pageIndex, pageSize, searchQuery],
    queryFn: async () => {
      const response = await getAPICallFunction({
        url: userListGetApi,
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
  });
  const userDeleteMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await deleteAPICallFunction({
        url: userListDeleteApi,
        id: deleteTarget?._id,
      });
      setIsLoading(false);
      if (response.data.status.code == 200) {
        toast.success(response.data.status.message);
        // usersDataListIsFetching();
        setIsDeleteOpen(false);
        setDeleteTarget(null);
        usersDataListRefetch();
      }
      return response;
    },
  });
  const openDeleteModal = (row) => {
    setDeleteTarget(row);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget != null) {
      userDeleteMutation.mutate();
      return;
    }
    setDeleteTarget(null);
    setIsDeleteOpen(false);
  };

  // const filteredRows = useMemo(() => {
  //   const query = searchQuery.trim().toLowerCase();
  //   if (!query) {
  //     return rows;
  //   }
  //   return rows.filter((row) => {
  //     return (
  //       row.name.toLowerCase().includes(query) ||
  //       row.email.toLowerCase().includes(query) ||
  //       row.clientName.toLowerCase().includes(query) ||
  //       row.number.toLowerCase().includes(query) ||
  //       row.status.toLowerCase().includes(query)
  //     );
  //   });
  // }, [rows, searchQuery]);

  const columns = useMemo(
    () => [
        {
        Header: "S No",
        accessor: (row, i) => (pageIndex - 1) * pageSize + i + 1,
        id: "serial",
      },
      {
        Header: "Name",
        accessor: "firstname",
        Cell: ({ cell }) => {
          return (
            <div>
              {console.log(cell.row.original.firstname, "dslkklsdflkskldf")}
              {cell.row.original.firstname +" "+ cell.row.original.lastname}
            </div>
          );
        },
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ cell }) => {
          return <div>{cell.row.original.email}</div>;
        },
      },
      {
        Header: "Client",
        accessor: "client",
        Cell: ({ cell }) => {
          return <div>{cell.row.original.client}</div>;
        },
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ cell }) => {
          return <div>{cell.row.original.createdAt}</div>;
        },
      },
      {
        Header: "Number",
        accessor: "mobileNumber",
        Cell: ({ cell }) => {
          return <div>{cell.row.original.mobileNumber}</div>;
        },
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ cell }) => (
          <div className={styles.statusCell}>
            <span
            // className={
            //   cell.row.original.status === "0"
            //     ? styles.statusActive
            //     : styles.statusInactive
            // }
            >
              {cell.row.original.role === "0" ? "Admin" : "Manager"}
            </span>
            {/* <span
            // className={`${styles.statusToggle} ${
            //   cell.row.original.status === "0"
            //     ? styles.toggleActive
            //     : styles.toggleInactive
            // }`}
            // aria-hidden="true"
            /> */}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell }) => (
          <div className={styles.statusCell}>
            <span
              className={
                cell.row.original.status === "active"
                  ? styles.statusActive
                  : styles.statusInactive
              }
            >
              {cell.row.original.status === "active" ? "Active" : "In active"}
            </span>
            <span
              className={`${styles.statusToggle} ${
                cell.row.original.status === "active"
                  ? styles.toggleActive
                  : styles.toggleInactive
              }`}
              aria-hidden="true"
            />
          </div>
        ),
      },
      {
        Header: "Category",
        id: "category",
        Cell: ({ row }) => (
          <button
            type="button"
            className={styles.viewButton}
            onClick={() =>
              navigate(`/category/${row.original._id}`)
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
    [usersDataList],
  );

  // const table = useReactTable({
  //   data: filteredRows,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

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
                placeholder="Search BranchMaster"
                aria-label="Search users"
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
              {usersDataListIsFetching?
              <ShimmerTableLoader 
              rows={3}/>:

              <ReactTable
                columns={columns}
                data={usersDataList?.data?.users || []}
                className={styles.table}
              />}
            </div>
          </div>
              <Pagination
                  totalCount={usersDataList?.data?.total}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
        </div>
      </div>

      <UsersFormModal
        open={isModalOpen}
        mode={modalMode}
        editData={selectedRow}
        onClose={() => setIsModalOpen(false)}
        // onSubmit={handleSubmit}
        refetch={usersDataListRefetch}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        text={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstname || ""} ${
                deleteTarget.lastname || ""
              }?`
            : "Are you sure you want to delete this user?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
