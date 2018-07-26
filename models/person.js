const mongoose = require('mongoose')

//const url = 'mongodb://jussi:abc123@ds235181.mlab.com:35181/juvtest'
const url = process.env.MONGODB_URI

/*if (url === undefined) {
  console.log ("DB URL: ", url)
  return -1
}
*/
mongoose.connect(url, { useNewUrlParser: true },err => {
  if (err) {
    console.log ("DB error URL: ", url)
    throw err;
  }
  console.log(`Successfully connected to database.`);
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.statics.format = function(name, cb) {
    console.log("cb: " , cb);
    console.log("name.name: ", name.name );
    console.log("this.name: ", this.name );
    
    return {
        name: name.name,
        number: name.number,
        id: name._id
      }
}

const Person = mongoose.model('Person', personSchema);

module.exports = Person
