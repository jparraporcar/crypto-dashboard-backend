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
const GetPVDataController_1 = require("./controllers/GetPVDataController");
const DynamoDbController_1 = require("./controllers/DynamoDbController");
const ServerErrors_1 = require("./errors/ServerErrors");
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
        // first check if gmail already || userName already exists in the DB
        // if user already exists then throw a ClientError 'user already exists
        // otherwise create token and deliver to the user
        const res = yield new DynamoDbController_1.DynamoDBController().registerUser(event);
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(res),
        };
        console.log(response);
        return response;
    }
    catch (err) {
        const response = {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify(err),
        };
        console.log(response);
        return response;
    }
});
//# sourceMappingURL=api.js.map