import apiClient from "../../../lib/api/client";
import {
  articles as mockArticles,
  blogHeroArticle,
  doctors as mockDoctors,
  partnerAds as mockAds,
} from "../data/landingMockData";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const DEFAULT_ARTICLE_IMAGE = "/images/carelink-blog-family.png";
const DEFAULT_DOCTOR_IMAGE = "/images/carelink-team-ceo.png";
const DEFAULT_AD_IMAGE = "/images/carelink-partner-clinic.png";

function apiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  return base.replace(/\/api\/?$/, "");
}

/** Resolve Laravel storage / relative media URLs for landing UI. */
export function resolveMediaUrl(path, fallback = "") {
  if (!path || typeof path !== "string") return fallback;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:") ||
    path.startsWith("/images/")
  ) {
    return path;
  }

  const origin = apiOrigin();
  if (path.startsWith("/storage/") || path.startsWith("/")) {
    return `${origin}${path}`;
  }
  return `${origin}/storage/${path}`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function slugify(value = "") {
  return (
    String(value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]/g, "")
      .slice(0, 80) || `item-${Date.now()}`
  );
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

function specialtyTagFrom(specialty = "") {
  if (specialty.includes("قلب")) return "القلب";
  if (specialty.includes("أطفال")) return "الأطفال";
  if (specialty.includes("عظم")) return "العظام";
  if (specialty.includes("جلد")) return "الجلدية";
  if (specialty.includes("نسا") || specialty.includes("توليد")) return "النساء";
  if (specialty.includes("عام") || specialty.includes("أسرة")) return "الطب العام";
  return specialty || "الطب العام";
}

function initialsFrom(name = "CL") {
  return name
    .replace(/^د\.\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("") || "CL";
}

export function mapApiArticle(raw = {}) {
  const rich =
    mockArticles.find(
      (item) =>
        item.slug === raw.slug ||
        item.id === raw.id ||
        item.title === raw.title
    ) || null;

  const title = raw.title || rich?.title || "مقال طبي";
  const slug = raw.slug || rich?.slug || slugify(title);

  return {
    id: raw.id ?? rich?.id ?? slug,
    slug,
    title,
    category: raw.category || rich?.category || "صحة عامة",
    author: raw.author || rich?.author || "فريق CareLink",
    excerpt: raw.excerpt || rich?.excerpt || "",
    status: raw.status || "published",
    date: formatDisplayDate(raw.date || raw.published_at || raw.created_at) || rich?.date || "",
    image: resolveMediaUrl(raw.image || raw.cover_image || raw.thumbnail, rich?.image || DEFAULT_ARTICLE_IMAGE),
    content:
      raw.content ||
      rich?.content || [
        {
          type: "p",
          text: raw.excerpt || "محتوى المقال قيد الإعداد.",
        },
      ],
    readTime: raw.read_time || rich?.readTime || "5 دقائق قراءة",
    initials: rich?.initials || initialsFrom(raw.author || "CL"),
    likes: raw.likes ?? rich?.likes ?? 0,
    comments: raw.comments ?? rich?.comments ?? 0,
    featured: Boolean(raw.featured ?? rich?.featured),
  };
}

export function mapApiAd(raw = {}, index = 0) {
  const fallback = mockAds[index % mockAds.length] || mockAds[0];
  return {
    id: raw.id ?? fallback.id ?? index,
    title: raw.title || fallback.title,
    description:
      raw.description ||
      raw.body ||
      fallback.description ||
      "عرض طبي من CareLink في الطب العام والقلب.",
    location: raw.location || fallback.location || "غزة",
    link: raw.link || raw.url || fallback.link || "/offers",
    image: resolveMediaUrl(raw.image || raw.image_url, fallback.image || DEFAULT_AD_IMAGE),
    date: formatDisplayDate(raw.date || raw.created_at) || "",
  };
}

export function mapApiDoctor(raw = {}, index = 0) {
  const profile = raw.doctor_profile || raw.profile || {};
  const specialty =
    profile.specialty || raw.specialty || "الطب العام";
  const mock = mockDoctors[index % mockDoctors.length];
  const status = profile.status || raw.status || "active";

  return {
    id: raw.id ?? mock?.id ?? index,
    name: raw.name || mock?.name || "طبيب CareLink",
    specialty,
    specialtyTag: specialtyTagFrom(specialty),
    rating: Number(profile.rating ?? raw.rating ?? mock?.rating ?? 4.8),
    reviews: Number(profile.reviews_count ?? raw.reviews ?? mock?.reviews ?? 0),
    fee: Number(profile.fee ?? raw.consultation_fee ?? raw.fee ?? mock?.fee ?? 150),
    duration: Number(profile.duration ?? raw.duration ?? mock?.duration ?? 30),
    image: resolveMediaUrl(
      profile.image ||
        profile.avatar ||
        raw.image ||
        raw.avatar ||
        raw.photo,
      mock?.image || DEFAULT_DOCTOR_IMAGE
    ),
    email: raw.email || "",
    phone: raw.phone || "",
    status,
  };
}

export function mapApiSettings(raw = {}) {
  const local = careSystemStore.getSiteSettings?.() || {};
  const source = raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data)
    ? raw.data
    : raw;

  const truthy = (value, fallback) => {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0") return false;
    return Boolean(value);
  };

  return {
    platformName: source.platformName || source.platform_name || local.platformName || "CareLink",
    supportPhone: source.supportPhone || source.support_phone || local.supportPhone || "",
    supportEmail: source.supportEmail || source.support_email || local.supportEmail || "",
    address: source.address || local.address || "",
    socialWeb: source.socialWeb || source.social_web || local.socialWeb || "/",
    socialWhatsapp:
      source.socialWhatsapp || source.social_whatsapp || local.socialWhatsapp || "",
    showBlog: truthy(source.showBlog ?? source.show_blog, local.showBlog !== false),
    showOffers: truthy(source.showOffers ?? source.show_offers, local.showOffers !== false),
    showDoctors: truthy(source.showDoctors ?? source.show_doctors, local.showDoctors !== false),
    showFaq: truthy(source.showFaq ?? source.show_faq, local.showFaq !== false),
  };
}

async function tryGet(paths) {
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await apiClient.get(path);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("API unavailable");
}

/**
 * Public landing content — uses the same admin CMS resources Nabil wired.
 * Falls back to designed mock/local data when the API is unreachable or unauthorized.
 */
export async function fetchLandingArticles() {
  try {
    const payload = await tryGet(["/admin/articles", "/articles"]);
    const list = unwrapList(payload)
      .map(mapApiArticle)
      .filter((item) => (item.status || "published") === "published");
    if (list.length) return list;
  } catch {
    /* fall through */
  }

  return mockArticles.map(mapApiArticle);
}

export async function fetchLandingArticleBySlug(slug) {
  if (!slug) return null;

  try {
    const payload = await tryGet([
      `/admin/articles/${slug}`,
      `/articles/${slug}`,
      "/admin/articles",
      "/articles",
    ]);

    if (payload?.data && !Array.isArray(payload.data) && payload.data.title) {
      return mapApiArticle(payload.data);
    }

    const list = unwrapList(payload).map(mapApiArticle);
    const found = list.find(
      (item) => item.slug === slug || String(item.id) === String(slug)
    );
    if (found) return found;
  } catch {
    /* fall through */
  }

  return (
    mockArticles.find((item) => item.slug === slug || String(item.id) === String(slug)) ||
    (blogHeroArticle.slug === slug ? blogHeroArticle : null)
  );
}

export async function fetchLandingAds() {
  try {
    const payload = await tryGet(["/admin/ads", "/ads"]);
    const list = unwrapList(payload).map(mapApiAd);
    if (list.length) return list;
  } catch {
    /* fall through */
  }

  return mockAds.map(mapApiAd);
}

export async function fetchLandingDoctors() {
  try {
    const payload = await tryGet(["/admin/doctors", "/doctors"]);
    const list = unwrapList(payload)
      .map(mapApiDoctor)
      .filter((doctor) => doctor.status === "active" || doctor.status === "approved");
    if (list.length) return list;
  } catch {
    /* fall through */
  }

  return mockDoctors.map((doctor, index) => mapApiDoctor(doctor, index));
}

export async function fetchLandingSettings() {
  try {
    const payload = await tryGet(["/admin/settings", "/settings"]);
    return mapApiSettings(payload);
  } catch {
    return mapApiSettings(careSystemStore.getSiteSettings());
  }
}

export function getBlogHeroFromArticles(articles = []) {
  // Keep the designed full-bleed hero; grid featured cards stay separate.
  return blogHeroArticle;
}
