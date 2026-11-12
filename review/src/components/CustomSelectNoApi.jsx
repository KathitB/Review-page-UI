import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import style from "./CustomSelect.module.scss";
import addIconExport from "../assets/addIcon.svg";
import inputDropDownIconExport from "../assets/inputDropDownArrow.svg";

const animatedComponents = makeAnimated();

const CustomSelectNoApi = ({
  label,
  options,
  dataIdsArray,
  dataValuesArray,
  errorMessage,
  setDataIdArrayFunc,
  isMandatory,
  formData,
  formError,
  nameKey = "label",
  idKey = "value",

  isMultiSelect,
  placeholder,
  styleOptions,
  needLabel = false,
  setSearch,
  search,
  lastNameKey,
  handleChange,
  selectedValue,
  optionFormat,
  isDisabled,
  clearable = false,
}) => {
  const formattedOptions = options?.map((option) => ({
    value: optionFormat ? option : option?.[idKey],
    label: optionFormat
      ? option
      : option[nameKey] +
        " " +
        `${option?.[lastNameKey] ? option?.[lastNameKey] : ""}`,
  }));

  console.log(options, "dasdkjaskdkas", formattedOptions);

  const [selectedOptions, setSelectedOptions] = useState();

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "white",
      backgroundColor: "transparent",
      "&:hover": {
        color: "white",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      width: "100%",
      display: "flex",
      alignItems: "center",
      backgroundColor: "transparent",
      border: state.isFocused ? "none" : "none",
      boxShadow: state.isFocused ? "none" : "none",
      fontSize: "12px",
      minHeight: "10px",
      "&:hover": {
        border: "none",
      },
    }),

    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "5px",
      padding: "5px",
      zIndex: 9999,
    }),

    option: (provided, state) => ({
      ...provided,
      // background: "white",
      // color: "black",
      backgroundColor: state.isSelected
        ? "#215988"
        : state.isFocused
          ? "#215988"
          : "white",
      color: state.isFocused ? "White" : state.isSelected ? "white" : "black",
      padding: "10px",
      cursor: "pointer",
      borderBottom: "1px solid #d9d9d9",
      fontSize: "12px",
      "&:hover": {
        backgroundColor: "#215988",
        color: "white",
      },
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eef2f7",
      borderRadius: "4px",
      padding: "5px",
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: "12px",
      color: "#333",
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      color: "#999",
      cursor: "pointer",
      "&:hover": {
        color: "#555",
      },
    }),
  };
  const handleInputChange = (value, { action }) => {
    console.log(action, "Daslkjjksdalsdjlkasda");
    if (action === "input-change") {
      setSearch(value);
    } else if (action === "set-value") {
      setSearch(""); // Clear search when an option is selected
    }
  };

  const CustomMultiValueLabel = (props) => {
    const { data } = props; // data has {value, label}
    return (
      <div
        // data-tooltip-id="multiValueTooltip"
        // data-tooltip-content={data.label}
        style={{
          cursor: "default",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "#fffff",
        }}
      >
        {props.children}
      </div>
    );
  };

  return (
    <div
      style={{ ...styleOptions, gap: needLabel ? "5px" : "0px" }}
      className={style.dynamicMultiSelectInput}
    >
      {needLabel && (
        <section>
          <label className="label">
            {label} {isMandatory === "true" && <span>*</span>}
          </label>
        </section>
      )}
      <section className={style.input}>
        <Select
          components={{
            ...animatedComponents,
            MultiValueLabel: CustomMultiValueLabel,
          }}
          options={formattedOptions}
          isMulti={isMultiSelect}
          value={selectedValue}
          onChange={handleChange}
          placeholder={placeholder ? placeholder : "Select options"}
          classNamePrefix="react-select"
          styles={customStyles}
          closeMenuOnSelect={!isMultiSelect}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          menuPlacement="auto"
          isDisabled={isDisabled}
          isClearable={clearable}

          //   onFocus={() => {
          //     setMenuIsOpen(true);
          //     setSearch("");
          //   }}
          //   onBlur={() => {
          //     setMenuIsOpen(false);
          //     setSearch("");
          //   }}
          //   onInputChange={handleInputChange}
        />

        {isMultiSelect ? (
          <img src={addIconExport} alt="" />
        ) : (
          <img
            src={inputDropDownIconExport}
            alt=""
            style={{
              transition: "0.2s",
              transform: menuIsOpen ? "rotate(180deg)" : " rotate(0)",
            }}
          />
        )}
      </section>

      {formError && formData[idKey] === "" && (
        <span className={style.errorMessage}>ⓘ {errorMessage}</span>
      )}
      {/* 
      <Tooltip
        id="multiValueTooltip"
        style={{ padding: "5px", fontSize: "12px" }}
        place="top"
        delayShow={200}
      /> */}
    </div>
  );
};

export default CustomSelectNoApi;
