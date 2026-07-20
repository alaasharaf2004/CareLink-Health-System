import { careSystemStore } from "../../care-system/data/careSystemStore";
import {
  articles as richArticles,
  blogHeroArticle,
  getArticleBySlug as getRichArticleBySlug,
} from "./landingMockData";
import {
  fetchLandingAds,
  fetchLandingArticleBySlug,
  fetchLandingArticles,
  fetchLandingDoctors,
  fetchLandingSettings,
  getBlogHeroFromArticles,
  mapApiAd,
  mapApiArticle,
} from "../services/landingApi";

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

  return mapApiArticle({
    ...rich,
    ...storeArticle,
    date: formatDisplayDate(storeArticle.date) || rich?.date || storeArticle.date,
    image: storeArticle.image || rich?.image,
    content: storeArticle.content || rich?.content,
  });
}

/** Sync fallback used before API resolves (local store / mock). */
export function listPublishedArticles() {
  const fromStore = careSystemStore
    .listArticles()
    .filter((article) => (article.status || "published") === "published")
    .map(enrichArticle);

  if (fromStore.length) return fromStore;
  return richArticles.map((article) => mapApiArticle(article));
}

export function getCmsArticleBySlug(slug) {
  if (!slug) return null;
  if (blogHeroArticle.slug === slug || String(blogHeroArticle.id) === String(slug)) {
    return blogHeroArticle;
  }

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
  return blogHeroArticle;
}

export function listCmsAds() {
  const storeAds = careSystemStore.listAds();
  if (storeAds.length) return storeAds.map(mapApiAd);
  return [];
}

export function getCmsSiteSettings() {
  return careSystemStore.getSiteSettings();
}

/** Async API-backed loaders (Nabil admin CMS → public landing). */
export {
  fetchLandingAds,
  fetchLandingArticleBySlug,
  fetchLandingArticles,
  fetchLandingDoctors,
  fetchLandingSettings,
  getBlogHeroFromArticles,
};
