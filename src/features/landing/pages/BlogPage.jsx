import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import { ArticleCard } from "../components/LandingCards";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";
import {
  getBlogHeroArticle,
  listPublishedArticles,
} from "../data/cmsContent";

const categories = ["الكل", "تغذية", "صحة نفسية", "صحة عامة", "أخبار", "تكنولوجيا"];

function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [articles, setArticles] = useState(() => listPublishedArticles());
  const [blogHeroArticle, setBlogHeroArticle] = useState(() => getBlogHeroArticle());

  useEffect(() => {
    const reload = () => {
      setArticles(listPublishedArticles());
      setBlogHeroArticle(getBlogHeroArticle());
    };
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

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
    [articles, category, query]
  );

  const orderedArticles = useMemo(() => {
    const featured = filteredArticles.find((article) => article.featured);
    if (!featured) return filteredArticles;
    return [
      featured,
      ...filteredArticles.filter((article) => article.id !== featured.id),
    ];
  }, [filteredArticles]);

  return (
    <>
      <section className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-blog-hero">
          <img
            src={blogHeroArticle.image}
            alt=""
            className="landing-blog-hero-bg-image"
          />
          <div className="landing-blog-hero-shade" aria-hidden="true" />

          <div className="landing-blog-hero-content">
            <span className="landing-blog-hero-badge">{blogHeroArticle.category}</span>
            <h1>{blogHeroArticle.title}</h1>
            <p>{blogHeroArticle.excerpt}</p>
            <Link
              to={`/blog/${blogHeroArticle.slug}`}
              className="landing-blog-hero-cta"
            >
              اقرأ المزيد
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-blog-feed">
        <div className="landing-blog-feed-bg" aria-hidden="true">
          <MedicalBackdropIcons tone="light" />
          <svg
            className="landing-blog-feed-ecg"
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

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="landing-blog-toolbar">
            <div className="landing-blog-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن مقال طبي، نصيحة غذائية..."
              />
            </div>
            <div className="landing-blog-chips">
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

          {orderedArticles.length > 0 ? (
            <div className="landing-blog-grid" key={`${category}-${query}`}>
              {orderedArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-bold text-slate-500">
              لا توجد مقالات مطابقة.
            </div>
          )}
        </div>
      </section>

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
