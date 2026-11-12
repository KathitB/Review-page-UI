import React, { useEffect, useState } from "react";
import styles from "./UsersFormModal.module.scss";
import CustomSelectNoApi from "../../CustomSelectNoApi";
import { useMutation } from "@tanstack/react-query";
import {
  deleteAPICallFunction,
  patchAPICallFunction,
  postAPICallFunction,
} from "../../Reactquery/ReactQuery";
import { toast } from "react-toastify";
import { userCreateApi, userListDeleteApi } from "../../Api/udsApi";
import useStore from "../../../store/store";

export default function UsersFormModal({
  open,
  mode = "add",
  initialValues,
  onClose,
  refetch,
  editData,
}) {
  console.log(editData, "alkslkdkalslkdas");
  const emptyValues = {
    firstname: "",
    lastname: "",
    email: "",
    client: "",
    mobileNumber: "",
    password: "",
    status: "active",
    role: "0",
  };

  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const setIsLoading =useStore((state) => state.setIsLoading);
  const userCreateMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await postAPICallFunction({
        url: userCreateApi,
        data: values,
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

  const userUpdateMutation = useMutation({
    mutationFn: async () => {
      const response = await patchAPICallFunction({
        url: userListDeleteApi,
        id: editData?._id,
        data: values,
      });
      return response;
    },
    onSuccess: (response) => {
      console.log("Update user response:", response);
      if (response?.data?.status?.code == 200) {
        toast.success(response.data.status.message);
        setValues(emptyValues);
        refetch();
        onClose();
      }
    },
    onError: (error) => {
      console.log("Update user error:", error);
    },
  });

  useEffect(() => {
    if (open) {
      setValues({
        firstname: editData?.firstname,
        lastname: editData?.lastname,
        email: editData?.email,
        mobileNumber: editData?.mobileNumber,
        status: editData?.status,
        role: editData?.role,
        client: editData?.client,
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

  const handleClear = () => {
    setValues({ ...emptyValues });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.firstname.trim()) {
      nextErrors.firstname = "First name is required";
    }
    if (!values.lastname.trim()) {
      nextErrors.lastname = "Last name is required";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Email is required";
    }
    if (!values.client.trim()) {
      nextErrors.client = "Client name is required";
    }
    if (!values.role) {
      nextErrors.role = "Role is required";
    }
    if (!values.status) {
      nextErrors.status = "Status is required";
    }
    if (!values.mobileNumber.trim()) {
      nextErrors.mobileNumber = "Phone number is required";
    }
    if (mode !== "edit") {
      if (!values.password.trim()) {
        nextErrors.password = "Password is required";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    if (mode === "edit") {
      userUpdateMutation.mutate();
      return;
    }
    userCreateMutation.mutate();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.headerBar} />
        <div className={styles.header}>
          <div>
            <h3>{mode === "edit" ? "Edit User" : "Add User"}</h3>
            <p>Create and manage feedback criteria for users</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.divider} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>
                  First Name <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  aria-invalid={Boolean(errors.firstname)}
                />
                {errors.firstname && (
                  <span className={styles.errorText}>{errors.firstname}</span>
                )}
              </label>
              <label className={styles.field}>
                <span className={styles.label}>
                  Last Name <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  aria-invalid={Boolean(errors.lastname)}
                />
                {errors.lastname && (
                  <span className={styles.errorText}>{errors.lastname}</span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </span>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  Client Name <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  name="client"
                  value={values.client}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  aria-invalid={Boolean(errors.client)}
                />
                {errors.client && (
                  <span className={styles.errorText}>{errors.client}</span>
                )}
              </label>
              <CustomSelectNoApi
                nameKey="label"
                idKey="value"
                needLabel={true}
                optionFormat={false}
                selectedValue={[
                  {
                    label: values.role == "0" ? "Admin" : "Manager",
                    value: values.role,
                  },
                ]}
                options={[
                  { label: "Admin", value: "0" },
                  { label: "Manager", value: "1" },
                ]}
                placeholder={"Select Type"}
                label={"Role"}
                handleChange={(selected) => {
                  setValues((prev) => ({
                    ...prev,
                    ["role"]: selected.value,
                  }));
                  if (errors.role) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.role;
                      return next;
                    });
                  }
                }}
                isMultiSelect={false}
                clearable={false}
              />
              {errors.role && (
                <span className={styles.errorText}>{errors.role}</span>
              )}
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
                  if (errors.status) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.status;
                      return next;
                    });
                  }
                }}
                isMultiSelect={false}
                clearable={false}
              />
              {errors.status && (
                <span className={styles.errorText}>{errors.status}</span>
              )}
              <label className={styles.field}>
                <span className={styles.label}>
                  Phone Number <span className={styles.required}>*</span>
                </span>
                <input
                  type="text"
                  name="mobileNumber"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  aria-invalid={Boolean(errors.mobileNumber)}
                />
                {errors.mobileNumber && (
                  <span className={styles.errorText}>
                    {errors.mobileNumber}
                  </span>
                )}
              </label>
              <label className={styles.field}>
                <span className={styles.label}>
                  Password <span className={styles.required}>*</span>
                </span>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && (
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </label>
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
              {mode === "edit" ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
