(function() {
    var getAudioDevice = function() {
        return document.getElementsByTagName("audio")[0];
    };
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
    };
    // 自分側にスタンプを追加
    var createSelfSticker = function(element) {
        var box = createElement('div', {
            'class': 'self-box'
        });
        box.append(element);
        $('#wrapper').append(box);
        element.width(element.width() / 2);
    };
    var TalkWindow = function() {
        this.windowElement;
        this.audio;
    };
    var isPngFormat = function(bin) {
        var sig = String.fromCharCode(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
        var head = String.fromCharCode.apply(null, new Uint8Array(bin)).substr(0, 8);
        if (sig == head) {
            return true;
        }
        return false;
    };
    var getPngHeight = function(bin) {
        if (!isPngFormat(bin)) return null;
        var data = new DataView(bin);
        return data.getUint32(0x14, false);
    };
    var getPngWidth = function(bin) {
        if (!isPngFormat(bin)) return null;
        var data = new DataView(bin);
        return data.getUint32(0x10, false);
    };

    TalkWindow.prototype = {
        init: function(element, audioDevice) {
            this.windowElement = element;
            this.audio = audioDevice;
        },

        talk: function(message) {
            console.log(message);
            //空にする
            this.windowElement.empty();
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

        // サンプルスタンプをD&Dした場合の処理
        var text = event.dataTransfer.getData('text');
        if (!!text) {
            var element = $(createElement('img', {
                'class': 'sticker',
                'src': text
            }));
            // for OSX + ChromeではgetDataで取得できる項目が異なるので補正
            if (element.length != 1) {
                element = $(element[element.length - 1]);
            }
            // クラス名の取得
            var className = element.attr('class');

            if (className != 'sticker') {
                talkWindow.talk('この画像はサンプルじゃないでし!ぎゃおのスタンプをドラッグするでし!');
                event.preventDefault();
                return;
            }
            talkWindow.talk('こんな感じに表示されるでしー。');
            createSelfSticker(element);
            event.preventDefault();
            return;
        }

        // ローカルからファイルを選択した場合の処理
        var files = event.dataTransfer.files;
        if (!files) {
            event.preventDefault();
            return;
        }
        // ファイルの配列から1つずつファイルを選択
        //for (var i = 0; i < files.length; i++) {
        var f = files[0];
        // FileReaderオブジェクトの生成
        var reader = new FileReader();
        // ファイルタイプを判定
        if (!f.type.match('image.*')) {
            talkWindow.talk('画像ファイル以外は表示できないでし!');
            console.log("画像ファイル以外は表示できません。");
            event.preventDefault();
            return;
        }
        // ファイルサイズを判定
        console.log('ファイルサイズ:' + f.size + ' max:' + (1024 * 1024));
        if (f.size > (1024 * 1024)) {
            talkWindow.talk('ファイルサイズは1MB以下じゃないとダメでし!');
            console.log('ファイルサイズ超過:' + f.size + '>' + (1024 * 1024));
            event.preventDefault();
            return;
        }


        // エラー発生時の処理
        reader.onerror = function(event) {
            //disp.innerHTML = "読み取り時にエラーが発生しました。";
        };
        // ファイル読取が完了した際に呼ばれる処理
        reader.onload = function(event) {
            var bin = event.target.result;
            if (!isPngFormat(bin)) {
                talkWindow.talk('ファイルはPNGフォーマットじゃないとダメでし!');
                event.preventDefault();
                return;
            }
            var width = getPngWidth(bin);
            var height = getPngHeight(bin);

            //　画像の横幅チェック
            console.log('width : ' + width);
            if (width > 370) {
                talkWindow.talk('画像の横幅は最大370pxまででし!');
                event.preventDefault();
                return;
            }

            // 画像の高さチェック
            console.log('height : ' + height);
            if (height > 320) {
                talkWindow.talk('画像の高さは最大320pxまででし!');
                event.preventDefault();
                return;
            }

            // 画像サイズ(偶数サイズ)チェック
            if (width % 2 == 1) {
                talkWindow.talk('画像の横幅のサイズは偶数じゃないとだめでし!');
                event.preventDefault();
                return;
            }

            // 画像サイズ(偶数サイズ)チェック
            if (height % 2 == 1) {
                talkWindow.talk('画像の高さのサイズは偶数じゃないとだめでし!');
                event.preventDefault();
                return;
            }

            var readerData = new FileReader();
            readerData.onload = function(event) {
                var bin = event.target.result;
                var img = document.createElement('img');
                img.setAttribute('class', 'sticker');
                img.src = bin;
                img.width = width;
                talkWindow.talk('こんな感じに表示されるでしー。');

                createSelfSticker($(img));
                event.preventDefault();
                return;
            }
            readerData.readAsDataURL(f);
            event.preventDefault();
            return;
        };
        // バイナリ形式で取得
        reader.readAsArrayBuffer(f);
        //}
        event.preventDefault();
        return;
    }

    $(document).ready(function() {
        $('#reset').on('click', function() {
            $('#wrapper').empty();
        });

        $('#drop').on('dragover', function(event) {
            $('#drop').css('border', '2px dotted #9f9');
            event.preventDefault();
        });
        $('#drop').on('drop', function(event) {
            $('#drop').css('border-style', 'none');
            event.preventDefault();
        });

        // File APIに未対応の場合
        if (!window.File) {
            talkWindow.talk('このブラウザだと動作しないでし!<a href="https://www.google.co.jp/chrome/">ここから最新のブラウザをダウンロードするでし!</a>');
            return;
        }

        document.getElementById("drop").addEventListener("drop", onDrop, false);
        talkWindow.talk('スタンプ画像をドラッグ&ドロップで貼り付けるでし!');
    });
})();
