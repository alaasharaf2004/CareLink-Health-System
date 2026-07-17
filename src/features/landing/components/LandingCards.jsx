import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  MessageCircle,
  Star,
} from "lucide-react";

export function SectionHeading({ eyebrow, title, description, action, centered = false }) {
  return (
    <div
      className={`landing-section-head mb-12 ${centered ? "landing-section-head--center text-center" : ""}`}
    >
      {eyebrow && <p className="landing-eyebrow">{eyebrow}</p>}
      <h2 className="landing-section-title">{title}</h2>
      {description && (
        <p className={`landing-section-desc ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
      {action && (
        <Link to={action.to} className="landing-link-action mt-4 inline-flex">
          {action.label}
          <ArrowLeft size={16} />
        </Link>
      )}
    </div>
  );
}

export function DoctorCard({ doctor, index = 0 }) {
  return (
    <article
      className="landing-card landing-card--doctor group"
      style={{ "--stagger": `${index * 90}ms` }}
    >
      <div className="landing-card-doctor-top">
        <div className="landing-card-doctor-avatar">
          <img src={doctor.image} alt="" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#101860]">{doctor.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{doctor.specialty}</p>
            </div>
            <span className="landing-rating">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {doctor.rating}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["09:00", "11:30", "14:00"].map((slot) => (
              <span key={slot} className="landing-time-chip">
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-4 text-xs text-slate-500">
        <span>{doctor.reviews} تقييم</span>
        <span className="font-extrabold text-[#101860]">{doctor.fee} ر.س</span>
      </div>
      <Link to="/login" className="landing-btn-primary mt-4 w-full justify-center py-3 text-sm">
        <CalendarDays size={16} />
        احجز موعداً
      </Link>
    </article>
  );
}

export function ArticleCard({ article, index = 0 }) {
  const initials =
    article.initials ||
    article.author
      .replace(/^د\.\s*/, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("");

  return (
    <article
      className="landing-article-card group"
      style={{ "--stagger": `${index * 100}ms` }}
    >
      <div className="landing-article-media">
        <img
          src={article.image}
          alt=""
          className="landing-article-image"
          loading="lazy"
        />
        <span className="landing-article-tag">{article.category}</span>
      </div>

      <div className="landing-article-body">
        <h3 className="landing-article-title">{article.title}</h3>
        <p className="landing-article-excerpt">{article.excerpt}</p>

        <div className="landing-article-footer">
          <div className="landing-article-author">
            <div className="landing-article-avatar" aria-hidden="true">
              {initials}
            </div>
            <div>
              <p className="landing-article-author-name">{article.author}</p>
              <p className="landing-article-meta">
                {article.readTime}
              </p>
            </div>
          </div>

          <div className="landing-article-actions">
            <span>
              <Heart size={15} strokeWidth={1.8} />
              {article.likes != null && <em>{article.likes}</em>}
            </span>
            <span>
              <MessageCircle size={15} strokeWidth={1.8} />
              {article.comments != null && <em>{article.comments}</em>}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
