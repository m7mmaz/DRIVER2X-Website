import type { Localized } from "@/lib/i18n";
import type { FeatureStatus } from "./types";

/**
 * Every UI-chrome string in the app (not content-model data -- see
 * features.ts/installGuide.ts for those). Centralized here so no Arabic
 * string is ever hand-typed inline in a component.
 */
export const STRINGS = {
  // 2026-09-06: the wordmark must NEVER translate -- "DRIVER2X" stays
  // exactly "DRIVER2X" in Arabic too (not transliterated, not reversed).
  // Both language values are deliberately identical; kept as a Localized<>
  // entry (rather than moved to config/site.ts) only so every existing
  // pick(STRINGS.siteName, lang) call site keeps working unchanged.
  siteName: { en: "DRIVER2X", ar: "DRIVER2X" },
  tagline: { en: "Dynamic Driver 2 Sandbox", ar: "ساندبوكس درايفر 2 الديناميكي" },
  heroDescription: {
    en: "A modern PC rebuild and sandbox expansion for Driver 2.",
    ar: "إعادة بناء حديثة للعبة Driver 2 على الكمبيوتر مع توسعة Sandbox ديناميكية.",
  },
  refOnline: { en: "Status: Online", ar: "الحالة: متصل" },
  refLabel: { en: "Ref: DRIVER2X", ar: "المرجع: DRIVER2X" },

  downloadCta: { en: "Download for Windows", ar: "تحميل لويندوز" },
  downloadCtaCompact: { en: "Download", ar: "تحميل" },
  windowsPc: { en: "Windows PC", ar: "كمبيوتر ويندوز" },
  subscriptionNotice: {
    en: "Paid subscription available for added features.",
    ar: "يتوفر اشتراك مدفوع للمميزات المضافة.",
  },

  moreInformation: { en: "More Information", ar: "لمزيد من المعلومات" },
  moreInformationHint: { en: "Enter · Tap to continue", ar: "Enter · اضغط للمتابعة" },

  // Single canonical "return to APP/FEATURES/ABOUT menu" label -- used for
  // BOTH the persistent header button (2026-09-06 UX pass, section 4) and
  // FeStepNav's first-item Back-button relabel (section 14). Previously
  // there were two near-duplicate strings ("Main Menu" here and a separate
  // "Back to Menu") -- consolidated to exactly one, matching the user's own
  // explicit required wording ("MAIN MENU" / "القائمة الرئيسية") everywhere.
  mainMenuLabel: { en: "Main Menu", ar: "القائمة الرئيسية" },
  finish: { en: "Finish", ar: "إنهاء" },
  selectHint: { en: "↑ ↓ Select · Enter Confirm", ar: "↑ ↓ تحديد · Enter تأكيد" },
  tapHint: { en: "Tap to select", ar: "اضغط للاختيار" },
  backHint: { en: "Back · Esc", ar: "رجوع · Esc" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  // Keyboard hint on paginated screens (APP/FEATURES). Forced dir="ltr"
  // wherever rendered (see FeStepNav) -- the physical Left/Right arrow keys
  // always mean previous/next regardless of language (2026-09-06 spec), so
  // the hint's glyph order must never bidi-flip the way a naive two-run
  // string like "02 / 09" did before that fix.
  arrowKeyHint: { en: "← → Arrow Keys", ar: "← → مفاتيح الأسهم" },

  select: { en: "Select", ar: "تحديد" },
  statusLabel: { en: "Status", ar: "الحالة" },
  sourceLabel: { en: "Source", ar: "المصدر" },
  systemNotes: { en: "System Notes", ar: "ملاحظات النظام" },
  important: { en: "Important", ar: "تنبيه هام" },

  // "M7MMAZ" itself is rendered separately as a red, clickable TikTok link
  // (2026-09-07 user request) -- this is just the text before it, em-dash
  // included, same in both languages' punctuation.
  footerRightsPrefix: { en: "All Rights Reserved —", ar: "جميع الحقوق محفوظة —" },
  footerNonCommercial: {
    en: "Non-commercial fan project · Built on REDRIVER2",
    ar: "مشروع غير ربحي من المعجبين · مبني على REDRIVER2",
  },

  tiktokPanelLabel: { en: "DRIVER2X // Field Updates", ar: "DRIVER2X // تحديثات ميدانية" },
  tiktokFollow: {
    en: "For more updates, follow me on TikTok",
    ar: "للمزيد من التحديثات تابعني على تيك توك",
  },
  tiktokButton: { en: "TikTok", ar: "تيك توك" },

  languageSwitcher: { en: "العربية", ar: "English" },

  // Screen headers/intros previously hand-ternaried inline -- centralized
  // here so no component ever writes `lang === "ar" ? ... : ...` itself.
  appGuideTitle: { en: "Field Manual", ar: "الدليل الميداني" },
  appGuideIntro: { en: "From nothing to playing, in order.", ar: "من الصفر إلى اللعب، بالترتيب." },
  featuresArchiveTitle: { en: "System Archive", ar: "أرشيف الأنظمة" },
  featuresArchiveIntro: {
    en: "Every system DRIVER2X adds to Driver 2, as it actually stands today.",
    ar: "كل نظام يضيفه DRIVER2X إلى Driver 2، كما هو فعليًا اليوم.",
  },
  aboutDescription: {
    en: "DRIVER2X is a PC rebuild and dynamic sandbox expansion of Driver 2, built on the REDRIVER2 reverse-engineering project. It runs alongside your own original Driver 2 disc data — DRIVER2X does not include or distribute the original game.",
    ar: "DRIVER2X هي إعادة بناء للعبة Driver 2 على الكمبيوتر مع توسعة Sandbox ديناميكية، مبنية على مشروع REDRIVER2 لإعادة الهندسة. تعمل جنبًا إلى جنب مع أقراص Driver 2 الأصلية الخاصة بك — لا يتضمن DRIVER2X أو يوزّع اللعبة الأصلية.",
  },
  engineLabel: { en: "Engine", ar: "المحرك" },
  appLabel: { en: "App", ar: "التطبيق" },

  notFoundTitle: { en: "Signal lost", ar: "انقطعت الإشارة" },
  notFoundBody: {
    en: "The requested route could not be found.",
    ar: "تعذر العثور على الصفحة المطلوبة.",
  },
  errorTitle: { en: "Signal interrupted", ar: "انقطعت الإشارة" },
  errorBody: {
    en: "Something went wrong on our end. Reconnect to the frontend or retry the signal.",
    ar: "حدث خطأ ما من جانبنا. أعد الاتصال بالواجهة أو أعد المحاولة.",
  },
  retrySignal: { en: "Retry signal", ar: "إعادة المحاولة" },
  returnToFrontend: { en: "Return to frontend", ar: "العودة للواجهة" },

  imageSlotLabel: { en: "Image Slot", ar: "موضع صورة" },
  imageSlotPending: { en: "screenshot pending", ar: "لقطة الشاشة قيد الانتظار" },

  // 2026-09-10: small, subtle footer entry point into the separate
  // password-gated /vault route (see src/routes/vault.tsx). Deliberately
  // not the Download CTA -- this link only navigates, it never downloads
  // anything itself.
  vaultEntryLabel: { en: "Private Access", ar: "وصول خاص" },
  vaultPasswordLabel: { en: "Password", ar: "كلمة المرور" },
  vaultEnter: { en: "Enter", ar: "دخول" },
  vaultIncorrect: { en: "Incorrect Password", ar: "كلمة المرور غير صحيحة" },
  vaultLocked: { en: "Access Locked", ar: "تم قفل الوصول" },
  vaultDownload: { en: "Download", ar: "تحميل" },
  vaultConfigLoading: { en: "Loading Configuration", ar: "جارٍ تحميل الإعداد" },
  vaultConfigError: { en: "Configuration Unavailable", ar: "الإعداد غير متاح" },
  // 2026-09-11 legal/external-link notice, wording as explicitly specified
  // by the user -- factual only, no immunity/endorsement/legality claims.
  // Verbatim, do not reword.
  vaultLegalNotice: {
    en: "External links lead to third-party websites. DRIVER2X does not host, upload, modify, or control files provided by third parties. Third-party content and downloads are subject to their respective providers and rights holders.",
    ar: "الروابط الخارجية تؤدي إلى مواقع تابعة لأطراف أخرى. لا يقوم DRIVER2X باستضافة أو رفع أو تعديل أو التحكم في الملفات التي توفرها الجهات الخارجية. تخضع محتويات وتنزيلات الأطراف الأخرى للجهات التي توفرها ولأصحاب الحقوق المعنيين.",
  },
  // 2026-09-11 copyright/link-removal notice, wording as explicitly
  // specified by the user. Only vaultLinkRemovalRequest is rendered as the
  // clickable phrase -- this paragraph itself stays plain text.
  vaultCopyrightNotice: {
    en: "Copyright or link removal request? If you are a rights holder or authorized representative and believe an external link should be removed, please contact us.",
    ar: "هل لديك مطالبة بحقوق النشر أو طلب إزالة رابط؟ إذا كنت صاحب الحقوق أو ممثلًا مخولًا وتعتقد أنه يجب إزالة رابط خارجي، يرجى التواصل معنا.",
  },
  vaultLinkRemovalRequest: { en: "Request Link Removal", ar: "طلب حذف رابط" },
} satisfies Record<string, Localized<string>>;

export const STATUS_LABEL: Record<FeatureStatus, Localized<string>> = {
  ACTIVE: { en: "Active", ar: "مفعّل" },
  IN_DEVELOPMENT: { en: "In Development", ar: "قيد التطوير" },
  PLANNED: { en: "Planned", ar: "مخطط له" },
};
