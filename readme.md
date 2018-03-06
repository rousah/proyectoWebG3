This is the project of group 03. 

The main `index.html` file includes jQuery, Popper.js and JavaScript Code from Bootstrap. Also the Bootstrap CSS file is loaded.

You can start working by copying the index.html rename it to your desire. Try to use the Bootstrap components as they describe it in the great [documentation](https://getbootstrap.com/docs/4.0/getting-started/introduction/). 

# Setup servidor

Requiered software: npm and sqlite3

Switch into `servidor` directory  
Run `npm install` to install dependecies  
Run `node servidor.js` to start the server

## Re-/creating the database file
open `sqlite3`  
open or create the db file:
`.open cultisense.db`
read the script to create basic users:
`.read scripts/create_user_table.sql`
