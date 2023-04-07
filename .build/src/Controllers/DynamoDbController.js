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
exports.DynamoDBController = void 0;
const DynamoDb_1 = require("../aws/DynamoDb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const userSchemaZod_1 = require("../userSchemaZod");
const ClientErrors_1 = require("../errors/ClientErrors");
class DynamoDBController {
    registerUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.validate(JSON.parse(event.body));
            const itemExisting = yield this.getUser(event);
            if (itemExisting.Item) {
                // logic for user to be able to request a new password will be necessary
                throw new ClientErrors_1.ExistingResource();
            }
            const input = {
                TableName: 'users',
                Item: {
                    userName: {
                        S: body.userName,
                    },
                    email: {
                        S: body.email,
                    },
                    password: {
                        S: body.password,
                    },
                    passwordConf: {
                        S: body.passwordConf,
                    },
                },
                ReturnConsumedCapacity: 'TOTAL',
            };
            const command = new client_dynamodb_1.PutItemCommand(input);
            const response = yield DynamoDb_1.client.send(command);
            return response;
        });
    }
    validate(body) {
        const zodRes = userSchemaZod_1.userSchemaZod.parse({
            userName: body.userName,
            email: body.email,
            password: body.password,
            passwordConf: body.passwordConf,
        });
        if (!zodRes.userName ||
            !zodRes.email ||
            !zodRes.password ||
            !zodRes.passwordConf) {
            throw new ClientErrors_1.ValidationError();
        }
        else {
            return zodRes;
        }
    }
    getUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.validate(JSON.parse(event.body));
            const input = {
                TableName: 'users',
                Key: {
                    userName: { S: body.userName },
                    email: { S: body.email },
                },
            };
            const command = new client_dynamodb_1.GetItemCommand(input);
            const response = yield DynamoDb_1.client.send(command);
            return response;
        });
    }
}
exports.DynamoDBController = DynamoDBController;
//# sourceMappingURL=DynamoDbController.js.map