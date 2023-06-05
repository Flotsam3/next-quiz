import mongoose from "mongoose";

const schema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   level: {
      type: String,
   },
   score: {
      type: Number,
   },
});

export default User = new mongoose.model("quizUser", schema);
