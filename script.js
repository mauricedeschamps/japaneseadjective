// データ定義
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

// 音声合成
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// 修飾表描画
function buildModifyTable() {
    const tbody = document.querySelector("#modifyTable tbody");
    tbody.innerHTML = `
        <tr><td style="background:#e6f7ff">イ形容詞</td>
        <td>${iAdjModify.map(i => `<div class="example-sound" data-text="${i.word} ${i.noun}">${i.word} ${i.noun}</div>`).join('')}</td></tr>
        <tr><td style="background:#fff5e6">ナ形容詞</td>
        <td>${naAdjModify.map(n => `<div class="example-sound" data-text="${n.stem}な ${n.noun}"><span class="na-highlight">${n.stem}な</span> ${n.noun}</div>`).join('')}</td></tr>
    `;
    attachSounds();
}

function buildPredicateTable() {
    const tbody = document.querySelector("#predicateTable tbody");
    tbody.innerHTML = `
        <tr><td style="background:#e6f7ff">イ形容詞</td>
        <td>${iPredicate.map(p => `<div class="example-sound" data-text="${p}">${p}</div>`).join('')}</td></tr>
        <tr><td style="background:#fff5e6">ナ形容詞</td>
        <td>${naPredicate.map(p => `<div class="example-sound" data-text="${p}">${p}</div>`).join('')}</td></tr>
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
    if(text) speak(text);
}

// 問題集（修飾＋な に特化）
let currentQuiz = null;
const quizBank = [
    { q: "きれい (  ) 部屋", correct: "な", hint: "ナ形容詞の修飾" },
    { q: "しずか (  ) 公園", correct: "な" },
    { q: "おいしい (  ) 料理", correct: "", note: "イ形容詞は不要" },
    { q: "べんり (  ) アプリ", correct: "な" },
    { q: "たかい (  ) ビル", correct: "" }
];
function loadQuiz() {
    const random = Math.floor(Math.random() * quizBank.length);
    currentQuiz = quizBank[random];
    document.getElementById("quizQuestion").innerHTML = currentQuiz.q;
    document.getElementById("quizAnswer").value = "";
    document.getElementById("quizFeedback").innerHTML = "";
}
function checkQuiz() {
    const user = document.getElementById("quizAnswer").value.trim();
    const isCorrect = (user === currentQuiz.correct) || (currentQuiz.correct === "" && user === "");
    if(isCorrect) {
        document.getElementById("quizFeedback").innerHTML = "✅ 正解！";
    } else {
        const expected = currentQuiz.correct === "" ? "（何も入れない）" : `「${currentQuiz.correct}」`;
        document.getElementById("quizFeedback").innerHTML = `❌ 不正解。正解は ${expected} です。`;
    }
}

// タブ切り替え＆ダークモード
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
function darkMode() {
    const toggle = document.getElementById("darkModeToggle");
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        toggle.textContent = document.body.classList.contains("dark") ? "☀️ ライト" : "🌙 ダーク";
    });
}

// Service Worker 登録（PWA）
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => console.log("SW registered", reg));
}

// 初期化
buildModifyTable();
buildPredicateTable();
initTabs();
darkMode();
document.getElementById("checkBtn")?.addEventListener("click", checkQuiz);
document.getElementById("nextQuizBtn")?.addEventListener("click", loadQuiz);
loadQuiz();