import DashboardNav from "@/components/layout/dashboardNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <DashboardNav />
          <main className="ml-[20%] h-screen w-full overscroll-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
