import { ErrorName } from './ErrorNames'

export class ValidationError {
    public statusCode: number
    public name: ErrorName
    public constructor(public message?: string) {
        this.statusCode = 400
        this.name = 'VALIDATION_ERROR'
    }
}

export class ExistingResource {
    public statusCode: number
    public name: ErrorName
    public constructor(public message?: string) {
        this.statusCode = 409
        this.name = 'EXISTING_RESOURCE_ERROR'
    }
}

export class QueryStringError {
    public statusCode: number
    public name: ErrorName
    public constructor(public message?: string) {
        this.statusCode = 400
        this.name = 'QUERYSTRING_ERROR'
    }
}

export class UnAuthenticatedError {
    public statusCode: number
    public name: ErrorName
    public constructor(public message?: string) {
        this.statusCode = 401
        this.name = 'AUTHENTICATION_ERROR'
    }
}
