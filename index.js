const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:'',
    database:'autok'
  })

  con.connect ((err) => {
    if(err){
        console.log('Nem sikerült kapcsolodni az adatbázishoz');
    }else{
        console.log("Sikeres volt az adatbázis kapcsolat");
    }
  })

  app.get('/post', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/post', (req, res) => {
    const szin = req.body.szin;
    const marka = req.body.marka;
  
    con.query('INSERT INTO auto (szin,marka) VALUES (?, ?)', [szin,marka], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Hiba történt az adatok mentésekor.');
        } else {
            console.log("Sikeresen hozzáadva az adatbázishoz.");
            res.redirect('/post'); // Visszairányítás az űrlapra a sikeres feltöltés után
        }
    });
  });

  
//   app.get('/fetch', (req, res) => {  
//     con.query("SELECT * FROM auto", function(err, result, fields) {
//         if(err){
//             console.log(err);
//           }
//           else{
//             res.send(result)
//           }
//     });
    
//   });


app.get('/fetch/:id', (req, res) => {
    const id = req.params.id;

    con.query("SELECT * FROM auto WHERE id = ?", id, function(err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/fetch', (req, res) => {  
  con.query("SELECT * FROM auto", (err, result, fields) => {
      if(err){
          console.log(err);
          res.status(500).send('Hiba történt az adatok lekérdezésekor.');
      } else {
          let tableHTML = '<table border="1"><tr><th>ID</th><th>Szín</th><th>Márka</th></tr>';
          result.forEach(row => {
              tableHTML += `<tr><td>${row.id}</td><td>${row.szin}</td><td>${row.marka}</td></tr>`;
          });
          tableHTML += '</table>';
          res.send(tableHTML);
      }
  });
});


  app.put('/update/:id',(req,res) => {
    const id = req.params.id;
    const szin=req.body.szin; 
    const marka=req.body.marka;  
    con.query('UPDATE auto SET szin=?, marka=? WHERE id=?',[szin,marka,id],(err,result)=> {
      if(err){
        console.log(err);
      }
      else{
        res.send("UPDATED")
      }
    })
  })

  app.delete('/delete/:id',(req,res) => {
    const delid = req.params.id;
    con.query('delete from auto where id=?',delid,(err,result) => {
      if(err){
        console.log(err);
      }
      else{
        res.send("Deleted")}
    
    })
  })

app.listen(5000, (err) => {
    if(err){
        console.log('Wrong');
    }else{
        console.log("Elindult az 5000-es porton");
    }
})
