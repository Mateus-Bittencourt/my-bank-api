import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.routes.js";
import { promises as fs } from "fs";
import cors from "cors";
// import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import AccountService from "./services/account.service.js";
import Schema from "./schema/index.js";
import basicAuth from "express-basic-auth";

const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

// const schema = buildSchema(`
//   type Account {
//     id: Int
//     name: String
//     balance: Float
//   }
//   input AccountInput {
//     id: Int
//     name: String
//     balance: Float
//   }
//   type Query {
//     getAccounts: [Account]
//     getAccount(id: Int): Account
//   }
//   type Mutation {
//     createAccount(account: AccountInput): Account
//     deleteAccount(id: Int): Boolean
//     updateAccount(account: AccountInput): Account
//   }
// `);

const root = {
  getAccounts: () => AccountService.getAccounts(),
  getAccount: (args) => AccountService.getAccount(args.id),
  createAccount: ({ account }) => AccountService.createAccount(account),
  deleteAccount: (args) => AccountService.deleteAccount(args.id),
  updateAccount: ({ account }) => AccountService.updateAccount(account),
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const getRole = (user) => {
  if (user === "admin") {
    return "admin";
  } else if(user ==="mateus"){
    return "role1";
  }
  // return "user";
};

const authorize = (...allowed) => {

  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    if(req.auth.user){
      const role = getRole(req.auth.user);

      if (isAllowed(role)) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized user" });
      }
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

app.use(
  basicAuth({
    authorizer: (user, password) => {
      const userMatchers = basicAuth.safeCompare(user, "admin");
      const passwordMatchers = basicAuth.safeCompare(password, "1234");

      const userMatchers2 = basicAuth.safeCompare(user, "mateus");
      const passwordMatchers2 = basicAuth.safeCompare(password, "1234");

      return userMatchers & passwordMatchers || userMatchers2 & passwordMatchers2;
    },
  })
);
app.use("/account", authorize('admin'),accountsRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    // rootValue: root,
    graphiql: true,
  })
);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile("accounts.json", JSON.stringify(initialJson))
      .then(() => {
        logger.info("API Started and File Created!");
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
