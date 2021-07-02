require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))


// Configure morgan to log body of POST request
morgan.token('person', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
  return null
})

// json-parser
app.use(express.json())

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person',
  ),
)

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456"
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523"
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345"
//   },
//   {
//     id: 4,
//     name: "Mary Poppendick",
//     number: "39-23-6423122"
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/info', (request, response) => {
  let text = `<div>Phonebook has info for ${persons.length} people</div><br><div>${new Date()}</div>`
  response.send(text)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if (persons.map(p => p.name).includes(body.name)) {
    response.json({error: 'Persons already exists in phonebook'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  // If none of the conditions triggered an error, person is added
  persons = persons.concat(person)
  response.json(person)
})

// app.put('/api/persons:id', (request,response) => {
//   const body = request.body

//   if(!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }
  
//   // Modifies the person to be updated by replacing their object with another that has the same pid
//   const updatedPpl = persons.map(person => {
//     if (person.name === body.name) {
//       return {...body, id:person.id}
//     }
//     return person
//   })
//   response.json(updatedPpl)
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})