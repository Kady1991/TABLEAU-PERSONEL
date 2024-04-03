import * as React from 'react';
import { useGridApiEventHandler } from '@mui/x-data-grid';
import { GRID_TREE_DATA_GROUPING_FIELD } from './gridTreeDataGroupColDef';
export const useGridTreeData = apiRef => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);
    if (cellParams.colDef.field === GRID_TREE_DATA_GROUPING_FIELD && event.key === ' ' && !event.shiftKey) {
      if (params.rowNode.type !== 'group') {
        return;
      }
      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};