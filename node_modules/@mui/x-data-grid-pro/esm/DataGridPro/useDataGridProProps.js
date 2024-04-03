import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { GRID_DEFAULT_LOCALE_TEXT, DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';
import { computeSlots, useProps } from '@mui/x-data-grid/internals';
import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridProDefaultSlotsComponents';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES = _extends({}, DATA_GRID_PROPS_DEFAULT_VALUES, {
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  autosizeOnMount: false,
  disableAutosize: false,
  disableColumnPinning: false,
  keepColumnPositionIfDraggedOutside: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowReordering: false,
  rowsLoadingMode: 'client',
  getDetailPanelHeight: () => 500,
  headerFilters: false
});
const defaultSlots = DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;
export const useDataGridProProps = inProps => {
  const themedProps = useProps(
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  useThemeProps({
    props: inProps,
    name: 'MuiDataGrid'
  }));
  const localeText = React.useMemo(() => _extends({}, GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText), [themedProps.localeText]);
  const slots = React.useMemo(() => computeSlots({
    defaultSlots,
    slots: themedProps.slots
  }), [themedProps.slots]);
  return React.useMemo(() => _extends({}, DATA_GRID_PRO_PROPS_DEFAULT_VALUES, themedProps, {
    localeText,
    slots,
    signature: 'DataGridPro'
  }), [themedProps, localeText, slots]);
};