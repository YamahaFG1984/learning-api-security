// 共享交互脚本：三栏代码对比 (Java/Spark, Python/Django, JS-TS/Hono) 的标签页切换。
// 点击任意一个 "Python" 标签，页面内所有代码对比块都会一起切到 Python，方便通篇对照阅读。
(function () {
  function setActiveLang(lang) {
    document.querySelectorAll(".code-compare").forEach(function (block) {
      var btns = block.querySelectorAll(".tab-btn");
      var panels = block.querySelectorAll(".tab-panel");
      var found = false;
      btns.forEach(function (b) {
        var match = b.getAttribute("data-lang") === lang;
        b.classList.toggle("active", match);
        if (match) found = true;
      });
      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-lang") === lang);
      });
      if (!found && btns.length) {
        btns[0].classList.add("active");
        panels[0].classList.add("active");
      }
    });
    try { localStorage.setItem("apisec-tutorial-lang", lang); } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    setActiveLang(btn.getAttribute("data-lang"));
  });

  // 图表最多缩到原始尺寸的 90%，再窄就在图框内横向滚动，避免文字被缩得看不清。
  function setDiagramMinWidth() {
    document.querySelectorAll("figure.diagram svg[viewBox]").forEach(function (svg) {
      var vb = svg.getAttribute("viewBox").trim().split(/[\s,]+/);
      var w = parseFloat(vb[2]);
      if (w > 0) svg.style.minWidth = Math.round(w * 0.9) + "px";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.hljs) window.hljs.highlightAll();
    setDiagramMinWidth();
    var saved = null;
    try { saved = localStorage.getItem("apisec-tutorial-lang"); } catch (e) {}
    setActiveLang(saved || "java");

    // 侧边目录：根据滚动位置高亮当前小节
    var links = Array.prototype.slice.call(document.querySelectorAll(".sidebar nav a[href^='#']"));
    var targets = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    if (!targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links.find(function (a) { return a.getAttribute("href") === "#" + entry.target.id; });
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  });
})();
