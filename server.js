const express = require('express');
const path = require('path');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes",(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
            const notes = JSON.parse(data);
            res.json(notes)
    })
})

app.post("/api/notes",(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
            const notes = JSON.parse(data);
            const newNote = {
                ...req.body,
                id: uuidv4(),
            }
            notes.push(newNote);
            fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2) ,(err, data) => {
                    res.json(notes);
            })
        }
    )
})


app.delete("/api/notes:id",(req,res)=>{
    require('./db/db.json').destroy({
        where: {
            id: req.params.id
        }
    }).then(delNote => {
        res.json(delNote);
})
})

app.listen(PORT,() => {
    console.log(`App listening at http://localhost:${PORT}`)
})