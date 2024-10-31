export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class BaseError extends Error {
    constructor(public readonly name: BaseErrorName, message: string) {
        super(message)
        this.name = name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError)
        }
    }
}

export enum BaseErrorName {
    AtaNotFound = "AtaNotFound",
}

export const TIME_OUT = 1000