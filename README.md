
> The project is a Work In Progress

# Jadir


# Directories hierarchy
 - `app/` contains the distributable web application
 - `server/` contains the application's back-end server using node.js
 - `web/` contains the app's sources which are then bundled into the `app/` directory

# Running the project

## Build the web application
To do so you must first build the app' sources placed in the `web/` directory.

 - Place yourself in the `web/` directory then use `npm install` to install the packages,
 - Use `npm run build` to build from the sources, the result bundle should be in `app/bundle.app.js`

## Run the server
 - Place yourself in the `server/` directory then use `npm install` to install the packages,
 - Use `npm start` to launch the server, localhost:3000 is now opened in your default browser

## Get to the web application
 - Go to localhost:3000, the server will automatically serve you the index page



 # License
 This project uses the MIT License