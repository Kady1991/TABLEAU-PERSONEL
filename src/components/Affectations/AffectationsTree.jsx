import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { TreeView } from "@mui/x-tree-view/TreeView/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem/TreeItem";
import AddIcon from "@mui/icons-material/Add.js";
import ApartmentIcon from "@mui/icons-material/Apartment.js";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices.js";
import AccountTreeIcon from "@mui/icons-material/AccountTree.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore.js";
import { departementService } from "../../services/AffectationsService";
import { buildBreadcrumb, findSS } from "./helpers/affectationHelpers";

// ── NodeIcon ──────────────────────────────────────────────────────────────────
const NodeIcon = ({ type }) => {
  const theme = useTheme();
  const styles = {
    dept: { color: theme.palette.primary.main, fontSize: 18 },
    svc: { color: theme.palette.secondary.main, fontSize: 18 },
    ss: { color: theme.palette.text.secondary, fontSize: 18 },
  };
  if (type === "dept") return <ApartmentIcon sx={styles.dept} />;
  if (type === "svc") return <MiscellaneousServicesIcon sx={styles.svc} />;
  return <AccountTreeIcon sx={styles.ss} />;
};

// ── NodeLabel ─────────────────────────────────────────────────────────────────
const NodeLabel = ({ label, type, onAdd, showAdd, isLeaf }) => {
  const theme = useTheme();
  const addTooltip =
    type === "dept" ? "Ajouter un service" : "Ajouter un sous-service";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.5,
        "&:hover .add-btn": { opacity: 1 },
      }}
    >
      <NodeIcon type={isLeaf ? "ss" : type} />
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: type === "dept" ? 600 : 400,
          color: isLeaf
            ? theme.palette.text.disabled
            : type === "dept"
              ? theme.palette.primary.main
              : "text.primary",
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: isLeaf ? "default" : "pointer",
        }}
      >
        {label}
      </Typography>
      {showAdd && !isLeaf && (
        <Tooltip title={addTooltip}>
          <IconButton
            className="add-btn"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
            sx={{
              opacity: 0,
              transition: "opacity 0.15s",
              p: 0.2,
              color: theme.palette.secondary.main,
              "&:hover": { bgcolor: "rgba(2,178,175,0.1)" },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

// ── SousServiceNode récursif ──────────────────────────────────────────────────
const SousServiceNode = ({ ss, onAdd }) => {
  const hasChildren = (ss?.children?.length ?? 0) > 0;

  return (
    <TreeItem
      nodeId={`ss-${ss?.idSousService}`}
      label={
        <NodeLabel
          label={ss?.nomSousServiceFr ?? ss?.nomSousServiceNl ?? "—"}
          type="ss"
          isLeaf={false}
          showAdd={true}
          onAdd={() =>
            onAdd?.({
              type: "sousservice",
              parentType: "sousservice",
              parentId: ss?.idSousService,
              serviceId: ss?.serviceId,
              parentLabel: ss?.nomSousServiceFr,
            })
          }
        />
      }
    >
      {hasChildren &&
        ss.children.map((child) => (
          <SousServiceNode
            key={`ss-${child?.idSousService}`}
            ss={child}
            onAdd={onAdd}
          />
        ))}
    </TreeItem>
  );
};

// ── AffectationsTree ──────────────────────────────────────────────────────────
function AffectationsTree({ onSelect, onAdd, selectedId, refreshKey }) {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (selectedId === "" || selectedId === null) {
      setExpanded([]);
    }
  }, [selectedId]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    departementService
      .getAll()
      .then((res) => {
        if (isMounted) setDepartements(res?.data ?? []);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (loading && departements.length === 0)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
        <CircularProgress size={20} />
      </Box>
    );

  return (
    <Box sx={{ height: "100%", overflowY: "auto", p: 1 }}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          pb: 1,
          borderBottom: "0.5px solid",
          borderColor: theme?.palette?.divider,
        }}
      >
        <Tooltip title="Nouveau département">
          <IconButton
            size="small"
            onClick={() => onAdd?.({ type: "departement", parentId: null })}
            sx={{ color: theme?.palette?.primary?.main }}
          >
            <AddIcon sx={{ fontSize: 25 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── TreeView ──────────────────────────────────────────────────────── */}
      <TreeView
        expanded={expanded}
        selected={selectedId ?? ""}
        onNodeToggle={(_, nodeIds) => setExpanded(nodeIds)}
        onNodeSelect={(_, nodeId) => {
          if (!nodeId || nodeId === selectedId) return;

          const firstDash = nodeId.indexOf("-");
          const type = nodeId.substring(0, firstDash);
          const id = parseInt(nodeId.substring(firstDash + 1));

          const result = buildBreadcrumb({ type, id, departements });
          if (!result) return;

          setExpanded((prev) =>
            prev.includes(nodeId) ? prev : [...prev, nodeId],
          );
          onSelect?.({ type, id, ...result });
        }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          "& .MuiTreeItem-content": {
            borderRadius: (theme?.shape?.borderRadius ?? 8) / 2,
            mb: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          },
          "& .Mui-selected": {
            bgcolor: `${theme?.palette?.primary?.main}15 !important`,
            "& .MuiTypography-root": {
              color: theme?.palette?.primary?.main,
              fontWeight: 700,
            },
          },
        }}
      >
        {(departements ?? []).map((dept) => (
          <TreeItem
            key={`dept-${dept?.idDepartement}`}
            nodeId={`dept-${dept?.idDepartement}`}
            label={
              <NodeLabel
                label={dept?.nomDepartementFr ?? dept?.nomDepartementNl ?? "—"}
                type="dept"
                isLeaf={false}
                showAdd
                onAdd={() =>
                  onAdd?.({
                    type: "service",
                    parentId: dept?.idDepartement,
                    parentLabel: dept?.nomDepartementFr,
                  })
                }
              />
            }
          >
            {(dept?.services ?? []).map((svc) => (
              <TreeItem
                key={`svc-${svc?.idService}`}
                nodeId={`svc-${svc?.idService}`}
                label={
                  <NodeLabel
                    label={svc?.nomServiceFr ?? svc?.nomServiceNl ?? "—"}
                    type="svc"
                    isLeaf={false}
                    showAdd={true}
                    onAdd={() =>
                      onAdd?.({
                        type: "sousservice",
                        parentId: svc?.idService,
                        parentType: "service",
                        parentLabel: svc?.nomServiceFr,
                      })
                    }
                  />
                }
              >
                {(svc?.sousServices ?? []).map((ss) => (
                  <SousServiceNode
                    key={`ss-${ss?.idSousService}`}
                    ss={ss}
                    onAdd={onAdd}
                  />
                ))}
              </TreeItem>
            ))}
          </TreeItem>
        ))}
      </TreeView>
    </Box>
  );
}

export default AffectationsTree;
