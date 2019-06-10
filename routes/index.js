const router = require('express').Router();

const processController = require('../controllers/process');

class IndexRoute {
	constructor() {
		this._router = router;
	}

	getRouter() {
		this._router.get('/:url', (req, res, next) => {
			try{
				
				processController.download(req.params.url, res);

			} catch (e){
				res.status(500).send({
		            message: 'Falha ao processar sua requisição'
		        });
				next(e);
			}
		});

		return this._router;
	}
}

module.exports = IndexRoute;