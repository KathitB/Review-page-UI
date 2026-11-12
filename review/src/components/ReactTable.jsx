import React from "react";
import { useTable } from "react-table";

const ReactTable = ({ columns, data, getRowProps = () => ({}) }) => {
  const { headerGroups, rows, prepareRow } = useTable({ columns, data });
  console.log(columns, "dadaskjdkadka", data);
  return (
    <>
      {
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {headerGroups?.map((headerGroup) => (
              <tr
                style={{
                  position: "sticky",
                  top: 0,
                }}
              >
                {headerGroup?.headers.map((column) => (
                  <th>{column?.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows?.map((row, ind) => {
              prepareRow(row);
              return (
                // <tr {...row.getRowProps()}>
                <tr {...row.getRowProps(getRowProps(row))} key={row.id}>
                  {row.cells.map((cell) => (
                    <td>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      }
      {data?.length == 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "200px",
            alignItems: "center",
            color: "gray",
          }}
        >
          No Data
        </div>
      )}
    </>
  );
};

export default ReactTable;
