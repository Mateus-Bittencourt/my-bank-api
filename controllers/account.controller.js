import AccountService from "../services/account.service.js";

const createAccount = async (req, res, next) => {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name and Balance are required");
    }

    account = await AccountService.createAccount(account);

    res.status(201).send(account);

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

const getAccounts = async (req, res, next) => {
  try {
    res.send(await AccountService.getAccounts());

    logger.info("GET /account");
  } catch (error) {
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const account = await AccountService.getAccount(req.params.id);
    if (!account) {
      res.statusCode = 404;
      res.send({ message: "Account not found" });
    }
    res.send(account);

    logger.info(`GET /account/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await AccountService.deleteAccount(req.params.id);

    res.statusCode = 204;
    res.end();

    logger.info(`DELETE /account/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, Name and Balance are required");
    }

    res.send(await AccountService.updateAccount(account));

    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

const updateBalance = async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.id || account.balance == null) {
      throw new Error("Id and Balance are required");
    }

    res.send(await AccountService.updateBalance(account));

    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
