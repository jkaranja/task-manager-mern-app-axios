import {
  Box,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const NoteItem = ({ note, checked, handleChecked }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <TableRow
      key={note._id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell padding="checkbox" align="left">
        <Box
          sx={{ display: "flex" }}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Checkbox
            checked={note.isChecked ? note.isChecked : false}
            onChange={() => handleChecked(note.noteId)}
          />
          <Typography component="span" color="secondary">
            #{note.noteId}
          </Typography>
        </Box>
      </TableCell>
      <TableCell component="th" scope="row">
        {note.title}
      </TableCell>
      <TableCell>
        {new Date(note.updatedAt).toLocaleDateString("en-GB")}
      </TableCell>
      <TableCell>
        {new Date(note.deadline).toLocaleDateString("en-GB")}
      </TableCell>

      <TableCell align="center">
        <IconButton
          onClick={() =>
            navigate(`/notes/view/${note.noteId}`, {
              state: { from: location },
              replace: true,
            })
          }
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          onClick={() =>
            navigate(`/notes/edit/${note.noteId}`, {
              state: { from: location },
              replace: true,
            })
          }
        >
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteOutlineIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default NoteItem;
