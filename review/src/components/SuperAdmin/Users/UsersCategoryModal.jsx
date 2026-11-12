import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./UsersCategoryModal.module.scss";
import CustomSelectNoApi from "../../CustomSelectNoApi";
import { categoryCreateApi } from "../../Api/udsApi";
import { useMutation } from "@tanstack/react-query";
// import { useMutation } from "@tanstack/react-query";
import {
  deleteAPICallFunction,
  patchAPICallFunction,
  postAPICallFunction,
} from "../../Reactquery/ReactQuery";
// import { toast } from "react-toastify";
import { categoryUpdateDeleteApi } from "../../Api/udsApi";
import useStore from "../../../store/store";

const emptyValues = {
  name: "",
  description: "",
  status: "Active",
};

export default function UsersCategoryModal({
  //   open,
  //   mode = "add",
  //   initialValues,
  //   onClose,
  //   onSubmit,
  //   refetch,
  //   editData
  // }) {
  //   const [values, setValues] = useState(emptyValues);
  //   const [errors, setErrors] = useState({});

  //   useEffect(() => {
  //     if (open) {
  //       setValues({ ...emptyValues, ...initialValues });
  //       setErrors({});
  //     }
  //   }, [open, initialValues]);

  //   if (!open) {
  //     return null;
  //   }

  open,
  mode = "add",
  initialValues,
  onClose,
  onSubmit,
  refetch,
  editData,
  id,
}) {
  console.log(editData, "alkslkdkalslkdas");
  const emptyValues = {
    name: "",
    description: "",
    // email: "",
    // client: "",
    // mobileNumber: "",
    // password: "",
    status: "active",
    // role: "0",
  };

  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const setIsLoading = useStore((state) => state.setIsLoading);
  const categoryCreateMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await postAPICallFunction({
        url: categoryCreateApi,
        // id:id,
        data: {...values,managerId:id},
      });
      setIsLoading(false);
      if (response.data.status.code == 201) {
        toast.success(response.data.status.message);
        setValues(emptyValues);
        onClose();
        refetch();
      }
      return response;
    },
  });

  const categoryUpdateMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await patchAPICallFunction({
        url: categoryUpdateDeleteApi,
        id: editData?._id,
        data: values,
      });
      setIsLoading(false);
      if (response.data.status.code == 200) {
        toast.success(response.data.status.message);
        setValues(emptyValues);

        onClose();
        refetch();
      }
      return response;
    },
   
    onError: (error) => {
      console.log("Update user error:", error);
    },
  });

  useEffect(() => {
    if (open) {
      setValues({
        name: editData?.name,
        description: editData?.description,
        // email: editData?.email,
        // mobileNumber: editData?.mobileNumber,
        status: editData?.status,
        // role: editData?.role,
        // client: editData?.client,
      });
    }
  }, [editData]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // const handleAutoGrow = (event) => {
  //   const element = event.target;
  //   element.style.height = "auto";
  //   element.style.height = ${element.scrollHeight}px;
  //   if (errors.description) {
  //     setErrors((prev) => {
  //       const next = { ...prev };
  //       delete next.description;
  //       return next;
  //     });
  //   }
  // };

  const handleClear = () => {
    setValues({ ...emptyValues });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = "Category name is required";
    }
    if (!values.description.trim()) {
      nextErrors.description = "Description is required";
    }
    if (!values.status) {
      nextErrors.status = "Status is required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (onSubmit) {
      onSubmit(values);
    }
    // toast.success(
    //   mode === "edit"
    //     ? "Category updated successfully"
    //     : "Category added successfully",
    // );
    if (mode === "edit") {
      console.log(mode, "dlskfklsdlkf");
      categoryUpdateMutation.mutate();
      return;
    }
    categoryCreateMutation.mutate();

    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.headerBar} />
        <div className={styles.header}>
          <div>
            <h3>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>
            <p>Create and manage feedback criteria for users</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>
        <div className={styles.divider} />

        {console.log(values, "slkdlksks", editData)}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className="label">
                  Category Name <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </label>
              <label className={styles.field}>
                <span className="label">
                  Description <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  rows={2}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  // onInput={handleAutoGrow}
                  placeholder="Enter description"
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description && (
                  <span className={styles.errorText}>{errors.description}</span>
                )}
              </label>
              <CustomSelectNoApi
                nameKey="label"
                idKey="value"
                needLabel={true}
                optionFormat={false}
                selectedValue={[
                  {
                    label: values.status == "active" ? "Active" : "Inactive",
                    value: values.status,
                  },
                ]}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                placeholder={"Select Type"}
                label={"Status"}
                handleChange={(selected) => {
                  setValues((prev) => ({
                    ...prev,
                    ["status"]: selected.value,
                  }));
                }}
                isMultiSelect={false}
                clearable={false}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
            >
              Clear
            </button>
            <button type="submit" className={styles.submitButton}>
              {mode === "edit" ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
