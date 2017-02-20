# Silofunds Readme #

## Prerequisites ##

* Elasticsearch
* Postgresql
* Node.js version 0.12.7 (see note 1)
* npm

## Installing Silofunds ##

Make sure you have the following files not included in this repositry:

* .env
* secrets.js
* organisations.json
* funds.json

Installing the npm packages

* Run 'npm install' and make sure this command completes successfully.

Creating the development database

* Run 'psql' to open the postgres cli
* Type 'create table silofunds_development;'
* Press Ctrl-D to exit
* Run 'npm start' to start the server
* Visit http://localhost:3001/admin in your browser
* Enter the 'migrations' tab
* Click 'Execute all pending'
* Refresh the page until all migrations are complete
* Enter the 'Organisations' tab
* Tick the 'Non-sequential IDs' checkbox
* Click 'Choose file' and choose the organisations.json file
* Click 'Upload JSON!'
* Enter the 'Funds' tab
* DO NOT check the 'Non-sequential IDs' checkbox
* Click 'Choose file' and choose the funds.json file
* Click 'Upload JSON!'

You should now have a fully functioning Silofunds development environment.

## Running Silofunds ##

* Enter the root directory and run 'npm start'

## Notes ##

Note 1: Intsall node version manager using npm, and then use the command 'nvm use v0.12.7', to switch to a compatible version of node.