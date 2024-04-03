import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
const sx = {
  padding: '2px'
};
function GridHeaderFilterClearButton(props) {
  const rootProps = useGridRootProps();
  return /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
    tabIndex: -1,
    "aria-label": "Clear filter",
    size: "small",
    sx: sx
  }, props, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuClearIcon, {
      fontSize: "inherit"
    })
  }));
}
export { GridHeaderFilterClearButton };