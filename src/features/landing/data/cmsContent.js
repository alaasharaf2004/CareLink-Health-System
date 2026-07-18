import { careSystemStore } from "../../care-system/data/careSystemStore";
import {
  articles as richArticles,
  blogHeroArticle,
  getArticleBySlug as getRichArticleBySlug,
} from "./landingMockData";

function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function enrichArticle(storeArticle) {
  const rich =
    richArticles.find((item) => item.slug === storeArticle.slug) ||
    (blogHeroArticle.slug === storeArticle.slug ? blogHeroArticle : null);

  return {
    ...rich,
    ...storeArticle,
    date: formatDisplayDate(storeArticle.date) || rich?.date || storeArticle.date,
    excerpt: storeArticle.excerpt || rich?.excerpt || "",
    image: storeArticle.image || rich?.image || "/images/carelink-blog-family.png",
    content:
      storeArticle.content ||
      rich?.content || [
        {
          type: "p",
          text: storeArticle.excerpt || "محتوى المقال قيد الإعداد.",
        },
      ],
    readTime: rich?.readTime || "5 دقائق قراءة",
    initials: rich?.initials || (storeArticle.author || "CL").slice(0, 2),
    likes: rich?.likes ?? 0,
    comments: rich?.comments ?? 0,
    featured: Boolean(rich?.featured) || storeArticle.id === 1,
  };
}

export function listPublishedArticles() {
  return careSystemStore
    .listArticles()
    .filter((article) => (article.status || "published") === "published")
    .map(enrichArticle);
}

export function getCmsArticleBySlug(slug) {
  if (!slug) return null;

  const fromStore = careSystemStore
    .listArticles()
    .find(
      (article) =>
        article.slug === slug || String(article.id) === String(slug)
    );

  if (fromStore && (fromStore.status || "published") === "published") {
    return enrichArticle(fromStore);
  }

  return getRichArticleBySlug(slug);
}

export function getBlogHeroArticle() {
  const published = listPublishedArticles();
  const featured = published.find((article) => article.featured);
  return featured || published[0] || blogHeroArticle;
}

export function listCmsAds() {
  return careSystemStore.listAds();
}

export function getCmsSiteSettings() {
  return careSystemStore.getSiteSettings();
}
