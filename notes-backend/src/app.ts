import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

const app = express();

app.use(
  cors({
    origin:
      "https://stellular-buttercream-cd76fa.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(authRoutes);
app.get("/about", (req, res) => {
  return res.status(200).json({
    name: "Mrigakshi Chib",
    email: "mrigakshichib@gmail.com",
    "my features": {
      "Pinned Notes":
        "Allows users to pin important notes for quick access. I chose this feature to improve user productivity and note organization.",

      "Locked Notes":
        "Allows users to lock notes securely using a PIN. I chose this feature to improve privacy and demonstrate secure backend practices using hashed PIN storage.",

      "Search Notes":
        "Implemented a search endpoint to allow users to quickly find notes by title or content. I chose this feature to improve usability for larger note collections.",

      "Pagination":
        "Implemented pagination for the notes API to improve scalability and optimize API responses when handling large amounts of data."
    },
  });
});
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/openapi.json", (req, res) => {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.send(swaggerSpec);
});
app.use(noteRoutes);

export default app;