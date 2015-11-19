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
    var createPartnerBaloon = function(message) {
        var questionBox = createElement('div', {
            'class': 'question-box'
        });
        questionBox.append(createElement('div', {
            'class': 'arrow-question',
            'text': message
        }));
        return questionBox;
    }
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
            // トーク画像を追加
            this.windowElement.append(createElement('div', {
                'class': 'left-image'
            }));
            // 吹き出しを追加
            this.windowElement.append(createPartnerBaloon(message));
            // 通知音の再生
            this.audio.play();
        }
    }

    // トークウィンドウの取得
    var talkWindow = new TalkWindow();
    talkWindow.init($('#wrapper'), getAudioDevice());



    var onDrop = function(event) {
        var files = event.dataTransfer.files;
        //var disp = document.getElementById("disp");
        //disp.innerHTML = "";

        // ファイルの配列から1つずつファイルを選択
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            // FileReaderオブジェクトの生成
            var reader = new FileReader();
            // 画像ファイルかテキストファイルかを判定
            if (!f.type.match('image.*')) {
                alert("画像ファイルとテキストファイル以外は表示できません。");
                continue;
            }
            // エラー発生時の処理
            reader.onerror = function(evt) {
                    //disp.innerHTML = "読み取り時にエラーが発生しました。";
                }
                // ④画像ファイルの場合の処理
            if (f.type.match('image.*')) {
                // ファイル読取が完了した際に呼ばれる処理
                reader.onload = function(evt) {
                        //var li = document.createElement('li');
                        var img = document.createElement('img');
                        img.setAttribute('class', 'sticker');
                        img.src = evt.target.result;
                        img.onload = function() {
                                img.width = img.width / 2;
                            }
                            //disp.appendChild(img);

                    }
                    // readAsDataURLメソッドでファイルの内容を取得
                reader.readAsDataURL(f);
            }

        }
        // ⑥ブラウザ上でファイルを展開する挙動を抑止
        event.preventDefault();
    }



    if (window.File) {
        document.getElementById("drop").addEventListener("drop", onDrop, false);
        talkWindow.talk('スタンピ画像をドラッグ&ドロップで貼り付けるでし!');

    } else {
        window.alert("本ブラウザではFile APIが使えません");
        talkWindow.talk('このブラウザだと動作しないでし!ここからダウンロードするでし!');
    }



    var drag = document.getElementById('drop');
    drag.ondragover = function(event) {
        // ⑥ブラウザ上でファイルを展開する挙動を抑止
        event.preventDefault();
    }
    $(document).ready(function() {

    });
})();
