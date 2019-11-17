const router = require('express').Router();
const path = require('path');
const readline = require('readline');

const processController = require('../controllers/process');

class IndexRoute {
    constructor() {
        this._router = router;
    }

    getRouter() {
        this._router.get('/:urlVideo', async (req, res, next) => {
            try {
                let startTimeProcessDownload;

                const processDownload = await processController.download(req.params.urlVideo);

                processDownload.once('response', () => {
                    startTimeProcessDownload = Date.now();
                });

                processDownload.on('progress', (chunkLength, downloaded, total) => {
                    printOutputToConsole(startTimeProcessDownload, downloaded, total);

                });

                processDownload.on('end', () => {
                    process.stdout.write('\n\n');
                    res.download(path.join(path.resolve(__dirname + '/../media/', 'video.mp4')));
                });
            } catch (e) {
                res.status(500).send({
                    message: 'Falha ao processar sua requisição'
                });
                next(e);
            }
        });

        return this._router;
    }
}

const printOutputToConsole = (startTimeProcessDownload, downloaded, total) => {
    let percent = downloaded / total;
    let downloadedMinutes = (Date.now() - startTimeProcessDownload) / 1000 / 60;

    readline.cursorTo(process.stdout, 0);

    process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`);
    process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
    process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
    process.stdout.write(`, estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes `);

    readline.moveCursor(process.stdout, 0, -1);
};

module.exports = IndexRoute;