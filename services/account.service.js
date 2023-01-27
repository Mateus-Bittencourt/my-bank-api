import AccountRepository from "../repositories/account.repository.js";

const createAccount = async (account) => {
  return await AccountRepository.insertAccount(account);
};

const getAccounts = async () => {
  return await AccountRepository.getAccounts();
};

const getAccount = async (id) => {
  return await AccountRepository.getAccount(id);
};

const deleteAccount = async (id) => {
  return await AccountRepository.deleteAccount(id);
};

const updateAccount = async (account) => {
  return await AccountRepository.updateAccount(account);
};

const updateBalance = async (account) => {
  const acc = await getAccount(account.id);
  acc.balance = account.balance;
  return await AccountRepository.updateAccount(acc);
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
