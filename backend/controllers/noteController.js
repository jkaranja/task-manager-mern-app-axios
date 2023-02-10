const Note = require("../models/noteModel");
const User = require("../models/userModel");
const deleteFiles = require("../utils/deleteFiles");
const fs = require("fs");
const cleanFiles = require("../utils/cleanFiles");

//filter regex
//https://attacomsian.com/blog/mongoose-like-regex
//https://stackoverflow.com/questions/43729199/how-i-can-use-like-operator-on-mongoose
//https://dev.to/itz_giddy/how-to-query-documents-in-mongodb-that-fall-within-a-specified-date-range-using-mongoose-and-node-524a
//https://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date

// @desc Get all notes
// @route GET api/notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB

  /**----------------------------------
         * PAGINATION
      ------------------------------------*/
  let { page, size, search, toDate, fromDate } = req.query;

  page = parseInt(page) || 1; //current page no. / sent as string convert to number//page not sent use 1
  size = parseInt(size) || 15; //items per page//if not sent from FE/ use default 15
  const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items

  /**---------------------------
   * Filter/search& date filter
   -----------------------------*/
  //title like %_keyword% //
  const searchQuery = {
    title: { $regex: `.*${search}.*`, $options: "i" },
  };
  const sQuery = search ? searchQuery : {};
  //range range query
  let dateQuery;
  if (!fromDate && !toDate) dateQuery = {};
  if (fromDate && !toDate)
    dateQuery = {
      updatedAt: {
        $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), //start searching from the very beginning of our start date
        //$lte: new Date(new Date(toDate).setHours(23, 59, 59)), //up to but not beyond the last minute of our endDate
      },
    };
  if (!fromDate && toDate)
    dateQuery = {
      updatedAt: {
        //$gte: new Date(new Date(fromDate).setHours(00, 00, 00)), //start searching from the very beginning of our start date
        $lte: new Date(new Date(toDate).setHours(23, 59, 59)), //up to but not beyond the last minute of our endDate
      },
    };
  if (fromDate && toDate)
    dateQuery = {
      updatedAt: {
        $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), //start searching from the very beginning of our start date
        $lte: new Date(new Date(toDate).setHours(23, 59, 59)), //up to but not beyond the last minute of our endDate
      },
    };

  /**---------------------------
   * End of Filter/search& date filter
   -----------------------------*/
  const total = await Note.find({ $and: [sQuery, dateQuery] }).count(); //Task.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No notes found" });
  }
  const pages = Math.ceil(total / size);

  let query = Note.find({ $and: [sQuery, dateQuery] }).lean();

  query = query.skip(skip).limit(size); //you can use projection,  .find({}, {limit, skip})

  //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "Page not found" });
  }

  const result = await query;

  res.status(200).json({
    page,
    pages,
    count: result.length,
    notes: result,
  });
};

// @desc Get all notes
// @route GET api/notes/:id
// @access Private
const getSingleNote = async (req, res) => {
  // Get single note
  const { id } = req.params;

  const note = await Note.findOne({ noteId: id }).exec();

  // If note not found
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  res.json({
    files: note.files,
    noteId: note.noteId,
    title: note.title,
    content: note.content,
    deadline: note.deadline,
  });
};

// @desc Create new note
// @route POST api/notes
// @access Private
const createNewNote = async (req, res) => {
  const { title, content, deadline } = req.body;

  const { files, user } = req;

  //clean files
  const fileArr = cleanFiles(files);

  // Confirm data
  if (!title || !content || !deadline) {
    deleteFiles(fileArr); //clear failed req
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create and store the new user
  const note = await Note.create({
    user: user._id,
    title,
    content,
    deadline,
    files: fileArr,
  });

  if (!note) {
    deleteFiles(fileArr); //clear failed req
    return res.status(400).json({ message: "Invalid note data received" });
  }

  // Created
  return res.status(201).json({ message: "New note created" }); //201 is default
};

// @desc Update a note
// @route PATCH /notes/:id
// @access Private
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, deadline } = req.body;

  const { user, files } = req;

  //clean files
  const fileArr = cleanFiles(files);

  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   deleteFiles(fileArr); //clear failed req
  //   return res.status(400).json({ message: "Note not found" });
  // }

  // Confirm data
  if (!title || !content || !deadline) {
    deleteFiles(fileArr); //clear failed req
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Note.findOne({ noteId: id }).exec();

  if (!note) {
    deleteFiles(fileArr); //clear failed req
    return res.status(400).json({ message: "Note not found" });
  }
  //del prev files//if new files exist
  if (fileArr?.length) {
    deleteFiles(note.files);
  }

  note.title = title;
  note.content = content;
  note.deadline = deadline;
  fileArr?.length && (note.files = fileArr);

  const updatedNote = await note.save();

  res.json({
    files: updatedNote.files,
    noteId: updatedNote.noteId,
    title: updatedNote.title,
    content: updatedNote.content,
    deadline: updatedNote.deadline,
  });
};

// @desc Delete a note
// @route DELETE /notes/:id
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.params;

  // Confirm note exists to delete
  const note = await Note.findOne({ noteId: id }).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  deleteFiles(note.files); //del files for note

  const result = await note.deleteOne();

  const reply = `Note deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  getSingleNote,
  createNewNote,
  updateNote,
  deleteNote,
};
