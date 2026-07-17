import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import { ArticleCard, SectionHeading } from "../components/LandingCards";
import { articles } from "../data/landingMockData";

const categories = [
  "الكل",
  "تغذية صحية",
  "صحة نفسية",
  "أخبار طبية",
  "صحة الأسرة",
  "اللياقة",
  "تقنية طبية",
];

function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const matchesCategory =
          category === "الكل" || article.category === category;
        const matchesQuery =
          !query.trim() ||
          `${article.title} ${article.excerpt}`
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, query]
  );

  return (
    <>
      <section className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-blog-hero">
          <div className="landing-blog-hero-content">
            <span className="landing-blog-hero-badge">
              <BookOpen size={14} />
              مدونة CareLink الطبية
            </span>
            <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              مستقبل الرعاية الصحية الرقمية
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-8 text-blue-100/90 lg:text-base">
              محتوى طبي مبسط وموثوق يساعدك على فهم صحتك واتخاذ قرارات أفضل.
            </p>
            <button type="button" className="landing-btn-secondary mt-8 border-white/25 bg-white">
              اقرأ المقال المميز
              <ArrowLeft size={16} />
            </button>
          </div>

          <div className="landing-blog-hero-media">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=900&fit=crop"
              alt="رعاية صحية رقمية"
              className="h-full w-full object-cover"
            />
            <div className="landing-blog-hero-media-shade" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6 lg:px-8">
        <div className="landing-filter-bar">
          <div className="relative">
            <Search
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في المقالات..."
              className="h-11 w-full rounded-full bg-[#faf9f7] pr-11 pl-4 text-sm outline-none focus:ring-4 focus:ring-[#101860]/8"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`landing-chip ${item === category ? "is-active" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <SectionHeading
          title="أحدث المقالات والنصائح"
          description="إجابات ومعلومات عملية من مختصين في الصحة والرعاية."
        />
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-bold text-slate-500">
            لا توجد مقالات مطابقة.
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-cta text-center sm:text-right">
          <div className="landing-cta-glow" aria-hidden="true" />
          <div className="relative flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black">اشترك في نشرتنا الطبية</h2>
              <p className="mt-2 text-sm text-blue-100/85">
                نصائح موثوقة ومحتوى جديد يصل إلى بريدك.
              </p>
            </div>
            <form
              className="flex w-full max-w-md overflow-hidden rounded-full bg-white"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="min-w-0 flex-1 px-5 py-3 text-sm text-slate-700 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-l from-[#101860] to-[#40c0a0] px-5 text-sm font-extrabold text-white"
              >
                اشترك
              </button>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

export default BlogPage;
