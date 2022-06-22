const { verifySingUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');
module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-type, Accept"
        );
        next();
    });
    app.post(
        'api/auth/singup',
        [
            verifySingUp.checkDuplicateUsernameOrEmail,
            verifySingUp.checkRolesExisted
        ],
        controller.singup
    );
    app.post('/api/auth/signin', controller.signin);
};