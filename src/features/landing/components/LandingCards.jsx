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
  return (
    <article
      className="landing-card landing-card--article group overflow-hidden"
      style={{ "--stagger": `${index * 100}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={article.image}
          alt=""
          className="landing-card-image h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101860]/50 via-transparent to-transparent opacity-80" />
        <span className="absolute right-4 top-4 landing-tag">{article.category}</span>
      </div>
      <div className="p-6">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-8 text-[#101860]">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-500">
          {article.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-[#101860] text-xs font-bold text-white">
              {article.author.charAt(2)}
            </div>
            <div>
              <p className="text-xs font-bold text-[#101860]">{article.author}</p>
              <p className="text-[11px] text-slate-400">{article.readTime}</p>
            </div>
          </div>
          <div className="flex gap-3 text-slate-400">
            <Heart size={14} />
            <MessageCircle size={14} />
          </div>
        </div>
      </div>
    </article>
  );
}
