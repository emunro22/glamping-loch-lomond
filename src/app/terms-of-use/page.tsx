import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that apply when you use the Ballagan Farm Glamping Pods website.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of use"
      intro="These terms apply whenever you use this website. Please read them before you book."
      updated="August 2026"
    >
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using the Ballagan Farm Glamping Pods website, you agree
        to these Terms of Use and to our Privacy Policy. If you do not agree with
        them, please do not use the website.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these Terms of Use from time to time. Any changes will be
        posted on this page with a revised date. Continuing to use the website
        after a change means you accept it.
      </p>

      <h2>Using the website</h2>
      <p>
        You agree to use the website only for lawful purposes, and in a way that
        does not infringe anyone else&rsquo;s rights or restrict their use of it.
        You may not use the website for any unlawful or harmful activity.
      </p>

      <h2>Bookings</h2>
      <p>
        Bookings are taken through our booking system, InnStyle. When you follow
        a booking link from this site you are handed over to that system, and the
        booking terms, payment terms and cancellation policy shown there apply to
        your stay. Prices and availability shown in the booking system are the
        definitive ones.
      </p>
      <p>
        The BBQ hut is an optional extra available only with the Rose Pod, at
        additional cost, and is subject to availability. Contact us directly to
        add it to a booking.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this website, including text, graphics, logos and images,
        belongs to Ballagan Farm Glamping Pods or its licensors and is protected
        by copyright, trade mark and other intellectual property laws. You may
        not reproduce, distribute or create derivative works from any of it
        without our written permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        Ballagan Farm Glamping Pods is not liable for any direct, indirect,
        incidental or consequential loss arising from the use of, or inability to
        use, this website. Our liability is limited to the fullest extent
        permitted by law. Nothing in these terms limits liability for death or
        personal injury caused by negligence, or for fraud.
      </p>

      <h2>Links to other websites</h2>
      <p>
        This website links to third-party websites that we do not control,
        including our booking system. We are not responsible for their content,
        privacy practices or availability. Following those links is at your own
        risk.
      </p>

      <h2>Content you submit</h2>
      <p>
        If you send us content through this website — an enquiry, a review, a
        photograph — you grant us a non-exclusive, royalty-free licence to use,
        reproduce and display it in connection with our business. You are
        responsible for what you submit and must make sure it is lawful and does
        not infringe anyone&rsquo;s rights.
      </p>

      <h2>Suspension of access</h2>
      <p>
        We may suspend or withdraw access to the website at our discretion,
        without notice, including where we believe these terms have been broken.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the law of Scotland, and the Scottish courts
        have exclusive jurisdiction over any dispute arising from them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Write to Ballagan Farm Glamping Pods,{" "}
        {site.address.line1}, {site.address.line2}, {site.address.postcode}, or
        email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
