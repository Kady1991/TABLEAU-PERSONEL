import * as React from 'react';
import { UseGridColumnHeadersProps, GetHeadersParams } from '@mui/x-data-grid/internals';
export declare const useGridColumnHeaders: (props: UseGridColumnHeadersProps) => {
    getColumnFiltersRow: () => React.JSX.Element | null;
    getFillers: (params: GetHeadersParams | undefined, children: React.ReactNode, leftOverflow: number, borderTop?: boolean | undefined) => React.JSX.Element;
    getColumnHeadersRow: () => React.JSX.Element;
    getColumnGroupHeadersRows: () => React.JSX.Element[] | null;
    isDragging: boolean;
    getInnerProps: () => {
        role: string;
    };
};
