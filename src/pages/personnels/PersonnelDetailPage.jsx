import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import PersonnelService from "../../services/PersonnelService.js";

export default function PersonnelDetail() {
  const { id } = useParams();
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

      const [personRes, gradesRes, fonctionsRes] = await Promise.all([
        PersonnelService.getById(id),
        PersonnelService.getGrades(),
        PersonnelService.getFonctions(),
      ]);

      if (!mounted) return;

const person = personRes.data || {};
const grades = Array.isArray(gradesRes.data) ? gradesRes.data : [];
const fonctions = Array.isArray(fonctionsRes.data) ? fonctionsRes.data : [];

console.log("DETAIL PERSONNE =", person);
console.log("DETAIL PERSONNE KEYS =", Object.keys(person));
console.log("GRADES =", grades);
console.log("1er grade exemple =", grades[0]);

const gradeId =
  person.WWGradeID ??
  person.IDWWGrade ??
  person.GradeID ??
  person.WWGrade ??
  person.IdWWGrade ??
  person.IdGrade ??
  null;

const fonctionId =
  person.FonctionID ??
  person.IDFonction ??
  person.IdFonction ??
  null;

const gradeTrouve =
  grades.find((g) => Number(g.IDWWGrade) === Number(gradeId)) ||
  grades.find((g) => Number(g.WWGradeID) === Number(gradeId)) ||
  grades.find((g) => Number(g.IdWWGrade) === Number(gradeId)) ||
  null;

const fonctionTrouvee =
  fonctions.find((f) => Number(f.IDFonction) === Number(fonctionId)) ||
  fonctions.find((f) => Number(f.IdFonction) === Number(fonctionId)) ||
  null;

const nomGrade =
  person.NomWWGradeFr ??
  person.NomGradeFr ??
  person.LibelleGradeFr ??
  person.GradeLibelle ??
  gradeTrouve?.NomWWGradeFr ??
  gradeTrouve?.NomGradeFr ??
  gradeTrouve?.LibelleGradeFr ??
  "-";

const nomFonction =
  person.NomFonctionFr ??
  person.LibelleFonctionFr ??
  fonctionTrouvee?.NomFonctionFr ??
  fonctionTrouvee?.LibelleFonctionFr ??
  "-";

const enrichedPerson = {
  ...person,
  NomWWGradeFr: nomGrade,
  NomFonctionFr: nomFonction,
};

console.log("GRADE ID =", gradeId);
console.log("GRADE TROUVE =", gradeTrouve);
console.log("NOM GRADE FINAL =", nomGrade);
console.log("PERSON ENRICHI =", enrichedPerson);

setPersonData(enrichedPerson);
    } catch (e) {
      if (mounted) {
        setError(e?.message || "Erreur chargement détail");
      }
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Détail personnel
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/personnels/${id}`)}
          >
            Actualiser
          </Button>
        </Stack>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && !personData && (
            <Alert severity="warning">
              Aucune donnée trouvée pour cet utilisateur.
            </Alert>
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
                <Typography>
                  <strong>Nom :</strong> {personData.NomPersonne || "-"}
                </Typography>
                <Typography>
                  <strong>Prénom :</strong> {personData.PrenomPersonne || "-"}
                </Typography>
                <Typography>
                  <strong>Email :</strong> {personData.Email || "-"}
                </Typography>
                <Typography>
                  <strong>Téléphone :</strong> {personData.TelPro || "-"}
                </Typography>
                <Typography>
                  <strong>Service :</strong> {personData.NomServiceFr || "-"}
                </Typography>
                <Typography>
                  <strong>Grade :</strong> {personData.NomWWGradeFr || "-"}
                </Typography>
                <Typography>
                  <strong>Fonction :</strong> {personData.NomFonctionFr || "-"}
                </Typography>

                <Typography>
                  <strong>Date d’entrée :</strong>{" "}
                  {personData.DateEntree
                    ? dayjs(personData.DateEntree).format("DD/MM/YYYY")
                    : "-"}
                </Typography>

                {personData.SiArchive !== "true" && (
                  <Typography>
                    <strong>Date de sortie :</strong>{" "}
                    {personData.DateSortie
                      ? dayjs(personData.DateSortie).format("DD/MM/YYYY")
                      : "Non spécifiée"}
                  </Typography>
                )}

                <Typography>
                  <strong>Adresse :</strong> {personData.NomRueFr || "-"}{" "}
                  {personData.Numero || ""} — <strong>Bâtiment :</strong>{" "}
                  {personData.Batiment || "-"} — <strong>Étage :</strong>{" "}
                  {personData.Etage || "-"}
                </Typography>

                <Typography>
                  <strong>Chef de service :</strong>{" "}
                  {personData.NomChefService || "-"}{" "}
                  {personData.PrenomChefService || ""}
                </Typography>

                <Typography>
                  <strong>Département :</strong>{" "}
                  {personData.NomDepartementFr || "-"}
                </Typography>

                <Typography>
                  <strong>Chef de département :</strong>{" "}
                  {personData.NomChefDepartement || "-"}{" "}
                  {personData.PrenomChefDepartement || ""}
                </Typography>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}