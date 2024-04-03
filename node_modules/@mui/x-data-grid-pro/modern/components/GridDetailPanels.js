import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import { EMPTY_DETAIL_PANELS } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowsHeightCacheSelector, gridDetailPanelExpandedRowIdsSelector } from '../hooks/features/detailPanel';
import { GridDetailPanel } from './GridDetailPanel';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = () => {
  const slots = {
    detailPanel: ['detailPanel']
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};
export function GridDetailPanels(props) {
  const rootProps = useGridRootProps();
  if (!rootProps.getDetailPanelContent) {
    return null;
  }
  return /*#__PURE__*/React.createElement(GridDetailPanelsImpl, props);
}
function GridDetailPanelsImpl({
  virtualScroller
}) {
  const apiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses();
  const {
    setPanels
  } = virtualScroller;
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const detailPanelsHeights = useGridSelector(apiRef, gridDetailPanelExpandedRowsHeightCacheSelector);
  const getDetailPanel = React.useCallback(rowId => {
    const content = detailPanelsContent[rowId];

    // Check if the id exists in the current page
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
    const exists = rowIndex !== undefined;
    if (! /*#__PURE__*/React.isValidElement(content) || !exists) {
      return null;
    }
    const hasAutoHeight = apiRef.current.detailPanelHasAutoHeight(rowId);
    const height = hasAutoHeight ? 'auto' : detailPanelsHeights[rowId];
    return /*#__PURE__*/_jsx(GridDetailPanel, {
      rowId: rowId,
      height: height,
      className: classes.detailPanel,
      children: content
    }, `panel-${rowId}`);
  }, [apiRef, classes.detailPanel, detailPanelsHeights, detailPanelsContent]);
  React.useEffect(() => {
    if (expandedRowIds.length === 0) {
      setPanels(EMPTY_DETAIL_PANELS);
    } else {
      setPanels(new Map(expandedRowIds.map(rowId => [rowId, getDetailPanel(rowId)])));
    }
  }, [expandedRowIds, setPanels, getDetailPanel]);
  return null;
}