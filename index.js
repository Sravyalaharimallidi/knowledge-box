const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",require("./src/routes/user.route"));
app.use("/categories",require("./src/routes/category.route"));
app.listen(3000, (req, res) => {
  console.log("running at 3000");
});
