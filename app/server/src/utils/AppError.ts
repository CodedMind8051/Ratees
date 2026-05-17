class ApiError extends Error {
    statusCode: number
    data: unknown | null
    success: boolean
    errors: unknown[]
    Show: boolean

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors:unknown[] = [],
        stack = "",
        Show: boolean
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        this.Show = Show

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }