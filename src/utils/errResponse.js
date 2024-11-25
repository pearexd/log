class errResponse extends Error {

    constructor(message,statusCode,err=[],stack){
    
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        this.err = err 

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default errResponse