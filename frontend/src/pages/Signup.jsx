import React, { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Typography,
  TextField,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import InputAdornment from "@mui/material/InputAdornment";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Basic from "../components/Steppers/Basic";
import Linear from "../components/Steppers/Linear";
import MultiStepForm from "../components/MultiStepForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import useTitle from "../hooks/useTitle";
import { BASE_URL } from "../constants/axiosConstants";
import { EMAIL_REGEX, PWD_REGEX } from "../constants/authConstants";

const Signup = () => {
  useTitle("Sign up for free");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const [checkPolicy, setCheckPolicy] = useState(true);

  const [message, setMessage] = useState(null);

  const [pwdCaption, setPwdCaption] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    // formState: {
    //   touchedFields, //object that has touched/clicked fields//shows all touched fields as true/no value
    //   isDirty, //boolean//if user interacted with form
    //   isValid,//boolean//if any errors//checks even before form is submitted but err will be displayed after submit
    //   dirtyFields, ////object//dirty/typed value fields//shows all touched fields as true/no value//
    //   isSubmitted,//boolean// true if user tried to submit form at least once
    //   errors,//shows after user had tried to submit form at least once//changes are dynamic
    //isSubmitSuccessful,//boolean//submitted success in handleSubmit callback//no errors
    //submitCount //no of times form was submitted
    //isValid //true if form has no errors
    // },
    // watch,//function// eg const watchIsDeveloper = watch('email'); //dynamically watch & return email field value
    // getValues,//function//then call getValues()//returns an object with values
    //reset({ data: 'test' }, { keepDefaultValues: true})//reset values and keep default values//use inside use effect hook
    //setValue//sets a value of a a registered field eg onClick={() => setValue("firstName", "Bill")
  } = useForm({
    //sync
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    // },
    //async //not working//use useEffect with reset
    //defaultValues: async () => fetch('/api-endpoint');
    //values, /v6//don't use//values is data from api// will get updated once values returns//updates values kinda like default values
    //can also use reset function to populate values after eg user changes but won't be able to reset using keepDefaultValues
    //shouldUnregister: false, //don't merge default values//include only values in input fields in submission data
  });

  const client = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //   "Content-Type": "application/json",//default
    // },
    withCredentials: true, //or add axios.defaults.withCredentials = true in app.js or top of file//add for any req setting & sending cookies
  });

  const onSubmit = async (inputs, e) => {
    e.preventDefault();

    try {
      setMessage("loading...");

      const { data: response } = await client.post(
        "/api/user/register",
        inputs
      );

      navigate("/verify");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert
          variant="filled"
          severity="error"
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      </Snackbar>

      <Card sx={{ pt: 4, px: 2, pb: 2, width: "450px" }} variant="outlined">
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Create an account
            </Typography>
          }
          subheader="Please sign-up below"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ mb: 0.5 }}>
              <TextField
                {...register("username", { required: "Username is required" })}
                id="outlined-basic"
                label="Username"
                margin="dense"
                color="secondary"
              />
              <Typography color="error.main" variant="caption">
                {errors.username?.message}
              </Typography>
            </FormGroup>
            <FormGroup sx={{ mb: 0.5 }}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Enter an email address",
                  },
                })}
                id="outlined-basic"
                label="Email"
                margin="dense"
                color="secondary"
              />
              <Typography color="error.main" variant="caption">
                {errors.email?.message}
              </Typography>
            </FormGroup>

            {/* ----------pass------------ */}
            <FormGroup sx={{ mb: 0.5 }}>
              <TextField
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Enter at least 6 characters",
                  },
                  pattern: {
                    value: PWD_REGEX,
                    message: "Spaces not allowed",
                  },
                  //option2://value only eg pattern: 'regex', required: true, //then use errors.password && <span>..err</span>
                })}
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
                onFocus={() => setPwdCaption(true)}
              />
              <Typography color="error.main" variant="caption">
                {errors.password?.message}
              </Typography>
              {pwdCaption && (
                <Typography variant="caption" color="muted.main">
                  At least 6 characters with no spaces
                </Typography>
              )}
            </FormGroup>

            <Grid2
              container
              justifyContent="space-between"
              alignItems="center"
              mt={1}
            >
              <FormGroup component="Grid" xs="auto" sx={{ fontSize: "12px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      checked={checkPolicy}
                      onChange={() => setCheckPolicy(!checkPolicy)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "muted.main" }}>
                      I agree to privacy policy & terms
                    </Typography>
                  }
                />
              </FormGroup>
            </Grid2>

            <Button
              type="submit"
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              color="secondary"
              disabled={!checkPolicy}
            >
              Sign up
            </Button>
          </form>

          <Typography variant="body2" mt={3} sx={{ color: "muted.main" }}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>

          <Divider sx={{ pt: 2 }}> or </Divider>
          {/* 
              <Button
                sx={{ mb: 2 }}
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<GoogleIcon />}
              >
                Continue with Google
              </Button>
             
               */}
        </CardContent>
        <CardActions sx={{ display: "block", textAlign: "center" }}>
          <IconButton
            onClick={() =>
              window.open("http://localhost:4000/api/auth/sso/google", "_self")
            }
          >
            <GoogleIcon sx={{ color: "error.main" }} />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(
                "http://localhost:4000/api/auth/sso/facebook",
                "_self"
              )
            }
          >
            <FacebookIcon sx={{ color: "primary.main" }} />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(
                "http://localhost:4000/api/auth/sso/linkedin",
                "_self"
              )
            }
          >
            <LinkedInIcon sx={{ color: "primary.main" }} />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open("http://localhost:4000/api/auth/sso/github", "_self")
            }
          >
            <GitHubIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Signup;
