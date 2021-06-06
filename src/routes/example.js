import { ExampleService } from "../services/example.js";

export const getExample = async (req, res) => {
  const { params } = req;
  if (!params?.id) return res.json({ data: [] });
  return res.json({ data: await ExampleService.read(params.id) });
};

export const getExamples = async (req, res) => {
  return res.json({ data: await ExampleService.readAll() });
};

export const postExample = async (req, res) => {
  const { body } = req;
  const { id, name, data } = body || {};

  try {
    await ExampleService.create(id, name, data);
    res.status(201);
  } catch (err) {
    res.status(500);
  }

  return res.send();
};

export const patchExample = async (req, res) => {
  const { body } = req;
  const { id, name, data } = body || {};

  const fieldsToUpdate = {};
  if (name !== undefined) fieldsToUpdate.name = name;
  if (data !== undefined)
    fieldsToUpdate.data =
      typeof data === "string" ? data : JSON.stringify(data);

  try {
    await ExampleService.update(id, fieldsToUpdate);
    res.status(200);
  } catch (err) {
    res.status(500);
  }

  return res.send();
};

export const deleteExample = async (req, res) => {
  const { params } = req;
  const { id } = params || {};
  await ExampleService.delete(id);
  return res.send();
};
