document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     LUCIDE ICON
  ========================================================= */

  if (window.lucide) {
    lucide.createIcons();
  }


  /* =========================================================
     TIMEZONE TOGGLE
  ========================================================= */

  const timezoneButtons = document.querySelectorAll(
    '[aria-label="시간대 선택"] button'
  );

  timezoneButtons.forEach((button) => {
    button.addEventListener("click", () => {

      timezoneButtons.forEach((item) => {
        item.setAttribute("aria-pressed", "false");

        item.classList.remove(
          "bg-[#E7E7E7]",
          "text-black"
        );

        item.classList.add(
          "text-[#ADADAD]"
        );
      });

      button.setAttribute("aria-pressed", "true");

      button.classList.add(
        "bg-[#E7E7E7]",
        "text-black"
      );

      button.classList.remove(
        "text-[#ADADAD]"
      );
    });
  });


  /* =========================================================
     MAP TOOLBAR
  ========================================================= */

  const toolbarToggle =
    document.getElementById("mapToolbarToggle");

  const toolbarItems =
    document.getElementById("mapToolbarItems");

  if (toolbarToggle && toolbarItems) {

    toolbarToggle.addEventListener("click", () => {

      const isExpanded =
        toolbarToggle.getAttribute("aria-expanded") === "true";

      toolbarToggle.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      toolbarItems.classList.toggle(
        "hidden",
        isExpanded
      );

      const icon =
        toolbarToggle.querySelector(".toolbar-toggle-icon");

      if (icon) {
        icon.classList.toggle(
          "rotate-180",
          isExpanded
        );
      }

    });
  }


  /* =========================================================
     ACCORDION
  ========================================================= */

  const accordionButtons =
    document.querySelectorAll(".accordion-toggle");

  accordionButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const targetId =
        button.dataset.accordionTarget;

      const content =
        document.getElementById(targetId);

      if (!content) return;


      const isExpanded =
        button.getAttribute("aria-expanded") === "true";


      /* ARIA */
      button.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );


      /* Content */
      content.classList.toggle(
        "hidden",
        isExpanded
      );


      /* Chevron */
      const icon =
        button.querySelector(".accordion-icon");

      if (icon) {
        icon.classList.toggle(
          "rotate-180",
          isExpanded
        );
      }

    });

  });

});

/* =========================================================
   WEATHER PANEL
========================================================= */

const weatherPanel =
  document.getElementById("weatherPanel");

const weatherPanelClose =
  document.getElementById("weatherPanelClose");

const weatherPanelOpen =
  document.getElementById("weatherPanelOpen");

const weatherTabs =
  document.querySelectorAll(".weather-tab");

const weatherContents = {
  weather: document.getElementById("weatherTabWeather"),
  warning: document.getElementById("weatherTabWarning"),
  typhoon: document.getElementById("weatherTabTyphoon")
};


/* =========================================================
   PANEL OPEN / CLOSE
========================================================= */

if (weatherPanelOpen && weatherPanel) {
  weatherPanelOpen.addEventListener("click", () => {
    weatherPanel.classList.remove("hidden");
  });
}


if (weatherPanelClose && weatherPanel) {
  weatherPanelClose.addEventListener("click", () => {
    weatherPanel.classList.add("hidden");
  });
}


/* =========================================================
   WEATHER TABS
========================================================= */

weatherTabs.forEach((tab) => {

  tab.addEventListener("click", () => {

    const target =
      tab.dataset.weatherTab;


    /* -----------------------------------------
       모든 탭 비활성화
    ----------------------------------------- */
    weatherTabs.forEach((item) => {

      item.setAttribute(
        "aria-selected",
        "false"
      );

      item.classList.remove(
        "bg-[#E7E7E7]",
        "text-black",
        "rounded-t-[4px]"
      );

      item.classList.add(
        "text-[#777777]"
      );

    });


    /* -----------------------------------------
       선택한 탭 활성화
    ----------------------------------------- */
    tab.setAttribute(
      "aria-selected",
      "true"
    );

    tab.classList.remove(
      "text-[#777777]"
    );

    tab.classList.add(
      "bg-[#E7E7E7]",
      "text-black",
      "rounded-t-[4px]"
    );


    /* -----------------------------------------
       모든 탭 콘텐츠 숨김
    ----------------------------------------- */
    Object.values(weatherContents).forEach((content) => {

      if (!content) return;

      content.classList.add("hidden");
      content.classList.remove("flex");

    });


    /* -----------------------------------------
       선택 콘텐츠 표시
    ----------------------------------------- */
    const activeContent =
      weatherContents[target];

    if (activeContent) {

      activeContent.classList.remove("hidden");
      activeContent.classList.add("flex");

    }


    /* 클릭 후 focus outline 제거 */
    tab.blur();

  });

});

/* =========================================================
   SITUATION PANEL
   Desktop / 1100 이하 Responsive
========================================================= */

const situationPanel =
  document.getElementById("situationPanel");

const situationPanelHeader =
  document.getElementById("situationPanelHeader");

const situationPanelContent =
  document.getElementById("situationPanelContent");

const situationPanelToggle =
  document.getElementById("situationPanelToggle");

/* 1101 이상 기존 접힘 버튼 */
const situationPanelCollapsed =
  document.getElementById("situationPanelCollapsed");

/* 1100 이하 전용 접힘 버튼 */
const situationPanelCollapsedMobile =
  document.getElementById("situationPanelCollapsedMobile");

/* 지도 툴바 */
const mapToolbar =
  document.getElementById("mapToolbar");


/* =========================================================
   OPEN
========================================================= */

function openSituationPanel() {

  if (
    !situationPanel ||
    !situationPanelHeader ||
    !situationPanelContent
  ) {
    return;
  }


  /* 내용 표시 */
  situationPanelHeader.classList.remove("hidden");
  situationPanelContent.classList.remove("hidden");


  /* 상태 */
  situationPanelToggle?.setAttribute(
    "aria-expanded",
    "true"
  );


  /* 접힘 버튼 숨김 */
  situationPanelCollapsed?.classList.add("hidden");
  situationPanelCollapsed?.classList.remove("flex");

  situationPanelCollapsedMobile?.classList.add("hidden");


  /* =====================================================
     1100 이하
  ====================================================== */

  if (window.innerWidth <= 1100) {

    document.body.classList.add("situation-open");

    /*
      1100 이하에서는
      툴바 좌우 위치 건드리지 않음
    */

    return;
  }


  /* =====================================================
     1101 이상
  ====================================================== */

  /* 상황요약 패널 펼침 */
  situationPanel.classList.remove("w-0");
  situationPanel.classList.add("w-[370px]");

  situationPanel.classList.remove("border-l-0");


  /* 툴바 : 펼침 위치 */
  if (mapToolbar) {
    mapToolbar.style.right = "24px";
  }

  syncWeatherPanelPosition();

}


/* =========================================================
   CLOSE
========================================================= */

function closeSituationPanel() {

  if (
    !situationPanel ||
    !situationPanelHeader ||
    !situationPanelContent
  ) {
    return;
  }


  /* 내용 숨김 */
  situationPanelHeader.classList.add("hidden");
  situationPanelContent.classList.add("hidden");


  /* 상태 */
  situationPanelToggle?.setAttribute(
    "aria-expanded",
    "false"
  );


  /* =====================================================
     1100 이하
  ====================================================== */

  if (window.innerWidth <= 1100) {

    /* 데스크톱 접힘 버튼 숨김 */
    situationPanelCollapsed?.classList.add("hidden");
    situationPanelCollapsed?.classList.remove("flex");


    /* 1100 이하 전용 버튼 표시 */
    situationPanelCollapsedMobile?.classList.remove(
      "hidden"
    );


    document.body.classList.remove(
      "situation-open"
    );


    /*
      중요:
      1100 이하에서는
      mapToolbar의 right 값을 변경하지 않음
    */

    return;
  }


  /* =====================================================
     1101 이상
  ====================================================== */

  /* 상황요약 패널 접기 */
  situationPanel.classList.add("w-0");
  situationPanel.classList.remove("w-[370px]");

  situationPanel.classList.add("border-l-0");


  /* 모바일 버튼 숨김 */
  situationPanelCollapsedMobile?.classList.add(
    "hidden"
  );


  /* 데스크톱 접힘 버튼 표시 */
  situationPanelCollapsed?.classList.remove(
    "hidden"
  );

  situationPanelCollapsed?.classList.add(
    "flex"
  );


  /* 툴바 : 접힘 위치 */
  if (mapToolbar) {
    mapToolbar.style.right = "64px";
  }

  syncWeatherPanelPosition();

}


/* =========================================================
   펼쳐진 상황요약 → 접기
========================================================= */

situationPanelToggle?.addEventListener(
  "click",
  closeSituationPanel
);


/* =========================================================
   1101 이상 접힘 버튼 → 펼치기
========================================================= */

situationPanelCollapsed?.addEventListener(
  "click",
  () => {

    if (window.innerWidth <= 1100) {
      return;
    }

    openSituationPanel();

  }
);


/* =========================================================
   1100 이하 접힘 버튼 → 펼치기
========================================================= */

situationPanelCollapsedMobile?.addEventListener(
  "click",
  () => {

    if (window.innerWidth > 1100) {
      return;
    }

    openSituationPanel();

  }
);


/* =========================================================
   RESPONSIVE SYNC
========================================================= */

function syncSituationPanelResponsive() {

  if (
    !situationPanel ||
    !situationPanelToggle
  ) {
    return;
  }


  const isOpen =
    situationPanelToggle.getAttribute(
      "aria-expanded"
    ) === "true";


  /* =====================================================
     1100 이하
  ====================================================== */

  if (window.innerWidth <= 1100) {

    /*
      데스크톱에서 남은 width 관련 클래스 제거
      1100 이하에서는 CSS가 패널 크기 제어
    */
    situationPanel.classList.remove("w-0");
    situationPanel.classList.remove("w-[370px]");
    situationPanel.classList.remove("border-l-0");


    /* 기존 데스크톱 접힘 버튼 숨김 */
    situationPanelCollapsed?.classList.add(
      "hidden"
    );

    situationPanelCollapsed?.classList.remove(
      "flex"
    );


    /*
      중요
      데스크톱에서 style.right가 남아 있을 수 있으므로
      1100 이하 진입 시 inline right 제거
    */
    if (mapToolbar) {
      mapToolbar.style.removeProperty("right");
    }


    if (isOpen) {

      /* 펼쳐진 상태 */
      situationPanelHeader?.classList.remove(
        "hidden"
      );

      situationPanelContent?.classList.remove(
        "hidden"
      );


      situationPanelCollapsedMobile?.classList.add(
        "hidden"
      );


      document.body.classList.add(
        "situation-open"
      );

    } else {

      /* 접힌 상태 */
      situationPanelHeader?.classList.add(
        "hidden"
      );

      situationPanelContent?.classList.add(
        "hidden"
      );


      situationPanelCollapsedMobile?.classList.remove(
        "hidden"
      );


      document.body.classList.remove(
        "situation-open"
      );

    }

    return;
  }


  /* =====================================================
     1101 이상
  ====================================================== */

  document.body.classList.remove(
    "situation-open"
  );


  /* 모바일 접힘 버튼 숨김 */
  situationPanelCollapsedMobile?.classList.add(
    "hidden"
  );


  if (isOpen) {

    /* ===============================================
       펼침
    =============================================== */

    situationPanel.classList.remove("w-0");
    situationPanel.classList.add("w-[370px]");

    situationPanel.classList.remove("border-l-0");


    situationPanelHeader?.classList.remove(
      "hidden"
    );

    situationPanelContent?.classList.remove(
      "hidden"
    );


    situationPanelCollapsed?.classList.add(
      "hidden"
    );

    situationPanelCollapsed?.classList.remove(
      "flex"
    );


    /* 툴바 펼침 위치 */
    if (mapToolbar) {
      mapToolbar.style.right = "24px";
    }

  } else {

    /* ===============================================
       접힘
    =============================================== */

    situationPanel.classList.add("w-0");
    situationPanel.classList.remove("w-[370px]");

    situationPanel.classList.add("border-l-0");


    situationPanelHeader?.classList.add(
      "hidden"
    );

    situationPanelContent?.classList.add(
      "hidden"
    );


    situationPanelCollapsed?.classList.remove(
      "hidden"
    );

    situationPanelCollapsed?.classList.add(
      "flex"
    );


    /* 툴바 접힘 위치 */
    if (mapToolbar) {
      mapToolbar.style.right = "64px";
    }

  }

}


/* =========================================================
   최초 상태 동기화
========================================================= */

syncSituationPanelResponsive();


/* =========================================================
   화면 크기 변경
========================================================= */

window.addEventListener(
  "resize",
  syncSituationPanelResponsive
);

/* =========================================================
   ALERT SETTINGS PANEL
========================================================= */

const alertSettingsPanel =
  document.getElementById("alertSettingsPanel");

const alertSettingsOpen =
  document.getElementById("alertSettingsOpen");

const alertSettingsClose =
  document.getElementById("alertSettingsClose");


if (alertSettingsOpen && alertSettingsPanel) {
  alertSettingsOpen.addEventListener("click", () => {
    alertSettingsPanel.classList.remove("hidden");
  });
}


if (alertSettingsClose && alertSettingsPanel) {
  alertSettingsClose.addEventListener("click", () => {
    alertSettingsPanel.classList.add("hidden");
  });
}

/* =========================================================
   ALERT SETTING CHECKBOX
========================================================= */

const alertSettingItems =
  document.querySelectorAll(".alert-setting-item");


alertSettingItems.forEach((item) => {

  const checkbox =
    item.querySelector(".alert-setting-checkbox");

  const checkBox =
    item.querySelector(".alert-setting-check");

  const checkIcon =
    item.querySelector(".alert-setting-check-icon");

  const title =
    item.querySelector(".alert-setting-title");

  const meta =
    item.querySelector(".alert-setting-meta");


  if (!checkbox) return;


  const updateState = () => {

    /* =====================================================
       CHECKED
    ===================================================== */

    if (checkbox.checked) {

      /* Card */
      item.classList.remove(
        "border-[#232323]"
      );

      item.classList.add(
        "border-[#ADADAD]"
      );


      /* Checkbox */
      if (checkBox) {
        checkBox.classList.remove(
          "border-[#3D3D3D]",
          "bg-[#3D3D3D]"
        );

        checkBox.classList.add(
          "border-[#E7E7E7]",
          "bg-[#E7E7E7]"
        );
      }


      /* Check 표시 */
      if (checkIcon) {
        checkIcon.classList.remove("hidden");
      }


      /* Title */
      if (title) {
        title.classList.remove(
          "text-[#777777]"
        );

        title.classList.add(
          "text-[#E7E7E7]"
        );
      }


      /* Meta */
      if (meta) {
        meta.classList.remove(
          "text-[#777777]"
        );

        meta.classList.add(
          "text-[#ADADAD]"
        );
      }

    }


    /* =====================================================
       UNCHECKED
    ===================================================== */

    else {

      /* Card */
      item.classList.remove(
        "border-[#ADADAD]"
      );

      item.classList.add(
        "border-[#232323]"
      );


      /* Checkbox */
      if (checkBox) {
        checkBox.classList.remove(
          "border-[#E7E7E7]",
          "bg-[#E7E7E7]"
        );

        checkBox.classList.add(
          "border-[#3D3D3D]",
          "bg-[#3D3D3D]"
        );
      }


      /* Check 숨김 */
      if (checkIcon) {
        checkIcon.classList.add("hidden");
      }


      /* Title */
      if (title) {
        title.classList.remove(
          "text-[#E7E7E7]"
        );

        title.classList.add(
          "text-[#777777]"
        );
      }


      /* Meta */
      if (meta) {
        meta.classList.remove(
          "text-[#ADADAD]"
        );

        meta.classList.add(
          "text-[#777777]"
        );
      }

    }

  };


  /* 초기 상태 */
  updateState();


  /* 클릭 시 상태 변경 */
  checkbox.addEventListener(
    "change",
    updateState
  );

});

/* =========================================================
   NEARBY VESSELS PANEL
========================================================= */

const nearbyVesselsPanel =
  document.getElementById("nearbyVesselsPanel");

const nearbyVesselsOpen =
  document.getElementById("nearbyVesselsOpen");

const nearbyVesselsClose =
  document.getElementById("nearbyVesselsClose");


/* Open */
if (nearbyVesselsOpen && nearbyVesselsPanel) {

  nearbyVesselsOpen.addEventListener("click", () => {
    nearbyVesselsPanel.classList.remove("hidden");
  });

}


/* Close */
if (nearbyVesselsClose && nearbyVesselsPanel) {

  nearbyVesselsClose.addEventListener("click", () => {
    nearbyVesselsPanel.classList.add("hidden");
  });

}

/* =========================================================
   EMERGENCY ALERT PANEL
========================================================= */

const emergencyAlertPanel =
  document.getElementById("emergencyAlertPanel");

const emergencyAlertOpen =
  document.getElementById("emergencyAlertOpen");

const emergencyAlertClose =
  document.getElementById("emergencyAlertClose");


/* Open */
if (emergencyAlertOpen && emergencyAlertPanel) {

  emergencyAlertOpen.addEventListener("click", () => {
    emergencyAlertPanel.classList.remove("hidden");
  });

}


/* Close */
if (emergencyAlertClose && emergencyAlertPanel) {

  emergencyAlertClose.addEventListener("click", () => {
    emergencyAlertPanel.classList.add("hidden");
  });

}

/* =========================================================
   NEARBY VESSELS RADIUS TAB
========================================================= */

const nearbyRadiusTabs =
  document.querySelectorAll(".nearby-radius-tab");


nearbyRadiusTabs.forEach((tab) => {

  tab.addEventListener("click", () => {

    nearbyRadiusTabs.forEach((item) => {

      item.setAttribute(
        "aria-selected",
        "false"
      );

      item.classList.remove(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]",
        "text-black"
      );

      item.classList.add(
        "border-[#3D3D3D]",
        "bg-[#050505]",
        "text-[#777777]"
      );

    });


    tab.setAttribute(
      "aria-selected",
      "true"
    );

    tab.classList.remove(
      "border-[#3D3D3D]",
      "bg-[#050505]",
      "text-[#777777]"
    );

    tab.classList.add(
      "border-[#E7E7E7]",
      "bg-[#E7E7E7]",
      "text-black"
    );

  });

});

/* =========================================================
   DISPLAY AREA PANEL
========================================================= */

const displayAreaPanel =
  document.getElementById("displayAreaPanel");

const displayAreaOpen =
  document.getElementById("displayAreaOpen");

const displayAreaClose =
  document.getElementById("displayAreaClose");


/* Open */
if (displayAreaOpen && displayAreaPanel) {
  displayAreaOpen.addEventListener("click", () => {
    displayAreaPanel.classList.remove("hidden");
  });
}


/* Close */
if (displayAreaClose && displayAreaPanel) {
  displayAreaClose.addEventListener("click", () => {
    displayAreaPanel.classList.add("hidden");
  });
}


/* =========================================================
   DISPLAY AREA FILTER
========================================================= */

const displayAreaFilters =
  document.querySelectorAll(".display-area-filter");


displayAreaFilters.forEach((button) => {

  button.addEventListener("click", () => {

    displayAreaFilters.forEach((item) => {

      item.setAttribute(
        "aria-selected",
        "false"
      );

      item.classList.remove(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]",
        "text-black"
      );

      item.classList.add(
        "border-[#3D3D3D]",
        "bg-[#050505]",
        "text-[#777777]"
      );

    });


    button.setAttribute(
      "aria-selected",
      "true"
    );

    button.classList.remove(
      "border-[#3D3D3D]",
      "bg-[#050505]",
      "text-[#777777]"
    );

    button.classList.add(
      "border-[#E7E7E7]",
      "bg-[#E7E7E7]",
      "text-black"
    );

  });

});


/* =========================================================
   DISPLAY AREA ON / OFF
========================================================= */

const displayAreaToggles =
  document.querySelectorAll(".display-area-toggle");


displayAreaToggles.forEach((button) => {

  button.addEventListener("click", () => {

    const isVisible =
      button.dataset.visible === "true";


    if (isVisible) {

      /* OFF */
      button.dataset.visible = "false";
      button.textContent = "켜기";

      button.classList.remove(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]",
        "text-black"
      );

      button.classList.add(
        "border-[#777777]",
        "bg-[#050505]",
        "text-[#E7E7E7]"
      );

    } else {

      /* ON */
      button.dataset.visible = "true";
      button.textContent = "끄기";

      button.classList.remove(
        "border-[#777777]",
        "bg-[#050505]",
        "text-[#E7E7E7]"
      );

      button.classList.add(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]",
        "text-black"
      );

    }

  });

});


/* =========================================================
   DISPLAY AREA CHIP REMOVE
========================================================= */

const displayAreaChips =
  document.querySelectorAll(".display-area-chip");


displayAreaChips.forEach((chip) => {

  chip.addEventListener("click", () => {
    chip.remove();
  });

});

/* =========================================================
   DISPLAY AREA CURRENT VIEW CHECKBOX
========================================================= */

const displayAreaViewCheckbox =
  document.querySelector(".display-area-view-checkbox");

const displayAreaViewCheck =
  document.querySelector(".display-area-view-check");


if (displayAreaViewCheckbox && displayAreaViewCheck) {

  const updateDisplayAreaView = () => {

    if (displayAreaViewCheckbox.checked) {

      /* Checked */
      displayAreaViewCheck.classList.remove(
        "border-[#3D3D3D]",
        "bg-[#3D3D3D]"
      );

      displayAreaViewCheck.classList.add(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]"
      );

      displayAreaViewCheck.textContent = "✓";

    } else {

      /* Unchecked */
      displayAreaViewCheck.classList.remove(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]"
      );

      displayAreaViewCheck.classList.add(
        "border-[#3D3D3D]",
        "bg-[#3D3D3D]"
      );

      displayAreaViewCheck.textContent = "";

    }

  };


  /* 초기 상태 */
  updateDisplayAreaView();


  /* 변경 */
  displayAreaViewCheckbox.addEventListener(
    "change",
    updateDisplayAreaView
  );

}

/* =========================================================
   NEWS PANEL
========================================================= */

const newsPanel =
  document.getElementById("newsPanel");

const newsPanelOpen =
  document.getElementById("newsPanelOpen");

const newsPanelClose =
  document.getElementById("newsPanelClose");


if (newsPanelOpen && newsPanel) {

  newsPanelOpen.addEventListener("click", () => {
    newsPanel.classList.remove("hidden");
  });

}


if (newsPanelClose && newsPanel) {

  newsPanelClose.addEventListener("click", () => {
    newsPanel.classList.add("hidden");
  });

}


/* =========================================================
   NEWS FILTER TAB
========================================================= */

const newsFilterTabs =
  document.querySelectorAll(".news-filter-tab");

newsFilterTabs.forEach((tab) => {

  tab.addEventListener("click", () => {

    /* 모든 탭 → 비선택 상태 */
    newsFilterTabs.forEach((item) => {

      item.setAttribute(
        "aria-selected",
        "false"
      );

      item.classList.remove(
        "border-[#E7E7E7]",
        "bg-[#E7E7E7]",
        "text-black"
      );

      item.classList.add(
        "border-[#3D3D3D]",
        "bg-[#050505]",
        "text-[#777777]",
        "hover:bg-[#232323]",
        "hover:text-[#E7E7E7]"
      );

    });


    /* 클릭한 탭 → 선택 상태 */
    tab.setAttribute(
      "aria-selected",
      "true"
    );

    tab.classList.remove(
      "border-[#3D3D3D]",
      "bg-[#050505]",
      "text-[#777777]",
      "hover:bg-[#232323]",
      "hover:text-[#E7E7E7]"
    );

    tab.classList.add(
      "border-[#E7E7E7]",
      "bg-[#E7E7E7]",
      "text-black"
    );

    /* 클릭 후 focus도 제거 */
    tab.blur();

  });

});

/* =========================================================
   CHATBOT PANEL
========================================================= */

const chatbotPanel =
  document.getElementById("chatbotPanel");

const chatbotOpen =
  document.getElementById("chatbotOpen");

const chatbotClose =
  document.getElementById("chatbotClose");

const chatbotInput =
  document.getElementById("chatbotInput");

const chatbotSend =
  document.getElementById("chatbotSend");


/* Open */
if (chatbotOpen && chatbotPanel) {
  chatbotOpen.addEventListener("click", () => {
    chatbotPanel.classList.remove("hidden");
  });
}


/* Close */
if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.add("hidden");
  });
}


/* Quick Question */
const chatbotQuickQuestions =
  document.querySelectorAll(".chatbot-quick-question");


chatbotQuickQuestions.forEach((button) => {

  button.addEventListener("click", () => {

    if (!chatbotInput) return;

    chatbotInput.value =
      button.textContent.trim();

    chatbotInput.focus();

  });

});


/* Send */
if (chatbotSend && chatbotInput) {

  chatbotSend.addEventListener("click", () => {

    const message =
      chatbotInput.value.trim();

    if (!message) return;

    console.log("Chatbot message:", message);

    chatbotInput.value = "";

  });

}


/* Enter Send */
if (chatbotInput && chatbotSend) {

  chatbotInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
      event.preventDefault();
      chatbotSend.click();
    }

  });

}

/* =========================================================
   CASE SELECT
========================================================= */

const caseSelect =
  document.getElementById("caseSelect");

const caseSelectButton =
  document.getElementById("caseSelectButton");

const caseSelectMenu =
  document.getElementById("caseSelectMenu");

const caseSelectValue =
  document.getElementById("caseSelectValue");

const caseSelectOptions =
  document.querySelectorAll(".case-select-option");


if (
  caseSelect &&
  caseSelectButton &&
  caseSelectMenu
) {

  /* Open / Close */
  caseSelectButton.addEventListener("click", (event) => {

    event.stopPropagation();

    const isExpanded =
      caseSelectButton.getAttribute("aria-expanded") === "true";


    caseSelectButton.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );


    caseSelectMenu.classList.toggle(
      "hidden",
      isExpanded
    );


    /* 열린 상태 border */
    caseSelectButton.classList.toggle(
      "border-[#E7E7E7]",
      !isExpanded
    );

    caseSelectButton.classList.toggle(
      "border-[#3D3D3D]",
      isExpanded
    );


    /* Chevron */
    const icon =
      caseSelectButton.querySelector(".case-select-icon");

    if (icon) {
      icon.classList.toggle(
        "rotate-180",
        !isExpanded
      );
    }

  });


  /* Option Select */
  caseSelectOptions.forEach((option) => {

    option.addEventListener("click", () => {

      const value =
        option.dataset.caseValue;

      const label =
        option.textContent.trim();


      if (caseSelectValue) {
        caseSelectValue.textContent = label;
        caseSelectValue.classList.remove("text-[#ADADAD]");
        caseSelectValue.classList.add("text-[#E7E7E7]");
      }


      caseSelectButton.dataset.value = value;

      caseSelectButton.setAttribute(
        "aria-expanded",
        "false"
      );


      caseSelectMenu.classList.add("hidden");


      caseSelectButton.classList.remove(
        "border-[#E7E7E7]"
      );

      caseSelectButton.classList.add(
        "border-[#3D3D3D]"
      );


      const icon =
        caseSelectButton.querySelector(".case-select-icon");

      if (icon) {
        icon.classList.remove("rotate-180");
      }

    });

  });


  /* Outside Click */
  document.addEventListener("click", (event) => {

    if (!caseSelect.contains(event.target)) {

      caseSelectButton.setAttribute(
        "aria-expanded",
        "false"
      );

      caseSelectMenu.classList.add("hidden");

      caseSelectButton.classList.remove(
        "border-[#E7E7E7]"
      );

      caseSelectButton.classList.add(
        "border-[#3D3D3D]"
      );


      const icon =
        caseSelectButton.querySelector(".case-select-icon");

      if (icon) {
        icon.classList.remove("rotate-180");
      }

    }

  });

}


/* =========================================================
   SOP CHECKBOX
========================================================= */

const sopCheckboxes =
  document.querySelectorAll(".sop-checkbox");


sopCheckboxes.forEach((checkbox) => {

  checkbox.addEventListener("click", () => {

    const isChecked =
      checkbox.getAttribute("aria-checked") === "true";

    const nextChecked =
      !isChecked;


    checkbox.setAttribute(
      "aria-checked",
      String(nextChecked)
    );


    const icon =
      checkbox.querySelector(".sop-checkbox-icon");


    if (nextChecked) {

      /* Checked */
      checkbox.classList.remove(
        "bg-[#3D3D3D]"
      );

      checkbox.classList.add(
        "bg-[#E7E7E7]"
      );

      if (icon) {
        icon.classList.remove("hidden");
      }

    } else {

      /* Unchecked */
      checkbox.classList.remove(
        "bg-[#E7E7E7]"
      );

      checkbox.classList.add(
        "bg-[#3D3D3D]"
      );

      if (icon) {
        icon.classList.add("hidden");
      }

    }

  });

});


/* =========================================================
   NEW CASE PANEL
========================================================= */

const newCaseToggle =
  document.getElementById("newCaseToggle");

const newCasePanel =
  document.getElementById("newCasePanel");

const newCaseCancel =
  document.getElementById("newCaseCancel");


/* 처음부터 OPEN */
if (newCaseToggle && newCasePanel) {

  newCaseToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  newCasePanel.classList.remove("hidden");


  /* 새 사건 버튼으로 다시 열고 닫기 */
  newCaseToggle.addEventListener("click", () => {

    const isExpanded =
      newCaseToggle.getAttribute("aria-expanded") === "true";

    newCaseToggle.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    newCasePanel.classList.toggle(
      "hidden",
      isExpanded
    );

  });

}


/* 취소 */
if (
  newCaseCancel &&
  newCasePanel &&
  newCaseToggle
) {

  newCaseCancel.addEventListener("click", () => {

    newCasePanel.classList.add("hidden");

    newCaseToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  });

}

/* =========================================================
   CUSTOM SELECT HELPER
========================================================= */

function setupCustomSelect({
  rootId,
  buttonId,
  menuId,
  valueId,
  optionSelector,
  iconSelector
}) {
  const root =
    document.getElementById(rootId);

  const button =
    document.getElementById(buttonId);

  const menu =
    document.getElementById(menuId);

  const value =
    document.getElementById(valueId);

  if (!root || !button || !menu || !value) return;

  const options =
    menu.querySelectorAll(optionSelector);


  /* 열기 / 닫기 */
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen =
      button.getAttribute("aria-expanded") === "true";

    button.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    menu.classList.toggle(
      "hidden",
      isOpen
    );

    button.classList.toggle(
      "border-[#E7E7E7]",
      !isOpen
    );

    button.classList.toggle(
      "border-[#3D3D3D]",
      isOpen
    );

    const icon =
      button.querySelector(iconSelector);

    if (icon) {
      icon.classList.toggle(
        "rotate-180",
        !isOpen
      );
    }
  });


  /* 옵션 선택 */
  options.forEach((option) => {

    option.addEventListener("click", (event) => {
      event.stopPropagation();


      /* 전체 선택 상태 초기화 */
      options.forEach((item) => {

        item.classList.remove(
          "bg-[#2D2D2D]",
          "font-medium"
        );

        const oldCheck =
          item.querySelector(".select-check");

        if (oldCheck) {
          oldCheck.remove();
        }
      });


      /* 현재 선택 */
      option.classList.add(
        "bg-[#2D2D2D]",
        "font-medium"
      );


      const check =
        document.createElement("i");

      check.setAttribute(
        "data-lucide",
        "check"
      );

      check.className =
        "select-check mr-2 h-4 w-4 shrink-0";


      option.prepend(check);


      /* 표시값 변경 */
      value.textContent =
        option.textContent.trim();


      /* 닫기 */
      menu.classList.add("hidden");

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.classList.remove(
        "border-[#E7E7E7]"
      );

      button.classList.add(
        "border-[#3D3D3D]"
      );


      const icon =
        button.querySelector(iconSelector);

      if (icon) {
        icon.classList.remove("rotate-180");
      }


      /* 새로 추가된 Lucide check 렌더 */
      if (window.lucide) {
        lucide.createIcons();
      }

    });
  });


  /* 바깥 클릭 */
  document.addEventListener("click", (event) => {

    if (!root.contains(event.target)) {

      menu.classList.add("hidden");

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.classList.remove(
        "border-[#E7E7E7]"
      );

      button.classList.add(
        "border-[#3D3D3D]"
      );

      const icon =
        button.querySelector(iconSelector);

      if (icon) {
        icon.classList.remove("rotate-180");
      }
    }

  });
}


/* AIS 대상 */
setupCustomSelect({
  rootId: "targetSelect",
  buttonId: "targetSelectButton",
  menuId: "targetSelectMenu",
  valueId: "targetSelectValue",
  optionSelector: ".target-select-option",
  iconSelector: ".target-select-icon"
});


/* 문서 유형 */
setupCustomSelect({
  rootId: "documentTypeSelect",
  buttonId: "documentTypeSelectButton",
  menuId: "documentTypeSelectMenu",
  valueId: "documentTypeSelectValue",
  optionSelector: ".document-type-option",
  iconSelector: ".document-type-select-icon"
});

/* =========================================================
   TRACKING SESSION PANEL
========================================================= */

const trackingSessionPanel =
  document.getElementById("trackingSessionPanel");

const trackingSessionOpen =
  document.getElementById("trackingSessionOpen");

const trackingSessionClose =
  document.getElementById("trackingSessionClose");


/* Open */
if (
  trackingSessionOpen &&
  trackingSessionPanel
) {
  trackingSessionOpen.addEventListener("click", () => {

    trackingSessionPanel.classList.remove("hidden");

  });
}


/* Close */
if (
  trackingSessionClose &&
  trackingSessionPanel
) {
  trackingSessionClose.addEventListener("click", () => {

    trackingSessionPanel.classList.add("hidden");

  });
}

/* =========================================================
   TRACKING REASON SELECT
========================================================= */

const trackingReasonSelect =
  document.getElementById("trackingReasonSelect");

const trackingReasonButton =
  document.getElementById("trackingReasonButton");

const trackingReasonMenu =
  document.getElementById("trackingReasonMenu");

const trackingReasonValue =
  document.getElementById("trackingReasonValue");

const trackingReasonOptions =
  document.querySelectorAll(".tracking-reason-option");


if (
  trackingReasonSelect &&
  trackingReasonButton &&
  trackingReasonMenu &&
  trackingReasonValue
) {

  /* Open / Close */
  trackingReasonButton.addEventListener("click", (event) => {

    event.stopPropagation();

    const isOpen =
      trackingReasonButton.getAttribute("aria-expanded") === "true";


    trackingReasonButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );


    trackingReasonMenu.classList.toggle(
      "hidden",
      isOpen
    );


    const icon =
      trackingReasonButton.querySelector(
        ".tracking-reason-icon"
      );

    if (icon) {
      icon.classList.toggle(
        "rotate-180",
        !isOpen
      );
    }

  });


  /* Select */
  trackingReasonOptions.forEach((option) => {

    option.addEventListener("click", (event) => {

      event.stopPropagation();


      /* 모든 선택 상태 제거 */
      trackingReasonOptions.forEach((item) => {

        item.classList.remove(
          "bg-[#2D2D2D]",
          "font-medium"
        );


        const check =
          item.querySelector(".select-check");

        if (check) {
          check.remove();
        }

      });


      /* 선택된 항목 */
      option.classList.add(
        "bg-[#2D2D2D]",
        "font-medium"
      );


      /* 체크 추가 */
      const check =
        document.createElement("i");

      check.setAttribute(
        "data-lucide",
        "check"
      );

      check.className =
        "select-check mr-2 h-4 w-4 shrink-0";


      option.prepend(check);


      /* Trigger text */
      trackingReasonValue.textContent =
        option.dataset.value;


      /* Close */
      trackingReasonMenu.classList.add("hidden");

      trackingReasonButton.setAttribute(
        "aria-expanded",
        "false"
      );


      const icon =
        trackingReasonButton.querySelector(
          ".tracking-reason-icon"
        );

      if (icon) {
        icon.classList.remove("rotate-180");
      }


      if (window.lucide) {
        lucide.createIcons();
      }

    });

  });


  /* Outside click */
  document.addEventListener("click", (event) => {

    if (!trackingReasonSelect.contains(event.target)) {

      trackingReasonMenu.classList.add("hidden");

      trackingReasonButton.setAttribute(
        "aria-expanded",
        "false"
      );


      const icon =
        trackingReasonButton.querySelector(
          ".tracking-reason-icon"
        );

      if (icon) {
        icon.classList.remove("rotate-180");
      }

    }

  });

}

/* =========================================================
   CLOSED / SEALED SESSION ACCORDION
========================================================= */

const closedSessionToggle =
  document.getElementById("closedSessionToggle");

const closedSessionContent =
  document.getElementById("closedSessionContent");


if (
  closedSessionToggle &&
  closedSessionContent
) {

  closedSessionToggle.addEventListener("click", () => {

    const isExpanded =
      closedSessionToggle.getAttribute("aria-expanded") === "true";


    closedSessionToggle.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );


    /* Content */
    closedSessionContent.classList.toggle(
      "hidden",
      isExpanded
    );


    /* Chevron */
    const icon =
      closedSessionToggle.querySelector(
        ".closed-session-icon"
      );

    if (icon) {
      icon.classList.toggle(
        "rotate-180",
        !isExpanded
      );
    }

  });

}

/* =========================================================
   DANGER SHIP FILTER
========================================================= */

const dangerShipFilters =
  document.querySelectorAll(".danger-ship-filter");

dangerShipFilters.forEach((button) => {

  button.addEventListener("click", (event) => {

    /* 아코디언 버튼 클릭 전파 방지 */
    event.stopPropagation();

    dangerShipFilters.forEach((item) => {

      item.setAttribute("aria-pressed", "false");

      item.classList.remove(
        "bg-[#E7E7E7]",
        "text-black"
      );

      item.classList.add(
        "bg-[#050505]",
        "text-[#777777]"
      );

    });


    button.setAttribute("aria-pressed", "true");

    button.classList.remove(
      "bg-[#050505]",
      "text-[#777777]"
    );

    button.classList.add(
      "bg-[#E7E7E7]",
      "text-black"
    );

  });

});

/* =========================================================
   VESSEL DETAIL TABS
========================================================= */

const vesselDetailTabs =
  document.querySelectorAll(".vessel-detail-tab");

const vesselDetailTabContents =
  document.querySelectorAll("[data-vessel-tab-content]");


if (
  vesselDetailTabs.length &&
  vesselDetailTabContents.length
) {

  vesselDetailTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const target =
        tab.dataset.vesselTab;


      /* =============================================
   TAB RESET
============================================= */

vesselDetailTabs.forEach((item) => {

  item.setAttribute(
    "aria-selected",
    "false"
  );

  item.classList.remove(
    "bg-[#E7E7E7]",
    "text-black",
    "rounded-t-[4px]"
  );

  item.classList.add(
    "text-[#777777]",
    "hover:text-[#E7E7E7]"
  );

});


/* =============================================
   ACTIVE TAB
============================================= */

tab.setAttribute(
  "aria-selected",
  "true"
);

tab.classList.remove(
  "text-[#777777]",
  "hover:text-[#E7E7E7]"
);

tab.classList.add(
  "bg-[#E7E7E7]",
  "text-black",
  "rounded-t-[4px]"
);


      /* =============================================
         ACTIVE TAB
      ============================================= */

      tab.setAttribute(
        "aria-selected",
        "true"
      );

      tab.classList.remove(
        "text-[#777777]"
      );

      tab.classList.add(
        "bg-[#E7E7E7]",
        "text-black",
        "rounded-t-[4px]"
      );


      /* =============================================
         CONTENT RESET
      ============================================= */

      vesselDetailTabContents.forEach((content) => {

        content.classList.add("hidden");

      });


      /* =============================================
         TARGET CONTENT
      ============================================= */

      const targetContent =
        document.querySelector(
          `[data-vessel-tab-content="${target}"]`
        );

      if (targetContent) {
        targetContent.classList.remove("hidden");
      }

    });

  });

}

/* =========================================================
   VESSEL ACTION DROPDOWN
========================================================= */

const vesselActionToggle =
  document.getElementById("vesselActionToggle");

const vesselActionMenu =
  document.getElementById("vesselActionMenu");

const vesselActionItems =
  document.querySelectorAll(".vessel-action-item");


if (
  vesselActionToggle &&
  vesselActionMenu
) {

  const vesselActionIcon =
    vesselActionToggle.querySelector(
      ".vessel-action-icon"
    );


  /* Open / Close */
  vesselActionToggle.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const isOpen =
        !vesselActionMenu.classList.contains("hidden");


      if (isOpen) {

        vesselActionMenu.classList.add("hidden");

        vesselActionToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        vesselActionIcon?.classList.remove(
          "rotate-180"
        );

      } else {

        vesselActionMenu.classList.remove("hidden");

        vesselActionToggle.setAttribute(
          "aria-expanded",
          "true"
        );

        vesselActionIcon?.classList.add(
          "rotate-180"
        );

      }

    }
  );


  /* Item Click */
  vesselActionItems.forEach((item) => {

    item.addEventListener("click", () => {

      vesselActionMenu.classList.add("hidden");

      vesselActionToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      vesselActionIcon?.classList.remove(
        "rotate-180"
      );

    });

  });


  /* Outside Click */
  document.addEventListener("click", (event) => {

    if (
      !vesselActionToggle.contains(event.target) &&
      !vesselActionMenu.contains(event.target)
    ) {

      vesselActionMenu.classList.add("hidden");

      vesselActionToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      vesselActionIcon?.classList.remove(
        "rotate-180"
      );

    }

  });

}

/* =========================================================
   INSPECTION REPORT VIEW
========================================================= */

const vesselDefaultView =
  document.getElementById("vesselDefaultView");

const inspectionReportView =
  document.getElementById("inspectionReportView");

const inspectionReportOpen =
  document.querySelector(
    '[data-vessel-action="inspection-report"]'
  );

const inspectionReportBack =
  document.getElementById("inspectionReportBack");

const inspectionReportCancel =
  document.getElementById("inspectionReportCancel");


/* ---------------------------------------------------------
   OPEN
--------------------------------------------------------- */

if (
  vesselDefaultView &&
  inspectionReportView &&
  inspectionReportOpen
) {

  inspectionReportOpen.addEventListener(
    "click",
    () => {

      vesselDefaultView.classList.add("hidden");

      inspectionReportView.classList.remove("hidden");
      inspectionReportView.classList.add("flex");


      /* 조치 Dropdown 닫기 */
      const vesselActionMenu =
        document.getElementById("vesselActionMenu");

      if (vesselActionMenu) {
        vesselActionMenu.classList.add("hidden");
      }

    }
  );

}


/* ---------------------------------------------------------
   CLOSE
--------------------------------------------------------- */

function closeInspectionReport() {

  if (
    !vesselDefaultView ||
    !inspectionReportView
  ) {
    return;
  }


  inspectionReportView.classList.add("hidden");
  inspectionReportView.classList.remove("flex");

  vesselDefaultView.classList.remove("hidden");

}


inspectionReportBack?.addEventListener(
  "click",
  closeInspectionReport
);


inspectionReportCancel?.addEventListener(
  "click",
  closeInspectionReport
);

/* =========================================================
   USER MENU / MY INFO MODAL
========================================================= */

const userMenuToggle =
  document.getElementById("userMenuToggle");

const userMenu =
  document.getElementById("userMenu");


const myInfoModal =
  document.getElementById("myInfoModal");

const myInfoClose =
  document.getElementById("myInfoClose");

const myInfoCancel =
  document.getElementById("myInfoCancel");

const myInfoDim =
  document.getElementById("myInfoDim");


/* ---------------------------------------------------------
   USER DROPDOWN
--------------------------------------------------------- */

if (
  userMenuToggle &&
  userMenu
) {

  userMenuToggle.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const isOpen =
        !userMenu.classList.contains("hidden");

      userMenu.classList.toggle("hidden");

      userMenuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !userMenuToggle.contains(event.target) &&
        !userMenu.contains(event.target)
      ) {

        userMenu.classList.add("hidden");

        userMenuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}


function openMyInfoModal() {

  if (!myInfoModal) return;

  /* Dropdown 닫기 */
  userMenu?.classList.add("hidden");

  userMenuToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

  /* Modal */
  myInfoModal.classList.remove("hidden");
  myInfoModal.classList.add("flex");

  /* 배경 스크롤 방지 */
  document.body.classList.add("overflow-hidden");
}


/* 처음 화면 진입 시 내 정보 팝업 열기 */
openMyInfoModal();



/* ---------------------------------------------------------
   MY INFO CLOSE
--------------------------------------------------------- */

function closeMyInfoModal() {

  if (!myInfoModal) return;

  myInfoModal.classList.add("hidden");
  myInfoModal.classList.remove("flex");

}


myInfoClose?.addEventListener(
  "click",
  closeMyInfoModal
);

myInfoCancel?.addEventListener(
  "click",
  closeMyInfoModal
);

myInfoDim?.addEventListener(
  "click",
  closeMyInfoModal
);


/* ESC */
document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      myInfoModal &&
      !myInfoModal.classList.contains("hidden")
    ) {
      closeMyInfoModal();
    }

  }
);


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

document
  .querySelectorAll("[data-password-toggle]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const inputId =
          button.dataset.passwordToggle;

        const input =
          document.getElementById(inputId);

        if (!input) return;


        const isPassword =
          input.type === "password";


        input.type =
          isPassword
            ? "text"
            : "password";


        const icon =
          button.querySelector("[data-lucide]");

        if (icon) {

          icon.setAttribute(
            "data-lucide",
            isPassword
              ? "eye"
              : "eye-off"
          );

          lucide.createIcons();

        }

      }
    );

  });

  /* =========================================================
   HEADER UTILITY COMPACT MENU
========================================================= */

const headerUtilityToggle =
  document.getElementById("headerUtilityToggle");

const headerUtilityMenu =
  document.getElementById("headerUtilityMenu");


if (
  headerUtilityToggle &&
  headerUtilityMenu
) {

  function closeHeaderUtilityMenu() {

    headerUtilityMenu.classList.add("hidden");

    headerUtilityToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  headerUtilityToggle.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const isOpen =
        !headerUtilityMenu.classList.contains("hidden");


      if (isOpen) {

        closeHeaderUtilityMenu();

      } else {

        headerUtilityMenu.classList.remove("hidden");

        headerUtilityToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    }
  );


  /* 메뉴 내부 클릭 때문에 바로 닫히는 것 방지 */
  headerUtilityMenu.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );


  /* 바깥 클릭 */
  document.addEventListener(
    "click",
    closeHeaderUtilityMenu
  );


  /* ESC */
  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeHeaderUtilityMenu();
      }

    }
  );


  /* 1650 이상으로 다시 커졌을 경우 메뉴 초기화 */
  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 1650) {
        closeHeaderUtilityMenu();
      }

    }
  );

}


/* =========================================================
   HEADER ALL COMPACT
   1100 이하 통합 메뉴
========================================================= */

const headerAllToggle =
  document.getElementById("headerAllToggle");

const headerAllMenu =
  document.getElementById("headerAllMenu");


if (
  headerAllToggle &&
  headerAllMenu
) {

  function closeHeaderAllMenu() {

    headerAllMenu.classList.add("hidden");

    headerAllToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  headerAllToggle.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const isOpen =
        !headerAllMenu.classList.contains("hidden");


      if (isOpen) {

        closeHeaderAllMenu();

      } else {

        headerAllMenu.classList.remove("hidden");

        headerAllToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    }
  );


  headerAllMenu.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );


  document.addEventListener(
    "click",
    closeHeaderAllMenu
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeHeaderAllMenu();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 1100) {
        closeHeaderAllMenu();
      }

    }
  );

}


/* =========================================================
   HEADER EXPAND SEARCH
   1100 이하
========================================================= */

const headerSearchBox =
  document.getElementById("headerSearchBox");

const headerSearchToggle =
  document.getElementById("headerSearchToggle");

const headerSearchInput =
  document.getElementById("headerSearchInput");


function closeHeaderSearch() {

  if (!headerSearchBox) return;

  headerSearchBox.classList.remove("is-open");

  headerSearchToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

}


headerSearchToggle?.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

    const isOpen =
      headerSearchBox?.classList.contains("is-open");


    if (isOpen) {

      closeHeaderSearch();

      return;
    }


    /* 햄버거 메뉴가 열려 있으면 닫기 */
    headerAllMenu?.classList.add("hidden");

    headerAllToggle?.setAttribute(
      "aria-expanded",
      "false"
    );


    /* 검색창 확장 */
    headerSearchBox?.classList.add("is-open");

    headerSearchToggle?.setAttribute(
      "aria-expanded",
      "true"
    );


    /* 입력창 바로 활성화 */
    requestAnimationFrame(() => {
      headerSearchInput?.focus();
    });

  }
);


/* 검색창 내부 클릭 시 유지 */
headerSearchBox?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);


/* 바깥 클릭 시 접기 */
document.addEventListener(
  "click",
  closeHeaderSearch
);


/* ESC */
document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeHeaderSearch();
    }

  }
);


/* =========================================================
   VESSEL DETAIL PANEL
   1100 이하 : 지도 위 팝업
========================================================= */

const vesselDetailPanel =
  document.getElementById("vesselDetailPanel");

const vesselDetailClose =
  document.getElementById("vesselDetailClose");

const vesselMarkerOpen =
  document.getElementById("vesselMarkerOpen");


function isVesselMobileLayout() {
  return window.innerWidth <= 1100;
}

function syncVesselDetailResponsive() {

  if (!vesselDetailPanel) return;

  if (window.innerWidth <= 1100) {

    /* 1100 이하 진입 시 기본으로 팝업 열기 */
    vesselDetailPanel.classList.add("is-open");

  } else {

    /* 1101 이상에서는 팝업 상태 클래스 제거 */
    vesselDetailPanel.classList.remove("is-open");

  }
}


function openVesselDetailPanel() {
  if (!vesselDetailPanel) return;

  if (isVesselMobileLayout()) {
    vesselDetailPanel.classList.add("is-open");
  }
}


function closeVesselDetailPanel() {
  if (!vesselDetailPanel) return;

  if (isVesselMobileLayout()) {
    vesselDetailPanel.classList.remove("is-open");
  }
}


/* 지도 위 선박 클릭 */
if (vesselMarkerOpen) {
  vesselMarkerOpen.addEventListener("click", (event) => {
    event.stopPropagation();
    openVesselDetailPanel();
  });
}


/* X 버튼 */
if (vesselDetailClose) {
  vesselDetailClose.addEventListener("click", () => {

    if (isVesselMobileLayout()) {
      closeVesselDetailPanel();
      return;
    }

    /*
      1100 초과 기존 데스크톱 닫기 동작이
      이미 따로 있다면 이 아래에는 넣지 않아도 됨.
    */

  });
}


/* 화면 크기가 다시 데스크톱으로 커졌을 때 초기화 */
window.addEventListener("resize", () => {

  if (!vesselDetailPanel) return;

  if (window.innerWidth > 1100) {
    vesselDetailPanel.classList.remove("is-open");
  }

});

syncVesselDetailResponsive();

window.addEventListener(
  "resize",
  syncVesselDetailResponsive
);

situationPanelCollapsedMobile?.addEventListener(
  "click",
  () => {

    if (window.innerWidth > 1100) {
      return;
    }

    const disableMobileSituationOpen =
      document.body.dataset.disableMobileSituationOpen === "true";

    if (disableMobileSituationOpen) {
      return;
    }

    openSituationPanel();

  }
);

/* =========================================================
   WEATHER PANEL POSITION
   툴바와 항상 12px 간격 유지
========================================================= */

function syncWeatherPanelPosition() {
  if (!weatherPanel || !mapToolbar) return;

  /* 1100 이하 */
  if (window.innerWidth <= 1100) {
    weatherPanel.style.right = "68px";
    return;
  }

  /* 1101 이상 */
  const toolbarRight =
    parseFloat(getComputedStyle(mapToolbar).right) || 0;

  const toolbarWidth =
    mapToolbar.offsetWidth;

  const gap = 12;

  weatherPanel.style.right =
    `${toolbarRight + toolbarWidth + gap}px`;
}

    window.addEventListener(
  "resize",
  syncWeatherPanelPosition
);


/* =====================================================
   SITUATION SUMMARY — NEW UI
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const situationPanel =
    document.getElementById("situationPanel");

  if (!situationPanel) return;

  /* =========================================
     SEVERITY TABS
  ========================================== */

  const severityTabs =
    situationPanel.querySelectorAll(
      ".situation-severity-tab"
    );

  const vesselCards =
    situationPanel.querySelectorAll(
      ".situation-vessel-card"
    );

  const vesselEmpty =
    document.getElementById("situationVesselEmpty");

  severityTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const selectedSeverity =
        tab.dataset.severity;

      severityTabs.forEach((item) => {

        const isActive = item === tab;

        item.classList.toggle(
          "is-active",
          isActive
        );

        item.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

      let visibleCount = 0;

      vesselCards.forEach((card) => {

        const visible =
          card.dataset.severity === selectedSeverity;

        card.hidden = !visible;

        if (visible) visibleCount++;

      });

      if (vesselEmpty) {
        vesselEmpty.classList.toggle(
          "hidden",
          visibleCount > 0
        );
      }

    });

  });

  /* =========================================
     FILTER BUTTONS
  ========================================== */

  const filterButtons =
    situationPanel.querySelectorAll(
      ".situation-filter-chip"
    );

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const isPressed =
        button.getAttribute("aria-pressed") === "true";

      button.setAttribute(
        "aria-pressed",
        String(!isPressed)
      );

      const icon = button.querySelector("svg");

      if (icon) {
        icon.style.transform =
          isPressed ? "" : "rotate(45deg)";
      }

    });

  });

});


/* =====================================================
   SITUATION MOBILE SUMMARY SYNC
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const mobileSummary =
    document.getElementById("situationMobileSummary");

  const mobileClose =
    document.getElementById("situationMobileClose");

  const panelToggle =
    document.getElementById("situationPanelToggle");

  if (!mobileSummary || !panelToggle) return;

  function syncMobileSummary() {

    const isMobile = window.innerWidth <= 1100;

    const isOpen =
      panelToggle.getAttribute("aria-expanded") === "true";

    mobileSummary.classList.toggle(
      "hidden",
      !(isMobile && isOpen)
    );
  }

  /* 모바일 접기 */
  mobileClose?.addEventListener("click", () => {
    closeSituationPanel();
    syncMobileSummary();
  });

  /* 기존 접기 버튼 */
  panelToggle.addEventListener("click", () => {
    syncMobileSummary();
  });

  /* 모바일 접힘 버튼으로 다시 펼칠 때 */
  document.getElementById(
    "situationPanelCollapsedMobile"
  )?.addEventListener("click", () => {
    syncMobileSummary();
  });

  window.addEventListener("resize", syncMobileSummary);

  syncMobileSummary();
});

// 상황 요약 패널 접기/펼치기 비활성화
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("situationPanelToggle");
  const mobileToggle = document.getElementById("situationPanelCollapsedMobile");

  if (toggle) {
    toggle.disabled = true;
    toggle.setAttribute("aria-disabled", "true");
  }

  if (mobileToggle) {
    mobileToggle.disabled = true;
    mobileToggle.setAttribute("aria-disabled", "true");
  }
});


/* =========================================
   SeaOn - Information Status
   ========================================= */

(() => {
  const page = document.querySelector(".page-information");
  if (!page) return;

  const panel = page.querySelector("#informationFilter");
  const toggle = page.querySelector("#informationFilterToggle");
  const close = page.querySelector("#informationFilterClose");
  const overlay = page.querySelector("#informationOverlay");
  const form = page.querySelector("#informationSearchForm");

  const mobile = window.matchMedia("(max-width: 768px)");

  if (!panel || !toggle || !close || !overlay || !form) return;

  function setPanelOpen(open) {
    const shouldOpen = mobile.matches && open;

    panel.classList.toggle("is-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
    overlay.hidden = !shouldOpen;

    if (shouldOpen) {
      close.focus({ preventScroll: true });
    } else if (mobile.matches && open === false) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", () => {
    setPanelOpen(!panel.classList.contains("is-open"));
  });

  close.addEventListener("click", () => setPanelOpen(false));
  overlay.addEventListener("click", () => setPanelOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      setPanelOpen(false);
    }
  });

  // 화면 크기가 바뀌면 열림 상태만 정리.
  // resize마다 패널 위치를 강제로 바꾸지 않음.
  function resetResponsivePanel() {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
  }

  if (mobile.addEventListener) {
    mobile.addEventListener("change", resetResponsivePanel);
  } else {
    mobile.addListener(resetResponsivePanel);
  }

  // 필터 칩
  const groups = page.querySelectorAll("[data-filter-group]");

  groups.forEach((group) => {
    group.addEventListener("click", (event) => {
      const chip = event.target.closest(".information-chip");
      if (!chip || !group.contains(chip)) return;

      const groupName = group.dataset.filterGroup;

      if (groupName === "status") {
        const selected = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", String(!selected));
        chip.classList.toggle("is-selected", !selected);
        return;
      }

      group.querySelectorAll(".information-chip").forEach((item) => {
        const active = item === chip;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  // 탭 전환
  const tabs = [
    {
      tab: page.querySelector("#informationTabStatus"),
      panel: page.querySelector("#informationPanelStatus")
    },
    {
      tab: page.querySelector("#informationTabHistory"),
      panel: page.querySelector("#informationPanelHistory")
    }
  ];

  function activateTab(index) {
    tabs.forEach(({ tab, panel }, i) => {
      const active = i === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
  }

  tabs.forEach(({ tab }, index) => {
    tab.addEventListener("click", () => activateTab(index));

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      const next = event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;

      activateTab(next);
      tabs[next].tab.focus();
    });
  });

  // 초기화
  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      page.querySelectorAll("[data-filter-group]").forEach((group) => {
        group.querySelectorAll(".information-chip").forEach((chip) => {
          const selected = chip === group.querySelector(".information-chip");
          chip.classList.toggle("is-selected", selected);
          chip.setAttribute("aria-pressed", String(selected));
        });
      });

      const status = page.querySelector('[data-filter-group="status"]');
      status.querySelectorAll(".information-chip").forEach((chip, index) => {
        const selected = index < 2;
        chip.classList.toggle("is-selected", selected);
        chip.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  // 현재는 데이터 연동 전이므로 화면 새로고침 방지
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (mobile.matches) setPanelOpen(false);
  });
})();



/* =========================================
   SeaOn - 보고내역
========================================= */

(() => {
  const page = document.querySelector(".page-report");
  if (!page) return;

  const filter = page.querySelector("#reportFilter");
  const toggle = page.querySelector("#reportFilterToggle");
  const overlay = page.querySelector("#reportFilterOverlay");
  const form = page.querySelector("#reportSearchForm");
  const mobile = window.matchMedia("(max-width: 768px)");

  if (!filter || !toggle || !overlay || !form) return;

  function setFilterOpen(open, restoreFocus = false) {
    const shouldOpen = mobile.matches && open;

    filter.classList.toggle("is-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
    overlay.hidden = !shouldOpen;

    if (shouldOpen) {
      const input = filter.querySelector("#reportKeyword");
      input?.focus({ preventScroll: true });
    } else if (restoreFocus && mobile.matches) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", () => {
    setFilterOpen(!filter.classList.contains("is-open"));
  });

  overlay.addEventListener("click", () => {
    setFilterOpen(false, true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && filter.classList.contains("is-open")) {
      setFilterOpen(false, true);
    }
  });

  function resetFilterLayout() {
    filter.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
  }

  if (mobile.addEventListener) {
    mobile.addEventListener("change", resetFilterLayout);
  } else {
    mobile.addListener(resetFilterLayout);
  }

  // 필터 칩 선택
  page.querySelectorAll("[data-report-filter]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const chip = event.target.closest(".report-chip");
      if (!chip || !group.contains(chip)) return;

      const multiple = group.dataset.multiple === "true";
      const selected = chip.getAttribute("aria-pressed") === "true";

      if (!multiple) {
        group.querySelectorAll(".report-chip").forEach((item) => {
          const active = item === chip && !selected;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-pressed", String(active));
        });
      } else {
        chip.classList.toggle("is-selected", !selected);
        chip.setAttribute("aria-pressed", String(!selected));
      }
    });
  });

  // 탭 전환
  const tabs = [
    ["reportTabCases", "reportPanelCases"],
    ["reportTabList", "reportPanelList"],
    ["reportTabDrafts", "reportPanelDrafts"],
    ["reportTabHistory", "reportPanelHistory"]
  ].map(([tabId, panelId]) => ({
    tab: page.querySelector(`#${tabId}`),
    panel: page.querySelector(`#${panelId}`)
  }));

  function activateTab(index) {
    tabs.forEach(({ tab, panel }, i) => {
      const active = i === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
  }

  tabs.forEach(({ tab }, index) => {
    tab.addEventListener("click", () => activateTab(index));

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      const next = event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;

      activateTab(next);
      tabs[next].tab.focus();
    });
  });

  // 초기화
  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      page.querySelectorAll(".report-chip").forEach((chip) => {
        const selected = chip.textContent.trim() === "진행 중";
        chip.classList.toggle("is-selected", selected);
        chip.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  // 퍼블리싱 단계: 데이터 조회 연결 전
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (mobile.matches) setFilterOpen(false, true);
  });
})();
