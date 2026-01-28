import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

/* Firebase 配置 */
const firebaseConfig = {
  apiKey: "AIzaSyDc27UjdsySJAz4-1NpY0Cgs3Jq3402o70",
  authDomain: "flowerpotapp-d0c7a.firebaseapp.com",
  databaseURL: "https://flowerpotapp-d0c7a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "flowerpotapp-d0c7a",
  storageBucket: "flowerpotapp-d0c7a.firebasestorage.app",
  messagingSenderId: "347864027088",
  appId: "1:347864027088:web:ee3a267fb4f546bb5ef3d5"
};

/* 初始化 Firebase */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const potRef = ref(db, "flowerPot");

/* DOM */
const dayText = document.getElementById("dayText");
const flowerImg = document.getElementById("flowerImg");
const waterBtn = document.getElementById("waterBtn");
const messageInput = document.getElementById("messageInput");
const popup = document.getElementById("popup");

/* 称号（每 40 天一次） */
const titles = [
  "最佳浇水员 🌸",
  "花园守护者 🌿",
  "自然之友 🍃",
  "春天使者 🌷",
  "花园大师 🌹",
  "爱心园丁 💖",
  "终极花神 🌟",
  "时间的朋友 ⏳",
  "命运修剪者 ✂️",
  "世界线守护人 🌌",
  "花开即永恒 💫",
  "终章之花 👑",
  "成熟礼物拥有者 🎁"
];

/* 弹幕显示函数 */
function showPopup(text) {
  popup.textContent = text;
  popup.style.display = "block";
  popup.classList.add("popup-animate");
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("popup-animate");
  }, 3200);
}

/* 加载花盆和花 */
async function loadPot() {
  const snap = await get(potRef);
  let data = snap.exists() ? snap.val() : null;

  if (!data) {
    data = {
      currentDay: 0,
      lastWatered: 0,
      messages: {},
      specialEvents: {},
      matured: false
    };
    await set(potRef, data);
  }

  /* 显示天数 */
  dayText.textContent = `已浇水天数：${data.currentDay ?? 0}`;

  /* 花成长（13 张图 / 每 40 天） */
  const stage = Math.min(Math.floor((data.currentDay ?? 0) / 40) + 1, 13);
  flowerImg.src = `./images/flower${stage}.png`;

  /* 花朵从下到上淡入 */
  flowerImg.style.opacity = 0;
  flowerImg.style.transform = "translateY(30px)";
  setTimeout(() => {
    flowerImg.style.transition = "all 0.8s ease";
    flowerImg.style.opacity = 1;
    flowerImg.style.transform = "translateY(0)";
  }, 50);

  /* 称号弹幕（每 40 天） */
  if (data.currentDay > 0 && data.currentDay % 40 === 0) {
    const index = Math.min(Math.floor(data.currentDay / 40) - 1, titles.length - 1);
    showPopup(`获得称号：${titles[index]} ✨`);
  }

  /* 显示【前一天】的神秘力量 */
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().split("T")[0];

  const events = data.specialEvents?.[yKey] ?? [];
  if (events.length > 0) {
    const lastEvent = events[events.length - 1];
    showPopup(`✨ 神秘力量：${lastEvent}`);
  }

  /* 成熟提示（520 天，仅一次） */
  if ((data.currentDay ?? 0) >= 520 && !data.matured) {
    showPopup("🎁 花已成熟，命运被彻底改写");
    await set(potRef, { ...data, matured: true });
  }
}

/* 浇水（每天一次） */
waterBtn.onclick = async () => {
  const snap = await get(potRef);
  const data = snap.exists() ? snap.val() : { currentDay: 0, lastWatered: 0, messages: {}, specialEvents: {}, matured: false };

  const todayStr = new Date().toDateString();
  const lastStr = new Date(data.lastWatered ?? 0).toDateString();

  if (todayStr === lastStr) {
    alert("今天已经浇过水啦 💧");
    return;
  }

  /* 留言：只存，不显示 */
  const msg = messageInput.value.trim();
  const messages = data.messages ?? {};
  const todayKey = new Date().toISOString().split("T")[0];

  if (msg) {
    messages[todayKey] = messages[todayKey] ?? [];
    messages[todayKey].push(msg);
  }

  await set(potRef, {
    ...data,
    currentDay: (data.currentDay ?? 0) + 1,
    lastWatered: Date.now(),
    messages
  });

  messageInput.value = "";
  loadPot();
};

/* 启动 */
loadPot();
