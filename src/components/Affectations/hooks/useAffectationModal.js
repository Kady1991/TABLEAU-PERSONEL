import { useState } from "react";

const INITIAL = {
  open: false,
  type: "departement",
  editData: null,
  defaultDepartementId: null,
  defaultServiceId: null,
  defaultParentSousServiceId: null,
  showParentSousService: false,
};

export function useAffectationModal(selection) {
  const [modal, setModal] = useState(INITIAL);

  const openForTreeAdd = ({ type, parentId, parentType, serviceId }) => {
    const ids = {
      defaultDepartementId: null,
      defaultServiceId: null,
      defaultParentSousServiceId: null,
    };

    if (type === "service") ids.defaultDepartementId = parentId;
    if (type === "sousservice" && parentType === "service")
      ids.defaultServiceId = parentId;
    if (type === "sousservice" && parentType === "sousservice")
      ids.defaultParentSousServiceId = parentId;

    // — ne pas écraser defaultServiceId si serviceId est undefined
    if (serviceId != null) ids.defaultServiceId = serviceId;

    setModal({
      open: true,
      type,
      editData: null,
      ...ids,
      showParentSousService:
        type === "sousservice" && parentType === "sousservice",
    });
  };

  const openForGridAdd = (gridType) =>
    setModal({
      open: true,
      type: gridType,
      editData: null,
      defaultDepartementId: selection?.type === "dept" ? selection.id : null,
      defaultServiceId: selection?.type === "svc" ? selection.id : null,
      defaultParentSousServiceId: null,
      showParentSousService: false,
    });

  const openForEdit = (row, gridType) =>
    setModal({
      open: true,
      type: gridType,
      editData: row,
      defaultDepartementId: null,
      defaultServiceId: null,
      defaultParentSousServiceId: null,
      showParentSousService: gridType === "sousservice",
    });

  const close = () => setModal((m) => ({ ...m, open: false }));

  return { modal, openForTreeAdd, openForGridAdd, openForEdit, close };
}
