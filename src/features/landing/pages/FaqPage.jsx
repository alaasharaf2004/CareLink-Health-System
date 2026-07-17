import { useMemo, useState } from "react";
import { Headphones, Mail, Search } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import FaqAccordion from "../components/FaqAccordion";
import { faqCategories, faqs } from "../data/landingMockData";

function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]);

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return faqs.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesQuery =
        !normalized ||
        `${item.question} ${item.answer}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <>
      <section className="landing-section landing-section--white border-b border-slate-100/80">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="landing-eyebrow justify-center">مركز المساعدة</p>
          <h1 className="landing-section-title">كيف يمكننا مساعدتك؟</h1>
          <p className="landing-section-desc mx-auto">
            ابحث عن إجابة سريعة، أو تواصل مباشرة مع فريق الدعم.
          </p>
          <div className="landing-filter-bar relative mx-auto mt-8 max-w-2xl">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في الأسئلة الشائعة..."
              className="h-12 w-full rounded-full border border-slate-200/80 bg-white pr-12 pl-4 text-sm outline-none focus:border-[#101860]/30 focus:ring-4 focus:ring-[#101860]/8"
            />
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[0.32fr_0.68fr] lg:px-8">
        <aside className="space-y-3">
          {faqCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveCategory(item)}
              className={`landing-chip w-full text-right ${
                activeCategory === item ? "is-active" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </aside>
        <div>
          {filteredFaqs.length > 0 ? (
            <FaqAccordion
              key={`${activeCategory}-${query}`}
              items={filteredFaqs}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-bold text-slate-500">
              لم نجد إجابة مطابقة لبحثك في هذا القسم.
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-6xl px-5 lg:px-8">
        <div className="landing-cta overflow-hidden p-0 md:grid md:grid-cols-2">
          <div className="relative p-8 sm:p-10">
            <div className="landing-cta-glow" aria-hidden="true" />
            <Headphones size={34} className="relative text-blue-200" />
            <h2 className="relative mt-5 text-2xl font-black">لم تجد إجابتك؟</h2>
            <p className="relative mt-3 text-sm leading-8 text-blue-100/85">
              فريقنا جاهز لمساعدتك في الحجز، الحساب، أو استخدام المنصة.
            </p>
            <div className="relative mt-6 space-y-3 text-sm">
              <p className="flex flex-wrap items-center gap-2">
                <span>الدعم:</span>
                <span dir="ltr">+970 59 123 4567</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span>البريد:</span>
                <span dir="ltr">support@carelink.com</span>
              </p>
            </div>
          </div>
          <form
            className="m-5 rounded-2xl bg-white p-6 text-slate-700"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="text-xs font-bold text-slate-600">اسمك</label>
            <input
              className="mt-1.5 h-10 w-full rounded-lg bg-slate-100 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="الاسم الكامل"
            />
            <label className="mt-3 block text-xs font-bold text-slate-600">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="mt-1.5 h-10 w-full rounded-lg bg-slate-100 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="name@example.com"
            />
            <button
              type="submit"
              className="landing-btn-primary mt-4 w-full justify-center py-3"
            >
              <Mail size={15} />
              أرسل استفسارك
            </button>
          </form>
        </div>
      </AnimatedSection>
    </>
  );
}

export default FaqPage;
