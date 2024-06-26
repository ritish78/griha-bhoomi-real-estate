import SiteHeader from "@/components/ui/Header/site-header";
import { SiteFooter } from "@/components/ui/footer/site-footer";

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
      <SiteFooter />
    </div>
  );
}
