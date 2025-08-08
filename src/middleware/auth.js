import jwt from "jsonwebtoken";

export const authBotMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).send("No token");

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.user_id };
    req.user_lang = { lang: payload.user_lang };
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).send("Invalid or expired token");
  }
};
