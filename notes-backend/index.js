require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Note = require('./models/note')
const app = express();
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', function (req, res) {
    return [JSON.stringify(req.body), JSON.stringify(res.body)];
});

app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            tokens.body(req, res),
        ].join(' ');
    })
);

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
});

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find((note) => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const updatedNote = request.body;
    notes = notes.map((note) => (note.id === id ? updatedNote : note));

    response.json(updatedNote);
});

app.delete('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
});

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing',
        });
    }

    const note = new Note ({
        content: body.content,
        important: body.important || false,
    });

    note.save().then(savedNote => {
        response.json(savedNote)
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
