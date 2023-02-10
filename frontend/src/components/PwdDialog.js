import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PWD_REGEX } from "../constants/authConstants";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function PwdDialog({
  open,
  handleClose,
  handleSubmit,
  submitCb,
  password,
  setPassword,
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const [pwdErrors, setPwdErrors] = React.useState();

  //current pwd handler
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    if (password) setPwdErrors();

    if (!open) {
      setPassword(""); //clear pwd when dialog closes
      setPwdErrors("");
    }

    // if (!PWD_REGEX.test(password)) {
    //   setPwdErrors("Spaces not allowed");
    //   return;
    // }

    // if (password.length < 6) {
    //   setPwdErrors("Password must be at least 6 characters");
    //   return;
    // }
  }, [password, open]);

  const handleFinalSubmit = async () => {
    if (!password) {
      setPwdErrors("Password is required");
      return;
    }

    await handleSubmit(submitCb)();
    handleClose(); //close dialog
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth //works together with max width
      maxWidth="sm" //default is small
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid>Enter current password to save changes</Grid>
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
      <DialogContent>
        <FormGroup sx={{ mb: 0.5 }}>
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            color="secondary"
            fullWidth
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography color="error.main" variant="caption">
            {pwdErrors}
          </Typography>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleFinalSubmit}
          color="secondary"
          variant="contained"
          disableElevation
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
