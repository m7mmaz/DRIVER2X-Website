import type { Feature } from "./types";

/**
 * Every status below was checked against the real DD2_COMMERCIAL/REDRIVER2
 * game source (src_rebuild/Game/C), not assumed from the project roadmap.
 * `evidence` cites exactly what was found. Where the source only shows a
 * partial/vanilla-derived mechanic, the status is IN_DEVELOPMENT rather
 * than ACTIVE -- see types.ts for the exact rule.
 *
 * Images: NOT stored per-entry here. Screens.tsx looks up
 * `src/assets/features/<number>.{png,jpg,...}` by this entry's `number`
 * field via `getFeatureImage()` in `src/lib/assets.ts` -- see
 * src/assets/features/README.md for the full numbering convention. Two real,
 * verified screenshots exist today: `features/2.jpg` and `features/10.jpg`
 * (both the same real in-engine police-roadblock capture that this project
 * already used for Dynamic Police and Dynamic World before this pass, simply
 * relocated into the numbered folder). Every other slot is unfilled on
 * purpose -- FeAssetSlot renders that as a clearly labeled "screenshot
 * needed" placeholder rather than a fabricated image.
 */
export const FEATURES: Feature[] = [
  {
    id: "fuel-system",
    number: "01",
    title: { en: "Fuel System", ar: "نظام الوقود" },
    status: "ACTIVE",
    summary: {
      en: "Fuel drains, sputters and matters — refuel or get stranded.",
      ar: "الوقود ينفد ويتأثر أداء السيارة — أعد التزود أو ستتعطل في الطريق.",
    },
    description: {
      en: "Every car the player drives now tracks a real fuel tank. It drains over time, sputters as it runs low, and hitting empty mid-chase forces a genuine decision: get stranded, or bail out and carjack something else.",
      ar: "كل سيارة يقودها اللاعب أصبح لها خزان وقود حقيقي. ينفد الوقود مع الوقت، ويتلعثم أداء السيارة عند انخفاضه، وعند نفاده أثناء مطاردة يواجه اللاعب قرارًا حقيقيًا: التعطل في مكانه، أو النزول والاستيلاء على سيارة أخرى.",
    },
    details: {
      en: [
        "Fuel drain, refill and forced-empty are all real, distinct code paths (Sandbox_PlayerFuel / Sandbox_AddFuel / Sandbox_DrainFuel / Sandbox_ForceFuelEmpty).",
        "Running dry mid-pursuit unlocks an emergency exit — the game will let you bail out and carjack a fresh vehicle instead of stranding you.",
        "Service stations fully repair damage and refill fuel in one stop.",
        "Fuel effects can also be triggered live during a stream via the TikTok integration (see Live Interaction below).",
      ],
      ar: [
        "نفاد الوقود وتعبئته وإفراغه القسري كلها مسارات برمجية حقيقية ومنفصلة (Sandbox_PlayerFuel / Sandbox_AddFuel / Sandbox_DrainFuel / Sandbox_ForceFuelEmpty).",
        "نفاد الوقود أثناء المطاردة يفتح خيار خروج طارئ — يمكنك النزول والاستيلاء على سيارة جديدة بدلاً من التعطل في مكانك.",
        "محطات الخدمة تصلح التلف وتعبئ الوقود بالكامل في توقف واحد.",
        "يمكن أيضًا تفعيل تأثيرات الوقود مباشرة أثناء البث عبر ربط تيك توك (انظر «التفاعل المباشر» أدناه).",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h + sandbox.c: Sandbox_PlayerFuel, Sandbox_{Add,Drain,ForceFuelEmpty}Fuel, Sandbox_EmergencyExitAllowed.",
  },
  {
    id: "dynamic-police",
    number: "02",
    title: { en: "Dynamic Police", ar: "الشرطة الديناميكية" },
    status: "ACTIVE",
    summary: {
      en: "Cops play roles, not just numbers — and get more aggressive as heat rises.",
      ar: "الشرطة تلعب أدوارًا تكتيكية وليست مجرد أعداد — وتزداد عدوانية مع ارتفاع درجة الملاحقة.",
    },
    description: {
      en: "Police AI is no longer one-size-fits-all. Individual cop cars are assigned tactical roles — interceptor, flanker — and how hard they push scales directly with the current Heat level.",
      ar: "ذكاء الشرطة الاصطناعي لم يعد موحدًا للجميع. تُسند لكل سيارة شرطة دور تكتيكي — معترضة أو مطوّقة — ومدى عدوانيتها يتناسب مباشرة مع درجة الملاحقة الحالية.",
    },
    details: {
      en: [
        "Per-cop tactical modifiers (interceptor / flanker roles) are applied every frame and scaled by heat.",
        "The felony threshold at which cops attempt a PIT maneuver or battering ram is dynamic, not a fixed original-game constant.",
        "Ties directly into the Heat System below — police behavior and Heat are the same underlying system, not two separate features.",
      ],
      ar: [
        "يتم تطبيق معدّلات تكتيكية لكل سيارة شرطة (معترضة / مطوّقة) في كل إطار، وتتناسب مع درجة الملاحقة.",
        "حد الجنحة الذي يجعل الشرطة تحاول مناورة PIT أو الدفع بعربة كباش أصبح ديناميكيًا، وليس رقمًا ثابتًا من اللعبة الأصلية.",
        "مرتبط مباشرة بنظام الملاحقة (Heat) أدناه — سلوك الشرطة والملاحقة نظام واحد، وليسا ميزتين منفصلتين.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_CopTactics(), gSandboxBatterTrigger (replaces the original hardcoded value in cop_ai.c's ControlCops()).",
  },
  {
    id: "police-roadblocks",
    number: "03",
    title: { en: "Police Roadblocks", ar: "حواجز الشرطة" },
    status: "IN_DEVELOPMENT",
    summary: {
      en: "Built on the original game's roadblock cars, extended for dynamic requests.",
      ar: "مبنية على سيارات الحواجز في اللعبة الأصلية، ويجري توسيعها لتصبح طلبات ديناميكية.",
    },
    description: {
      en: "The original game already had scripted roadblock cars in missions. DRIVER2X is extending that mechanic toward dynamic, on-demand roadblocks rather than only fixed mission placements — this work is real but not yet confirmed complete end-to-end.",
      ar: "اللعبة الأصلية كانت تحتوي بالفعل على سيارات حواجز مبرمجة داخل المهام. يعمل DRIVER2X على توسيع هذه الآلية لتصبح حواجز ديناميكية عند الطلب بدلاً من مواقع ثابتة فقط داخل المهام — هذا العمل حقيقي لكن لم يتم التأكد من اكتماله بالكامل بعد.",
    },
    details: {
      en: [
        "A real 'request roadblock' code path exists in the civilian/traffic AI, alongside the original roadblock-car detection macro.",
        "Marked IN DEVELOPMENT rather than ACTIVE because full random/on-demand roadblock spawning (outside scripted mission placements) was not independently confirmed in this pass.",
      ],
      ar: [
        "يوجد مسار برمجي حقيقي لـ«طلب حاجز» داخل ذكاء المرور/المدنيين، إلى جانب آلية التعرف الأصلية على سيارات الحواجز.",
        "صُنّفت «قيد التطوير» وليست «مفعّلة» لأنه لم يتم التأكد بشكل مستقل من ظهور حواجز عشوائية/عند الطلب بالكامل خارج مواقع المهام المبرمجة.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/cars.h: IS_ROADBLOCK_CAR macro; civ_ai.c: requestRoadblock; civrevenge.c/.h reference the 'vanilla roadblock-car-touched-by-player conversion.'",
  },
  {
    id: "heat-system",
    number: "04",
    title: { en: "Heat System", ar: "نظام الملاحقة (Heat)" },
    status: "ACTIVE",
    summary: {
      en: "A real, persistent aggression meter — not just a wanted-star count.",
      ar: "مقياس عدوانية حقيقي ومستمر — وليس مجرد عدد نجوم مطلوبية.",
    },
    description: {
      en: "A five-stage heat level (0 cold to 4 max aggression) drives how hard police respond, decaying over time rather than resetting instantly the moment you're out of sight.",
      ar: "خمس مراحل لمستوى الملاحقة (من 0 هادئ إلى 4 أقصى عدوانية) تتحكم في شدة استجابة الشرطة، وتتراجع تدريجيًا مع الوقت بدلاً من التصفير الفوري بمجرد الاختفاء عن الأنظار.",
    },
    details: {
      en: [
        "gHeatLevel (0-4) and gHeatTimer are tracked continuously and read every frame by police AI.",
        "Directly controls cop tactical aggression and the PIT/battering-ram threshold (see Dynamic Police).",
      ],
      ar: [
        "يتم تتبع gHeatLevel (من 0 إلى 4) و gHeatTimer باستمرار، وتقرأهما الشرطة الاصطناعية في كل إطار.",
        "يتحكم مباشرة في عدوانية تكتيكات الشرطة وحد مناورة PIT/عربة الكباش (انظر الشرطة الديناميكية).",
      ],
    },
    evidence: "src_rebuild/Game/C/sandbox.h: extern int gHeatLevel, gHeatTimer.",
  },
  {
    id: "civilian-revenge",
    number: "05",
    title: { en: "Random Events — Civilian Revenge", ar: "أحداث عشوائية — انتقام المدنيين" },
    status: "ACTIVE",
    summary: {
      en: "Hit a civilian, and they might turn into a real pursuer.",
      ar: "اصطدم بمدني، وقد يتحول إلى ملاحق حقيقي لك.",
    },
    description: {
      en: "Clip the wrong car and its driver can flip into an angry, chasing pursuer — a deliberate extension of the original game's rarer scripted Ambush event into something that can happen anywhere, from ordinary traffic.",
      ar: "اصطدم بالسيارة الخطأ وقد يتحول سائقها إلى ملاحق غاضب يطاردك — امتداد متعمد لحدث «الكمين» النادر والمبرمج في اللعبة الأصلية، ليصبح شيئًا قد يحدث في أي مكان، من مرور عادي تمامًا.",
    },
    details: {
      en: [
        "Single active civilian-revenge pursuer at a time by design (no unbounded chase spam).",
        "Conversion is deferred out of collision physics into the next frame's update, keeping vanilla collision math untouched.",
        "Toggleable from the pause menu, so it can be turned off for a calmer free-roam session.",
      ],
      ar: [
        "ملاحق انتقام مدني واحد فقط نشط في نفس الوقت حسب التصميم (لا فوضى ملاحقات غير محدودة).",
        "يتم تأجيل التحول خارج حسابات فيزياء التصادم إلى تحديث الإطار التالي، مع إبقاء رياضيات التصادم الأصلية دون تغيير.",
        "يمكن تفعيله أو إيقافه من قائمة الإيقاف المؤقت، لتجربة تجوّل حر أكثر هدوءًا عند الحاجة.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/civrevenge.c/.h: CivRevenge_OnContact, CivRevenge_Update; sandbox.h: gCitizenAngerEnabled.",
  },
  {
    id: "traffic-incidents",
    number: "06",
    title: { en: "Traffic Incidents", ar: "حوادث المرور" },
    status: "PLANNED",
    summary: {
      en: "Independent, spontaneous accidents and wrecks in ordinary traffic.",
      ar: "حوادث واصطدامات عفوية ومستقلة داخل حركة المرور العادية.",
    },
    description: {
      en: "A dedicated system for traffic generating its own incidents — crashes and wrecks that happen without player involvement — is on the roadmap. No dedicated implementation was found in the current source; Civilian Revenge and Civilian AI reactions (both real) are the closest things that exist today.",
      ar: "نظام مخصص يجعل حركة المرور تولّد حوادثها الخاصة — اصطدامات وحطام يحدث دون تدخل اللاعب — موجود على خارطة الطريق. لم يُعثر على تنفيذ مخصص له في المصدر الحالي؛ وأقرب ما هو موجود فعليًا هو انتقام المدنيين وردود فعل ذكاء المدنيين.",
    },
    details: { en: [], ar: [] },
    evidence:
      "No dedicated 'random traffic incident' system found in src_rebuild/Game/C during this review.",
  },
  {
    id: "civilian-ai",
    number: "07",
    title: { en: "Civilian AI", ar: "ذكاء المدنيين" },
    status: "ACTIVE",
    summary: {
      en: "Traffic reacts to pursuits happening near it, and the city's vehicle mix can vary.",
      ar: "حركة المرور تتفاعل مع المطاردات القريبة منها، ومزيج المركبات في المدينة يمكن أن يتنوع.",
    },
    description: {
      en: "Civilian drivers near an active police pursuit react to it, and the pool of civilian vehicle models can now draw from other cities for extra variety, instead of always the same fixed local set.",
      ar: "السائقون المدنيون القريبون من مطاردة شرطة نشطة يتفاعلون معها، ومجموعة موديلات سيارات المدنيين يمكن الآن أن تستمد من مدن أخرى لمزيد من التنوع، بدلاً من نفس المجموعة المحلية الثابتة دائمًا.",
    },
    details: {
      en: [
        "Nearby civilian thrust/steering is nudged in reaction to active pursuits.",
        "A 'guest city' system loads real vehicle geometry/textures from another city into a free resident slot for variety in free roam.",
      ],
      ar: [
        "يتم توجيه دفع/انعطاف السيارات المدنية القريبة كرد فعل على المطاردات النشطة.",
        "نظام «المدينة الضيفة» يحمّل أشكال/خامات مركبات حقيقية من مدينة أخرى إلى خانة سكنية شاغرة لمزيد من التنوع في التجول الحر.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_CivPanic, Sandbox_CivModelPick, Sandbox_InitMixedResidentPool, gGuestCity.",
  },
  {
    id: "garage-repair",
    number: "08",
    title: { en: "Garage / Repair", ar: "الجراج / الإصلاح" },
    status: "ACTIVE",
    summary: {
      en: "Service stations fully repair damage and refuel in one stop.",
      ar: "محطات الخدمة تصلح التلف بالكامل وتعبئ الوقود في توقف واحد.",
    },
    description: {
      en: "Pull into a service station and both your car's damage and its fuel are handled together — or trigger a damage-only repair independently when something needs just the bodywork fixed without touching fuel.",
      ar: "توقف عند محطة خدمة ليتم إصلاح تلف سيارتك وتعبئة وقودها معًا — أو يمكن تفعيل إصلاح للتلف فقط بشكل مستقل عندما يحتاج الأمر لإصلاح الهيكل فقط دون المساس بالوقود.",
    },
    details: {
      en: [
        "Full-service repair clears body/mechanical damage, rebuilds the clean mesh, and refills fuel.",
        "A damage-only repair path exists separately for cases that must not also refill fuel.",
      ],
      ar: [
        "الإصلاح الكامل يزيل التلف الهيكلي والميكانيكي، ويعيد بناء شكل السيارة النظيف، ويعبئ الوقود.",
        "يوجد مسار منفصل لإصلاح التلف فقط للحالات التي يجب ألا تشمل تعبئة الوقود.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_RepairCarDamage, Sandbox_DoFullRepair (service-station flow).",
  },
  {
    id: "live-interaction",
    number: "09",
    title: { en: "Live Interaction (TikTok)", ar: "تفاعل مباشر (تيك توك)" },
    status: "ACTIVE",
    summary: {
      en: "Not a loot/rewards system — a real-time link between a live stream and the game.",
      ar: "ليس نظام مكافآت — بل رابط حقيقي بين لحظة بث مباشر واللعبة نفسها.",
    },
    description: {
      en: "This isn't an in-game unlock or progression system. It's a genuine live-stream integration: viewer gifts sent during a TikTok live stream can trigger real in-game effects, such as fuel events, while the streamer is playing.",
      ar: "هذا ليس نظام فتح محتوى أو تقدم داخل اللعبة. إنه ربط حقيقي مع البث المباشر: الهدايا التي يرسلها المشاهدون أثناء بث تيك توك المباشر يمكن أن تُحدث تأثيرات حقيقية داخل اللعبة، مثل أحداث الوقود، أثناء لعب المذيع.",
    },
    details: {
      en: [
        "A dedicated bridge process listens for TikTok Live gift events and forwards them into the running game.",
        "At least one gift-triggered effect (a fuel event) is implemented and named in source as its own numbered event.",
      ],
      ar: [
        "توجد عملية ربط مخصصة تستمع لأحداث هدايا بث تيك توك المباشر وتنقلها إلى اللعبة أثناء تشغيلها.",
        "يوجد على الأقل تأثير واحد مرتبط بهدية (حدث وقود) منفّذ فعليًا ومسمّى في المصدر كحدث مرقّم خاص به.",
      ],
    },
    evidence:
      'src_rebuild/Game/C/interactive.c: Event 13 ("ROSE FUEL", TikTok Rose gift, giftId 5655); DD2_COMMERCIAL/TikTokBridge/.',
  },
  {
    id: "dynamic-world",
    number: "10",
    title: { en: "Dynamic World", ar: "العالم الديناميكي" },
    status: "ACTIVE",
    summary: {
      en: "The umbrella system tying heat, police, civilians and traffic mix together.",
      ar: "النظام الشامل الذي يربط الملاحقة والشرطة والمدنيين ومزيج المرور معًا.",
    },
    description: {
      en: "Dynamic World isn't a single switch — it's the combined effect of Heat, Dynamic Police, Civilian AI and the cross-city traffic mix all running together, so the city keeps behaving whether or not you're the one causing it.",
      ar: "العالم الديناميكي ليس مفتاحًا واحدًا — بل هو الأثر المجتمع لأنظمة الملاحقة والشرطة الديناميكية وذكاء المدنيين ومزيج المرور بين المدن، بحيث تستمر المدينة في التصرف سواء كنت أنت سبب ذلك أم لا.",
    },
    details: {
      en: [
        "See Heat System, Dynamic Police and Civilian AI above — each is independently verified; this entry is their shared framing.",
      ],
      ar: [
        "انظر أنظمة الملاحقة والشرطة الديناميكية وذكاء المدنيين أعلاه — كل منها تم التحقق منه بشكل مستقل؛ وهذا العنصر هو الإطار الجامع لها.",
      ],
    },
    evidence: "Composite of the independently-cited systems above.",
  },
  {
    id: "new-missions",
    number: "11",
    title: { en: "New Missions / Gameplay Expansions", ar: "مهام جديدة / توسعات في اللعب" },
    status: "IN_DEVELOPMENT",
    summary: {
      en: "Existing campaign missions gain real variety; wholly new missions are on the roadmap.",
      ar: "مهام الحملة الحالية اكتسبت تنوعًا حقيقيًا؛ ومهام جديدة بالكامل موجودة على خارطة الطريق.",
    },
    description: {
      en: "Eligible campaign missions can now randomly start you in a different vehicle each playthrough. Entirely new, non-original missions are a stated project goal, but were not found implemented in the current source.",
      ar: "المهام المؤهلة في الحملة يمكن الآن أن تبدأ بك عشوائيًا في مركبة مختلفة في كل محاولة. المهام الجديدة كليًا وغير الأصلية هدف معلن للمشروع، لكن لم يُعثر على تنفيذها في المصدر الحالي.",
    },
    details: {
      en: [
        "Real: eligible missions randomize the player's starting vehicle model (excludes free roam, on-foot-start missions, and an explicit exclusion list).",
        "Planned: brand-new mission content beyond the original four-city campaign.",
      ],
      ar: [
        "حقيقي: المهام المؤهلة تُعشّي موديل مركبة بداية اللاعب (باستثناء التجول الحر، والمهام التي تبدأ سيرًا على الأقدام، وقائمة استثناء صريحة).",
        "مخطط له: محتوى مهام جديد بالكامل يتجاوز حملة المدن الأربع الأصلية.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_RandomizeMissionStartCar. No new (non-original) mission files found.",
  },
  {
    id: "other-systems",
    number: "12",
    title: { en: "Other Systems", ar: "أنظمة أخرى" },
    status: "ACTIVE",
    summary: {
      en: "Smaller, real quality-of-life systems discovered alongside the headline features.",
      ar: "أنظمة أصغر وحقيقية لتحسين تجربة اللعب، اكتُشفت إلى جانب الميزات الرئيسية.",
    },
    description: {
      en: "A few additional systems exist that aren't part of the original headline list but are real and toggleable in-game.",
      ar: "توجد بضعة أنظمة إضافية ليست جزءًا من القائمة الرئيسية الأصلية، لكنها حقيقية ويمكن تفعيلها أو إيقافها داخل اللعبة.",
    },
    details: {
      en: [
        "A running count of police cars taken out of action during the current session, with an optional HUD toggle.",
        "An optional on-screen coordinate/location HUD, toggleable from the pause menu.",
      ],
      ar: [
        "عداد مستمر لعدد سيارات الشرطة التي تم تعطيلها خلال الجلسة الحالية، مع إمكانية إظهاره على الشاشة.",
        "شاشة اختيارية لعرض الإحداثيات/الموقع، يمكن تفعيلها من قائمة الإيقاف المؤقت.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: gCopsDisabledCount, gShowCopsDisabledHUD, gShowLocationHUD.",
  },
];
