const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

async function run() {
  try {
    const boardExamsCollection = client.db('allQuestionsBank').collection('boardExams');
    const govtJobsCollection = client.db('allQuestionsBank').collection('govtJobs');

    // Get all board exams
    app.get('/boardExams', async(req, res) => {
      const query = {};
      const exams = await boardExamsCollection.find(query).toArray();
      res.send(exams);
      });

      // Get Single board exam
      app.get('/boardExams/:allSubjects', async(req, res) => {
        const allSubjects = req.params.allSubjects;
        const query = { link: allSubjects };
        const subjects = await boardExamsCollection.findOne(query);
        res.send(subjects);
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