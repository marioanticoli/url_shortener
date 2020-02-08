"use strict";

const express = require("express");

// Controllers
const shortenerCtrl = require("./controllers/shortenerCtrl");

// Constants
const PORT = 80;
const HOST = "0.0.0.0";

// App
const app = express();

app.use(express.json());

// Routes
app.post("/shorten", shortenerCtrl.shorten);
app.get("/:id", shortenerCtrl.serve);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
