import { Stack } from "@mui/system";
import Box from "@mui/system/Box";
import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Snackbar,
  TableFooter,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import NoteFilter from "./NoteFilter";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Intro from "../../components/Intro";
import AddIcon from "@mui/icons-material/Add";
import SSPagination from "../../components/SSPagination";
import axios from "axios";
import { BASE_URL } from "../../constants/axiosConstants";
import { selectCurrentToken } from "../auth/authSlice";
import SS2Pagination from "../../components/SS2Pagination";
import MUIPagination from "../../components/MUIPagination";
import NoteItem from "./NoteItem";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const NoteList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState([]);

  //filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [title, setTitle] = useState(searchParams.get("q") || "");
  const [filterError, setFilterError] = useState(null);
  const [cleared, setCleared] = useState(false);

  //bulk actions
  const [bulkCheck, setBulkCheck] = useState(false);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //filter dialog
  const [openD, setOpenD] = React.useState(false);
  const handleClickOpenD = () => {
    setOpenD(true);
    setFilterError(null);
  };
  const handleCloseD = () => {
    setOpenD(false);
    setFilterError(null);
  };

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  //const currentPage = searchParams.get("page") || 1; //for mui render//changes on url change
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1); //for custom pag..
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  //for custom pagination & mui onchange
  const handlePageChange = (page) => {
    setCurrentPage(page);

    title
      ? navigate(`/notes?page=${currentPage}&q=${title}`)
      : navigate(`/notes?page=${page}`); //update url
  };


  /* ----------------------------------------
   FETCH NOTES SERVICE
   ----------------------------------------*/
  const fetchNotes = async () => {
    try {
      setMessage("Loading...");
      const {
        data: { notes, pages },
      } = await axiosPrivate.get(
        `/api/notes?page=${currentPage}&size=${itemsPerPage}&fromDate=${fromDate}&toDate=${toDate}&search=${title}`
      );

      setTotalPages(pages);
      setData(notes);
      setMessage("Fetched");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
      setData([]);
    }
  };

  /* ----------------------------------------
   HANDLE SEARCH & FILTER
   ----------------------------------------*/
  //handle date filter//on submit
  const handleDateFilter = () => {
    if (!fromDate && !toDate) {
      setFilterError(true);
      return null; //
    }
    fetchNotes();
    handleCloseD();
  };

  //handle search query/title on enter
  const handleSearchQuery = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      fetchNotes();
    }
  };
  //clear filter//
  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setCleared(!cleared);
  };

  useEffect(() => {
    fetchNotes();
  }, [cleared]);

  //update url
  useEffect(() => {
    title && navigate(`/notes?page=${currentPage}&q=${title}`);
  }, [title, navigate]);

  //checked

  const handleChecked = (id) => {
    const newData = data.map((note) => {
      if (note.noteId === id) {
        return { ...note, isChecked: note.isChecked ? !note.isChecked : true };
      }

      return note;
    });

    setData(newData);
  };

  //bulk

  const handleBulkCheck = () => {
    const newData = data.map((note) => {
      return { ...note, isChecked: !bulkCheck };
    });

    setData(newData);

    setBulkCheck(!bulkCheck);
  };

  

  /* ----------------------------------------
   FETCH NOTES ON MOUNT & PAGE CHANGE
   ----------------------------------------*/
  useEffect(() => {
    fetchNotes();
  }, [currentPage]);

  //dialog props
  const dialogProps = {
    open: openD,
    toDate,
    fromDate,
    setToDate,
    setFromDate,
    handleClickOpen: handleClickOpenD,
    handleClose: handleCloseD,
    handleDateFilter,
    filterError,
    setFilterError,
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
        >
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{ display: "flex" }}
        justifyContent="space-between"
        alignItems="start"
      >
        <Intro>Notes</Intro>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="secondary"
          onClick={() => navigate("/notes/new")}
        >
          Add new
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 900 }} component={Paper}>
        <Grid
          container
          justifyContent="space-around"
          sx={{
            flexDirection: { xs: "column", lg: "row" },
            px: 2,
            py: 2,
          }}
        >
          <Grid auto py={2} px={1}>
            <Button
              sx={{ minWidth: "10%" }}
              size="medium"
              startIcon={<KeyboardArrowDownIcon />}
              variant="outlined"
              color="secondary"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Dashboard
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>Approve (5)</MenuItem>
              <MenuItem onClick={handleClose}>Delete (5)</MenuItem>
            </Menu>
          </Grid>
          <Grid xs py={2} px={1}>
            <TextField
              onChange={(e) => setTitle(e.target.value?.trim()?.toLowerCase())}
              size="small"
              fullWidth
              color="secondary"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton color="dark">
                      <SearchIcon onClick={() => {}} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyPress={handleSearchQuery}
            />
          </Grid>

          <Grid auto py={2} px={1}>
            <Button
              startIcon={<SettingsIcon />}
              color="secondary"
              variant="outlined"
              size="medium"
              onClick={handleClickOpenD}
            >
              Filter
            </Button>
            <NoteFilter {...dialogProps} />
          </Grid>
        </Grid>

        <Box color="primary.main" p={3}>
          <Typography>
            {" "}
            {title && `Search result for term: ${title}`}
          </Typography>
          <Typography>
            {fromDate &&
              `Search result for date filter: from: ${
                fromDate && fromDate?.toLocaleDateString?.("en-GB")
              } => ${toDate && toDate?.toLocaleDateString?.("en-GB")}`}
            <Button
              color="error"
              onClick={handleClearFilter}
              variant="outlined"
              sx={{ float: "right" }}
            >
              Clear filters
            </Button>
          </Typography>
        </Box>

        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          size="small"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                align="left"
                sx={{ minWidth: "11%" }}
              >
                <Box
                  sx={{ display: "flex" }}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Checkbox checked={bulkCheck} onChange={handleBulkCheck} />
                  <Typography component="span" variant="subtitle2">
                    Order Id
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Date created</TableCell>
              <TableCell>Deadline</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((note) => (
              <NoteItem
                key={note.noteId}
                note={note}
                handleChecked={handleChecked}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box py={4}>
        {/* <SS2Pagination
          currentPage={currentPage}
          pages={totalPages}
          setCurrentPage={handlePageChange}
        /> */}
        {/* <SSPagination
          page={currentPage}
          pages={totalPages}
          changePage={handlePageChange}
        />
         */}
        <MUIPagination
          count={totalPages}
          page={currentPage}
          //redirect="/notes?page" //when using render item
          changePage={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default NoteList;
