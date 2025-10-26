import { ReownProvider } from "./context/ReownProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  );
}
