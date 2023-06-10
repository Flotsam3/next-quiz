import User from "../models/user.js";

export const createUser = async (data) => {
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
