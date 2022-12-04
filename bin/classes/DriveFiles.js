"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriveFiles = void 0;
const fs_1 = require("../utilities/fs");
class DriveFiles {
    static parseVideoFileName(file) {
        var _a;
        const blocks = file.split('-');
        const videoNum = {
            num: blocks[0].split('_')[0],
            part: (_a = blocks[0].split('_')[1]) !== null && _a !== void 0 ? _a : null
        };
        const date = blocks[1];
        const lessonNum = blocks.length === 4 ? blocks[2] : null;
        const fileName = blocks.length === 4 ? blocks[3] : blocks[2];
        return {
            videoNum: +videoNum.num,
            videoPart: videoNum.part ? +videoNum.part : null,
            lessonNum: lessonNum ? +lessonNum : null,
            date,
            fileName
        };
    }
    static getLastRemoteFile(driveFolder) {
        let toReturn = null;
        if (!driveFolder) {
            return toReturn;
        }
        const videoFiles = (0, fs_1.getFolderFiles)(driveFolder, '.mp4');
        if (videoFiles.length > 0) {
            toReturn = videoFiles[videoFiles.length - 1];
        }
        return toReturn;
    }
    static getVideoNumber(driveFolder) {
        let toReturn = 0;
        const lastFile = this.getLastRemoteFile(driveFolder);
        if (lastFile) {
            const fileData = this.parseVideoFileName(lastFile);
            toReturn = fileData.videoNum + 1;
            if (fileData.videoPart === 1) {
                toReturn = fileData.videoNum;
            }
        }
        return toReturn ? +toReturn : 1;
    }
    static getVideoPart(videoFiles, multipart, driveFolder) {
        let toReturn = videoFiles.length <= 1 || !multipart ? null : 1;
        if (!multipart) {
            return toReturn;
        }
        const lastFile = this.getLastRemoteFile(driveFolder);
        if (lastFile) {
            const fileData = this.parseVideoFileName(lastFile);
            toReturn = fileData.videoPart === 1 ? 2 : 1;
        }
        return toReturn;
    }
}
exports.DriveFiles = DriveFiles;
