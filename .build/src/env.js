"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envVars = Object.assign({ 
    // default values
    STAGE: 'dev', AWS_DEFAULT_REGION: 'ap-northeast-1' }, process.env);
exports.default = Object.freeze(envVars);
//# sourceMappingURL=env.js.map