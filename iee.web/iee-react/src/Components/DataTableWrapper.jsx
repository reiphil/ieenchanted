import React, { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";

DataTable.use(DT);

const DataTableWrapper = (props) => {
  const [tableData, setTableData] = useState([]);
  const [columnDefs, setColumnDefs] = useState({});

  useEffect(() => {
    setTableData(props.tableData);
    setColumnDefs(props.columnDefs);
    console.log(columnDefs);
    console.log(tableData);
  }, [props.tableData]);

  return (
    <DataTable data={tableData} options={{ columns: props.columnDefs, bDestroy: true }}>
      <thead>
        <tr>
          <th>Region</th>
          <th>Store</th>
          <th>Phone</th>
          <th>Address</th>
        </tr>
      </thead>
    </DataTable>
  );
};

export default DataTableWrapper;
