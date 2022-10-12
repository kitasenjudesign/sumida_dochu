


* bundle.js置き換え
* mainVisual.css置き換え
* HTMLの<!--メインビジュアル開始-->の該当部分の更新

以下２ヶ所の更新をお願いします

↓styleにdisplay:none追加 一瞬見えちゃう問題の回避（最適な方法がどうかわからないですが）
<div id="contents" class="contents" style="display: none;">

↓白背景になったときjsから色を変えますのでidを追加(PCのみ)
<div id="footerCenter" class="footerCenter"> 十月二十九・三十日　乞う御期待</br>



## フォルダ構成

* css - cssが入ってます
* js - jsが入ってます
* sound - soundファイルが入ってます
* topimg - mainVisualに使う画像です、サイトに使う画像は別のフォルダを作って入れてください


## index.htmlの説明

### メインビジュアル
* 「メインビジュアル開始」とコメントアウトされてるところがメインビジュアルに使っているタグです。
* 今後、メインビジュアルを多少アップデートしていきますが、ここのタグ群が差し代わることになります。
* これらに加えmainVisual.cssがあればメインビジュアルは単独で動きます。

### コンテンツ（＝メインビジュアル以外）
* (div id="contents" class="contents")の中にコンテンツ（＝メインビジュアルl以外）を入れてください
* contentsを表示／非表示にしたり、レイヤーの重ね順の関係で上記のidが指定されていてJSからコントロールしています。
* contensの中は自由に構成して大丈夫です。
* cssはcontents.cssに書いてください。
* (div id="footer" class="footer")←ただ現状これだけheightをJSからいじってます、最下部でメインビジュアルをフルで見せるため。
* そのほかheaderもいじってもらって問題ないです。