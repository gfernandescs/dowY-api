const express = require('express');
const indexRouter = new (require('./routes/index'));

class App {

    constructor() {
        this._express = express();

        this.initMiddlewares();
        this.initRouters();
    }

    get express() {
        return this._express;
    }

    initMiddlewares() {
        this._express.use(express.json());
        this._express.use(express.urlencoded({extended: false}));
    }

    initRouters() {
        this._express.use('/', indexRouter.getRouter());
    }
}

module.exports = new App().express;