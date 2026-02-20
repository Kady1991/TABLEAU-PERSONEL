import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { LIEN_API_PERSONNE } from "../../config";

export default function PersonnelDetail() {
  const { id } = useParams(); // id = IDPersonneService
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [personData, setPersonData] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${LIEN_API_PERSONNE}/api/Personne/${id}`,
          { headers: { Accept: "application/xml" } }
        );

        if (typeof response.data !== "string") {
          throw new Error("La réponse API n'est pas une chaîne XML.");
        }

        const parser = new XMLParser();
        const jsonData = parser.parse(response.data);

        const data = jsonData?.WhosWhoModelView ?? null;

        if (mounted) setPersonData(data);
      } catch (e) {
        if (mounted) setError(e?.message || "Erreur chargement détail");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <Box>
      {/* Header style template */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Détail personnel
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="inherit" size="small" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button variant="contained" size="small" onClick={() => navigate(`/personnels/${id}`)}>
            Actualiser
          </Button>
        </Stack>
      </Stack>

      {/* Content */}
      <Card variant="outlined">
        <CardContent>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && !personData && (
            <Alert severity="warning">Aucune donnée trouvée pour cet utilisateur.</Alert>
          )}

          {!loading && !error && personData && (
            <>
              <Typography variant="body2" color="text.secondary">
                IDPersonneService
              </Typography>
              <Typography fontWeight={800} mb={2}>
                {id}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.2}>
                <Typography><strong>Nom :</strong> {personData.NomPersonne}</Typography>
                <Typography><strong>Prénom :</strong> {personData.PrenomPersonne}</Typography>
                <Typography><strong>Email :</strong> {personData.Email}</Typography>
                <Typography><strong>Téléphone :</strong> {personData.TelPro}</Typography>
                <Typography><strong>Service :</strong> {personData.NomServiceFr}</Typography>
                <Typography><strong>Grade :</strong> {personData.NomWWGradeFr}</Typography>

                <Typography>
                  <strong>Date d’entrée :</strong>{" "}
                  {personData.DateEntree ? dayjs(personData.DateEntree).format("DD/MM/YYYY") : "-"}
                </Typography>

                {personData.SiArchive !== "true" && (
                  <Typography>
                    <strong>Date de sortie :</strong>{" "}
                    {personData.DateSortie ? dayjs(personData.DateSortie).format("DD/MM/YYYY") : "Non spécifiée"}
                  </Typography>
                )}

                <Typography>
                  <strong>Adresse :</strong>{" "}
                  {personData.NomRueFr} {personData.Numero} — <strong>Bâtiment :</strong>{" "}
                  {personData.Batiment} — <strong>Étage :</strong> {personData.Etage}
                </Typography>

                <Typography>
                  <strong>Chef de service :</strong> {personData.NomChefService} {personData.PrenomChefService}
                </Typography>

                <Typography>
                  <strong>Département :</strong> {personData.NomDepartementFr}
                </Typography>

                <Typography>
                  <strong>Chef de département :</strong> {personData.NomChefDepartement}{" "}
                  {personData.PrenomChefDepartement}
                </Typography>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
