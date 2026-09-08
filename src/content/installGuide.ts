import type { InstallStep } from "./types";

/**
 * A complete, sequential onboarding guide -- someone who has never used
 * DRIVER2X before should be able to follow this from nothing to playing.
 *
 * Expanded 2026-09-06 from 9 to 13 steps after directly inspecting the real
 * launcher source (not guessed, not padded to hit a round number) --
 * grounding for each NEW step:
 *   - "launcher-update" (04): DD2.Launcher/UI/MandatoryUpdateForm.cs -- a
 *     real, dedicated, unskippable gate screen shown before the dashboard
 *     ever appears, entirely separate from the later game-update check.
 *   - "main-dashboard" (07): DD2.Launcher/MainForm.cs's BuildHeader/
 *     BuildSidebar/BuildFooter -- the real, persistent dashboard layout
 *     (header with Game Settings/Customer Support, status card, Play
 *     button, footer TikTok link + copyright).
 *   - "free-trial" (08): MainForm.cs's `_trialCard` ("تجربة مجانية") and
 *     `OnStartTrialClicked()`, which calls the trial-start API and then
 *     launches the game immediately.
 *   - "subscribe" (09): MainForm.cs's `OnPurchaseClicked()` ->
 *     `PurchaseService.StartPurchaseFlow()`. Real UI, but the underlying
 *     store URL (`SALLA_URL` in config/site.ts) is still the same
 *     placeholder the launcher app itself ships today -- worded honestly
 *     below rather than implying a live storefront.
 *   - "enter-code" (10, was "activate" 06): DD2.Launcher/
 *     LicenseCodeDialog.cs -- the real single-field "تفعيل رمز الترخيص"
 *     dialog. There is no separate confirmation screen: MainForm's
 *     OnEnterCodeClicked() updates the SAME dashboard's status card in
 *     place on success (SetStatus/RefreshViewState) -- described as such,
 *     not invented as its own screen.
 *   - "game-update" (11, split out of the old combined "update" 07):
 *     GameUpdateService.EnsureGameUpToDateBeforeLaunchAsync -- a separate,
 *     deliberately fail-open check from the mandatory launcher gate above.
 *
 * Still grounded exactly as before:
 *   - SetupWizardForm.cs: Welcome -> Recovery (only on a broken existing
 *     install) -> Discs -> Progress -> Result. Both CD1 and CD2 are shown as
 *     two side-by-side cards on the SAME "Discs" screen (BuildDiscsPanel/
 *     BuildDiscCard), each with a "Choose" (اختيار) browse button and a live
 *     found/needs-selection status line (GameInstallerService.ValidateDisc).
 *     Browse dialog filters to *.bin/*.iso/*.ccd.
 *   - The Recovery step's two real options ("Repair Installation" /
 *     "Reset Setup From Scratch") are used verbatim in Troubleshooting.
 *
 * Images are NOT stored per-entry here. Screens.tsx looks up
 * `src/assets/app/<step-number>.{png,jpg,...}` by this entry's `number`
 * field via `getAppImage()` in `src/lib/assets.ts` -- see
 * src/assets/app/README.md. No screenshot exists yet for any step; each
 * renders as a clearly labeled "screenshot pending" placeholder
 * (FeAssetSlot) until a real capture is dropped into that numbered slot.
 * Do not fabricate them.
 */
export const INSTALL_STEPS: InstallStep[] = [
  {
    id: "download",
    number: "01",
    title: { en: "Download", ar: "التحميل" },
    explanation: {
      en: "Use the Download for Windows button on the home page. This will download the official D2XLauncher installer application.",
      ar: "استخدم زر تحميل لويندوز في الصفحة الرئيسية  . سيقوم ذلك بتحميل تطبيق D2XLauncher المثبّت الرسمي لتطبيق.",
    },
    notes: {
      en: [
        "Windows 10 or 11, 64-bit only.",
        "You do not need your Driver 2 discs when downloading; that comes in a later step.",
      ],
      ar: [
        "ويندوز 10 أو 11، إصدار 64-بت فقط.",
        "لست بحاجة لأقراص Driver 2 الخاصة بك عند التحميل ذلك يأتي في خطوة لاحقة.",
      ],
    },
  },
  {
    id: "install",
    number: "02",
    title: { en: "Install", ar: "التثبيت" },
    explanation: {
      en: "Open the D2XLauncherSetup.msi file, follow all of the installation steps below, and wait until the installation is complete.",
      ar: "افتح ملف D2XLauncherSetup.msi.واتبع جميع خطوات التثبيت التالية وانتظر حتى اكتمال التثبيت",
    },
    notes: {
      en: [
        "The application can update itself later without requiring additional permissions.",
        "If you reinstall the application, the installer upgrades the current installation cleanly.",
      ],
      ar: [
        "يمكن للتطبيق تحديث نفسه لاحقًا دون الحاجة لصلاحيات إضافية.",
        "إذا اعدت تثبيت التطبيق ، فإن المثبّت يقوم بترقية التثبيت الحالي بشكل نظيف.",
      ],
    },
  },
  {

    id: "launcher-update",
    number: "03",
    title: { en: "Application Update", ar: "تحديث التطبيق" },
    explanation: {
      en: "When you open the application, DRIVER2X checks whether the application itself is up to date. If a newer version is required, an update screen will appear to download and install the update automatically, then continue.",
      ar: "عند فتح التطبيق، يتحقق DRIVER2X مما إذا كان التطبيق نفسه محدّثًا. إذا كان يلزم إصدار أحدث، ستظهر شاشة تحديث تقوم بتحميل التحديث وتثبيته تلقائيًا، ثم تكمل.",
    },
    notes: {
      en: [
        "An internet connection is required; if the server cannot be reached during the check, you will be offered the option to retry instead of continuing without a warning.",
      ],
      ar: [
        "يتطلب اتصالاً بالإنترنت؛ وإذا تعذر التحقق الوصول للخادم، ستُعرض عليك إعادة المحاولة بدلاً من المتابعة دون تنبيه.",
      ],
    },
  },
  {
    id: "add-cd1",
    number: "04",
    title: { en: "Add Disc 1 (CD1)", ar: "إضافة القرص الأول (CD1)" },
    explanation: {
      en: "The setup screen displays two cards side by side, one for CD1 and one for CD2. On the CD1 card, click \"Choose\" and select your own game disc image file (in .bin, .iso, or .ccd format). DRIVER2X does not provide or distribute this data, so you need a legitimate original copy of the game in the form of a disc image file, not a folder of separate files.",
      ar: "تعرض شاشة الإعداد بطاقتين جنبًا إلى جنب، واحدة لـ CD1 وأخرى لـ CD2. في بطاقة CD1، اضغط «اختيار» وحدد ملف القرص الأول الخاص باللعبة (بصيغة .bin أو .iso أو .ccd). لا يوفر DRIVER2X هذه البيانات ولا يوزّعها لذلك تحتاج إلى نسخة أصلية شرعية من اللعبة الأصلية، على هيئة ملف صورة قرص، وليس مجلدًا من ملفات منفصلة.",
    },
    notes: {
      en: [
        "As soon as a valid file is selected, the status line on the card updates automatically to show that it has been found.",
      ],
      ar: [
        "بمجرد اختيار ملف صالح، يتحدث سطر الحالة في البطاقة تلقائيًا ليُظهر أنه تم العثور عليه.",
      ],
    },
  },
  {
    id: "add-cd2",
    number: "05",
    title: { en: "Add Disc 2 (CD2)", ar: "إضافة القرص الثاني (CD2)" },
    explanation: {
      en: "On the same screen, repeat the same step for the CD2 card: click \"Choose\" and select the second disc image file. Once both CD1 and CD2 are shown as found, setup can continue. It will then read both discs and prepare the game to run automatically, including converting the original video files to work on PC.",
      ar: "في نفس الشاشة، كرر الخطوة نفسها لبطاقة CD2: اضغط «اختيار» وحدد ملف القرص الثاني. بمجرد ظهور كل من CD1 و CD2 كموجودَين، يمكن للإعداد المتابعة عندها يقرأ القرصين ويجهّز اللعبة للعمل تلقائيًا، بما في ذلك تحويل ملفات الفيديو الأصلية لتعمل على الكمبيوتر.",
    },
    notes: {
      en: [
        "Both discs are mandatory, so setup will not continue with only one disc.",
        "This step may take a few minutes; real progress is displayed while the process is running.",
      ],
      ar: [
        "كلا القرصين إلزاميان لذلك لن يتابع الإعداد بقرص واحد فقط.",
        "قد تستغرق هذه الخطوة بضع دقائق؛ يُعرض تقدم حقيقي أثناء العمل.",
      ],
    },
  },
  {
    id: "main-dashboard",
    number: "06",
    title: { en: "Main Dashboard", ar: "لوحة التحكم الرئيسية" },
    explanation: {
      en: "Once setup is complete, this is your main screen whenever you open DRIVER2X. If you have a problem with the game, application, or subscription, click the Customer Support button and you will be redirected to customer support on WhatsApp.",
      ar: "بمجرد اكتمال الإعداد، هذه هي شاشتك الرئيسية في كل مرة تفتح فيها DRIVER2X: شريط علوي يحمل اسم التطبيق مع وصول سريع لإعدادات اللعبة ودعم العملاء، وبطاقة حالة تعرض نوع وصولك الحالي، وزر تشغيل كبير. رابط تيك توك صغير وسطر حقوق النشر يظهران أسفل الشاشة.",
    },
    notes: {
      en: [
        "This same screen is what you will see every time you launch the application. The disc setup steps above only need to be completed once.",
      ],
      ar: [
        "هذه الشاشة نفسها هي ما ستراه في كل تشغيل لاحق الإعداد (خطوات الأقراص أعلاه) يحتاج للتشغيل مرة واحدة فقط.",
      ],
    },
  },
  {
    id: "free-trial",
    number: "07",
    title: { en: "Free Trial", ar: "تجربة مجانية" },
    explanation: {
      en: "If you have not activated a license yet, the dashboard has a \"Free Trial\" card for a limited period. You can start it by clicking \"Start Free Trial\", then click the DRIVER 2 Play button.",
      ar: "إذا لم تُفعّل ترخيصًا بعد، يوجد بلوحة التحكم بطاقة «تجربة مجانية» لفترة محدودة يمكنك البدء بالضغط على ابدا التجربة المجانية وبعدها اضغط زر تشغيل درايفر 2 .",
    },
    notes: {
      en: [
        "The trial is time-limited; DRIVER2X shows a dedicated screen with a subscription option when it ends.",
      ],
      ar: ["التجربة محدودة بوقت؛ يعرض DRIVER2X شاشة مخصصة بخيار الاشتراك عند انتهائها."],
    },
  },
  {
    id: "subscribe",
    number: "08",
    title: { en: "Subscription / Activation", ar: "الاشتراك / التفعيل" },
    explanation: {
      en: "The same dashboard also has an entry point for subscription / activation to activate full access directly. Activation here gives you a license code, which you then enter in the next \"Enter Activation Code\" step.",
      ar: "تحتوي نفس اللوحة أيضًا على مدخل للاشتراك/ التفعيل لتفعيل الوصول الكامل مباشرة. التفعيل هنا يمنحك رمز ترخيص، تُدخله بعد ذلك في خطوة «إدخال رمز التفعيل» التالية.",
    },
    notes: {
      en: [
        "When you click Purchase / Activation, a browser window will open and redirect you to the application's Salla store. Complete the purchase process and your activation code will appear immediately, then enter it in the \"I Have an Activation Code\" field.",
      ],
      ar: [
        "عند الضغط على شراء تفعيل ستفتح لك نافذة المتصفح ويتم تحويلك لمتجر سلة الخاص بالتطبيق اكمل عملية الشراء وسيظهر لك رمز التفعيل مباشرة ثم ضعه في خانة لدي رمز تفعيل .",
      ],
    },
  },
  {
    id: "enter-code",
    number: "09",
    title: { en: "Enter Activation Code", ar: "إدخال رمز التفعيل" },
    explanation: {
      en: "If you already have a license code, use the \"Enter Code\" option in the dashboard. A small window will appear asking for the code and will activate it. After that, the dashboard status will update immediately to reflect full access once activation succeeds.",
      ar: "إذا كان لديك بالفعل رمز ترخيص ، استخدم خيار «إدخال الرمز» في لوحة التحكم. لتظهر نافذة صغيرة تطلب الرمز وتقوم بتفعيله بعد ذلك ستتحدث حالة اللوحة فورًا لتعكس الوصول الكامل بمجرد النجاح.",
    },
    notes: {
      en: [
        "Keep your license code in a safe place; you will need it again if you reinstall on a new device.",
      ],
      ar: [
        "احتفظ برمز الترخيص في مكان آمن؛ ستحتاجه مرة أخرى إذا أعدت التثبيت على جهاز جديد.",
      ],
    },
  },
  {
    id: "game-update",
    number: "10",
    title: { en: "Game Update", ar: "تحديث اللعبة" },
    explanation: {
      en: "Separately from the mandatory application update at startup, you can also manually check for updates to the game files by clicking \"Check for Updates\". Any available update will then be downloaded automatically.",
      ar: "بشكل منفصل عن تحديث التطبيق الإلزامي عند التشغيل، يمكنك التحقق  أيضًا من تحديثات ملفات اللعبة نفسها بشكل يدوي عند الضغط على تحقق من التحديثات، وسيتم تنزيل اي تحديث تلقائيًا.",
    },
    notes: {
      en: [
        "You will receive any new game or application update as soon as a new update becomes available and is installed.",
      ],
      ar: [
        "ستحصل على اي تحديث جديد للعبة او التطبيق بمجرد ظهور تحديث جديد وتثبيته",
      ],
    },
  },
  {
    id: "play",
    number: "11",
    title: { en: "Play", ar: "اللعب" },
    explanation: {
      en: "Once you have Free Trial or full access, press the Play button on the dashboard to start playing.",
      ar: "بمجرد امتلاكك وصول تجربة مجانية أو كامل، اضغط زر التشغيل في لوحة التحكم لبدء اللعب.",
    },
    notes: { en: [], ar: [] },
  },
  {
    id: "troubleshooting",
    number: "12",
    title: { en: "Troubleshooting", ar: "استكشاف الأخطاء وإصلاحها" },
    explanation: {
      en: "If you have a problem related to the game, application, or subscription, click the Customer Support button and you will be redirected to customer support on WhatsApp.",
      ar: "في حال وجود مشكلة متعلقة باللعبة او التطبيق او الاشتراك يرجى التواصل بالضغط على زر دعم العملاء وسيتم تحويلك الى واتس اب الخاص بالعملاء",
    },
    notes: {
      en: [

      ],
      ar: [

      ],
    },
  },
];