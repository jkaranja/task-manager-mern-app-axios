import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "../../components/DatePicker";

export default function NoteFilter({
  open,
  handleClickOpen,
  handleClose,
  toDate,
  fromDate,
  setToDate,
  setFromDate,
  handleDateFilter,
  filterError,
  setFilterError,
}) {
  const [dateExpanded, setDateExpanded] = React.useState(false);

  //after date is set/collapse dialog content
  React.useEffect(() => {
    setDateExpanded(false);
    setFilterError(null)
  }, [toDate, fromDate]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth //works together with max width
      maxWidth="sm" //default is small
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid>Filter by date</Grid>
          <Grid>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ height: dateExpanded && "30vh" }}>
        <Grid container justifyContent="space-between">
          <Grid textAlign="center">
            <DatePicker
              onFocus={() => setDateExpanded(true)}
              onBlur={() => setDateExpanded(false)}
              size="small"
              color="secondary"
              label="From"
              margin="dense"
              required
              fullWidth
              showTimeSelect={false}
              dateFormat="dd/MM/yyyy"
              selectedDate={fromDate}
              setSelectedDate={setFromDate}
              filterDate={() => true}
            />
          </Grid>
          <Grid>
            <DatePicker
              onFocus={() => setDateExpanded(true)}
              onBlur={() => setDateExpanded(false)}
              size="small"
              color="secondary"
              label="To"
              margin="dense"
              required
              fullWidth
              showTimeSelect={false}
              dateFormat="dd/MM/yyyy"
              selectedDate={toDate}
              setSelectedDate={setToDate}
              filterDate={() => true}
            />
          </Grid>
        </Grid>
        <Typography color="error.main" variant="caption">
          {filterError && "Fill at least one field"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDateFilter}
        >
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
