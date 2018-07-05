const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()


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
  const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
  return maxId + 1
}


app.get('/', (req, res) => {
  res.send('<h1>Puhelin luettelo v0.0.1</h1>')
})

app.get('/info', (req, res) => {
  const text = '<p>puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>'
  const aika = new Date() 
  const body = text + '<p>' + aika + '</p>'
  res.send(body)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    console.log(person)
    if ( person ) {
        response.json(person)
      } else {
        response.status(404).json({error: 'id not found'})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if ( person ) {
      persons = persons.filter(person => person.id !== id)
      response.status(204).json({ok: 'person' + id + 'poistettu'})
    } else {
      response.status(404).json({error: 'id not found'})  
    }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(request.headers)

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }
  const result = persons.find(person => person.name === body.name)

  if (result !== undefined) {
    return response.status(400).json({error: 'nimi on jo luettelossa'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})