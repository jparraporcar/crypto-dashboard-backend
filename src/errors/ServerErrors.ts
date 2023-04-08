export class BinanceError {
    public name: string
    public constructor(public statusCode: number, public message?: string) {
        this.name = 'BINANCE_ERROR'
    }
}

export class ConnectionError {
    public name: string
    public statusCode: number
    public constructor(public message?: string) {
        this.name = 'ENOTFOUND'
        this.statusCode = 404
    }
}

export class UnknownError {
    public name: string
    public statusCode: number
    public constructor(public message?: string) {
        this.name = 'UNKNOWN_ERROR'
        this.statusCode = 500
    }
}
