import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const getAccounts = async () => {
  const data = JSON.parse(await readFile(global.fileName));
  return data.accounts;
};

const getAccount = async (id) => {
  const accounts = await getAccounts();
  const account = accounts.find((account) => account.id === parseInt(id));
  if (account) {
    return account;
  }
  throw new Error("Account not found");
};

const insertAccount = async (account) => {
  const data = JSON.parse(await readFile(global.fileName));

  account = { id: data.nextId, name: account.name, balance: account.balance };
  account.id = data.nextId;
  data.nextId++;
  data.accounts.push(account);

  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return account;
};

const deleteAccount = async (id) => {
  const data = JSON.parse(await readFile(global.fileName));

  data.accounts = data.accounts.filter(
    (account) => account.id !== parseInt(id)
  );

  await writeFile(global.fileName, JSON.stringify(data, null, 2));
};

const updateAccount = async (account) => {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex((a) => a.id === account.id);

  if (index === -1) {
    throw new Error("Account not found");
  }

  data.accounts[index].name = account.name;
  data.accounts[index].balance = account.balance;
  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return data.accounts[index];
};

export default {
  getAccounts,
  getAccount,
  insertAccount,
  deleteAccount,
  updateAccount,
};
