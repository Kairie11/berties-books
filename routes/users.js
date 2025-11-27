// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password
    
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err)
        }
        
        // Store hashed password in database
        const sqlQuery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        const values = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
        
        db.query(sqlQuery, values, (err, dbResult) => {
            if (err) {
                return next(err);
            }
            
            let result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(result);
        });
    })
});

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT id, username, first_name, last_name, email FROM users";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("userlist.ejs", {users: result});
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;
    
    // Select user details including hashed password
    const sqlQuery = "SELECT id, username, first_name, hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlQuery, [username], (err, result) => {
        if (err) {
            return next(err);
        }
        
        if (result.length === 0) {
            res.send('Login failed: Username or password is incorrect');
            return;
        }
        
        const hashedPassword = result[0].hashedPassword;
        
        bcrypt.compare(req.body.password, hashedPassword, function(err, comparison) {
            if (err) {
                return next(err);
            }
            else if (comparison == true) {
                // Save user session
                req.session.userId = result[0].id;
                req.session.username = result[0].username;
                
                res.send('Login successful! Welcome back, ' + username);
            }
            else {
                res.send('Login failed: Username or password is incorrect');
            }
        })
    });
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

router.get('/profile', redirectLogin, function(req, res, next) {
    res.send('Welcome to your profile, ' + req.session.username);
});

// Export the router object so index.js can access it
module.exports = router