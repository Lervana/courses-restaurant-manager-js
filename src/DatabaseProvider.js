import config from "config";
import { Sequelize } from "sequelize";

class DatabaseProvider {
  sequelize = null;
  models = {};

  constructor() {
    this.sequelize = new Sequelize(config.database);
  }

  testConnection = async () => {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  };

  defineModel = (name, attributes, options) => {
    this.models[name] = this.sequelize.define(name, attributes, options);
    return this.models[name];
  };

  transaction = async (cb) => {
    const t = await this.sequelize.transaction();

    try {
      await cb();
      await t.commit();
    } catch (error) {
      console.error(error);
      await t.rollback();
      throw error;
    }
  };

  getAll = async (modelName) => {
    return await this.models[modelName].findAll();
  };

  getOne = async (modelName, options) => {
    return await this.models[modelName].findOne(options);
  };

  create = async (modelName, options, useTransaction = true) => {
    const action = async () => await this.models[modelName].create(options);
    return useTransaction ? this.transaction(action) : action();
  };

  update = async (
    modelName,
    condition,
    fieldsToUpdate,
    useTransaction = true
  ) => {
    const action = async () => {
      const model = await this.getOne(modelName, condition, false);
      Object.keys(fieldsToUpdate).forEach((key) => {
        model[key] = fieldsToUpdate[key];
      });
      await model.save();
    };
    return useTransaction ? this.transaction(action) : action();
  };

  delete = async (modelName, condition, useTransaction = true) => {
    const action = async () => {
      const model = await this.getOne(modelName, condition, false);
      await model.destroy();
    };
    return useTransaction ? this.transaction(action) : action();
  };
}

const databaseProvider = new DatabaseProvider();
export default databaseProvider;
