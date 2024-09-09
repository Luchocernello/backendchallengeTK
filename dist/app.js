"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const typeorm_1 = require("typeorm");
const fileController_1 = __importDefault(require("./modules/file/controllers/fileController"));
const fileService_1 = __importDefault(require("./modules/file/services/fileService"));
const emailService_1 = __importDefault(require("./modules/file/services/emailService"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const fileService = new fileService_1.default();
const emailService = new emailService_1.default();
const fileController = new fileController_1.default(fileService, emailService);
// Connect to PostgreSQL using TypeORM
(0, typeorm_1.createConnection)().then(() => {
    console.log('Connected to PostgreSQL');
    // Route for uploading the CSV file
    app.post('/upload', upload.single('file'), (req, res) => {
        fileController.handleFileCSV(req, res);
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => console.log(error));
