const mongoose = require('mongoose')
let req = process.argv.length
if (req < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const baseUrl =
  `mongodb+srv://pb-fullstack:${password}@devcluster1.e5adw.mongodb.net/contacts`

mongoose.connect(baseUrl, {useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
  })
  // const Person = mongoose.model('Person', personSchema)
  if (!process.argv[3]){
    console.log('Contacts:');
    Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  } else {
  // const generateId = () => {
  //   Person.find({}).then(result => {
  //     const maxId = result.length > 0
  //       ? Math.max(...result.map(p => p.id))
  //       : 0
  //     return maxId + 1
  //   })
  // }

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
      id: Math.random() * 100000,
    })
    // console.log(note)

    person.save().then(result => {
      console.log(`${person.name} set to ${person.number}`)
      mongoose.connection.close()
    })
  // Note.find({}).then(result => {
  //   result.forEach(note => {
  //     console.log(note)
  //   })
  //   mongoose.connection.close()
  // })
  }
});






