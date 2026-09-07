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
      en: "Use the DOWNLOAD FOR WINDOWS button on the DRIVER2X front page. This downloads D2XLauncherSetup.msi -- the official installer for the DRIVER2X application.",
      ar: "استخدم زر «تحميل لويندوز» في الصفحة الرئيسية لـ DRIVER2X. سيقوم ذلك بتحميل D2XLauncherSetup.msi -- المثبّت الرسمي لتطبيق DRIVER2X.",
    },
    notes: {
      en: [
        "Windows 10 or 11, 64-bit only.",
        "You do not need your Driver 2 discs yet to download -- that comes in a later step.",
      ],
      ar: [
        "ويندوز 10 أو 11، إصدار 64-بت فقط.",
        "لست بحاجة لأقراص Driver 2 الخاصة بك عند التحميل -- ذلك يأتي في خطوة لاحقة.",
      ],
    },
  },
  {
    id: "install",
    number: "02",
    title: { en: "Install", ar: "التثبيت" },
    explanation: {
      en: "Run D2XLauncherSetup.msi. It's a per-user installer, so it won't ask for administrator rights -- DRIVER2X installs into your own user profile, alongside a Start Menu and Desktop shortcut.",
      ar: "شغّل D2XLauncherSetup.msi. المثبّت خاص بالمستخدم الحالي، لذا لن يطلب صلاحيات مدير -- يُثبَّت DRIVER2X داخل ملفك الشخصي، مع اختصار في قائمة ابدأ وسطح المكتب.",
    },
    notes: {
      en: [
        "Per-user install: no UAC prompt, and the app can update itself later without needing elevation.",
        "If you're reinstalling, the installer upgrades an existing install cleanly.",
      ],
      ar: [
        "تثبيت خاص بالمستخدم: لا نافذة صلاحيات، ويمكن للتطبيق تحديث نفسه لاحقًا دون الحاجة لصلاحيات إضافية.",
        "إذا كنت تعيد التثبيت، فإن المثبّت يقوم بترقية التثبيت الحالي بشكل نظيف.",
      ],
    },
  },
  {
    id: "configure",
    number: "03",
    title: { en: "First Launch", ar: "أول تشغيل" },
    explanation: {
      en: "Open D2X Launcher from the Start Menu or Desktop shortcut. It first checks that the launcher application itself is up to date (see the next step) -- once that passes, if a valid game install isn't already detected, it opens a setup wizard to configure your game data.",
      ar: "افتح D2X Launcher من قائمة ابدأ أو اختصار سطح المكتب. يتحقق أولًا من أن التطبيق نفسه محدّث (انظر الخطوة التالية) -- وبعد اجتياز ذلك، إذا لم يتم اكتشاف تثبيت صالح للعبة، يفتح معالج إعداد لتهيئة بيانات لعبتك.",
    },
    notes: {
      en: ["An internet connection is required for this first check."],
      ar: ["يلزم اتصال بالإنترنت لهذا التحقق الأول."],
    },
  },
  {
    id: "launcher-update",
    number: "04",
    title: { en: "Launcher Update", ar: "تحديث التطبيق" },
    explanation: {
      en: "Before anything else opens, DRIVER2X checks whether the launcher application itself is up to date. If a newer version is required, you'll see a dedicated, unskippable update screen -- it downloads and installs the update automatically, then continues.",
      ar: "قبل فتح أي شيء آخر، يتحقق DRIVER2X مما إذا كان التطبيق نفسه محدّثًا. إذا كان يلزم إصدار أحدث، ستظهر شاشة تحديث مخصصة لا يمكن تخطيها -- تقوم بتحميل التحديث وتثبيته تلقائيًا، ثم تكمل.",
    },
    notes: {
      en: [
        "This check cannot be bypassed, by design -- it's a separate, mandatory check from the game-update check later in this guide.",
        "Requires an internet connection; if the check itself can't reach the server, you'll be offered a retry rather than being let through silently.",
      ],
      ar: [
        "لا يمكن تجاوز هذا التحقق، وهذا مقصود -- وهو منفصل وإلزامي عن تحقق تحديث اللعبة لاحقًا في هذا الدليل.",
        "يتطلب اتصالاً بالإنترنت؛ وإذا تعذر على التحقق نفسه الوصول للخادم، ستُعرض عليك إعادة المحاولة بدلاً من المتابعة دون تنبيه.",
      ],
    },
  },
  {
    id: "add-cd1",
    number: "05",
    title: { en: "Add CD 1", ar: "إضافة القرص الأول (CD1)" },
    explanation: {
      en: "The setup wizard shows two cards side by side, one for CD1 and one for CD2. On the CD1 card, click Choose and select your own CD1 disc image (a .bin, .iso, or .ccd file). DRIVER2X does not include or distribute this data -- you need your own legitimate copy of the original game, dumped as a disc image file, not a folder of loose files.",
      ar: "تعرض شاشة الإعداد بطاقتين جنبًا إلى جنب، واحدة لـ CD1 وأخرى لـ CD2. في بطاقة CD1، اضغط «اختيار» وحدد ملف صورة القرص الأول الخاص بك (بصيغة .bin أو .iso أو .ccd). لا يوفر DRIVER2X هذه البيانات ولا يوزّعها -- تحتاج إلى نسخة أصلية شرعية من اللعبة الأصلية، على هيئة ملف صورة قرص، وليس مجلدًا من ملفات منفصلة.",
    },
    notes: {
      en: [
        "Both CD1 and CD2 appear on the same screen, as two separate cards -- this is one step in this guide, but one screen in the app.",
        "As soon as a valid file is chosen, the card's status line updates automatically to show it was found.",
      ],
      ar: [
        "يظهر كل من CD1 و CD2 في نفس الشاشة، كبطاقتين منفصلتين -- هذه خطوة واحدة في هذا الدليل، لكنها شاشة واحدة في التطبيق.",
        "بمجرد اختيار ملف صالح، يتحدث سطر الحالة في البطاقة تلقائيًا ليُظهر أنه تم العثور عليه.",
      ],
    },
  },
  {
    id: "add-cd2",
    number: "06",
    title: { en: "Add CD 2", ar: "إضافة القرص الثاني (CD2)" },
    explanation: {
      en: "On the same screen, repeat the same step for the CD2 card: click Choose and select your CD2 disc image. Once both CD1 and CD2 show as found, setup can proceed -- it then reads both discs and prepares the game to run automatically, including converting the original video files for PC playback.",
      ar: "في نفس الشاشة، كرر الخطوة نفسها لبطاقة CD2: اضغط «اختيار» وحدد ملف صورة القرص الثاني. بمجرد ظهور كل من CD1 و CD2 كموجودَين، يمكن للإعداد المتابعة -- عندها يقرأ القرصين ويجهّز اللعبة للعمل تلقائيًا، بما في ذلك تحويل ملفات الفيديو الأصلية لتعمل على الكمبيوتر.",
    },
    notes: {
      en: [
        "Both discs are mandatory -- setup won't proceed with only one.",
        "This step can take a few minutes; real progress is shown while it works.",
      ],
      ar: [
        "كلا القرصين إلزاميان -- لن يتابع الإعداد بقرص واحد فقط.",
        "قد تستغرق هذه الخطوة بضع دقائق؛ يُعرض تقدم حقيقي أثناء العمل.",
      ],
    },
  },
  {
    id: "main-dashboard",
    number: "07",
    title: { en: "Main Dashboard", ar: "لوحة التحكم الرئيسية" },
    explanation: {
      en: "Once setup is complete, this is your home base every time you open DRIVER2X: a header with the app name and quick access to Game Settings and Customer Support, a status card showing your current access, and a large Play button. A small TikTok link and the copyright line sit at the very bottom.",
      ar: "بمجرد اكتمال الإعداد، هذه هي شاشتك الرئيسية في كل مرة تفتح فيها DRIVER2X: شريط علوي يحمل اسم التطبيق مع وصول سريع لإعدادات اللعبة ودعم العملاء، وبطاقة حالة تعرض نوع وصولك الحالي، وزر تشغيل كبير. رابط تيك توك صغير وسطر حقوق النشر يظهران أسفل الشاشة.",
    },
    notes: {
      en: [
        "This same screen is what you'll see on every future launch -- setup (the CD steps above) only needs to run once.",
      ],
      ar: [
        "هذه الشاشة نفسها هي ما ستراه في كل تشغيل لاحق -- الإعداد (خطوات الأقراص أعلاه) يحتاج للتشغيل مرة واحدة فقط.",
      ],
    },
  },
  {
    id: "free-trial",
    number: "08",
    title: { en: "Free Trial", ar: "تجربة مجانية" },
    explanation: {
      en: "If you haven't activated a license yet, the dashboard offers a Free Trial card with a limited-time trial you can start with one click -- starting it also launches the game immediately.",
      ar: "إذا لم تُفعّل ترخيصًا بعد، تعرض لوحة التحكم بطاقة «تجربة مجانية» لفترة محدودة يمكنك بدؤها بضغطة واحدة -- بدؤها يشغّل اللعبة مباشرة أيضًا.",
    },
    notes: {
      en: [
        "The trial is time-limited; DRIVER2X shows a dedicated screen with a Subscribe option once it ends.",
      ],
      ar: ["التجربة محدودة بوقت؛ يعرض DRIVER2X شاشة مخصصة بخيار الاشتراك عند انتهائها."],
    },
  },
  {
    id: "subscribe",
    number: "09",
    title: { en: "Subscribe / Purchase", ar: "الاشتراك / الشراء" },
    explanation: {
      en: "The same dashboard also has a Subscribe/purchase entry point for buying full access directly. Purchasing there provides a license code, which you then enter using the Enter Activation Code step next.",
      ar: "تحتوي نفس اللوحة أيضًا على مدخل للاشتراك/الشراء لشراء الوصول الكامل مباشرة. الشراء هناك يمنحك رمز ترخيص، تُدخله بعد ذلك في خطوة «إدخال رمز التفعيل» التالية.",
    },
    notes: {
      en: [
        "The storefront link is still being finalized -- if it isn't live yet when you try it, license-code activation (next step) remains the current way to unlock full access.",
        "You never need your Driver 2 discs again for this step -- activation is entirely account/license-based.",
      ],
      ar: [
        "رابط المتجر لا يزال قيد الإنهاء -- إذا لم يكن متاحًا بعد عند تجربته، يبقى تفعيل رمز الترخيص (الخطوة التالية) هو الطريقة الحالية لفتح الوصول الكامل.",
        "لن تحتاج أقراص Driver 2 الخاصة بك مرة أخرى لهذه الخطوة -- التفعيل يعتمد بالكامل على الحساب/الترخيص.",
      ],
    },
  },
  {
    id: "enter-code",
    number: "10",
    title: { en: "Enter Activation Code", ar: "إدخال رمز التفعيل" },
    explanation: {
      en: "If you already have a license code (from a purchase, or one you were given), use the Enter Code option on the dashboard. A small dialog asks for your code and activates it -- the dashboard's status updates immediately to reflect full access once it succeeds.",
      ar: "إذا كان لديك بالفعل رمز ترخيص (من عملية شراء، أو رمز حصلت عليه)، استخدم خيار «إدخال الرمز» في لوحة التحكم. تظهر نافذة صغيرة تطلب الرمز وتقوم بتفعيله -- تتحدث حالة اللوحة فورًا لتعكس الوصول الكامل بمجرد النجاح.",
    },
    notes: {
      en: [
        'There is no separate "success" screen -- the same dashboard\'s status card and Play button update in place once activation succeeds.',
        "Keep your license code somewhere safe; you'll need it again if you reinstall on a new device.",
      ],
      ar: [
        "لا توجد شاشة «نجاح» منفصلة -- تتحدث بطاقة الحالة وزر التشغيل في نفس اللوحة فور نجاح التفعيل.",
        "احتفظ برمز الترخيص في مكان آمن؛ ستحتاجه مرة أخرى إذا أعدت التثبيت على جهاز جديد.",
      ],
    },
  },
  {
    id: "game-update",
    number: "11",
    title: { en: "Game Update", ar: "تحديث اللعبة" },
    explanation: {
      en: "Separately from the mandatory launcher update earlier, DRIVER2X also checks the game files themselves for updates each time before Play actually starts, and applies any update automatically.",
      ar: "بشكل منفصل عن تحديث التطبيق الإلزامي السابق، يتحقق DRIVER2X أيضًا من تحديثات ملفات اللعبة نفسها في كل مرة قبل بدء التشغيل فعليًا، ويطبّق أي تحديث تلقائيًا.",
    },
    notes: {
      en: [
        "This check never touches your original Driver 2 disc data -- only DRIVER2X's own files.",
        "Unlike the launcher update, this check doesn't block you indefinitely if it can't reach the server -- it lets you continue to Play, so a temporary connection issue never locks you out of a game you already have installed.",
      ],
      ar: [
        "هذا التحقق لا يمس أبدًا بيانات أقراص Driver 2 الأصلية الخاصة بك -- فقط ملفات DRIVER2X الخاصة.",
        "على عكس تحديث التطبيق، هذا التحقق لا يمنعك إلى ما لا نهاية إذا تعذر الوصول للخادم -- بل يسمح لك بمتابعة التشغيل، حتى لا تمنعك مشكلة اتصال مؤقتة من لعب لعبة مثبّتة لديك بالفعل.",
      ],
    },
  },
  {
    id: "play",
    number: "12",
    title: { en: "Play", ar: "اللعب" },
    explanation: {
      en: "Once both update checks pass and you have Free Trial or full access, press the Play button on the dashboard to start DRIVER2X.",
      ar: "بمجرد اجتياز كلا تحققي التحديث وامتلاكك وصول تجربة مجانية أو كامل، اضغط زر التشغيل في لوحة التحكم لبدء DRIVER2X.",
    },
    notes: { en: [], ar: [] },
  },
  {
    id: "troubleshooting",
    number: "13",
    title: { en: "Troubleshooting", ar: "استكشاف الأخطاء وإصلاحها" },
    explanation: {
      en: "Most issues are solved by one of these:",
      ar: "معظم المشكلات يمكن حلها بإحدى الطرق التالية:",
    },
    notes: {
      en: [
        "Stuck checking for updates: check your internet connection and try again.",
        "Game data flagged as broken on a later launch: you'll be offered Repair Installation (keeps existing files, only re-asks for the discs to complete what's missing) or Reset Setup From Scratch (wipes the current install and starts over).",
        "Installer won't run: make sure you're on Windows 10/11 64-bit and re-download the installer.",
        "Disc file not accepted: confirm it's a real disc image (.bin, .iso, or .ccd), not a folder of extracted files.",
        "Trial or subscription ended: DRIVER2X shows a dedicated screen with a Subscribe option -- see the Subscribe/Purchase step above.",
      ],
      ar: [
        "عالق أثناء التحقق من التحديثات: تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
        "بيانات اللعبة ظهرت كتالفة عند تشغيل لاحق: سيُعرض عليك خيار «إصلاح التثبيت» (يحتفظ بالملفات الموجودة، ويطلب الأقراص فقط لاستكمال الناقص) أو «إعادة الإعداد من البداية» (يمسح التثبيت الحالي بالكامل ويبدأ من جديد).",
        "المثبّت لا يعمل: تأكد أنك تستخدم ويندوز 10/11 إصدار 64-بت، وأعد تحميل المثبّت.",
        "ملف القرص غير مقبول: تأكد أنه ملف صورة قرص حقيقي (.bin أو .iso أو .ccd)، وليس مجلدًا من ملفات مستخرجة.",
        "انتهت التجربة أو الاشتراك: يعرض DRIVER2X شاشة مخصصة بخيار الاشتراك -- انظر خطوة الاشتراك/الشراء أعلاه.",
      ],
    },
  },
];
