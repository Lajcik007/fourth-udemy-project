# Serverless Announcements Dashboard

Simple showcase of public dashboard for small announcements.

# Functionality of the application

* Users can create announcements in their private pulpit.
* Users can add one image to their announcement.
* User can publish an announcement which then will be shown on the main page of application.
* User can delete their own announcements.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Announcements Dashboard application.

