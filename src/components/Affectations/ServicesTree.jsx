import { Box } from "@mui/material";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

function ServicesTree({ services = [], onChange }) {

  // 🔁 récursif pour gérer les enfants
  const renderSousServices = (list) => {
    return list.map((ss) => (
      <TreeItem
        key={`ss-${ss.idSousService}`}
        nodeId={`ss-${ss.idSousService}`}
        label={ss.nomSousServiceFr}
        onClick={(e) => {
          e.stopPropagation();
          onChange?.("sousService", ss.idSousService);
        }}
      >
        {ss.children?.length > 0 && renderSousServices(ss.children)}
      </TreeItem>
    ));
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 1,
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {services.map((s) => (
          <TreeItem
            key={`svc-${s.idService}`}
            nodeId={`svc-${s.idService}`}
            label={s.nomServiceFr}
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("service", s.idService);
            }}
          >
            {s.sousServices?.length > 0 &&
              renderSousServices(s.sousServices)}
          </TreeItem>
        ))}
      </TreeView>
    </Box>
  );
}

ServicesTree.propTypes = {
  services: PropTypes.array,
  onChange: PropTypes.func,
};

export default ServicesTree;