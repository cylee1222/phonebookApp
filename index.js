require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const requestTime = new Date(Date.now())
        response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${requestTime}</p>`)
    })

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end()
    }).catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {

    const body = request.body

    const phoneEntry = new Person({
        name: body.name,
        number: body.number,
    })

    phoneEntry.save().then(person => {
        response.json(person)
    }).then(err => next(err))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === "CastError") {
      return res.status(400).send({ error: "malformatted id" })
    }else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})