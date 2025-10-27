"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameFormFullName = exports.handleFileUpload = exports.initFolder = exports.getLoggedInStorage = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const megajs_1 = require("megajs");
const dir_1 = require("../constants/dir");
cloudinary_1.v2.config({
    cloud_name: 'dkqyptupf',
    api_key: '923633263214567',
    api_secret: '40OayrQ4yqNIhxXtmKTJ47yulNo'
});
const getLoggedInStorage = () => {
    return new megajs_1.Storage({ email: 'baotuyet927@gmail.com', password: 'baotuyet927' }).ready;
};
exports.getLoggedInStorage = getLoggedInStorage;
const initFolder = () => {
    if (!fs_1.default.existsSync(dir_1.UPLOAD_TEMP_DIR)) {
        fs_1.default.mkdirSync(dir_1.UPLOAD_TEMP_DIR, {
            recursive: true // mục đích là tạo folder
        });
    }
};
exports.initFolder = initFolder;
const handleFileUpload = async (req) => {
    const form = (0, formidable_1.default)({
        // uploadDir: UPLOAD_TEMP_DIR,
        maxFiles: 1,
        keepExtensions: true,
        // maxFileSize: 300 * 1024 //300kb
        filter: function ({ name, originalFilename, mimetype }) {
            return true;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            if (files.file[0].mimetype.startsWith('image') || files.file[0].mimetype.startsWith('video')) {
                const response = await cloudinary_1.v2.uploader
                    .upload(files.file[0].filepath, {
                    folder: 'ELeaning',
                    use_filename: true,
                    unique_filename: false,
                    resource_type: 'auto'
                })
                    .catch((error) => {
                    reject(error);
                });
                resolve({
                    ...response,
                    originalFilename: files.file[0].originalFilename
                });
            }
            else {
                const mega = await (0, exports.getLoggedInStorage)();
                const uploadStream = mega.upload({
                    name: files.file[0].originalFilename,
                    size: files.file[0].size
                });
                fs_1.default.createReadStream(files.file[0].filepath).pipe(uploadStream);
                uploadStream.on('complete', (file) => {
                    file.link(false, (error, url) => {
                        if (error) {
                            return reject(err);
                        }
                        resolve({
                            created_at: files.file[0].lastModifiedDate,
                            bytes: files.file[0].size,
                            originalFilename: files.file[0].originalFilename,
                            format: files.file[0].mimetype,
                            url: url
                        });
                    });
                });
            }
        });
    });
};
exports.handleFileUpload = handleFileUpload;
const getNameFormFullName = (fullname) => {
    const namearr = fullname.split('.');
    namearr.pop();
    return namearr.join('');
};
exports.getNameFormFullName = getNameFormFullName;
