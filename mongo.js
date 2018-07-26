const mongoose = require('mongoose')
//const process = require('process')

const url = process.env.MONGODB_URI



process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });
//var program_name = process.argv[0];
//console.log('eka: ' + program_name);

//mongoose.connect(url)
mongoose.connect(url, { useNewUrlParser: true },err => {
  if (err) throw err;
  console.log(`Successfully connected to DB: `,url);
});

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

if (process.argv[2] !== undefined ){
    if (process.argv[3] !== undefined ){
        person
            .save()
            .then(response => {
                console.log('person saved!')
                mongoose.connection.close()
                return
            })
    }

}


Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

  module.exports = Person