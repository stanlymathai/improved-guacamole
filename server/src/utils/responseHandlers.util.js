const HTTP_STATUS = require('./httpStatus.util');
function sendBadRequest(res, error) {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    error: error,
  });
}

function sendInternalServerError(res, error) {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error,
  });
}

function sendSuccessResponse(res, data = []) {
  return res.status(HTTP_STATUS.SUCCESS).json({
    success: true,
    data: data,
  });
}

module.exports = {
  sendBadRequest,
  sendSuccessResponse,
  sendInternalServerError,
};
