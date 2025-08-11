import { formatZodError } from "../utils.js";

export const validate =
  ({ body, query, params } = {}) =>
  async (req, res, next) => {
    const parts = [
      ["body", body],
      ["query", query],
      ["params", params],
    ];

    const errors = [];
    const parsed = {};

    for (const [where, schema] of parts) {
      if (!schema) continue;

      const result = await schema.safeParseAsync(req[where]);

      if (!result.success) {
        const payload = formatZodError(result.error);
        for (const issue of payload.errors) {
          errors.push({ ...issue, location: where });
        }
      } else {
        parsed[where] = result.data;
      }
    }

    if (errors.length) {
      return res.status(400).json({
        error: "ValidationError",
        message: "La solicitud contiene datos inválidos.",
        errors,
      });
    }

    // asignar los valores parseados (coerciones, defaults, etc.)
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    return next();
  };
