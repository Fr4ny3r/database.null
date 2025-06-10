import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'path';

// import { NextResponse } from 'next/server';
// import { get } from '@vercel/edge-config';

// export const config = { matcher: '/welcome' };

// export async function middleware() {
//   const greeting = await get('greeting');
//   return NextResponse.json(greeting);
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
const PORT = 3000



app.use(express.json())
app.use(cors())


const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {   
    console.error('Error opening database ' + err.message)
  };
    console.log('Base de datos abierta correctamente');
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
        "message" : "Users",
        "data" : rows
    });
  });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM users WHERE IdUser = ?', [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!rows) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
        "message" : "Users",
        "data" : rows
    });
  });
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id; 

const sqlPostUsers = `
    SELECT
        p.idPost,
        u.idUser as IdUser,
        u.userName as Name,
        u.nickName as Nick,
        p.contentTitle as Titulo,
        p.mediaType,
        p.mediaURL,
        p.createdAt,
        p.privacy
    FROM post p
    INNER JOIN users u ON u.idUser = p.idUser
    WHERE p.idUser = ?
`;

  db.all(sqlPostUsers, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }else{
    res.json({
        "message" : "Users",
        "data" : rows
    });
    }
});
});

app.get('/post', (req, res) => {
const sqlPostUsers = `
    SELECT
        p.idPost,
        u.idUser as IdUser,
        u.userName as Name,
        u.nickName as Nick,
        p.contentTitle as Titulo,
        p.mediaType,
        p.mediaURL,
        p.createdAt,
        p.privacy
    FROM post p
    INNER JOIN users u ON u.idUser = p.idUser
`;
  db.all(sqlPostUsers, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }else{
    res.json({
        "message" : "Users",
        "data" : rows
    });
    }
});
});


app.get('/usersPost', (req, res) => {
  db.all('SELECT * FROM users u JOIN post p ON u.idUser = p.idUser', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
        "message" : "Users",
        "data" : rows
    });
  });
});


app.get('/image/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT profilePhotoURL FROM users WHERE idUser = ?', [id], (err, row) => {
    if (err) {
      res.status(500).send('Error al obtener la imagen');
      return;
    }
    // console.log(row.profilePhoto)
    if (!row || !row.profilePhotoURL) {
      res.status(404).send('Imagen no encontrada');
      return;
    }
    res.set('Content-Type', 'image/png'); // Cambia a image/png si corresponde
    res.send(row.profilePhotoURL);
  });
});

app.get('/coverPhoto/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT coverPhotoURL FROM users WHERE idUser = ?', [id], (err, row) => {
    if (err) {
      res.status(500).send('Error al obtener la imagen');
      return;
    }
    // console.log(row.profilePhoto)
    if (!row || !row.coverPhotoURL) {
      res.status(404).send('Imagen no encontrada');
      return;
    }
    res.set('Content-Type', 'image/png'); // Cambia a image/png si corresponde
    res.send(row.coverPhotoURL);
  });
});

app.get('/imageDefault', (req, res) => {
    const imagePath = path.join(__dirname, 'src', 'assets', 'imagenUsuario.png');
    res.set('Content-Type', 'image/png');
    res.sendFile(imagePath);
});


app.get('/postMediaPhoto/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT mediaURLPhoto FROM post WHERE idPost = ?', [id], (err, row) => {
    if (err) {
      res.status(500).send('Error al obtener la imagen');
      return;
    }
    // console.log(row.profilePhoto)
    if (!row || !row.mediaURLPhoto) {
      res.status(404).send('Imagen no encontrada');
      return;
    }
    res.set('Content-Type', 'image/png'); // Cambia a image/png si corresponde
    res.send(row.mediaURLPhoto);
  });
});



app.listen(PORT, ()=>{
    console.log(`El server esta en http://localhost:${PORT}`)
})