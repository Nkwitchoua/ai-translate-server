export const successResponse = (data = {}, message = "Success", code = 0) => { code, data, message };

export const errorResponse = (data = {}, message = "Error", code = -1, ) => { code, data, message };

// 0 success
// -1 error