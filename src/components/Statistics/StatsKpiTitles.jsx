import PropTypes from "prop-types";
import { Card, CardContent, Typography, Stack } from "@mui/material";

function KpiCard({ label, value, subtitle }) {
  return (
    <Card elevation={2} sx={{ minWidth: 200, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>

        {subtitle ? (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
};

export default function StatsKpiTitles({ personnes }) {
  const total = personnes.length;
  const actifs = personnes.filter((p) => !p.SiArchive).length;
  const archives = personnes.filter((p) => p.SiArchive).length;

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      <KpiCard label="Total Personnel" value={total} />
      <KpiCard label="Personnel Actif" value={actifs} />
      <KpiCard label="Archives" value={archives} />
    </Stack>
  );
}

StatsKpiTitles.propTypes = {
  personnes: PropTypes.array.isRequired,
};