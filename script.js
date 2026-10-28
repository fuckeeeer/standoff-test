/* =========================================================
   STANDOFF ТЕСТ — максимально научная логика
   ========================================================= */
(() => {
  "use strict";

  /* ---------------- утилиты ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (n) => Number(n).toLocaleString("ru-RU");

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const store = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem("sot_" + key);
        return v === null ? fallback : v;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("sot_" + key, String(value));
      } catch (e) {
        /* ну и ладно */
      }
    },
  };

  /* ---------------- данные ---------------- */
  const STAT_KEYS = ["skill", "veli", "meme", "skin", "toxic"];

  const STATS = [
    { key: "skill", label: "СКИЛЛ", color: "var(--lime)" },
    { key: "veli", label: "ВЕЛИ-ВАЙБ", color: "var(--yellow)" },
    { key: "meme", label: "ТИКТОК", color: "var(--cyan)" },
    { key: "skin", label: "СКИНЫ", color: "var(--pink)" },
    { key: "toxic", label: "ТОКСИЧНОСТЬ", color: "var(--purple)" },
  ];

  const RESULTS = {
    skill: {
      emoji: "🎯",
      color: "lime",
      title: "ПРО С ТАЧСКРИНОМ",
      tagline: "Ты играешь руками. И это, внезапно, работает.",
      text:
        "Пока остальные спорят, кто такой Вели, и снимают танцы в лобби, ты ставишь бомбу, держишь угол и делаешь четыре фрага с одним хп. " +
        "Тебя не любят в чате, но всегда берут в тиму. Твой скилл — единственное, что не лагает.",
      quote: "«Я не кемпер. Я тактический.»",
      badges: ["1х1 = 16:0", "Не кемпер, а тактик", "Пинг 12, ЧСВ 9000"],
    },
    veli: {
      emoji: "👑",
      color: "yellow",
      title: "ВЕЛИ-МЛАДШИЙ",
      tagline: "Ты не Вели. Но ты очень, очень стараешься.",
      text:
        "Ты знаешь все фразы, все перезарядки и все клипы. Ты смотрел его видео больше, чем играл сам. " +
        "Это не болезнь, это образ жизни. Лечится только новым видео — и, судя по расписанию, не скоро.",
      quote: "«Я не копирую Вели. Я его интерпретирую.»",
      badges: ["Смотрит вместо игры", "Знает все фразы", "«Изи» без причины"],
    },
    meme: {
      emoji: "📱",
      color: "cyan",
      title: "ТИКТОК-ФРАГГЕР",
      tagline: "Один выстрел — один клип. Иногда без выстрела.",
      text:
        "Ты играешь не в Standoff, ты играешь в контент. Фраг — это просто повод для монтажа, а смерть — драматический поворот. " +
        "Твой лучший раунд длился три секунды и набрал двенадцать лайков. Ты уже гордишься.",
      quote: "«Один выстрел — один клип. Клипов больше, чем выстрелов.»",
      badges: ["Танцует в лобби", "POV: я проиграл", "Смерть красивее игры"],
    },
    skin: {
      emoji: "💎",
      color: "pink",
      title: "СКИН-ИНВЕСТОР",
      tagline: "Скилл не купишь. А скин — да. Мы проверили.",
      text:
        "Ты не играешь, ты коллекционируешь. Твой инвентарь дороже твоего ММР, а лобби ты знаешь лучше, чем карты. " +
        "Умираешь первым, но красиво. Это тоже позиция. И она тебе идёт.",
      quote: "«Скилл купить нельзя. Скин — можно. Выбор очевиден.»",
      badges: ["Нож = личность", "Кейсы — инвестиция", "Умер первым, но красиво"],
    },
    toxic: {
      emoji: "💬",
      color: "purple",
      title: "ТОКСИК-ЛЕГЕНДА",
      tagline: "Ты не проигрываешь. Ты просто пишешь.",
      text:
        "Твой скилл в чате выше, чем в игре. Ты знаешь сорок способов назвать тиммейта ботом, и все сорок уже в истории матчей. " +
        "Однажды тебя замютят навсегда, и это будет лучший день в твоей жизни.",
      quote: "«Я не токсик. Я честный. Просто громко.»",
      badges: ["Мут 24/7", "Тиммейты — боты", "Флешка себе под ноги"],
    },
  };

  const RANKS = [
    { min: 0, name: "ПЛАСТИК 4", note: "Ты только что установил игру. Уже страдаешь." },
    { min: 2000, name: "СЕРЕБРО 2 (НА ОЩУПЬ)", note: "Ты знаешь карты. Карты не знают тебя." },
    { min: 3000, name: "ЗОЛОТО 1", note: "Стабильно. Как твой пинг в 2019." },
    { min: 4000, name: "ЗОЛОТО 3, НО ТЫ УВЕРЕН, ЧТО ГЛОБАЛ", note: "Уверенность — тоже скилл. Наверное." },
    { min: 5000, name: "МАСТЕР (В 2018)", note: "Ты был хорош. Тогда. Мы помним." },
    { min: 6000, name: "ЛЕГЕНДА. ИЛИ ЧИТЕР. МЫ НЕ ПРОВЕРЯЛИ.", note: "Скорее всего, ты просто много играешь. Но мы на всякий случай восхищаемся." },
    { min: 7000, name: "АККАУНТ ВЕЛИ?!", note: "Признавайся. Или хотя бы подпишись." },
  ];

  const TAGS = [
    "ВОПРОС ПРО ЖИЗНЬ",
    "СЕРЬЁЗНЫЙ ВОПРОС",
    "ТУТ БЕЗ ПОДВОХА",
    "ВОПРОС ОТ ВЕЛИ (НЕТ)",
    "НАУЧНЫЙ ВОПРОС",
    "ВОПРОС ИЗ ТИКТОКА",
    "ПРАВДА ИЛИ ПОЗОР",
    "ЭТО НЕ ТЕСТ, ЭТО ДИАГНОЗ",
    "СОВЕРШЕННО СЕКРЕТНО",
    "ВОПРОС НА 7500 ЧАСОВ",
  ];

  const REACTIONS = [
    "Вели бы кивнул. Может быть. Он занят.",
    "Это был выбор. Мы не осуждаем. Мы записываем.",
    "Тикток уже придумал для этого звук.",
    "Твой тиммейт это видел. Он всё расскажет.",
    "Смело. Глупо. Смело.",
    "Мы добавили это в твоё дело.",
    "Так делают все. И это грустно.",
    "Уровень стандоффа повышен на 0,3%.",
    "Где-то в Твери загрузился сервер.",
    "Ты только что стал на 1% более Вели.",
    "Это интерпретируется в твою пользу. Наверное.",
    "Скин за это не дадут. Прости.",
    "Чат это одобряет. Чат всегда одобряет.",
    "Наукой не доказано, но мы записали.",
    "Твой рейтинг ЧСВ вырос. Поздравляем.",
    "Хм. Мы ожидали худшего.",
    "Анализ завершён. Результат спорный.",
    "Ты уверен? Ладно, уже поздно.",
  ];

  const LOADER_MESSAGES = [
    "Подключаемся к серверам... (они в Твери)",
    "Догружаем 7500 часов чужого опыта...",
    "Ищем твой скилл... не найдено",
    "Открываем кейс... тебе выпал шок",
    "Синхронизируемся с ТикТоком...",
    "Проверяем, не Вели ли ты... нет",
    "Разогреваем нож...",
    "Спрашиваем разрешение у мамы...",
    "Считаем твой MMR... получилось смешно",
    "Всё готово. Наверное.",
  ];

  const QUESTIONS = [
    {
      q: "Ты заходишь в Standoff 2. Первое действие?",
      options: [
        { text: "Открываю кейсы. Даже если денег нет.", d: { skin: 3 } },
        { text: "Проверяю, не вышло ли новое видео у Вели.", d: { veli: 3 } },
        { text: "Записываю тикток с танцем в лобби.", d: { meme: 3 } },
        { text: "Пишу в чат «тиммейты боты» ещё до начала раунда.", d: { toxic: 3 } },
      ],
    },
    {
      q: "Твой любимый ствол?",
      options: [
        { text: "AWM. Один выстрел — один клип.", d: { meme: 2, skill: 1 } },
        { text: "AK-47. Дёшево, сердито, как в 2018.", d: { skill: 2, veli: 1 } },
        { text: "Нож. Я его выбил и показываю 40 минут в лобби.", d: { skin: 3 } },
        { text: "Любой, но с комментарием «ну это изи».", d: { toxic: 2, meme: 1 } },
      ],
    },
    {
      q: "Тиммейт не ставит бомбу. Твои действия?",
      options: [
        { text: "Ставлю сам. Молча. Как взрослый.", d: { skill: 2, veli: 1 } },
        { text: "Кидаю флешку ему под ноги. Для профилактики.", d: { toxic: 3 } },
        { text: "Записываю его фейл под грустную музыку.", d: { meme: 3 } },
        { text: "Выхожу в лобби — показывать новый скин.", d: { skin: 2, meme: 1 } },
      ],
    },
    {
      q: "Сколько у тебя часов в Standoff 2?",
      options: [
        { text: "12. Но я уже снял три тиктока.", d: { meme: 3 } },
        { text: "7500. Я не играю, я живу.", d: { skill: 2, veli: 1 } },
        { text: "Не считаю. Скины считаю.", d: { skin: 3 } },
        { text: "Часы? Я в комментариях под видео Вели.", d: { veli: 2, meme: 1 } },
      ],
    },
    {
      q: "В чате пишут «1х1». Ты...",
      options: [
        { text: "Соглашаюсь. Проигрываю. Говорю «лагало».", d: { meme: 2, toxic: 1 } },
        { text: "Соглашаюсь. Выигрываю 16:0.", d: { skill: 3 } },
        { text: "Пишу «пфф, лоу» и выхожу.", d: { toxic: 3 } },
        { text: "Соглашаюсь, если у меня новый скин.", d: { skin: 3 } },
      ],
    },
    {
      q: "Твой ник в игре?",
      options: [
        { text: "xXx_VeLi_2oo8_xXx", d: { veli: 3 } },
        { text: "🥀ТикТок🥀", d: { meme: 3 } },
        { text: "[SKIN]Инвестор", d: { skin: 3 } },
        { text: "Тот, кого все уже замутили", d: { toxic: 3 } },
      ],
    },
    {
      q: "Что делаешь, когда проигрываешь?",
      options: [
        { text: "Смотрю гайд. Не от Вели. Ладно, от Вели.", d: { veli: 2, skill: 1 } },
        { text: "Монтирую клип «я проиграл, но красиво».", d: { meme: 3 } },
        { text: "Пишу в чат «тиммейты боты».", d: { toxic: 3 } },
        { text: "Открываю кейс, чтобы успокоиться.", d: { skin: 3 } },
      ],
    },
    {
      q: "Твой идеальный раунд?",
      options: [
        { text: "Все умерли, у меня 1 хп, я захожу и делаю 4 фрага.", d: { skill: 3 } },
        { text: "Танцую в лобби, пока все играют.", d: { meme: 3 } },
        { text: "Умираю первым, но с самым дорогим ножом.", d: { skin: 3 } },
        { text: "Умираю первым и пишу 40 сообщений в чат.", d: { toxic: 3 } },
      ],
    },
    {
      q: "Как ты относишься к Вели?",
      options: [
        { text: "Кумир. Знаю все фразы. Даже перезарядку.", d: { veli: 3 } },
        { text: "Кто? Я смотрю только тиктоки.", d: { meme: 3 } },
        { text: "Я обогнал его по скинам.", d: { skin: 3 } },
        { text: "Я обогнал его по токсичности.", d: { toxic: 3 } },
      ],
    },
    {
      q: "Твоя главная цель в игре?",
      options: [
        { text: "Стать про. Настоящим. Без тиктока.", d: { skill: 3 } },
        { text: "Попасть в тикток. Хотя бы на три секунды.", d: { meme: 3 } },
        { text: "Собрать все ножи. Все.", d: { skin: 3 } },
        { text: "Чтобы все знали, какой я. И боялись.", d: { toxic: 3 } },
        { text: "Чтобы Вели заметил меня и сказал «норм».", d: { veli: 3 } },
      ],
    },
  ];

  const FINES = [
    "Мы ничего не сохранили. Шутка. Сохранили.",
    "MMR выдуман. Но ты всё равно расстроился.",
    "Покажи другу. Пусть тоже узнает.",
    "Можно пройти ещё раз. Результат уже знает.",
    "Результат не является медицинским диагнозом. Пока.",
    "Твой ранг в другой вселенной был бы выше. Наверное.",
  ];

  const CHAT_PAIRS = [
    ["Вели_фан_2011", "n-yellow", "кто видел новый клип Вели? я плакал"],
    ["ТикТок_бой", "n-cyan", "я снял тикток, как я умер. 3 лайка. огонь"],
    ["Скин_Инвестор", "n-pink", "продам нож за 500р, не банят, честно"],
    ["Тиммейт_Бот", "n-purple", "я не бот"],
    ["Кемпер2000", "n-lime", "сижу за ящиком 4 раунда, это тактика"],
    ["Модер", "n-red", "сообщение удалено. ты удалён."],
    ["Вели_фан_2011", "n-yellow", "ВЕЛИ ТУТ???"],
    ["Скин_Инвестор", "n-pink", "у меня 4 ножа и 0 скилла, зато красиво"],
    ["Новичок_2018", "n-cyan", "как открыть кейс бесплатно? мама не даёт денег"],
    ["Тиммейт_Бот", "n-purple", "тиммейты боты (я про себя)"],
    ["Кемпер2000", "n-lime", "кто в 1х1? я лоу, честно"],
    ["ТикТок_бой", "n-cyan", "танцую в лобби, не мешайте"],
    ["Скин_Инвестор", "n-pink", "я выбил нож! шутка"],
    ["Вели_фан_2011", "n-yellow", "Вели ответь мне, я 3 года жду"],
    ["Новичок_2018", "n-cyan", "почему мой ранг не растёт? я же смотрю гайды"],
    ["Модер", "n-red", "чат, вы все боты, кроме меня"],
    ["Тиммейт_Бот", "n-purple", "купил скин — стал играть хуже, но красивее"],
    ["Кемпер2000", "n-lime", "это тест или диагноз?"],
    ["ТикТок_бой", "n-cyan", "мой пинг 12, а ЧСВ 9000"],
    ["Вели_фан_2011", "n-yellow", "зашёл в тикток, вышел через 4 часа"],
  ];

  const BOT_REPLIES = [
    ["Модер", "n-red", "сообщение удалено. ты удалён."],
    ["Вели_фан_2011", "n-yellow", "ВЕЛИ, ТУТ ЧЕЛОВЕК!"],
    ["Тиммейт_Бот", "n-purple", "я не бот, ты бот"],
    ["Скин_Инвестор", "n-pink", "продам ответ за 500р"],
    ["Кемпер2000", "n-lime", "не пиши, я слушаю шаги"],
  ];

  const BG_EMOJIS = ["🔫", "💎", "📱", "🍪", "👑", "💀", "🎯", "🧍", "📦", "⭐", "🔪", "🎮"];

  /* ---------------- состояние ---------------- */
  const zeroScores = () => ({ skill: 0, veli: 0, meme: 0, skin: 0, toxic: 0 });

  const state = {
    screen: "loader",
    step: 0,
    deck: [],
    answers: [],
    scores: zeroScores(),
    locked: false,
    sound: store.get("sound", "1") !== "0",
    attempts: Number(store.get("attempts", "0")) || 0,
    result: null,
    loaderDone: false,
    loaderTimer: null,
    captchaDone: false,
    lootShown: false,
    lootTimeout: null,
    modalTimer: null,
    logoClicks: 0,
    online: 2281,
  };

  let audioCtx = null;

  /* ---------------- звук ---------------- */
  function beep(freq = 440, dur = 0.06, type = "square", vol = 0.035) {
    if (!state.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur + 0.02);
    } catch (e) {
      /* тишина, как в твоём чате */
    }
  }

  function playWin() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => beep(f, 0.13, "triangle", 0.05), i * 115);
    });
  }

  /* ---------------- тосты и модалки ---------------- */
  function toast(message) {
    const box = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 320);
    }, 3200);
  }

  function openModal(html) {
    const body = $("#modalBody");
    body.innerHTML = html;
    const modal = $("#modal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    return body;
  }

  function closeModal() {
    const modal = $("#modal");
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (state.modalTimer) {
      clearInterval(state.modalTimer);
      state.modalTimer = null;
    }
  }

  /* ---------------- экраны ---------------- */
  function showScreen(name) {
    state.screen = name;
    document.body.dataset.screen = name;
    $$(".screen").forEach((screen) => {
      screen.classList.toggle("active", screen.id === "screen-" + name);
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------------- загрузка ---------------- */
  function setLoaderProgress(p) {
    const fill = $("#loaderFill");
    const pct = $("#loaderPct");
    if (!fill || !pct) return;
    fill.style.width = p + "%";
    pct.textContent = Math.round(p) + "%";
  }

  function startLoader() {
    let p = 0;
    let msgIndex = 0;
    $("#loaderMsg").textContent = LOADER_MESSAGES[0];

    state.loaderTimer = setInterval(() => {
      p = Math.min(100, p + 2 + Math.random() * 7);
      setLoaderProgress(p);

      const nextIndex = Math.min(
        LOADER_MESSAGES.length - 1,
        Math.floor((p / 100) * LOADER_MESSAGES.length)
      );
      if (nextIndex !== msgIndex) {
        msgIndex = nextIndex;
        const msg = $("#loaderMsg");
        msg.style.opacity = "0";
        setTimeout(() => {
          msg.textContent = LOADER_MESSAGES[msgIndex];
          msg.style.opacity = "1";
        }, 120);
      }

      if (p >= 100) {
        clearInterval(state.loaderTimer);
        state.loaderTimer = null;
        setTimeout(() => {
          $("#loaderMain").classList.add("is-hidden");
          $("#captcha").classList.remove("is-hidden");
          beep(700, 0.08, "triangle", 0.04);
        }, 380);
      }
    }, 105);
  }

  function finishLoader() {
    if (state.loaderDone) return;
    state.loaderDone = true;
    if (state.loaderTimer) {
      clearInterval(state.loaderTimer);
      state.loaderTimer = null;
    }
    $("#loader").classList.add("is-hidden");
    showScreen("intro");
    beep(880, 0.1, "triangle", 0.05);
    setTimeout(() => toast("Добро пожаловать. Ты уже бот."), 400);
    scheduleCookie();
  }

  function initCaptcha() {
    const grid = $("#captchaGrid");
    const emojis = shuffle(["📦", "🧍", "🔫", "🌳", "🏠", "💎", "📱", "🍪", "🚪", "🎯", "👑", "💀"]).slice(0, 9);

    emojis.forEach((emoji) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "captcha-cell";
      cell.textContent = emoji;
      cell.setAttribute("aria-label", "Клетка " + emoji);
      cell.addEventListener("click", () => {
        if (state.captchaDone) return;
        cell.classList.toggle("sel");
        beep(cell.classList.contains("sel") ? 640 : 380, 0.04);
      });
      grid.appendChild(cell);
    });

    $("#captchaBtn").addEventListener("click", () => {
      if (state.captchaDone) return;
      state.captchaDone = true;
      const selected = $$(".captcha-cell.sel");
      if (!selected.length) {
        toast("Ты не выбрал ни одной клетки. Значит, ты кемпер. Пропускаем.");
      }
      $$(".captcha-cell").forEach((cell) => cell.classList.add("ok"));
      const btn = $("#captchaBtn");
      btn.disabled = true;
      btn.textContent = "ПРОВЕРКА ПРОЙДЕНА. ТЫ БОТ.";
      beep(520, 0.1, "triangle", 0.05);
      setTimeout(finishLoader, 800);
    });
  }

  /* ---------------- печеньки ---------------- */
  function scheduleCookie() {
    setTimeout(() => {
      if (!store.get("cookie") && state.screen === "intro") {
        $("#cookie").classList.add("show");
      }
    }, 1600);
  }

  function acceptCookies(message) {
    store.set("cookie", "1");
    $("#cookie").classList.remove("show");
    beep(540, 0.07);
    toast(message);
  }

  /* ---------------- тест ---------------- */
  function startQuiz() {
    clearTimeout(state.lootTimeout);
    state.lootTimeout = null;
    state.step = 0;
    state.answers = [];
    state.scores = zeroScores();
    state.locked = false;
    state.deck = QUESTIONS.map((q) => ({ ...q, options: shuffle(q.options) }));
    $("#cookie").classList.remove("show");
    $("#progressBar").setAttribute("aria-valuenow", "0");
    document.title = "Тест идёт | STANDOFF ТЕСТ";
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = state.deck[state.step];
    if (!q) return;

    $("#qNow").textContent = state.step + 1;
    $("#qTotal").textContent = state.deck.length;
    $("#qTag").textContent = pick(TAGS);
    $("#qText").textContent = q.q;

    const pct = (state.step / state.deck.length) * 100;
    $("#progressFill").style.width = pct + "%";
    $("#progressBar").setAttribute("aria-valuenow", String(Math.round(pct)));

    const reply = $("#qReaction");
    reply.classList.remove("show");
    reply.textContent = "";

    const box = $("#qOptions");
    box.innerHTML = "";

    q.options.forEach((option, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";

      const key = document.createElement("span");
      key.className = "key";
      key.textContent = "АБВГД"[i] || String(i + 1);

      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option.text;

      btn.append(key, text);
      btn.addEventListener("click", () => choose(option, btn));
      box.appendChild(btn);
    });
  }

  function addPlus(btn, delta) {
    const best = Object.entries(delta).sort((a, b) => b[1] - a[1])[0];
    if (!best) return;
    const shortLabels = {
      skill: "СКИЛЛ",
      veli: "ВЕЛИ",
      meme: "ТИКТОК",
      skin: "СКИНЫ",
      toxic: "ТОКС",
    };
    const span = document.createElement("span");
    span.className = "plus";
    span.setAttribute("aria-hidden", "true");
    span.textContent = "+" + best[1] + " " + (shortLabels[best[0]] || "ОЧКОВ");
    btn.appendChild(span);
    setTimeout(() => span.remove(), 950);
  }

  function choose(option, btn) {
    if (state.locked) return;
    state.locked = true;
    state.answers.push(option);

    Object.entries(option.d).forEach(([key, value]) => {
      if (typeof state.scores[key] === "number") state.scores[key] += value;
    });

    $$(".option").forEach((el) => {
      el.disabled = true;
      if (el !== btn) el.classList.add("is-dim");
    });
    btn.classList.add("is-picked");
    const reply = $("#qReaction");
    reply.textContent = "💬 " + pick(REACTIONS);
    reply.classList.add("show");
    addPlus(reply, option.d);

    beep(pick([560, 640, 720]), 0.055);

    const pct = ((state.step + 1) / state.deck.length) * 100;
    $("#progressFill").style.width = pct + "%";
    $("#progressBar").setAttribute("aria-valuenow", String(Math.round(pct)));

    setTimeout(() => {
      if (state.screen !== "quiz") return;
      state.step += 1;
      state.locked = false;
      if (state.step >= state.deck.length) {
        finishQuiz();
      } else {
        renderQuestion();
      }
    }, 730);
  }

  function finishQuiz() {
    showResult({ ...state.scores });
  }

  function buildResult(scores) {
    const priority = { skill: 5, veli: 4, meme: 3, skin: 2, toxic: 1 };
    const dominant = STAT_KEYS.slice().sort((a, b) => {
      const diff = scores[b] - scores[a];
      if (diff !== 0) return diff;
      return priority[b] - priority[a];
    })[0];

    const base = RESULTS[dominant] || RESULTS.skill;
    const total = STAT_KEYS.reduce((sum, key) => sum + (scores[key] || 0), 0);

    let mmr = Math.round(
      700 +
        scores.skill * 380 +
        scores.veli * 90 +
        scores.meme * 60 +
        scores.skin * 45 +
        scores.toxic * 30 +
        Math.random() * 350
    );
    mmr = Math.max(777, mmr);

    const rank = RANKS.slice().reverse().find((r) => mmr >= r.min) || RANKS[0];

    const extra = [];
    if (scores.skin >= 8) extra.push("Инвентарь дороже ММР");
    if (scores.toxic >= 8) extra.push("Мут в чате (заслуженно)");
    if (scores.meme >= 8) extra.push("Клип снят, лайков 12");
    if (scores.veli >= 8) extra.push("Знает все фразы Вели");
    if (scores.skill >= 8) extra.push("1х1 = 16:0");
    if (!extra.length) extra.push(pick(["Стабильность (плохая)", "Ни рыба ни мясо, зато со скином", "Средне. Как все."]));

    const badges = base.badges.concat(extra).slice(0, 5);
    const maxValue = Math.max(1, ...STAT_KEYS.map((key) => scores[key] || 0));

    const stats = STATS.map((stat) => {
      const val = scores[stat.key] || 0;
      return {
        ...stat,
        val,
        pct: clamp(Math.round((val / maxValue) * 100), 4, 100),
      };
    });

    return { ...base, key: dominant, mmr, rank, stats, badges, total };
  }

  function renderResult(result) {
    state.result = result;

    $("#resEmoji").textContent = result.emoji;
    $("#resEmoji").style.background = "var(--" + result.color + ")";
    $("#resTitle").textContent = result.title;
    $("#resTagline").textContent = result.tagline;
    $("#resText").textContent = result.text;
    $("#resRank").textContent = result.rank.name + " — " + result.rank.note;
    $("#resQuote").textContent = result.quote;
    $("#resFine").textContent =
      "Попытка №" + state.attempts + ". " + pick(FINES) + " Очков величия: " + result.total + "/30.";

    const mmrEl = $("#resMmr");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      mmrEl.textContent = fmt(result.mmr);
    } else {
      const duration = 950;
      const started = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        mmrEl.textContent = fmt(Math.round(result.mmr * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const statsBox = $("#resStats");
    statsBox.innerHTML = "";
    result.stats.forEach((stat) => {
      const row = document.createElement("div");
      row.className = "stat-row";

      const label = document.createElement("span");
      label.className = "stat-label";
      label.textContent = stat.label;

      const track = document.createElement("div");
      track.className = "stat-track";
      const fill = document.createElement("div");
      fill.className = "stat-fill";
      fill.style.setProperty("--c", stat.color);
      track.appendChild(fill);

      const value = document.createElement("span");
      value.className = "stat-val";
      value.textContent = stat.val;

      row.append(label, track, value);
      statsBox.appendChild(row);

      requestAnimationFrame(() => {
        setTimeout(() => {
          fill.style.width = stat.pct + "%";
        }, 80);
      });
    });

    const badgesBox = $("#resBadges");
    badgesBox.innerHTML = "";
    result.badges.forEach((badge) => {
      const el = document.createElement("span");
      el.className = "badge";
      el.textContent = badge;
      badgesBox.appendChild(el);
    });
  }

  function showResult(scores) {
    const result = buildResult(scores);
    state.attempts += 1;
    store.set("attempts", state.attempts);
    const counter = $("#attemptsCount");
    if (counter) counter.textContent = state.attempts;

    $("#cookie").classList.remove("show");

    showScreen("result");
    renderResult(result);
    document.title = "Ты — " + result.title + " | STANDOFF ТЕСТ";

    playWin();
    confetti();
    clearTimeout(state.lootTimeout);
    state.lootTimeout = setTimeout(showLoot, 12000);
  }

  function randomRun() {
    const scores = zeroScores();
    QUESTIONS.forEach((q) => {
      const option = pick(q.options);
      Object.entries(option.d).forEach(([key, value]) => {
        scores[key] += value;
      });
    });
    showResult(scores);
  }

  /* ---------------- конфетти ---------------- */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = $("#confetti");
    const emojis = ["🎉", "💎", "🔫", "👑", "📱", "💀", "🧠", "🍪", "⭐", "🥇"];
    const mobile = window.innerWidth < 560;
    const count = mobile ? 18 : 40;

    for (let i = 0; i < count; i += 1) {
      const span = document.createElement("span");
      span.textContent = pick(emojis);
      span.style.left = Math.random() * 100 + "vw";
      span.style.fontSize =
        (mobile ? 0.7 + Math.random() * 0.8 : 1 + Math.random() * 1.5) + "rem";
      span.style.animationDuration =
        (mobile ? 1.4 + Math.random() * 1.1 : 1.6 + Math.random() * 1.6) + "s";
      span.style.animationDelay = Math.random() * 0.35 + "s";
      box.appendChild(span);
      setTimeout(() => span.remove(), 3600);
    }
  }

  /* ---------------- лут-модалка ---------------- */
  function showLoot() {
    if (state.screen !== "result" || state.lootShown) return;
    state.lootShown = true;

    const body = openModal(
      '<h3 id="modalTitle">ТЫ ВЫИГРАЛ НОЖ! 🔪</h3>' +
        "<p>Поздравляем! Ты — 1 000 000-й посетитель сайта. Нож уже летит к тебе. Курьер — Вели. Он немного занят.</p>" +
        '<p class="loot-timer">Доставка через <b id="lootTimer">7</b> сек.</p>' +
        '<button class="btn btn-primary" id="lootBtn" type="button">ЗАБРАТЬ НОЖ</button>'
    );

    let seconds = 7;
    state.modalTimer = setInterval(() => {
      seconds -= 1;
      const timer = document.getElementById("lootTimer");
      if (!timer) return;
      if (seconds <= 0) {
        clearInterval(state.modalTimer);
        state.modalTimer = null;
        const parent = timer.parentElement;
        if (parent) parent.textContent = "Доставка задерживается. Как и твой ранг.";
        return;
      }
      timer.textContent = String(seconds);
    }, 1000);

    const lootBtn = $("#lootBtn");
    if (lootBtn) {
      lootBtn.addEventListener("click", () => {
        if (state.modalTimer) {
          clearInterval(state.modalTimer);
          state.modalTimer = null;
        }
        body.innerHTML =
          '<h3 id="modalTitle">НОЖ УШЁЛ К ДРУГОМУ</h3>' +
          "<p>Но ты получил опыт. Опыт: 0. Зато ты узнал, что такое надежда.</p>" +
          '<button class="btn btn-ghost" data-close type="button">ЛАДНО</button>';
        beep(300, 0.12, "sawtooth", 0.04);
      });
    }
  }

  /* ---------------- шаринг ---------------- */
  async function shareResult() {
    const result = state.result;
    if (!result) return;

    const text =
      "Мой приговор: «" +
      result.title +
      "». MMR: " +
      fmt(result.mmr) +
      " (по версии сайта). А ты кто? Тест «Насколько ты стандовчик?»" +
      (/^https?:$/.test(location.protocol) ? " " + location.href : "");

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch && navigator.share) {
      try {
        await navigator.share({ title: "Тест на стандовчика", text });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }

    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(text);
      toast("Скопировано! Отправь другу — пусть тоже страдает.");
      beep(620, 0.08);
    } catch (e) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.top = "0";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        toast("Скопировано (по-старинке).");
      } catch (err) {
        toast("Не получилось скопировать. Просто скажи другу: «я легенда».");
      }
      area.remove();
    }
  }

  /* ---------------- чат ---------------- */
  function addChat(name, cls, text, own = false) {
    const body = $("#chatBody");
    if (!body) return;

    const msg = document.createElement("div");
    msg.className = "chat-msg" + (own ? " own" : "");

    if (own) {
      msg.textContent = "Ты: " + text;
    } else {
      const nick = document.createElement("b");
      nick.className = cls;
      nick.textContent = name + ": ";
      msg.append(nick, document.createTextNode(text));
    }

    body.appendChild(msg);
    while (body.children.length > 30) body.firstElementChild.remove();
    body.scrollTop = body.scrollHeight;
  }

  function initChat() {
    for (let i = 0; i < 6; i += 1) {
      const pair = CHAT_PAIRS[i];
      addChat(pair[0], pair[1], pair[2]);
    }

    setInterval(() => {
      const pair = pick(CHAT_PAIRS);
      addChat(pair[0], pair[1], pair[2]);
    }, 9000);

    $("#chatToggle").addEventListener("click", () => {
      const chat = $("#chat");
      chat.classList.toggle("open");
      if (chat.classList.contains("open")) {
        beep(600, 0.05);
        const body = $("#chatBody");
        body.scrollTop = body.scrollHeight;
      }
    });

    $("#chatClose").addEventListener("click", () => {
      $("#chat").classList.remove("open");
    });

    $("#chatForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("#chatInput");
      const text = input.value.trim();
      if (!text) {
        toast("Напиши хоть что-нибудь. Как в жизни.");
        return;
      }
      addChat("Ты", "", text, true);
      input.value = "";
      beep(700, 0.05);

      setTimeout(() => {
        const reply = pick(BOT_REPLIES);
        addChat(reply[0], reply[1], reply[2]);
        beep(420, 0.05);
      }, 850);
    });
  }

  /* ---------------- фон ---------------- */
  function initBackground() {
    const box = $("#bgEmojis");
    for (let i = 0; i < 16; i += 1) {
      const span = document.createElement("span");
      span.textContent = pick(BG_EMOJIS);
      span.style.left = Math.random() * 96 + "vw";
      span.style.top = Math.random() * 92 + "vh";
      span.style.fontSize = 2 + Math.random() * 4 + "rem";
      span.style.animationDuration = 7 + Math.random() * 14 + "s";
      span.style.animationDelay = -Math.random() * 10 + "s";
      box.appendChild(span);
    }
  }

  /* ---------------- прочее ---------------- */
  function updateSoundButton() {
    const btn = $("#soundBtn");
    btn.textContent = state.sound ? "🔊" : "🔇";
    btn.setAttribute("aria-pressed", state.sound ? "true" : "false");
    btn.title = state.sound ? "Звук включён. Выключить?" : "Звук выключен. Включить?";
  }

  function initSound() {
    updateSoundButton();
    $("#soundBtn").addEventListener("click", () => {
      state.sound = !state.sound;
      store.set("sound", state.sound ? "1" : "0");
      updateSoundButton();
      if (state.sound) {
        beep(660, 0.08);
        toast("Звук включён. Теперь ты не отвертишься.");
      } else {
        toast("Звук выключен. Тишина, как в твоём чате.");
      }
    });
  }

  function initModal() {
    $("#modalX").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (event) => {
      if (event.target === $("#modal")) closeModal();
    });
    $("#modalBody").addEventListener("click", (event) => {
      if (event.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function initJokes() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-joke]");
      if (!btn) return;
      toast(btn.dataset.joke);
      beep(300, 0.05, "sawtooth", 0.025);
    });

    $("#logo").addEventListener("click", (event) => {
      event.preventDefault();
      state.logoClicks += 1;
      beep(380 + state.logoClicks * 70, 0.05);
      if (state.logoClicks >= 5) {
        state.logoClicks = 0;
        document.body.classList.toggle("party");
        toast("🎉 ПАРТИ-РЕЖИМ. Как в лобби, только бесплатно.");
      }
    });
  }

  function initFaqModals() {
    $("#btnHow").addEventListener("click", () => {
      beep(540, 0.05);
      openModal(
        '<h3 id="modalTitle">КАК ЭТО РАБОТАЕТ</h3>' +
          "<p><b>1.</b> Ты отвечаешь на 10 вопросов. Вопросы серьёзные. Ответы — нет.</p>" +
          "<p><b>2.</b> Мы считаем скилл, Вели-вайб, тикток, скины и токсичность. Наука!</p>" +
          "<p><b>3.</b> Ты получаешь приговор. Он не обжалуется. Но можно пройти ещё раз.</p>" +
          "<p><b>4.</b> Показываешь результат другу. Друг проходит. Вы ссоритесь. Всё как в жизни.</p>" +
          '<button class="btn btn-primary" data-close type="button">ПОНЯТНО (НЕТ)</button>'
      );
    });

    $("#btnPrivacy").addEventListener("click", () => {
      openModal(
        '<h3 id="modalTitle">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h3>' +
          "<p>Мы не собираем твои данные. Нам нечем. У сайта нет бэкенда, только честное слово и печеньки.</p>" +
          "<p>Мы собираем: твой MMR (выдуманный), количество попыток (в localStorage) и твоё доверие (зря).</p>" +
          "<p>Трекинг? Нет. Аналитика? Нет. Печеньки? 731 штука, они уже внутри.</p>" +
          '<button class="btn btn-primary" data-close type="button">ПОНЯТНО</button>'
      );
    });

    $("#btnAbout").addEventListener("click", () => {
      openModal(
        '<h3 id="modalTitle">О САЙТЕ</h3>' +
          "<p>Это пародийный тест, сделанный на честном слове, тиктоке и 7500 часах чужих фейлов.</p>" +
          "<p>Мы не связаны с Axlebolt, Standoff 2, Вели, ТикТоком и реальностью. Мы вообще ни с чем не связаны, у нас отпуск.</p>" +
          "<p>Все совпадения случайны. Ножи не настоящие. MMR выдуманный. Ты — молодец.</p>" +
          '<button class="btn btn-primary" data-close type="button">ЛАДНО</button>'
      );
    });
  }

  function initDeepLink() {
    const route = location.hash.replace("#", "");
    const valid = ["intro", "quiz", "result"];
    if (!valid.includes(route)) return false;

    $("#loader").classList.add("is-hidden");
    state.loaderDone = true;

    if (route === "intro") {
      showScreen("intro");
      scheduleCookie();
    } else if (route === "quiz") {
      startQuiz();
    } else {
      randomRun();
    }
    return true;
  }

  /* ---------------- запуск ---------------- */
  function init() {
    const passed = 148921;
    $("#passedCount").textContent = fmt(passed);
    $("#onlineCount").textContent = fmt(state.online);
    $("#attemptsCount").textContent = state.attempts;

    setInterval(() => {
      state.online = clamp(state.online + rand(21) - 10, 1800, 3100);
      $("#onlineCount").textContent = fmt(state.online);
    }, 4500);

    initBackground();
    initCaptcha();
    initChat();
    initSound();
    initModal();
    initJokes();
    initFaqModals();

    $("#loaderSkip").addEventListener("click", finishLoader);

    $("#btnStart").addEventListener("click", () => {
      beep(760, 0.08);
      startQuiz();
    });

    $("#btnRandom").addEventListener("click", () => {
      beep(500, 0.07);
      randomRun();
    });

    $("#btnQuit").addEventListener("click", () => {
      showScreen("intro");
      document.title = "НАСКОЛЬКО ТЫ СТАНДОВЧИК? — максимально научный тест";
      toast("Ты вышел. Но тест вышел из тебя не полностью.");
    });

    $("#btnShare").addEventListener("click", shareResult);

    $("#btnAgain").addEventListener("click", () => {
      beep(660, 0.07);
      startQuiz();
    });

    $("#cookieYes").addEventListener("click", () => {
      acceptCookies("Ты согласился на всё. Даже на это.");
    });

    $("#cookieAlso").addEventListener("click", () => {
      acceptCookies("Печеньки приняты. Остальное мы всё равно взяли.");
    });

    document.addEventListener("keydown", (event) => {
      if (state.screen !== "quiz" || state.locked) return;
      const n = Number(event.key);
      if (n >= 1 && n <= 5) {
        const options = $$(".option");
        if (options[n - 1]) options[n - 1].click();
      }
    });

    if (!initDeepLink()) startLoader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
