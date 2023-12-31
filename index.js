const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.78z7mhu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Verify JWT Middleware
function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send('unauthorized access');
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'forbidden access'})
    }
    req.decoded = decoded;
    next();
  })
}

async function run() {
  try {
    const boardExamsCollection = client.db('allQuestionsBank').collection('boardExams');
    const sscCollection = client.db('allQuestionsBank').collection('ssc');
    const hscCollection = client.db('allQuestionsBank').collection('hsc');
    const polytechnicCollection = client.db('allQuestionsBank').collection('polytechnic');
    const matsCollection = client.db('allQuestionsBank').collection('mats');
    const govtJobsCollection = client.db('allQuestionsBank').collection('govtJobs');
    const primarySchoolTeacherJobsCollection = client.db('allQuestionsBank').collection('primarySchoolTeacher');
    const schoolCollegeTeacherExamsCollection = client.db('allQuestionsBank').collection('schoolCollegeTeacher');
    const bankJobsCollection = client.db('allQuestionsBank').collection('bankJobs');
    const modelTestsCollection = client.db('allQuestionsBank').collection('modelTests');
    const usersCollection = client.db('allQuestionsBank').collection('users');
    const recentSectionCollection = client.db('allQuestionsBank').collection('recentSection');


    // Recent Section
    app.get('/recentSection', async(req, res) => {
      const query = {};
      const data = await recentSectionCollection.find(query).limit(4).toArray();
      res.send(data);
    })

    //All Recent Section
    app.get('/allRecentSection', async(req, res) => {
      const query = {};
      const data = await recentSectionCollection.find(query).toArray();
      res.send(data);
    });

    //All Recent Section
    app.get('/details/:id', async(req, res) => {
      const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const details = await recentSectionCollection.findOne(query);
        res.send(details);
    });


    // Get all board exams
    app.get('/boardExams', async(req, res) => {
      const query = {};
      const exams = await boardExamsCollection.find(query).toArray();
      res.send(exams);
      });

      // HSC Boards
      app.get('/hscBoards', async(req, res) => {
        const query = {};
        const result = await hscCollection.find(query).toArray();
        res.send(result.reverse());
      });

      // Add HSC Boards
      app.post('/hscBoards', async(req, res) => {
        const hscInfo = req.body;
        const result = await hscCollection.insertOne(hscInfo);
        res.send(result);
      });

      // Polytechnic Boards
      app.get('/polytechnicBoards', async(req, res) => {
        const query = {};
        const result = await polytechnicCollection.find(query).toArray();
        res.send(result.reverse());
      });

      // Add Polytechnic Boards
      app.post('/polytechnicBoards', async(req, res) => {
        const polyInfo = req.body;
        const result = await polytechnicCollection.insertOne(polyInfo);
        res.send(result);
      });

      // Mats Boards
      app.get('/matsBoards', async(req, res) => {
        const query = {};
        const result = await matsCollection.find(query).toArray();
        res.send(result.reverse());
      });

      // Add Mats Boards
      app.post('/matsBoards', async(req, res) => {
        const matsInfo = req.body;
        const result = await matsCollection.insertOne(matsInfo);
        res.send(result);
      });

      // Get govt jobs
      app.get('/govtJobs', async(req, res) => {
        const query = {};
        const jobs = await govtJobsCollection.find(query).toArray();
        res.send(jobs)
      });

      // Get single govt job
      app.get('/govtJobs/:govtJob', async(req, res) => {
        const govtJob = req.params.govtJob;
        const query = { link: govtJob };
        const job = await govtJobsCollection.findOne(query);
        res.send(job);
      });

      // Add Govt Jobs
      app.post('/govtJobs', async(req, res) => {
        const govtJob = req.body;
        const result = await govtJobsCollection.insertOne(govtJob);
        res.send(result);
      });

      // Get all primary school teacher exams
      app.get('/priSchoolTeacher', async(req, res) => {
      const query = {};
      const exams = await primarySchoolTeacherJobsCollection.find(query).toArray();
      res.send(exams);
      });

      // Get single teacher exam
      app.get('/priSchoolTeacher/:teacherExam', async(req, res) => {
        const teacherExam = req.params.teacherExam;
        const query = { link: teacherExam };
        const exam = await primarySchoolTeacherJobsCollection.findOne(query);
        res.send(exam);
      });

      // Add Primary School Teacher Jobs
      app.post('/priSchoolTeacher', async(req, res) => {
        const primarySchoolTeacherJob = req.body;
        const result = await primarySchoolTeacherJobsCollection.insertOne(primarySchoolTeacherJob);
        res.send(result);
      });

      // Get all school/college teacher exams
      app.get('/schoolCollegeTeacher', async(req, res) => {
        const query = {};
        const exams = await schoolCollegeTeacherExamsCollection.find(query).toArray();
        res.send(exams);
        });

      // Add Primary School Teacher Jobs
      app.post('/schoolCollegeTeacher', async(req, res) => {
        const schoolCollegeTeacherJob = req.body;
        const result = await schoolCollegeTeacherExamsCollection.insertOne(schoolCollegeTeacherJob);
        res.send(result);
        });
      
      // Get all bank jobs
      app.get('/bankJobs', async(req, res) => {
        const query = {};
        const jobs = await bankJobsCollection.find(query).toArray();
        res.send(jobs);
        });
        
      // Get single Bank exam
      app.get('/bankJobs/:bankExam', async(req, res) => {
        const bankExam = req.params.bankExam;
        const query = { link: bankExam };
        const exam = await bankJobsCollection.findOne(query);
        res.send(exam);
      });

      // Add Bank Exam
      app.post('/bankJobs', async(req, res) => {
        const bankExam = req.body;
        const result = await bankJobsCollection.insertOne(bankExam);
        res.send(result);
        });

      // Get all model test
      app.get('/modelTests', async(req, res) => {
        const query = {};
        const tests = await modelTestsCollection.find(query).toArray();
        res.send(tests);
        });
        
        // Get single model test
      app.get('/modelTests/:testExam', async(req, res) => {
        const testExam = req.params.testExam;
        const query = { link: testExam };
        const exam = await modelTestsCollection.findOne(query);
        res.send(exam);
        });

      // Add Model Test
      app.post('/modelTests', async(req, res) => {
        const modelTest = req.body;
        const result = await modelTestsCollection.insertOne(modelTest);
        res.send(result);
        });

      // JWT Token
      app.get('/jwt', async(req, res) => {
        const email = req.query.email;
        const query = {email: email}
        const user = await usersCollection.findOne(query);
        if(user){
          const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '30d'})
          return res.send({accessToken: token});
        }
        res.status(403).send({accessToken: 'Unauthorized'})
      });

      // Get all users
      app.get('/users', async(req, res) => {
        const query = {};
        const users = await usersCollection.find(query).toArray()
        res.send(users);
      })
      
      // Users Collection
      app.post('/users', async(req, res) => {
        const user = req.body;
        const email = user.email;
        const filter = await usersCollection.find({email}).toArray();
        if(filter.length === 0){
          const result = await usersCollection.insertOne(user);
          return res.send(result);
        }
        res.send(user);
      });
      
      // Check Admin
      app.get('/users/admin/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email}
        const user = await usersCollection.findOne(query);
        res.send({isAdmin: user?.role === 'admin'});
      })

      // Make Admin Api
      app.put('/users/admin/:email', verifyJWT, async(req, res) => {
        const decodedEmail = req.decoded.email;
        const query = {email: decodedEmail};
        const user = await usersCollection.findOne(query);

        if(user?.role !== 'admin'){
          return res.status(403).send({message: 'forbidden access'})
        }
        const email = req.params.email;
        const filter = { email: email }
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            role: 'admin'
          }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
      })

      // Make user Api
      app.put('/users/user/:email', verifyJWT, async(req, res) => {
        const decodedEmail = req.decoded.email;
        const query = {email: decodedEmail};
        const user = await usersCollection.findOne(query);
        
        if(user?.role !== 'admin'){
          return res.status(403).send({message: 'forbidden access'})
        }
        const email = req.params.email;
        const filter = { email: email }
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            role: 'user'
          }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
      })

      
  }
  finally {

  }
}
run().catch(console.log);



app.get('/', async(req, res) => {
    res.send('All Questions Bank server is ready for work...')
})

app.listen(port, () => console.log(`All Questions Bank running on ${port}`))