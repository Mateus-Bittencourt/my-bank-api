import { GraphQLBoolean, GraphQLInt } from "graphql";
import Account from "../types/Account.js";
import AccountInput from "../types/AccountInput.js";
import AccountService from "../../services/account.service.js";

const accountMutation = {
  createAccount: {
    type: Account,
    args: {
      account: {
        name: "account",
        type: AccountInput,
      },
    },
    resolve: (_, args) => AccountService.createAccount(args.account),
  },
  deleteAccount: {
    type: GraphQLBoolean,
    args: { id: { name: "id", type: GraphQLInt } },
    resolve: (_, args) => AccountService.deleteAccount(args.id),
  },
  updateAccount: {
    type: Account,
    args: {
      account: {
        name: "account",
        type: AccountInput,
      },
    },
    resolve: (_, args) => AccountService.updateAccount(args.account),
  },
};

export default accountMutation;
