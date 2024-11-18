// /inventory-service/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const inventoryRoutes = require("./routes/inventoryRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", inventoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
});
