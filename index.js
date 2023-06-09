const users = require('./users.js');
const questions = require('./questions.js');
const submissions = require('./submissions.js');
const crypto = require('crypto');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/signup', (req, res) => {
    const {email, password} = req.body;

    // Check if the user already exists
    const userExists = users.some(user => email===user.email);
    if(userExists) {
        return res.status(400).json({error: 'Email already registered', errorCode: 1});
    } else {
        users.push({email, password});
        res.status(200).json({message: 'Signup successful'});
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Find the user with the matching email
    const user = users.find(user => user.email === email);
  
    if (user) {
      // Email found, check password
      if (user.password === password) {
        res.status(200).json({ message: 'Login successful', authToken: crypto.randomBytes(16).toString('hex') });
      } else {
        res.status(200).json({ error: 'Incorrect email or password', errorCode: 2 });
      }
    } else {
      // Email not found
      res.status(400).json({ error: 'Email not found', errorCode: 3 });
    }
});
  

app.get('/questions', (req, res) => {
    res.send(questions);
});

app.post('/submissions', (req, res) => {
    const {user, pid} = req.body;

    const responseObj = submissions.filter(function(uqTuple) {
        return (uqTuple.user===user && uqTuple.pid===pid);
    })[0];

    if(responseObj) {
        res.status(200).json(responseObj);
    } else {
        res.status(400).json({error: 'No submissions found', errorCode: 4});
    }
});

app.post('/submission', (req, res) => {
    const {user, pid, language, code} = req.body;

    const responseObj = submissions.filter(function(uqTuple) {
        return (uqTuple.user===user && uqTuple.pid===pid);
    })[0];

    const newAttempt = {
        attemptNum: responseObj.attempts.length+1,
        language: language,
        code: code
    }

    responseObj.attempts.push(newAttempt);

    submissions.forEach(function(submission, index) {
        if(submission.dbId === responseObj.dbId) {
            submissions[index] = responseObj;
            res.status(200).json({message: "Submission recieved and updated", userSubmissionObject: submissions[index]});
        } else {
            res.status(400).json({error: "Couldn't add submission", errorCode: 5});
        }
    });
});

app.listen(port, () => {
    console.log(`Sample app listening on port ${port}`);
});


/*
    Error Codes:
        1: Email already registered
        2: Incorrect email or password
        3: Email not found
        4: No submissions found
        5: Couldn't add submission
*/