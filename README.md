# crypto-dashboard-backend

## Table of Contents
- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [APIs](#apis)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Contact](#contact)

## Description

This is the backend service for the Crypto-Dashboard application. It's built with serverless architecture on AWS, utilizing services like AWS Lambda, API Gateway, DynamoDB, and more to handle requests from the frontend application.

This backend is designed to work with the frontend code found in the repository at [jparraporcar/crypto-dashboard-frontend](https://github.com/jparraporcar/crypto-dashboard-frontend).

## Prerrequisites

Before you begin, ensure you have met the following requirements:
- You have installed the latest version of [Node.js and npm](https://nodejs.org/)
- You have installed the [Serverless framework](https://www.serverless.com/framework/docs/getting-started/)
- You have an AWS account with appropriate access rights

## Installation

To install crypto-dashboard-backend, follow these steps:

1. Clone the repository:

```
git clone https://github.com/jparraporcar/crypto-dashboard-backend.git
```

2. Navigate into the project directory:

```
cd crypto-dash-board-backend
```

3. Install the dependencies:

```
npm install
```

## Deployment

To deploy the backend, run the following command:

```
serverless deploy

```

## APIs

The `crypto-dashboard-backend` provides five endpoints:

1. `/priceVolumeData`: Retrieves OHLC data of the total amount of all the tokens requested for the current candlestick.
2. `/priceVolumeDataWindow`: Retrieves OHLC data of all the tokens requested for the historical period with the defined window size.
3. `/registerUser`: Used for user registration.
4. `/loginUser`: Used for user login.
5. `/allSpotTickerNames`: Retrieves the list of all tradable tokens at the moment of the request.

## Architecture

This architecture is designed around the Serverless framework, using AWS Lambda functions for computation, Amazon API Gateway for HTTP request handling, and AWS CloudWatch for logging.

![Infrastructure Diagram](./screenshots/diagram.jpg)

## Technologies

The `crypto-dashboard-backend` utilizes various technologies and packages for its implementation:

1. **Node.js** - An open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a web browser.
2. **TypeScript** - An open-source language that builds on JavaScript by adding static type definitions.
3. **AWS Lambda** - A serverless compute service that lets you run your code without provisioning or managing servers.
4. **Axios** - A promise-based HTTP client for the browser and Node.js.
5. **Serverless Framework** - An open-source deployment framework that allows developers to build and deploy auto-scaling, pay-per-execution, event-driven functions.

Development dependencies include:

- **ESLint** and **Prettier** for enforcing code style and formatting rules.
- **ts-node** for executing TypeScript code directly.
- **serverless-offline** for enhancing the Serverless Framework development experience.

## Contact

If you want to contact me you can reach me at:

- **Name**: `Jordi Parra Porcar`
- **Email**: `jordiparraporcar@gmail.com`
- **LinkedIn**: [`Jordi Parra Porcar`](https://www.linkedin.com/in/jordiparraporcar/)

For any additional questions or comments, please feel free to reach out. Contributions, issues, and feature requests are welcome!