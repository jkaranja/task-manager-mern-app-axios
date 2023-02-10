import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import DragDropFiles from "../components/Dropzone";

import DashLayout from "../components/DashLayout";
import { Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Intro from "../components/Intro";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const Assign = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  return (
    <Box>
      <Intro>Assign orders</Intro>

      <Box component={Paper} p={4}>
        <Typography variant="body1">Enter order details</Typography>
        <Grid2 py={2} container justifyContent="space-between">
          <Grid2 xs>
            <TextField
              size="small"
              color="secondary"
              label="Username"
              margin="dense"
              required
              fullWidth
            />
          </Grid2>
          <Grid2 xs sx={{ ml: { md: 2 } }}>
            <TextField
              size="small"
              color="secondary"
              label="Email"
              margin="dense"
              required
              fullWidth
            />
          </Grid2>
        </Grid2>
        <TextField
          size="small"
          color="secondary"
          label="Password"
          margin="dense"
          required
          fullWidth
        />

        <DragDropFiles
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </Box>
    </Box>
  );
};

export default Assign;
