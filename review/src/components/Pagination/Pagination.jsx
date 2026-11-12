import React, { useEffect, useMemo, useState } from "react";
import "./pagination.scss";

const Pagination = ({
  totalCount,
  setPageIndex,
  setPageSize,
  pageSize,
  pageIndex = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(1);

  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleClick = pageNumber => {
    setCurrentPage(pageNumber);
    setPageIndex(pageNumber);
  };

  const handleChangePageSize = e => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
    setPageIndex(1);
  };

  const goToFunctionChange = e => {
    let numericValue = e.target.value.replace(/(?![0-9])./g, "");
    if (numericValue > totalPages) {
      numericValue = totalPages;
    }
    // if (numericValue < 1) {
    //   numericValue = 1;
    // }
    setValue(numericValue);
    // setCurrentPage(Number(numericValue));
    // setPageIndex(Number(numericValue));
  };

  const goToFunctionClick = e => {
    if (e.key === "Enter") {
      setCurrentPage(Number(value));
      setPageIndex(Number(value));
    }
  };

  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);

  const renderPaginationButtons = useMemo(() => {
    const buttons = [];

    buttons.push(
      <button
        key={1}
        className="pageno"
        onClick={() => handleClick(1)}
        style={{
          border: currentPage === 1 ? "#215988 1px solid" : "#1e1e21",
          color: currentPage === 1 ? "#215988" : "gray",
        }}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      buttons.push(<span key="ellipsis-start">...</span>);
    }

    for (let page = 2; page < totalPages; page++) {
      if (page >= currentPage - 1 && page <= currentPage + 1) {
        buttons.push(
          <button
            key={page}
            className="pageno"
            onClick={() => handleClick(page)}
            style={{
              border:
                currentPage === page ? "#215988 solid 1px" : "#1e1e21",
              color: currentPage === page ? "#215988" : "gray",
              userSelect: "none",
            }}
          >
            {page}
          </button>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      buttons.push(<span key="ellipsis-end">...</span>);
    }

    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className="pageno"
          onClick={() => handleClick(totalPages)}
          style={{
            border:
              currentPage === totalPages
                ? "#215988 1px solid"
                : "#1e1e21",
            color: currentPage === totalPages ? "#215988" : "gray",
          }}
        >
          {totalPages}
        </button>
      );
    }
    return buttons;
  }, [currentPage, totalPages]);

  return (
    <div className="paginationMain">
      <div className="sectionNum">
        <div className="bookingEntriesContainer">
          <p>Show Entries</p>
          <select
            onChange={handleChangePageSize}
            value={pageSize}
            name="entries"
            id=""
          >
            <option value="10" key="option-10">
              10
            </option>
            {totalCount > 10 && (
              <option value="20" key="option-20">
                20
              </option>
            )}
            {totalCount > 20 && (
              <option value="30" key="option-30">
                30
              </option>
            )}
            {totalCount > 30 && (
              <option value="40" key="option-40">
                40
              </option>
            )}
            {totalCount > 40 && (
              <option value="50" key="option-50">
                50
              </option>
            )}
          </select>
        </div>

        {totalCount > pageSize && (
          <div className="pagnation">
            <button
              className={`nextprev ${currentPage === 1 && "disableFirstPage"}`}
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {renderPaginationButtons}

            <button
              className={`nextprev ${
                currentPage === totalPages && "disableLastPage"
              }`}
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="bookingGoToPageContainer">
            <p onClick={goToFunctionClick}>Go to page</p>
            <input
              onChange={goToFunctionChange}
              onKeyDown={goToFunctionClick}
              // onPressEnter={goToFunctionClick}
              type="text"
              value={value}
              // min="1"
              max={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;