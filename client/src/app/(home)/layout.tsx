import SiteHeader from "@/components/ui/Header/site-header";

interface HomeLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode;
  }> {}

export default async function HomeLayout({ children, modal }: HomeLayoutProps) {
  //TODO: Add functionality to get signed in user

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
