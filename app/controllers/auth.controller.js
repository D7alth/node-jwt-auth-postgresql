const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken'); 
var bcrypt = require('bcryptjs');

exports.singup = (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        if(req.body.roles){
            Role.findAll({ 
                where: { 
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(user => {
                user.setRoles(roles).then(() => {
                    res.send({
                        message: 'User was registered sucessfully'
                    });
                });
            });
        }else{
            user.setRoles([1].then(() => {
                res.send({ 
                    message: 'User was registred sucessfully'
                });
            }));
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if(!user) {
            return res.status(404).send({ messsage: 'User Not Found' });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400
        });
        var authorities = [];
        user.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++) {
                authorities.push('ROLE_' + roles[i].name.toUpperCase());
            }
            res.status(200).send({ 
                id: user.id, 
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
        res.status(500).send({ message : err.message });
    });
}; 