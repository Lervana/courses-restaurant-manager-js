import { Sequelize } from "sequelize";
import databaseProvider from "../DatabaseProvider.js";

const MODEL_NAME = "example";

databaseProvider.defineModel(
  MODEL_NAME,
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
    },
    data: {
      type: Sequelize.DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export const getOneExample = async (options) =>
  databaseProvider.getOne(MODEL_NAME, options);

export const getAllExample = async () => databaseProvider.getAll(MODEL_NAME);

export const createExample = async (options) =>
  databaseProvider.create(MODEL_NAME, options);

export const updateExample = async (condition, fieldsToUpdate) =>
  databaseProvider.update(MODEL_NAME, condition, fieldsToUpdate);

export const deleteExample = async (condition) =>
  databaseProvider.delete(MODEL_NAME, condition);
