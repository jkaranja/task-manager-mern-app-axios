import React, { useState } from "react";

import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material";

import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/axiosConstants";
import axios from "axios";
import jwtDecode from "jwt-decode";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);

  // document.cookie; //returns a string with list of all cookies separated by semicolon

  //use regex to extract a cookie by name/key //or use js-cookie
  let token = document.cookie.replace(
    /(?:(?:^|.*;\s*)resend\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const decode = () => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const email = decode()?.email;

  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, //or add axios.defaults.withCredentials = true in app.js or top of file
  });

  const handleResend = async () => {
    setMessage("loading...");

    try {
      const { data: response } = await client.post("/api/user/resend/email");

      setMessage(response.message);
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
      <Card sx={{ pt: 4, px: 2, pb: 2, maxWidth: "450px" }}>
        <form>
          <CardHeader
            title={
              <Typography variant="h4" gutterBottom>
                Verify your email
              </Typography>
            }
            subheader={
              token ? (
                <Typography variant="body1">
                  We've sent a verification link to your email address:
                  <Typography
                    variant="body1"
                    component="span"
                    px
                    fontWeight="bold"
                  >
                    {email || "..."}.
                  </Typography>
                  Please click the link to activate your account.
                </Typography>
              ) : (
                <Typography gutterBottom paragraph mt={3} color="error.main">
                  Link has expired!
                </Typography>
              )
            }
          />
          <CardContent>
            {/* <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => navigate("/orders")}
            >
              Skip for now
            </Button> */}
          </CardContent>
          <CardActions sx={{ display: "block" }}>
            {token && (
              <Box>
                <Typography component="span" px={1}>
                  Didn't get the mail?
                </Typography>

                <Link
                  color="secondary"
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={handleResend}
                >
                  Resend
                </Link>
              </Box>
            )}
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
