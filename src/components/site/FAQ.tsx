import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Question = { question: string; answer: string };

const faqs: Question[] = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is from 3pm and check-out is by 10am, giving us time to get each pod ready between guests.",
  },
  {
    question: "Can we bring our dog?",
    answer:
      "Yes — both pods are dog friendly, with no extra charge, up to two dogs per pod. There are farm walks straight from the door.",
  },
  {
    question: "Do the pods have a hot tub?",
    answer:
      "Every pod has its own hot tub. The Rose Pod's is open to the sky on its decking; the Thistle Pod's sits under a covered gazebo and comes with sole access to our barrel sauna.",
  },
  {
    question: "Is the BBQ hut included?",
    answer:
      "The Scandinavian-style BBQ hut is exclusive to the Rose Pod and can be added to your stay for an additional cost — get in touch to secure it for your dates.",
  },
  {
    question: "How do we book, and is there a booking fee?",
    answer:
      "Use “Check dates” to see live prices and availability and book directly through our secure booking system — there's no booking fee.",
  },
  {
    question: "Where exactly are you, and how far from Loch Lomond?",
    answer:
      "We're on Ballagan Farm in Gartocharn, inside Loch Lomond and The Trossachs — Scotland's first National Park. The loch shore, hill walks and Highland views are all within half an hour's drive.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export function FAQ() {
  return (
    <section id="faq" className="bg-oat-50 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Good to know"
          title="Frequently asked questions"
          align="center"
        />

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl divide-y divide-loch-900/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-loch-900 marker:content-none">
                {faq.question}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-lamp-600 transition-transform duration-200 group-open:rotate-45"
                >
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-loch-800/75">
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
