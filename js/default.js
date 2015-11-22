(function() {
    var getAudioDevice = function() {
        return document.getElementsByTagName("audio")[0];
    }
    var createElement = function(element, option) {
        var e = $(document.createElement(element));
        if (!option) return e;
        if (!!option.text) e.text(option.text);
        if (!!option.id) e.attr('id', option.id);
        if (!!option.class) e.attr('class', option.class);
        if (!!option.src) e.attr('src', option.src);
        if (!!option.html) e.html(option.html);
        if (!!option.dataToggle) e.attr('dataToggle', option.dataToggle);
        if (!!option.href) e.attr('href', option.href);
        if (!!option.role) e.attr('role', option.role);

        return e;
    };
    // 相手側の会話バルーンの作成
    var createPartnerBaloon = function(message) {
            var questionBox = createElement('div', {
                'class': 'question-box'
            });
            questionBox.append(createElement('div', {
                'class': 'arrow-question',
                'html': message
            }));
            return questionBox;
        }
        // 自分側にスタンプを追加
    var createSelfSticker = function(element) {
        var box = createElement('div', {
            'class': 'self-box'
        });
        /*box.append(createElement('span', {
            'class' : 'self-status',
            'text' : '既読'
        }));*/
        box.append(element);
        $('#wrapper').append(box);
        element.width(element.width() / 2);
    };
    var TalkWindow = function() {
        this.windowElement;
        this.audio;
    };
    TalkWindow.prototype = {
        init: function(element, audioDevice) {
            this.windowElement = element;
            this.audio = audioDevice;
        },

        talk: function(message) {
            console.log(message);
            // 全体の箱を用意
            var box = createElement('div', {
                'class': 'box'
            });
            // トーク画像を追加
            box.append(createElement('div', {
                'class': 'left-image'
            }));
            // バルーンを生成
            box.append(createPartnerBaloon(message));
            // 追加
            this.windowElement.append(box);
            // 通知音の再生
            this.audio.play();
            // ボックスを表示
            box.fadeIn(200);
        }
    }

    // トークウィンドウの取得
    var talkWindow = new TalkWindow();
    talkWindow.init($('#wrapper'), getAudioDevice());



    var onDrop = function(event) {
        if (!event.dataTransfer) {
            // データ転送機能が無いためエラー
            return;
        }

        // サンプルスタンプょD&Dした場合の処理
        var text = event.dataTransfer.getData('text/html');
        if (!!text) {
            var element = $(text);
            createSelfSticker(element);
            event.preventDefault();
            return;
        }

        // ローカルからファイルを選択した場合の処理
        var files = event.dataTransfer.files;
        if (!!files) {
            // ファイルの配列から1つずつファイルを選択
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                // FileReaderオブジェクトの生成
                var reader = new FileReader();
                // 画像ファイルかテキストファイルかを判定
                if (!f.type.match('image.*')) {
                    talkWindow.talk('画像ファイル以外は表示できないでし!');
                    console.log("画像ファイル以外は表示できません。");
                    continue;
                }
                // エラー発生時の処理
                reader.onerror = function(event) {
                    //disp.innerHTML = "読み取り時にエラーが発生しました。";
                };
                // ファイル読取が完了した際に呼ばれる処理
                reader.onload = function(event) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'sticker');
                    img.src = event.target.result;
                    createSelfSticker($(img));
                };
                // readAsDataURLメソッドでファイルの内容を取得
                reader.readAsDataURL(f);
            }
            event.preventDefault();
            return;
        }

        event.preventDefault();
    }




    if (window.File) {
        document.getElementById("drop").addEventListener("drop", onDrop, false);
        talkWindow.talk('スタンピ画像をドラッグ&ドロップで貼り付けるでし!');
    } else {
        talkWindow.talk('このブラウザだと動作しないでし!<a href="https://www.google.co.jp/chrome/">ここから最新のブラウザをダウンロードするでし!</a>');
    }



    var drag = document.getElementById('drop');
    drag.ondragover = function(event) {
        event.preventDefault();
    };
    $(document).ready(function() {
        $('#reset').on('click', function(){
            $('#wrapper').empty();
        });

    });
})();
