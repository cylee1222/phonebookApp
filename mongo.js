const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
    console.log('Please provide the password[, name and number] as an argument: node mongo.js <password> [<name> <number>]')
    process.exit(1)
}

const [ , , password, name, number] = process.argv

const url = `mongodb+srv://admin:${password}@cluster0.ezisw.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    
    console.log('connected')

    if(process.argv.length == 5){
        const person = new Person({
          name: name,
          number: number,
        })
        person.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            return mongoose.connection.close()
        })
    }

    if(process.argv.length == 3){
        Person.find({}).then(result => {
            console.log('phonebook:')
            result.forEach(phoneEntry => {
                console.log(phoneEntry.name, phoneEntry.number)
            })
            return mongoose.connection.close()
        })
    }

  })
  .catch((err) => console.log(err))
