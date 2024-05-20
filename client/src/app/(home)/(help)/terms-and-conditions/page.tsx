import Link from "next/link";

export default function TermsAndConditionPage() {
  return (
    <section className="container bg-slate-50 py-8 dark:bg-transparent my-10">
      <div className="mx-auto flex max-w-[48rem] flex-col">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl mb-6">
          Terms and Conditions
        </h2>
        <p className="mb-12">
          These terms and conditions outline the rules and regulations for the use of GrihaBhoomi's Website.
          By using this website, you accept these terms and conditions in full. If you disagree with these
          terms and conditions or any part of these terms and conditions, you must not use this website.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">1. License</h2>
        <p className="mb-12">
          Unless otherwise stated, GrihaBhoomi and/or its licensors own the intellectual property rights for
          all material on website. All intellectual property rights are reserved.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">2. Hyperlinking to our Content</h2>
        <p className="mb-12">
          The following organizations may link to our website without prior written approval: Government
          agencies, search engines, news organizations, etc.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">3. Content Liability</h2>
        <p className="mb-12">
          We shall not be hold responsible for any content that appears on GrihaBhoomi. You agree to protect
          and defend us against all claims that may rise on GrihaBhoomi.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">4. Your Privacy</h2>
        <p className="mb-12">
          Please read{" "}
          <Link href="/privacy" className="underline transition-colors hover:text-muted-foreground">
            Privacy Policy.
          </Link>
        </p>
        <h2 className="text-xl font-bold border-b mb-4">5. Reservation of Rights</h2>
        <p className="mb-12">
          We reserve the right to request that you remove all links or any particular link to our website. You
          approve to immediately remove all links to our GrihaBhoomi website upon request.
        </p>
      </div>
    </section>
  );
}
