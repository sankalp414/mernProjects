class apiError extends Error{
    constructor(statusCode,errors=[],stack="",message="Something went wrong"){
        super(message),
        this.statusCode = statusCode,
        this.errors = errors,
        this.message = message,
        this.success = false,
        this.data=null

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {apiError}