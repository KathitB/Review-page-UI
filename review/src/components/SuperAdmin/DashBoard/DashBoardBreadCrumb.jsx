import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DashBoardBreadCrumb.module.scss";
import useStore from "../../../store/store";
import CustomSelectNoApi from "../../CustomSelectNoApi";
import CustomSelect from "../../CustomSelect";
import { getAPICallFunction } from "../../Reactquery/ReactQuery";
import { useQuery } from "@tanstack/react-query";
import { clientListGetApi, userListGetApi } from "../../Api/udsApi";

export default function DashBoardBreadCrumb() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useStore((state) => state.user.user);
  const tabSelected = useStore((state) => state.tabSelected);
  const setTabSelected = useStore((state) => state.setTabSelected);
  const [search, setSearch] = useState("");
  const setSelectedClient = useStore((state) => state.setSelectedClient);
  const selectedClient = useStore((state) => state.selectedClient);

  const {
    data: clientDataList,
    refetch: clientDataListRefetch,
    isFetching: clientDataListIsFetching,
  } = useQuery({
    queryKey: ["clientDataList", search],
    queryFn: async () => {
      const response = await getAPICallFunction({
        url: clientListGetApi,
        params: {
          search: search,
        },
      });
      if (response.status.code == 200) {
        if (selectedClient == null) {
          setSelectedClient({
            label: response?.data?.[0]?.client,
            value: response?.data?.[0]?._id,
          });
        }
      }
      return response;
    },
  });
  // useEffect(() => {
  //   if(clientDataList){
  //     setSelectedClient({
  //       label:clientDataList?.data?.[0]?.client,
  //       value:clientDataList?.data?.[0]?._id
  //     })
  //   }
  // },[clientDataList])
  console.log("askdkajdkasj", clientDataList, selectedClient);

  const roleBasedItem =
    user?.role === "0"
      ? {
          label: "Users",
          path: "/users",
          activeBase: "/users",
        }
      : {
          label: "Category",
          path: `/category/${user?._id}`,
          activeBase: "/category",
        };

  const items = [
    {
      label: "Dashboard",
      path: "/dashboard",
      activeBase: "/dashboard",
    },
    {
      label: "All Submission",
      path: "/allsubmissions", // give proper path instead of null
      activeBase: "/allsubmissions",
    },
    roleBasedItem,
  ];

  return (
    <nav className={styles.breadcrumbOutline}>
      <div className={styles.breadcrumbInline}>
        {items.map((item) => {
          // const isActive =
          //   item.activeBase && pathname.startsWith(item.activeBase);
          return (
            <button
              key={item.label}
              className={`${styles.breadcrumbField} ${
                tabSelected == item.label ? styles.active : ""
              }`}
              type="button"
              onClick={() => {
                if (item.path) {
                  setTabSelected(item.label);
                  navigate(item.path);
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className={styles.rightContent}>
        <CustomSelect
          nameKey="client"
          idKey="_id"
          needLabel={false}
          optionFormat={false}
          selectedValue={selectedClient}
          options={clientDataList?.data}
          placeholder={"Select Type"}
          label={"Role"}
          handleChange={(selected) => {
            setSelectedClient(selected);
          }}
          isMultiSelect={false}
          clearable={false}
          setSearch={setSearch}
          search={search}
        />
      </div>
    </nav>
  );
}
