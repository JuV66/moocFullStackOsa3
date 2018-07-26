const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')


const app = express()

/*
let persons = [
    {
      id: 1,
      name: 'Arto Hellas',
      number: '040-123456'
    },
    {
      id: 2,
      name: 'Matti Tienari',
      number: '040-123456'
    },
    {
      id: 3,
      name: 'Arto Järvinen',
      number: '050-123456'
    },
    {
      id: 4,
      name: 'Lea Kutvonen',
      number: '040-123456'
    }
]
*/

morgan.token('oma', function ( req, res) { 
  return[
        JSON.stringify(req.body),
        JSON.stringify(res.body),
  ]
})


morgan.token('id', function getId (req) {
  return req.id
})
app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.json())

app.use(express.static('build')) // tarvitaan siihen että fortti koodi saadaan ajettua

app.use(morgan('tiny'))
app.use(morgan(':id :method :url :response-time :oma'))
app.use(morgan('dev'))
app.use(morgan('combined'))
app.use(morgan('common'))
app.use(cors())
//morgan('tiny')

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), 
    '-',
    tokens['response-time'](req, res), 'ms',
    tokens.req(req,res),
    tokens.oma(req,res)
  ].join(' ')
})


const generateId = () => {
  //const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
  maxId = Math.random() * 989898
  return maxId + 1
}


// tässä kaksi esimerkkiä samasta funktiosta
const formatPerson = (person) => {
  console.log('formatPerson')
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}
/*
// alempi parempi, jos kenttiä olisi paljon
const formatPerson = (person) => {
  const formattedPerson = {...person._doc, id:person._id}
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}
*/

app.get('/', (req, res) => {
  res.send('<h1>Puhelin luettelo v0.0.1</h1>')
})

app.get('/api/info', (req, res) => {
  Person
    .find()
    .then(person => {
      const text = '<p>puhelinluettelossa ' + person.length + ' henkilön tiedot</p>'
      const aika = new Date() 
      const body = text + '<p>' + aika + '</p>'
      res.send(body)
    })
})

app.get('/api/persons', (request, response) => {

  /*
  if (Person === undefined){
    console.log("ERROR")
    response.status(500).send({error: 'DB unavailable'})
  }*/
  console.log ("Person: ",Person)

  Person
    .find()
    //.find({}, {__v: 0})
    .then(person => {
      //response.json(person.map(formatPerson))})
      console.log('LISTA')
      console.log(person)
      response.json(person.map(Person.format))
      //response.json(person.map(formatPerson))
      Person.connection.close()
    })
})

app.get('/api/persons/:id', (request, response) => {
    
  /*
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    console.log(person)
    if ( person ) {
  */    Person
          .findById(request.params.id)
          .then(person => {
            if (person){
              response.json(person.map(Person.format))
              //response.json(formatPerson(person))
            } else {
              response.status(404).send({error: 'id not found'})
            }
          })
          .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
          })
 
})

app.delete('/api/persons/:id', (request, response) => {
    /*
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if ( person ) {
      persons = persons.filter(person => person.id !== id)
      response.status(204).json({ok: 'person' + id + 'poistettu'})
    } else {
      response.status(404).json({error: 'id not found'})  
    }*/
    Person
          .findByIdAndRemove(request.params.id)
          .then(person => {
            response.json(formatPerson(person))
            mongoose.connection.close()
          })
          .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
          })
})

app.put('/api/persons/:id', (request, response) => {
  
  const body = request.body

  const upPerson = {
    number: request.body.number
  }

  console.log("put (upPerson): ", request.body)

  Person
        .findByIdAndUpdate(request.params.id, upPerson, {new:true})
        .then(updatedPerson => {
          response.json(formatPerson(updatedPerson))
        })
        .catch(error => {
          console.log(error)
          response.status(400).send({error: 'malformatted id'})
        })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(request.headers)

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }
/*
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }
  const result = persons.find(person => person.name === body.name)

  if (result !== undefined) {
    return response.status(400).json({error: 'nimi on jo luettelossa'})
  }
*/
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(savedPerson))
      //mongoose.connection.close()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})