import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res, next) => {
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

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);

    logger.info("GET /account");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
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

    logger.info(`GET /account/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));

    data.accounts = data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.statusCode = 204;
    res.end();

    logger.info(`DELETE /account/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
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

    logger.info(`PUT /account - ${JSON.stringify(req.body)}`);
  } catch (error) {
    next(error);
  }
});

router.patch("/updateBalance", async (req, res, next) => {
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

    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(req.body)}`);
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`	)
  console.log(err);
  res.status(500).send({ error: err.message });
});

export default router;
