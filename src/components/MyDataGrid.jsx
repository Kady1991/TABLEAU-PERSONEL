import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function MyDataGrid({ rows, columns }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        components={{
          Toolbar: GridToolbar,
        }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
