import express from "express";

const app = express();
const PORT = 9091;

app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

