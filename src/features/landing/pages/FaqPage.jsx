import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Mail, Phone, Search, X } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import FaqAccordion from "../components/FaqAccordion";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";
import { faqCategories, faqs } from "../data/landingMockData";

const quickHints = [
  { label: "الحجز", query: "حجز", category: "الحجز والمواعيد" },
  { label: "الحساب", query: "حساب", category: "الحساب والملف الطبي" },
  { label: "الخصوصية", query: "خصوصية", category: "الخصوصية والأمان" },
  { label: "الدفع", query: "دفع", category: "الدفع والفواتير" },
];

function normalizeArabic(value = "") {
  return value
    .toLowerCase()
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesFaqSearch(item, normalizedQuery) {
  if (!normalizedQuery) return true;
  const haystack = normalizeArabic(`${item.question} ${item.answer} ${item.category}`);
  return (
    haystack.includes(normalizedQuery) ||
    normalizedQuery.split(" ").every((part) => part && haystack.includes(part))
  );
}

function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]);
  const [pulseTarget, setPulseTarget] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedQuestion, setFocusedQuestion] = useState(null);
  const searchWrapRef = useRef(null);
  const resultsRef = useRef(null);

  const normalizedQuery = useMemo(() => normalizeArabic(query), [query]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesQuery = matchesFaqSearch(item, normalizedQuery);
      if (normalizedQuery) return matchesQuery;
      return item.category === activeCategory;
    });
  }, [activeCategory, normalizedQuery]);

  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return faqs.filter((item) => matchesFaqSearch(item, normalizedQuery)).slice(0, 6);
  }, [normalizedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerPulse = (target) => {
    setPulseTarget(target);
    window.setTimeout(() => setPulseTarget(null), 550);
  };

  const scrollToResults = () => {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setFocusedQuestion(null);
    setShowSuggestions(Boolean(value.trim()));
  };

  const handleSelectFaq = (item) => {
    setQuery(item.question);
    setActiveCategory(item.category);
    setFocusedQuestion(item.question);
    setShowSuggestions(false);
    scrollToResults();
  };

  const handleHint = (hint) => {
    setQuery(hint.query);
    setActiveCategory(hint.category);
    setFocusedQuestion(null);
    setShowSuggestions(true);
    scrollToResults();
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    setQuery("");
    setFocusedQuestion(null);
    setShowSuggestions(false);
    scrollToResults();
  };

  const clearSearch = () => {
    setQuery("");
    setFocusedQuestion(null);
    setShowSuggestions(false);
  };

  return (
    <>
      <section className="landing-faq-hero">
        <div className="landing-faq-hero-bg" aria-hidden="true">
          <span className="landing-faq-hero-orb landing-faq-hero-orb--one" />
          <span className="landing-faq-hero-orb landing-faq-hero-orb--two" />
          <span className="landing-faq-hero-orb landing-faq-hero-orb--three" />
          <MedicalBackdropIcons tone="light" />
          <svg
            className="landing-faq-hero-ecg"
            viewBox="0 0 900 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 H140 L158 40 L176 12 L198 68 L220 40 H380 L398 40 L416 16 L438 64 L460 40 H900"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-14 text-center lg:px-8 lg:py-16">
          <div className="landing-faq-hero-copy">
            <p className="landing-eyebrow mx-auto justify-center text-[#40c0a0]">
              مركز المساعدة
            </p>
            <h1 className="landing-section-title mt-3">كيف يمكننا مساعدتك؟</h1>
            <p className="landing-section-desc mx-auto mt-3">
              ابحث عن إجابة سريعة، أو تواصل مباشرة مع فريق الدعم.
            </p>
          </div>

          <div className="landing-faq-search-panel">
            <div className="landing-faq-search" ref={searchWrapRef}>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onFocus={() => setShowSuggestions(Boolean(query.trim()))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setShowSuggestions(false);
                    scrollToResults();
                  }
                  if (event.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="ابحث في الأسئلة الشائعة..."
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
              />
              {query && (
                <button
                  type="button"
                  className="landing-faq-search-clear"
                  onClick={clearSearch}
                  aria-label="مسح البحث"
                >
                  <X size={16} />
                </button>
              )}

              {showSuggestions && normalizedQuery && (
                <div className="landing-faq-suggestions" role="listbox">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <button
                        key={item.question}
                        type="button"
                        role="option"
                        className="landing-faq-suggestion"
                        onClick={() => handleSelectFaq(item)}
                      >
                        <span>
                          <strong>{item.question}</strong>
                          <em>{item.category}</em>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="landing-faq-suggestions-empty">
                      لا توجد أسئلة مطابقة لـ «{query}»
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="landing-faq-quick-hints">
              {quickHints.map((hint) => (
                <button
                  key={hint.label}
                  type="button"
                  className={
                    normalizeArabic(query).includes(normalizeArabic(hint.query))
                      ? "is-active"
                      : ""
                  }
                  onClick={() => handleHint(hint)}
                >
                  {hint.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[0.32fr_0.68fr] lg:px-8">
        <aside className="space-y-3">
          {faqCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategory(item)}
              className={`landing-chip w-full text-right ${
                !normalizedQuery && activeCategory === item ? "is-active" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <div ref={resultsRef}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-500">
              {normalizedQuery
                ? `${filteredFaqs.length} نتيجة مطابقة لبحثك`
                : `أسئلة قسم ${activeCategory}`}
            </p>
            {normalizedQuery && (
              <button
                type="button"
                className="text-sm font-extrabold text-[#101860]"
                onClick={clearSearch}
              >
                مسح البحث
              </button>
            )}
          </div>

          {filteredFaqs.length > 0 ? (
            <FaqAccordion
              key={`${activeCategory}-${query}-${focusedQuestion || "list"}`}
              items={filteredFaqs}
              focusQuestion={focusedQuestion}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-bold text-slate-500">
              لم نجد إجابة مطابقة لبحثك.
              <div className="mt-4">
                <button
                  type="button"
                  className="landing-btn-secondary"
                  onClick={clearSearch}
                >
                  إعادة ضبط البحث
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-6xl px-5 lg:px-8">
        <div className="landing-cta landing-faq-support overflow-hidden p-0 md:grid md:grid-cols-2">
          <div className="landing-faq-support-bg" aria-hidden="true">
            <span className="landing-faq-pulse landing-faq-pulse--one" />
            <span className="landing-faq-pulse landing-faq-pulse--two" />
            <span className="landing-faq-pulse landing-faq-pulse--three" />
            <MedicalBackdropIcons tone="dark" />
            <svg
              className="landing-faq-ecg"
              viewBox="0 0 600 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 40 H80 L95 40 L110 12 L130 68 L150 40 H220 L235 40 L250 18 L270 62 L290 40 H600"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="relative z-10 p-8 sm:p-10">
            <div className="landing-cta-glow" aria-hidden="true" />
            <div className="landing-faq-support-icon">
              <Headphones size={28} />
            </div>
            <h2 className="relative mt-5 text-2xl font-black">لم تجد إجابتك؟</h2>
            <p className="relative mt-3 text-sm leading-8 text-blue-100/85">
              فريقنا جاهز لمساعدتك في الحجز، الحساب، أو استخدام المنصة.
            </p>
            <div className="relative mt-6 space-y-3 text-sm">
              <a
                href="tel:+970591234567"
                className={`landing-faq-contact ${pulseTarget === "phone" ? "is-pulsing" : ""}`}
                onClick={() => triggerPulse("phone")}
              >
                <span className="landing-faq-contact-icon" aria-hidden="true">
                  <Phone size={15} />
                </span>
                <span>الدعم:</span>
                <span dir="ltr">+970 59 123 4567</span>
              </a>
              <a
                href="mailto:support@carelink.com"
                className={`landing-faq-contact ${pulseTarget === "email" ? "is-pulsing" : ""}`}
                onClick={() => triggerPulse("email")}
              >
                <span className="landing-faq-contact-icon" aria-hidden="true">
                  <Mail size={15} />
                </span>
                <span>البريد:</span>
                <span dir="ltr">support@carelink.com</span>
              </a>
            </div>
          </div>

          <form
            className="landing-faq-support-form relative z-10 m-5 rounded-2xl bg-white p-6 text-slate-700"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="text-xs font-bold text-slate-600">اسمك</label>
            <input
              className="landing-faq-input mt-1.5 h-10 w-full rounded-lg bg-slate-100 px-3 text-sm outline-none"
              placeholder="الاسم الكامل"
            />
            <label className="mt-3 block text-xs font-bold text-slate-600">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="landing-faq-input mt-1.5 h-10 w-full rounded-lg bg-slate-100 px-3 text-sm outline-none"
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
