export class APIError extends Error {
    public constructor(
        public statusCode: number,
        public name: string,
        message: string
    ) {
        super(message)
    }
}

export class ServerError extends APIError {
    public constructor(public name: string, public message: string) {
        super(500, name, message)
    }
}

export class ClientError extends APIError {
    public constructor(public name: string, public message: string) {
        super(400, name, message)
    }
}
