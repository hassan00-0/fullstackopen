import axios from "axios";
const baseUrl = "https://phonebook-backend.onrender.com/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const Create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};
const updatePerson = (id, updatedObject) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedObject);
  return request.then((response) => response.data);
};
export { getAll, Create, deletePerson, updatePerson };
