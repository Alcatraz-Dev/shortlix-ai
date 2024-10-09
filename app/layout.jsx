import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";
import { Outfit } from "next/font/google";
import { cn } from "lib/utils";
import { ThemeProvider } from "@/components/(mode-provider)/theme-provider";
import { Toaster } from "@/components/ui/sonner"
export const metadata = {
  title: "Shortlix AI - AI Short Video Generator",
  description: "AI Short Video Generator, a simple and fast video generator",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "antialiased dark:bg-neutral-800 dark:text-neutral-100 ",
            outfit.className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>{children}</Provider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
