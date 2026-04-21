import { useState } from "react";

export function useAffectationSelection() {
  const [selection, setSelection] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);

  const handleSelect = ({ type, id, breadcrumb: newBreadcrumb }) => {
    if (selection?.type === type && selection?.id === id) return;
    setSelection({ type, id });
    setSelectedId(`${type}-${id}`);
    setBreadcrumb(newBreadcrumb ?? []);
  };

  const clearSelection = () => {
    setSelection(null);
    setSelectedId("");
    setBreadcrumb([]);
  };

  return { selection, selectedId, breadcrumb, handleSelect, clearSelection };
}
