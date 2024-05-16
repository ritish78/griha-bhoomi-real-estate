import Link from "next/link";

export default function ContactUsPage() {
  return (
    <section
      id="features"
      className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Contact Us</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          You can contact us in any of the links provided. If you want to help us to grow and make this
          website to grow better please clone the repo and make changes and then send a pull request in github
          link provided.
        </p>
        <div className="flex space-x-4">
          <Link
            href="https://github.com/ritish78"
            className="text-lg text-zinc-300 transition-colors hover:text-zinc-100"
          >
            GitHub
          </Link>
          <a
            href="https://ritishtimalsina.com"
            className="text-lg text-zinc-300 transition-colors hover:text-zinc-100"
          >
            Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
