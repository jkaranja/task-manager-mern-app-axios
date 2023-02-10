import React, { useCallback, useEffect, useState } from "react";

import Dropzone from "../../components/Dropzone";

import {
  Alert,
  Button,
  FormGroup,
  FormLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Intro from "../../components/Intro";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DatePicker from "../../components/DatePicker";
import { BASE_URL } from "../../constants/axiosConstants";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useForm } from "react-hook-form";
import {
  CircularProgressWithLabel,
  LinearProgressWithLabel,
} from "../../styles";
import useAxiosAPI from "../../hooks/useAxiosAPI";

const PostNote = () => {
  const axiosAPI = useAxiosAPI();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState(0);

  const token = useSelector(selectCurrentToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  ///submit note form
  const onSubmitNote = async (inputs, e) => {
    e.preventDefault();
    if (!selectedDate) return null;

    const formData = new FormData();

    selectedFiles.forEach((file, i) => {
      formData.append("files", selectedFiles[i]);
    });

    formData.append("deadline", selectedDate);

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
      const { data: response } = await axiosAPI.post(`/api/notes`, formData, {
        ...uploadProgress,
      });
      reset({ content: "", title: "" });
      setSelectedFiles([]);
      setMessage("Saved");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

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
          icon={
            progress && (
              <CircularProgressWithLabel color="primary" value={progress} />
            )
          }
        >
          {message}
        </Alert>
      </Snackbar>
      <Intro>Post new note</Intro>

      <Box component={Paper} p={4}>
        <form onSubmit={handleSubmit(onSubmitNote)}>
          <Typography variant="body1" gutterBottom>
            Enter note details
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

          <FormGroup sx={{ mb: 4 }}>
            <FormLabel>Attach files</FormLabel>
            <Dropzone
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          </FormGroup>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="secondary">
              Post note
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PostNote;
