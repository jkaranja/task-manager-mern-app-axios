import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

import { Card, CardContent, CardHeader } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import axios from "axios";
import { BASE_URL } from "../constants/axiosConstants";

const VerifyingEmail = () => {
  const navigate = useNavigate();

  const { token } = useParams();

  const [message, setMessage] = useState("Verifying...");

  const [status, setStatus] = useState(null);

  const client = axios.create({
    baseURL: BASE_URL,
  });

  const verify = async () => {
    try {
      const res = await client.post(`/api/auth/verify/${token}`);
      // setStatus(res.status);
      setStatus(200);
      setMessage(res.data?.message);
    } catch (error) {
      // setStatus(error.response.status);
      setStatus(400);
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 2, minWidth: "450px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex" }} justifyContent="center">
              {!status && (
                <CircularProgress size={45} color="inherit" thickness={2} />
              )}

              {status === 200 && (
                <Avatar sx={{ width: 45, height: 45, bgcolor: "success.main" }}>
                  {" "}
                  <CheckIcon />{" "}
                </Avatar>
              )}
              {status === 400 && (
                <Avatar sx={{ width: 45, height: 45, bgcolor: "error.main" }}>
                  {" "}
                  <ClearIcon />{" "}
                </Avatar>
              )}
            </Box>
          }
        />
        <CardContent>
          <Typography gutterBottom paragraph mb={5} align="center">
            {message}
          </Typography>

          {status === 200 && (
            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => navigate("/orders")}
            >
              Proceed to account
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyingEmail;
