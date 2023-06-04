import "./globals.scss";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "Next Quizz App",
   description: "Drag and drop quiz with next.js",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={inter.className}>{children}</body>
      </html>
   );
}
