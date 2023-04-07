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
exports.GetPVDataController = void 0;
const client_1 = require("../client");
const utils_1 = require("../utils");
const ApiError_1 = require("../errors/ApiError");
class GetPVDataController {
    instant(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.validate(event.queryStringParameters);
            const allTickerNames = yield (0, utils_1.fetchTickerNames)(query);
            const allSymbolsSingleNamedCandleArray = []; // all symbols candles at candle t0
            const allSymbolsSingleNamedCandle = {};
            let singleNamedCandle;
            for (const tickerName of allTickerNames) {
                singleNamedCandle = yield client_1.client.candles({
                    symbol: tickerName,
                    interval: `${query.interval}`,
                    limit: 1,
                });
                allSymbolsSingleNamedCandle[tickerName] = singleNamedCandle[0];
            }
            allSymbolsSingleNamedCandleArray.push(allSymbolsSingleNamedCandle);
            return allSymbolsSingleNamedCandleArray;
        });
    }
    window(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.validate(event.queryStringParameters);
            const allTickerNames = yield (0, utils_1.fetchTickerNames)(query);
            const allSymbolsMultipleNamedCandlesArray = []; // all symbols candles from kandle t0 to candle t0 - tlimit (number of historical candles = limit)
            const allSymbolsMultipleNamedCandles = {}; //
            let multipleNamedCandles;
            for (const tickerName of allTickerNames) {
                multipleNamedCandles = yield client_1.client.candles({
                    symbol: tickerName,
                    interval: query.interval,
                    limit: Number(query.windowLength),
                });
                allSymbolsMultipleNamedCandles[tickerName] = multipleNamedCandles;
            }
            allSymbolsMultipleNamedCandlesArray.push(allSymbolsMultipleNamedCandles);
            return allSymbolsMultipleNamedCandlesArray;
        });
    }
    validate(query) {
        if (!query) {
            throw new ApiError_1.ClientError('Client error', 'no query string parameters passed');
        }
        return query;
    }
}
exports.GetPVDataController = GetPVDataController;
//# sourceMappingURL=GetPVDataController.js.map