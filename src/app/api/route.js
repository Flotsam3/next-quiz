import { NextResponse } from "next/server";
import "../../../lib/connect_db.js";
import { createUser, getUsers } from "../../../controllers/userController.js";

export const POST = async (request) => {
   const { name, level } = await request.json();
   try {
      const response = await createUser({ name, level });
      return new Response(JSON.stringify(response));
   } catch (error) {
      return new NextResponse(error.message, { status: 500 });
   }
};

export const GET = async () => {
   try {
      const response = await getUsers();
      return new NextResponse(JSON.stringify(response));
   } catch (error) {
      return new NextResponse(error.message, { status: 500 });
   }
};
