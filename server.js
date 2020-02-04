const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const database = {
    users: [
        {
            id: '1234',
            name: 'mael',
            email: 'mael.landrin@gmail.com',
            password: 'cookies',
            entries: 0, // Combien de fois le user a envoyé une photo
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john-jfk@mindblown.com'
        }
    ]
}

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    console.log('Début signin');
    console.log(req.body.email, req.body.password);
    // const a = JSON.parse(req.body);
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        console.log('success signin');
        console.log(database.users);
        console.log('Fin signin');
        return res.json('success');
    } else {
        // res.status().json -> répond avec un statut particulier ( ici 400 ) et envoie une erreur texte
        console.log('failed signin');
        console.log(database.users);
        console.log('Fin signin');
        return res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    console.log('Début register');
    const { email, name, password } = req.body;
    database.users.push({        
        id: '126',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
    console.log('Registered');
    console.log(database.users);
})

app.get('/profile/:id', (req, res) => {
    // on récupère le paramètre dans la query string
    const { id } = req.params;
    let found = false;
    
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('No user found for this id');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('No user found for this id');
    }
})

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('start test');
})

/*
Routes :
/ --> res = this is working
/signin --> POST = success/fail ( POST pour pouvoir envoyer des données via la requete, et pas par une query string )
/register --> POST ( pour envoyer les données du user ) = user
/profile/:userId --> GET = user
/image --> PUT ( envoie une MàJ des données d'une image ) --> user ( update le nombre d'image envoyées par un user )

*/