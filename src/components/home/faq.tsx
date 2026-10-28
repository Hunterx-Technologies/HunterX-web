import { FAQS } from "@/data/home";
import { Section } from "@/components/ui/section";
import { Accordion } from "./accordion";

export function Faq() {
  return (
    <Section id="faq" number={4} eyebrow="FAQ" title="Questions, answered">
      <div className="max-w-3xl" data-reveal>
        <Accordion items={FAQS} />
      </div>
    </Section>
  );
}
