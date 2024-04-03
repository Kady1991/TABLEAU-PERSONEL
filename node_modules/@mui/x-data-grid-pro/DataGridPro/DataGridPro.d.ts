import * as React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
import { DataGridProProps } from '../models/dataGridProProps';
export type { GridProSlotsComponent as GridSlots } from '../models';
interface DataGridProComponent {
    <R extends GridValidRowModel = any>(props: DataGridProProps<R> & React.RefAttributes<HTMLDivElement>): React.JSX.Element;
    propTypes?: any;
}
/**
 * Demos:
 * - [DataGridPro](https://mui.com/x/react-data-grid/demo/)
 *
 * API:
 * - [DataGridPro API](https://mui.com/x/api/data-grid/data-grid-pro/)
 */
export declare const DataGridPro: DataGridProComponent;
