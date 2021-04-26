const express = require('express');
// const home = require('./routes/home.js');
const db = require("./database/connection.js");

const server = express();

server.get('/', (request, response) => {
  db.query("SELECT firstname FROM fac_members")
  .then((result) => {
    const members = result.rows;
    const membersList = members.map((x) => `
      <li>${x.firstname}</li>
      <form action="/delete-user" method="POST" style="display: inline;">
        <button name="name" value="${x.firstname}" aria-label="Delete ${x.firstname}">
          Delete
        </button>
      </form>`).join("");

    response.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>My Database</h1>
      <ul>
        ${membersList}
      </ul>
      <a href='/add-person'>Add yourself to the list!</a><br>
      <a href='/comments'>Add a comment!</a>
    </body>
    </html>
    `);
  })
})

server.get('/add-person', (request, response) => {
    response.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>My Database</h1>
      <form action="/add-person" method="POST">
      <p>
        <label for="username">Your first name</label>
        <input id="username" name="username">
      </p>
      <p>
        <button type="submit">Add</button>
      </p>
    </form>
    <button><a href='/'>Back to home</a></button>
    </body>
    </html>
  `);
})

const bodyHandler = express.urlencoded({ extended: false });

server.use(bodyHandler);

server.post('/add-person', (request, response) => {
  const data = request.body;
  const values = Object.values(data);
  db.query(
    "INSERT INTO fac_members (firstname) VALUES ($1)",
    values
  ).then(() => {
    response.redirect("/");
  });
})

server.post('/delete-user', (request, response) => {
  const userToDelete = [request.body.name];
  return db
    .query(`DELETE FROM fac_members WHERE firstname = $1;`, userToDelete)
    .then(() => {
      response.redirect("/");
    })
})

server.post('/delete-comment', (request, response) => {
  const commentToDelete = [request.body.name];
  console.log(commentToDelete) //eg. "Ko is kind and funny"
  return db
    .query(`DELETE FROM comments WHERE text_content = $1;`, commentToDelete)
    .then(() => {
      response.redirect("/comments");
    })
})

server.get('/comments', (request, response) => {
  db.query(
    "select commenter.text_content, comments.text_content from commenter inner join comments on commenter.commenter_id = comments.id"
      ).then((result) => {
    const comments = result.rows;
    const commentList = comments.map((x) => 
      `<li>${x.text_content}</li>
      <form action="/delete-comment" method="POST" style="display: inline;">
        <button name="name" value="${x.text_content}" aria-label="Delete ${x.text_content}">
          Delete
        </button>
      </form>`
    ).join("");
    
    response.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>My Database</h1>
      <ul>
        ${commentList}
      </ul>
      <button><a href='/'>Back to home</a></button>
    </body>
    </html>
    `);
  })
})


const PORT = 3000;

server.listen(PORT, () => console.log(`Listening on ${PORT}`))