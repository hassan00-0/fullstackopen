import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minLength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{6}$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Use format: XX-XXXXXXX or XXX-XXXXXXX`,
    },
    required: [true, 'Number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

export default Person
