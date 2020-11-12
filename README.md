# Serverless Announcements Dashboard

Simple showcase of public dashboard for small announcements.

# Functionality of the application

* Users can create announcements in their private pulpit, which are visible only to them until published.
* Users can add one image to their announcement.
* User can publish an announcement which then will be shown on the main page of application.
* User can delete their own announcements.


# How to run the application

## Backend

To deploy an application run the following commands:
* Function are packaged separetly and for this you need to execute `export NODE_OPTIONS=--max_old_space_size=4096` before runing `sls deploy -v`.
```
cd backend
npm install
sls deploy -v
```

## Frontend


The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```



This should start a development server with the React application that will interact with the serverless Announcements Dashboard application.

