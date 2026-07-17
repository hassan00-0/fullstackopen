import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;

mongoose.connect(url, { family: 4 });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
