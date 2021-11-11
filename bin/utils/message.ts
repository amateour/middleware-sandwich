import * as SW from '../../functions';
/**
 * get data error
 *
 * @param data - `{
 *     message: message of error "bad request",
 *     errors: data errors
 * }`
 */
const get_data_errors: SW.get_data_errors = (data) => {
    return data
}

/**
 * Class to handle exceptions
 */
export class ClassException implements SW.ClassException {

    /**
     * Server error Generate
     *
     * @param data - 
     */
    error = (data: SW.ErrorsRequest.Data) => {
        throw data
    }

    /**
     * Server error Generate
     *
     * @param data - 
     */
    server_error = (data: SW.ErrorsRequest.Data) => {
        const {message, errors} = get_data_errors(data);
        throw {"statusCode": 500, "message": message, errors};
    }

    /**
     * Bad request Generate
     *
     * @param data - 
     */
    bad_request = (data: SW.ErrorsRequest.Data) => {
        const {message, errors} = get_data_errors(data);
        throw {"statusCode": 400, "message": message, errors};
    }

}

export const Exception = new ClassException();


/**
 * Classes for handling Http reply messages
 */
class ClassMessage implements SW.ClassMessage {

    /**
     * send response request
     * 
     * @param res - 
     * @param statusCode - number status
     * @param message - message response
     */
    response(res: any, statusCode: number, message: any) {

        /**
         * stacked error information
         */
        const {stack} = message;

        /**
         * data response
         */
        const response = {
            message: message?.message,
            errors: message?.errors,
            statusCode: statusCode ?? 200,
        }
        /**
         *
         */
        const data_send = stack ? {...response, stack} : response;
        if(!res) throw data_send;
        if (res)
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data_send));
            return res.end();
    }

    /**
     * send response request (error)
     * 
     * @param res -
     * @param mess -
     */
    errors(res: any, mess: any) {
        this.response(res, 500, mess)
    }

    /**
     * send response request (success)
     * 
     * @param res -
     * @param mess -
     */
    success(res: any, mess: any) {
        this.response(res, 200, mess)
    }

    /**
     * send response request (create)
     * 
     * @param res -
     * @param mess -
     */
    create(res: any, mess: any) {
      this.response(res, 201, mess)
    }
}

export const Message =  new ClassMessage();
