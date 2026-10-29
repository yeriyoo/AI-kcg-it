
/* =========================================
   SeaOn Weather Portal - common.js
========================================= */

(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  /* =======================================
     01. LUCIDE ICONS
  ======================================= */
  const initIcons = () => {
    if (
      window.lucide &&
      typeof window.lucide.createIcons === "function"
    ) {
      window.lucide.createIcons();
    }
  };

  initIcons();

  /* =======================================
     02. KST CLOCK
  ======================================= */
  const clock = $("#clock");

  function updateClock() {
    if (!clock) return;

    const time = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());

    clock.textContent = `${time} KST`;
    clock.dateTime = new Date().toISOString();
  }

  updateClock();
  window.setInterval(updateClock, 1000);


  /* =======================================
     04. TOOLBAR COLLAPSE
  ======================================= */
  const toolbarCollapse = $("#toolbarCollapse");
  const toolbarGroups = $("#toolbarGroups");

  toolbarCollapse?.addEventListener("click", () => {
    const open = toolbarGroups.hidden;

    toolbarGroups.hidden = !open;

    toolbarCollapse.setAttribute(
      "aria-expanded",
      String(open)
    );

    toolbarCollapse.setAttribute(
      "aria-label",
      open ? "도구 모음 접기" : "도구 모음 펼치기"
    );

    toolbarCollapse.innerHTML = `
      <i data-lucide="${open ? "chevron-up" : "chevron-down"}"></i>
    `;

    initIcons();
  });

  /* =======================================
     05. MAP ZOOM
  ======================================= */
  const scene = $("#mapScene");
  let zoom = 1;

  function setZoom(value) {
    zoom = Math.max(
      1,
      Math.min(2.5, Math.round(value * 10) / 10)
    );

    scene?.style.setProperty(
      "--map-scale",
      String(zoom)
    );

    showToast(`지도 배율 ${Math.round(zoom * 100)}%`);
  }

  $("#zoomIn")?.addEventListener("click", () => {
    setZoom(zoom + 0.2);
  });

  $("#zoomOut")?.addEventListener("click", () => {
    setZoom(zoom - 0.2);
  });

  $("#zoomReset")?.addEventListener("click", () => {
    setZoom(1);
  });

  /* =======================================
     06. FULLSCREEN
  ======================================= */
  $("#fullscreenButton")?.addEventListener(
    "click",
    async () => {
      const element = $("#map");

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (element?.requestFullscreen) {
          await element.requestFullscreen();
        } else {
          showToast(
            "이 브라우저에서는 전체 화면을 지원하지 않습니다."
          );
        }
      } catch {
        showToast("전체 화면을 실행할 수 없습니다.");
      }
    }
  );

  /* =======================================
     07. TOOLBAR BUTTONS
  ======================================= */
  document
    .querySelectorAll(".tool-btn[data-tool]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.tool;

        if (
          ["temperature", "typhoon", "grid", "wind"].includes(key)
        ) {
          const active = button.classList.toggle("is-active");

          button.setAttribute(
            "aria-pressed",
            String(active)
          );

          showToast(
            `${button.getAttribute("aria-label")} ${
              active ? "선택됨" : "선택 해제됨"
            } · 실제 레이어 데이터는 연결되지 않았습니다.`
          );
        } else {
          showToast(
            `${button.getAttribute("aria-label")} 기능은 데이터 연동 후 사용할 수 있습니다.`
          );
        }
      });
    });

  /* =======================================
     08. STATION CLICK
  ======================================= */
  document
    .querySelectorAll(".station")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const speed = button
          .querySelector(".station-speed")
          ?.textContent.trim() || "";

        const wave = button
          .querySelector(".station-wave")
          ?.textContent.trim() || "";

        showToast(
          `${button.dataset.station} · 풍속 ${speed} · ${wave}`
        );
      });
    });

  /* =======================================
     09. PRINT
  ======================================= */
  $("#printButton")?.addEventListener("click", () => {
    window.print();
  });

  /* =======================================
     10. CSV DOWNLOAD
  ======================================= */
  $("#downloadButton")?.addEventListener("click", () => {
    const rows = [
      ["관측지점", "풍속", "파고"],
      ...Array.from(
        document.querySelectorAll(".station"),
        (element) => [
          element.dataset.station,
          element.querySelector(".station-speed")
            ?.textContent.trim() || "",
          element.querySelector(".station-wave")
            ?.textContent.trim() || ""
        ]
      )
    ];

    const csv = "\uFEFF" + rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8"
      })
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "weather-stations-sample.csv";
    link.click();

    URL.revokeObjectURL(url);
  });

  /* =======================================
     11. NOTIFICATION
  ======================================= */
  $("#notificationButton")?.addEventListener(
    "click",
    () => {
      showToast("연결된 알림 데이터가 없습니다.");
    }
  );

  /* =======================================
     12. BRIGHTNESS
  ======================================= */
  $("#brightnessButton")?.addEventListener(
    "click",
    () => {
      $("#map")?.classList.toggle("is-bright");
    }
  );

  /* =======================================
     13. TOAST
  ======================================= */
  const toast = $("#mapToast");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }
})();


/* =========================================
   전체메뉴 슬라이딩
========================================= */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navClose = document.getElementById("navClose");
const navOverlay = document.getElementById("navOverlay");

let navCloseTimer = null;

function openNavMenu() {
  if (!navMenu || !navToggle || !navOverlay) return;

  window.clearTimeout(navCloseTimer);

  navMenu.inert = false;
  navMenu.setAttribute("aria-hidden", "false");
  navMenu.classList.add("is-open");

  navOverlay.hidden = false;

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "전체 메뉴 닫기");

  navClose?.focus();
}

function closeNavMenu() {
  if (!navMenu || !navToggle || !navOverlay) return;

  navToggle.focus();

  navMenu.classList.remove("is-open");
  navMenu.inert = true;
  navMenu.setAttribute("aria-hidden", "true");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "전체 메뉴 열기");

  window.clearTimeout(navCloseTimer);

  navCloseTimer = window.setTimeout(() => {
    navOverlay.hidden = true;
  }, 280);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("is-open");

  if (isOpen) {
    closeNavMenu();
  } else {
    openNavMenu();
  }
});

navClose?.addEventListener("click", closeNavMenu);
navOverlay?.addEventListener("click", closeNavMenu);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    navMenu?.classList.contains("is-open")
  ) {
    closeNavMenu();
  }
});

/* 그룹 펼침 / 접힘 */
document.querySelectorAll(".nav-section-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const contentId = button.getAttribute("aria-controls");
    const content = document.getElementById(contentId);

    if (!content) return;

    const isExpanded =
      button.getAttribute("aria-expanded") === "true";

    button.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    content.hidden = isExpanded;
  });
});


/* =========================================
   예·특보 타임라인
========================================= */
(() => {
  const timeline = document.getElementById("timelineDays");
  const label = document.getElementById("forecastDateLabel");
  const progress = document.getElementById("timelineProgress");
  const playButton = document.getElementById("timelinePlay");

  if (!timeline || !label || !progress || !playButton) {
    return;
  }

  const buttons = Array.from(
    timeline.querySelectorAll(".timeline-slots button")
  );

  let selectedIndex = Math.max(
    0,
    buttons.findIndex((button) =>
      button.classList.contains("is-active")
    )
  );

  let playTimer = null;

  function selectForecast(index) {
    selectedIndex = index;

    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === selectedIndex;

      button.classList.toggle("is-active", active);

      if (active) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    const selected = buttons[selectedIndex];

    label.textContent =
      `${selected.dataset.date} ${selected.dataset.time} 단기`;

    const percent =
      ((selectedIndex + 1) / buttons.length) * 100;

    progress.style.width = `${percent}%`;

    selected.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }

  function stopPlayback() {
    if (playTimer !== null) {
      window.clearInterval(playTimer);
      playTimer = null;
    }

    playButton.setAttribute("aria-pressed", "false");
    playButton.setAttribute("aria-label", "예보 자동 재생");

    playButton.innerHTML =
      '<i data-lucide="play" aria-hidden="true"></i>';

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function startPlayback() {
    playButton.setAttribute("aria-pressed", "true");
    playButton.setAttribute("aria-label", "예보 자동 재생 정지");

    playButton.innerHTML =
      '<i data-lucide="pause" aria-hidden="true"></i>';

    if (window.lucide) {
      window.lucide.createIcons();
    }

    playTimer = window.setInterval(() => {
      if (selectedIndex >= buttons.length - 1) {
        stopPlayback();
        return;
      }

      selectForecast(selectedIndex + 1);
    }, 1500);
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      stopPlayback();
      selectForecast(index);
    });
  });

  playButton.addEventListener("click", () => {
    if (playTimer !== null) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  selectForecast(selectedIndex);
})();


// =========================================
// 태풍 페이지 - 범례 접기 / 펼치기
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  const legendButton = document.getElementById("legendCollapse");
  const legendContent = document.getElementById("legendContent");

  if (!legendButton || !legendContent) return;

  legendButton.addEventListener("click", () => {
    const expanded =
      legendButton.getAttribute("aria-expanded") === "true";

    legendContent.hidden = expanded;

    legendButton.setAttribute(
      "aria-expanded",
      String(!expanded)
    );

    legendButton.setAttribute(
      "aria-label",
      expanded ? "범례 펼치기" : "범례 접기"
    );

    const icon = legendButton.querySelector("[data-lucide]");

    if (icon) {
      icon.setAttribute(
        "data-lucide",
        expanded ? "maximize-2" : "minimize-2"
      );

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  });
});


/* =========================================
   해구별 해양기상정보 - 소해구도
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".marine-grid-main");
  if (!page) return;

  function setupCollapse(buttonId, contentId) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (!button || !content) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));
      button.setAttribute(
        "aria-label",
        isExpanded ? "펼치기" : "접기"
      );

      content.hidden = isExpanded;
    });
  }

  setupCollapse("gridLegendCollapse", "gridLegendContent");
  setupCollapse("marineLayerCollapse", "marineLayerContent");

  const closeButton = document.getElementById("marineLayerClose");
  const layerPanel = page.querySelector(".marine-layer-panel");

  closeButton?.addEventListener("click", () => {
    if (layerPanel) layerPanel.hidden = true;
  });

  page.querySelectorAll(".marine-layer-options").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;

      group.querySelectorAll("button").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  const timelineButtons = page.querySelectorAll(
    ".marine-timeline-hours button"
  );

  timelineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      timelineButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
});


/* =========================================
   저고도 WINTEM 전용
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".wintem-main");
  if (!page) return;

  // 패널 접기 / 펼치기
  function setupToggle(buttonId, contentId) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (!button || !content) return;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      content.hidden = expanded;
      button.setAttribute("aria-expanded", String(!expanded));
      button.setAttribute(
        "aria-label",
        expanded ? "설정 펼치기" : "설정 접기"
      );
    });
  }

  setupToggle("wintemLegendToggle", "wintemLegendContent");
  setupToggle("wintemLayerToggle", "wintemLayerContent");
  setupToggle("wintemSectionToggle", "wintemLayerSettings");

  // 레이어 닫기
  const closeButton = document.getElementById("wintemLayerClose");
  const layerPanel = page.querySelector(".wintem-layer-panel");

  closeButton?.addEventListener("click", () => {
    if (layerPanel) layerPanel.hidden = true;
  });

  // 고도 선택: 버튼 상태만 변경
  const altitudeButtons = Array.from(
    page.querySelectorAll(".wintem-altitudes button")
  );

  altitudeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      altitudeButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  // 시간 선택
  const timeButtons = Array.from(
    page.querySelectorAll(".wintem-timeline-hours button")
  );

  const bubble = document.getElementById("wintemTimeBubble");
  const validTime = document.getElementById("wintemValidTime");
  const progress = document.getElementById("wintemProgressFill");

  function selectTime(index) {
    const button = timeButtons[index];
    if (!button) return;

    timeButtons.forEach((item, itemIndex) => {
      const selected = itemIndex === index;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    const date = button.dataset.date;
    const time = button.dataset.time;

    if (bubble) bubble.textContent = `${date} ${time}`;

    if (validTime) {
      const forecastHours = [6, 9, 12, 15, 18, 21, 24];
      validTime.textContent =
        `${date} ${time} KST (+${forecastHours[index]}h)`;
    }

    if (progress) {
      progress.style.width =
        `${((index + 0.5) / timeButtons.length) * 100}%`;
    }
  }

  timeButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectTime(index));
  });

  // 자동 재생: 선택 시간만 순차 변경
  const playButton = document.getElementById("wintemPlay");
  let playInterval = null;

  function stopPlayback() {
    if (playInterval !== null) {
      window.clearInterval(playInterval);
      playInterval = null;
    }

    if (playButton) {
      playButton.setAttribute("aria-pressed", "false");
      playButton.setAttribute("aria-label", "시간 자동 재생");
    }
  }

  playButton?.addEventListener("click", () => {
    if (playInterval !== null) {
      stopPlayback();
      return;
    }

    playButton.setAttribute("aria-pressed", "true");
    playButton.setAttribute("aria-label", "시간 자동 재생 정지");

    playInterval = window.setInterval(() => {
      const currentIndex = timeButtons.findIndex(
        (button) => button.classList.contains("is-active")
      );

      const nextIndex = currentIndex + 1;

      if (nextIndex >= timeButtons.length) {
        stopPlayback();
        return;
      }

      selectTime(nextIndex);
    }, 1500);
  });
});


/* =========================================
   CMEMS 예측모델 전용 스크립트
   wea-cmems.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".page-cmems .cmems-main");
  if (!page) return;

  /* -----------------------------------------
     패널 접기 / 펼치기
  ----------------------------------------- */

  function setupToggle(buttonId, contentId, label) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (!button || !content) return;

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      content.hidden = expanded;

      button.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      button.setAttribute(
        "aria-label",
        `${label} ${expanded ? "펼치기" : "접기"}`
      );

      const icon = button.querySelector("svg");

      if (icon) {
        icon.style.transform = expanded
          ? "rotate(180deg)"
          : "";
      }
    });
  }

  setupToggle(
    "cmemsLegendToggle",
    "cmemsLegendContent",
    "범례"
  );

  setupToggle(
    "cmemsLayerToggle",
    "cmemsLayerContent",
    "레이어 설정"
  );

  setupToggle(
    "cmemsSettingsToggle",
    "cmemsSettings",
    "세부 설정"
  );

  setupToggle(
    "cmemsTimelineToggle",
    "cmemsTimelineContent",
    "타임라인"
  );

  /* -----------------------------------------
     레이어 설정 닫기
  ----------------------------------------- */

  const layerPanel = page.querySelector(
    ".cmems-layer-panel"
  );

  const layerClose = document.getElementById(
    "cmemsLayerClose"
  );

  layerClose?.addEventListener("click", () => {
    if (layerPanel) {
      layerPanel.hidden = true;
    }
  });

  /* -----------------------------------------
     변수 선택
  ----------------------------------------- */

  const variableButtons = Array.from(
    page.querySelectorAll(
      ".cmems-variable-buttons button"
    )
  );

  const legendVariable = document.getElementById(
    "cmemsLegendVariable"
  );

  variableButtons.forEach((button) => {
    button.addEventListener("click", () => {
      variableButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle(
          "is-active",
          selected
        );

        item.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      const variable = button.dataset.variable;

      if (legendVariable && variable) {
        legendVariable.textContent = variable;
      }
    });
  });

  /* -----------------------------------------
     컬러맵 프리셋
     지도 그래픽 자체는 변경하지 않음
  ----------------------------------------- */

  const paletteSelect = document.getElementById(
    "cmemsPalette"
  );

  const palettePreview = page.querySelector(
    ".cmems-palette-preview"
  );

  const colorbar = page.querySelector(
    ".cmems-colorbar"
  );

  const palettes = {
    turbo: "linear-gradient(to right, #233c9c, #00bde8, #1bdc8c, #c7ed28, #ffad16, #f34a18, #a80921)",
    viridis: "linear-gradient(to right, #440154, #414487, #2a788e, #22a884, #7ad151, #fde725)",
    plasma: "linear-gradient(to right, #0d0887, #7e03a8, #cc4778, #f89540, #f0f921)"
  };

  paletteSelect?.addEventListener("change", () => {
    const gradient = palettes[
      paletteSelect.value
    ];

    if (!gradient) return;

    if (palettePreview) {
      palettePreview.style.background = gradient;
    }

    if (colorbar) {
      colorbar.style.background = gradient;
    }
  });

  /* -----------------------------------------
     불투명도
     지도 전체가 아니라 별도 그래픽 레이어가
     있을 때만 적용할 수 있도록 값 관리
  ----------------------------------------- */

  const opacitySlider = document.getElementById(
    "cmemsOpacity"
  );

  const opacityValue = document.getElementById(
    "cmemsOpacityValue"
  );

  function updateRangeTrack(input) {
    if (!input) return;

    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const value = Number(input.value);

    const percent =
      ((value - min) / (max - min)) * 100;

    input.style.background =
      `linear-gradient(to right,
        #0061f0 0%,
        #0061f0 ${percent}%,
        #d3dce9 ${percent}%,
        #d3dce9 100%)`;
  }

  opacitySlider?.addEventListener("input", () => {
    const value = Number(opacitySlider.value);

    if (opacityValue) {
      opacityValue.textContent = `${value}%`;
    }

    updateRangeTrack(opacitySlider);
  });

  updateRangeTrack(opacitySlider);

  /* -----------------------------------------
     입자 설정
  ----------------------------------------- */

  const particleToggle = document.getElementById(
    "cmemsParticleToggle"
  );

  const particleContent = document.getElementById(
    "cmemsParticleContent"
  );

  particleToggle?.addEventListener("click", () => {
    if (!particleContent) return;

    const expanded =
      particleToggle.getAttribute(
        "aria-expanded"
      ) === "true";

    particleContent.hidden = expanded;

    particleToggle.setAttribute(
      "aria-expanded",
      String(!expanded)
    );

    const icon = particleToggle.querySelector("svg");

    if (icon) {
      icon.style.transform = expanded
        ? ""
        : "rotate(180deg)";
    }
  });

  /* -----------------------------------------
     타임라인
  ----------------------------------------- */

  const hourSlider = document.getElementById(
    "cmemsHourSlider"
  );

  const selectedTime = document.getElementById(
    "cmemsSelectedTime"
  );

  const nowButton = document.getElementById(
    "cmemsNow"
  );

  // 캡처 화면의 2026-10-28 16:00을 기준으로
  // +30시간 위치에 표시하도록 설정
  const referenceTime = new Date(
    "2026-10-27T10:00:00+09:00"
  );

  const formatter = new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }
  );

  function updateTimeline() {
    if (!hourSlider || !selectedTime) return;

    const hours = Number(hourSlider.value);

    const date = new Date(
      referenceTime.getTime() +
      hours * 60 * 60 * 1000
    );

    const display = formatter.format(date);

    selectedTime.textContent = `${display} KST`;
    selectedTime.dateTime = date.toISOString();

    updateRangeTrack(hourSlider);
  }

  hourSlider?.addEventListener(
    "input",
    updateTimeline
  );

  nowButton?.addEventListener("click", () => {
    if (!hourSlider) return;

    hourSlider.value = "30";
    updateTimeline();
  });

  updateTimeline();
});



/* ========================================
   GOCI-II 위성 관측 전용 JS
   공용 wea-common.js 유지
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const layerPanel = document.getElementById("gociLayerPanel");
  const layerToggle = document.getElementById("gociLayerToggle");
  const layerContent = document.getElementById("gociLayerContent");
  const layerClose = document.getElementById("gociLayerClose");

  const settingsToggle = document.getElementById("gociSettingsToggle");
  const settings = document.getElementById("gociSettings");

  const opacitySlider = document.getElementById("gociOpacity");
  const opacityValue = document.getElementById("gociOpacityValue");

  const rgbButton = document.getElementById("gociRgbButton");
  const chlButton = document.getElementById("gociChlButton");

  const imageId = document.getElementById("gociImageId");
  const copyButton = document.getElementById("gociCopyId");

  const satelliteTool = document.querySelector(
    '.page-goci .tool-btn[data-tool="satellite"]'
  );

  function updateIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function setIcon(button, name) {
    if (!button) return;

    const icon = button.querySelector("svg, i[data-lucide]");

    if (icon) {
      icon.outerHTML = `<i data-lucide="${name}" aria-hidden="true"></i>`;
      updateIcons();
    }
  }

  /* 레이어 패널 접기 / 펼치기 */
  if (layerToggle && layerContent) {
    layerToggle.addEventListener("click", () => {
      const expanded = layerToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;

      layerContent.hidden = !nextExpanded;
      layerToggle.setAttribute("aria-expanded", String(nextExpanded));
      layerToggle.setAttribute(
        "aria-label",
        nextExpanded ? "레이어 설정 접기" : "레이어 설정 펼치기"
      );

      setIcon(layerToggle, nextExpanded ? "minimize-2" : "maximize-2");
    });
  }

  /* 세부 설정 접기 / 펼치기 */
  if (settingsToggle && settings) {
    settingsToggle.addEventListener("click", () => {
      const expanded = settingsToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;

      settings.hidden = !nextExpanded;
      settingsToggle.setAttribute("aria-expanded", String(nextExpanded));
      settingsToggle.setAttribute(
        "aria-label",
        nextExpanded ? "위성 설정 접기" : "위성 설정 펼치기"
      );

      setIcon(settingsToggle, nextExpanded ? "chevron-up" : "chevron-down");
    });
  }

  /* 패널 닫기 */
  if (layerClose && layerPanel) {
    layerClose.addEventListener("click", () => {
      layerPanel.hidden = true;

      if (satelliteTool) {
        satelliteTool.classList.remove("is-active");
        satelliteTool.setAttribute("aria-pressed", "false");
      }
    });
  }

  /* 위성 툴바 버튼으로 패널 다시 열기 */
  if (satelliteTool && layerPanel) {
    satelliteTool.addEventListener("click", () => {
      layerPanel.hidden = false;
      satelliteTool.classList.add("is-active");
      satelliteTool.setAttribute("aria-pressed", "true");

      if (layerContent && layerToggle && layerContent.hidden) {
        layerContent.hidden = false;
        layerToggle.setAttribute("aria-expanded", "true");
        layerToggle.setAttribute("aria-label", "레이어 설정 접기");
        setIcon(layerToggle, "minimize-2");
      }
    });
  }

  /* 불투명도 슬라이더
     지도와 위성사진이 하나의 이미지이므로
     이미지 자체의 opacity는 변경하지 않음 */
  if (opacitySlider && opacityValue) {
    const updateOpacityDisplay = () => {
      const value = Number(opacitySlider.value);

      opacityValue.textContent = `${value}%`;
      opacitySlider.style.setProperty(
        "--goci-opacity-progress",
        `${value}%`
      );
    };

    opacitySlider.addEventListener("input", updateOpacityDisplay);
    updateOpacityDisplay();
  }

  /* RGB / Chl 상태 표시
     실제 영상 전환은 별도 영상 데이터가 필요함 */
  if (rgbButton && chlButton) {
    rgbButton.addEventListener("click", () => {
      rgbButton.classList.add("is-active");
      rgbButton.setAttribute("aria-pressed", "true");

      chlButton.classList.remove("is-active");
      chlButton.setAttribute("aria-pressed", "false");
    });

    chlButton.addEventListener("click", () => {
      chlButton.classList.add("is-active");
      chlButton.setAttribute("aria-pressed", "true");

      rgbButton.classList.remove("is-active");
      rgbButton.setAttribute("aria-pressed", "false");
    });
  }

  /* 위성 이미지 ID 복사 */
  if (copyButton && imageId) {
    copyButton.addEventListener("click", async () => {
      const value = imageId.textContent.trim();

      try {
        await navigator.clipboard.writeText(value);

        const originalLabel = copyButton.getAttribute("aria-label");
        copyButton.setAttribute("aria-label", "복사 완료");

        window.setTimeout(() => {
          copyButton.setAttribute(
            "aria-label",
            originalLabel || "위성 이미지 아이디 복사"
          );
        }, 1500);
      } catch (error) {
        console.warn("클립보드 복사 실패:", error);
      }
    });
  }

  updateIcons();
});


/* =========================================
   GDACS 재난정보 전용 JS
   wea-gdacs.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const page = document.querySelector(".page-gdacs .gdacs-main");
  if (!page) return;

  const legend = document.getElementById("gdacsLegend");
  const legendToggle = document.getElementById("gdacsLegendToggle");
  const legendContent = document.getElementById("gdacsLegendContent");

  const layerPanel = document.getElementById("gdacsLayerPanel");
  const layerToggle = document.getElementById("gdacsLayerToggle");
  const layerContent = document.getElementById("gdacsLayerContent");
  const layerClose = document.getElementById("gdacsLayerClose");

  const settingsToggle = document.getElementById("gdacsSettingsToggle");
  const settings = document.getElementById("gdacsSettings");

  const periodButtons = Array.from(
    document.querySelectorAll(
      ".page-gdacs .gdacs-period-buttons button"
    )
  );

  const gdacsTool = document.querySelector(
    '.page-gdacs .tool-btn[data-tool="alert"]'
  );

  function refreshIcons() {
    if (
      window.lucide &&
      typeof window.lucide.createIcons === "function"
    ) {
      window.lucide.createIcons();
    }
  }

  function setButtonIcon(button, name) {
    if (!button) return;

    const icon = button.querySelector("svg, i[data-lucide]");

    if (!icon) return;

    const replacement = document.createElement("i");
    replacement.setAttribute("data-lucide", name);
    replacement.setAttribute("aria-hidden", "true");

    icon.replaceWith(replacement);
    refreshIcons();
  }

  function setupToggle(button, content, label, expandedIcon, collapsedIcon) {
    if (!button || !content) return;

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      const nextExpanded = !expanded;

      content.hidden = !nextExpanded;

      button.setAttribute(
        "aria-expanded",
        String(nextExpanded)
      );

      button.setAttribute(
        "aria-label",
        `${label} ${nextExpanded ? "접기" : "펼치기"}`
      );

      setButtonIcon(
        button,
        nextExpanded ? expandedIcon : collapsedIcon
      );
    });
  }

  /* 범례 접기 / 펼치기 */
  setupToggle(
    legendToggle,
    legendContent,
    "범례",
    "minimize-2",
    "maximize-2"
  );

  /* 레이어 설정 접기 / 펼치기 */
  setupToggle(
    layerToggle,
    layerContent,
    "레이어 설정",
    "minimize-2",
    "maximize-2"
  );

  /* 세부 설정 접기 / 펼치기 */
  setupToggle(
    settingsToggle,
    settings,
    "GDACS 설정",
    "chevron-up",
    "chevron-down"
  );

  /* 레이어 패널 닫기 */
  layerClose?.addEventListener("click", () => {
    if (!layerPanel) return;

    layerPanel.hidden = true;

    if (gdacsTool) {
      gdacsTool.classList.remove("is-active");
      gdacsTool.setAttribute("aria-pressed", "false");
    }
  });

  /* 툴바에서 GDACS 패널 다시 열기 */
  gdacsTool?.addEventListener("click", () => {
    if (!layerPanel) return;

    layerPanel.hidden = false;

    gdacsTool.classList.add("is-active");
    gdacsTool.setAttribute("aria-pressed", "true");

    if (layerContent && layerToggle && layerContent.hidden) {
      layerContent.hidden = false;

      layerToggle.setAttribute("aria-expanded", "true");
      layerToggle.setAttribute("aria-label", "레이어 설정 접기");

      setButtonIcon(layerToggle, "minimize-2");
    }
  });

  /* 조회 기간 선택 */
  periodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      periodButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      const days = Number(button.dataset.days);

      if (!Number.isFinite(days)) return;

      page.dataset.selectedDays = String(days);
    });
  });

  /* 재해 유형 / 경보 등급 / 레이어 체크박스
     정적 통 이미지이므로 지도 그래픽은 변경하지 않음 */
  const checkboxes = Array.from(
    page.querySelectorAll(
      '.gdacs-settings input[type="checkbox"]'
    )
  );

  function updateFilterState() {
    const selectedDisasters = [];
    const selectedAlerts = [];
    const selectedLayers = [];

    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) return;

      if (checkbox.name === "disaster") {
        selectedDisasters.push(checkbox.value);
      }

      if (checkbox.name === "alert") {
        selectedAlerts.push(checkbox.value);
      }

      if (checkbox.name === "layer") {
        selectedLayers.push(checkbox.value);
      }
    });

    page.dataset.selectedDisasters = selectedDisasters.join(",");
    page.dataset.selectedAlerts = selectedAlerts.join(",");
    page.dataset.selectedLayers = selectedLayers.join(",");
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateFilterState);
  });

  updateFilterState();

  /* 초기 선택값 */
  page.dataset.selectedDays = "4";

  /* 범례 초기 상태 */
  if (legend && legendContent) {
    legendContent.hidden = false;
  }

  refreshIcons();
});


/* =========================================
   해상풍·파고 예상도 팝업
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("waveModal");
  const closeButton = document.getElementById("waveModalClose");
  const playButton = document.getElementById("wavePlayButton");
  const slider = document.getElementById("waveTimeSlider");
  const output = document.getElementById("waveTimeOutput");
  const image = document.getElementById("waveForecastImage");

  if (!modal || !closeButton || !playButton ||
      !slider || !output || !image) {
    return;
  }

  const baseDate = new Date("2026-10-28T09:00:00+09:00");
  const baseImage = "./img/wea-wave-forecast.png";

  // 시간별 이미지가 준비되면 이 배열에 파일 경로 추가
  const forecastImages = {
    0: baseImage
    // 3: "./img/wea-wave-forecast-03.png",
    // 6: "./img/wea-wave-forecast-06.png"
  };

  let timer = null;
  let previousFocus = null;

  const formatTime = (hours) => {
    const date = new Date(
      baseDate.getTime() + hours * 60 * 60 * 1000
    );

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `+${hours}h · ${month}.${day} ${hour}:${minute} KST`;
  };

  const updateFrame = () => {
    const hours = Number(slider.value);
    const progress = (hours / Number(slider.max)) * 100;

    output.textContent = formatTime(hours);

    slider.style.background = `linear-gradient(
      to right,
      #0061f0 ${progress}%,
      #e5e7eb ${progress}%
    )`;

    // 준비된 시간별 이미지만 전환
    image.src = forecastImages[hours] || baseImage;
  };

  const stopPlayback = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }

    playButton.setAttribute("aria-pressed", "false");
    playButton.setAttribute("aria-label", "예상도 재생");
    playButton.innerHTML =
      '<i data-lucide="play" aria-hidden="true"></i>';

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const startPlayback = () => {
    stopPlayback();

    playButton.setAttribute("aria-pressed", "true");
    playButton.setAttribute("aria-label", "예상도 일시정지");
    playButton.innerHTML =
      '<i data-lucide="pause" aria-hidden="true"></i>';

    if (window.lucide) {
      window.lucide.createIcons();
    }

    timer = window.setInterval(() => {
      const current = Number(slider.value);
      const max = Number(slider.max);
      const step = Number(slider.step);

      slider.value = current >= max
        ? "0"
        : String(current + step);

      updateFrame();
    }, 1000);
  };

  const openModal = () => {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".wave-modal").focus();
    updateFrame();
  };

  const closeModal = () => {
    stopPlayback();
    modal.hidden = true;
    document.body.style.overflow = "";

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  playButton.addEventListener("click", () => {
    if (timer !== null) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  slider.addEventListener("input", updateFrame);

  // X 버튼은 표시만 하고 동작하지 않음
closeButton.addEventListener("click", (event) => {
  event.preventDefault();
});

// 배경 클릭 시 팝업 유지
// 별도의 배경 클릭 이벤트는 등록하지 않음

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;

  // ESC 키로 닫히지 않음
  if (event.key === "Escape") {
    event.preventDefault();
    return;
  }

  // 기존 Tab 키보드 포커스 이동 유지
  if (event.key === "Tab") {
      const focusable = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled])'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // 다른 JS에서도 팝업을 열 수 있도록 제공
window.openWaveForecastModal = openModal;
window.closeWaveForecastModal = closeModal;

updateFrame();

// 페이지 진입 시 팝업 자동 표시
openModal();
});



/* =========================================
   태풍 예측 비교 팝업
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const modal = document.getElementById("tycompareModal");
  const stormSelect = document.getElementById("tycompareStorm");
  const noaaImage = document.getElementById("tycompareNoaaImage");
  const timeButtons = Array.from(
    document.querySelectorAll(
      "#tycompareModal .tycompare-time-buttons button"
    )
  );

  if (!modal) return;

  // NOAA 시간별 이미지 경로
  // 실제 이미지가 준비되면 파일명을 연결하세요.
  const noaaImages = {
    0: "./img/tycompare-noaa.png",
    24: "./img/tycompare-noaa-24.png",
    48: "./img/tycompare-noaa-48.png",
    72: "./img/tycompare-noaa-72.png"
  };

  const openModal = () => {
    // 다른 팝업과 동시에 열리지 않도록 처리
    const waveModal = document.getElementById("waveModal");

    if (waveModal) {
      waveModal.hidden = true;
    }

    modal.hidden = false;
    modal.querySelector(".tycompare-modal")?.focus();

    document.body.style.overflow = "hidden";
  };



  // 태풍 선택
  stormSelect?.addEventListener("change", () => {
    // 태풍별 이미지 데이터 연동 시 확장
  });

  // 공용 호출 함수
  window.openTyphoonCompareModal = openModal;

  // 페이지 진입 시 자동 표시
  openModal();

  // Lucide 아이콘 적용
  if (
    window.lucide &&
    typeof window.lucide.createIcons === "function"
  ) {
    window.lucide.createIcons();
  }
});


/* =========================================
   기상포털 우측 툴바 툴팁
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(
    ".toolbar .tool-btn, .toolbar .toolbar-collapse"
  );

  if (!buttons.length) return;

  const tooltip = document.createElement("div");
  tooltip.className = "weather-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.id = "weatherToolbarTooltip";
  tooltip.hidden = true;

  document.body.appendChild(tooltip);

  function showTooltip(button) {
    const label = button.getAttribute("aria-label");
    if (!label) return;

    tooltip.textContent = label;
    tooltip.hidden = false;

    const rect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.left = `${Math.max(8, rect.left - tooltipRect.width - 16)}px`;
    tooltip.style.top = `${Math.max(
      8,
      Math.min(
        window.innerHeight - tooltipRect.height - 8,
        rect.top + rect.height / 2 - tooltipRect.height / 2
      )
    )}px`;
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => showTooltip(button));
    button.addEventListener("mouseleave", hideTooltip);
    button.addEventListener("focus", () => showTooltip(button));
    button.addEventListener("blur", hideTooltip);
    button.addEventListener("click", hideTooltip);
  });

  window.addEventListener("scroll", hideTooltip, true);
  window.addEventListener("resize", hideTooltip);
});
