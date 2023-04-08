"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaZod = void 0;
const z = __importStar(require("zod"));
exports.userSchemaZod = z
    .object({
    userName: z
        .string()
        .regex(/[A-Za-z0-9]+/, {
        message: 'Only letters/numbers and minimum 5',
    })
        .min(5, { message: 'Only letters/numbers and minimum 5' })
        .max(15, { message: 'Maximum 15 characters' }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, {
        message: 'Minimum 8 letters/numbers and 1 special character',
    })
        .regex(/([A-Za-z0-9]+)([^A-Za-z0-9])/, {
        message: 'Minimum 8 letters/numbers and 1 special character',
    }),
    passwordConf: z
        .string()
        .min(8, {
        message: 'Minimum 8 letters/numbers and 1 special character',
    })
        .regex(/([A-Za-z0-9]+)([^A-Za-z0-9])/, {
        message: 'Minimum 8 letters/numbers and 1 special character',
    }),
})
    .refine((data) => data.password === data.passwordConf, {
    message: "Passwords don't match",
    path: ['passwordConf'],
});
//# sourceMappingURL=userSchemaZod.js.map