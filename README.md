<h1 align="center">Portfolio Use Only</h1>

> :warning: **Important Note**

This repository and its contents, including installation and deployment instructions, are provided for portfolio review and demonstration purposes only. While the repository is publicly viewable and its code can be executed for review purposes, no license is granted for any further use, distribution, or reproduction of the materials contained herein. Any such activities are prohibited without express permission from the repository owner. Please contact the owner for any questions or requests for use.

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

The backend it's designed to work with the frontend code found in the repository at [jparraporcar/crypto-dashboard-frontend](https://github.com/jparraporcar/crypto-dashboard-frontend).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/)
- You have installed the [Serverless framework](https://www.serverless.com/framework/docs/getting-started/)
- You have installed the [AWS CLI](https://aws.amazon.com/cli/)
- You have an AWS account with appropriate access rights and a configured AWS profile

## Setup

### Installation

To setup crypto-dashboard-backend, follow these steps:

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

### Deployment

To deploy the backend, run the following command:

```
serverless deploy

```

You will then obtain 5 endpoints to use in the frontend code repo.

## Frontend integration

From the deployment of the AWS services 5 endpoints are provided for lambda function invocation (all endpoints starting with 'https://...') and ending as below:

1. `/priceVolumeData`: Retrieves OHLC data of the total amount of all the tokens requested for the current timeframe.
2. `/priceVolumeDataWindow`: Retrieves OHLC data of all the tokens requested for the defined window size.
3. `/registerUser`: Used for user registration.
4. `/loginUser`: Used for user login.
5. `/allSpotTickerNames`: Retrieves the list of all tradable tokens in Binance Spot Market at the moment of the request.

These enpoints are introduced in the .env.development file in the root of the frontend code for the frontend development or in github as a secrets for the frontend deployment.

## Architecture

The deployed architecture is designed around the Serverless framework, using AWS Lambda functions for computation, Amazon API Gateway for HTTP request handling, and AWS CloudWatch for logging.

![Infrastructure Diagram](./screenshots/diagram.jpg)

## Technologies

The `crypto-dashboard-backend` utilizes the following technologies and packages for its implementation:

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
