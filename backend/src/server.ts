import "dotenv/config";
import app from "./app";

const PORT = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
