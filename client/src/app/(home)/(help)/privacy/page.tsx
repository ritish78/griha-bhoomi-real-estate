import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy - GrihaBhoomi",
  description: "Privacy Policy at GrihaBhoomi",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[48rem] flex-col">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl mb-6">
          Privacy Policy
        </h2>
        <p className="mb-12">
          This privacy policy outlines the rules and regulations for the use of GrihaBhoomi's
          Website. By using this website, you accept this privacy policy in full. If you disagree
          with this privacy policy or any part of this privacy policy, you must not use this
          website.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">1. Personal Information</h2>
        <p className="mb-12">
          We may collect personal information such as your name, email address, and contact details
          when you register or make a purchase on our website. We will use this information to
          provide you with our services and support.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">2. Cookies</h2>
        <p className="mb-12">
          Our website uses cookies to enhance your experience. By using our website, you consent to
          the use of cookies in accordance with our privacy policy.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">3. Security</h2>
        <p className="mb-12">
          We are committed to ensuring that your information is secure. We have implemented suitable
          physical, electronic, and managerial procedures to safeguard the information we collect
          online.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">4. Changes to this Policy</h2>
        <p className="mb-12">
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page.
        </p>
        <h2 className="text-xl font-bold border-b mb-4">5. Contact Us</h2>
        <p className="mb-12">
          If you have any questions about this Privacy Policy, please{" "}
          <Link
            href="/contact-us"
            className="underline transition-colors hover:text-muted-foreground"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
