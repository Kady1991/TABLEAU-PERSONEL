import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Paper,
  Typography,
  Popper,
  ClickAwayListener,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { TreeView } from "@mui/x-tree-view/TreeView/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem/TreeItem";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

function NodeIcon({ type }) {
  const theme = useTheme();
  if (type === "service")
  // Service parent
return <MiscellaneousServicesIcon sx={{ fontSize: 18, color: theme.palette.secondary.main, flexShrink: 0 }} />;

// Sous-service / child
return <AccountTreeIcon sx={{ fontSize: 16, color: theme.palette.primary.main, flexShrink: 0 }} />;
}
NodeIcon.propTypes = { type: PropTypes.string.isRequired };

function buildTree(flatOptions) {
  const tree = [];
  const nodeMap = new Map();

  // Services parents
  flatOptions.forEach((opt) => {
    if (opt.type === "service") {
      const node = { nodeId: opt.id, label: opt.label, type: "service", option: opt, children: [] };
      nodeMap.set(`service-${opt.realServiceId}`, node);
      tree.push(node);
    }
  });

  // Sous-services
  flatOptions.forEach((opt) => {
    if (opt.type === "sousService") {
      const parent = nodeMap.get(`service-${opt.parentServiceId}`);
      if (parent) {
        const node = {
          nodeId: opt.id,
          label: (opt.label || "").replace(/^[-—\s]+/, ""),
          type: "ss",
          option: opt,
          children: [],
        };
        nodeMap.set(`ss-${opt.realServiceId}`, node);
        parent.children.push(node);
      }
    }
  });

  // Children
  flatOptions.forEach((opt) => {
    if (opt.type === "child") {
      let parentNode = null;
      nodeMap.forEach((node) => {
        if (node.type === "ss" && node.option?.parentServiceId === opt.parentServiceId) {
          parentNode = node;
        }
      });
      if (!parentNode) parentNode = nodeMap.get(`service-${opt.parentServiceId}`);
      if (parentNode) {
        parentNode.children.push({
          nodeId: opt.id,
          label: (opt.label || "").replace(/^[-—\s]+/, ""),
          type: "ss",
          option: opt,
          children: [],
        });
      }
    }
  });

  return tree;
}

function renderNode(node, selectedValue, onSelect, theme) {
  const isSelected = selectedValue?.value === node.option?.value;
  const hasChildren = node.children && node.children.length > 0;

  const label = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.3,
        color: isSelected ? theme.palette.primary.main : "inherit",
      }}
    >
      <NodeIcon type={node.type} />
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: node.type === "service" ? 600 : 400,
          color: isSelected
            ? theme.palette.primary.main
            : node.type === "service"
            ? theme.palette.primary.main
            : "text.primary",
        }}
      >
        {node.label}
      </Typography>
    </Box>
  );

  if (!hasChildren) {
    return (
      <TreeItem
        key={node.nodeId}
        nodeId={node.nodeId}
        label={label}
        onClick={() => onSelect(node.option)}
        sx={{
          "& .MuiTreeItem-content": {
            bgcolor: isSelected ? `${theme.palette.primary.main}10` : "transparent",
          },
        }}
      />
    );
  }

  return (
    <TreeItem key={node.nodeId} nodeId={node.nodeId} label={label}>
      {node.children.map((child) => renderNode(child, selectedValue, onSelect, theme))}
    </TreeItem>
  );
}

function ServiceTreeSelect({ servicesFlat = [], value, onChange, required = false }) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedSearch, setExpandedSearch] = useState(new Set());

  const tree = buildTree(servicesFlat);
  const isSearching = search.trim().length > 0;
  const searchLower = search.toLowerCase().trim();

  // En mode recherche : services qui matchent + leurs enfants si expanded
  const searchResults = isSearching
    ? (() => {
        const results = [];
        const matchingParents = new Set();

        servicesFlat.forEach((opt) => {
          const cleanLabel = (opt.label || "").toLowerCase().replace(/^[-—\s]+/, "");
          if (cleanLabel.includes(searchLower) && opt.type === "service") {
            matchingParents.add(opt.realServiceId);
          }
        });

        servicesFlat.forEach((opt) => {
          const cleanLabel = (opt.label || "").toLowerCase().replace(/^[-—\s]+/, "");
          if (opt.type === "service" && (cleanLabel.includes(searchLower) || matchingParents.has(opt.realServiceId))) {
            results.push(opt);
          } else if (opt.type !== "service") {
            const cleanLabel2 = (opt.label || "").toLowerCase().replace(/^[-—\s]+/, "");
            if (
              cleanLabel2.includes(searchLower) ||
              matchingParents.has(opt.parentServiceId) && expandedSearch.has(opt.parentServiceId)
            ) {
              results.push(opt);
            }
          }
        });

        return results;
      })()
    : null;

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
    setSearch("");
    setExpandedSearch(new Set());
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch("");
  };

  const toggleSearchExpand = (e, serviceId) => {
    e.stopPropagation();
    setExpandedSearch((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const displayLabel = value ? (value.label || "").replace(/^[-—\s]+/, "") : "";

  return (
    <ClickAwayListener onClickAway={() => { setOpen(false); setSearch(""); setExpandedSearch(new Set()); }}>
      <Box ref={anchorRef}>
        <TextField
          size="small"
          fullWidth
          required={required}
          label="Service / Sous-service"
          value={open ? search : displayLabel}
          placeholder={open ? "Rechercher..." : ""}
          onClick={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          InputProps={{
            endAdornment: value && !open ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1400, width: anchorRef.current?.offsetWidth }}
        >
          <Paper
            elevation={4}
            sx={{
              maxHeight: 320,
              overflowY: "auto",
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              mt: 0.5,
            }}
          >
            {isSearching ? (
              // ── Mode recherche ──
              <Box sx={{ py: 0.5 }}>
                {searchResults.length === 0 ? (
                  <Typography sx={{ px: 2, py: 1, fontSize: 13, color: "text.secondary" }}>
                    Aucun résultat
                  </Typography>
                ) : (
                  searchResults.map((opt) => {
                    const isExpanded = expandedSearch.has(opt.realServiceId);
                    const indent = opt.type === "child" ? 5 : opt.type === "sousService" ? 3.5 : 2;

                    return (
                      <Box
                        key={opt.id}
                        onClick={() => {
                          // Si c'est un parent avec enfants → expand/collapse
                          if (opt.hasChildren) {
                            toggleSearchExpand({ stopPropagation: () => {} }, opt.realServiceId);
                          } else {
                            handleSelect(opt);
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          px: 2,
                          py: 0.8,
                          cursor: "pointer",
                          pl: indent,
                          "&:hover": { bgcolor: "action.hover" },
                          bgcolor: value?.value === opt.value ? `${theme.palette.primary.main}10` : "transparent",
                          fontWeight: value?.value === opt.value ? 600 : 400,
                        }}
                      >
                        <NodeIcon type={opt.type === "service" ? "service" : "ss"} />
                        <Typography
                          sx={{
                            fontSize: 13,
                            flex: 1,
                            color: value?.value === opt.value
                              ? theme.palette.primary.main
                              : opt.type === "service"
                              ? theme.palette.primary.main
                              : "text.primary",
                            fontWeight: opt.type === "service" ? 600 : 400,
                          }}
                        >
                          {(opt.label || "").replace(/^[-—\s]+/, "")}
                        </Typography>
                        {opt.hasChildren && (
                          <Box
                            component="span"
                            onClick={(e) => toggleSearchExpand(e, opt.realServiceId)}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              ml: 0.5,
                              opacity: 0.5,
                              fontSize: 20,
                              color: theme.palette.secondary.main,
                              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          >
                            ▸
                          </Box>
                        )}
                      </Box>
                    );
                  })
                )}
              </Box>
            ) : (
              // ── Mode arbre ──
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main, fontSize: 20  }} />}
                defaultExpandIcon={<ChevronRightIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
                sx={{
                  py: 0.5,
                  "& .MuiTreeItem-content": {
                    borderRadius: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  },
                  "& .MuiTreeItem-label": { fontSize: 13 },
                }}
              >
                {tree.map((node) => renderNode(node, value, handleSelect, theme))}
              </TreeView>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

ServiceTreeSelect.propTypes = {
  servicesFlat: PropTypes.array,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default ServiceTreeSelect;