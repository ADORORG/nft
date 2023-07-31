
export class CustomRequestError extends Error {
    errorCode?: string | number

    constructor(message: string, errorCode?: string | number) {
        super(message)
        this.name = 'RequestError'
        this.errorCode = errorCode
    }
}