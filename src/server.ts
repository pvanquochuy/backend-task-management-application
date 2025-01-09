import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 5000;

// Khởi động server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
