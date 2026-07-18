import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FaqAccordion({ items, focusQuestion = null }) {
  const initialIndex = focusQuestion
    ? Math.max(
        0,
        items.findIndex((item) => item.question === focusQuestion)
      )
    : 0;
  const [openIndex, setOpenIndex] = useState(initialIndex);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`landing-faq-item ${isOpen ? "is-open" : ""}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-extrabold text-[#101860] sm:text-base">
                {item.question}
              </span>
              <span className="landing-faq-icon">
                <ChevronDown size={18} />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-slate-100/80 px-6 pb-5 pt-1 text-sm leading-8 text-slate-500">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
