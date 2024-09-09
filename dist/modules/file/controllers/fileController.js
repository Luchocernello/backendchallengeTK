"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class FileController {
    constructor(fileService, emailService) {
        this.fileService = fileService;
        this.emailService = emailService;
    }
    handleFileCSV(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = request.file;
                if (!file) {
                    return response.status(400).send('Not file uploaded.');
                }
                const processFile = yield this.fileService.readCSV(file.path, response);
                yield this.fileService.saveCSV(processFile);
                yield this.emailService.sendNotificationOneSelf(process.env.SUBJECT_SUCESSFULL, process.env.TEXT_SUCESSFULL);
                return response.status(200).json({ message: 'Saved file in database' });
            }
            catch (error) {
                yield this.emailService.sendNotificationOneSelf(process.env.SUBJECT_FAIL, process.env.TEXT_FAIL);
                return response.status(500).json({ message: 'Error processing file', error });
            }
        });
    }
    ;
}
exports.default = FileController;
;
