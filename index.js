
const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views engine', 'ejs'); // EJS beállítása


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'autok'
})

con.connect((err) => {
    if (err) {
        console.log('Nem sikerült kapcsolodni az adatbázishoz');
    } else {
        console.log("Sikeres volt az adatbázis kapcsolat");
    }
})

app.get('/post', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/post', (req, res) => {
    const szin = req.body.szin;
    const marka = req.body.marka;

    con.query('INSERT INTO auto (szin,marka) VALUES (?, ?)', [szin, marka], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Hiba történt az adatok mentésekor.');
        } else {
            console.log("Sikeresen hozzáadva az adatbázishoz.");
            res.redirect('/post'); // Visszairányítás az űrlapra a sikeres feltöltés után
        }
    });
});

// app.get('/fetch', (req, res) => {
//     con.query("SELECT * FROM auto", (err, result, fields) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Hiba történt az adatok lekérdezésekor.');
//         } else {
//             let tableHTML = '<table class="table"><thead><tr><th>ID</th><th>Szín</th><th>Márka</th></tr></thead><tbody>';
//             result.forEach(row => {
//                 tableHTML += `<tr><td>${row.id}</td><td>${row.szin}</td><td>${row.marka}</td></tr>`;
//             });
//             tableHTML += '</tbody></table>';
//             res.send(tableHTML);
//         }
//     });
// });

app.get('/fetch', (req, res) => {
    con.query("SELECT * FROM auto", (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Hiba történt az adatok lekérdezésekor.');
        } else {
            res.render('table', { autok: result }); // Táblázat megjelenítése az EJS fájlon keresztül
        }
    });
});


app.listen(5000, (err) => {
    if (err) {
        console.log('Wrong');
    } else {
        console.log("Elindult az 5000-es porton");
    }
})
