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
exports.fetchTickerNames = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchTickerNames = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const exchangeInfo = yield axios_1.default.get('https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT');
    const symbols = exchangeInfo.data.symbols.map((el) => el.symbol.toUpperCase());
    const allTickerNames = symbols.filter((name) => {
        return (name.substring(name.length - 4) ===
            `${query.stableCoinName.toUpperCase()}`);
    });
    return allTickerNames;
});
exports.fetchTickerNames = fetchTickerNames;
//# sourceMappingURL=utils.js.map