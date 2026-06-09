// ==================== データ定義 ====================
const iAdjModify = [
    { word: "おいしい", noun: "料理", meaning: "delicious meal" },
    { word: "たかい", noun: "ビル", meaning: "tall building" },
    { word: "あつい", noun: "コーヒー", meaning: "hot coffee" }
];

const naAdjModify = [
    { stem: "きれい", noun: "部屋", meaning: "clean room" },
    { stem: "しずか", noun: "公園", meaning: "quiet park" },
    { stem: "べんり", noun: "アプリ", meaning: "convenient app" }
];

const iPredicate = ["おいしいです", "たかいです", "あついです"];
const naPredicate = ["きれいです", "しずかです", "べんりです"];

// 問題集
const quizBank = [
    { q_ja: "きれい (  ) 部屋", q_en: "kirei (  ) heya", correct: "な", hint: "ナ形容詞の修飾 / na-adjective modifier" },
    { q_ja: "しずか (  ) 公園", q_en: "shizuka (  ) kouen", correct: "な" },
    { q_ja: "おいしい (  ) 料理", q_en: "oishii (  ) ryouri", correct: "", note: "イ形容詞は不要 / i-adjective needs nothing" },
    { q_ja: "べんり (  ) アプリ", q_en: "benri (  ) apuri", correct: "な" },
    { q_ja: "たかい (  ) ビル", q_en: "takai (  ) biru", correct: "" }
];

// ==================== 初期設定（英語・ダークがデフォルト） ====================
let currentLang = 'en';
let currentQuiz = null;

// ==================== 翻訳テキスト ====================
const translations = {
    ja: {
        appTitle: "📖 形容詞マスター",
        subText: "名詞を修飾するとき・述語「です」の形を比較",
        tabModify: "✏️ 修飾＋名詞",
        tabPredicate: "🔵 述語 ＋です",
        tabQuiz: "📝 練習問題",
        modifyRule: "💡 ルール：<br><span class='i-example'>イ形容詞</span> → そのまま ＋ 名詞<br><span class='na-example'>ナ形容詞</span> → 語幹 + <span class='na-highlight'>「な」</span> ＋ 名詞",
        predicateRule: "💡 「～は ＋ 形容詞＋です」<br><span class='i-example'>イ形容詞</span> : そのまま ＋ です（例：おいしいです）<br><span class='na-example'>ナ形容詞</span> : <span class='remove-na'>「な」を取る</span> ＋ です（例：きれいです）",
        modifyTypeHeader: "種類",
        modifyExampleHeader: "例（タップで音声）",
        predicateTypeHeader: "種類",
        predicateExampleHeader: "例（タップで音声）",
        exceptionNote: "⚠️ 例外：<strong>大きい／小さな／おかしな</strong> など連体詞は特別ルール（別途暗記）",
        quizInstruction: "【穴埋め問題】 ( ) に適切な形を入れてください。",
        quizPlaceholder: "答えを入力",
        checkBtn: "✓ チェック",
        nextBtn: "次の問題 →",
        contactText: "Contact us",
        footerNote: "🎧 例文をタップすると音声が聞けます | ホーム画面に追加してアプリ化",
        correct: "✅ 正解！",
        wrong: "❌ 不正解。正解は "
    },
    en: {
        appTitle: "📖 Japanese Adjective Master",
        subText: "Compare modifying nouns & predicate form with 'desu'",
        tabModify: "✏️ Modify + Noun",
        tabPredicate: "🔵 Predicate + desu",
        tabQuiz: "📝 Quiz",
        modifyRule: "💡 Rules:<br><span class='i-example'>i-adjective</span> → directly + noun<br><span class='na-example'>na-adjective</span> → stem + <span class='na-highlight'>'na'</span> + noun",
        predicateRule: "💡 'Subject wa + adjective + desu'<br><span class='i-example'>i-adjective</span> : directly + desu (ex: oishii desu)<br><span class='na-example'>na-adjective</span> : remove <span class='remove-na'>'na'</span> + desu (ex: kirei desu)",
        modifyTypeHeader: "Type",
        modifyExampleHeader: "Examples (tap to hear)",
        predicateTypeHeader: "Type",
        predicateExampleHeader: "Examples (tap to hear)",
        exceptionNote: "⚠️ Exceptions: <strong>ookii／chiisana／okashina</strong> etc. (special attributives - memorize separately)",
        quizInstruction: "【Fill in the blank】 Enter the correct form in ( ).",
        quizPlaceholder: "Enter answer",
        checkBtn: "✓ Check",
        nextBtn: "Next →",
        contactText: "Contact us",
        footerNote: "🎧 Tap examples to hear pronunciation | Add to home screen",
        correct: "✅ Correct!",
        wrong: "❌ Incorrect. Correct answer: "
    }
};

// ==================== 言語切り替え ====================
function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('appTitle').innerHTML = t.appTitle;
    document.getElementById('subText').innerHTML = t.subText;
    document.getElementById('tabModify').innerHTML = t.tabModify;
    document.getElementById('tabPredicate').innerHTML = t.tabPredicate;
    document.getElementById('tabQuiz').innerHTML = t.tabQuiz;
    document.getElementById('modifyRule').innerHTML = t.modifyRule;
    document.getElementById('predicateRule').innerHTML = t.predicateRule;
    document.getElementById('modifyTypeHeader').innerHTML = t.modifyTypeHeader;
    document.getElementById('modifyExampleHeader').innerHTML = t.modifyExampleHeader;
    document.getElementById('predicateTypeHeader').innerHTML = t.predicateTypeHeader;
    document.getElementById('predicateExampleHeader').innerHTML = t.predicateExampleHeader;
    document.getElementById('exceptionNote').innerHTML = t.exceptionNote;
    document.getElementById('quizInstruction').innerHTML = t.quizInstruction;
    document.getElementById('checkBtn').innerHTML = t.checkBtn;
    document.getElementById('nextQuizBtn').innerHTML = t.nextBtn;
    document.getElementById('contactText').innerHTML = t.contactText;
    document.getElementById('footerNote').innerHTML = t.footerNote;
    
    const quizInput = document.getElementById('quizAnswer');
    quizInput.placeholder = t.quizPlaceholder;
    
    // 再描画
    buildModifyTable();
    buildPredicateTable();
    if (document.getElementById('quizTab').classList.contains('active')) {
        loadQuiz();
    }
}

// ==================== 表の描画 ====================
function buildModifyTable() {
    const tbody = document.querySelector("#modifyTable tbody");
    if (!tbody) return;
    
    const iLabel = currentLang === 'ja' ? 'イ形容詞' : 'i-adjective';
    const naLabel = currentLang === 'ja' ? 'ナ形容詞' : 'na-adjective';
    
    tbody.innerHTML = `
        <tr style="background:rgba(43,108,176,0.1)">
            <td>${iLabel}</td>
            <td>${iAdjModify.map(i => `<div class="example-sound" data-text="${i.word} ${i.noun}">${i.word} ${i.noun}</div>`).join('')}</td>
        </tr>
        <tr style="background:rgba(194,65,12,0.1)">
            <td>${naLabel}</td>
            <td>${naAdjModify.map(n => `<div class="example-sound" data-text="${n.stem}な ${n.noun}"><span class="na-highlight">${n.stem}な</span> ${n.noun}</div>`).join('')}</td>
        </tr>
    `;
    attachSounds();
}

function buildPredicateTable() {
    const tbody = document.querySelector("#predicateTable tbody");
    if (!tbody) return;
    
    const iLabel = currentLang === 'ja' ? 'イ形容詞' : 'i-adjective';
    const naLabel = currentLang === 'ja' ? 'ナ形容詞' : 'na-adjective';
    
    tbody.innerHTML = `
        <tr style="background:rgba(43,108,176,0.1)">
            <td>${iLabel}</td>
            <td>${iPredicate.map(p => `<div class="example-sound" data-text="${p}">${p}</div>`).join('')}</td>
        </tr>
        <tr style="background:rgba(194,65,12,0.1)">
            <td>${naLabel}</td>
            <td>${naPredicate.map(p => `<div class="example-sound" data-text="${p}">${p}</div>`).join('')}</td>
        </tr>
    `;
    attachSounds();
}

function attachSounds() {
    document.querySelectorAll('.example-sound').forEach(el => {
        el.removeEventListener('click', soundHandler);
        el.addEventListener('click', soundHandler);
    });
}

function soundHandler(e) {
    const text = e.currentTarget.getAttribute('data-text');
    if(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

// ==================== クイズ ====================
function loadQuiz() {
    const random = Math.floor(Math.random() * quizBank.length);
    currentQuiz = quizBank[random];
    const questionElem = document.getElementById("quizQuestion");
    if (currentLang === 'ja') {
        questionElem.innerHTML = currentQuiz.q_ja;
    } else {
        questionElem.innerHTML = currentQuiz.q_en;
    }
    document.getElementById("quizAnswer").value = "";
    document.getElementById("quizFeedback").innerHTML = "";
}

function checkQuiz() {
    const user = document.getElementById("quizAnswer").value.trim();
    const isCorrect = (user === currentQuiz.correct) || (currentQuiz.correct === "" && user === "");
    const t = translations[currentLang];
    
    if(isCorrect) {
        document.getElementById("quizFeedback").innerHTML = t.correct;
    } else {
        const expected = currentQuiz.correct === "" ? (currentLang === 'ja' ? "（何も入れない）" : "(nothing)") : `「${currentQuiz.correct}」`;
        document.getElementById("quizFeedback").innerHTML = `${t.wrong} ${expected} です。`;
    }
}

// ==================== タブ切り替え ====================
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
            document.getElementById(`${tabId}Tab`).classList.add("active");
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if(tabId === "quiz") loadQuiz();
        });
    });
}

// ==================== ダークモード（デフォルトON） ====================
function darkMode() {
    const toggle = document.getElementById("darkModeToggle");
    // デフォルトでダークモードを有効にする（bodyにdarkクラスは付けない。lightクラスがない状態がダーク）
    toggle.textContent = "☀️ ライト";
    
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = document.body.classList.contains("light") ? "🌙 ダーク" : "☀️ ライト";
    });
}

// ==================== 言語切り替えボタン（デフォルト英語表示） ====================
function langToggle() {
    const btn = document.getElementById("langToggle");
    btn.textContent = currentLang === 'ja' ? '🇺🇸 English' : '🇯🇵 日本語';
    
    btn.addEventListener("click", () => {
        currentLang = currentLang === 'ja' ? 'en' : 'ja';
        btn.textContent = currentLang === 'ja' ? '🇺🇸 English' : '🇯🇵 日本語';
        updateLanguage();
    });
}

// ==================== Service Worker ====================
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => console.log("SW registered", reg)).catch(err => console.log("SW error:", err));
}

// ==================== 初期化 ====================
buildModifyTable();
buildPredicateTable();
initTabs();
darkMode();
langToggle();
updateLanguage();
document.getElementById("checkBtn")?.addEventListener("click", checkQuiz);
document.getElementById("nextQuizBtn")?.addEventListener("click", loadQuiz);
loadQuiz();