const multer = require('multer');

const USER_FILE_PATH = 'uploads/user/';
const CHAT_FILE_PATH = 'uploads/chat/';

const getFileType = (file) => {
  const mimeType = file.mimetype.split('/');
  return mimeType[mimeType.length - 1];
};

const generateFileName = (_, file, cb) => {
  const extension = getFileType(file);

  const filename =
    Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + extension;
  cb(null, file.fieldname + '-' + filename);
};

const fileFilter = (_, file, cb) => {
  const extension = getFileType(file);

  const allowedType = /jpeg|jpg|png/;

  const passed = allowedType.test(extension);

  if (passed) {
    return cb(null, true);
  }

  return cb(null, false);
};

exports.userFile = (() => {
  const storage = multer.diskStorage({
    destination: USER_FILE_PATH,
    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single('avatar');
})();

exports.chatFile = (() => {
  const storage = multer.diskStorage({
    destination: CHAT_FILE_PATH,
    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single('image');
})();
