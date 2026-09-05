import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ballagan Farm Glamping Pods collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="How we collect, use and look after your personal information."
      updated="August 2026"
    >
      <p>
        Ballagan Farm Glamping Pods is committed to protecting your privacy. This
        policy explains what we collect when you visit this website or stay with
        us, what we do with it, and what rights you have over it.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>Information you give us.</strong> When you fill in our enquiry
        form or contact us, we collect your name, email address, phone number,
        the dates and pod you&rsquo;re asking about, and whatever you write in
        your message.
      </p>
      <p>
        <strong>Information collected automatically.</strong> Like most websites,
        we collect technical information about your visit: IP address, browser
        type, device and pages viewed, to keep the site working and understand
        how it&rsquo;s used.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To answer your enquiry and arrange your stay.</li>
        <li>To send you information about a booking you have made.</li>
        <li>To improve the website and the service we offer.</li>
        <li>
          To send occasional updates or offers, where you have asked to receive
          them. You can opt out at any time.
        </li>
      </ul>

      <h2>Legal basis</h2>
      <p>
        We process enquiry details on the basis of taking steps at your request
        before entering into a contract, and to perform that contract once you
        book. Website analytics and marketing emails rely on your consent or our
        legitimate interest in running the business, whichever applies.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We share information only with the service providers that help us run the
        business: our booking system (InnStyle), our email provider, our website
        hosting, and our payment processor. They are only permitted to use your
        information to provide that service to us. We may also disclose
        information where the law requires it.
      </p>
      <p>We never sell your personal information.</p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries are kept for up to two years so we can pick up a conversation
        where it left off. Booking and payment records are kept for six years to
        meet accounting requirements. After that we delete them.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of cookies to keep the site working and to
        understand how it is used. You can manage or block cookies in your
        browser settings. The site will still work without them.
      </p>

      <h2>Keeping it safe</h2>
      <p>
        We use appropriate technical and organisational measures to protect your
        information from unauthorised access, use or disclosure. No transmission
        over the internet is completely secure, but we take this seriously.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Ask for a copy of the information we hold about you.</li>
        <li>Ask us to correct anything that&rsquo;s wrong.</li>
        <li>Ask us to delete it, where we have no reason to keep it.</li>
        <li>Object to us using it, or ask us to restrict how we use it.</li>
        <li>Withdraw consent for marketing at any time.</li>
      </ul>
      <p>
        To exercise any of these, email us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. If you&rsquo;re not
        happy with our response you can complain to the Information
        Commissioner&rsquo;s Office at ico.org.uk.
      </p>

      <h2>Children</h2>
      <p>
        This website is not directed at children under 16 and we do not knowingly
        collect their personal information. If you believe we have, contact us and
        we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted here
        with a revised date.
      </p>

      <h2>Contact</h2>
      <p>
        Ballagan Farm Glamping Pods, {site.address.line1},{" "}
        {site.address.line2}, {site.address.postcode}. Email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}.
      </p>
    </LegalPage>
  );
}
