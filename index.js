const express = require('express');
const connection = require('./config');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// GET - Retrieve all of the data from your table
app.get('/api/wilders', (req, res) => {
   connection.query('SELECT * FROM wilders', (err, results) => {
      if (err) {
         res.status(500).send('Error retrieving list of wilders');
      } else {
         res.json(results);
      }
   });
});

//GET - Retrieve specific fields (i.e. id, names, dates, etc.)
app.get('/api/wilders/firstnames', (req, res) => {
   connection.query('SELECT firstname from wilders', (err, results) => {
      if (err) {
         res.status(500).send('Error retrieving the data');
      } else {
         res.json(results);
      }
   });
});


//GET - Retrieve a data set with the following filters (use one route per filter type):
//A filter for data that contains... (e.g. name containing the string 'wcs') 
app.get('/api/wilders/firstname/:letter', (req, res) => {
 const letter = req.params.letter;

 connection.query(`SELECT firstname FROM wilders WHERE firstname LIKE "%${letter}%"`, (err, results) => {
     if (err) {
         res.status(500).send("Error retrieving the data");
     } else {
         res.json(results);
     }
 });
});



//A filter for data that starts with... (e.g. name beginning with 'campus')
app.get('/api/wilders/starts', (req, res) => {
   const q = 'SELECT * FROM wilders WHERE firstname LIKE "A%"';
   connection.query(q, (err, results) => {
      if (err) {
         res.status(500).send('Error retrieving the data');
      } else {
         res.json(results);
      }
   });
});



// A filter for data that is greater than... (e.g. date greater than 18/10/2010)
app.get('/api/wilders/dategreater', (req, res) => {
  const q = 'SELECT * FROM wilders WHERE birthday > "1991-01-01"';
  connection.query(q, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving the data');
    } else {
      res.json(results);
    }
  });
});



// GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter
app.get('/api/wilders/:data/:order', (req, res) => {
   const q = `SELECT * from wilders order by ${req.params.data} ${req.params.order}`;
   connection.query(q, (err, results) => {
     if (err) {
       res.status(500).send('There was an error retrieving the data');
     } else {
       res.json(results);
     }
   });
 });

 
// POST - Insertion of a new entity
app.post('/api/wilders', (req, res) => {
  // Get the data sent
  const formData = req.body;
  const q = 'INSERT INTO wilders SET ?'
  // connection to the database, and insertion of the painting
  connection.query(q, formData, (err, results) => {
    if (err) {
      // If an error has occurred, then the user is informed of the error
      res.status(500).send('Error saving a wilder');
    } else {
      // If everything went well, we send a status "ok".
      res.sendStatus(200);
    }
  });
});

 
 // PUT - Modification of an entity
 app.put('/api/wilders/:id', (req, res) => {
   const idWilders = req.params.id;
   const formData = req.body;
   connection.query('UPDATE wilders SET ? WHERE id = ?', [formData, idWilders], err => {
     if (err) {
       console.log(err);
       res.status(500).send('There was an error editing the data');
     } else {
       res.sendStatus(200);
     }
   });
 });


 
 // PUT - Toggle a Boolean value
 app.put('/api/wilders/isGirl/:id', (req, res) => {
   const idWilders = req.params.id;
   connection.query('UPDATE wilders SET isActive = 1-isActive WHERE id = ?', [idWilders], err => {
     if (err) {
       console.log(err);
       res.status(500).send('There was an error editing the data');
     } else {
       res.sendStatus(200);
     }
   });
 });
 

 // DELETE - Delete an entity
 app.delete('/api/wilders/:id', (req, res) => {
   const idWilders = req.params.id;
   connection.query('DELETE FROM wilders WHERE id = ?', [idWilders], err => {
     if (err) {
       console.log(err);
       res.status(500).send('There was an error deleting the data');
     } else {
       res.sendStatus(200);
     }
   });
 });
 
 // DELETE - Delete all entities where boolean value is false
 app.delete('/api/wilders/', (req, res) => {
   connection.query('DELETE FROM wilders WHERE isGirl = 0', err => {
     if (err) {
       console.log(err);
       res.status(500).send('There was an error deleting the data');
     } else {
       res.sendStatus(200);
     }
   });
 });
 
 
 app.listen(port, (err) => {
   if (err) {
     throw new Error('Something bad happened...');
   }
 
   console.log(`Server is listening on ${port}`);
 });