export const createUser = async (data) => {
   try {
      const response = await fetch("/api", {
         method: "POST",
         headers: {
            "Content-Type": "application/json; charset=utf8",
         },
         body: JSON.stringify(data),
      });
      const resData = await response.json();
      console.log({ response, resData });
      return resData;
   } catch (error) {
      console.log("In catch block", error);
   }
};

export const getUsers = async () => {
   try {
      const response = await fetch("/api/play", {
         method: "GET",
      });
      const resData = await response.json();
      console.log({ resData });
      return resData;
   } catch (error) {
      console.log("In catch block", error);
   }
};
