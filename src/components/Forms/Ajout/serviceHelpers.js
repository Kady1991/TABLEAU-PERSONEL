// ── buildFlatOptions ──────────────────────────────────────────────────────────
// Construit la liste plate pour ServiceTreeSelect
// Source : /api/affectations/service (camelCase) — seule source fiable
// pour nomDepartementFr, nomChefDepartement et nomChefService
export const buildFlatOptions = (servicesList) => {
  const result = [];

  servicesList.forEach((s) => {
    const svcId = s.idService ?? s.IDService;

    // ── Service racine ──────────────────────────────────────────────────────
    result.push({
      id:             `service-${svcId}`,
      value:          `service-${svcId}`,
      realServiceId:  svcId,
      parentServiceId: null,
      hasChildren:    (s.sousServices?.length ?? 0) > 0,
      label:          s.nomServiceFr ?? s.NomServiceFr ?? "",
      type:           "service",
      nomDepartementFr:      s.nomDepartementFr      ?? s.NomDepartementFr      ?? "",
      nomChefDepartement:    s.nomChefDepartement     ?? s.NomChefDepartement    ?? "",
      prenomChefDepartement: s.prenomChefDepartement  ?? s.PrenomChefDepartement ?? "",
      nomChefService:        s.nomChefService         ?? s.NomChefService        ?? "",
      prenomChefService:     s.prenomChefService      ?? s.PrenomChefService     ?? "",
      nomSousChef:    "",
      prenomSousChef: "",
    });

    s.sousServices?.forEach((ss) => {
      const sousId = ss.idSousService ?? ss.IDSousService;

      // ── Sous-service ────────────────────────────────────────────────────
      result.push({
        id:             `sous-${sousId}`,
        value:          `sous-${sousId}`,
        realServiceId:  sousId,
        parentServiceId: svcId,
        hasChildren:    (ss.children?.length ?? 0) > 0,
        label:          "— " + (ss.nomSousServiceFr ?? ss.NomSousServiceFr ?? ""),
        type:           "sousService",
        nomDepartementFr:      ss.nomDepartementFr      ?? s.nomDepartementFr      ?? s.NomDepartementFr      ?? "",
        nomChefDepartement:    ss.nomChefDepartement     ?? s.nomChefDepartement    ?? s.NomChefDepartement    ?? "",
        prenomChefDepartement: ss.prenomChefDepartement  ?? s.prenomChefDepartement ?? s.PrenomChefDepartement ?? "",
        nomChefService:        ss.nomChefService         ?? s.nomChefService        ?? s.NomChefService        ?? "",
        prenomChefService:     ss.prenomChefService      ?? s.prenomChefService     ?? s.PrenomChefService     ?? "",
        nomSousChef:    ss.nomSousChef    ?? "",
        prenomSousChef: ss.prenomSousChef ?? "",
      });

      ss.children?.forEach((child) => {
        const childId = child.idSousService ?? child.IDSousService;

        // ── Child (sous-sous-service) ────────────────────────────────────
        // Les children ont souvent tous les champs à null → on hérite de ss puis s
        result.push({
          id:             `child-${childId}`,
          value:          `child-${childId}`,
          realServiceId:  childId,
          parentServiceId: svcId,
          hasChildren:    false,
          label:          "—— " + (child.nomSousServiceFr ?? child.NomSousServiceFr ?? ""),
          type:           "child",
          nomDepartementFr:      child.nomDepartementFr      ?? ss.nomDepartementFr      ?? s.nomDepartementFr      ?? s.NomDepartementFr      ?? "",
          nomChefDepartement:    child.nomChefDepartement     ?? ss.nomChefDepartement    ?? s.nomChefDepartement    ?? s.NomChefDepartement    ?? "",
          prenomChefDepartement: child.prenomChefDepartement  ?? ss.prenomChefDepartement ?? s.prenomChefDepartement ?? s.PrenomChefDepartement ?? "",
          nomChefService:        child.nomChefService         ?? ss.nomChefService        ?? s.nomChefService        ?? s.NomChefService        ?? "",
          prenomChefService:     child.prenomChefService      ?? ss.prenomChefService     ?? s.prenomChefService     ?? s.PrenomChefService     ?? "",
          nomSousChef:    child.nomSousChef    ?? ss.nomSousChef    ?? "",
          prenomSousChef: child.prenomSousChef ?? ss.prenomSousChef ?? "",
        });
      });
    });
  });

  return result;
};

// ── enrichWithChefDepartement ─────────────────────────────────────────────────
// N'écrase les valeurs que si elles sont vides dans buildFlatOptions
// /api/infos/services (PascalCase) a des sousServices vides → données partielles
// On s'en sert uniquement comme fallback de dernier recours pour les services racine
export const enrichWithChefDepartement = (flatOptions, infosFlat) => {
  const chefMap = new Map();

  infosFlat.forEach((row) => {
    const svcId = row.IDService ?? 0;
    if (svcId && !chefMap.has(svcId) && (row.NomChefDepartement || row.NomDepartementFr)) {
      chefMap.set(svcId, {
        nomChefDepartement:    row.NomChefDepartement    ?? "",
        prenomChefDepartement: row.PrenomChefDepartement ?? "",
        nomDepartementFr:      row.NomDepartementFr      ?? "",
      });
    }
  });

  return flatOptions.map((opt) => {
    // Pour les sous-services et children, on ne touche à rien —
    // buildFlatOptions a déjà correctement hérité depuis le parent
    if (opt.type !== "service") return opt;

    const info = chefMap.get(opt.realServiceId);
    if (!info) return opt;

    return {
      ...opt,
      // Ne remplace que si la valeur actuelle est vide
      nomChefDepartement:    opt.nomChefDepartement    || info.nomChefDepartement,
      prenomChefDepartement: opt.prenomChefDepartement || info.prenomChefDepartement,
      nomDepartementFr:      opt.nomDepartementFr      || info.nomDepartementFr,
    };
  });
};