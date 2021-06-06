export const getStatus = (req, res) => {
  res.json({ status: "OK", datetime: new Date() });
};
