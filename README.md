# Instant Messaging Service

## Overview

Welcome to the Instant Messaging service for the TalkMoni Social app! This project ensures secure real-time communication using WebSockets and JWT authentication while integrating AWS S3 for storage. The front-end, powered by React, offers a modern UI with real-time updates, Redux for state management, and comprehensive emoji support.

## Features

- **Secure Communication**: Leveraging JWT for secure authentication.
- **Real-Time Updates**: Utilizing WebSockets (via Socket.io) for instant messaging.
- **Scalable Storage**: AWS S3 integration for media and data storage.
- **Modern Front-End**: Built with React for a responsive and interactive user experience.
- **State Management**: Redux for efficient state management.
- **Emoji Support**: Rich emoji integration for expressive messaging.

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing user data and messages.
- **Socket.io**: Library for real-time web applications, enabling bi-directional communication.
- **jsonwebtoken**: For implementing JWT authentication.
- **AWS SDK**: For interacting with AWS services, specifically S3 for storage.
- **bcrypt**: For secure password hashing.
- **dotenv**: For managing environment variables.
- **Helmet**: For securing Express apps by setting various HTTP headers.
- **Multer**: For handling multipart/form-data, used for file uploads.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Redux**: Predictable state container for JavaScript apps.
- **Socket.io-client**: Client-side library for Socket.io.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Emoji Mart**: Comprehensive emoji picker.
- **FontAwesome**: Scalable vector icons.
- **React Router**: Declarative routing for React applications.
- **Date-fns**: Modern JavaScript date utility library.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB
- AWS account (for S3 integration)

### Dependencies
- `@aws-sdk/client-s3`: AWS S3 SDK for JavaScript.
- `bcrypt`: For password hashing.
- `cors`: Middleware to enable CORS.
- `dotenv`: To load environment variables.
- `express`: Web framework for Node.js.
- `express-rate-limit`: To limit repeated requests.
- `helmet`: To secure Express with HTTP headers.
- `jsonwebtoken`: To implement JWT for authentication.
- `mongodb`: Official MongoDB driver.
- `mongoose`: MongoDB object modeling tool.
- `mongoose-paginate-v2`: Pagination plugin for Mongoose.
- `multer`: Middleware for handling multipart form data.
- `socket.io`: Enables real-time bidirectional event-based communication.
- `uuid`: For the creation of RFC4122 UUIDs.

## Client - Version 0.1.0 (Private)

### Description
The client-side provides a rich front-end experience for the TalkMoni Social app with features like emoji support, scalable font icons, and a modern React interface.

### Dependencies
Primarily focused on the React ecosystem for UI rendering, state management with Redux, real-time updates with socket.io-client, and various other user interface libraries.

### Scripts
- `start`: Initiates the front-end application in development mode.
- `build`: Compiles the app for production readiness.
- `test`: Executes the test suite.
- `eject`: Removes the single build dependency from the project.

### Browserslist
Defines the compatibility of the client app with different browsers for both development and production builds.

## Common Information

### Author
stanly@math.ai

### License
ISC

## Installation and Running
For the server, clone the repository from the provided URL and run `npm install` to set up the dependencies. Use `npm start` to launch the messaging service. The client-side setup follows a similar pattern, with its own set of dependencies and start-up scripts.

Please adhere to the licensing terms and other guidelines as stipulated by the dependencies and the overarching ISC license of the application.
