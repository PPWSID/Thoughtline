import '../config/global.js';


async function responseUnauthorized(res: any, code: number, message: string, error: any = null) {
    let response = {
        message: message,
        error: error
    };

    res.status(code).json(response);
}

async function responseSuccess(res: any, data: any, code: number, message: string) {
    let response = {
        status: true,
        data: data,
        message: message,
    };

    res.status(code).json(response);
}

async function responseError(res: any, code: number, message: string, error: any = null) {
    let response = {
        status: false,
        message: message,
        error: error
    };

    res.status(code).json(response);
}

export default {
    responseUnauthorized,
    responseSuccess,
    responseError
};