const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

class Process {

    constructor() {
        this._pathToSaveVideo = path.resolve(__dirname + '/../media/', 'video.mp4');
    }

    async download(urlVideo) {
        try {
            let ytdlVideo = ytdl('https://www.youtube.com/watch?v=' + urlVideo);

            ytdlVideo.pipe(fs.createWriteStream(this._pathToSaveVideo));

            await this.createDirectory();

            return ytdlVideo;

        } catch (e) {
            return e;
        }
    }

    async createDirectory() {
        let dir = path.resolve(__dirname + '/../media/');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}

module.exports = new Process();