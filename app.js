const express = require('express');
const db = require('./db');
const app = express();

app.get('/medicine/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM table1 WHERE Id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed.' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Medicine not found.' });
            return;
        }
        res.json(results[0]);
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


