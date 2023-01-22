import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextId, ...account };
    account.id = data.nextId;
    data.nextId++;
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.statusCode = 201;
    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    if (!account) {
      res.statusCode = 404;
      res.send({ message: "Account not found" });
    }
    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));

    data.accounts = data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(
      (account) => account.id === req.body.id
    );
    if (index === -1) {
      res.statusCode = 404;
      res.send({ message: "Account not found" });
    }
    data.accounts[index] = req.body;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/updateBalance", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(
      (account) => account.id === req.body.id
    );
    if (index === -1) {
      res.statusCode = 404;
      res.send({ message: "Account not found" });
    }
    data.accounts[index].balance = req.body.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
