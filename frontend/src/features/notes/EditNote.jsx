import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormGroup,
  FormLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Intro from "../../components/Intro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DatePicker from "../../components/DatePicker";
import Dropzone from "../../components/Dropzone";
import { selectCurrentToken } from "../auth/authSlice";
import axios from "axios";
import { BASE_URL } from "../../constants/axiosConstants";
import { useForm } from "react-hook-form";
import convertBytesToKB from "../../common/convertBytesToKB";
import useAxiosAPI from "../../hooks/useAxiosAPI";
// import { compareAsc, format } from "";

const EditNote = () => {
  const axiosAPI = useAxiosAPI();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState(0);

  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [removedFiles, setRemovedFiles] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);

  const { id } = useParams();

  const from = location.state?.from?.pathname || "/notes";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //set defaults
  useEffect(() => {
    reset({ title: data.title, content: data.content });
    setCurrentFiles(data.files);
    setSelectedFiles([]);

    setRemovedFiles([]);
    //setSelectedDate(format(new Date(data.deadline.toISOString()), "dd/MM/yyyy h:mm aa"));//not working
    setSelectedDate(new Date(data.deadline).getTime()); //use .getTime() to pass as number//as date or iso string not working
  }, [data]);

  /* ----------------------------------------
   UPDATE NOTE
   ----------------------------------------*/
  ///submit note form
  const onSubmitNote = async (inputs, e) => {
    e.preventDefault();
    if (!selectedDate) return null;

    const formData = new FormData();

    selectedFiles.forEach((file, i) => {
      formData.append("files", selectedFiles[i]);
    });

    formData.append("deadline", selectedDate);

    formData.append("removedFiles", removedFiles);

    Object.keys(inputs).forEach((field, i) => {
      formData.append(field, inputs[field]);
    });

    //progress object
    const uploadProgress = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
        setProgress(percentage);
      },
    };
    try {
      setMessage("loading...");
      const { data } = await axiosAPI.patch(`/api/notes/${id}`, formData, {
        ...uploadProgress,
      });

      setMessage("Updated");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  /* ----------------------------------------
   REMOVE
   ----------------------------------------*/
  const handleRemove = (path) => {
    const removed = currentFiles.filter((file) => file.path === path);
    setRemovedFiles((prev) => [...prev, removed]);

    setCurrentFiles((prev) => {
      return prev.filter((file) => file.path !== path);
    });
  };

  /* ----------------------------------------
   FETCH NOTE
   ----------------------------------------*/
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setMessage("Loading...");
        const { data } = await axiosAPI.get(`/api/notes/${id}`);

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
      <Intro>Edit note</Intro>
      <Box component={Paper} p={4}>
        <form onSubmit={handleSubmit(onSubmitNote)}>
          <Typography variant="body1" gutterBottom>
            Update note
          </Typography>
          <Grid2
            container
            justifyContent="space-around"
            spacing={5}
            rowSpacing={0}
            sx={{
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Grid2 xs>
              <FormGroup sx={{ mb: 2 }}>
                <TextField
                  {...register("title", {
                    required: "Title is required",
                  })}
                  size="small"
                  color="secondary"
                  label="Title"
                  margin="dense"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography color="error.main" variant="caption">
                  {errors.title?.message}
                </Typography>
              </FormGroup>
            </Grid2>
            <Grid2 xs>
              <FormGroup sx={{ mb: 2 }}>
                <DatePicker
                  size="small"
                  color="secondary"
                  label="Deadline"
                  margin="dense"
                  fullWidth
                  showTimeSelect={true}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <Typography color="error.main" variant="caption">
                  {!selectedDate && "Deadline is required"}
                </Typography>
              </FormGroup>
            </Grid2>
          </Grid2>

          <FormGroup sx={{ mb: 2 }}>
            <TextField
              {...register("content", {
                required: "Note content is required",
              })}
              size="small"
              color="secondary"
              label="Note content"
              margin="dense"
              multiline
              minRows={4}
              maxRows={7}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography color="error.main" variant="caption">
              {errors.content?.message}
            </Typography>
          </FormGroup>
          <Grid2
            container
            justifyContent="space-between"
            spacing={5}
            rowSpacing={0}
            sx={{
              flexDirection: { xs: "column", lg: "row" },
            }}
          >
            <Grid2 xs>
              <FormGroup sx={{ mb: 4 }}>
                <FormLabel>Add files</FormLabel>
                <Dropzone
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                />
              </FormGroup>
            </Grid2>
            <Grid2 xs >
              <Typography>Current files</Typography>
              {currentFiles?.map((file, i) => (
                <Box
                  className="dropzone-file-preview"
                  key={i}
                  sx={{ flexDirection: { xs: "column", md: "row" } }}
                >
                  <Typography component="span">
                    {`${file?.filename?.slice(
                      0,
                      28
                    )}...${file?.filename?.split(".").pop()}`}
                  </Typography>
                  <Typography component="span">
                    {convertBytesToKB(file.size)} kb
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      window.confirm("Are you sure? File will be deleted") &&
                      handleRemove(file.path)
                    }
                    sx={{ p: 0, minWidth: 25 }}
                  >
                    X
                  </Button>
                </Box>
              ))}
            </Grid2>
          </Grid2>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="secondary">
              Update note
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditNote;
