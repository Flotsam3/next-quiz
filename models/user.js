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
      default: 0,
   },
   rounds: {
      type: Number,
      default: 0,
   },
});

const User = mongoose.models.quizUser || mongoose.model("quizUser", schema);

export default User;
