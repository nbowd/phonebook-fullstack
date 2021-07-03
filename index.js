require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

// Configure morgan to log body of POST request.
morgan.token('person', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
  return null
})

app.use(express.json())

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person',
  ),
)

// Used to save a copy of persons for /api/info
let personList = null;

// GET All Persons
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(person => {
    personList = person
    response.json(person)
    })
})

// GET Individual Person
app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }  
    })
    .catch(error => next(error))
})

// GET App info: number of entries, current date
app.get('/api/info', (request, response) => {
  let text = `<div>Phonebook has info for ${personList.length} people</div><br><div>${new Date()}</div>`
  response.send(text)
})

// DELETE person with specific ID
app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST: Add a new person to the list
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: Number(body.number)
  })

  person
    .save()
    .then(savedPerson => {
    response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

// PUT: Updates the number of an existing entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  // new:true cause event handler to be called with new modification
  // runValidators turns them on for the update operation
  const opts = {new: true, runValidators: true}
  Person
    .findByIdAndUpdate(request.params.id, person, opts)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})