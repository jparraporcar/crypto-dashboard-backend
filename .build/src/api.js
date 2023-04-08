"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetPVDataController_1 = require("./Controllers/GetPVDataController");
const DynamoDbController_1 = require("./Controllers/DynamoDbController");
const ServerErrors_1 = require("./errors/ServerErrors");
const ClientErrors_1 = require("./errors/ClientErrors");
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
module.exports.multiplePVData = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    console.log(`request received at time ${time} at endpoint multiplePVData`);
    try {
        const data = yield new GetPVDataController_1.GetPVDataController().instant(event);
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        };
        console.log(response);
        return response;
    }
    catch (err) {
        if (err.code === -1003) {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log('waiting 20s to send next request');
                data = yield new GetPVDataController_1.GetPVDataController().instant(event);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                };
            }), 20000);
        }
        else if (err.code === -1120) {
            const binanceError = new ServerErrors_1.BinanceError(-1120);
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(binanceError),
            };
        }
        else if (err.code === 'ENOTFOUND') {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log('waiting 5min to send next request');
                data = yield new GetPVDataController_1.GetPVDataController().instant(event);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                };
            }), 300000);
        }
        else {
            const unknownError = new Error('UNKNOWN_ERROR');
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(unknownError),
            };
        }
    }
});
module.exports.multiplePVDataWindow = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    console.log(`request received at time ${time} at endpoint /multiplePVDataWindow`);
    try {
        const data = yield new GetPVDataController_1.GetPVDataController().window(event);
        console.log('Payload size:', new TextEncoder().encode(JSON.stringify(data)).length);
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        };
    }
    catch (err) {
        console.log(err);
        if (err.code === -1003) {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log('waiting 20s to send next request');
                data = yield new GetPVDataController_1.GetPVDataController().window(event);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                };
            }), 20000);
        }
        else if (err.code === -1120) {
            const binanceError = new ServerErrors_1.BinanceError(-1120);
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(binanceError),
            };
        }
        else if (err.code === 'ENOTFOUND') {
            // Connection error thrown error
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log('waiting 5min to send next request');
                data = yield new GetPVDataController_1.GetPVDataController().window(event);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                };
            }), 300000);
        }
        else {
            const unknownError = new Error('UNKNOWN_ERROR');
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(unknownError),
            };
        }
    }
});
module.exports.registerUser = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new DynamoDbController_1.DynamoDBController().registerUser(event);
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: 'USER_REGISTERED',
        };
        console.log(response);
        return response;
    }
    catch (err) {
        console.log('error', err);
        if (err.name === 'ConditionalCheckFailedException') {
            // DynamoDB thrown error
            const newError = new ClientErrors_1.ExistingResource();
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            };
            return response;
        }
        else {
            const newError = new ServerErrors_1.UnknownError();
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            };
            return response;
        }
    }
});
module.exports.loginUser = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new DynamoDbController_1.DynamoDBController().loginUser(event);
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: 'USER_LOGGEDIN',
        };
        console.log(response);
        return response;
    }
    catch (err) {
        if (err.name === 'ResourceNotFoundException') {
            // DynamoDB thrown error
            const newError = new ClientErrors_1.ExistingResource('The user does not exist');
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            };
            console.log(response);
            return response;
            // user trying to login with wrong credentials
        }
        else if (err.name === 'UNAUTHORIZED_ERROR') {
            const response = {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(err),
            };
            console.log(response);
            return response;
        }
    }
});
// TODO: handle other typde of errors in the register/login workflow like connection errors...
//# sourceMappingURL=api.js.map