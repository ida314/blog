// Draws the Codeforces rating graph, matching the one on codeforces.com/profile/<handle>.
// Reads the public API from the visitor's browser, so it is current on every page load.
// If the request fails, the fallback link already in the page stays in place.
(function () {
  var box = document.getElementById("cf-graph");
  if (!box) return;
  var handle = box.dataset.handle;
  var api = "https://codeforces.com/api/";
  var profile = "https://codeforces.com/profile/" + encodeURIComponent(handle);
  var plotBox = document.createElement("div");
  plotBox.className = "cf-plot";
  var NS = "http://www.w3.org/2000/svg";

  // Rank bands, lowest first: [lower bound, colour]
  var BANDS = [[0, "#cccccc"], [1200, "#77ff77"], [1400, "#77ddbb"], [1600, "#aaaaff"], [1900, "#ff88ff"],
               [2100, "#ffcc88"], [2300, "#ffbb55"], [2400, "#ff7777"], [2600, "#ff3333"], [3000, "#aa0000"]];
  var INK = "#545454", GOLD = "#edc240", PEAK = "#ff0000";
  var M = { left: 47, right: 18.5, top: 33, bottom: 45 }; // margins around the plot
  var FULL_WIDTH = 850, FULL_PLOT_HEIGHT = 300;
  // Handle colours by rating: [lower bound, light theme, dark theme]
  var RANKS = [[0, "#808080", "#b3b3b3"], [1200, "#008000", "#3cb371"], [1400, "#03a89e", "#03a89e"], [1600, "#0000ff", "#7b9cff"],
               [1900, "#aa00aa", "#d65ad6"], [2100, "#ff8c00", "#ff8c00"], [2400, "#ff0000", "#ff5c5c"]];

  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function monthLabel(d) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  }

  function header(info, rating) {
    var a = document.createElement("a");
    a.className = "cf-header";
    a.href = profile;
    a.target = "_blank";
    a.rel = "noopener";
    if (info && info.avatar) {
      var img = document.createElement("img");
      img.alt = "";
      img.src = info.avatar;
      img.onerror = function () { img.remove(); }; // the name alone is fine if the photo won't load
      a.appendChild(img);
    }
    var name = document.createElement("span");
    name.className = "cf-handle";
    name.textContent = info && info.handle || handle;
    var rank = RANKS.filter(function (r) { return rating >= r[0]; }).pop();
    name.style.setProperty("--cf-rank", rank[1]);
    name.style.setProperty("--cf-rank-dark", rank[2]);
    a.appendChild(name);
    return a;
  }

  function draw(pts) {
    var old = plotBox.querySelector("a");
    if (old) old.remove();

    var W = Math.min(plotBox.clientWidth || FULL_WIDTH, FULL_WIDTH);
    var plotH = Math.max(180, Math.round(FULL_PLOT_HEIGHT * W / FULL_WIDTH));
    var H = M.top + plotH + M.bottom;
    var x0 = M.left, x1 = W - M.right, y0 = M.top, y1 = M.top + plotH;

    var rs = pts.map(function (p) { return p.newRating; });
    var lowest = Math.min.apply(null, rs), highest = Math.max.apply(null, rs);
    var yMin = Math.max(0, lowest - 100), yMax = Math.max(2000, highest + 100);
    var tMin = pts[0].ratingUpdateTimeSeconds, tMax = pts[pts.length - 1].ratingUpdateTimeSeconds;
    if (tMax === tMin) { tMin -= 86400; tMax += 86400; }

    var sx = function (t) { return x0 + (t - tMin) / (tMax - tMin) * (x1 - x0); };
    var sy = function (r) { return y0 + (yMax - r) / (yMax - yMin) * (y1 - y0); };
    var NUDGE = 0.75; // Codeforces draws its line, dots and bottom edge this far below the band scale
    var yEdge = y1 + NUDGE;

    var link = document.createElement("a");
    link.href = profile;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "cf-link";
    plotBox.appendChild(link);
    var svg = el("svg", {
      width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Codeforces rating history for " + handle + ": currently " + rs[rs.length - 1] + ", peak " + highest
    }, link);
    var defs = el("defs", {}, svg);
    el("rect", { x: x0, y: y0, width: x1 - x0, height: yEdge - y0 }, el("clipPath", { id: "cf-clip" }, defs));

    // Rank bands
    BANDS.forEach(function (b, i) {
      var lo = Math.max(b[0], yMin), hi = Math.min(i + 1 < BANDS.length ? BANDS[i + 1][0] : Infinity, yMax);
      if (lo < hi) el("rect", { x: x0, y: sy(hi) + 0.25, width: x1 - x0, height: (lo === yMin ? yEdge : sy(lo) + 0.25) - (sy(hi) + 0.25), fill: b[1] }, svg);
    });

    // Horizontal grid and rating labels, only at rank boundaries
    BANDS.slice(1).forEach(function (b) {
      if (b[0] <= yMin || b[0] >= yMax) return;
      var y = sy(b[0]);
      el("line", { x1: x0, x2: x1, y1: y + 0.25, y2: y + 0.25, class: "cf-grid" }, svg);
      el("text", { x: x0 - 5.25, y: Math.round((y + 4.5) * 2) / 2, "text-anchor": "end", class: "cf-label" }, svg, b[0]);
    });

    // Vertical grid and month labels. Show fewer months when the graph is narrow.
    var first = new Date(tMin * 1000), span = (tMax - tMin) / 2629800;
    var step = [1, 2, 3, 6, 12, 24, 60].find(function (s) { return span / s <= (x1 - x0) / 72; }) || 120;
    var month = Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 1);
    for (var d = new Date(month); d.getTime() / 1000 < tMax;
         d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + step, 1))) {
      if (step > 1 && d.getUTCMonth() % step !== 0) continue;
      var x = sx(d.getTime() / 1000) + 0.25, label = monthLabel(d);
      el("line", { x1: x, x2: x, y1: y0, y2: yEdge, class: "cf-grid" }, svg);
      var t = el("text", { x: x, y: y1 + 18.5, "text-anchor": "middle", class: "cf-label" }, svg, label);
      // A label that would run past the plot wraps and sits against its right edge, as on Codeforces
      if (x + t.getComputedTextLength() / 2 > x1) {
        var parts = label.split(" ");
        t.textContent = "";
        var widest = 0;
        parts.forEach(function (p, i) {
          var line = el("tspan", { dy: i ? 15 : 0 }, t, p);
          widest = Math.max(widest, line.getComputedTextLength());
        });
        var cx = x1 + 1 - widest / 2;
        Array.prototype.forEach.call(t.children, function (s) { s.setAttribute("x", cx); });
        t.setAttribute("x", cx);
      }
    }

    // Plot border
    el("rect", { x: x0 - 1, y: y0 - 1, width: x1 - x0 + 2, height: yEdge - y0 + 2, fill: "none", stroke: INK, "stroke-width": 2 }, svg);

    // Line, with the soft shadow below it
    var line = function (dx, dy) {
      return pts.map(function (p) { return (sx(p.ratingUpdateTimeSeconds) + dx) + "," + (sy(p.newRating) + NUDGE + dy); }).join(" ");
    };
    var a = Math.PI / 18, lw = 2.25, sw = 3, plot = el("g", { "clip-path": "url(#cf-clip)" }, svg);
    el("polyline", { points: line(Math.sin(a) * (lw / 2 + sw / 2), Math.cos(a) * (lw / 2 + sw / 2)), fill: "none", stroke: "rgba(0,0,0,.1)", "stroke-width": sw }, plot);
    el("polyline", { points: line(Math.sin(a) * (lw / 2 + sw / 4), Math.cos(a) * (lw / 2 + sw / 4)), fill: "none", stroke: "rgba(0,0,0,.2)", "stroke-width": sw / 2 }, plot);
    el("polyline", { points: line(0, 0), fill: "none", stroke: GOLD, "stroke-width": lw, "stroke-linejoin": "round" }, plot);

    // Contest points. The peak is red; hovering one shows the contest.
    var peak = rs.lastIndexOf(highest);
    pts.forEach(function (p, i) {
      var c = el("circle", { cx: sx(p.ratingUpdateTimeSeconds), cy: sy(p.newRating) + NUDGE, r: 3.25, fill: "#fff", stroke: i === peak ? PEAK : GOLD, "stroke-width": 2 }, svg);
      var delta = p.newRating - p.oldRating;
      el("title", {}, c, p.contestName + "\n" + p.newRating + " (" + (delta >= 0 ? "+" : "") + delta + "), rank " + p.rank);
    });

    // Legend
    var lx = x1 - 49.5, ly = y0 + 5;
    el("rect", { x: lx, y: ly, width: 44.5, height: 16, fill: "#fff", "fill-opacity": .85 }, svg);
    el("rect", { x: lx + 0.5, y: ly + 0.5, width: 19, height: 15, fill: "none", stroke: "#ccc", "stroke-width": 1 }, svg);
    el("rect", { x: lx + 2.5, y: ly + 2.5, width: 15.5, height: 11, fill: GOLD }, svg);
    el("text", { x: lx + 19.75, y: ly + 12.5, fill: INK }, svg, handle);
  }

  // Codeforces limits API calls, so make them one at a time and retry once after its 2 s window
  function getJson(path, retries) {
    return fetch(api + path).then(function (r) {
      if (r.status >= 500) throw new Error("HTTP " + r.status);
      return r.json();
    }).catch(function (e) {
      if (!retries) throw e;
      return new Promise(function (ok) { setTimeout(ok, 2200); }).then(function () { return getJson(path, retries - 1); });
    });
  }

  getJson("user.rating?handle=" + encodeURIComponent(handle), 1).then(function (rating) {
    return getJson("user.info?handles=" + encodeURIComponent(handle), 0)
      .catch(function () { return null; }) // this only adds the photo
      .then(function (info) { return [rating, info]; });
  }).then(function (res) {
    var d = res[0];
    if (d.status !== "OK" || !d.result.length) throw new Error("no rated contests");
    var info = res[1] && res[1].status === "OK" ? res[1].result[0] : null;
    var select = document.createElement("select");
    select.setAttribute("aria-label", "Contests shown");
    select.innerHTML = "<option>Only rated</option>";
    plotBox.appendChild(select);
    box.textContent = "";
    box.appendChild(header(info, d.result[d.result.length - 1].newRating));
    box.appendChild(plotBox);
    draw(d.result);
    if (window.ResizeObserver) {
      var lastW = plotBox.clientWidth;
      new ResizeObserver(function () {
        if (plotBox.clientWidth !== lastW) { lastW = plotBox.clientWidth; draw(d.result); }
      }).observe(plotBox);
    }
  }).catch(function (e) { console.warn("Codeforces graph:", e); });
})();
