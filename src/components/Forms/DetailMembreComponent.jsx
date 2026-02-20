import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import { LIEN_API_PERSONNE } from "../../config";

function DetailMembreComponent({ open, onClose, IDPersonneService }) {
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ cache simple: évite de refetch si on ré-ouvre la même personne
  const cacheRef = useRef(new Map()); // key: IDPersonneService, value: view

  const formatDate = (value) => {
    if (!value) return "-";
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : "-";
  };

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!open || !IDPersonneService) return;

      // ✅ cache hit
      if (cacheRef.current.has(IDPersonneService)) {
        setPersonData(cacheRef.current.get(IDPersonneService));
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setPersonData(null);

      try {
        const response = await axios.get(
          `${LIEN_API_PERSONNE}/api/Personne/${IDPersonneService}`,
          { headers: { Accept: "application/xml" } }
        );

        if (typeof response.data !== "string") {
          throw new Error("La réponse API n'est pas une chaîne XML.");
        }

        const parser = new XMLParser();
        const jsonData = parser.parse(response.data);
        const view = jsonData?.WhosWhoModelView ?? null;

        setPersonData(view);
        cacheRef.current.set(IDPersonneService, view);
      } catch (e) {
        console.error(
          "Erreur lors de la récupération des données :",
          e?.response?.data || e?.message
        );
        setError(e?.message || "Erreur lors de la récupération des données");
        setPersonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [open, IDPersonneService]);

  const handleClose = () => {
    onClose?.();
    setError("");
    // on garde le cache, c'est voulu
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>Détails de la personne</DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Chargement des données…
            </Typography>
          </Stack>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && !personData && (
          <Alert severity="warning">Aucune donnée trouvée pour cet utilisateur.</Alert>
        )}

        {!loading && !error && personData && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nom
              </Typography>
              <Typography fontWeight={700}>{personData.NomPersonne}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Prénom
              </Typography>
              <Typography fontWeight={700}>{personData.PrenomPersonne}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography fontWeight={700}>{personData.Email || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Téléphone
              </Typography>
              <Typography fontWeight={700}>{personData.TelPro || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Service
              </Typography>
              <Typography fontWeight={700}>{personData.NomServiceFr || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Grade
              </Typography>
              <Typography fontWeight={700}>{personData.NomWWGradeFr || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Date d'entrée
              </Typography>
              <Typography fontWeight={700}>{formatDate(personData.DateEntree)}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Date de sortie
              </Typography>
              <Typography fontWeight={700}>
                {personData.DateSortie ? formatDate(personData.DateSortie) : "Non spécifiée"}
              </Typography>
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}>
              <Typography variant="body2" color="text.secondary">
                Adresse
              </Typography>
              <Typography fontWeight={700}>
                {personData.NomRueFr || "-"} {personData.Numero || ""} — Bâtiment:{" "}
                {personData.Batiment || "-"} — Étage: {personData.Etage || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Chef de service
              </Typography>
              <Typography fontWeight={700}>
                {personData.NomChefService || "-"} {personData.PrenomChefService || ""}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Département
              </Typography>
              <Typography fontWeight={700}>{personData.NomDepartementFr || "-"}</Typography>
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}>
              <Typography variant="body2" color="text.secondary">
                Chef de département
              </Typography>
              <Typography fontWeight={700}>
                {personData.NomChefDepartement || "-"} {personData.PrenomChefDepartement || ""}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DetailMembreComponent;
