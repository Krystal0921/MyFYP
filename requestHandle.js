const connection = require("./dbConnect");

function requestHandle(success, msg, code, data) {
  try {
    return {
      success: success,
      msg: msg,
      code: code,
      data: data,
    };
  } catch (error) {
    console.log(`error ${error}`);
    return {
      success: success,
      msg: error,
      code: code,
      data: data,
    };
  }
}

module.exports = {
  requestHandle: requestHandle,
};
