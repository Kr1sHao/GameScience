let port;
let reader;
let textDecoder = new TextDecoderStream();
let readableStreamClosed;

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const teleprompter = document.getElementById('teleprompter');
const commentSection = document.getElementById('comments');
let scrollInterval;
let scrollSpeed = 1; // 可以调整滚动速度

const settingsBtn = document.getElementById('settings-btn');
const settingsContainer = document.getElementById('settings-container');
const saveSettingsBtn = document.getElementById('save-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const scrollSpeedInput = document.getElementById('scrollSpeed');
const fontSizeInput = document.getElementById('fontSize');
const scrollTimeInput = document.getElementById('scrollTime');

let savedSettings = {
    scrollSpeed: 1,
    fontSize: 24,
    scrollTime: 50
};

// 固定评论内容
const comments = [
    "Misaka: You're pacing yourself perfectly! Keep it up 👍",
    "Catherine: Great example! Keep going! 💡",
    "John: Keep up the great work! 🙌",
    "Emily: Excellent pacing, well done! 💪",
    "Chris: You're nailing it! 👍",
    "David: Everyone's totally engaged! Stay on it! ✨",
    "Bot: 👏👏👏👏👏👏👏👏👏"
];

// 当前显示的评论数组，最多显示3条
let displayedComments = [];

// 最大显示的评论数
const maxComments = 3;

// 开始滚动
startBtn.addEventListener('click', () => {
    // 防止多次点击启动多个滚动定时器
    if (!scrollInterval) {
        scrollInterval = setInterval(() => {
            teleprompter.scrollTop += scrollSpeed;
        }, 50); // 控制滚动速度
    }
});

// 重置滚动
resetBtn.addEventListener('click', () => {
    clearInterval(scrollInterval); // 停止滚动
    scrollInterval = null; // 重置状态，防止再次点击Start时出问题
    teleprompter.scrollTop = 0; // 重置滚动到顶部
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'k' || event.key === 'K') {
        console.log('键盘按下了 K');
        createEmojiAndComment();
    }
});

// 初始化串口连接
async function connectToSerial() {
    // 请求串口设备权限
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        // 获取串口的可读流
        const inputStream = port.readable.pipeThrough(textDecoder);
        reader = inputStream.getReader();

        // 持续读取串口数据
        readSerialData();
    } catch (err) {
        console.error('连接串口时出错:', err);
    }
}

// 读取串口数据
async function readSerialData() {
    while (true) {
        try {
            const { value, done } = await reader.read();
            if (done) {
                // 读到尽头时停止读取
                console.log('串口读取已完成');
                break;
            }
            if (value.trim() === 'K') {
                // 触发表情和评论
                createEmojiAndComment();
            }
        } catch (err) {
            console.error('读取串口数据时出错:', err);
            break;
        }
    }
}

// 创建并显示表情和更新评论
function createEmojiAndComment() {
    // 创建一个新的表情元素
    const emoji = document.createElement('div');
    emoji.classList.add('emoji-popup');
    
    // 设置表情内容为图片或文本
    emoji.innerHTML = '👏';  // 使用表情符号，可以替换为图片 <img src="path_to_emoji.png">
    document.body.appendChild(emoji);

    // 设置随机位置和大小
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    const randomSize = Math.random() * 50 + 30; // 30px到80px大小
    emoji.style.left = `${randomX}px`;
    emoji.style.top = `${randomY}px`;
    emoji.style.fontSize = `${randomSize}px`; // 设置表情大小

    // 2秒后移除表情
    setTimeout(() => {
        emoji.remove();
    }, 2000);

    // 同时更新评论
    addComment();
}

// 添加新的评论，并显示在评论区，保持最大显示3条评论
function addComment() {
    const randomIndex = Math.floor(Math.random() * comments.length);
    const newComment = comments[randomIndex];

    // 如果显示的评论数达到最大值，则移除最早的一条
    if (displayedComments.length >= maxComments) {
        displayedComments.shift(); // 移除数组中最早的评论
    }

    // 添加新的评论到数组末尾
    displayedComments.push(newComment);

    // 重新渲染评论区
    renderComments();
}

// 渲染评论区的函数
function renderComments() {
    // 清空当前评论区
    commentSection.innerHTML = '';

    // 逐条添加评论到评论区
    displayedComments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment;
        commentSection.appendChild(commentElement);
    });
}

// 在页面上增加一个按钮，用来连接到串口
const connectButton = document.createElement('button');
connectButton.textContent = "连接Arduino";
document.body.appendChild(connectButton);

// 点击按钮连接Arduino的串口
connectButton.addEventListener('click', connectToSerial);

// 显示或隐藏设置窗口
settingsBtn.addEventListener('click', () => {
    if (settingsContainer.classList.contains('show')) {
        settingsContainer.classList.remove('show');
    } else {
        settingsContainer.classList.add('show');
    }
});

// 关闭设置窗口
closeSettingsBtn.addEventListener('click', () => {
    settingsContainer.classList.remove('show');
});

// 保存设置，但不立即生效
saveSettingsBtn.addEventListener('click', () => {
    savedSettings.scrollSpeed = parseInt(scrollSpeedInput.value);
    savedSettings.fontSize = parseInt(fontSizeInput.value);
    savedSettings.scrollTime = parseInt(scrollTimeInput.value);
    console.log('Settings saved:', savedSettings);
    // 隐藏设置窗口
    settingsContainer.classList.remove('show');
});

// 点击Start时应用保存的设置
startBtn.addEventListener('click', () => {
    teleprompter.style.fontSize = `${savedSettings.fontSize}px`;

    // 防止多次点击启动多个滚动定时器
    if (!scrollInterval) {
        scrollInterval = setInterval(() => {
            teleprompter.scrollTop += savedSettings.scrollSpeed;
        }, savedSettings.scrollTime); // 控制滚动时间间隔
    }
});

// 重置滚动
resetBtn.addEventListener('click', () => {
    clearInterval(scrollInterval); // 停止滚动
    scrollInterval = null; // 重置状态，防止再次点击Start时出问题
    teleprompter.scrollTop = 0; // 重置滚动到顶部
});