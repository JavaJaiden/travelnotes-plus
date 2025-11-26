const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const notesRouter = require('./routes/notes');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/views', express.static('views'));

mongoose.connect(process.env.MONGODB_URI, {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/notes', notesRouter);
app.get('/', (req, res) => res.redirect('/views/addNote.html'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
