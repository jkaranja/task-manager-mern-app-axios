import { Stack } from "@mui/system";
import Box from "@mui/system/Box";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TableFooter,
  TablePagination,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";

import Intro from "../components/Intro";
import NativeTable from "../components/NativeTable";
import DataGridTable from "../components/DataGridTable";
import DashLayout from "../components/DashLayout";

const Completed = () => {
  return (
    <Box>
      <Intro>Manage orders</Intro>

      <NativeTable />
    </Box>
  );
};

export default Completed;
