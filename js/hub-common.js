document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     LUCIDE
  ========================================================= */

  if (window.lucide) {
    lucide.createIcons();
  }



  /* =========================================================
     DATA TYPE TAB
  ========================================================= */

  const dataTabs =
    document.querySelectorAll(".data-tab");


  dataTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      dataTabs.forEach((item) => {

        item.classList.remove(
          "active",
          "border-2",
          "border-[#0061F0]",
          "bg-white",
          "text-[#142A4D]"
        );

        item.classList.add(
          "text-[#476187]"
        );

      });


      tab.classList.add(
        "active",
        "border-2",
        "border-[#0061F0]",
        "bg-white",
        "text-[#142A4D]"
      );

      tab.classList.remove(
        "text-[#476187]"
      );

    });

  });



  /* =========================================================
     CATEGORY CARD
  ========================================================= */

  const categoryCards =
    document.querySelectorAll(".category-card");


  categoryCards.forEach((card) => {

    card.addEventListener("click", () => {

      categoryCards.forEach((item) => {
        item.classList.remove("active");
      });

      card.classList.add("active");

    });

  });



  /* =========================================================
     DETAIL FILTER TOGGLE
  ========================================================= */

  const detailFilterToggle =
    document.querySelector("#detailFilterToggle");

  const detailFilterPanel =
    document.querySelector("#detailFilterPanel");


  if (
    detailFilterToggle &&
    detailFilterPanel
  ) {

    detailFilterToggle.addEventListener(
      "click",
      () => {

        const isExpanded =
          detailFilterToggle.getAttribute(
            "aria-expanded"
          ) === "true";


        detailFilterToggle.setAttribute(
          "aria-expanded",
          String(!isExpanded)
        );


        detailFilterPanel.classList.toggle(
          "hidden",
          isExpanded
        );


        const icon =
          detailFilterToggle.querySelector(
            ".filter-toggle-icon"
          );


        if (icon) {

          icon.setAttribute(
            "data-lucide",
            isExpanded
              ? "chevron-down"
              : "chevron-up"
          );


          if (window.lucide) {
            lucide.createIcons();
          }

        }

      }
    );

  }



  /* =========================================================
     FILTER CHIP
  ========================================================= */

  const filterChips =
    document.querySelectorAll(".filter-chip");


  filterChips.forEach((chip) => {

    chip.addEventListener("click", () => {

      chip.classList.toggle("active");

    });

  });



  /* =========================================================
     SELECTED FILTER REMOVE
  ========================================================= */

  const selectedFilterList =
    document.querySelector(
      "#selectedFilterList"
    );


  if (selectedFilterList) {

    selectedFilterList.addEventListener(
      "click",
      (event) => {

        const button =
          event.target.closest(
            ".selected-filter"
          );


        if (!button) {
          return;
        }


        button.remove();

      }
    );

  }



  /* =========================================================
     FILTER RESET
  ========================================================= */

  const filterReset =
    document.querySelector("#filterReset");


  if (filterReset) {

    filterReset.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter-chip.active")
          .forEach((chip) => {

            chip.classList.remove("active");

          });


        if (selectedFilterList) {
          selectedFilterList.innerHTML = "";
        }

      }
    );

  }



  /* =========================================================
     FAVORITE
  ========================================================= */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".favorite-button"
        );


      if (!button) {
        return;
      }


      const isActive =
        button.classList.toggle("active");


      button.innerHTML =
        isActive
          ? `
            <i
              data-lucide="heart"
              class="fill-[#F84141] text-[#F84141]"
            ></i>
            관심
          `
          : `
            <i data-lucide="heart"></i>
            관심
          `;


      if (window.lucide) {
        lucide.createIcons();
      }

    }
  );



  /* =========================================================
     CART
  ========================================================= */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".cart-button"
        );


      if (!button) {
        return;
      }


      const isActive =
        button.classList.toggle("active");


      button.innerHTML =
        isActive
          ? `
            <i data-lucide="check"></i>
            담기
          `
          : `
            <i data-lucide="plus"></i>
            담기
          `;


      if (window.lucide) {
        lucide.createIcons();
      }

    }
  );

  /* =========================================================
   VIEW TOGGLE
========================================================= */

const viewToggleButtons =
  document.querySelectorAll(".view-toggle");

const dataList =
  document.getElementById("dataList");


/* =========================================================
   CARD VIEW DATA SETTING
========================================================= */

const categoryIconMap = {
  공간: "map-pin",
  선박: "ship",
  시간: "clock-3",
  행동: "square-check-big"
};


if (dataList) {

  const dataItems =
    dataList.querySelectorAll(".data-item");


  dataItems.forEach((item) => {

    const content =
      item.querySelector(".min-w-0");

    const title =
      item.querySelector(".data-title");

    const meta =
      item.querySelector(".data-meta");

    const badgeRow =
      content?.querySelector(".mb-2");

    const categoryBadge =
      badgeRow?.querySelector(".badge");

    const actions =
      item.querySelector(".data-actions");


    if (
      !content ||
      !title ||
      !categoryBadge
    ) {
      return;
    }


    /* -----------------------------------------
       CATEGORY
    ------------------------------------------ */

    const category =
      categoryBadge.textContent.trim();

    const iconName =
      categoryIconMap[category] ||
      "circle";


    if (
      !item.querySelector(
        ".card-grid-category"
      )
    ) {

      const categoryElement =
        document.createElement("div");


      categoryElement.className =
        "card-grid-category";


      categoryElement.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${category}</span>
      `;


      content.insertBefore(
        categoryElement,
        title
      );

    }


    /* -----------------------------------------
       META TEXT
    ------------------------------------------ */

    const metaText =
      meta
        ? meta.textContent
            .replace(/\s+/g, " ")
            .trim()
        : "";


    /* 날짜 */
    const dateMatch =
      metaText.match(
        /수정일\s*:\s*(\d{4}-\d{2}-\d{2})/
      );


    const date =
      dateMatch
        ? dateMatch[1]
        : "";


    if (
      date &&
      !item.querySelector(
        ".card-grid-date"
      )
    ) {

      const dateElement =
        document.createElement("span");


      dateElement.className =
        "card-grid-date";


      dateElement.textContent =
        date;


      item.appendChild(
        dateElement
      );

    }


    /* -----------------------------------------
       사용신청 / 관심 수치
    ------------------------------------------ */

    const requestMatch =
      metaText.match(
        /사용신청\s*:\s*(\d+)/
      );

    const favoriteMatch =
      metaText.match(
        /관심\s*:\s*(\d+)/
      );


    const requestCount =
      requestMatch
        ? requestMatch[1]
        : "0";

    const favoriteCount =
      favoriteMatch
        ? favoriteMatch[1]
        : "0";


    if (
      actions &&
      !actions.querySelector(
        ".card-grid-stats"
      )
    ) {

      const stats =
        document.createElement("span");


      stats.className =
        "card-grid-stats";


      stats.textContent =
        `사용신청: ${requestCount} · 관심: ${favoriteCount}`;


      actions.appendChild(
        stats
      );

    }

  });


  /* 새로 추가된 Lucide 아이콘 생성 */
  if (window.lucide) {
    lucide.createIcons();
  }

}


/* =========================================================
   VIEW CHANGE
========================================================= */

viewToggleButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const view =
        button.dataset.view;


      /* 버튼 상태 */
      viewToggleButtons.forEach(
        (item) => {
          item.classList.remove("active");
        }
      );


      button.classList.add(
        "active"
      );


      if (!dataList) {
        return;
      }


      /* 카드 */
      if (view === "grid") {

        dataList.classList.add(
          "is-grid"
        );

      }

      /* 리스트 */
      else {

        dataList.classList.remove(
          "is-grid"
        );

      }

    }
  );

});

  

  /* =========================================================
   SEARCH TYPE SELECT
   함정용 Custom Select 방식
========================================================= */

const searchTypeSelect =
  document.getElementById("searchTypeSelect");

const searchTypeButton =
  document.getElementById("searchTypeButton");

const searchTypeMenu =
  document.getElementById("searchTypeMenu");

const searchTypeValue =
  document.getElementById("searchTypeValue");

const searchTypeOptions =
  document.querySelectorAll(".search-type-option");


if (
  searchTypeSelect &&
  searchTypeButton &&
  searchTypeMenu &&
  searchTypeValue
) {

  /* =======================================================
     OPEN / CLOSE
  ======================================================== */
  searchTypeButton.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();


      const isExpanded =
        searchTypeButton.getAttribute(
          "aria-expanded"
        ) === "true";


      searchTypeButton.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );


      searchTypeMenu.classList.toggle(
        "hidden",
        isExpanded
      );


      /* Chevron */
      const icon =
        searchTypeButton.querySelector(
          ".search-type-icon"
        );


      if (icon) {

        icon.classList.toggle(
          "rotate-180",
          !isExpanded
        );

      }

    }
  );



  /* =======================================================
     OPTION SELECT
  ======================================================== */
  searchTypeOptions.forEach((option) => {

    option.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();


        /* 기존 선택 초기화 */
        searchTypeOptions.forEach((item) => {

          item.classList.remove(
            "bg-[#E1E7F2]",
            "font-semibold"
          );

          item.classList.add(
            "bg-white",
            "font-medium"
          );

        });


        /* 현재 선택 */
        option.classList.remove(
          "bg-white",
          "font-medium"
        );

        option.classList.add(
          "bg-[#E1E7F2]",
          "font-semibold"
        );


        /* Trigger 값 변경 */
        searchTypeValue.textContent =
          option.dataset.value;


        searchTypeButton.dataset.value =
          option.dataset.value;


        /* Dropdown 닫기 */
        searchTypeMenu.classList.add(
          "hidden"
        );


        searchTypeButton.setAttribute(
          "aria-expanded",
          "false"
        );


        /* Chevron 원위치 */
        const icon =
          searchTypeButton.querySelector(
            ".search-type-icon"
          );


        if (icon) {

          icon.classList.remove(
            "rotate-180"
          );

        }

      }
    );

  });



  /* =======================================================
     OUTSIDE CLICK
  ======================================================== */
  document.addEventListener(
    "click",
    (event) => {

      if (
        !searchTypeSelect.contains(
          event.target
        )
      ) {

        searchTypeMenu.classList.add(
          "hidden"
        );


        searchTypeButton.setAttribute(
          "aria-expanded",
          "false"
        );


        const icon =
          searchTypeButton.querySelector(
            ".search-type-icon"
          );


        if (icon) {

          icon.classList.remove(
            "rotate-180"
          );

        }

      }

    }
  );

}

});

/* =========================================================
   DETAIL FILTER TAB
========================================================= */

const filterSectionTabs =
  document.querySelectorAll(".filter-section-tab");

const filterSectionPanels =
  document.querySelectorAll(".filter-section-panel");


filterSectionTabs.forEach((tab) => {

  tab.addEventListener("click", () => {

    const target =
      tab.dataset.filterTab;


    /* -----------------------------------------
       LEFT TAB RESET
    ------------------------------------------ */

    filterSectionTabs.forEach((item) => {

      item.classList.remove(
        "active",
        "border-[#0061F0]",
        "text-black"
      );

      item.classList.add(
        "border-transparent",
        "text-[#476187]"
      );

    });


    /* -----------------------------------------
       ACTIVE TAB
    ------------------------------------------ */

    tab.classList.add(
      "active",
      "border-[#0061F0]",
      "text-black"
    );

    tab.classList.remove(
      "border-transparent",
      "text-[#476187]"
    );


    /* -----------------------------------------
       PANEL CHANGE
    ------------------------------------------ */

    filterSectionPanels.forEach((panel) => {

      const panelName =
        panel.dataset.filterPanel;


      if (panelName === target) {

        panel.classList.remove("hidden");

      } else {

        panel.classList.add("hidden");

      }

    });

  });

});

/* =========================================================
   LINKED DATA CARD SETTING
========================================================= */

const linkedDataPage =
  document.body.classList.contains(
    "linked-data-page"
  );


if (linkedDataPage) {

  const linkedDataList =
    document.getElementById("dataList");


  const linkedCategoryIconMap = {
    "선박": "ship",
    "공간": "map-pin",
    "시간": "clock-3",
    "행동": "square-check-big"
  };


  if (linkedDataList) {

    const linkedItems =
      linkedDataList.querySelectorAll(
        ".data-item"
      );


    linkedItems.forEach((item) => {

      const content =
        item.querySelector(
          ".min-w-0"
        );

      const title =
        item.querySelector(
          ".data-title"
        );

      const meta =
        item.querySelector(
          ".data-meta"
        );

      const actions =
        item.querySelector(
          ".data-actions"
        );

      const categoryBadge =
        content
          ?.querySelector(
            ".badge"
          );


      if (
        !content ||
        !title ||
        !categoryBadge
      ) {
        return;
      }


      /* =========================================
         BADGE ROW
      ========================================== */

      const badgeRow =
        categoryBadge.parentElement;


      if (badgeRow) {
        badgeRow.classList.add(
          "linked-badge-row"
        );
      }


      /* =========================================
         CATEGORY
      ========================================== */

      const category =
        categoryBadge.textContent.trim();


      const iconName =
        linkedCategoryIconMap[
          category
        ] || "circle";


      if (
        !item.querySelector(
          ".linked-card-category"
        )
      ) {

        const categoryElement =
          document.createElement(
            "div"
          );


        categoryElement.className =
          "linked-card-category linked-card-only";


        categoryElement.innerHTML = `
          <i data-lucide="${iconName}"></i>
          <span>${category}</span>
        `;


        content.insertBefore(
          categoryElement,
          title
        );

      }


      /* =========================================
         PROVIDER
      ========================================== */

      if (meta) {

        meta.classList.add(
          "linked-list-meta"
        );


        const metaText =
          meta.textContent
            .replace(/\s+/g, " ")
            .trim();


        let provider =
          metaText;


        if (
          metaText.includes(":")
        ) {

          provider =
            metaText
              .split(":")
              .slice(1)
              .join(":")
              .trim();

        }


        if (
          !item.querySelector(
            ".linked-card-provider"
          )
        ) {

          const providerElement =
            document.createElement(
              "span"
            );


          providerElement.className =
            "linked-card-provider linked-card-only";


          providerElement.textContent =
            provider;


          item.appendChild(
            providerElement
          );

        }

      }


      /* =========================================
         ACTION BUTTON CLASS
      ========================================== */

      if (actions) {

        const actionButtons =
          actions.querySelectorAll(
            "button"
          );


        actionButtons.forEach(
          (button) => {

            const text =
              button
                .textContent
                .replace(/\s+/g, " ")
                .trim();


            /* 품질신고 */
            if (
              text.includes(
                "품질신고"
              )
            ) {

              button.classList.add(
                "linked-quality-action"
              );

            }


            /* OPEN API 상세 / FILE 상세 */
            else if (
              text.includes(
                "상세"
              )
            ) {

              button.classList.add(
                "linked-detail-action"
              );

            }

          }
        );

      }

    });


    /* 새로 만든 아이콘 렌더링 */
    if (window.lucide) {
      lucide.createIcons();
    }

  }

}

/* =========================================================
   ACCOUNT PANEL
========================================================= */

const accountPanel =
  document.getElementById("accountPanel");

const accountOpenButtons =
  document.querySelectorAll(
    "[data-open-my-info]"
  );

const accountCurrentTime =
  document.getElementById(
    "accountCurrentTime"
  );

const timezoneButtons =
  document.querySelectorAll(
    ".timezone-button"
  );


let accountTimezone =
  "Asia/Seoul";


/* =========================================================
   OPEN / CLOSE
========================================================= */

function openAccountPanel() {

  if (!accountPanel) return;

  accountPanel.classList.remove(
    "hidden"
  );


  /* 1650 이하 햄버거 메뉴 열려있으면 닫기 */
  const headerUtilityMenu =
    document.getElementById(
      "headerUtilityMenu"
    );

  headerUtilityMenu?.classList.add(
    "hidden"
  );


  const headerUtilityToggle =
    document.getElementById(
      "headerUtilityToggle"
    );

  headerUtilityToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

}


function closeAccountPanel() {

  accountPanel?.classList.add(
    "hidden"
  );

}


accountOpenButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        if (!accountPanel) return;


        const isOpen =
          !accountPanel.classList.contains(
            "hidden"
          );


        if (isOpen) {

          closeAccountPanel();

        } else {

          openAccountPanel();

        }

      }
    );

  }
);


/* 바깥 클릭 */
document.addEventListener(
  "click",
  (event) => {

    if (!accountPanel) return;


    const clickedOpenButton =
      [...accountOpenButtons].some(
        (button) =>
          button.contains(
            event.target
          )
      );


    if (
      !accountPanel.contains(
        event.target
      ) &&
      !clickedOpenButton
    ) {

      closeAccountPanel();

    }

  }
);


/* ESC */
document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeAccountPanel();
    }

  }
);

/* =========================================================
   USER MENU
   Desktop + 1650 Compact
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const userMenu =
    document.getElementById("userMenu");

  const userMenuToggle =
    document.getElementById("userMenuToggle");

  const headerUtilityToggle =
    document.getElementById("headerUtilityToggle");

  const accountCurrentTime =
    document.getElementById("accountCurrentTime");

  const timezoneButtons =
    document.querySelectorAll(".timezone-button");


  let accountTimezone = "Asia/Seoul";


  /* =========================================================
     TRIGGERS
  ========================================================= */

  const userMenuTriggers = [
    userMenuToggle,
    headerUtilityToggle
  ].filter(Boolean);


  /* =========================================================
     OPEN
  ========================================================= */

  function openUserMenu(trigger) {

    if (!userMenu) return;

    userMenu.classList.remove("hidden");


    userMenuTriggers.forEach((button) => {

      button.setAttribute(
        "aria-expanded",
        button === trigger ? "true" : "false"
      );

    });

  }


  /* =========================================================
     CLOSE
  ========================================================= */

  function closeUserMenu() {

    if (!userMenu) return;

    userMenu.classList.add("hidden");


    userMenuTriggers.forEach((button) => {

      button.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  }


  /* =========================================================
     TOGGLE
  ========================================================= */

  userMenuTriggers.forEach((button) => {

    button.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();


      if (!userMenu) return;


      const isOpen =
        !userMenu.classList.contains("hidden");


      if (isOpen) {

        closeUserMenu();

      } else {

        openUserMenu(button);

      }

    });

  });


  /* =========================================================
     PANEL CLICK
  ========================================================= */

  userMenu?.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

    }
  );


  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  document.addEventListener(
    "click",
    (event) => {

      if (!userMenu) return;


      const clickedTrigger =
        userMenuTriggers.some(
          (button) =>
            button.contains(event.target)
        );


      if (
        !userMenu.contains(event.target) &&
        !clickedTrigger
      ) {

        closeUserMenu();

      }

    }
  );


  /* =========================================================
     ESC
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeUserMenu();

      }

    }
  );


  /* =========================================================
     CURRENT TIME
  ========================================================= */

  function updateAccountTime() {

    if (!accountCurrentTime) return;


    const now = new Date();


    const formatter =
      new Intl.DateTimeFormat(
        "sv-SE",
        {
          timeZone: accountTimezone,

          year: "numeric",
          month: "2-digit",
          day: "2-digit",

          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",

          hour12: false
        }
      );


    accountCurrentTime.textContent =
      formatter.format(now);

  }


  updateAccountTime();


  setInterval(
    updateAccountTime,
    1000
  );


  /* =========================================================
     TIMEZONE
  ========================================================= */

  timezoneButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();


        accountTimezone =
          button.dataset.timezone;


        timezoneButtons.forEach((item) => {

          item.classList.remove(
            "active",
            "bg-white",
            "text-[#142A4D]"
          );

          item.classList.add(
            "bg-[#476187]",
            "text-[#CBD6EA]"
          );

        });


        button.classList.remove(
          "bg-[#476187]",
          "text-[#CBD6EA]"
        );

        button.classList.add(
          "active",
          "bg-white",
          "text-[#142A4D]"
        );


        updateAccountTime();

      }
    );

  });

});

/* =========================================================
   DETAIL ACCORDION
========================================================= */

const detailAccordionButtons =
  document.querySelectorAll(
    ".detail-accordion-toggle"
  );


detailAccordionButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const section =
      button.closest("section");

    const content =
      section?.querySelector(
        ".detail-accordion-content"
      );

    const icon =
      button.querySelector(
        ".detail-accordion-icon"
      );


    if (!content) return;


    const isOpen =
      !content.classList.contains(
        "hidden"
      );


    if (isOpen) {

      content.classList.add("hidden");

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      icon?.classList.add(
        "rotate-180"
      );

    } else {

      content.classList.remove("hidden");

      button.setAttribute(
        "aria-expanded",
        "true"
      );

      icon?.classList.remove(
        "rotate-180"
      );

    }

  });

});


/* =========================================================
   API URL COPY
========================================================= */

const requestApiCopy =
  document.getElementById(
    "requestApiCopy"
  );

const requestApiUrl =
  document.getElementById(
    "requestApiUrl"
  );


requestApiCopy?.addEventListener(
  "click",
  async () => {

    if (!requestApiUrl) return;


    const text =
      requestApiUrl.textContent.trim();


    try {

      await navigator.clipboard.writeText(
        text
      );


      requestApiCopy.textContent =
        "복사됨";


      setTimeout(() => {

        requestApiCopy.textContent =
          "복사";

      }, 1200);

    } catch (error) {

      console.error(
        "복사 실패:",
        error
      );

    }

  }
);

// =====================================================
// OPEN API DETAIL TAB
// 상세기능 / 보관기관
// =====================================================
const detailTabButton = document.getElementById("detailTabButton");
const retentionTabButton = document.getElementById("retentionTabButton");

const detailTabPanel = document.getElementById("detailTabPanel");
const retentionTabPanel = document.getElementById("retentionTabPanel");

const setDetailTab = (tab) => {
  const isDetail = tab === "detail";

  // 콘텐츠
  detailTabPanel?.classList.toggle("hidden", !isDetail);
  retentionTabPanel?.classList.toggle("hidden", isDetail);

  // 상세기능 버튼
  detailTabButton?.classList.toggle("bg-[#0061F0]", isDetail);
  detailTabButton?.classList.toggle("text-white", isDetail);

  detailTabButton?.classList.toggle("bg-white", !isDetail);
  detailTabButton?.classList.toggle("text-[#99ABC6]", !isDetail);
  detailTabButton?.classList.toggle("border-x", !isDetail);
  detailTabButton?.classList.toggle("border-t", !isDetail);
  detailTabButton?.classList.toggle("border-[#99ABC6]", !isDetail);

  // 보관기관 버튼
  retentionTabButton?.classList.toggle("bg-[#0061F0]", !isDetail);
  retentionTabButton?.classList.toggle("text-white", !isDetail);

  retentionTabButton?.classList.toggle("bg-white", isDetail);
  retentionTabButton?.classList.toggle("text-[#99ABC6]", isDetail);
  retentionTabButton?.classList.toggle("border-x", isDetail);
  retentionTabButton?.classList.toggle("border-t", isDetail);
  retentionTabButton?.classList.toggle("border-[#99ABC6]", isDetail);
};

detailTabButton?.addEventListener("click", () => {
  setDetailTab("detail");
});

retentionTabButton?.addEventListener("click", () => {
  setDetailTab("retention");
});

/* =========================================================
   FILE DETAIL TAB
   파일데이터 / 보관기관
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const fileDataTabButton =
    document.getElementById("fileDataTabButton");

  const fileRetentionTabButton =
    document.getElementById("fileRetentionTabButton");

  const fileDataTabPanel =
    document.getElementById("fileDataTabPanel");

  const fileRetentionTabPanel =
    document.getElementById("fileRetentionTabPanel");


  /* 이 구조가 없는 페이지에서는 아무것도 실행하지 않음 */
  if (
    !fileDataTabButton ||
    !fileRetentionTabButton ||
    !fileDataTabPanel ||
    !fileRetentionTabPanel
  ) {
    return;
  }


  const activeClasses = [
    "bg-[#0061F0]",
    "text-white"
  ];

  const inactiveClasses = [
    "border-x",
    "border-t",
    "border-[#99ABC6]",
    "bg-white",
    "text-[#99ABC6]"
  ];


  function setTabButtonState(
    button,
    isActive
  ) {

    button.classList.remove(
      ...activeClasses,
      ...inactiveClasses
    );


    if (isActive) {

      button.classList.add(
        ...activeClasses
      );

    } else {

      button.classList.add(
        ...inactiveClasses
      );

    }

  }


  function setFileDetailTab(tab) {

    const isFileData =
      tab === "file";


    /* CONTENT */
    fileDataTabPanel.classList.toggle(
      "hidden",
      !isFileData
    );

    fileRetentionTabPanel.classList.toggle(
      "hidden",
      isFileData
    );


    /* TAB STYLE */
    setTabButtonState(
      fileDataTabButton,
      isFileData
    );

    setTabButtonState(
      fileRetentionTabButton,
      !isFileData
    );

  }


  fileDataTabButton.addEventListener(
    "click",
    () => {

      setFileDetailTab("file");

    }
  );


  fileRetentionTabButton.addEventListener(
    "click",
    () => {

      setFileDetailTab("retention");

    }
  );


  /* 초기 상태 */
  setFileDetailTab("file");

});

/* =========================================================
   GEOJSON + API DETAIL TAB
   파일데이터 / 오픈 API
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const fileButton =
    document.getElementById("geoFileTabButton");

  const apiButton =
    document.getElementById("geoApiTabButton");

  const filePanel =
    document.getElementById("geoFileTabPanel");

  const apiPanel =
    document.getElementById("geoApiTabPanel");


  if (
    !fileButton ||
    !apiButton ||
    !filePanel ||
    !apiPanel
  ) {
    return;
  }


  const setButtonState = (
    button,
    isActive
  ) => {

    button.classList.remove(
      "bg-[#0061F0]",
      "text-white",
      "border-x",
      "border-t",
      "border-[#99ABC6]",
      "bg-white",
      "text-[#99ABC6]"
    );


    if (isActive) {

      button.classList.add(
        "bg-[#0061F0]",
        "text-white"
      );

    } else {

      button.classList.add(
        "border-x",
        "border-t",
        "border-[#99ABC6]",
        "bg-white",
        "text-[#99ABC6]"
      );

    }

  };


  const changeGeoDetailTab = (tab) => {

    const isFile =
      tab === "file";


    /* CONTENT */
    filePanel.classList.toggle(
      "hidden",
      !isFile
    );

    apiPanel.classList.toggle(
      "hidden",
      isFile
    );


    /* BUTTON */
    setButtonState(
      fileButton,
      isFile
    );

    setButtonState(
      apiButton,
      !isFile
    );


    /* 탭 변경 시 콘텐츠 스크롤 맨 위 */
    const scrollArea =
      document.getElementById(
        "detailScrollArea"
      );

    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }

  };


  fileButton.addEventListener(
    "click",
    () => {
      changeGeoDetailTab("file");
    }
  );


  apiButton.addEventListener(
    "click",
    () => {
      changeGeoDetailTab("api");
    }
  );


  /* 초기 */
  changeGeoDetailTab("file");

});

/* =========================================================
   DATA REQUEST LIST
   전체 목록 / 내 신청 보기
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const allPanel =
    document.getElementById("allRequestPanel");

  const myPanel =
    document.getElementById("myRequestPanel");

  const showMyButton =
    document.getElementById("showMyRequestButton");

  const showAllButton =
    document.getElementById("showAllRequestButton");


  if (
    !allPanel ||
    !myPanel ||
    !showMyButton ||
    !showAllButton
  ) {
    return;
  }


  /* 내 신청 보기 */
  showMyButton.addEventListener("click", () => {

    allPanel.classList.add("hidden");
    myPanel.classList.remove("hidden");

  });


  /* 전체 목록 보기 */
  showAllButton.addEventListener("click", () => {

    myPanel.classList.add("hidden");
    allPanel.classList.remove("hidden");

  });

});

/* =========================================================
   COMMON CUSTOM DROPDOWN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const dropdowns =
    document.querySelectorAll("[data-custom-dropdown]");


  dropdowns.forEach((dropdown) => {

    const trigger =
      dropdown.querySelector(".custom-dropdown-trigger");

    const menu =
      dropdown.querySelector(".custom-dropdown-menu");

    const label =
      dropdown.querySelector(".custom-dropdown-label");

    const icon =
      dropdown.querySelector(".custom-dropdown-icon");

    const valueInput =
      dropdown.querySelector(".custom-dropdown-value");

    const options =
      dropdown.querySelectorAll(".custom-dropdown-option");


    if (
      !trigger ||
      !menu ||
      !label
    ) {
      return;
    }


    /* -----------------------------------------
       OPEN / CLOSE
    ------------------------------------------ */
    const setOpen = (isOpen) => {

      menu.classList.toggle(
        "hidden",
        !isOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      if (icon) {
        icon.classList.toggle(
          "rotate-180",
          isOpen
        );
      }

    };


    /* Trigger */
    trigger.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        const isOpen =
          trigger.getAttribute(
            "aria-expanded"
          ) === "true";


        /* 다른 드롭다운 모두 닫기 */
        document
          .querySelectorAll("[data-custom-dropdown]")
          .forEach((otherDropdown) => {

            if (otherDropdown === dropdown) {
              return;
            }

            const otherMenu =
              otherDropdown.querySelector(
                ".custom-dropdown-menu"
              );

            const otherTrigger =
              otherDropdown.querySelector(
                ".custom-dropdown-trigger"
              );

            const otherIcon =
              otherDropdown.querySelector(
                ".custom-dropdown-icon"
              );


            otherMenu?.classList.add("hidden");

            otherTrigger?.setAttribute(
              "aria-expanded",
              "false"
            );

            otherIcon?.classList.remove(
              "rotate-180"
            );

          });


        setOpen(!isOpen);

      }
    );


    /* -----------------------------------------
       OPTION
    ------------------------------------------ */
    options.forEach((option) => {

      option.addEventListener(
        "click",
        () => {

          const optionValue =
            option.dataset.value ?? "";

          const optionText =
            option.textContent.trim();


          /* label */
          label.textContent =
            optionText;


          /* hidden value */
          if (valueInput) {
            valueInput.value =
              optionValue;
          }


          /* reset */
          options.forEach((item) => {

            item.classList.remove(
              "selected",
              "bg-[#E1E7F2]",
              "font-semibold"
            );

            item.classList.add(
              "bg-white",
              "font-normal"
            );

          });


          /* selected */
          option.classList.remove(
            "bg-white",
            "font-normal"
          );

          option.classList.add(
            "selected",
            "bg-[#E1E7F2]",
            "font-semibold"
          );


          setOpen(false);

        }
      );

    });


    /* -----------------------------------------
       외부 클릭
    ------------------------------------------ */
    document.addEventListener(
      "click",
      (event) => {

        if (!dropdown.contains(event.target)) {
          setOpen(false);
        }

      }
    );

  });


  /* ESC */
  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }

      dropdowns.forEach((dropdown) => {

        dropdown
          .querySelector(".custom-dropdown-menu")
          ?.classList.add("hidden");

        dropdown
          .querySelector(".custom-dropdown-trigger")
          ?.setAttribute(
            "aria-expanded",
            "false"
          );

        dropdown
          .querySelector(".custom-dropdown-icon")
          ?.classList.remove(
            "rotate-180"
          );

      });

    }
  );

});


/* =========================================================
   DATA REQUEST FORM
   필수 약관 동의 -> 제공신청 버튼 활성화
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const requiredAgreements =
    document.querySelectorAll(".agreement-required");

  const submitButton =
    document.getElementById("requestSubmitButton");


  /* 이 페이지가 아니면 실행하지 않음 */
  if (
    !requiredAgreements.length ||
    !submitButton
  ) {
    return;
  }


  const updateSubmitButton = () => {

    const allChecked =
      Array.from(requiredAgreements)
        .every((checkbox) => checkbox.checked);


    submitButton.disabled =
      !allChecked;


    if (allChecked) {

      /* 활성 */
      submitButton.classList.remove(
        "bg-[#99ABC6]",
        "cursor-not-allowed"
      );

      submitButton.classList.add(
        "bg-[#0061F0]",
        "cursor-pointer",
        "hover:bg-[#0046AD]"
      );

    } else {

      /* 비활성 */
      submitButton.classList.remove(
        "bg-[#0061F0]",
        "cursor-pointer",
        "hover:bg-[#0046AD]"
      );

      submitButton.classList.add(
        "bg-[#99ABC6]",
        "cursor-not-allowed"
      );

    }

  };


  requiredAgreements.forEach((checkbox) => {

    checkbox.addEventListener(
      "change",
      updateSubmitButton
    );

  });


  /* 초기 상태 */
  updateSubmitButton();

});

/* =========================================================
   STANDARDIZATION PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const tabs =
    document.querySelectorAll("[data-standard-tab]");

  const tableWrap =
    document.getElementById("standardTableWrap");

  const totalCount =
    document.getElementById("standardTotalCount");

  const pagination =
    document.getElementById("standardPagination");

  const catalogSubTabs =
    document.getElementById("catalogSubTabs");


  if (!tabs.length || !tableWrap || !totalCount) {
    return;
  }


  /* =====================================================
     BADGE HELPERS
  ====================================================== */

  const useBadge = (value = "Y") => `
    <span
      class="
        inline-flex h-7 min-w-7
        items-center justify-center
        rounded-full
        bg-[#0061F0]
        px-2
        text-sm font-semibold
        text-white
      "
    >
      ${value}
    </span>
  `;


  const levelBadge = (value = "정보시스템") => `
    <span
      class="
        inline-flex
        whitespace-nowrap
        rounded-full
        bg-[#476187]
        px-3 py-1
        text-sm font-semibold
        text-white
      "
    >
      ${value}
    </span>
  `;


  const requiredBadge = (required = true) => {

    if (required) {
      return `
        <span
          class="
            inline-flex
            rounded-full
            bg-[#0061F0]
            px-3 py-1
            text-sm font-semibold
            text-white
          "
        >
          필수
        </span>
      `;
    }

    return `
      <span
        class="
          inline-flex
          rounded-full
          bg-[#E1E1E1]
          px-3 py-1
          text-sm font-semibold
          text-[#555555]
        "
      >
        자체
      </span>
    `;
  };

  function createFieldFilterLabel() {

    return `
      <div class="standard-filter-label">
        <i
          data-lucide="filter"
          class="h-5 w-5 shrink-0"
        ></i>

        <span>필드 필터</span>
      </div>
    `;

  }


  /* =====================================================
     DATA
  ====================================================== */

  const standardData = {

    /* ---------------------------------------------------
       표준용어
    ---------------------------------------------------- */
    term: {

      count: "14,919",

      headers: [
        "NO",
        "용어명",
        "영문용어",
        "도메인",
        "설명",
        "허용값",
        "저장형식",
        "표현형식",
        "소관기관",
        "사용",
        "출처"
      ],

      widths: [
        "6%",
        "9%",
        "10%",
        "8%",
        "20%",
        "10%",
        "16%",
        "16%",
        "9%",
        "6%",
        "8%"
      ],

      filter: `
        <tr class="bg-[#E1E7F2]">
          <td colspan="11" class="px-3 py-2">
            <div class="flex items-center gap-3">

              ${createFieldFilterLabel()}

              <input
                type="text"
                placeholder="용어명"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <input
                type="text"
                placeholder="영문용어"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <input
                type="text"
                placeholder="도메인"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <div class="w-[204px] shrink-0">
                ${createFilterDropdown(
                  "사용 전체",
                  ["사용 전체", "Y", "N"]
                )}
              </div>

              <input
                type="text"
                placeholder="행안부"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <button
              type="button"
              class="
                standard-filter-reset
                flex shrink-0
                items-center gap-1
                whitespace-nowrap
                text-sm font-semibold
                text-[#99ABC6]
                cursor-not-allowed
              "
              disabled
            >
              필터 해제
            </button>

            </div>
          </td>
        </tr>
      `,

      
      rows: [
        [
          "",
          "1회투여량",
          "SGLDS",
          "수 N15, 4",
          "약물이나 주사제 동일 한번에 몸에 투여되는 양",
          "",
          "999999999999.9999",
          "999999999999.9999",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API명",
          "API_NM",
          "명V3000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스의 이름",
          "",
          "300자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API 사용여부",
          "API_USE_YN",
          "여부C1",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스의 이용",
          "Y : 예(예), N : 부(아니오)",
          "1자리 문자",
          "Y or N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "4000자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CAS번호",
          "CAS_NO",
          "번호V20",
          "CAS, 화학적 동질성을 갖는 물질에 대하여 미국 화학회에서 부여한 고유 번호",
          "",
          "20자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "50자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "4000자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "4000자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "4000자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API설명",
          "API_EXPLN",
          "내용V4000",
          "운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스에 대한 설명",
          "",
          "4000자리 이내 문자",
          "",
          "",
          useBadge(),
          "행안부"
        ]
      ]

    },


    /* ---------------------------------------------------
       표준단어
    ---------------------------------------------------- */
    word: {

      count: "3,661",

      headers: [
        "NO",
        "단어명",
        "영문약어",
        "영문명",
        "설명",
        "형식단어",
        "도메인 분류",
        "사용",
        "출처"
      ],

      widths: [
        "6%",
        "10%",
        "11%",
        "13%",
        "30%",
        "8%",
        "10%",
        "6%",
        "8%"
      ],

      filter: `
        <tr class="bg-[#E1E7F2]">
          <td colspan="9" class="px-3 py-2">
            <div class="flex items-center gap-3">

              ${createFieldFilterLabel()}

              <input
                type="text"
                placeholder="단어명"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <input
                type="text"
                placeholder="영문"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <input
                type="text"
                placeholder="도메인 분류"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <div class="w-[204px] shrink-0">
                ${createFilterDropdown(
                  "사용 전체",
                  ["사용 전체", "Y", "N"]
                )}
              </div>

              <input
                type="text"
                placeholder="출처"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <button
              type="button"
              class="
                standard-filter-reset
                flex shrink-0
                items-center gap-1
                whitespace-nowrap
                text-sm font-semibold
                text-[#99ABC6]
                cursor-not-allowed
              "
              disabled
            >
              필터 해제
            </button>

            </div>
          </td>
        </tr>
      `,

      rows: [
        [
          "",
          "1회투여량",
          "SGLDS",
          "Single Dose",
          "一回投與量, 한 번에 약물이나 주사 등이 몸에 투여되는 구체적인 양",
          "Y",
          "수",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "API",
          "API",
          "Application Programming Interface",
          "API. 운영 체제, 프로그래밍 언어 등에 있는 라이브러리를 응용 프로그램 개발 시 이용할 수 있도록 규칙들을 정의해 놓은 인터페이스",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CAS",
          "CAS",
          "Chemical Abstract Service",
          "CAS. 화학적 동질성을 갖는 물질에 대하여 미국 화학회에서 부여한 고유 번호",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "CCTV",
          "CCTV",
          "Closed-Circuit Television",
          "CCTV. 특정 수신자를 대상으로 화상을 전송하는 텔레비전 방식",
          "N",
          "",
          useBadge(),
          "행안부"
        ]
      ]

    },


    /* ---------------------------------------------------
       표준도메인
    ---------------------------------------------------- */
    domain: {

      count: "338",

      headers: [
        "NO",
        "그룹",
        "분류",
        "도메인명",
        "설명",
        "데이터타입",
        "길이",
        "저장형식",
        "표현형식",
        "사용",
        "출처"
      ],

      widths: [
        "5%",
        "8%",
        "8%",
        "9%",
        "25%",
        "10%",
        "6%",
        "13%",
        "13%",
        "5%",
        "7%"
      ],

      filter: `
      <tr class="bg-[#E1E7F2]">
        <td colspan="11" class="px-3 py-2">
          <div class="flex items-center gap-3">

            ${createFieldFilterLabel()}

            <input
              type="text"
              placeholder="도메인명"
              class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
            />

            <input
              type="text"
              placeholder="그룹"
              class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
            />

            <input
              type="text"
              placeholder="데이터 타입"
              class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
            />

            <div class="w-[204px] shrink-0">
              ${createFilterDropdown(
                "사용 전체",
                ["사용 전체", "Y", "N"]
              )}
            </div>

            <input
              type="text"
              placeholder="출처"
              class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
            />

            <button
              type="button"
              class="
                standard-filter-reset
                flex shrink-0
                items-center gap-1
                whitespace-nowrap
                text-sm font-semibold
                text-[#99ABC6]
                cursor-not-allowed
              "
              disabled
            >
              필터 해제
            </button>

          </div>
        </td>
      </tr>
    `,

      rows: [
        [
          "",
          "금액",
          "가격",
          "가격N10",
          "물건이 지니고 있는 가치를 돈으로 나타낸 것",
          "NUMERIC",
          "10",
          "9999999999",
          "9999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "가격N15",
          "물건이 지니고 있는 가치를 돈으로 나타낸 것",
          "NUMERIC",
          "15",
          "999999999999999",
          "999999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N13",
          "돈의 액수",
          "NUMERIC",
          "13",
          "9999999999999",
          "9999999999999",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "금액N22,2",
          "돈의 액수",
          "NUMERIC",
          "22",
          "99999999999999999999.99",
          "99999999999999999999.99",
          useBadge(),
          "행안부"
        ],

        [
          "",
          "금액",
          "가격",
          "비용N15",
          "어떤 일을 하는 데 드는 돈",
          "NUMERIC",
          "15",
          "999999999999999",
          "999999999999999",
          useBadge(),
          "행안부"
        ]
      ]

    },


    /* ---------------------------------------------------
       표준코드
    ---------------------------------------------------- */
    code: {

      count: "160",

      headers: [
        "NO",
        "코드유형",
        "코드",
        "코드 설명"
      ],

      widths: [
        "10%",
        "45%",
        "16%",
        "29%"
      ],

      filter: `
        <tr class="bg-[#E1E7F2]">
          <td colspan="4" class="px-3 py-2">
            <div class="flex items-center gap-3">

              ${createFieldFilterLabel()}

              <input
                type="text"
                placeholder="코드유형"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <input
                type="text"
                placeholder="코드값"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <button
              type="button"
              class="
                standard-filter-reset
                flex shrink-0
                items-center gap-1
                whitespace-nowrap
                text-sm font-semibold
                text-[#99ABC6]
                cursor-not-allowed
              "
              disabled
            >
              필터 해제
            </button>

            </div>
          </td>
        </tr>
      `,

      rows: [
        ["1", "데이터 수집 구분", "F", "파일 데이터"],
        ["2", "데이터 수집 구분", "P", "PC용 프로그램"],
        ["3", "DB형태", "01", "정형"],
        ["4", "DB형태", "02", "비정형"],
        ["5", "비정형 데이터 유형", "03", "텍스트"],
        ["6", "비정형 데이터 유형", "04", "이미지"],
        ["7", "비정형 데이터 유형", "05", "문서"],
        ["8", "비정형 데이터 유형", "06", "음성"],
        ["9", "비정형 데이터 유형", "07", "영상"],
        ["10", "비정형 데이터 유형", "08", "센서(IoT)"]
      ]

    },


    /* ---------------------------------------------------
       메타항목정의
    ---------------------------------------------------- */
    meta: {

      count: "51",

      headers: [
        "계층",
        "번호",
        "관리항목",
        "가이드열",
        "형식",
        "크기",
        "필수/선택",
        "입력방식",
        "작성요령 및 검증기준",
        "해경 적용 예시"
      ],

      widths: [
        "10%",
        "6%",
        "11%",
        "9%",
        "8%",
        "7%",
        "9%",
        "10%",
        "21%",
        "14%"
      ],

      filter: `
        <tr class="bg-[#E1E7F2]">
          <td colspan="10" class="px-3 py-2">
            <div class="flex items-center gap-3">

              ${createFieldFilterLabel()}

              <input
                type="text"
                placeholder="관리항목"
                class="standard-filter-input h-[36px] w-[204px] shrink-0 rounded border border-[#99ABC6] bg-white px-3 text-base outline-none"
              />

              <div class="w-[204px] shrink-0">
                ${createFilterDropdown(
                  "계층전체",
                  ["계층전체", "정보시스템", "데이터베이스", "테이블", "컬럼"]
                )}
              </div>

              <div class="w-[204px] shrink-0">
                ${createFilterDropdown(
                  "필수여부 전체",
                  ["필수여부 전체", "필수", "자체"]
                )}
              </div>

              <button
              type="button"
              class="
                standard-filter-reset
                flex shrink-0
                items-center gap-1
                whitespace-nowrap
                text-sm font-semibold
                text-[#99ABC6]
                cursor-not-allowed
              "
              disabled
            >
              필터 해제
            </button>

            </div>
          </td>
        </tr>
      `,

      rows: [
        [
          levelBadge(),
          "1",
          "가격",
          "B",
          "문자형",
          "1~2",
          requiredBadge(true),
          "코드",
          "파일 F / 프로그램 P",
          "F"
        ],

        [
          levelBadge(),
          "2",
          "기관명",
          "C",
          "문자형",
          "-",
          requiredBadge(true),
          "텍스트",
          "운영·관리 기관명, 행정표준코드 기준(유어 불가)",
          "해양경찰청"
        ],

        [
          levelBadge(),
          "3",
          "정보시스템명",
          "D",
          "문자형",
          "500",
          requiredBadge(true),
          "텍스트",
          "IRM(정보자원관리시스템) 등록명과 매핑",
          "AI기반 불법조업 탐지·차단 플랫폼"
        ],

        [
          levelBadge(),
          "4",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "5",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "6",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "7",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "8",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "9",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ],

        [
          levelBadge(),
          "10",
          "기관코드",
          "- (자체)",
          "문자형",
          "12",
          requiredBadge(false),
          "코드",
          "행정표준코드 기관코드(내부 관리)",
          "1532000"
        ]
      ]

    },


    /* ---------------------------------------------------
       카탈로그
    ---------------------------------------------------- */
    catalog: {

      count: "0",

      headers: [
        "계층",
        "한글명",
        "영문명",
        "핵심 속성",
        "상위",
        "출처"
      ],

      widths: [
        "10%",
        "18%",
        "20%",
        "20%",
        "12%",
        "12%"
      ],

      filter: "",

      rows: []

    }

  };


  /* =====================================================
     FILTER DROPDOWN HTML
  ====================================================== */

  function createFilterDropdown(
    label,
    values
  ) {

    return `
      <div
        class="
          standard-filter-dropdown
          relative
        "
        data-std-dropdown
        data-filter-default="${label}"
      >

        <button
          type="button"
          class="
            std-dropdown-trigger
            flex h-[36px]
            w-full
            items-center
            rounded
            border border-[#99ABC6]
            bg-white
            px-3
            text-left
            text-sm
            text-black
          "
          aria-expanded="false"
        >

          <span
            class="
              std-dropdown-label
              min-w-0 flex-1
              truncate
            "
          >
            ${label}
          </span>

          <i
            data-lucide="chevron-down"
            class="
              std-dropdown-icon
              h-4 w-4
              shrink-0
              transition-transform
            "
          ></i>

        </button>


        <div
          class="
            std-dropdown-menu
            absolute
            left-0 top-[43px]
            z-[80]
            hidden
            w-full
            overflow-hidden
            rounded
            border border-[#CDD6E8]
            bg-white
            shadow-[0_8px_16px_rgba(20,42,77,0.22)]
          "
        >

          ${values.map((value, index) => `
            <button
              type="button"
              data-value="${value}"
              class="
                std-dropdown-option
                flex h-[42px]
                w-full
                items-center
                ${index === 0
                  ? "bg-[#E1E7F2] font-semibold"
                  : "border-t border-[#CDD6E8] bg-white"
                }
                px-3
                text-left
                text-sm
                text-black
                hover:bg-[#F2F6FF]
              "
            >
              ${value}
            </button>
          `).join("")}

        </div>

      </div>
    `;
  }


  /* =====================================================
     TABLE RENDER
  ====================================================== */

  function renderStandardTable(type) {

    const data =
      standardData[type];

    if (!data) {
      return;
    }

    const sortButton =
  document.getElementById("standardSortButton");

    const countButton =
      document.getElementById("standardCountButton");

    const isEmpty =
      data.rows.length === 0;


    /* 데이터가 없으면 정렬 / 개수 비활성화 */
    [sortButton, countButton].forEach((button) => {

      if (!button) return;

      button.disabled = isEmpty;

      button.classList.toggle(
        "cursor-not-allowed",
        isEmpty
      );

      button.classList.toggle(
        "text-[#99ABC6]",
        isEmpty
      );

      button.classList.toggle(
        "bg-[#F2F6FF]",
        isEmpty
      );

      button.classList.toggle(
        "text-black",
        !isEmpty
      );

      button.classList.toggle(
        "bg-white",
        !isEmpty
      );

    });

    totalCount.textContent =
      `총 ${data.count}건`;


    /* catalog */
    if (type === "catalog") {

      catalogSubTabs?.classList.remove("hidden");

      pagination?.classList.add("hidden");

    } else {

      catalogSubTabs?.classList.add("hidden");

      pagination?.classList.remove("hidden");

    }


    const colgroup =
      data.widths.map(width => `
        <col style="width:${width}">
      `).join("");


    const header =
    data.headers.map((header, index) => `
      <th
        class="
          px-3 py-3
          text-left
          text-base font-semibold
          text-white
          ${index === 0 ? "rounded-tl" : ""}
          ${index === data.headers.length - 1 ? "rounded-tr" : ""}
        "
      >
        ${header}
      </th>
    `).join("");


    let body = "";


    if (data.rows.length === 0) {

      body = `
        <tr>
          <td
            colspan="${data.headers.length}"
            class="
              h-[78px]
              border-b border-[#CDD6E8]
              text-center
              text-base
              text-black
            "
          >
            등록된 메타데이터가 없습니다.
          </td>
        </tr>
      `;

    } else {

      body =
        data.rows.map(row => `
          <tr
            class="
              border-b
              border-[#CDD6E8]
            "
          >

            ${row.map(cell => `
              <td
                class="
                  px-3 py-3
                  align-middle
                  text-base
                  leading-5
                  text-black
                "
              >
                ${cell ?? ""}
              </td>
            `).join("")}

          </tr>
        `).join("");

    }


    tableWrap.innerHTML = `
      <div
        class="
          w-full
          overflow-visible
        "
      >

        <table
          class="
            w-full
            table-fixed
            border-collapse
          "
        >

          <colgroup>
            ${colgroup}
          </colgroup>


          <thead>

            <tr
              class="
                bg-[#142A4D]
              "
            >
              ${header}
            </tr>

            ${data.filter}

          </thead>


          <tbody>
            ${body}
          </tbody>

        </table>

      </div>
    `;


    bindStandardDropdowns();

    bindStandardFilterReset();

    lucide.createIcons();

  }


  /* =====================================================
     MAIN TAB
  ====================================================== */

  function setActiveTab(type) {

    tabs.forEach(tab => {

      const active =
        tab.dataset.standardTab === type;

      tab.classList.toggle(
        "active",
        active
      );

    });


    renderStandardTable(type);

  }


  tabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        setActiveTab(
          tab.dataset.standardTab
        );

      }
    );

  });


  /* =====================================================
     CATALOG SUB TAB
  ====================================================== */

  document
    .querySelectorAll(".catalog-sub-tab")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".catalog-sub-tab")
            .forEach(item => {
              item.classList.remove("active");
            });

          button.classList.add("active");

        }
      );

    });


  /* =====================================================
     DROPDOWN
  ====================================================== */

  function closeAllStdDropdowns() {

    document
      .querySelectorAll("[data-std-dropdown]")
      .forEach(dropdown => {

        dropdown
          .querySelector(".std-dropdown-menu")
          ?.classList.add("hidden");

        dropdown
          .querySelector(".std-dropdown-trigger")
          ?.setAttribute(
            "aria-expanded",
            "false"
          );

        dropdown
          .querySelector(".std-dropdown-icon")
          ?.classList.remove(
            "rotate-180"
          );

      });

  }


  function bindStandardDropdowns() {

    document
      .querySelectorAll("[data-std-dropdown]")
      .forEach(dropdown => {

        if (dropdown.dataset.bound === "true") {
          return;
        }

        dropdown.dataset.bound = "true";


        const trigger =
          dropdown.querySelector(
            ".std-dropdown-trigger"
          );

        const menu =
          dropdown.querySelector(
            ".std-dropdown-menu"
          );

        const label =
          dropdown.querySelector(
            ".std-dropdown-label"
          );

        const icon =
          dropdown.querySelector(
            ".std-dropdown-icon"
          );


        if (!trigger || !menu) {
          return;
        }


        trigger.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            const isOpen =
              !menu.classList.contains(
                "hidden"
              );


            closeAllStdDropdowns();


            if (!isOpen) {

              menu.classList.remove(
                "hidden"
              );

              trigger.setAttribute(
                "aria-expanded",
                "true"
              );

              icon?.classList.add(
                "rotate-180"
              );

            }

          }
        );


        menu
          .querySelectorAll(
            ".std-dropdown-option"
          )
          .forEach(option => {

            option.addEventListener(
              "click",
              event => {

                event.stopPropagation();


                if (label) {
                  label.textContent =
                    option.textContent.trim();
                }


                menu
                  .querySelectorAll(
                    ".std-dropdown-option"
                  )
                  .forEach(item => {

                    item.classList.remove(
                      "bg-[#E1E7F2]",
                      "font-semibold"
                    );

                    item.classList.add(
                      "bg-white",
                      "font-normal"
                    );

                  });


                option.classList.remove(
                  "bg-white",
                  "font-normal"
                );

                option.classList.add(
                  "bg-[#E1E7F2]",
                  "font-semibold"
                );

                closeAllStdDropdowns();

                updateStandardFilterResetButton();

              }
            );

          });

      });

  }

  /* =====================================================
   STANDARD FILTER RESET
===================================================== */

function updateStandardFilterResetButton() {

  const resetButton =
    tableWrap.querySelector(".standard-filter-reset");

  if (!resetButton) return;


  /* 입력창 중 하나라도 값이 있는지 */
  const hasInputValue =
    Array.from(
      tableWrap.querySelectorAll(".standard-filter-input")
    ).some((input) => {
      return input.value.trim() !== "";
    });


  /* 드롭다운이 기본값에서 변경됐는지 */
  const hasDropdownValue =
    Array.from(
      tableWrap.querySelectorAll("[data-filter-default]")
    ).some((dropdown) => {

      const defaultValue =
        dropdown.dataset.filterDefault;

      const currentValue =
        dropdown
          .querySelector(".std-dropdown-label")
          ?.textContent
          .trim();

      return currentValue !== defaultValue;

    });


  const isActive =
    hasInputValue || hasDropdownValue;


  resetButton.disabled = !isActive;


  if (isActive) {

    /* 활성 */
    resetButton.classList.remove(
      "text-[#99ABC6]",
      "cursor-not-allowed"
    );

    resetButton.classList.add(
      "text-[#476187]",
      "cursor-pointer"
    );

  } else {

    /* 비활성 */
    resetButton.classList.remove(
      "text-[#476187]",
      "cursor-pointer"
    );

    resetButton.classList.add(
      "text-[#99ABC6]",
      "cursor-not-allowed"
    );

  }

}


function bindStandardFilterReset() {

  const resetButton =
    tableWrap.querySelector(".standard-filter-reset");

  if (!resetButton) return;


  /* 텍스트 입력 감지 */
  tableWrap
    .querySelectorAll(".standard-filter-input")
    .forEach((input) => {

      input.addEventListener(
        "input",
        updateStandardFilterResetButton
      );

    });


  /* 필터 해제 */
  resetButton.addEventListener(
    "click",
    () => {

      if (resetButton.disabled) {
        return;
      }


      /* input 초기화 */
      tableWrap
        .querySelectorAll(".standard-filter-input")
        .forEach((input) => {

          input.value = "";

        });


      /* dropdown 초기화 */
      tableWrap
        .querySelectorAll("[data-filter-default]")
        .forEach((dropdown) => {

          const defaultValue =
            dropdown.dataset.filterDefault;

          const label =
            dropdown.querySelector(
              ".std-dropdown-label"
            );

          if (label) {
            label.textContent = defaultValue;
          }


          const options =
            dropdown.querySelectorAll(
              ".std-dropdown-option"
            );

          options.forEach((option, index) => {

            option.classList.remove(
              "bg-[#E1E7F2]",
              "font-semibold",
              "bg-white",
              "font-normal"
            );


            if (index === 0) {

              option.classList.add(
                "bg-[#E1E7F2]",
                "font-semibold"
              );

            } else {

              option.classList.add(
                "bg-white",
                "font-normal"
              );

            }

          });

        });


      closeAllStdDropdowns();

      updateStandardFilterResetButton();

    }
  );


  updateStandardFilterResetButton();

}


  /* =====================================================
     TOP POPOVERS
  ====================================================== */

  const conceptButton =
    document.getElementById(
      "standardConceptButton"
    );

  const conceptPopover =
    document.getElementById(
      "standardConceptPopover"
    );

  const requiredButton =
    document.getElementById(
      "requiredItemButton"
    );

  const requiredPopover =
    document.getElementById(
      "requiredItemPopover"
    );


  function closeStandardPopovers() {

    conceptPopover
      ?.classList.add("hidden");

    requiredPopover
      ?.classList.add("hidden");

  }


  conceptButton?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      const willOpen =
        conceptPopover
          ?.classList
          .contains("hidden");


      closeStandardPopovers();

      closeAllStdDropdowns();


      if (willOpen) {
        conceptPopover
          ?.classList
          .remove("hidden");
      }

    }
  );


  requiredButton?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      const willOpen =
        requiredPopover
          ?.classList
          .contains("hidden");


      closeStandardPopovers();

      closeAllStdDropdowns();


      if (willOpen) {
        requiredPopover
          ?.classList
          .remove("hidden");
      }

    }
  );


  conceptPopover?.addEventListener(
    "click",
    event => {
      event.stopPropagation();
    }
  );


  requiredPopover?.addEventListener(
    "click",
    event => {
      event.stopPropagation();
    }
  );


  /* =====================================================
     BACKGROUND CLICK
  ====================================================== */

  document.addEventListener(
    "click",
    () => {

      closeStandardPopovers();

      closeAllStdDropdowns();

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeStandardPopovers();

        closeAllStdDropdowns();

      }

    }
  );


  /* =====================================================
     INITIAL
  ====================================================== */

  bindStandardDropdowns();

  setActiveTab("term");

});

/* =========================================================
   MY PAGE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const mypageMenuButtons =
      document.querySelectorAll(
        "[data-mypage-menu]"
      );

    const mypagePanels =
      document.querySelectorAll(
        "[data-mypage-panel]"
      );


    /* 마이페이지가 아닌 화면이면 종료 */
    if (
      !mypageMenuButtons.length ||
      !mypagePanels.length
    ) {
      return;
    }


    /* =====================================================
       MAIN MENU
    ====================================================== */

    function activateMyPage(
      panelName
    ) {

      /* PANEL */
      mypagePanels.forEach(
        (panel) => {

          const isActive =
            panel.dataset.mypagePanel ===
            panelName;

          panel.classList.toggle(
            "hidden",
            !isActive
          );

        }
      );


      /* LEFT MENU */
      mypageMenuButtons.forEach(
        (button) => {

          const isActive =
            button.dataset.mypageMenu ===
            panelName;


          button.classList.toggle(
            "bg-[#F2F6FF]",
            isActive
          );

          button.classList.toggle(
            "text-[#0061F0]",
            isActive
          );

          button.classList.toggle(
            "text-black",
            !isActive
          );


          const arrow =
            button.querySelector(
              '[data-lucide="chevron-right"]'
            );


          if (arrow) {

            arrow.classList.toggle(
              "text-[#0061F0]",
              isActive
            );

            arrow.classList.toggle(
              "text-[#99ABC6]",
              !isActive
            );

          }

        }
      );


      /* 화면 상단 이동 */
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

    }


    mypageMenuButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            activateMyPage(
              button.dataset.mypageMenu
            );

          }
        );

      }
    );


    /* =====================================================
       FAVORITE DATA TAB
    ====================================================== */

    const favoriteTabs =
      document.querySelectorAll(
        "[data-favorite-tab]"
      );

    const favoritePanels =
      document.querySelectorAll(
        "[data-favorite-panel]"
      );


    function activateFavoriteTab(
      tabName
    ) {

      favoritePanels.forEach(
        (panel) => {

          panel.classList.toggle(
            "hidden",
            panel.dataset.favoritePanel !==
              tabName
          );

        }
      );


      favoriteTabs.forEach((button) => {
  const isActive =
    button.dataset.favoriteTab === tabName;

  button.classList.toggle(
    "bg-[#0061F0]",
    isActive
  );

  button.classList.toggle(
    "text-white",
    isActive
  );

  button.classList.toggle(
    "border-[#0061F0]",
    isActive
  );

  button.classList.toggle(
    "bg-transparent",
    !isActive
  );

  button.classList.toggle(
    "text-[#99ABC6]",
    !isActive
  );

  button.classList.toggle(
    "border-[#99ABC6]",
    !isActive
  );

        }
      );

    }


    favoriteTabs.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            activateFavoriteTab(
              button.dataset.favoriteTab
            );

          }
        );

      }
    );


    /* =====================================================
       DEFAULT
    ====================================================== */

    activateMyPage(
      "profile"
    );

    activateFavoriteTab(
      "api"
    );


    if (
      typeof lucide !==
      "undefined"
    ) {
      lucide.createIcons();
    }

  }
);


/* =========================================================
   MY PAGE CUSTOM DROPDOWN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const dropdowns =
    document.querySelectorAll("[data-mypage-dropdown]");

  if (!dropdowns.length) return;


  function closeMyPageDropdowns(except = null) {

    dropdowns.forEach((dropdown) => {

      if (dropdown === except) return;

      const menu =
        dropdown.querySelector(".mypage-dropdown-menu");

      const trigger =
        dropdown.querySelector(".mypage-dropdown-trigger");

      const icon =
        dropdown.querySelector(".mypage-dropdown-icon");

      menu?.classList.add("hidden");

      trigger?.setAttribute(
        "aria-expanded",
        "false"
      );

      icon?.classList.remove(
        "rotate-180"
      );

    });

  }


  dropdowns.forEach((dropdown) => {

    const trigger =
      dropdown.querySelector(".mypage-dropdown-trigger");

    const menu =
      dropdown.querySelector(".mypage-dropdown-menu");

    const label =
      dropdown.querySelector(".mypage-dropdown-label");

    const icon =
      dropdown.querySelector(".mypage-dropdown-icon");

    const options =
      dropdown.querySelectorAll(".mypage-dropdown-option");


    /* 열기 / 닫기 */
    trigger?.addEventListener("click", (event) => {

      event.stopPropagation();

      const isOpen =
        !menu.classList.contains("hidden");

      closeMyPageDropdowns(dropdown);

      menu.classList.toggle(
        "hidden",
        isOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      icon?.classList.toggle(
        "rotate-180",
        !isOpen
      );

    });


    /* 옵션 선택 */
    options.forEach((option) => {

      option.addEventListener("click", (event) => {

        event.stopPropagation();

        const value =
          option.dataset.value;

        label.textContent =
          value;


        /* 기존 선택 스타일 제거 */
        options.forEach((item) => {

          item.classList.remove(
            "bg-[#E1E7F2]",
            "font-semibold"
          );

          item.classList.add(
            "bg-white",
            "font-normal"
          );

        });


        /* 현재 선택 */
        option.classList.remove(
          "bg-white",
          "font-normal"
        );

        option.classList.add(
          "bg-[#E1E7F2]",
          "font-semibold"
        );


        menu.classList.add("hidden");

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        icon?.classList.remove(
          "rotate-180"
        );

      });

    });

  });


  /* 바깥 클릭 */
  document.addEventListener("click", () => {
    closeMyPageDropdowns();
  });

});

/* =========================================================
   API APPLY POPUP
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  const popup =
    document.getElementById("apiApplyPopup");

  if (!popup) return;



  /* =====================================================
     CUSTOM DROPDOWN
  ====================================================== */
  const dropdowns =
    popup.querySelectorAll("[data-api-dropdown]");


  const closeApiDropdowns = (except = null) => {

    dropdowns.forEach((dropdown) => {

      if (dropdown === except) return;

      const menu =
        dropdown.querySelector(".api-apply-dropdown-menu");

      const trigger =
        dropdown.querySelector(".api-apply-dropdown-trigger");

      const icon =
        dropdown.querySelector(".api-apply-dropdown-icon");

      menu?.classList.add("hidden");

      trigger?.setAttribute(
        "aria-expanded",
        "false"
      );

      icon?.classList.remove("rotate-180");

    });

  };


  dropdowns.forEach((dropdown) => {

    const trigger =
      dropdown.querySelector(".api-apply-dropdown-trigger");

    const menu =
      dropdown.querySelector(".api-apply-dropdown-menu");

    const label =
      dropdown.querySelector(".api-apply-dropdown-label");

    const valueInput =
      dropdown.querySelector(".api-apply-dropdown-value");

    const icon =
      dropdown.querySelector(".api-apply-dropdown-icon");

    const options =
      dropdown.querySelectorAll(".api-apply-dropdown-option");


    trigger?.addEventListener("click", (event) => {

      event.stopPropagation();

      const isOpen =
        !menu.classList.contains("hidden");

      closeApiDropdowns(dropdown);

      menu.classList.toggle(
        "hidden",
        isOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      icon?.classList.toggle(
        "rotate-180",
        !isOpen
      );

    });


    options.forEach((option) => {

      option.addEventListener("click", (event) => {

        event.stopPropagation();

        const value =
          option.dataset.value || "";


        /* value */
        label.textContent = value;
        valueInput.value = value;


        /* 선택 UI 초기화 */
        options.forEach((item) => {

          item.classList.remove(
            "bg-[#E1E7F2]",
            "font-semibold"
          );

          item.classList.add(
            "bg-white",
            "font-normal"
          );

        });


        /* 현재 선택 */
        option.classList.remove(
          "bg-white",
          "font-normal"
        );

        option.classList.add(
          "bg-[#E1E7F2]",
          "font-semibold"
        );


        menu.classList.add("hidden");

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        icon?.classList.remove(
          "rotate-180"
        );


        updateApiApplyState();

      });

    });

  });



  /* =====================================================
     PERIOD
  ====================================================== */
  const periodButtons =
    popup.querySelectorAll(".api-period-button");

  const periodText =
    document.getElementById("apiPeriodText");

  const customPeriod =
    document.getElementById("apiCustomPeriod");

  const startDate =
    document.getElementById("apiStartDate");

  const endDate =
    document.getElementById("apiEndDate");


  let selectedPeriod = "3";


  const periodRanges = {
    "3": "2026-08-27 ~ 2026-11-27",
    "6": "2026-08-27 ~ 2027-02-27",
    "9": "2026-08-27 ~ 2027-05-27",
    "permanent": "영구 사용"
  };


  periodButtons.forEach((button) => {

    button.addEventListener("click", () => {

      selectedPeriod =
        button.dataset.period;


      /* 전체 비활성 */
      periodButtons.forEach((item) => {

        item.classList.remove(
          "border-[#0061F0]",
          "bg-[#0061F0]",
          "text-white",
          "font-semibold"
        );

        item.classList.add(
          "border-[#476187]",
          "bg-white",
          "text-[#476187]",
          "font-medium"
        );

      });


      /* 현재 활성 */
      button.classList.remove(
        "border-[#476187]",
        "bg-white",
        "text-[#476187]",
        "font-medium"
      );

      button.classList.add(
        "border-[#0061F0]",
        "bg-[#0061F0]",
        "text-white",
        "font-semibold"
      );


      if (selectedPeriod === "custom") {

        periodText.classList.add("hidden");

        customPeriod.classList.remove("hidden");
        customPeriod.classList.add("flex");

      } else {

        customPeriod.classList.add("hidden");
        customPeriod.classList.remove("flex");

        periodText.classList.remove("hidden");

        periodText.textContent =
          periodRanges[selectedPeriod];

      }


      updateApiApplyState();

    });

  });



  /* =====================================================
     REQUIRED VALIDATION
  ====================================================== */
  const usagePurpose =
    document.getElementById("apiUsagePurpose");

  const purposeError =
    document.getElementById("apiPurposeError");

  const submitButton =
    document.getElementById("apiApplySubmit");


  function updateApiApplyState() {

    const purposeValue =
      usagePurpose.value.trim();

    const serviceUse =
      popup.querySelectorAll(
        ".api-apply-dropdown-value"
      )[0]?.value || "";

    const requestAmount =
      popup.querySelectorAll(
        ".api-apply-dropdown-value"
      )[1]?.value || "";


    let periodValid = true;

    if (selectedPeriod === "custom") {
      periodValid =
        Boolean(startDate.value) &&
        Boolean(endDate.value);
    }


    const isValid =
      Boolean(purposeValue) &&
      Boolean(serviceUse) &&
      Boolean(requestAmount) &&
      periodValid;



    /* ===============================================
       사용 목적 오류 표시
    ================================================ */
    if (purposeValue) {

      usagePurpose.classList.remove(
        "border-[#F84141]"
      );

      usagePurpose.classList.add(
        "border-[#CDD6E8]"
      );

      purposeError.classList.add("hidden");

    } else {

      usagePurpose.classList.remove(
        "border-[#CDD6E8]"
      );

      usagePurpose.classList.add(
        "border-[#F84141]"
      );

      purposeError.classList.remove("hidden");

    }



    /* ===============================================
       신청 버튼
    ================================================ */
    submitButton.disabled = !isValid;


    if (isValid) {

      submitButton.classList.remove(
        "bg-[#99ABC6]",
        "cursor-not-allowed"
      );

      submitButton.classList.add(
        "bg-[#0061F0]",
        "hover:bg-[#0055D2]",
        "cursor-pointer"
      );

    } else {

      submitButton.classList.remove(
        "bg-[#0061F0]",
        "hover:bg-[#0055D2]",
        "cursor-pointer"
      );

      submitButton.classList.add(
        "bg-[#99ABC6]",
        "cursor-not-allowed"
      );

    }

  }



  usagePurpose?.addEventListener(
    "input",
    updateApiApplyState
  );

  startDate?.addEventListener(
    "change",
    updateApiApplyState
  );

  endDate?.addEventListener(
    "change",
    updateApiApplyState
  );



  /* =====================================================
     OUTSIDE CLICK
  ====================================================== */
  document.addEventListener("click", () => {
    closeApiDropdowns();
  });



  /* =====================================================
     CLOSE
  ====================================================== */
  const closeButton =
    document.getElementById("apiApplyClose");

  closeButton?.addEventListener("click", () => {
    popup.classList.add("hidden");
  });



  /* 최초 상태 */
  updateApiApplyState();

});

/* =========================================================
   POPUP COMMON DROPDOWN
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  const popupDropdowns =
    document.querySelectorAll("[data-popup-dropdown]");


  const closePopupDropdowns = (except = null) => {

    popupDropdowns.forEach((dropdown) => {

      if (dropdown === except) return;

      const menu =
        dropdown.querySelector(".popup-dropdown-menu");

      const trigger =
        dropdown.querySelector(".popup-dropdown-trigger");

      const icon =
        dropdown.querySelector(".popup-dropdown-icon");


      menu?.classList.add("hidden");

      trigger?.setAttribute(
        "aria-expanded",
        "false"
      );

      icon?.classList.remove("rotate-180");

    });

  };


  popupDropdowns.forEach((dropdown) => {

    const trigger =
      dropdown.querySelector(".popup-dropdown-trigger");

    const menu =
      dropdown.querySelector(".popup-dropdown-menu");

    const label =
      dropdown.querySelector(".popup-dropdown-label");

    const valueInput =
      dropdown.querySelector(".popup-dropdown-value");

    const icon =
      dropdown.querySelector(".popup-dropdown-icon");

    const options =
      dropdown.querySelectorAll(".popup-dropdown-option");


    trigger?.addEventListener("click", (event) => {

      event.stopPropagation();

      const isOpen =
        !menu.classList.contains("hidden");


      closePopupDropdowns(dropdown);


      menu.classList.toggle(
        "hidden",
        isOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      icon?.classList.toggle(
        "rotate-180",
        !isOpen
      );

    });


    options.forEach((option) => {

      option.addEventListener("click", (event) => {

        event.stopPropagation();

        const value =
          option.dataset.value || "";


        label.textContent = value;

        if (valueInput) {
          valueInput.value = value;
        }


        options.forEach((item) => {

          item.classList.remove(
            "bg-[#E1E7F2]",
            "font-semibold"
          );

          item.classList.add(
            "bg-white",
            "font-normal"
          );

        });


        option.classList.remove(
          "bg-white",
          "font-normal"
        );

        option.classList.add(
          "bg-[#E1E7F2]",
          "font-semibold"
        );


        menu.classList.add("hidden");

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        icon?.classList.remove("rotate-180");

      });

    });

  });


  document.addEventListener("click", () => {
    closePopupDropdowns();
  });

});

document.querySelectorAll(".custom-select").forEach((select) => {
  const trigger = select.querySelector(".custom-select-trigger");
  const menu = select.querySelector(".custom-select-menu");
  const value = select.querySelector(".custom-select-value");
  const icon = select.querySelector(".custom-select-icon");
  const options = select.querySelectorAll(".custom-select-option");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".custom-select-menu").forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.classList.add("hidden");
      }
    });

    document.querySelectorAll(".custom-select-icon").forEach((otherIcon) => {
      if (otherIcon !== icon) {
        otherIcon.setAttribute("data-lucide", "chevron-down");
      }
    });

    const isOpen = !menu.classList.contains("hidden");

    menu.classList.toggle("hidden");

    icon.setAttribute(
      "data-lucide",
      isOpen ? "chevron-down" : "chevron-up"
    );

    lucide.createIcons();
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      value.textContent = option.dataset.value;

      options.forEach((item) => {
        item.classList.remove("bg-[#E1E7F2]", "font-semibold");
        item.classList.add("bg-white");
      });

      option.classList.remove("bg-white");
      option.classList.add("bg-[#E1E7F2]", "font-semibold");

      menu.classList.add("hidden");
      icon.setAttribute("data-lucide", "chevron-down");

      lucide.createIcons();
    });
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".custom-select-menu").forEach((menu) => {
    menu.classList.add("hidden");
  });

  document.querySelectorAll(".custom-select-icon").forEach((icon) => {
    icon.setAttribute("data-lucide", "chevron-down");
  });

  lucide.createIcons();
});

/* =========================================================
   MAIN HEADER USER MENU
========================================================= */

const mainHeaderMenuToggle =
  document.getElementById("mainHeaderMenuToggle");

const mainUserMenu =
  document.getElementById("mainUserMenu");

const mainAccountCurrentTime =
  document.getElementById("mainAccountCurrentTime");

const mainTimezoneKst =
  document.getElementById("mainTimezoneKst");

const mainTimezoneUtc =
  document.getElementById("mainTimezoneUtc");


let mainCurrentTimezone = "Asia/Seoul";



/* =========================================================
   OPEN
========================================================= */

function openMainUserMenu() {

  if (
    !mainUserMenu ||
    !mainHeaderMenuToggle
  ) {
    return;
  }


  mainUserMenu.classList.remove("hidden");


  mainHeaderMenuToggle.setAttribute(
    "aria-expanded",
    "true"
  );

}



/* =========================================================
   CLOSE
========================================================= */

function closeMainUserMenu() {

  if (
    !mainUserMenu ||
    !mainHeaderMenuToggle
  ) {
    return;
  }


  mainUserMenu.classList.add("hidden");


  mainHeaderMenuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

}



/* =========================================================
   TOGGLE
========================================================= */

function toggleMainUserMenu() {

  if (!mainUserMenu) {
    return;
  }


  const isOpen =
    !mainUserMenu.classList.contains("hidden");


  if (isOpen) {

    closeMainUserMenu();

  } else {

    openMainUserMenu();

  }

}



/* =========================================================
   HAMBURGER CLICK
========================================================= */

if (mainHeaderMenuToggle) {

  mainHeaderMenuToggle.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      toggleMainUserMenu();

    }
  );

}



/* =========================================================
   CLICK OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    if (
      !mainUserMenu ||
      !mainHeaderMenuToggle
    ) {
      return;
    }


    const clickedInsideMenu =
      mainUserMenu.contains(event.target);


    const clickedToggle =
      mainHeaderMenuToggle.contains(event.target);


    if (
      !clickedInsideMenu &&
      !clickedToggle
    ) {

      closeMainUserMenu();

    }

  }
);



/* =========================================================
   ESC CLOSE
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeMainUserMenu();

    }

  }
);



/* =========================================================
   CURRENT TIME
========================================================= */

function updateMainHeaderTime() {

  if (!mainAccountCurrentTime) {
    return;
  }


  const now = new Date();


  const formatter =
    new Intl.DateTimeFormat(
      "ko-KR",
      {
        timeZone: mainCurrentTimezone,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false,
      }
    );


  const parts =
    formatter.formatToParts(now);


  const values = {};


  parts.forEach(
    function (part) {

      values[part.type] =
        part.value;

    }
  );


  mainAccountCurrentTime.textContent =
    `${values.year}-${values.month}-${values.day} ` +
    `${values.hour}:${values.minute}:${values.second}`;

}



/* 최초 실행 */
updateMainHeaderTime();


/* 1초마다 업데이트 */
setInterval(
  updateMainHeaderTime,
  1000
);



/* =========================================================
   TIMEZONE STYLE
========================================================= */

function setMainTimezone(timezone) {

  mainCurrentTimezone =
    timezone;


  const isKst =
    timezone === "Asia/Seoul";


  /* KST */
  if (mainTimezoneKst) {

    mainTimezoneKst.classList.toggle(
      "bg-white",
      isKst
    );

    mainTimezoneKst.classList.toggle(
      "text-[#142A4D]",
      isKst
    );

    mainTimezoneKst.classList.toggle(
      "bg-[#476187]",
      !isKst
    );

    mainTimezoneKst.classList.toggle(
      "text-[#CBD6EA]",
      !isKst
    );

  }


  /* UTC */
  if (mainTimezoneUtc) {

    mainTimezoneUtc.classList.toggle(
      "bg-white",
      !isKst
    );

    mainTimezoneUtc.classList.toggle(
      "text-[#142A4D]",
      !isKst
    );

    mainTimezoneUtc.classList.toggle(
      "bg-[#476187]",
      isKst
    );

    mainTimezoneUtc.classList.toggle(
      "text-[#CBD6EA]",
      isKst
    );

  }


  updateMainHeaderTime();

}



/* =========================================================
   KST CLICK
========================================================= */

if (mainTimezoneKst) {

  mainTimezoneKst.addEventListener(
    "click",
    function () {

      setMainTimezone(
        "Asia/Seoul"
      );

    }
  );

}



/* =========================================================
   UTC CLICK
========================================================= */

if (mainTimezoneUtc) {

  mainTimezoneUtc.addEventListener(
    "click",
    function () {

      setMainTimezone(
        "UTC"
      );

    }
  );

}

/* =========================================================
   LIST HEADER CUSTOM DROPDOWN
   최신순 / 10개
========================================================= */

function initTopListSelect(select) {
  if (!select) return;

  const trigger =
    select.querySelector(".top-list-select-trigger");

  const value =
    select.querySelector(".top-list-select-value");

  const menu =
    select.querySelector(".top-list-select-menu");

  const options =
    select.querySelectorAll(".top-list-select-option");


  if (!trigger || !value || !menu) return;


  /* 열기 / 닫기 */
  trigger.addEventListener("click", function (event) {
    event.stopPropagation();


    const isOpen =
      select.classList.contains("open");


    /* 다른 드롭다운 닫기 */
    document
      .querySelectorAll(".top-list-select")
      .forEach(function (item) {

        if (item === select) return;

        item.classList.remove("open");

        item
          .querySelector(".top-list-select-menu")
          ?.classList.add("hidden");

        item
          .querySelector(".top-list-select-trigger")
          ?.setAttribute(
            "aria-expanded",
            "false"
          );

      });


    /* 현재 드롭다운 */
    select.classList.toggle(
      "open",
      !isOpen
    );

    menu.classList.toggle(
      "hidden",
      isOpen
    );

    trigger.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

  });



  /* 옵션 선택 */
  options.forEach(function (option) {

    option.addEventListener("click", function (event) {
      event.stopPropagation();


      const selectedValue =
        option.dataset.value;


      value.textContent =
        selectedValue;


      options.forEach(function (item) {
        item.classList.remove("active");
      });


      option.classList.add("active");


      select.classList.remove("open");

      menu.classList.add("hidden");

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );


      select.dataset.value =
        selectedValue;

    });

  });

}



/* 초기화 */
document
  .querySelectorAll(".top-list-select")
  .forEach(function (select) {

    initTopListSelect(select);

  });



/* 바깥 클릭 */
document.addEventListener("click", function () {

  document
    .querySelectorAll(".top-list-select")
    .forEach(function (select) {

      select.classList.remove("open");

      select
        .querySelector(".top-list-select-menu")
        ?.classList.add("hidden");

      select
        .querySelector(".top-list-select-trigger")
        ?.setAttribute(
          "aria-expanded",
          "false"
        );

    });

});

const detailHero = document.getElementById("detailHero");
  const detailScrollArea = document.getElementById("detailScrollArea");

  if (detailHero && detailScrollArea) {
    const updateHeroShadow = () => {
      if (detailScrollArea.scrollTop > 4) {
        detailHero.style.boxShadow =
          "0 10px 16px -14px rgba(20, 42, 77, 0.45)";
      } else {
        detailHero.style.boxShadow = "none";
      }
    };

    detailScrollArea.addEventListener(
      "scroll",
      updateHeroShadow,
      { passive: true }
    );

    updateHeroShadow();
  }

  
/* =========================================
   AI-HUB MAIN NAV RESPONSIVE
   1440px 이하 메인메뉴 이동
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const desktopNav =
    document.getElementById("mainHeaderNav");

  const mobileNav =
    document.getElementById("mobileMainNav");

  const mainUserMenu =
    document.getElementById("mainUserMenu");

  if (!desktopNav || !mobileNav || !mainUserMenu) {
    return;
  }

  const menuItems = Array.from(desktopNav.children);

  const mediaQuery =
    window.matchMedia("(max-width: 1440px)");

  function syncMainNavigation() {
    const isCompact = mediaQuery.matches;

    const target = isCompact
      ? mobileNav
      : desktopNav;

    // 기존 버튼 자체를 이동하여 이벤트 유지
    menuItems.forEach((item) => {
      target.appendChild(item);
    });

    // 1440px 이하에서만 햄버거 내부 메뉴 표시
    mobileNav.classList.toggle("hidden", !isCompact);

    mobileNav.setAttribute(
      "aria-label",
      isCompact ? "메인메뉴" : "비활성 메인메뉴"
    );

    // 화면이 변경되어도 기존 팝업 기능 유지
  }

  syncMainNavigation();

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener(
      "change",
      syncMainNavigation
    );
  } else {
    mediaQuery.addListener(syncMainNavigation);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const desktopNav = document.getElementById("mainHeaderNav");
  const mobileNav = document.getElementById("mobileMainNav");
  const userMenu = document.getElementById("userMenu");
  const toggle = document.getElementById("headerUtilityToggle");
  const desktopToggle = document.getElementById("userMenuToggle");

  if (!desktopNav || !mobileNav || !userMenu || !toggle) {
  return;
  }

  const menuItems = Array.from(desktopNav.children);
  const media = window.matchMedia("(max-width: 1440px)");

  function syncNavigation() {
    const compact = media.matches;
    const target = compact ? mobileNav : desktopNav;

    menuItems.forEach((item) => {
      target.appendChild(item);
    });

    mobileNav.classList.toggle("hidden", !compact);

    // 화면 크기가 변경되면 열려 있던 팝업 닫기
    userMenu.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");

    if (desktopToggle) {
      desktopToggle.setAttribute("aria-expanded", "false");
    }
  }

  syncNavigation();

  if (media.addEventListener) {
    media.addEventListener("change", syncNavigation);
  } else {
    media.addListener(syncNavigation);
  }
});

