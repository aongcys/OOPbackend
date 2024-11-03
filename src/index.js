const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors({ // ต้องมีเอาไว้ตอนที่จะมีการเรียกใช้จาก local อื่น
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: false,
}));

const Mainpath = path.join('/', 'Users', 'aongcys', 'Developer', 'OOP', 'Project', 'data', 'rsna-2024-lumbar-spine-degenerative-classification');
console.log(Mainpath);

fs.access(Mainpath, fs.constants.R_OK, (err) => { //เช็คว่า path มีจริงอะป่าว
    if (err) {
        console.error('Mainpath does not exist or is not readable:', Mainpath);
        process.exit(1);
    } else {
        console.log('Mainpath is accessible:', Mainpath);
    }
});

function filetree(directory) {

    const result = [];
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filepath = path.join(directory, file);
        const stats = fs.statSync(filepath);

        if (stats.isDirectory()) {
            result.push({
                name: file,
                type: 'folder',
                contents: filetree(filepath),
            });
        } else {
            result.push({
                name: file,
                type: 'file',
            });
        }
    });
    return result;
}

app.get('/allfile', (req, res) => {
    try {
        const getfiletree = filetree(Mainpath);
        res.json(getfiletree);
    } catch (err) {
        console.error('Error reading directory:', err);
        return res.status(500).send("Error: Cannot read files");
    }
});

app.get('/dicomfile', (req, res) => {
    const filedicom = req.query.file; //รับที่อยู่ไฟล์
    const filepath = path.join(Mainpath, filedicom);

    fs.readFile(filepath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.set('Content-Type', 'application/dicom');
        res.send(data);
    });

});

app.get('/csvfile', (req, res) => {

    const filecsv = req.query.file; //รับที่อยู่ไฟล์
    const filepath = path.join(Mainpath, filecsv);

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });

});

app.listen(port, () => {
    console.log('Server is running at port ' + port);
})