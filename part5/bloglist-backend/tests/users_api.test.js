import supertest from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { beforeEach, test, after } from "node:test";
import { usersInDb } from "./test_helper.js";
import assert from "node:assert";
import mongoose from "mongoose";

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "dummy", passwordHash });
  await user.save();
});

test("creation succeeds with a fresh username", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  const usernames = usersAtEnd.map((user) => user.username);
  assert(usernames.includes(newUser.username));
});

test("creation fails with duplicate usernames", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "dummy",
    name: "test",
    password: "1234",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();

  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("creation fails with username too short", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "ab",
    name: "Short Name",
    password: "salainen",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();
  assert(result.body.error.includes("shorter than the minimum allowed length"));
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("creation fails with password too short", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "validuser",
    name: "Valid Name",
    password: "12",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();
  assert(result.body.error.includes("password must be at least 3 characters"));
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("creation fails with missing username", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    name: "No Username",
    password: "salainen",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();
  assert(result.body.error.includes("username is required"));
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("creation fails with missing password", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "nopassword",
    name: "No Password",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();
  assert(result.body.error.includes("password is required"));
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

after(async () => {
  await mongoose.connection.close();
});
