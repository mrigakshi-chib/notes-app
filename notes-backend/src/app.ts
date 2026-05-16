import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-app-mrigakshi.netlify.app"
    ],
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
        "Users can pin important notes so they appear above regular notes. I chose this feature because it improves note organization and helps users quickly access important information.",

      "Locked Notes":
        "Users can lock their own notes using a PIN. The PIN is hashed before being stored. I chose this feature to add a privacy layer and demonstrate secure handling of sensitive data.",

      "Shared Notes Section":
        "The dashboard separates notes into My Notes and Shared With Me. I chose this feature to make ownership clear and improve the user experience.",

      "View-Only Shared Notes":
        "Shared notes are view-only for the receiving user. They cannot edit, delete, pin, lock, or re-share notes they do not own. I chose this feature to keep permissions safe and logical.",

      "Registered User Sharing":
        "Notes can only be shared with users who are already registered in the app. I chose this to keep sharing controlled and avoid invalid or unknown recipients.",

      "Search Notes":
        "Users can search notes by title or content. I chose this feature because it helps users find information quickly as their number of notes increases.",

      "Pagination":
        "The notes API supports pagination using page and limit query parameters. I chose this feature to make the API more scalable and avoid returning too many notes at once.",

      "Responsive Frontend":
        "I built a responsive frontend that works on both desktop and mobile devices. I chose this feature so users can access and manage notes comfortably across screen sizes.",

      "Dark Mode":
        "The dashboard includes a dark mode toggle. I chose this feature to improve user experience and give users control over the app appearance.",

      "Swagger API Documentation":
        "The backend includes Swagger UI and OpenAPI JSON documentation. I chose this feature to make the API easier to understand, test, and review."
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