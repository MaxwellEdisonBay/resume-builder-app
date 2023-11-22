import "@styles/globals.css";
import "@styles/main.css"
import { ReactNode } from "react";
import NavBar from "@components/NavBar";
import Provider from "@components/Provider";

export const metadata = {
  title: "Resume Builder",
  description: "Build your own resume!",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient"></div>
          </div>
          <main className="app">
            <NavBar />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
