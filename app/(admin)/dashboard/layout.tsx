import "@/app/globals.css";
import DashboardNav from "@/components/layout/dashboardNav";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <TooltipProvider>
            <DashboardNav />
            <main className="ml-[20%] h-screen w-full overscroll-y-auto">{children}</main>
          </TooltipProvider>
        </div>
      </body>
    </html>
  );
}
