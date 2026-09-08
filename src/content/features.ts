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
      en: "Fuel runs out and affects vehicle performance — refuel or you will be stranded on the road.",
      ar: "الوقود ينفد ويتأثر أداء السيارة — أعد التزود أو ستتعطل في الطريق.",
    },
    description: {
      en: "Fuel is now a real gameplay system for every vehicle, with its own live fuel gauge. When you switch vehicles, the new vehicle starts with a randomized fuel level. The gauge is interactive: pressing X consumes a small amount of fuel, while O consumes noticeably more because it performs a burnout or drift.",
      ar: "الوقود أصبح نظام لعب حقيقيًا لكل مركبة عداد وقود حقيقي خاص بها. عند تبديل المركبة يكون مستوى الوقود في المركبة الجديدة عشوائيًا. العداد تفاعلي: الضغط على X يستهلك كمية بسيطة من الوقود، بينما O يستهلك كمية أكبر بوضوح لأنه يُنفّذ حركة Burnout أو انزلاق.",
    },
    details: {
      en: [
        "Running out of fuel during a pursuit unlocks an emergency exit, allowing you to get out and take another vehicle.",
        "Service stations fully repair damage and refill fuel when you drive through them, but the stations do not work during a pursuit.",
        "Fuel effects can also be triggered directly during a live stream by linking TikTok gifts.",
      ],
      ar: [
        "نفاد الوقود أثناء المطاردة يفتح خيار خروج طارئ يمكنك النزول والاستيلاء على سيارة جديدة.",
        "محطات الخدمة تصلح التلف وتعبئ الوقود بالكامل من خلال المرور بها ولكن المحطات لاتعمل اثناء المطاردة.",
        "يمكن أيضًا تفعيل تأثيرات الوقود مباشرة أثناء البث عبر ربط تيك توك بالهدايا.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h + sandbox.c: Sandbox_PlayerFuel, Sandbox_{Add,Drain,ForceFuelEmpty}Fuel, Sandbox_EmergencyExitAllowed.",
  },
  {
    id: "dynamic-police",
    number: "02",
    title: { en: "Smart Police", ar: "الشرطة الذكية" },
    status: "ACTIVE",
    summary: {
      en: "Police play tactical roles rather than simply increasing in number, and become more aggressive as the pursuit level rises.",
      ar: "الشرطة تلعب أدوارًا تكتيكية وليست مجرد أعداد — وتزداد عدوانية مع ارتفاع درجة الملاحقة.",
    },
    description: {
      en: "Police AI is no longer uniform across all police cars. The system assigns each police car a tactical role, such as interception or flanking, and its aggression scales directly with the current pursuit level.",
      ar: "ذكاء الشرطة الاصطناعي لم يعد موحدًا لجميع سيارات الشرطة. النظام اصبح يسند لكل سيارة شرطة دور تكتيكي اعتراض أو تطويق ومدى عدوانيتها يتناسب مباشرة مع درجة الملاحقة الحالية.",
    },
    details: {
      en: [
        "Tactical formulas are applied to each police car for interception or flanking, with their behavior scaled according to the pursuit level.",
        "The formula is simple: the longer the pursuit lasts, the more intense and intelligent the police become, whether in maneuvering, planning, or even the number of cars.",
        "",
      ],
      ar: [
        "يتم تطبيق معادلات تكتيكية لكل سيارة شرطة (اعتراض / تطويق) في كل عملية بحيث تتناسب مع درجة الملاحقة.",
        "المعادلة سهلة كلما زاد وقت المطاردة زادت حدة وذكاء سيارات الشرطة سواءً في المناورة او التخطيط او حتى عدد السيارات",
        "",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_CopTactics(), gSandboxBatterTrigger (replaces the original hardcoded value in cop_ai.c's ControlCops()).",
  },
  {
    id: "police-roadblocks",
    number: "03",
    title: { en: "More Police Cars", ar: "زيادة عدد سيارات الشرطة" },
    status: "ACTIVE",
    summary: {
      en: "Built around the original game's roadblock cars and expanded into a dynamic police reinforcement system.",
      ar: "مبنية على سيارات الحواجز في اللعبة الأصلية، ويجري توسيعها لتصبح طلبات ديناميكية.",
    },
    description: {
      en: "The number of police cars increases gradually according to the type and duration of the pursuit. In the original game, only two active police cars could be present at most in the state; with the increased police-car system, the number can now expand according to the situation.",
      ar: "زيادة عدد سيارات الشرطة تدريجيا حسب نوع المطاردة ومدتها كلما طال وقت المطاردة ازدادت اعداد سيارات الشرطة, في نظام اللعبة الاصلي كان اقصى عدد لسيارات شرطة فعالة في الحالة سيارتين فقط كاقصى حد ولكن مع نظام زيادة سيارات الشرطة اصبح العدد مفتوحاً على حسب الحالة",
    },
    details: {
      en: [
        "The number of police cars is sometimes kept from becoming too large in order to protect the game engine from crashing.",
        "Larger numbers of police cars add another layer of challenge and excitement to the game.",
      ],
      ar: [
        "اعداد سيارات الشرطة احياناً لايصل الى عدد كبير جدا لحماية محرك اللعبة من الانهيار",
        "الاعداد الكبيرة لسيارات الشرطة اضاف نوعا من التحدي والمتعة الى اللعبة ",
      ],
    },
    evidence:
      "src_rebuild/Game/C/cars.h: IS_ROADBLOCK_CAR macro; civ_ai.c: requestRoadblock; civrevenge.c/.h reference the 'vanilla roadblock-car-touched-by-player conversion.'",
  },
  {
    id: "civilian-revenge",
    number: "04",
    title: { en: "Civilian Revenge", ar: "انتقام المدنيين" },
    status: "ACTIVE",
    summary: {
      en: "Hit or sideswipe a civilian, and they can turn into a real pursuer.",
      ar: "اصدم مدني او اشطفه ، وسيتحول إلى ملاحق حقيقي لك.",
    },
    description: {
      en: "Hit or sideswipe a civilian, and they can turn into a real pursuer.",
      ar: "اصدم مدني او اشطفه ، وسيتحول إلى ملاحق حقيقي لك",
    },
    details: {
      en: [
        "Only one civilian will seek revenge at a time by design, preventing chaos and unlimited pursuits.",
        "It can be enabled or disabled from the pause menu for a calmer free-roam experience when needed.",
      ],
      ar: [
        "مدني واحد فقط سينتقم منك في نفس الوقت حسب التصميم كي لانسبب فوضى وملاحقات غير محدودة.",
        "يمكن تفعيله أو إيقافه من قائمة الإيقاف المؤقت، لتجربة تجوّل حر أكثر هدوءًا عند الحاجة.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/civrevenge.c/.h: CivRevenge_OnContact, CivRevenge_Update; sandbox.h: gCitizenAngerEnabled.",
  },
  {
    id: "civilian-ai",
    number: "05",
    title: { en: "Civilian AI", ar: "ذكاء المدنيين" },
    status: "ACTIVE",
    summary: {
      en: "Traffic reacts to nearby pursuits, and the city's vehicle mix can vary.",
      ar: "حركة المرور تتفاعل مع المطاردات القريبة منها، ومزيج المركبات في المدينة يمكن أن يتنوع.",
    },
    description: {
      en: "Civilian drivers near an active police pursuit react to it. Sometimes they try to stop you, while at other times they move away from you.",
      ar: "السائقون المدنيون القريبون من مطاردة شرطة نشطة يتفاعلون معها، فاحيان يحاولون ايقافك واحيان اخرى يبتعدون عنك",
    },
    details: {
      en: [
        "Nearby civilian vehicles are steered and pushed in reaction to active pursuits.",
      ],
      ar: [
        "يتم توجيه دفع/انعطاف السيارات المدنية القريبة كرد فعل على المطاردات النشطة.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_CivPanic, Sandbox_CivModelPick, Sandbox_InitMixedResidentPool, gGuestCity.",
  },
  {
    id: "garage-repair",
    number: "06",
    title: { en: "Repair Stations", ar: "محطات الإصلاح" },
    status: "ACTIVE",
    summary: {
      en: "Repair stations fully repair damage and refill fuel when you drive through them.",
      ar: "محطات الاصلاح تصلح التلف بالكامل وتعبئ الوقود من خلال المرور بنقاط الاصلاح.",
    },
    description: {
      en: "Driving through a service station repairs your vehicle's damage and increases its fuel at the same time.",
      ar: "المرور من محطة خدمة يصلح تلف سيارتك ويزيد وقودها بنفس الوقت ",
    },
    details: {
      en: [
        "A full repair removes structural damage, restores the vehicle's clean appearance, and refills the fuel.",
        "During a pursuit, you cannot repair the vehicle or refill its fuel.",
      ],
      ar: [
        "الإصلاح الكامل يزيل التلف الهيكلي ، ويعيد بناء شكل السيارة النظيف، ويعبئ الوقود.",
        "انتبه اثناء المطاردة لايمكنك اصلاح السيارة او تعئبة وقودها",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_RepairCarDamage, Sandbox_DoFullRepair (service-station flow).",
  },
  {
    id: "emergency_exit",
    number: "07",
    title: { en: "Emergency Exit", ar: "الخروج الطارئ" },
    status: "ACTIVE",
    summary: {
      en: "An emergency exit system activates when the vehicle runs out of fuel.",
      ar: "نظام خروج طارئ في حال نفد الوقود ",
    },
    description: {
      en: "The emergency exit system lets you leave your vehicle during a pursuit and replace it with another vehicle, but only when the fuel has run out.",
      ar: "نظام الخروج الطارئ يمكنك من الخروج من سيارتك اثناء المطاردة واستبدالها بسيارة اخرى في حال نفد الوقود فقط",
    },
    details: {
      en: [
        "If you leave the vehicle during a pursuit, you have only 12 seconds to steal another vehicle before you are arrested.",
      ],
      ar: [
        "انتبه في حال الخروج من السيارة اثناء المطاردة لديك 12 ثانية فقط لسرقة سيارة اخرى قبل القاء القبض عليك.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h + sandbox.c: Sandbox_EmergencyExitAllowed and the zero-fuel pursuit exit path.",
  },
  {
    id: "live-interaction",
    number: "08",
    title: { en: "TikTok Live Gift System", ar: "نظام هدايا بث TikTok" },
    status: "ACTIVE",
    summary: {
      en: "Not a reward system — a real link between a live stream and the game itself.",
      ar: "ليس نظام مكافآت — بل رابط حقيقي بين لحظة بث مباشر واللعبة نفسها.",
    },
    description: {
      en: "The TikTok live-stream integration allows gifts sent by viewers during a TikTok live stream to trigger real effects inside the game, such as increasing fuel, repairing the car, damaging the car, increasing speed, slowing speed, and more.",
      ar: "نظام الربط مع البث المباشر لمنصة TikTok الهدايا التي يرسلها المشاهدون أثناء بث تيك توك المباشر يمكن أن تُحدث تأثيرات حقيقية داخل اللعبة، مثل .زيادة الوقود , اصلاح السيارة , تخريب السيارة, زيادة السرعة, ابطاء السرعة والمزيد.",
    },
    details: {
      en: [
        "A dedicated and simple bridge process transfers TikTok Live gift events into the running game.",
        "Simply install TikFinity, sign in with your TikTok account, enable the link in the game application, and enjoy the gifts.",
        "No TikFinity subscription is required; just install the free application and the connection will work.",
      ],
      ar: [
        "توجد عملية ربط مخصصة وسهلة لنقل أحداث هدايا بث تيك توك المباشر إلى اللعبة أثناء تشغيلها.",
        "فقط حمل تطبيق TikFinity وسجل دخول بحساب تيك توك الخاص بك وفعل الربط في تطبيق اللعبة واستمتع بالهدايا",
        "لايتطلب اشتراك في تطبيق TikFinity فقط حمل التطبيق بشكل مجاني وسيتم الربط ",
      ],
    },
    evidence:
      'src_rebuild/Game/C/interactive.c: Event 13 ("ROSE FUEL", TikTok Rose gift, giftId 5655); DD2_COMMERCIAL/TikTokBridge/.',
  },
  {
    id: "dynamic-world",
    number: "09",
    title: { en: "Police Counter", ar: "عداد الشرطة" },
    status: "ACTIVE",
    summary: {
      en: "A counter at the top of the screen shows the number of police cars destroyed or escaped from.",
      ar: "نظام لمعرفة عدد سيارات الشرطة المدمرة او التي افلت منها.",
    },
    description: {
      en: "The Police Counter is a simple counter at the top of the screen that lets you see how many police cars you have destroyed or escaped from.",
      ar: "نظام عداد الشرطة هو باختصار عداد في اعلى الشاشة يمكنك من معرفة اعداد سيارات الشرطة المدمرة او التي افلتت منها ",
    },
    details: {
      en: [
        "Challenge yourself and break records for the number of police cars destroyed or lost.",
        "You can disable this system or counter from the pause menu: Police Counter → Off.",
      ],
      ar: [
        "تحدى نفسك وحطم ارقام قياسية في عدد سيارات الشرطة المدمرة او الضائعه",
        "يمكنك اغلاق هذا النظام او العداد من قائمة التوقف - عداد الشرطة - ايقاف",
      ],
    },
    evidence: "Composite of the independently-cited systems above.",
  },
  {
    id: "new-missions",
    number: "10",
    title: { en: "New Missions and Gameplay Expansions", ar: "مهام جديدة وتوسعات في اللعب" },
    status: "IN_DEVELOPMENT",
    summary: {
      en: "New missions and gameplay expansions are coming soon.",
      ar: "مهام جديدة وتوسعات باللعبة قادمة قريباً.",
    },
    description: {
      en: "New missions have already been added, but they are still being evaluated, adjusted, and worked on to improve the overall experience.",
      ar: "مهام جديدة تمت اضافتها بالفعل ولكن جاري تقييمها وتعديلها والعمل عليها لتحسين التجربة بالكامل",
    },
    details: {
      en: [
        "This feature is still under development and being created.",
        "Planned: completely new mission content for the original four cities.",
      ],
      ar: [
        "مازالت هذه الميزة قيد التطوير والصناعة .",
        "مخطط له: محتوى مهام جديد بالكامل للمدن الأربع الأصلية.",
      ],
    },
    evidence:
      "src_rebuild/Game/C/sandbox.h: Sandbox_RandomizeMissionStartCar. No new (non-original) mission files found.",
  },
  ];