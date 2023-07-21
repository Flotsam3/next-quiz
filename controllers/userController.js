import User from "../models/user.js";

export const createUser = async (data) => {
   console.log({ data });
   try {
      const result = await User.create(data);
      return { status: 201, result };
   } catch (err) {
      console.log("status 500", err);
   }
};

export const getUsers = async () => {
   try {
      const result = await User.find();
      return { status: 200, result };
   } catch (error) {
      console.log("status 500", err);
   }
};

export const saveScore = async (user) => {
   console.log({ user });
   try {
      const result = await User.findOneAndUpdate({ _id: user.id }, { $set: { score: user.score, rounds: user.rounds } });
      return { status: 200, result };
   } catch (err) {
      console.log("status 500", err);
   }
};
