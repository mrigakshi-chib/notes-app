import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Notes API",
      version: "1.0.0",
      description:
        "A secure notes backend API with authentication, sharing, pinning, locking, search, and pagination.",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    paths: {
      "/register": {
        post: {
          summary: "Register a new user",

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  properties: {
                    email: {
                      type: "string",
                    },

                    password: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "201": {
              description:
                "User registered successfully",
            },
          },
        },
      },

      "/login": {
        post: {
          summary: "Login user",

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  properties: {
                    email: {
                      type: "string",
                    },

                    password: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "200": {
              description:
                "Login successful",
            },
          },
        },
      },

      "/notes": {
        get: {
          summary:
            "Get all notes with pagination",
          security: [
            {
                bearerAuth: [],
            },
        ],

          parameters: [
            {
              in: "query",
              name: "page",
              schema: {
                type: "integer",
              },
            },

            {
              in: "query",
              name: "limit",
              schema: {
                type: "integer",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Notes fetched successfully",
            },
          },
        },

        post: {
          summary: "Create a note",
          security: [
            {
                bearerAuth: [],
            },
        ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  properties: {
                    title: {
                      type: "string",
                    },

                    content: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "201": {
              description:
                "Note created successfully",
            },
          },
        },
      },

      "/notes/{id}": {
        put: {
          summary: "Update a note",
          security: [
            {
                bearerAuth: [],
            },
        ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Note updated successfully",
            },
          },
        },

        delete: {
          summary: "Delete a note",

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Note deleted successfully",
            },
          },
        },
      },

      "/notes/{id}/share": {
        post: {
          summary: "Share note with another user",
          security: [
            {
                bearerAuth: [],
            },
        ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Note shared successfully",
            },
          },
        },
      },

      "/notes/{id}/pin": {
        patch: {
          summary: "Pin or unpin a note",
          security: [
            {
                bearerAuth: [],
            },
        ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Pin toggled successfully",
            },
          },
        },
      },

      "/notes/{id}/lock": {
        patch: {
          summary: "Lock or unlock a note",
          security: [
            {
                bearerAuth: [],
            },
        ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Lock toggled successfully",
            },
          },
        },
      },

      "/search": {
        get: {
          summary: "Search notes",
          security: [
            {
                bearerAuth: [],
            },
        ],

          parameters: [
            {
              in: "query",
              name: "q",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            "200": {
              description:
                "Matching notes returned",
            },
          },
        },
      },

      "/about": {
        get: {
          summary:
            "Get developer and feature info",

          responses: {
            "200": {
              description:
                "About information returned",
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;