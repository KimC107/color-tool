// 配色工具：配色產生、主題色卡（淺／深色＋對比度＋匯出 CSS）、收藏
// 全部在瀏覽器本機運作，資料存在 localStorage 的 color-tool。
(function () {
  'use strict';

  // ===================== 常數 =====================
  var STORE_KEY = 'color-tool';

  // 遊戲王國的變數名稱（順序固定，下方預設配色的陣列依此順序）
  var VARS = ['bg', 'text', 'muted', 'box', 'box-focus', 'box1', 'box1-focus', 'card-text', 'card-muted',
    'panel', 'panel-text', 'soft', 'soft-text', 'accent', 'accent-text', 'ok', 'err', 'danger', 'blue',
    'track', 'on', 'bead-n'];
  var VAR_LABEL = {
    'bg': '頁面背景', 'text': '文字', 'muted': '次要文字', 'box': '格子', 'box-focus': '格子聚焦',
    'box1': '第二格子', 'box1-focus': '第二格子聚焦', 'card-text': '格子文字', 'card-muted': '格子次要字',
    'panel': '卡片', 'panel-text': '卡片文字', 'soft': '柔和按鈕', 'soft-text': '柔和按鈕字',
    'accent': '強調按鈕', 'accent-text': '強調按鈕字', 'ok': '成功訊息', 'err': '錯誤訊息',
    'danger': '主要動作', 'blue': '藍', 'track': '滑桿軌道', 'on': '開關開啟', 'bead-n': '中性珠子'
  };

  // 遊戲王國五組配色（取自 gamekingdom/_template/style.css）
  var PRESETS = [
    { id: 'a', name: '鼠尾草＋奶油',
      light: ['#F4F2EA', '#2F3D34', '#7A8478', '#FBFAF4', '#FFFFFF', '#E3ECF0', '#F3F8FA', '#2F3D34', '#7A8478', '#B5CDB0', '#25382B', '#D5E2C8', '#2F4A34', '#EBCB8B', '#4A3A14', '#3F7A4A', '#B8453A', '#CF6339', '#4F7FB8', '#8C9A88', '#6FA27A', '#8A9486'],
      dark: ['#1B221C', '#ECEBE0', '#B5C0B0', '#DDE3D3', '#F0F3E8', '#C6D5DD', '#E1ECF2', '#1F2A21', '#55634F', '#86A483', '#14201A', '#A9C0A0', '#14201A', '#E3C47E', '#2E2410', '#CFE3A0', '#FF9A8C', '#D9704A', '#4F7FB8', '#4D5A4B', '#7FB48A', '#6B7566'] },
    { id: 'b', name: '霧藍＋杏',
      light: ['#F2F1EC', '#2B3A45', '#75828B', '#FFFDF8', '#FFFFFF', '#F1DEC9', '#FAEEDF', '#2B3A45', '#75828B', '#A9C1CC', '#1F3340', '#C9D9E0', '#27404F', '#F0D3B5', '#4A3320', '#3B7A6A', '#B8453A', '#CF6339', '#3F6FA8', '#7F98A5', '#6C97AA', '#7D8A92'],
      dark: ['#182027', '#E9ECE8', '#AEBBC4', '#D6DEE0', '#EBF0F1', '#E6D4C0', '#F3E6D6', '#1D2A33', '#51636E', '#7E9BAA', '#101C24', '#9FB7C3', '#101C24', '#EBC9A4', '#35240F', '#A5D8C6', '#FF9A8C', '#D9704A', '#4F7FB8', '#475862', '#6FA3B8', '#6A7880'] },
    { id: 'c', name: '玫瑰＋抹茶',
      light: ['#F6F0E8', '#4A3A36', '#8A7872', '#FFFCF7', '#FFFFFF', '#E4EAD8', '#F1F5EA', '#4A3A36', '#8A7872', '#DDBFB0', '#4A2F2A', '#E8D3C8', '#4A2F2A', '#86A872', '#14210E', '#4F7A45', '#B3402F', '#C4532E', '#4F7FB8', '#A8928A', '#8FAE7E', '#8A7A74'],
      dark: ['#231C1A', '#F0E6DD', '#C6B2A8', '#E6D8CF', '#F5ECE4', '#D3DDC6', '#E8EFDD', '#2E211E', '#6A5650', '#B58E80', '#231512', '#CDA899', '#231512', '#D6E6BF', '#1C2815', '#BCD7A0', '#FF9A8C', '#D9704A', '#4F7FB8', '#5A4741', '#9DBB88', '#7D6C66'] },
    { id: 'm', name: '黑白灰',
      light: ['#F0F0F0', '#1F1F1F', '#757575', '#FAFAFA', '#FFFFFF', '#E2E2E2', '#F0F0F0', '#1F1F1F', '#777777', '#CFCFCF', '#1A1A1A', '#E0E0E0', '#1F1F1F', '#3A3A3A', '#FFFFFF', '#2A7D3F', '#C83A2E', '#D8432A', '#2F6FD0', '#9A9A9A', '#4A4A4A', '#8A8A8A'],
      dark: ['#141414', '#EAEAEA', '#A8A8A8', '#D8D8D8', '#F0F0F0', '#BEBEBE', '#DCDCDC', '#161616', '#555555', '#8A8A8A', '#101010', '#A8A8A8', '#101010', '#EDEDED', '#161616', '#7FD18E', '#FF8A80', '#E0502F', '#3A74C8', '#555555', '#9A9A9A', '#7A7A7A'] },
    { id: 'classic', name: '經典橄欖',
      light: ['#E9E4D6', '#2B3A2C', '#6A7266', '#FAF8F2', '#FFFFFF', '#E2EAF1', '#F6FAFD', '#2B3A2C', '#6A7266', '#B3B97F', '#24352A', '#B3B97F', '#24352A', '#C9DDA6', '#24352A', '#2F6B35', '#A8322D', '#C23B0D', '#1F5FBF', '#4D5446', '#236529', '#6B7266'],
      dark: ['#141A13', '#E6E3D5', '#C3CCB4', '#CCC6B4', '#E6E2D4', '#BCCBD6', '#DCE6EE', '#10150B', '#2F4012', '#9BA256', '#10150B', '#9BA256', '#10150B', '#B8CF20', '#10150B', '#B8CF20', '#FF8A80', '#C23B0D', '#1F5FBF', '#4D5446', '#236529', '#6B7266'] }
  ];

  // 配色規則：名稱＋相對主色的色相偏移（度）
  var HARMONIES = [
    ['互補色', [0, 180]],
    ['類似色', [0, -30, 30]],
    ['三角色', [0, 120, 240]],
    ['分裂互補', [0, 150, 210]],
    ['矩形四色', [0, 90, 180, 270]]
  ];
  // 單色階的明度階
  var MONO_L = [20, 35, 50, 65, 80, 92];

  // 對比度要檢查的組合：[前景變數或色碼, 背景變數, 說明]
  var PAIRS = [
    ['text', 'bg', '內文'],
    ['muted', 'bg', '次要文字'],
    ['card-text', 'box', '格子文字'],
    ['card-muted', 'box', '格子次要字'],
    ['card-text', 'box1', '第二格子文字'],
    ['panel-text', 'panel', '卡片文字'],
    ['soft-text', 'soft', '柔和按鈕'],
    ['accent-text', 'accent', '強調按鈕'],
    ['#FFFFFF', 'danger', '主要動作（白字）'],
    ['ok', 'bg', '成功訊息'],
    ['err', 'bg', '錯誤訊息']
  ];

  // ===================== 顏色換算 =====================
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // 整理色碼：接受 #abc、abc、#aabbcc、aabbcc；不合法回傳 null
  function normHex(s) {
    s = String(s || '').trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(s)) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    if (!/^[0-9a-f]{6}$/i.test(s)) return null;
    return '#' + s.toUpperCase();
  }
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    function h(v) { v = clamp(Math.round(v), 0, 255).toString(16); return v.length < 2 ? '0' + v : v; }
    return ('#' + h(r) + h(g) + h(b)).toUpperCase();
  }
  // 回傳 {h: 0–360, s: 0–100, l: 0–100}
  function hexToHsl(hex) {
    var c = hexToRgb(hex), r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    var h = 0, l = (max + min) / 2, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }
  // WCAG 相對亮度
  function lum(hex) {
    var c = hexToRgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  // WCAG 對比度（1–21）
  function contrast(a, b) {
    var x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // 放在某底色上，深字還是白字比較清楚
  function textOn(hex) { return contrast(hex, '#1F2A21') >= contrast(hex, '#FFFFFF') ? '#1F2A21' : '#FFFFFF'; }

  // ===================== 主題產生 =====================
  // 由主色（卡片）與強調色（按鈕）推出淺色、深色兩套完整變數
  function generateTheme(primary, accent) {
    var p = hexToHsl(primary), a = hexToHsl(accent);
    // 主色接近灰階時，背景等中性色不要染色
    var k = Math.min(1, p.s / 20), ka = Math.min(1, a.s / 20);
    function P(s, l) { return hslToHex(p.h, s * k, l); }
    function A(s, l) { return hslToHex(a.h, s * ka, l); }
    var pl = clamp(p.l, 60, 82), al = clamp(a.l, 60, 86);
    var light = {
      'bg': P(20, 94), 'text': P(15, 21), 'muted': P(6, 48),
      'box': P(30, 97), 'box-focus': '#FFFFFF', 'box1': A(30, 91), 'box1-focus': A(35, 96),
      'card-text': P(15, 21), 'card-muted': P(6, 48),
      'panel': hslToHex(p.h, p.s, pl), 'panel-text': P(20, 18),
      'soft': hslToHex(p.h, p.s * 0.8, Math.min(pl + 10, 90)), 'soft-text': P(22, 23),
      'accent': hslToHex(a.h, a.s, al), 'accent-text': A(55, 18),
      'ok': '#3F7A4A', 'err': '#B8453A', 'danger': '#CF6339', 'blue': '#4F7FB8',
      'track': P(8, 57), 'on': P(24, 53), 'bead-n': P(6, 55)
    };
    var pd = clamp(pl - 16, 45, 62), ad = clamp(al - 3, 60, 80);
    var dark = {
      'bg': P(12, 12), 'text': P(20, 90), 'muted': P(12, 72),
      'box': P(20, 86), 'box-focus': P(25, 93), 'box1': A(22, 82), 'box1-focus': A(30, 91),
      'card-text': P(15, 14), 'card-muted': P(11, 35),
      'panel': hslToHex(p.h, p.s * 0.75, pd), 'panel-text': P(22, 10),
      'soft': hslToHex(p.h, p.s * 0.7, Math.min(pd + 10, 75)), 'soft-text': P(22, 10),
      'accent': hslToHex(a.h, a.s * 0.95, ad), 'accent-text': A(48, 12),
      'ok': '#CFE3A0', 'err': '#FF9A8C', 'danger': '#D9704A', 'blue': '#4F7FB8',
      'track': P(9, 32), 'on': P(27, 60), 'bead-n': P(7, 43)
    };
    return { primary: primary, accent: accent, light: light, dark: dark };
  }
  // 預設配色的陣列轉成 {變數名: 色碼}
  function arrToVars(arr) {
    var o = {};
    VARS.forEach(function (v, i) { o[v] = arr[i]; });
    return o;
  }
  function presetTheme(p) {
    var light = arrToVars(p.light), dark = arrToVars(p.dark);
    return { primary: light.panel, accent: light.accent, light: light, dark: dark };
  }
  // 檢查一套變數是否完整且都是合法色碼（讀取儲存資料、匯入備份時用）
  function cleanVars(o) {
    if (!o || typeof o !== 'object') return null;
    var out = {};
    for (var i = 0; i < VARS.length; i++) {
      var h = normHex(o[VARS[i]]);
      if (!h) return null;
      out[VARS[i]] = h;
    }
    return out;
  }
  function cleanTheme(t) {
    if (!t || typeof t !== 'object') return null;
    var light = cleanVars(t.light), dark = cleanVars(t.dark);
    if (!light || !dark) return null;
    return { primary: normHex(t.primary) || light.panel, accent: normHex(t.accent) || light.accent, light: light, dark: dark };
  }
  // 檢查一筆收藏；不合法回傳 null
  function cleanFav(f) {
    if (!f || typeof f !== 'object') return null;
    var name = String(f.name || '未命名').slice(0, 30);
    var id = String(f.id || '');
    if (!id) return null;
    if (f.type === 'theme') {
      var t = cleanTheme(f.theme);
      return t ? { id: id, type: 'theme', name: name, theme: t } : null;
    }
    if (f.type === 'palette' && Array.isArray(f.colors)) {
      var cs = f.colors.map(normHex).filter(Boolean).slice(0, 12);
      if (!cs.length) return null;
      return { id: id, type: 'palette', name: name, colors: cs, base: normHex(f.base) || cs[0] };
    }
    return null;
  }

  // ===================== 狀態與儲存 =====================
  var state = {
    base: '#7FA37C',                    // 配色產生的主色
    theme: presetTheme(PRESETS[0]),     // 正在編輯的主題
    exportName: '',
    favs: [],
    mode: 'auto'                        // 工具本身的淺／深色：auto | light | dark
  };
  var hsl = hexToHsl(state.base);       // 滑桿用（灰階時保留色相，不然滑桿會跳回 0）
  var editMode = 'light';               // 變數清單目前顯示哪一套

  function loadState() {
    try {
      var d = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (normHex(d.base)) state.base = normHex(d.base);
      var t = cleanTheme(d.theme);
      if (t) state.theme = t;
      if (typeof d.exportName === 'string') state.exportName = d.exportName.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 20);
      if (Array.isArray(d.favs)) state.favs = d.favs.map(cleanFav).filter(Boolean);
      if (d.mode === 'light' || d.mode === 'dark') state.mode = d.mode;
    } catch (e) {}
    hsl = hexToHsl(state.base);
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast('儲存失敗（瀏覽器空間不足或停用儲存）'); }
  }

  // ===================== 小工具 =====================
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1600);
  }
  // 複製文字到剪貼簿（舊瀏覽器退回用隱藏文字框）
  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      toast(ok ? okMsg : '複製失敗，請手動選取');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    } else fallback();
  }
  // 彈窗：opts = {title, input（有給就顯示輸入框，值為預設文字）, okLabel, danger}
  // 回傳 Promise：按確定→輸入的文字（沒有輸入框則 true）；取消→null
  function ask(opts) {
    return new Promise(function (resolve) {
      var modal = $('modal'), input = $('modal-input'), ok = $('modal-ok'), cancel = $('modal-cancel');
      $('modal-title').textContent = opts.title;
      var hasInput = opts.input != null;
      input.hidden = !hasInput;
      input.value = hasInput ? opts.input : '';
      ok.textContent = opts.okLabel || '確定';
      ok.className = opts.danger ? 'danger' : '';
      modal.hidden = false;
      if (hasInput) { input.focus(); input.select(); }
      function done(v) {
        modal.hidden = true;
        ok.onclick = cancel.onclick = modal.onclick = input.onkeydown = null;
        resolve(v);
      }
      ok.onclick = function () { done(hasInput ? (input.value.trim() || opts.input) : true); };
      cancel.onclick = function () { done(null); };
      modal.onclick = function (e) { if (e.target === modal) done(null); };
      input.onkeydown = function (e) { if (e.key === 'Enter') ok.onclick(); };
    });
  }
  // 做一個可點擊複製的色塊
  function swatch(hex) {
    var b = el('button', 'sw', hex);
    b.type = 'button';
    b.style.background = hex;
    b.style.color = textOn(hex);
    b.setAttribute('aria-label', '複製 ' + hex);
    b.addEventListener('click', function () { copyText(hex, '已複製 ' + hex); });
    return b;
  }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  // ===================== 分頁 =====================
  var TABS = ['gen', 'theme', 'fav'];
  function showTab(name) {
    if (TABS.indexOf(name) < 0) name = 'gen';
    TABS.forEach(function (t) { $('tab-' + t).hidden = t !== name; });
    [].forEach.call($('tabs').children, function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === name); });
    if (name === 'fav') renderFavs();
    window.scrollTo(0, 0);
  }

  // ===================== 工具本身的淺／深色 =====================
  var MODE_LABEL = { auto: '自動', light: '淺色', dark: '深色' };
  function applyMode() {
    if (state.mode === 'auto') document.documentElement.removeAttribute('data-mode');
    else document.documentElement.setAttribute('data-mode', state.mode);
    $('mode-btn').textContent = MODE_LABEL[state.mode];
    // 狀態列顏色跟著背景色
    var c = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && c) m.setAttribute('content', c);
  }

  // ===================== 分頁一：配色產生 =====================
  function harmonyColors(offsets) {
    return offsets.map(function (o) { return hslToHex(hsl.h + o, hsl.s, hsl.l); });
  }
  function setBase(hex, fromSliders) {
    state.base = hex;
    if (!fromSliders) hsl = hexToHsl(hex);
    renderGen();
    save();
  }
  function renderGen() {
    var base = state.base;
    var sw = $('base-swatch');
    sw.style.background = base;
    sw.style.color = textOn(base);
    $('base-hex-label').textContent = base;
    $('base-color').value = base.toLowerCase();
    if (document.activeElement !== $('base-text')) $('base-text').value = base;

    // 滑桿數值與漸層軌道
    var h = Math.round(hsl.h), s = Math.round(hsl.s), l = Math.round(hsl.l);
    $('h-sl').value = h; $('s-sl').value = s; $('l-sl').value = l;
    $('h-out').textContent = h + '°'; $('s-out').textContent = s + '%'; $('l-out').textContent = l + '%';
    var stops = [];
    for (var i = 0; i <= 360; i += 60) stops.push(hslToHex(i, hsl.s, hsl.l));
    $('h-sl').style.setProperty('--grad', 'linear-gradient(to right,' + stops.join(',') + ')');
    $('s-sl').style.setProperty('--grad', 'linear-gradient(to right,' + hslToHex(hsl.h, 0, hsl.l) + ',' + hslToHex(hsl.h, 100, hsl.l) + ')');
    $('l-sl').style.setProperty('--grad', 'linear-gradient(to right,#000,' + hslToHex(hsl.h, hsl.s, 50) + ',#fff)');

    // 各組配色
    var box = $('harm');
    box.textContent = '';
    HARMONIES.forEach(function (hm) { box.appendChild(harmRow(hm[0], harmonyColors(hm[1]), true)); });
    var mono = MONO_L.map(function (L) { return hslToHex(hsl.h, hsl.s, L); });
    box.appendChild(harmRow('單色階', mono, false));
  }
  // 一組配色的區塊；canTheme＝是否顯示「做成主題」
  function harmRow(title, colors, canTheme) {
    var row = el('div', 'harm-row');
    var head = el('div', 'harm-head');
    head.appendChild(el('b', '', title));
    if (canTheme) {
      var tb = el('button', 'secondary small', '做成主題');
      tb.type = 'button';
      tb.style.background = 'var(--soft)'; tb.style.color = 'var(--soft-text)';
      tb.addEventListener('click', function () {
        // 第一色當主色、第二色當強調色
        state.theme = generateTheme(colors[0], colors[1]);
        save(); renderTheme(); showTab('theme');
        toast('已用這組配色產生主題');
      });
      head.appendChild(tb);
    }
    var fb = el('button', 'small', '收藏');
    fb.type = 'button';
    fb.addEventListener('click', function () {
      ask({ title: '收藏這組配色', input: title + ' ' + state.base, okLabel: '收藏' }).then(function (name) {
        if (name == null) return;
        state.favs.unshift({ id: newId(), type: 'palette', name: name.slice(0, 30), colors: colors.slice(), base: state.base });
        save(); toast('已收藏');
      });
    });
    head.appendChild(fb);
    row.appendChild(head);
    var sws = el('div', 'sws');
    colors.forEach(function (c) { sws.appendChild(swatch(c)); });
    row.appendChild(sws);
    return row;
  }

  // ===================== 分頁二：主題色卡 =====================
  function renderPresets() {
    var box = $('presets');
    PRESETS.forEach(function (p) {
      var b = el('button', 'preset');
      b.type = 'button';
      var chips = el('span', 'chips');
      // 色點：卡片、強調、主要動作、藍
      [p.light[9], p.light[13], p.light[17], p.light[18]].forEach(function (c) {
        var i = el('i'); i.style.background = c; chips.appendChild(i);
      });
      b.appendChild(chips);
      b.appendChild(el('span', '', p.name));
      b.addEventListener('click', function () {
        state.theme = presetTheme(p);
        save(); renderTheme();
        toast('已載入「' + p.name + '」');
      });
      box.appendChild(b);
    });
  }
  // 主色／強調色的「選色器＋色碼輸入框」成對同步
  function bindPair(colorId, textId, key) {
    var ce = $(colorId), te = $(textId);
    function show() {
      var v = state.theme[key];
      ce.value = v.toLowerCase();
      ce.parentNode.style.background = v;
      if (document.activeElement !== te) te.value = v;
    }
    ce.addEventListener('input', function () { state.theme[key] = normHex(ce.value); show(); save(); });
    te.addEventListener('change', function () {
      var v = normHex(te.value);
      if (v) { state.theme[key] = v; save(); } else toast('色碼格式不對，例如 #7FA37C');
      te.value = state.theme[key];
      show();
    });
    return show;
  }
  var showPri, showAcc;

  // 預覽區的內容（只建一次，顏色靠容器上的 CSS 變數）
  function buildPreview(box) {
    box.appendChild(el('div', 'pv-title', '標題卡片'));
    box.appendChild(el('div', 'pv-sub', '次要文字說明'));
    var boxes = el('div', 'pv-boxes');
    var b0 = el('div', 'pv-box');
    b0.appendChild(el('span', 'a', '2A'));
    b0.appendChild(document.createTextNode(' 格子文字'));
    b0.appendChild(el('small', '', '格子次要字'));
    var b1 = el('div', 'pv-box b1');
    b1.appendChild(el('span', 'b', '1B'));
    b1.appendChild(document.createTextNode(' 第二格子'));
    b1.appendChild(el('small', '', '格子次要字'));
    boxes.appendChild(b0); boxes.appendChild(b1);
    box.appendChild(boxes);
    var btns = el('div', 'pv-btns');
    btns.appendChild(el('div', 'pv-btn', '強調按鈕'));
    btns.appendChild(el('div', 'pv-btn danger', '主要動作'));
    btns.appendChild(el('div', 'pv-btn soft', '柔和按鈕'));
    btns.appendChild(el('div', 'pv-btn sec', '次要按鈕'));
    box.appendChild(btns);
    var ctl = el('div', 'pv-ctl');
    ctl.appendChild(el('div', 'pv-track'));
    ctl.appendChild(el('div', 'pv-switch'));
    box.appendChild(ctl);
    box.appendChild(el('p', 'pv-msg ok', '成功訊息'));
    box.appendChild(el('p', 'pv-msg err', '錯誤訊息'));
  }
  function renderPreview() {
    ['light', 'dark'].forEach(function (m) {
      var box = $('pv-' + m), vars = state.theme[m];
      VARS.forEach(function (v) { box.style.setProperty('--' + v, vars[v]); });
    });
  }
  // 變數清單：每個色塊蓋著一個原生選色器
  function renderVars() {
    var box = $('vars'), vars = state.theme[editMode];
    box.textContent = '';
    VARS.forEach(function (v) {
      var item = el('label', 'var');
      var sw = el('span', 'var-sw');
      sw.style.background = vars[v];
      var inp = document.createElement('input');
      inp.type = 'color'; inp.value = vars[v].toLowerCase();
      inp.setAttribute('aria-label', '修改 --' + v);
      sw.appendChild(inp);
      var info = el('span', 'var-info');
      info.appendChild(el('b', '', VAR_LABEL[v]));
      info.appendChild(document.createTextNode('--' + v + ' '));
      var code = el('code', '', vars[v]);
      info.appendChild(code);
      inp.addEventListener('input', function () {
        var hex = normHex(inp.value);
        state.theme[editMode][v] = hex;
        // 只更新這一格，不重畫整個清單（重畫會關掉開著的選色器）
        sw.style.background = hex; code.textContent = hex;
        renderPreview(); renderContrast(); renderExport(); save();
      });
      item.appendChild(sw); item.appendChild(info);
      box.appendChild(item);
    });
  }
  function grade(r) {
    if (r >= 7) return ['AAA', 'good'];
    if (r >= 4.5) return ['AA', 'good'];
    if (r >= 3) return ['大字', 'mid'];
    return ['不足', 'bad'];
  }
  function renderContrast() {
    var box = $('contrast');
    box.textContent = '';
    var head = el('div', 'ct-row head');
    head.appendChild(el('span', '', '組合'));
    head.appendChild(el('span', '', '淺色'));
    head.appendChild(el('span', '', '深色'));
    box.appendChild(head);
    PAIRS.forEach(function (p) {
      var row = el('div', 'ct-row');
      row.appendChild(el('span', '', p[2]));
      ['light', 'dark'].forEach(function (m) {
        var vars = state.theme[m];
        var fg = p[0].charAt(0) === '#' ? p[0] : vars[p[0]], bg = vars[p[1]];
        var r = contrast(fg, bg), g = grade(r);
        var cell = el('span', 'ct-cell');
        var sample = el('span', 'ct-sample', '字');
        sample.style.background = bg; sample.style.color = fg;
        var num = el('span', 'ct-num', r.toFixed(2));
        num.appendChild(el('em', g[1], g[0]));
        cell.appendChild(sample); cell.appendChild(num);
        row.appendChild(cell);
      });
      box.appendChild(row);
    });
  }
  // 產生可直接貼進 style.css 的 CSS
  function cssText() {
    var sel = state.exportName ? '[data-theme="' + state.exportName + '"]' : ':root';
    function block(vars, indent) {
      return VARS.map(function (v) { return indent + '--' + v + ': ' + vars[v] + ';'; }).join('\n');
    }
    return sel + ' {\n' + block(state.theme.light, '  ') + '\n}\n' +
      '@media (prefers-color-scheme: dark) {\n  ' + sel + ' {\n' + block(state.theme.dark, '    ') + '\n  }\n}\n';
  }
  function renderExport() { $('export-code').textContent = cssText(); }
  function renderTheme() {
    showPri(); showAcc();
    renderPreview(); renderVars(); renderContrast(); renderExport();
  }

  // ===================== 分頁三：收藏 =====================
  function renderFavs() {
    var box = $('fav-list');
    box.textContent = '';
    if (!state.favs.length) {
      var e = el('p', 'empty');
      e.appendChild(document.createTextNode('還沒有收藏'));
      e.appendChild(document.createElement('br'));
      e.appendChild(document.createTextNode('在「配色產生」或「主題色卡」按「收藏」就會出現在這裡'));
      box.appendChild(e);
      return;
    }
    state.favs.forEach(function (f) {
      var card = el('div', 'fav');
      var head = el('div', 'fav-head');
      head.appendChild(el('b', '', f.name));
      head.appendChild(el('span', '', f.type === 'theme' ? '主題' : '配色'));
      card.appendChild(head);
      var sws = el('div', 'sws');
      var colors = f.type === 'theme'
        ? [f.theme.light.bg, f.theme.light.panel, f.theme.light.accent, f.theme.dark.bg, f.theme.dark.panel, f.theme.dark.accent]
        : f.colors;
      colors.forEach(function (c) { sws.appendChild(swatch(c)); });
      card.appendChild(sws);

      var acts = el('div', 'fav-actions');
      var loadB = el('button', '', '載入'); loadB.type = 'button';
      loadB.addEventListener('click', function () {
        if (f.type === 'theme') {
          state.theme = JSON.parse(JSON.stringify(f.theme));
          save(); renderTheme(); showTab('theme');
        } else {
          setBase(f.base); showTab('gen');
        }
        toast('已載入「' + f.name + '」');
      });
      var copyB = el('button', '', f.type === 'theme' ? '複製 CSS' : '複製全部'); copyB.type = 'button';
      copyB.addEventListener('click', function () {
        if (f.type === 'theme') {
          // 暫時換成這組主題來產生 CSS，再換回來
          var keep = state.theme;
          state.theme = f.theme;
          var css = cssText();
          state.theme = keep;
          copyText(css, '已複製 CSS');
        } else copyText(f.colors.join(', '), '已複製 ' + f.colors.length + ' 個色碼');
      });
      var renB = el('button', '', '改名'); renB.type = 'button';
      renB.addEventListener('click', function () {
        ask({ title: '改名', input: f.name }).then(function (name) {
          if (name == null) return;
          f.name = name.slice(0, 30);
          save(); renderFavs();
        });
      });
      var delB = el('button', 'del', '刪除'); delB.type = 'button';
      delB.addEventListener('click', function () {
        ask({ title: '刪除「' + f.name + '」？', okLabel: '刪除', danger: true }).then(function (ok) {
          if (!ok) return;
          state.favs = state.favs.filter(function (x) { return x.id !== f.id; });
          save(); renderFavs();
        });
      });
      acts.appendChild(loadB); acts.appendChild(copyB); acts.appendChild(renB); acts.appendChild(delB);
      card.appendChild(acts);
      box.appendChild(card);
    });
  }
  // 匯出備份：下載一個 JSON 檔
  function backup() {
    if (!state.favs.length) { toast('沒有收藏可以匯出'); return; }
    var blob = new Blob([JSON.stringify({ app: 'color-tool', favs: state.favs }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    var d = new Date();
    function p2(n) { return n < 10 ? '0' + n : '' + n; }
    a.href = URL.createObjectURL(blob);
    a.download = '配色收藏_' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  // 匯入備份：合併進現有收藏（同一筆不重複加）
  function restore(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        var list = Array.isArray(d) ? d : d.favs;
        if (!Array.isArray(list)) throw new Error('format');
        var have = {}, added = 0;
        state.favs.forEach(function (f) { have[f.id] = true; });
        list.map(cleanFav).filter(Boolean).forEach(function (f) {
          if (have[f.id]) return;
          have[f.id] = true;
          state.favs.push(f); added++;
        });
        save(); renderFavs();
        toast(added ? '已匯入 ' + added + ' 筆' : '沒有新的收藏可匯入');
      } catch (e) { toast('這不是配色工具的備份檔'); }
    };
    reader.readAsText(file);
  }

  // ===================== 啟動 =====================
  function init() {
    loadState();
    applyMode();

    // 分頁
    [].forEach.call($('tabs').children, function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    });
    // 淺／深色：自動 → 淺色 → 深色 → 自動
    $('mode-btn').addEventListener('click', function () {
      state.mode = state.mode === 'auto' ? 'light' : state.mode === 'light' ? 'dark' : 'auto';
      applyMode(); save();
    });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', applyMode);
    }

    // 配色產生
    $('base-color').addEventListener('input', function () { setBase(normHex($('base-color').value)); });
    $('base-text').addEventListener('change', function () {
      var v = normHex($('base-text').value);
      if (v) setBase(v);
      else { toast('色碼格式不對，例如 #7FA37C'); $('base-text').value = state.base; }
    });
    $('base-text').addEventListener('blur', function () { $('base-text').value = state.base; });
    ['h', 's', 'l'].forEach(function (k) {
      $(k + '-sl').addEventListener('input', function () {
        hsl[k] = Number($(k + '-sl').value);
        setBase(hslToHex(hsl.h, hsl.s, hsl.l), true);
      });
    });
    $('random-btn').addEventListener('click', function () {
      // 隨機但避開太灰、太暗、太亮
      setBase(hslToHex(Math.random() * 360, 35 + Math.random() * 45, 40 + Math.random() * 30));
    });

    // 主題色卡
    renderPresets();
    showPri = bindPair('pri-color', 'pri-text', 'primary');
    showAcc = bindPair('acc-color', 'acc-text', 'accent');
    buildPreview($('pv-light')); buildPreview($('pv-dark'));
    $('gen-theme-btn').addEventListener('click', function () {
      state.theme = generateTheme(state.theme.primary, state.theme.accent);
      save(); renderTheme();
      toast('已產生主題');
    });
    [].forEach.call($('edit-mode').children, function (b) {
      b.addEventListener('click', function () {
        editMode = b.getAttribute('data-m');
        [].forEach.call($('edit-mode').children, function (x) { x.classList.toggle('on', x === b); });
        renderVars();
      });
    });
    $('export-name').value = state.exportName;
    $('export-name').addEventListener('input', function () {
      // 代號只留英數、底線、連字號，避免產生壞掉的 CSS
      var v = $('export-name').value.replace(/[^A-Za-z0-9_-]/g, '');
      if (v !== $('export-name').value) $('export-name').value = v;
      state.exportName = v;
      renderExport(); save();
    });
    $('copy-css-btn').addEventListener('click', function () { copyText(cssText(), '已複製 CSS'); });
    $('save-theme-btn').addEventListener('click', function () {
      ask({ title: '收藏這組主題', input: '主題 ' + state.theme.light.panel, okLabel: '收藏' }).then(function (name) {
        if (name == null) return;
        state.favs.unshift({ id: newId(), type: 'theme', name: name.slice(0, 30), theme: JSON.parse(JSON.stringify(state.theme)) });
        save(); toast('已收藏');
      });
    });

    // 收藏
    $('backup-btn').addEventListener('click', backup);
    $('restore-btn').addEventListener('click', function () { $('restore-file').click(); });
    $('restore-file').addEventListener('change', function () {
      var f = $('restore-file').files[0];
      if (f) restore(f);
      $('restore-file').value = '';
    });

    renderGen();
    renderTheme();
    // 網址帶 #theme 或 #fav 可直接開到該分頁
    showTab(location.hash.replace('#', '') || 'gen');

    // 離線支援（只在 http/https 下註冊；直接開檔案不註冊）
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
