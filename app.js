document.addEventListener('DOMContentLoaded', () => {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const ratingLog = document.getElementById('rating-log');
    let timer;

    // アラート音とタイマーの設定
    function startTimer() {
        timer = setInterval(() => {
            alert('ﾋﾞﾋﾞﾋﾞﾋﾞﾂ!!');
            playSound();
        }, 300000); // 5分 = 300000ミリ秒
    }

    // 簡易的なアラート音の再生（実際にはカスタム音声ファイルを使用）
    function playSound() {
        const audio = new Audio('audio2.mp3'); // 実際の音声ファイルパスに置き換える
        audio.play();
    }

    // 評価ボタンのクリックイベントリスナー
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            saveRating(value);
            updateLog();
        });
    });

    // 評価の保存
    function saveRating(value) {
        const currentTime = new Date();
        const jstTime = currentTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const rating = { time: jstTime, value: value };
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        ratings.push(rating);
        localStorage.setItem('ratings', JSON.stringify(ratings));
        initApp(); // Call initApp to update the log and graph
    }


    // ログの更新
    function updateLog() {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        ratingLog.innerHTML = ''; // ログをクリア

        //新しいものから10件のみを取得
        const recentRatings = ratings.slice(-10).reverse();

        ratings.forEach(rating => {
            const li = document.createElement('li');
            li.textContent = `Point: ${rating.value} - ${rating.time}`;
            ratingLog.appendChild(li);
        });
    }

    function drawChart() {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        const labels = ratings.map(rating => new Date(rating.time).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
        const data = ratings.map(rating => rating.value);
    
        const ctx = document.getElementById('ratingChart').getContext('2d');
        const ratingChart = new Chart(ctx, {
            type: 'line', // グラフの種類
            data: {
                labels: labels, // X軸のラベル（評価した時間）
                datasets: [{
                    label: '集中度',
                    data: data, // Y軸のデータ（集中度の評価値）
                    fill: false,
                    Color: 'rgb(255,255,255)',
                    borderColor: 'rgb(255,0,255)',
                    tension: 0.5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, // Y軸の開始点を0に設定
                        ticks: {
                            // 0から5まで1刻みに設定
                            stepSize: 1, // メモリの刻みを1に設定
                            max: 5, // Y軸の最大値を5に設定
                            min: 0 // Y軸の最小値を0に設定
                        }
                    }
                }
            }
        });
    }
    

    // アプリの初期化
    function initApp() {
        startTimer();
        updateLog();
        drawChart(); // グラフを描画
    }

    startTimer();
    initApp();
});
