import * as React from 'react';
import { GridRowId } from '@mui/x-data-grid';
interface GridDetailPanelProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
    /**
     * The row ID that this panel belongs to.
     */
    rowId: GridRowId;
    /**
     * The panel height.
     */
    height: number | 'auto';
}
declare function GridDetailPanel(props: GridDetailPanelProps): React.JSX.Element;
export { GridDetailPanel };
