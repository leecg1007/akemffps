let words = [];

// 불용어 리스트(조사, 접속사 등 연결어 포함, 필요시 추가/수정)
const stopwords = [
    "그리고", "하지만", "그러나", "그래서", "즉", "또한", "때문에", "이것", "저것", "그것", "우리", "너희", "저희",
    "이", "그", "저", "등", "수", "등등", "더", "또", "및",
    "의", "가", "이", "은", "는", "을", "를", "에", "와", "과", "도", "로", "으로", "에서", "까지", "부터", "밖에", "처럼", "만", "뿐", "조차", "마저"
];

function drawWordCloud() {
    if (words.length === 0) {
        const canvas = document.getElementById('wordcloud');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    WordCloud(document.getElementById('wordcloud'), {
        list: words,
        gridSize: 12,
        weightFactor: function (size) {
            return Math.max(17, Math.min(size * 10, 120));
        },
        color: 'random-dark',
        rotateRatio: 0.2,
        minSize: 10
    });
}

function string(str) {
    str = str.trim();
    // 한글, 영문만 남기기 (대소문자 구별)
    str = str.replace(/[^a-zA-Z가-힣]/g, '');
    // 2글자 미만이면 제외
    if (str.length < 2) return '';
    // 단어 끝에 붙은 불용어(조사 등) 제거
    for (let i = 0; i < stopwords.length; i++) {
        if (str.endsWith(stopwords[i]) && str.length > stopwords[i].length) {
            str = str.slice(0, -stopwords[i].length);
            break;
        }
    }
    // 불용어 자체 제거(완전일치)
    if (stopwords.includes(str)) return '';
    return str;
}

drawWordCloud();

document.getElementById('wordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let input = document.getElementById('wordInput').value;
    // 공백 기준으로 단어 분리
    let tokens = input.split(/\s+/);

    // 1. 문장 내 단어별 빈도수(원-핫 벡터) 집계
    let freq = {};
    tokens.forEach(function(token) {
        let word = string(token); // 전처리 적용
        if(word) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });

    // 2. 전체 words 배열에 반영
    Object.keys(freq).forEach(function(word) {
        let found = false;
        for (let i = 0; i < words.length; i++) {
            if (words[i][0] === word) {
                words[i][1] += freq[word];
                found = true;
                break;
            }
        }
        if (!found) {
            words.push([word, freq[word]]);
        }
    });

    drawWordCloud();
    document.getElementById('wordInput').value = '';
});