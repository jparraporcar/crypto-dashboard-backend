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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBController = void 0;
const DynamoDb_1 = require("../aws/DynamoDb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const userSchemaZod_1 = require("../userSchemaZod");
const ClientErrors_1 = require("../errors/ClientErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class DynamoDBController {
    registerUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.validate(JSON.parse(event.body));
            const hashedPassword = yield bcryptjs_1.default.hash(body.password, 12);
            const conditionExpression = 'attribute_not_exists(email) AND attribute_not_exists(userName)';
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
                        S: hashedPassword,
                    },
                    passwordConf: {
                        S: hashedPassword,
                    },
                },
                ReturnConsumedCapacity: 'TOTAL',
                ConditionExpression: conditionExpression,
            };
            console.log('input', input);
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
    loginUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body);
            const input = {
                TableName: 'users',
                Key: {
                    userName: { S: body.userName },
                    email: { S: body.email },
                },
                AttributesToGet: ['userName', 'email', 'password'],
            };
            const command = new client_dynamodb_1.GetItemCommand(input);
            const response = yield DynamoDb_1.client.send(command);
            if (response.Item) {
                const isEqual = yield bcryptjs_1.default.compare(body.password, response.Item.password.S // this line will not be reached if the user is not found
                );
                if (isEqual === false) {
                    throw new ClientErrors_1.UnauthorizedError();
                }
            }
            return response;
        });
    }
}
exports.DynamoDBController = DynamoDBController;
//# sourceMappingURL=DynamoDbController.js.map