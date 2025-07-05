const express = require("express");
const cors = require("cors");
require("./src/controller/favoriteFlashcardCron");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",require("./src/routes/user.route"));
app.use("/categories",require("./src/routes/category.route"));
app.use("/cards",require("./src/routes/link.route"));
app.use("/notes",require("./src/routes/notes.route"));
app.use("/pdf",require("./src/routes/pdf.route"));
app.use("/public",require("./src/routes/public.route"));
app.use("/tags",require("./src/routes/tags.route"));
app.listen(3000, (req, res) => {
  console.log("running at 3000");
});
