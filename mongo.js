const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.slqqj.mongodb.net/puhelinLuettelo?retryWrites=true&w=majority`

mongoose.connect(url)



const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })
  
  const Person = mongoose.model('Person', personSchema)
  
  

if(process.argv.length<5){

    Person.find({}).then(result => {
        console.log("Phonebook: ")
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    
    

}
else{
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })



    person.save().then(result => {
    console.log(`added ${name}'s number ${number} to phonebook`)
    mongoose.connection.close()
    })
}



