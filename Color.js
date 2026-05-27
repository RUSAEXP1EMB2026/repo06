const COLOR_NAME_LIST = [
  "ラベンダー",
  "セージ",
  "グレープ",
  "フラミンゴ",
  "バナナ",
  "ミカン",
  "ピーコック",
  "グラファイト",
  "ブルーベリー",
  "バジル",
  "トマト"
];

function getColorName(color) {
  return COLOR_NAME_LIST[parseInt(color) - 1];
}