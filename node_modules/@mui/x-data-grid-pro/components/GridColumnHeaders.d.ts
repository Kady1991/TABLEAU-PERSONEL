import * as React from 'react';
import { UseGridColumnHeadersProps } from '@mui/x-data-grid/internals';
interface DataGridProColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement>, UseGridColumnHeadersProps {
}
declare const GridColumnHeaders: React.ForwardRefExoticComponent<DataGridProColumnHeadersProps & React.RefAttributes<HTMLDivElement>>;
export { GridColumnHeaders };
