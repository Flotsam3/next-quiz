import mongoose from "mongoose";

let isConnected = false;

(function connectDb() {
   mongoose.set("strictQuery", false);

   if (isConnected) {
      return console.log("Already connected to the db!");
   }

   mongoose
      .connect(process.env.MONGODB_URI, {
         dbName: process.env.DATABASE,
      })
      .then(() => {
         console.log("connected via mongoose");
         isConnected = true;
      });
})();
