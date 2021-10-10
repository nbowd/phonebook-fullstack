Work in progress Try the app here: https://agile-falls-64774.herokuapp.com/

Users can add new contacts, create new entries, search for a specific entry, or update an existing contact.

Backend handling for a phonebook CRUD application built with React.js, Express, and Node.js while storing data using MongoDB.

The backend focuses on the Node.js and Express portion of this application. Express handles the routing for all of the HTTP requests. This app is setup for both local development and heroku production.

On deploy, grabs a build from the frontend and serves the compiled html. Uses 'morgan' package to for request logging.
