import FeaturedPageSection from "./featured-page-section";

export interface FeaturedPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function FeaturedPage(props: FeaturedPageProps) {
  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8">
      <FeaturedPageSection {...props} />
    </div>
  );
}
