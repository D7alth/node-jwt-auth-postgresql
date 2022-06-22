const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');

const app = express();

const Role = db.role;
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync DB');
    initial();
})

function initial() {
    Role.create({
        id: 1, 
        name: 'user',
    });
    Role.create({ 
        id: 2,
        name: 'moderator',
    });
    Role.create({ 
        id: 3,
        name: 'admin',
    })
}

var corsOptions = {
    origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ message: 'Hello API' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server on and running port ${PORT}`);
});
