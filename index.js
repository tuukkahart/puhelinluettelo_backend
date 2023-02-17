require('dotenv').config()
const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))




app.get('/api',(request, response) =>{
  response.send("try /api/persons")
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  const date = new Date
  const phoneBookLength = persons.length
  response.write("<p>phonebook has "+phoneBookLength+" numbers.</p>")
  response.write("<p>"+date+"</p>")
  response.send()
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person =>{
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next)=>{
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if(body.number === undefined) {
      return response.status(400).json({
        error: 'number missing'
      })
    }

    // if(persons.some(person => person.name === body.name)){
    //   return response.status(400).json({
    //     error: 'name must be unique'
    //   })
    // }
    
    const person = new Person({
        name : body.name,
        number : body.number,
    })

    person.save().then(savedPerson =>{
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next)=>{
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      
      next(error)
    })

  
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

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})  