import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Intro from "../../components/Intro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BASE_URL } from "../../constants/axiosConstants";
import axios from "axios";
import { selectCurrentToken } from "../auth/authSlice";
import convertBytesToKB from "../../common/convertBytesToKB";
import DownloadIcon from "@mui/icons-material/Download";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const FileDownload = require("js-file-download");

const ViewNote = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState([]);

  const { id } = useParams();

  const from = location.state?.from?.pathname || "/notes";

  /* ----------------------------------------
   DOWNLOAD NOTE FILES
   ----------------------------------------*/
  const handleSingleDownload = async (filePath, filename) => {
    try {
      setMessage("Downloading...");
      const { data } = await axiosPrivate.post(
        `/api/download/single`,
        { filePath }
        // { responseType: "blob" }
      );

      FileDownload(data, filename);

      setMessage("Downloaded");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  //multiple
  const handleZipDownload = async (files) => {
    const filePaths = files.map((file) => file.path);

    try {
      setMessage("Downloading...");
      const { data } = await axiosPrivate.post(
        `/api/download/zip`,
        { filePaths },
        { responseType: "blob" }
      );

      //FileDownload(data, "filename.zip");

      setMessage("Downloaded");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  /* ----------------------------------------
   FETCH NOTE
   ----------------------------------------*/
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setMessage("Loading...");
        const { data } = await axiosPrivate.get(`/api/notes/${id}`);

        setData(data);

        setMessage("Fetched");
      } catch (error) {
        setMessage(
          error.response?.data?.message || error.message || error.toString()
        );
      }
    };

    fetchNote();
  }, []);

  if (message === "Loading...") {
    return <CircularProgress />;
  }
  return (
    <Box>
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
      <Button
        startIcon={<ArrowBackIcon />}
        color="secondary"
        sx={{ fontWeight: "bold", mb: 2 }}
        onClick={() => navigate(from, { replace: true })}
      >
        Notes
      </Button>
      <Intro>Note details</Intro>
      <Box>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={<Typography variant="subtitle1">Title</Typography>}
          />
          <Divider />
          <CardContent>
            <Typography paragraph> {data.title}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={<Typography variant="subtitle1">Note</Typography>}
          />
          <Divider />
          <CardContent>
            <Typography paragraph> {data.content}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={<Typography variant="subtitle1">Note files</Typography>}
            action={
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleZipDownload(data.files)}
                sx={{ px: 2 }}
              >
                Download
              </Button>
            }
          />
          <Divider />
          <CardContent sx={{ px: 2 }}>
            {data.files?.map((file, i) => (
              <Box className="dropzone-file-preview" key={i}>
                <Typography component="span">
                  {file.filename.slice(0, 50).trim()} ...
                </Typography>
                <Typography component="span">
                  {convertBytesToKB(file.size)} kb
                </Typography>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={() => handleSingleDownload(file.path, file.filename)}
                >
                  Download
                </Button>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ViewNote;
