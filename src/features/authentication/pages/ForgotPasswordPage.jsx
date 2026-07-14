import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Send, Stethoscope, User } from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import {
  AUTH_CLICKABLE,
  AUTH_FORM_CARD_CLASS,
  AUTH_HERO_ALIGN,
} from "../constants/authForm";
import {
  savePasswordResetDraft,
} from "../constants/authPasswordReset";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";
import { getSubmitButtonClass, isValidEmail } from "../utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function ForgotPasswordPage() {
  return <h1>Forgot Password Page</h1>;
}

export default ForgotPasswordPage;
