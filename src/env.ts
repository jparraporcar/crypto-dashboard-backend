const envVars = {
    // default values
    STAGE: 'dev',
    AWS_DEFAULT_REGION: 'ap-northeast-1',

    ...process.env,
}

export default Object.freeze(envVars)
