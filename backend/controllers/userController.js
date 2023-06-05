import User from "../models/user.js";

export const createUser = async (req, res, next) => {
   try {
      const result = await User.create(req.body);
      res.status(201).json(result);
   } catch (err) {
      res.status(500).json(err);
   }
};
