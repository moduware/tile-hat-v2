const lang = {
  "Temperature": {
    en: "Temperature",
    zh: "温度"
  },
  "Humidity": {
    en: "Humidity",
    zh: "湿度"
  },
  "Save": {
    en: "Save",
    zh: "保存"
  },
  "Search": {
    en: "Search",
    zh: "查找"
  },
  "Ambient": {
    en: "Ambient",
    zh: "环境"
  },
  "Object": {
    en: "Object",
    zh: "物体"
  },
  "Forehead": {
    en: "Forehead",
    zh: "额"
  },
  "temperature": {
    en: "temperature",
    zh: "温"
  },
  "Give it a name!": {
    en: "Give it a name!",
    zh: "给它起个名字"
  },
  "Name your measurement so you can find it in history": {
    en: "Name your measurement so you can find it in history",
    zh: "请给此记录命名，方便在历史记录中查找"
  },
  "New name": {
    en: "New name",
    zh: "新名称"
  },
  "Cancel": {
    en: "Cancel",
    zh: "取消"
  }
};

function get(word, language) {
  return lang[word][language] || '';
};