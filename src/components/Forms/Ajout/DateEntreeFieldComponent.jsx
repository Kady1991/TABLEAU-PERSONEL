import PropTypes from "prop-types";
import "dayjs/locale/fr";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateEntreeField = ({
  value,
  onChange,
  error,
  helperText,
  onBlur,
}) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="fr"
    >
      <DatePicker
        label="Date d'entrée"
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            required: true,
            fullWidth: true,
            size: "small",
            error,
            helperText,
            onBlur,
          },
        }}
      />
    </LocalizationProvider>
  );
};

DateEntreeField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onBlur: PropTypes.func,
};

export default DateEntreeField;