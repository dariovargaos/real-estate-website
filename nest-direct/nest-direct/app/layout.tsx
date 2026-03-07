import { Provider } from "../components/ui/provider";
import { UserProvider } from "../hooks/useAuthContext";
import type { Metadata } from "next";

//fonts
import { DM_Sans } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NestDirect - Buy and Sell Properties Directly",
  description: "Buy and sell properties directly — no agents, no hidden fees.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body className={dmSans.className}>
        <Provider>
          <UserProvider>{children}</UserProvider>
        </Provider>
      </body>
    </html>
  );
}
