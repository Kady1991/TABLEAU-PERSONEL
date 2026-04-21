// ══════════════════════════════════════════════════════════
//  TREE HELPERS
// ══════════════════════════════════════════════════════════

// ── Cherche un SS récursivement ───────────────────────────
export const findSS = (list, targetId) => {
  for (const ss of list ?? []) {
    if (ss?.idSousService === targetId) return ss;
    if ((ss?.children?.length ?? 0) > 0) {
      const found = findSS(ss.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

// ── Construit le chemin SS récursivement ──────────────────
export const buildSSPath = (list, targetId, path = []) => {
  for (const ss of list ?? []) {
    const current = [
      ...path,
      {
        type: "ss",
        id: ss?.idSousService,
        label: ss?.nomSousServiceFr ?? ss?.nomSousServiceNl,
      },
    ];
    if (ss?.idSousService === targetId) return current;
    if (ss?.children?.length) {
      const found = buildSSPath(ss.children, targetId, current);
      if (found) return found;
    }
  }
  return null;
};

// ── Construit le breadcrumb complet ───────────────────────
export const buildBreadcrumb = ({ type, id, departements }) => {
  if (type === "dept") {
    const dept = departements.find((d) => d?.idDepartement === id);
    if (!dept) return null;
    return {
      label: dept?.nomDepartementFr ?? dept?.nomDepartementNl,
      breadcrumb: [
        {
          type: "dept",
          id,
          label: dept?.nomDepartementFr ?? dept?.nomDepartementNl,
        },
      ],
    };
  }

  if (type === "svc") {
    const dept = departements.find((d) =>
      d?.services?.some((s) => s?.idService === id),
    );
    const svc = dept?.services?.find((s) => s?.idService === id);
    if (!svc?.sousServices?.length) return null; // feuille
    return {
      label: svc?.nomServiceFr ?? svc?.nomServiceNl,
      breadcrumb: [
        {
          type: "dept",
          id: dept?.idDepartement,
          label: dept?.nomDepartementFr ?? dept?.nomDepartementNl,
        },
        { type: "svc", id, label: svc?.nomServiceFr ?? svc?.nomServiceNl },
      ],
    };
  }

  if (type === "ss") {
    const allSS = departements
      .flatMap((d) => d?.services ?? [])
      .flatMap((s) => s?.sousServices ?? []);
    const found = findSS(allSS, id);
    if (!(found?.children?.length > 0)) return null; // feuille

    const dept = departements.find((d) =>
      d?.services?.some((s) => s?.sousServices?.some((ss) => findSS([ss], id))),
    );
    const svc = dept?.services?.find((s) =>
      s?.sousServices?.some((ss) => findSS([ss], id)),
    );
    const ssPath = buildSSPath(svc?.sousServices ?? [], id);

    return {
      label: found?.nomSousServiceFr ?? found?.nomSousServiceNl,
      breadcrumb: [
        {
          type: "dept",
          id: dept?.idDepartement,
          label: dept?.nomDepartementFr ?? dept?.nomDepartementNl,
        },
        {
          type: "svc",
          id: svc?.idService,
          label: svc?.nomServiceFr ?? svc?.nomServiceNl,
        },
        ...(ssPath ?? []),
      ],
    };
  }

  return null;
};

// ══════════════════════════════════════════════════════════
//  GRID HELPERS
// ══════════════════════════════════════════════════════════

// ── Type de grille selon la sélection ─────────────────────
export const getGridType = (selectionType) => {
  switch (selectionType) {
    case "dept":
      return "service";
    case "svc":
      return "sousservice";
    case "ss":
      return "sousservice";
    default:
      return "departement";
  }
};

// ── Label du bouton Ajouter ───────────────────────────────
export const getAddLabel = (selectionType) => {
  switch (selectionType) {
    case "dept":
      return "Nouveau service";
    case "svc":
      return "Nouveau sous-service";
    case "ss":
      return "Nouveau sous-service";
    default:
      return "Nouveau département";
  }
};

// ── Titre de la grille ────────────────────────────────────
export const getGridTitle = (selectionType) => {
  switch (selectionType) {
    case "dept":
      return "Services";
    case "svc":
      return "Sous-services";
    case "ss":
      return "Sous-services enfants";
    default:
      return "Tous les départements";
  }
};
