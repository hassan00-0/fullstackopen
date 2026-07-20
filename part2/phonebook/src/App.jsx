import { useEffect, useState } from "react";
import FormHandler from "./components/FormHandler";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import { getAll, Create, deletePerson, updatePerson } from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getAll()
      .then((response) => setPersons(response))
      .catch(() => {
        setErrorMessage("Failed to fetch contacts from server");
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }, []);

  const showNotification = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const onNameChange = (e) => {
    setNewName(e.target.value);
  };

  const addName = (e) => {
    e.preventDefault();
    const personExists = persons.find((person) => person.name == newName);
    if (personExists) {
      if (personExists.number != newNumber) {
        if (
          window.confirm(
            `${newName} is already added, replace previous number with new one?`,
          )
        ) {
          const updatedPerson = { ...personExists, number: newNumber };
          updatePerson(personExists.id, updatedPerson)
            .then((response) => {
              setPersons(
                persons.map((person) =>
                  person.id === personExists.id ? response : person,
                ),
              );
            })
            .then(() => {
              showNotification("number changed successfully!", "success");
            })
            .catch((error) => {
              if (error.response.status == 404) {
                showNotification(
                  `Information of ${newName} has already been removed from server`,
                  "error",
                );
                setPersons(persons.filter((p) => p.id !== personExists.id));
              } else if (error.response.status === 400) {
                showNotification(error.response.data.error, "error");
              } else {
                showNotification("Failed to update number", "error");
              }
            });
        }
      } else {
        alert(`${newName} is already added to the phonebook...`);
      }
      setNewName("");
      setNewNumber("");
      return;
    }
    const newPerson = { name: newName, number: newNumber };
    Create(newPerson)
      .then((response) => {
        showNotification("person added successfully!", "success");
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          showNotification(error.response.data.error, "error");
        } else {
          showNotification("Failed to add person", "error");
        }
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification("Person deleted successfully!", "success");
        })
        .catch(() => {
          showNotification("Failed to delete person", "error");
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {/* notifications */}
      {errorMessage && <Notification message={errorMessage} type="error" />}
      {successMessage && (
        <Notification message={successMessage} type="success" />
      )}

      <Filter searchQuery={searchQuery} handleSearch={handleSearch} />
      <FormHandler
        addName={addName}
        newName={newName}
        onNameChange={onNameChange}
        newNumber={newNumber}
        onNumberChange={onNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
