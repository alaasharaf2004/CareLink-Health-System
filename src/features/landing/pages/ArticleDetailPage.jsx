import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { fetchLandingArticleBySlug } from "../data/cmsContent";

function ArticleContentBlock({ block, index }) {
  if (typeof block === "string") {
    return <p key={`p-${index}`}>{block}</p>;
  }

  if (block.type === "h2") {
    return <h2 key={`h2-${index}`}>{block.text}</h2>;
  }

  if (block.type === "tips") {
    return (
      <div key={`tips-${index}`} className="landing-article-tips">
        {block.title && <h3>{block.title}</h3>}
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <aside key={`callout-${index}`} className="landing-article-callout">
        <Sparkles size={18} aria-hidden="true" />
        <p>{block.text}</p>
      </aside>
    );
  }

  return <p key={`p-${index}`}>{block.text}</p>;
}

function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setStatus("loading");
      const next = await fetchLandingArticleBySlug(slug);
      if (!active) return;
      setArticle(next);
      setStatus(next ? "ready" : "missing");
    };
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center text-sm font-bold text-slate-500">
        جاري تحميل المقال...
      </div>
    );
  }

  if (status === "missing" || !article) {
    return <Navigate to="/blog" replace />;
  }

  const contentBlocks = Array.isArray(article.content)
    ? article.content
    : typeof article.content === "string"
      ? [{ type: "p", text: article.content }]
      : [{ type: "p", text: article.excerpt || "محتوى المقال قيد الإعداد." }];

  return (
    <article className="landing-article-page">
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
        <Link to="/blog" className="landing-article-back">
          <ArrowRight size={16} />
          العودة إلى المدونة
        </Link>

        <div className="landing-article-page-hero">
          <img src={article.image} alt="" />
          <span className="landing-article-tag">{article.category}</span>
        </div>

        <header className="mt-7 landing-article-page-header">
          <div className="landing-article-page-meta">
            <span>
              <CalendarDays size={15} />
              {article.date}
            </span>
            <span>
              <Clock3 size={15} />
              {article.readTime}
            </span>
          </div>
          <h1>{article.title}</h1>
          <div className="landing-article-page-author">
            <div className="landing-article-avatar" aria-hidden="true">
              {article.initials}
            </div>
            <div>
              <p className="landing-article-author-name">{article.author}</p>
              <p className="landing-article-meta">كاتب المقال</p>
            </div>
          </div>
        </header>

        <div className="landing-article-page-content">
          {contentBlocks.map((block, index) => (
            <ArticleContentBlock key={index} block={block} index={index} />
          ))}
        </div>

        <footer className="landing-article-page-footer">
          <div className="landing-article-actions">
            <span>
              <Heart size={16} />
              {article.likes ?? 0}
            </span>
            <span>
              <MessageCircle size={16} />
              {article.comments ?? 0}
            </span>
          </div>
          <Link to="/doctors" className="landing-btn-primary">
            احجز استشارة
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default ArticleDetailPage;
