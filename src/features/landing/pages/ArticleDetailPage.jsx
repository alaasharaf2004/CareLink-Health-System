import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Heart, MessageCircle } from "lucide-react";

import { getArticleBySlug } from "../data/landingMockData";

function ArticleDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

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

        <header className="mt-7">
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
          <h1 className="landing-article-page-title">{article.title}</h1>
          <p className="landing-article-page-lead">{article.excerpt}</p>

          <div className="landing-article-page-author">
            <div className="landing-article-avatar" aria-hidden="true">
              {article.initials}
            </div>
            <div>
              <p className="landing-article-author-name">{article.author}</p>
              <div className="landing-article-actions mt-1">
                <span>
                  <Heart size={15} strokeWidth={1.8} />
                  <em>{article.likes}</em>
                </span>
                <span>
                  <MessageCircle size={15} strokeWidth={1.8} />
                  <em>{article.comments}</em>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="landing-article-page-content">
          {(article.content || []).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/blog" className="landing-btn-secondary">
            <ArrowRight size={16} />
            تصفح المزيد من المقالات
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArticleDetailPage;
