const readline = require('readline');
const fs       = require('fs');
const ytdl     = require('ytdl-core');
const path     = require('path');


exports.process = async(req, res, next) => {
    try {

        let url    =  req.params.url;
        let output = path.resolve(__dirname + '/../media/' , 'video.mp4');

        let video = ytdl('https://www.youtube.com/watch?v=' + url);

        let starttime;
        video.pipe(fs.createWriteStream(output));
        video.once('response', () => {
            starttime = Date.now();
        });
        video.on('progress', (chunkLength, downloaded, total) => {
            let percent = downloaded / total;
            let downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`);
            process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
            process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
            process.stdout.write(`, estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes `);
            readline.moveCursor(process.stdout, 0, -1);
        });
        video.on('end', () => {
            process.stdout.write('\n\n');
            return res.download(path.join(output));
        });

    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}