# TalkMoni Social Messaging Service

## Server - Version 1.0.0

### Description
The server component of the TalkMoni Social app acts as the messaging service backend, facilitating API requests and managing real-time communication between users.

### Main Entry
index.js

### Scripts
- `test`: Indicates that no test suite is specified for the server component.

### Repository
- Type: git
- URL: [social_messaging repository](https://eu-west-2.console.aws.amazon.com/codesuite/codecommit/repositories/social_messaging/browse?region=eu-west-2)

### Keywords
- TalkMoni
- Messaging
- Social

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
infinexpartners

### License
ISC

## Installation and Running
For the server, clone the repository from the provided URL and run `npm install` to set up the dependencies. Use `npm start` to launch the messaging service. The client-side setup follows a similar pattern, with its own set of dependencies and start-up scripts.

Please adhere to the licensing terms and other guidelines as stipulated by the dependencies and the overarching ISC license of the application.
