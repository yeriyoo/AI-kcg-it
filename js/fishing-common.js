
/* =========================================================
   AI 불법조업 위험도 분석
   common.js

   - HTML5 / W3C 유효성 고려
   - Chrome / Safari / Whale / Edge 호환성 고려
   - 접근성 ARIA 상태 관리
   - Lucide Icons
   - 지도 이미지 확대 / 이동
   - 위험 선박 목록 및 페이지네이션
========================================================= */

(function () {
  'use strict';

  /* =====================================================
     01. DOM 초기화
  ===================================================== */
  document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------
       공통 유틸리티
    --------------------------------------------------- */
    function $(selector, parent) {
      return (parent || document).querySelector(selector);
    }

    function $all(selector, parent) {
      return Array.prototype.slice.call(
        (parent || document).querySelectorAll(selector)
      );
    }

    function setText(element, value) {
      if (element) {
        element.textContent = value;
      }
    }

    function setExpanded(button, expanded) {
      if (button) {
        button.setAttribute(
          'aria-expanded',
          String(expanded)
        );
      }
    }

    function setPressed(button, pressed) {
      if (button) {
        button.setAttribute(
          'aria-pressed',
          String(pressed)
        );
      }
    }

    function createElement(tag, className, text) {
      var element = document.createElement(tag);

      if (className) {
        element.className = className;
      }

      if (typeof text !== 'undefined') {
        element.textContent = text;
      }

      return element;
    }

    /* =====================================================
       02. Lucide Icons
    ===================================================== */
    function initializeIcons() {
      if (
        window.lucide &&
        typeof window.lucide.createIcons === 'function'
      ) {
        window.lucide.createIcons({
          attrs: {
            'stroke-width': 1.8,
            'aria-hidden': 'true',
            focusable: 'false'
          }
        });
      }
    }

    initializeIcons();

    /* =====================================================
       03. Sidebar
    ===================================================== */
    var sidebar = $('#sidebar');
    var menuButton = $('#menuButton');
    var sidebarCloseButton = $('#sidebarCloseButton');
    var overlay = $('#overlay');

    var mobileMedia = window.matchMedia(
      '(max-width: 768px)'
    );

    var previousFocus = null;

    function isMobile() {
      return mobileMedia.matches;
    }

    function isSidebarOpen() {
      return Boolean(
        sidebar &&
        sidebar.classList.contains('open')
      );
    }

    function openSidebar() {
      if (!sidebar || !isMobile()) {
        return;
      }

      previousFocus = document.activeElement;

      sidebar.classList.add('open');

      if (overlay) {
        overlay.classList.remove('hidden');
      }

      setExpanded(menuButton, true);

      if (sidebarCloseButton) {
        sidebarCloseButton.focus();
      }
    }

    function closeSidebar(restoreFocus) {
      if (!sidebar) {
        return;
      }

      sidebar.classList.remove('open');

      if (overlay) {
        overlay.classList.add('hidden');
      }

      setExpanded(menuButton, false);

      if (restoreFocus !== false) {
        if (
          previousFocus &&
          typeof previousFocus.focus === 'function'
        ) {
          previousFocus.focus();
        } else if (menuButton && isMobile()) {
          menuButton.focus();
        }
      }
    }

    if (menuButton) {
      menuButton.addEventListener('click', function () {
        if (isSidebarOpen()) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (sidebarCloseButton) {
      sidebarCloseButton.addEventListener('click', function () {
        if (isMobile()) {
          closeSidebar();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeSidebar();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (
        event.key === 'Escape' &&
        isSidebarOpen() &&
        isMobile()
      ) {
        closeSidebar();
      }
    });

    /* 모바일 사이드바 내부 포커스 유지 */
    document.addEventListener('keydown', function (event) {
      if (
        event.key !== 'Tab' ||
        !isMobile() ||
        !isSidebarOpen() ||
        !sidebar
      ) {
        return;
      }

      var focusable = $all(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])',
        sidebar
      ).filter(function (element) {
        return element.getClientRects().length > 0;
      });

      if (!focusable.length) {
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    });

    function handleViewportChange() {
      if (!isMobile()) {
        closeSidebar(false);
      }
    }

    if (typeof mobileMedia.addEventListener === 'function') {
      mobileMedia.addEventListener(
        'change',
        handleViewportChange
      );
    } else if (
      typeof mobileMedia.addListener === 'function'
    ) {
      mobileMedia.addListener(handleViewportChange);
    }

    /* =====================================================
       04. Sidebar Section Toggle
    ===================================================== */
    $all('[data-toggle-section]').forEach(function (button) {

      button.addEventListener('click', function () {
        var sectionId = button.getAttribute(
          'data-toggle-section'
        );

        var section = document.getElementById(sectionId);

        if (!section) {
          return;
        }

        var willExpand = section.classList.contains(
          'hidden'
        );

        section.classList.toggle(
          'hidden',
          !willExpand
        );

        setExpanded(button, willExpand);

        var label = $('span', button);

        if (label) {
          setText(
            label,
            willExpand ? '접기' : '펼치기'
          );
        }
      });
    });

    /* =====================================================
       05. Dark Mode
    ===================================================== */
    var themeButton = $('#themeButton');
    var themeStorageKey = 'illegal-fishing-theme';

    function getSavedTheme() {
      try {
        return window.localStorage.getItem(
          themeStorageKey
        );
      } catch (error) {
        return null;
      }
    }

    function saveTheme(value) {
      try {
        window.localStorage.setItem(
          themeStorageKey,
          value
        );
      } catch (error) {
        // 저장소 사용이 제한된 환경에서는 현재 화면에만 적용
      }
    }

    function applyTheme(theme) {
      var isDark = theme === 'dark';

      document.body.classList.toggle(
        'dark-mode',
        isDark
      );

      setPressed(themeButton, isDark);

      if (themeButton) {
        themeButton.setAttribute(
          'aria-label',
          isDark
            ? '라이트모드 전환'
            : '다크모드 전환'
        );

        themeButton.setAttribute(
          'title',
          isDark
            ? '라이트모드 전환'
            : '다크모드 전환'
        );
      }
    }

    applyTheme(
      getSavedTheme() === 'dark'
        ? 'dark'
        : 'light'
    );

    if (themeButton) {
      themeButton.addEventListener('click', function () {
        var nextTheme = document.body.classList.contains(
          'dark-mode'
        ) ? 'light' : 'dark';

        applyTheme(nextTheme);
        saveTheme(nextTheme);
      });
    }

    /* =====================================================
       06. 위험도 필터
    ===================================================== */
    var thresholdButtons = $all(
      '[data-threshold]'
    );

    var currentThreshold = 31;

    function parseThreshold(button) {
      if (!button) {
        return 31;
      }

      var value = button.getAttribute(
        'data-threshold'
      ) || '';

      var match = value.match(/\d+/);

      return match ? Number(match[0]) : 31;
    }

    function updateThresholdButtons(activeButton) {
      thresholdButtons.forEach(function (button) {
        var isActive = button === activeButton;

        button.classList.toggle(
          'selected',
          isActive
        );

        setPressed(button, isActive);
      });
    }

    thresholdButtons.forEach(function (button) {
      if (button.classList.contains('selected')) {
        currentThreshold = parseThreshold(button);
        updateThresholdButtons(button);
      }

      button.addEventListener('click', function () {
        currentThreshold = parseThreshold(button);

        updateThresholdButtons(button);

        currentPage = 1;
        renderVesselTable();
      });
    });

    /* =====================================================
       07. 선박 예시 데이터
       실제 API 연결 시 이 배열을 서버 응답으로 교체
    ===================================================== */
    var vesselNames = [
      'LURONGYU51897',
      'LURONGYU51898',
      'LUWEIJINGYU51278',
      'LURONGYU55668',
      'JIHUANGYU02726',
      'LURONGYU51899',
      'LUWEIJINGYU51279',
      'JILUYU03217',
      'LURONGYU52518',
      'LURONGYU52773'
    ];

    var behaviorPatterns = [
      '위치 순간이동 · 조업 상태',
      '무허가 우리 측 EEZ 진입 · 조업 상태',
      'AIS 신호 장시간 미수신',
      '위험 해역 반복 진입',
      '비정상 항적 · 저속 이동'
    ];

    var vesselData = [];

    for (var i = 0; i < 75; i++) {
      var score;

      if (i < 8) {
        score = 100;
      } else if (i < 13) {
        score = 95;
      } else if (i < 19) {
        score = 90;
      } else {
        score = Math.max(31, 90 - i);
      }

      vesselData.push({
        id: vesselNames[i % vesselNames.length],
        mmsi: String(412666888 + i * 137),
        nationality: '중국',
        pattern: behaviorPatterns[i % behaviorPatterns.length],
        score: score,
        fishing: i % 3 !== 0,
        region: [
          'central',
          'west',
          'south',
          'east',
          'jeju'
        ][i % 5]
      });
    }

    /* =====================================================
       08. 선박 목록 필터
    ===================================================== */
    var vesselRows = $('#vesselRows');
    var rowCount = $('#rowCount');
    var pagination = $('#pagination');

    var highOnlyCheckbox = $('#highOnly');
    var fishingOnlyCheckbox = $('#fishingOnly');
    var regionSelect = $('#regionSelect');

    var vesselSearch = $('#vesselSearch');
    var searchCategory = $('#searchCategory');
    var headerSearchForm = $('#headerSearchForm');

    var currentPage = 1;
    var pageSize = 15;
    var searchKeyword = '';

    function getFilteredVessels() {
      return vesselData.filter(function (vessel) {

        if (vessel.score < currentThreshold) {
          return false;
        }

        if (
          highOnlyCheckbox &&
          highOnlyCheckbox.checked &&
          vessel.score < 81
        ) {
          return false;
        }

        if (
          fishingOnlyCheckbox &&
          fishingOnlyCheckbox.checked &&
          !vessel.fishing
        ) {
          return false;
        }

        if (
          regionSelect &&
          regionSelect.value !== 'all' &&
          vessel.region !== regionSelect.value
        ) {
          return false;
        }

        if (searchKeyword) {
          var searchValue = vessel.id;

          if (
            searchCategory &&
            searchCategory.value === 'mmsi'
          ) {
            searchValue = vessel.mmsi;
          }

          if (
            searchValue.toLowerCase().indexOf(
              searchKeyword
            ) === -1
          ) {
            return false;
          }
        }

        return true;
      });
    }

    /* =====================================================
       09. 위험도 표시
    ===================================================== */
    function getRiskLevel(score) {
      if (score >= 81) {
        return {
          text: '심각',
          className: 'risk'
        };
      }

      if (score >= 61) {
        return {
          text: '경계',
          className: 'risk risk-warning'
        };
      }

      return {
        text: '주의',
        className: 'risk risk-caution'
      };
    }

    /* =====================================================
       10. 선박 테이블 렌더링
    ===================================================== */
    function renderVesselTable() {
      if (!vesselRows) {
        return;
      }

      var filtered = getFilteredVessels();

      var totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
      );

      currentPage = Math.max(
        1,
        Math.min(currentPage, totalPages)
      );

      var start = (currentPage - 1) * pageSize;
      var end = start + pageSize;

      var pageData = filtered.slice(start, end);

      vesselRows.replaceChildren();

      if (!pageData.length) {
        var emptyRow = document.createElement('tr');
        var emptyCell = document.createElement('td');

        emptyCell.colSpan = 5;
        emptyCell.className = 'py-8 text-center text-[#476187]';
        emptyCell.textContent = '조회된 선박이 없습니다.';

        emptyRow.appendChild(emptyCell);
        vesselRows.appendChild(emptyRow);
      }

      pageData.forEach(function (vessel, index) {
        var row = document.createElement('tr');

        /* 순위 */
        var rankCell = document.createElement('td');
        var rankBadge = createElement(
          'span',
          'rank',
          String(start + index + 1)
        );

        rankCell.appendChild(rankBadge);

        /* 선박 ID */
        var idCell = document.createElement('td');

        var vesselName = createElement(
          'strong',
          'block font-semibold',
          vessel.id
        );

        var mmsi = createElement(
          'span',
          'block text-[10px] text-[#99ABC6]',
          vessel.mmsi
        );

        idCell.appendChild(vesselName);
        idCell.appendChild(mmsi);

        /* 국적 */
        var nationCell = createElement(
          'td',
          '',
          vessel.nationality
        );

        /* 행동 패턴 */
        var patternCell = createElement(
          'td',
          '',
          vessel.pattern
        );

        /* 위험도 */
        var riskCell = document.createElement('td');

        var riskInfo = getRiskLevel(vessel.score);

        var riskBadge = createElement(
          'span',
          riskInfo.className,
          riskInfo.text
        );

        var scoreText = createElement(
          'strong',
          'ml-1 font-bold',
          String(vessel.score)
        );

        riskCell.appendChild(riskBadge);
        riskCell.appendChild(scoreText);

        row.appendChild(rankCell);
        row.appendChild(idCell);
        row.appendChild(nationCell);
        row.appendChild(patternCell);
        row.appendChild(riskCell);

        vesselRows.appendChild(row);
      });

      setText(
        rowCount,
        '예시 ' + filtered.length +
        '척 · ' + currentPage +
        '/' + totalPages + ' 페이지'
      );

      renderPagination(totalPages);
    }

    /* =====================================================
       11. 페이지네이션
    ===================================================== */
    function renderPagination(totalPages) {
      if (!pagination) {
        return;
      }

      pagination.replaceChildren();

      function addPageButton(label, targetPage, active, disabled) {
        var button = createElement(
          'button',
          'page-button' + (active ? ' active' : ''),
          label
        );

        button.type = 'button';
        button.disabled = Boolean(disabled);

        button.setAttribute(
          'aria-label',
          label === '‹'
            ? '이전 페이지'
            : label === '›'
              ? '다음 페이지'
              : targetPage + '페이지'
        );

        if (active) {
          button.setAttribute(
            'aria-current',
            'page'
          );
        }

        button.addEventListener('click', function () {
          if (disabled || currentPage === targetPage) {
            return;
          }

          currentPage = targetPage;
          renderVesselTable();
        });

        pagination.appendChild(button);
      }

      addPageButton(
        '‹',
        currentPage - 1,
        false,
        currentPage === 1
      );

      var visiblePages = 5;

      var firstPage = Math.max(
        1,
        currentPage - Math.floor(visiblePages / 2)
      );

      var lastPage = Math.min(
        totalPages,
        firstPage + visiblePages - 1
      );

      firstPage = Math.max(
        1,
        lastPage - visiblePages + 1
      );

      for (
        var pageNumber = firstPage;
        pageNumber <= lastPage;
        pageNumber++
      ) {
        addPageButton(
          String(pageNumber),
          pageNumber,
          pageNumber === currentPage,
          false
        );
      }

      addPageButton(
        '›',
        currentPage + 1,
        false,
        currentPage === totalPages
      );
    }

    /* =====================================================
       12. 목록 필터 이벤트
    ===================================================== */
    function resetAndRender() {
      currentPage = 1;
      renderVesselTable();
    }

    if (highOnlyCheckbox) {
      highOnlyCheckbox.addEventListener(
        'change',
        resetAndRender
      );
    }

    if (fishingOnlyCheckbox) {
      fishingOnlyCheckbox.addEventListener(
        'change',
        resetAndRender
      );
    }

    if (regionSelect) {
      regionSelect.addEventListener(
        'change',
        resetAndRender
      );
    }

    /* 검색 */
    if (headerSearchForm) {
      headerSearchForm.addEventListener(
        'submit',
        function (event) {
          event.preventDefault();

          searchKeyword = vesselSearch
            ? vesselSearch.value.trim().toLowerCase()
            : '';

          resetAndRender();
        }
      );
    }

    if (vesselSearch) {
      vesselSearch.addEventListener('search', function () {
        searchKeyword = vesselSearch.value
          .trim()
          .toLowerCase();

        resetAndRender();
      });
    }

    if (searchCategory) {
      searchCategory.addEventListener(
        'change',
        function () {
          if (searchKeyword) {
            resetAndRender();
          }
        }
      );
    }

    renderVesselTable();

    /* =====================================================
       13. 지도 범례
    ===================================================== */
    var mapLegendButton = $('#mapLegendButton');
    var mapLegendPanel = $('#mapLegendPanel');

    function closeMapLegend() {
      if (!mapLegendButton || !mapLegendPanel) {
        return;
      }

      mapLegendPanel.classList.add('hidden');
      setExpanded(mapLegendButton, false);
    }

    if (mapLegendButton && mapLegendPanel) {
      mapLegendButton.addEventListener(
        'click',
        function () {
          var isHidden = mapLegendPanel.classList.contains(
            'hidden'
          );

          mapLegendPanel.classList.toggle(
            'hidden',
            !isHidden
          );

          setExpanded(mapLegendButton, isHidden);
        }
      );

      document.addEventListener('click', function (event) {
        if (
          !mapLegendButton.contains(event.target) &&
          !mapLegendPanel.contains(event.target)
        ) {
          closeMapLegend();
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          closeMapLegend();
        }
      });
    }

    /* =====================================================
       14. 지도 이미지 확대 / 축소 / 드래그
    ===================================================== */
    var mapImage = $('#mapImage');
    var zoomInButton = $('#zoomIn');
    var zoomOutButton = $('#zoomOut');

    var mapZoom = 1;
    var mapX = 0;
    var mapY = 0;

    var dragging = false;
    var dragStartX = 0;
    var dragStartY = 0;

    function updateMapTransform() {
      if (!mapImage) {
        return;
      }

      mapImage.style.transform =
        'translate(' + mapX + 'px, ' + mapY + 'px) ' +
        'scale(' + mapZoom + ')';

      if (zoomOutButton) {
        zoomOutButton.disabled = mapZoom <= 1;
      }

      if (zoomInButton) {
        zoomInButton.disabled = mapZoom >= 3;
      }
    }

    function changeMapZoom(delta) {
      mapZoom = Math.max(
        1,
        Math.min(3, mapZoom + delta)
      );

      if (mapZoom === 1) {
        mapX = 0;
        mapY = 0;
      }

      updateMapTransform();
    }

    if (zoomInButton) {
      zoomInButton.addEventListener('click', function () {
        changeMapZoom(0.2);
      });
    }

    if (zoomOutButton) {
      zoomOutButton.addEventListener('click', function () {
        changeMapZoom(-0.2);
      });
    }

    if (mapImage) {
      mapImage.setAttribute('draggable', 'false');

      mapImage.addEventListener('dragstart', function (event) {
        event.preventDefault();
      });

      mapImage.addEventListener('pointerdown', function (event) {
        if (mapZoom <= 1 || event.button !== 0) {
          return;
        }

        dragging = true;

        dragStartX = event.clientX - mapX;
        dragStartY = event.clientY - mapY;

        if (mapImage.setPointerCapture) {
          mapImage.setPointerCapture(event.pointerId);
        }
      });

      mapImage.addEventListener('pointermove', function (event) {
        if (!dragging) {
          return;
        }

        mapX = event.clientX - dragStartX;
        mapY = event.clientY - dragStartY;

        updateMapTransform();
      });

      function stopMapDrag() {
        dragging = false;
      }

      mapImage.addEventListener(
        'pointerup',
        stopMapDrag
      );

      mapImage.addEventListener(
        'pointercancel',
        stopMapDrag
      );

      mapImage.addEventListener(
        'lostpointercapture',
        stopMapDrag
      );
    }

    updateMapTransform();

    /* =====================================================
       15. 지도 표시 옵션
       현재 지도는 이미지 기반이므로 개별 레이어
       제어 대신 상태값만 관리합니다.
    ===================================================== */
    var showRiskGrid = $('#showRiskGrid');
    var showVessels = $('#showVessels');
    var showVesselLabels = $('#showVesselLabels');

    function updateMapOptions() {
      var options = {
        riskGrid: showRiskGrid
          ? showRiskGrid.checked
          : true,

        vessels: showVessels
          ? showVessels.checked
          : true,

        labels: showVesselLabels
          ? showVesselLabels.checked
          : false
      };

      // 실제 지도 API 연결 시 옵션 전달 위치
      return options;
    }

    [showRiskGrid, showVessels, showVesselLabels]
      .forEach(function (checkbox) {
        if (checkbox) {
          checkbox.addEventListener(
            'change',
            updateMapOptions
          );
        }
      });

    /* =====================================================
       16. 새로고침
    ===================================================== */
    var refreshButton = $('#refreshButton');
    var refreshTimer = null;

    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        if (refreshTimer !== null) {
          window.clearTimeout(refreshTimer);
        }

        var label = $('span', refreshButton);

        setText(label, '갱신됨');

        refreshButton.disabled = true;

        renderVesselTable();

        refreshTimer = window.setTimeout(function () {
          setText(label, '갱신');
          refreshButton.disabled = false;
          refreshTimer = null;
        }, 1200);
      });
    }

    /* =====================================================
       17. 기타 공통 기능
    ===================================================== */

    /* 인쇄 */
    var printButtons = $all(
      '.header-utils button'
    );

    printButtons.forEach(function (button) {
      if (button.textContent.trim() === '인쇄') {
        button.addEventListener('click', function () {
          window.print();
        });
      }
    });

    /* =====================================================
       18. 초기 상태 정리
    ===================================================== */
    setExpanded(menuButton, false);

    if (overlay) {
      overlay.classList.add('hidden');
    }

    if (sidebar) {
      sidebar.classList.remove('open');
    }

  });
})();



/* =========================================
   AI 선박분석 페이지 전용
========================================= */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var analysisPage = document.querySelector('.ship-analysis-page');

  if (!analysisPage) {
    return;
  }

  var searchForm = document.getElementById('shipAnalysisSearchForm');
  var searchInput = document.getElementById('shipAnalysisSearch');
  var notice = document.getElementById('shipAnalysisNotice');

  if (searchForm && searchInput && notice) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var keyword = searchInput.value.trim();

      if (!keyword) {
        notice.textContent =
          'MMSI, 선박명 또는 선박번호를 입력해 주세요.';
        searchInput.focus();
        return;
      }

      notice.textContent =
        '입력한 검색어: ' + keyword +
        ' · 현재는 데모 화면으로 실제 선박 데이터가 연결되어 있지 않습니다.';
    });
  }

  var backButton = document.getElementById('backToStatusButton');

  if (backButton) {
    backButton.addEventListener('click', function () {
      window.location.href = './불법조업감시.html';
    });
  }
});


/* =========================================================
   서해 NLL 인근 불법조업 분석
   Page: .page-nll
   기존 공용 JS 맨 아래 추가
========================================================= */

(function () {
  'use strict';

  function initializeNllPage() {
    var page = document.querySelector('.page-nll');

    if (!page) {
      return;
    }

    function getElement(id) {
      return document.getElementById(id);
    }

    /* -----------------------------------------------------
       01. 데모 선박 데이터
    ----------------------------------------------------- */

    var vessels = [
      {
        id: 1,
        name: 'GEUM GANG HO',
        mmsi: '440007260',
        flag: '한국',
        type: '어선',
        area: '백령도',
        date: '2026-10-22 07:44',
        description: '어청도 · 적립비 방면',
        warning: true
      },
      {
        id: 2,
        name: 'NO.88 TAEKYUNG',
        mmsi: '440012220',
        flag: '한국',
        type: '어선',
        area: '대청도',
        date: '2026-10-23 08:46',
        description: '어청도 · 적립비 방면',
        warning: true
      },
      {
        id: 3,
        name: '103 YU IL HO',
        mmsi: '440016340',
        flag: '한국',
        type: '어선',
        area: '연평도',
        date: '2026-10-19 23:27',
        description: 'NLL 인근 기타',
        warning: true
      },
      {
        id: 4,
        name: 'DAE BOK',
        mmsi: '440021530',
        flag: '한국',
        type: '어선',
        area: '대청도',
        date: '2026-10-19 20:23',
        description: 'NLL 인근 기타',
        warning: true
      },
      {
        id: 5,
        name: 'WOOJINHO',
        mmsi: '440146620',
        flag: '한국',
        type: '어선',
        area: '백령도',
        date: '2026-10-23 08:06',
        description: '어청도 · 적립비 방면',
        warning: true
      },
      {
        id: 6,
        name: '209SIN GWANG',
        mmsi: '440600178',
        flag: '한국',
        type: '어선',
        area: '연평도',
        date: '2026-10-22 19:30',
        description: '어청도 · 적립비 방면',
        warning: true
      },
      {
        id: 7,
        name: 'HAE SUNG',
        mmsi: '440017840',
        flag: '한국',
        type: '어선',
        area: '백령도',
        date: '2026-10-21 14:20',
        description: 'NLL 인근 기타',
        warning: false
      },
      {
        id: 8,
        name: 'BLUE OCEAN',
        mmsi: '412006730',
        flag: '중국',
        type: '어선',
        area: '대청도',
        date: '2026-10-21 09:14',
        description: 'NLL 인근 조업 의심',
        warning: true
      },
      {
        id: 9,
        name: 'SEA STAR',
        mmsi: '412008450',
        flag: '중국',
        type: '기타',
        area: '연평도',
        date: '2026-10-20 18:30',
        description: 'NLL 인근 기타',
        warning: false
      },
      {
        id: 10,
        name: 'DONG HAE',
        mmsi: '440025610',
        flag: '한국',
        type: '어선',
        area: '백령도',
        date: '2026-10-22 12:15',
        description: 'NLL 인근 조업 의심',
        warning: true
      }
    ];

    var selectedVesselId = 1;

    var vesselList = getElement('nllVesselList');
    var vesselCount = getElement('nllCount');

    var areaSelect = getElement('nllArea');
    var typeSelect = getElement('nllShipType');
    var flagSelect = getElement('nllFlag');
    var keywordInput = getElement('nllKeyword');
    var filterForm = getElement('nllFilterForm');

    /* -----------------------------------------------------
       02. DOM 생성 헬퍼
       innerHTML 사용하지 않음
    ----------------------------------------------------- */

    function createElement(tagName, className, textValue) {
      var element = document.createElement(tagName);

      if (className) {
        element.className = className;
      }

      if (textValue !== undefined && textValue !== null) {
        element.textContent = String(textValue);
      }

      return element;
    }

    /* -----------------------------------------------------
       03. 선박 필터
    ----------------------------------------------------- */

    function getFilteredVessels() {
      var area = areaSelect ? areaSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var flag = flagSelect ? flagSelect.value : '';
      var keyword = keywordInput
        ? keywordInput.value.trim().toLowerCase()
        : '';

      return vessels.filter(function (vessel) {
        if (area && vessel.area !== area) {
          return false;
        }

        if (type && vessel.type !== type) {
          return false;
        }

        if (flag && vessel.flag !== flag) {
          return false;
        }

        if (keyword) {
          var searchable =
            vessel.name.toLowerCase() + ' ' +
            vessel.mmsi.toLowerCase();

          if (searchable.indexOf(keyword) === -1) {
            return false;
          }
        }

        return true;
      });
    }

    /* -----------------------------------------------------
       04. 선박 카드 생성
    ----------------------------------------------------- */

    function createVesselCard(vessel) {
      var button = createElement(
        'button',
        'nll-vessel-card'
      );

      button.type = 'button';
      button.setAttribute(
        'aria-label',
        vessel.name + ', MMSI ' + vessel.mmsi + ', 상세 보기'
      );

      var isSelected = vessel.id === selectedVesselId;

      button.classList.toggle('is-active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));

      var badges = createElement(
        'div',
        'nll-vessel-badges'
      );

      badges.appendChild(
        createElement(
          'span',
          'nll-vessel-badge',
          '관심 0'
        )
      );

      if (vessel.warning) {
        badges.appendChild(
          createElement(
            'span',
            'nll-vessel-badge warning',
            '조업'
          )
        );
      }

      var meta = createElement(
        'div',
        'nll-vessel-meta',
        'MMSI ' + vessel.mmsi + ' · ' + vessel.flag
      );

      var name = createElement(
        'strong',
        'nll-vessel-name',
        vessel.name
      );

      var bottom = createElement(
        'div',
        'nll-vessel-bottom'
      );

      var description = createElement(
        'span',
        '',
        vessel.description + ' · ' + vessel.date
      );

      var detail = createElement(
        'span',
        'nll-vessel-detail',
        '상세'
      );

      bottom.appendChild(description);
      bottom.appendChild(detail);

      button.appendChild(badges);
      button.appendChild(meta);
      button.appendChild(name);
      button.appendChild(bottom);

      button.addEventListener('click', function () {
        selectedVesselId = vessel.id;
        renderVessels();
      });

      return button;
    }

    /* -----------------------------------------------------
       05. 목록 렌더링
    ----------------------------------------------------- */

    function renderVessels() {
      if (!vesselList) {
        return;
      }

      var filtered = getFilteredVessels();
      var fragment = document.createDocumentFragment();

      if (vesselCount) {
        vesselCount.textContent = String(filtered.length);
      }

      if (filtered.length === 0) {
        fragment.appendChild(
          createElement(
            'div',
            'nll-empty',
            '검색 조건에 해당하는 선박이 없습니다.'
          )
        );
      } else {
        filtered.forEach(function (vessel) {
          fragment.appendChild(
            createVesselCard(vessel)
          );
        });
      }

      vesselList.replaceChildren(fragment);
    }

    if (filterForm) {
      filterForm.addEventListener('submit', function (event) {
        event.preventDefault();
        renderVessels();
      });

      filterForm.addEventListener('reset', function () {
        window.requestAnimationFrame(function () {
          renderVessels();
        });
      });
    }

    [areaSelect, typeSelect, flagSelect].forEach(function (select) {
      if (select) {
        select.addEventListener('change', renderVessels);
      }
    });

    if (keywordInput) {
      keywordInput.addEventListener('input', renderVessels);
    }

    renderVessels();

    /* -----------------------------------------------------
       06. 지도 확대 / 축소
    ----------------------------------------------------- */

    var mapImage = getElement('nllMapImage');
    var zoomInButton = getElement('nllZoomIn');
    var zoomOutButton = getElement('nllZoomOut');

    var zoomLevel = 1;
    var minZoom = 1;
    var maxZoom = 3;
    var zoomStep = 0.2;

    function updateMapZoom() {
      if (!mapImage) {
        return;
      }

      mapImage.style.transform =
        'scale(' + zoomLevel.toFixed(2) + ')';

      if (zoomInButton) {
        zoomInButton.disabled = zoomLevel >= maxZoom;
      }

      if (zoomOutButton) {
        zoomOutButton.disabled = zoomLevel <= minZoom;
      }
    }

    if (zoomInButton) {
      zoomInButton.addEventListener('click', function () {
        zoomLevel = Math.min(
          maxZoom,
          Math.round((zoomLevel + zoomStep) * 100) / 100
        );

        updateMapZoom();
      });
    }

    if (zoomOutButton) {
      zoomOutButton.addEventListener('click', function () {
        zoomLevel = Math.max(
          minZoom,
          Math.round((zoomLevel - zoomStep) * 100) / 100
        );

        updateMapZoom();
      });
    }

    updateMapZoom();

    /* -----------------------------------------------------
       07. 지도 유형 전환
       실제 ENC 지도 데이터는 연결되지 않은 상태
    ----------------------------------------------------- */

    var mapStyleButtons = page.querySelectorAll(
      '[data-map-style]'
    );

    mapStyleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var selectedStyle =
          button.getAttribute('data-map-style');

        mapStyleButtons.forEach(function (item) {
          var active =
            item.getAttribute('data-map-style') === selectedStyle;

          item.classList.toggle('selected', active);
          item.setAttribute('aria-pressed', String(active));
        });

        /*
         * 현재는 위성 배경 이미지만 연결됨.
         * ENC 해도 이미지를 추가하면 여기서 src 변경.
         */
      });
    });

    /* -----------------------------------------------------
       08. 지도 레이어 펼치기 / 접기
    ----------------------------------------------------- */

    var layerButton = getElement('nllLayerButton');
    var layerPanel = getElement('nllLayerPanel');

    if (layerButton && layerPanel) {
      layerButton.addEventListener('click', function () {
        var willOpen = layerPanel.hidden;

        layerPanel.hidden = !willOpen;

        layerButton.setAttribute(
          'aria-expanded',
          String(willOpen)
        );
      });
    }

    /* -----------------------------------------------------
       09. 위성 SAR 탭
    ----------------------------------------------------- */

    var tabs = Array.prototype.slice.call(
      page.querySelectorAll('[data-nll-tab]')
    );

    var tabPanel = getElement('nllTabPanel');

    var tabContents = {
      '영상': {
        message: '최근 24시간에 NLL 감시구역을 덮는 위성 촬영이 없습니다.',
        title: '최근 수집된 NLL 감시구역 촬영'
      },
      '논문': {
        message: '현재 연결된 근거 논문 데이터가 없습니다.',
        title: '근거 논문'
      },
      '학습': {
        message: '현재 연결된 학습 데이터가 없습니다.',
        title: '학습 내용'
      }
    };

    function activateTab(tab, moveFocus) {
      if (!tab || !tabPanel) {
        return;
      }

      var tabName = tab.getAttribute('data-nll-tab');
      var content = tabContents[tabName];

      if (!content) {
        return;
      }

      tabs.forEach(function (item) {
        var active = item === tab;

        item.setAttribute(
          'aria-selected',
          String(active)
        );

        item.tabIndex = active ? 0 : -1;
      });

      if (tab.id) {
        tabPanel.setAttribute(
          'aria-labelledby',
          tab.id
        );
      }

      var message = tabPanel.querySelector('p');
      var title = tabPanel.querySelector('strong');
      var dates = tabPanel.querySelector('.nll-date-tags');

      if (message) {
        message.textContent = content.message;
      }

      if (title) {
        title.textContent = content.title;
      }

      if (dates) {
        dates.hidden = tabName !== '영상';
      }

      if (moveFocus) {
        tab.focus();
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab, false);
      });

      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;

        if (event.key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      });
    });

    /* -----------------------------------------------------
       10. 갱신 버튼
       실제 API 호출 없이 화면 데이터 다시 렌더링
    ----------------------------------------------------- */

    var refreshButton = getElement('nllRefresh');

    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        renderVessels();

        var originalText = refreshButton.textContent;

        refreshButton.setAttribute(
          'aria-label',
          '데모 목록 다시 표시 완료'
        );

        /*
         * 버튼 내부 아이콘을 유지하기 위해
         * textContent 전체를 변경하지 않음.
         */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeNllPage
    );
  } else {
    initializeNllPage();
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const expandButton = document.getElementById("mapExpandButton");
  const mapContainer = document.getElementById("nllMapContainer");

  if (!expandButton || !mapContainer) return;

  expandButton.addEventListener("click", function () {
    if (document.fullscreenElement === mapContainer) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
    } else if (mapContainer.requestFullscreen) {
      mapContainer.requestFullscreen().catch(console.error);
    }
  });

  document.addEventListener("fullscreenchange", function () {
    const isExpanded = document.fullscreenElement === mapContainer;

    expandButton.setAttribute("aria-pressed", String(isExpanded));
    expandButton.setAttribute(
      "aria-label",
      isExpanded ? "지도 전체 화면 종료" : "지도 전체 화면으로 보기"
    );
  });
});

/* =========================================
   HISTORY PAGE
   이력조회 전용 JavaScript
========================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    const page = document.querySelector(".history-page");
    if (!page) return;

    const $ = function (selector) {
      return page.querySelector(selector);
    };

    const $$ = function (selector) {
      return Array.from(page.querySelectorAll(selector));
    };

    const form = $("#historyFilterForm");
    const mmsiInput = $("#historyMmsi");
    const startInput = $("#historyStartDate");
    const endInput = $("#historyEndDate");

    const periodButtons = $$(".history-period-btn");

    const periodText = $("#historyPeriodText");
    const riskCount = $("#historyRiskCount");
    const realtimeCount = $("#historyRealtimeCount");
    const vesselCount = $("#historyVesselCount");

    const chartHeading = $("#historyChartHeading");
    const chartContainer = $("#historyChart");

    const vesselRows = $("#historyVesselRows");
    const dailyRows = $("#historyDailyRows");
    const dailyHeading = $("#historyDailyHeading");

    const searchStatus = $("#historySearchStatus");
    const selectionStatus = $("#historySelectionStatus");

    if (
      !form ||
      !startInput ||
      !endInput ||
      !chartContainer ||
      !vesselRows ||
      !dailyRows
    ) {
      return;
    }

    /* =====================================
       유틸리티
    ===================================== */

    function formatNumber(value) {
      return Number(value).toLocaleString("ko-KR");
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function formatDate(date) {
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
      ].join("-");
    }

    function parseDate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
      }

      const parts = value.split("-").map(Number);
      const date = new Date(parts[0], parts[1] - 1, parts[2]);

      if (
        date.getFullYear() !== parts[0] ||
        date.getMonth() !== parts[1] - 1 ||
        date.getDate() !== parts[2]
      ) {
        return null;
      }

      return date;
    }

    function addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function dateDifference(start, end) {
      const startUtc = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );

      const endUtc = Date.UTC(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );

      return Math.round((endUtc - startUtc) / 86400000) + 1;
    }

    function setStatus(message) {
      if (searchStatus) {
        searchStatus.textContent = message;
      }
    }

    /* =====================================
       기간 버튼
    ===================================== */

    function updatePeriodButtons(days) {
      periodButtons.forEach(function (button) {
        const selected = Number(button.dataset.days) === days;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    periodButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const days = Number(button.dataset.days);

        const end = parseDate(endInput.value) || new Date(2026, 9, 26);
        const start = addDays(end, -(days - 1));

        startInput.value = formatDate(start);
        endInput.value = formatDate(end);

        updatePeriodButtons(days);
        renderHistory();
      });
    });

    [startInput, endInput].forEach(function (input) {
      input.addEventListener("change", function () {
        const start = parseDate(startInput.value);
        const end = parseDate(endInput.value);

        if (start && end) {
          updatePeriodButtons(dateDifference(start, end));
        }

        renderHistory();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      renderHistory();
    });

    /* =====================================
       시연용 날짜별 데이터
       실제 API 데이터 아님
    ===================================== */

    function createDailyData(start, end) {
      const count = dateDifference(start, end);
      const result = [];

      for (let index = 0; index < count; index += 1) {
        const date = addDays(start, index);

        const relative = count > 1 ? index / (count - 1) : 0;

        let scale;

        if (relative < 0.27) {
          scale = 0.04 + relative * 0.17;
        } else if (relative < 0.38) {
          scale = 0.15 + relative * 0.18;
        } else if (relative < 0.75) {
          scale = 0.48 + 0.32 * Math.sin(index * 0.29) ** 2;
        } else if (relative < 0.9) {
          scale = 0.55 + 0.2 * Math.sin(index * 0.4) ** 2;
        } else {
          scale = 0.12 + 0.14 * Math.sin(index * 0.3) ** 2;
        }

        const wave =
          Math.abs(Math.sin(index * 0.72)) * 0.28 +
          Math.abs(Math.cos(index * 0.37)) * 0.14;

        const total = Math.round(
          58000 * Math.min(1, scale + wave * scale)
        );

        const critical = Math.round(
          total * (0.28 + 0.15 * Math.abs(Math.sin(index * 0.43)))
        );

        const warning = Math.max(0, total - critical);

        const vessels = Math.round(
          9500 * Math.min(1, scale * 1.15 + wave * 0.3)
        );

        result.push({
          date: formatDate(date),
          total: total,
          warning: warning,
          critical: critical,
          vessels: vessels
        });
      }

      return result;
    }

    /* =====================================
       시연용 선박 데이터
    ===================================== */

    const demoVessels = [
      ["412000000", "-", 1986, 476, "MMSI 조작", "26.10.26. 오전 10:40"],
      ["412331348", "-", 1554, 315, "MMSI 조작", "26.10.08. 오후 01:04"],
      ["412236757", "-", 1425, 1362, "영해·접속수역 침범", "26.10.08. 오후 03:01"],
      ["412000001", "-", 1254, 313, "MMSI 조작", "26.10.26. 오전 11:02"],
      ["412888888", "-", 1062, 237, "MMSI 조작", "26.10.26. 오전 10:40"],
      ["412201694", "-", 1062, 988, "영해·접속수역 침범", "26.10.25. 오전 05:12"],
      ["412111111", "-", 1007, 319, "MMSI 조작", "26.10.26. 오전 11:05"],
      ["412334629", "-", 995, 249, "MMSI 조작", "26.10.08. 오후 01:04"],
      ["412202937", "-", 979, 839, "영해·접속수역 침범", "26.10.08. 오후 03:01"],
      ["412336859", "-", 964, 234, "MMSI 조작", "26.10.08. 오후 01:04"],
      ["412777000", "-", 941, 126, "MMSI 조작", "26.10.07. 오후 02:19"],
      ["412320837", "-", 934, 195, "MMSI 조작", "26.10.26. 오전 11:02"],
      ["412209118", "-", 918, 314, "AIS 신호 이상", "26.10.20. 오전 08:15"],
      ["412300295", "-", 905, 207, "영해·접속수역 침범", "26.10.18. 오후 04:25"]
    ];

    /* =====================================
       SVG 차트
    ===================================== */

    const SVG_NS = "http://www.w3.org/2000/svg";

    function svgElement(name, attributes) {
      const element = document.createElementNS(SVG_NS, name);

      Object.keys(attributes || {}).forEach(function (key) {
        element.setAttribute(key, String(attributes[key]));
      });

      return element;
    }

    function drawChart(data) {
      chartContainer.replaceChildren();

      if (!data.length) return;

      const width = Math.max(900, data.length * 12 + 80);
      const height = 245;

      const margin = {
        top: 12,
        right: 46,
        bottom: 28,
        left: 48
      };

      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;

      const maxEvents = 60000;
      const maxVessels = 10000;

      const svg = svgElement("svg", {
        viewBox: "0 0 " + width + " " + height,
        preserveAspectRatio: "none",
        "aria-hidden": "true",
        focusable: "false"
      });

      /* 격자선 및 Y축 */

      for (let tick = 0; tick <= 6; tick += 1) {
        const value = tick * 10000;

        const y =
          margin.top +
          plotHeight -
          (value / maxEvents) * plotHeight;

        svg.appendChild(
          svgElement("line", {
            x1: margin.left,
            y1: y,
            x2: width - margin.right,
            y2: y,
            class: "chart-grid-line"
          })
        );

        const label = svgElement("text", {
          x: margin.left - 8,
          y: y + 3,
          "text-anchor": "end"
        });

        label.textContent = formatNumber(value);
        svg.appendChild(label);

        const rightLabel = svgElement("text", {
          x: width - margin.right + 8,
          y: y + 3,
          "text-anchor": "start"
        });

        rightLabel.textContent = formatNumber(
          Math.round((value / maxEvents) * maxVessels)
        );

        svg.appendChild(rightLabel);
      }

      const slotWidth = plotWidth / data.length;
      const barWidth = Math.max(2, slotWidth * 0.72);

      const points = [];

      data.forEach(function (item, index) {
        const x =
          margin.left +
          index * slotWidth +
          (slotWidth - barWidth) / 2;

        const warningHeight =
          (item.warning / maxEvents) * plotHeight;

        const criticalHeight =
          (item.critical / maxEvents) * plotHeight;

        const bottom = margin.top + plotHeight;

        /* 경계 막대 */
        svg.appendChild(
          svgElement("rect", {
            x: x,
            y: bottom - warningHeight,
            width: barWidth,
            height: warningHeight,
            class: "chart-bar-warning"
          })
        );

        /* 심각 막대 */
        svg.appendChild(
          svgElement("rect", {
            x: x,
            y: bottom - warningHeight - criticalHeight,
            width: barWidth,
            height: criticalHeight,
            class: "chart-bar-critical"
          })
        );

        /* 위험 선박 꺾은선 */
        const pointX = x + barWidth / 2;

        const pointY =
          bottom -
          (item.vessels / maxVessels) * plotHeight;

        points.push(pointX + "," + pointY);

        /* 날짜 X축 */
        const labelStep = data.length > 100 ? 7 : data.length > 40 ? 2 : 1;

        if (index % labelStep === 0 || index === data.length - 1) {
          const label = svgElement("text", {
            x: pointX,
            y: height - 8,
            "text-anchor": "middle"
          });

          label.textContent = item.date.slice(5);
          svg.appendChild(label);
        }
      });

      svg.appendChild(
        svgElement("polyline", {
          points: points.join(" "),
          class: "chart-vessel-line"
        })
      );

      chartContainer.appendChild(svg);
    }

    /* =====================================
       테이블 생성
    ===================================== */

    function createCell(text, tagName) {
      const cell = document.createElement(tagName || "td");
      cell.textContent = String(text);
      return cell;
    }

    function renderVesselTable(keyword) {
      vesselRows.replaceChildren();

      const filtered = demoVessels.filter(function (vessel) {
        if (!keyword) return true;

        return (
          vessel[0].includes(keyword) ||
          vessel[1].toLowerCase().includes(keyword.toLowerCase())
        );
      });

      if (!filtered.length) {
        const row = document.createElement("tr");
        const cell = createCell("검색 결과가 없습니다.");

        cell.colSpan = 6;
        row.appendChild(cell);
        vesselRows.appendChild(row);
        return;
      }

      filtered.forEach(function (vessel) {
        const row = document.createElement("tr");

        const mmsiCell = document.createElement("td");
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = vessel[0];
        button.setAttribute(
          "aria-label",
          vessel[0] + " 선박 이력 선택"
        );

        button.addEventListener("click", function () {
          vesselRows.querySelectorAll("tr").forEach(function (item) {
            item.classList.remove("is-selected");
          });

          row.classList.add("is-selected");

          if (selectionStatus) {
            selectionStatus.textContent =
              vessel[0] + " 선박을 선택했습니다.";
          }
        });

        mmsiCell.appendChild(button);
        row.appendChild(mmsiCell);

        row.appendChild(createCell(vessel[1]));
        row.appendChild(createCell(formatNumber(vessel[2])));
        row.appendChild(createCell(formatNumber(vessel[3])));
        row.appendChild(createCell(vessel[4]));
        row.appendChild(createCell(vessel[5]));

        vesselRows.appendChild(row);
      });
    }

    function renderDailyTable(data) {
      dailyRows.replaceChildren();

      const sorted = data.slice().reverse();

      sorted.forEach(function (item) {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        const dateButton = document.createElement("button");

        dateButton.type = "button";
        dateButton.textContent = item.date;
        dateButton.setAttribute(
          "aria-label",
          item.date + " 위험 선박 내역 선택"
        );

        dateButton.addEventListener("click", function () {
          dailyRows.querySelectorAll("tr").forEach(function (entry) {
            entry.classList.remove("is-selected");
          });

          row.classList.add("is-selected");

          if (selectionStatus) {
            selectionStatus.textContent =
              item.date + " 날짜를 선택했습니다.";
          }
        });

        dateCell.appendChild(dateButton);
        row.appendChild(dateCell);

        row.appendChild(createCell(formatNumber(item.total)));

        const criticalCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "history-critical-badge";
        badge.textContent = formatNumber(item.critical);

        criticalCell.appendChild(badge);
        row.appendChild(criticalCell);

        row.appendChild(createCell(formatNumber(item.vessels) + "척"));

        dailyRows.appendChild(row);
      });
    }

    /* =====================================
       전체 렌더링
    ===================================== */

    function renderHistory() {
      const start = parseDate(startInput.value);
      const end = parseDate(endInput.value);

      if (!start || !end) {
        setStatus("올바른 조회 날짜를 입력해 주세요.");
        return;
      }

      if (start > end) {
        setStatus("시작일은 종료일보다 늦을 수 없습니다.");
        return;
      }

      const days = dateDifference(start, end);

      if (days > 365) {
        setStatus("시연 화면에서는 최대 365일까지 조회할 수 있습니다.");
        return;
      }

      const data = createDailyData(start, end);

      const keyword = mmsiInput ? mmsiInput.value.trim() : "";

      const totalRisk = data.reduce(function (sum, item) {
        return sum + item.total;
      }, 0);

      /* 기간 표시 */
      if (periodText) {
        periodText.textContent =
          formatDate(start) +
          " ~ " +
          formatDate(end) +
          " (" +
          days +
          "일)";
      }

      if (chartHeading) {
        chartHeading.textContent =
          "기간 전체 위험 추이 (" +
          formatDate(start) +
          " ~ " +
          formatDate(end) +
          ")";
      }

      if (dailyHeading) {
        dailyHeading.textContent =
          "일자별 내역 " + days + "일 (최신순)";
      }

      /* 요약 수치: 기본 90일 화면은 이미지 기준 */
      if (riskCount) {
        riskCount.textContent =
          days === 90 && !keyword
            ? "1,643,074건"
            : formatNumber(totalRisk) + "건";
      }

      if (realtimeCount) {
        realtimeCount.textContent =
          days === 90 && !keyword
            ? "928,177건"
            : formatNumber(Math.round(totalRisk * 0.565)) + "건";
      }

      if (vesselCount) {
        vesselCount.textContent =
          days === 90 && !keyword
            ? "24,479척"
            : formatNumber(
                Math.round(
                  data.reduce(function (sum, item) {
                    return sum + item.vessels;
                  }, 0) / Math.max(1, days) * 3.4
                )
              ) + "척";
      }

      drawChart(data);
      renderVesselTable(keyword);
      renderDailyTable(data);

      setStatus("");
    }

    /* 초기 렌더링 */
    updatePeriodButtons(90);
    renderHistory();

  });
})();

/* =========================================================
   해역/기관별 조회
   Page: .region-page
   기존 common.js 맨 아래 추가
========================================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.querySelector('.region-page');

    if (!page) return;

    function $(selector) {
      return page.querySelector(selector);
    }

    function numberFormat(value) {
      return Number(value).toLocaleString('ko-KR');
    }

    function pad(value) {
      return String(value).padStart(2, '0');
    }

    function formatDate(date) {
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
      ].join('-');
    }

    function parseDate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

      var parts = value.split('-').map(Number);
      var date = new Date(parts[0], parts[1] - 1, parts[2]);

      if (
        date.getFullYear() !== parts[0] ||
        date.getMonth() !== parts[1] - 1 ||
        date.getDate() !== parts[2]
      ) {
        return null;
      }

      return date;
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function dayCount(start, end) {
      var a = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );

      var b = Date.UTC(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );

      return Math.round((b - a) / 86400000) + 1;
    }

    var form = $('#regionSearchForm');
    var startInput = $('#regionStartDate');
    var endInput = $('#regionEndDate');
    var agencySelect = $('#regionAgency');
    var riskSelect = $('#regionRisk');
    var periodButtons = Array.prototype.slice.call(
      page.querySelectorAll('.region-period-btn')
    );

    var periodText = $('#regionPeriodText');
    var eventCount = $('#regionEventCount');
    var criticalCount = $('#regionCriticalCount');
    var vesselCount = $('#regionVesselCount');
    var agencyRows = $('#regionAgencyRows');
    var chartContainer = $('#regionChart');
    var tooltip = $('#regionChartTooltip');
    var mapAgency = $('#regionMapAgency');
    var status = $('#regionStatus');

    if (
      !form ||
      !startInput ||
      !endInput ||
      !agencyRows ||
      !chartContainer
    ) {
      return;
    }

    /* 화면에 표시된 30일 기준 통계 */

    var agencies = [
      {
        id: 'central',
        name: '중부청',
        color: '#0EA5F5',
        events: 325369,
        critical: 200673,
        vessels: 8400,
        peak: '09-29 (29,553)',
        values: [
          27000, 26000, 29553, 26500, 22500,
          24000, 27500, 23000, 18000, 22000,
          22500, 16000, 1000, 1000, 500,
          800, 800, 1200, 2000, 3000,
          1200, 1000, 1800, 3000, 4200,
          3800, 4500, 4400, 3200, 1200
        ]
      },
      {
        id: 'west',
        name: '서해청',
        color: '#10BE88',
        events: 162956,
        critical: 95716,
        vessels: 4200,
        peak: '09-29 (16,076)',
        values: [
          14000, 14000, 16076, 15500, 11500,
          8000, 10500, 9000, 8800, 10500,
          13500, 9500, 1200, 1100, 1000,
          600, 500, 800, 1000, 1200,
          1000, 900, 1200, 1800, 2000,
          1200, 1800, 1700, 1800, 1000
        ]
      },
      {
        id: 'jeju',
        name: '제주청',
        color: '#FF9800',
        events: 163506,
        critical: 99871,
        vessels: 4250,
        peak: '10-01 (12,739)',
        values: [
          12000, 11000, 12300, 12300, 12739,
          11500, 9000, 9200, 6500, 5700,
          6500, 6000, 1800, 1600, 1200,
          1300, 1400, 8000, 10000, 7000,
          5200, 4200, 4500, 3500, 1200,
          1000, 900, 700, 500, 300
        ]
      },
      {
        id: 'south',
        name: '남해청',
        color: '#9254FF',
        events: 3023,
        critical: 2810,
        vessels: 80,
        peak: '10-24 (277)',
        values: [
          30, 40, 50, 60, 45, 70, 80, 90, 65, 80,
          100, 85, 45, 55, 70, 75, 90, 110, 140, 120,
          160, 190, 175, 220, 230, 250, 260, 277, 190, 130
        ]
      },
      {
        id: 'east',
        name: '동해청',
        color: '#F43F65',
        events: 339,
        critical: 213,
        vessels: 15,
        peak: '10-20 (73)',
        values: [
          5, 8, 6, 9, 10, 12, 8, 10, 11, 9,
          10, 8, 7, 6, 8, 7, 9, 10, 12, 14,
          10, 13, 20, 73, 25, 18, 15, 12, 10, 9
        ]
      }
    ];

    var referenceStart = parseDate('2026-09-27');
    var referenceEnd = parseDate('2026-10-26');

    var totalVessels = 16945;

    function selectedAgencies() {
      var value = agencySelect ? agencySelect.value : 'all';

      if (value === 'all') return agencies;

      return agencies.filter(function (agency) {
        return agency.id === value;
      });
    }

    function getDates(start, end) {
      var result = [];
      var count = dayCount(start, end);

      for (var i = 0; i < count; i++) {
        result.push(addDays(start, i));
      }

      return result;
    }

    /*
      기준 기간 밖의 날짜는 실제 통계가 없으므로
      0이나 임의의 확정 통계로 표시하지 않습니다.
    */

    function referenceValue(agency, date) {
      var index = dayCount(referenceStart, date) - 1;

      if (index < 0 || index >= agency.values.length) {
        return null;
      }

      return agency.values[index];
    }

    function updatePeriodButtons() {
      var start = parseDate(startInput.value);
      var end = parseDate(endInput.value);

      if (!start || !end) return;

      var count = dayCount(start, end);

      periodButtons.forEach(function (button) {
        var active = Number(button.dataset.days) === count;

        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    periodButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var days = Number(button.dataset.days);
        var end = parseDate(endInput.value) || referenceEnd;
        var start = addDays(end, -(days - 1));

        startInput.value = formatDate(start);
        endInput.value = formatDate(end);

        updatePeriodButtons();
        renderPage();
      });
    });

    [startInput, endInput].forEach(function (input) {
      input.addEventListener('change', function () {
        updatePeriodButtons();
        renderPage();
      });
    });

    if (agencySelect) {
      agencySelect.addEventListener('change', renderPage);
    }

    if (riskSelect) {
      riskSelect.addEventListener('change', renderPage);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderPage();
    });

    /* =====================================================
       요약 카드
    ===================================================== */

    function renderSummary(start, end, selected) {
      var days = dayCount(start, end);

      periodText.textContent =
        formatDate(start) + ' ~ ' +
        formatDate(end) + ' (' + days + '일)';

      var isReferencePeriod =
        formatDate(start) === '2026-09-27' &&
        formatDate(end) === '2026-10-26';

      if (!isReferencePeriod) {
        eventCount.textContent = '데이터 미연결';
        criticalCount.textContent = '데이터 미연결';
        vesselCount.textContent = '데이터 미연결';
        return;
      }

      var events = 0;
      var critical = 0;
      var vessels = 0;

      selected.forEach(function (agency) {
        events += agency.events;
        critical += agency.critical;
        vessels += agency.vessels;
      });

      eventCount.textContent = numberFormat(events) + '건';
      criticalCount.textContent = numberFormat(critical) + '건';

      vesselCount.textContent =
        agencySelect.value === 'all'
          ? numberFormat(totalVessels) + '척'
          : numberFormat(vessels) + '척';
    }

    /* =====================================================
       지방청 요약표
    ===================================================== */

    function createCell(tag, value) {
      var cell = document.createElement(tag);
      cell.textContent = value;
      return cell;
    }

    function renderAgencyTable(start, end) {
      var fragment = document.createDocumentFragment();
      var isReferencePeriod =
        formatDate(start) === '2026-09-27' &&
        formatDate(end) === '2026-10-26';

      var rows = [
        {
          id: 'all',
          name: '전체 지방청',
          events: 655193,
          critical: 399283,
          peak: '-'
        }
      ].concat(agencies);

      rows.forEach(function (agency) {
        var row = document.createElement('tr');
        var active = agencySelect.value === agency.id;

        row.dataset.agency = agency.id;
        row.classList.toggle('is-active', active);
        row.tabIndex = 0;
        row.setAttribute(
          'aria-label',
          agency.name + ' 통계 선택'
        );

        var heading = document.createElement('th');
        heading.scope = 'row';

        if (agency.id !== 'all') {
          var dot = document.createElement('i');
          dot.className = 'region-dot ' + agency.id;
          dot.setAttribute('aria-hidden', 'true');
          heading.appendChild(dot);
          heading.appendChild(document.createTextNode(' '));
        }

        heading.appendChild(
          document.createTextNode(agency.name)
        );

        row.appendChild(heading);

        if (isReferencePeriod) {
          row.appendChild(
            createCell('td', numberFormat(agency.events))
          );

          row.appendChild(
            createCell('td', numberFormat(agency.critical))
          );

          row.appendChild(
            createCell(
              'td',
              numberFormat(Math.round(agency.events / 30))
            )
          );

          row.appendChild(
            createCell('td', agency.peak)
          );
        } else {
          for (var i = 0; i < 4; i++) {
            row.appendChild(createCell('td', '-'));
          }
        }

        function selectAgency() {
          agencySelect.value = agency.id;
          renderPage();
        }

        row.addEventListener('click', selectAgency);

        row.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectAgency();
          }
        });

        fragment.appendChild(row);
      });

      agencyRows.replaceChildren(fragment);
    }

    /* =====================================================
       SVG 그래프
    ===================================================== */

    var SVG_NS = 'http://www.w3.org/2000/svg';

    function svgElement(tag, attrs) {
      var element = document.createElementNS(SVG_NS, tag);

      Object.keys(attrs || {}).forEach(function (key) {
        element.setAttribute(key, String(attrs[key]));
      });

      return element;
    }

    function renderChart(start, end, selected) {
      chartContainer.replaceChildren();

      var dates = getDates(start, end);

      if (!dates.length) return;

      var width = Math.max(600, chartContainer.clientWidth);
      var height = 230;

      var margin = {
        left: 52,
        right: 18,
        top: 10,
        bottom: 30
      };

      var plotWidth = width - margin.left - margin.right;
      var plotHeight = height - margin.top - margin.bottom;

      var maxY = 30000;

      var svg = svgElement('svg', {
        viewBox: '0 0 ' + width + ' ' + height,
        role: 'img',
        'aria-label': '지방청별 위험 이벤트 날짜별 추이'
      });

      

      for (var tick = 0; tick <= 6; tick++) {
        var value = tick * 5000;
        var y = margin.top +
          plotHeight -
          (value / maxY) * plotHeight;

        svg.appendChild(svgElement('line', {
          x1: margin.left,
          y1: y,
          x2: width - margin.right,
          y2: y,
          class: 'region-grid-line'
        }));

        var label = svgElement('text', {
          x: margin.left - 8,
          y: y + 3,
          'text-anchor': 'end',
          class: 'region-axis-text'
        });

        label.textContent = numberFormat(value);
        svg.appendChild(label);
      }

      function pointX(index) {
        return margin.left +
          (index / Math.max(1, dates.length - 1)) *
          plotWidth;
      }

      function pointY(value) {
        return margin.top +
          plotHeight -
          (value / maxY) * plotHeight;
      }

      dates.forEach(function (date, index) {
        var label = svgElement('text', {
          x: pointX(index),
          y: height - 9,
          'text-anchor': 'middle',
          class: 'region-axis-text'
        });

        label.textContent =
          pad(date.getMonth() + 1) + '-' +
          pad(date.getDate());

        svg.appendChild(label);
      });

      selected.forEach(function (agency) {
        var values = dates.map(function (date) {
          return referenceValue(agency, date);
        });

        var pathParts = [];
        var drawing = false;

        values.forEach(function (value, index) {
          if (value === null) {
            drawing = false;
            return;
          }

          pathParts.push(
            (drawing ? 'L' : 'M') +
            pointX(index).toFixed(2) + ' ' +
            pointY(value).toFixed(2)
          );

          drawing = true;
        });

        var path = svgElement('path', {
          d: pathParts.join(' '),
          stroke: agency.color,
          class: 'region-series'
        });

        svg.appendChild(path);

        values.forEach(function (value, index) {
          if (value === null) return;

          var point = svgElement('circle', {
            cx: pointX(index),
            cy: pointY(value),
            r: 2.7,
            fill: '#F2F6FF',
            stroke: agency.color,
            class: 'region-point',
            tabindex: '0',
            role: 'img',
            'aria-label':
              agency.name + ', ' +
              formatDate(dates[index]) + ', ' +
              numberFormat(value) + '건'
          });

          function showTooltip() {
              if (!tooltip) return;

              var date = dates[index];

              // 선택한 날짜의 모든 지방청 데이터
              var tooltipData = agencies.map(function (item) {
                return {
                  name: item.name,
                  color: item.color,
                  value: referenceValue(item, date)
                };
              });

              // 툴팁 내용 생성
              tooltip.replaceChildren();

              var dateElement = document.createElement('div');
              dateElement.className = 'region-tooltip-date';
              dateElement.textContent =
                pad(date.getMonth() + 1) + '-' + pad(date.getDate());

              tooltip.appendChild(dateElement);

              var list = document.createElement('div');
              list.className = 'region-tooltip-list';

              tooltipData.forEach(function (item) {
                var row = document.createElement('div');
                row.className = 'region-tooltip-row';

                var name = document.createElement('div');
                name.className = 'region-tooltip-name';

                var dot = document.createElement('span');
                dot.className = 'region-tooltip-dot';
                dot.style.backgroundColor = item.color;

                var label = document.createElement('span');
                label.textContent = item.name;

                name.appendChild(dot);
                name.appendChild(label);

                var valueElement = document.createElement('strong');
                valueElement.className = 'region-tooltip-value';
                valueElement.textContent =
                  item.value === null ? '-' : numberFormat(item.value);

                row.appendChild(name);
                row.appendChild(valueElement);
                list.appendChild(row);
              });

              tooltip.appendChild(list);
              tooltip.hidden = false;

              // 그래프 끝부분에서도 툴팁이 잘리지 않도록 위치 조정
              var tooltipWidth = tooltip.offsetWidth;
              var tooltipHeight = tooltip.offsetHeight;

              var x = pointX(index) + 14;
              var y = pointY(value) - tooltipHeight / 2;

              var availableWidth = chartContainer.clientWidth;

              if (x + tooltipWidth > availableWidth - 8) {
                x = pointX(index) - tooltipWidth - 14;
              }

              x = Math.max(8, x);
              y = Math.max(8, Math.min(y, chartContainer.clientHeight - tooltipHeight - 8));

              tooltip.style.left = x + 'px';
              tooltip.style.top = y + 'px';
            }

            function hideTooltip() {
              if (tooltip) {
                tooltip.hidden = true;
              }
            }

          point.addEventListener('mouseenter', showTooltip);
          point.addEventListener('mouseleave', hideTooltip);
          point.addEventListener('focus', showTooltip);
          point.addEventListener('blur', hideTooltip);

          svg.appendChild(point);
        });
      });

      chartContainer.style.width = '100%';
      chartContainer.appendChild(svg);
    }

    /* =====================================================
       지도
       기존 map-bg.png 사용
    ===================================================== */

    var mapViewport = $('#regionMapViewport');
    var mapLayer = $('#regionMapLayer');
    var zoomIn = $('#regionMapZoomIn');
    var zoomOut = $('#regionMapZoomOut');

    var zoom = 1;
    var mapX = 0;
    var mapY = 0;

    function updateMap() {
      if (!mapLayer || !mapViewport) return;

      var maxX = (mapViewport.clientWidth * (zoom - 1)) / 2;
      var maxY = (mapViewport.clientHeight * (zoom - 1)) / 2;

      mapX = Math.max(-maxX, Math.min(maxX, mapX));
      mapY = Math.max(-maxY, Math.min(maxY, mapY));

      mapLayer.style.transform =
        'translate(' + mapX + 'px,' + mapY + 'px) ' +
        'scale(' + zoom.toFixed(2) + ')';

      if (zoomIn) zoomIn.disabled = zoom >= 3;
      if (zoomOut) zoomOut.disabled = zoom <= 1;
    }

    function changeZoom(amount) {
      zoom = Math.max(
        1,
        Math.min(3, Math.round((zoom + amount) * 100) / 100)
      );

      if (zoom === 1) {
        mapX = 0;
        mapY = 0;
      }

      updateMap();
    }

    if (zoomIn) {
      zoomIn.addEventListener('click', function () {
        changeZoom(0.2);
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', function () {
        changeZoom(-0.2);
      });
    }

    if (mapViewport) {
      var dragging = false;
      var startX = 0;
      var startY = 0;

      mapViewport.addEventListener('pointerdown', function (event) {
        if (
          zoom <= 1 ||
          event.button !== 0 ||
          event.target.closest('.region-map-controls')
        ) {
          return;
        }

        dragging = true;
        startX = event.clientX - mapX;
        startY = event.clientY - mapY;

        if (mapViewport.setPointerCapture) {
          mapViewport.setPointerCapture(event.pointerId);
        }
      });

      mapViewport.addEventListener('pointermove', function (event) {
        if (!dragging) return;

        mapX = event.clientX - startX;
        mapY = event.clientY - startY;

        updateMap();
      });

      function stopDrag() {
        dragging = false;
      }

      mapViewport.addEventListener('pointerup', stopDrag);
      mapViewport.addEventListener('pointercancel', stopDrag);
      mapViewport.addEventListener('lostpointercapture', stopDrag);

      window.addEventListener('resize', updateMap);
    }

    /*
      지도 이미지 자체에 격자/선박이 포함되어 있다면
      중복 마커를 생성하지 않습니다.
    */

    function renderMap(selected) {
      if (!mapAgency) return;

      mapAgency.textContent =
        selected.length === agencies.length
          ? '전체 지방청'
          : selected[0].name;

      /*
        현재 map-bg.png는 단일 이미지입니다.
        지방청별 지리적 필터링은 지도 API 또는
        별도 좌표/레이어 데이터 연결 후 구현해야 합니다.
      */
    }

    /* =====================================================
       화면 갱신
    ===================================================== */

    function renderPage() {
      var start = parseDate(startInput.value);
      var end = parseDate(endInput.value);

      if (!start || !end || start > end) {
        if (status) {
          status.textContent =
            '조회 시작일과 종료일을 확인해 주세요.';
        }
        return;
      }

      var days = dayCount(start, end);

      if (days > 180) {
        if (status) {
          status.textContent =
            '최대 180일까지 조회할 수 있습니다.';
        }
        return;
      }

      var selected = selectedAgencies();

      renderSummary(start, end, selected);
      renderAgencyTable(start, end);
      renderChart(start, end, selected);
      renderMap(selected);
      updatePeriodButtons();

      if (status) {
        status.textContent =
          '조회 조건이 화면에 적용되었습니다. ' +
          '현재 통계 및 지도는 시연용 데이터입니다.';
      }
    }

     updateMap();
    renderPage();

    // 브라우저 크기 변경 시 차트 다시 그리기
    window.addEventListener('resize', function () {
      var start = parseDate(startInput.value);
      var end = parseDate(endInput.value);

      if (!start || !end || start > end) return;

      renderChart(start, end, selectedAgencies());
    });
  });
})();

/* =========================================
   경보 현황판
========================================= */
(function () {
  'use strict';

  function initAlertBoard() {
    const root = document.querySelector('.alert-page');
    if (!root) return;

    const $ = (selector) => root.querySelector(selector);
    const formatNumber = (value) =>
      Math.round(value).toLocaleString('ko-KR');

    let selectedHours = 48;
    let selectedThreshold = 31;

    /* -------------------------------------
       예시 선박 데이터
    ------------------------------------- */
    const vessels = [
      ['413515677', 'LUSHOUYU60147'],
      ['412543862', 'ZHOUYUYUN862'],
      ['412337388', 'LURONGYU57708'],
      ['412337387', 'LU RONG YU57707'],
      ['412337274', 'LU RONG YU59992'],
      ['412337273', 'LURONGYU59991'],
      ['412331639', 'LURONGYU58076'],
      ['412329046', 'LUWENYU53618'],
      ['412329045', 'LUWENYU53617'],
      ['412335813', 'LURONGYU57210'],
      ['412338197', 'LUWENYU61245'],
      ['412329033', 'ZHOUYU55678'],
      ['412336229', 'LURONGYU58009'],
      ['412337066', 'LUWENYU55061'],
      ['412331690', 'ZHOUYUYUN691'],
      ['412338165', 'LURONGYU58188'],
      ['412332177', 'LUWENYU51336'],
      ['412338222', 'LURONGYU55123'],
      ['412332689', 'ZHOUYUYUN600'],
      ['412336125', 'LUWENYU59007']
    ];

    /* -------------------------------------
       최근 48시간 그래프 예시 데이터
    ------------------------------------- */
    function createChartData() {
      const result = [];

      for (let i = 0; i < 48; i++) {
        let caution;

        if (i < 16) {
          caution = 1060 - i * 11 + Math.sin(i * 0.7) * 35;
        } else if (i < 26) {
          caution = 805 + Math.sin(i * 0.5) * 35;
        } else {
          caution = 740 - (i - 26) * 3 + Math.sin(i * 0.7) * 16;
        }

        const warning = i < 16 ? 150 - i * 3 : i < 26 ? 140 : 130;
        const critical = i < 16 ? 145 - i * 2 : i < 26 ? 122 : 105;

        const area = Math.round(
          i < 16
            ? 3300 - i * 31
            : i < 26
              ? 2830 - (i - 16) * 18
              : 2540 - (i - 26) * 17
        );

        result.push({
          caution: Math.max(0, caution),
          warning,
          critical,
          area
        });
      }

      return result;
    }

    const chartData = createChartData();

    /* -------------------------------------
       날짜 표시
    ------------------------------------- */
    function getChartDate(index) {
      const date = new Date(2026, 9, 24, 13 + index);

      return {
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        hour: String(date.getHours()).padStart(2, '0')
      };
    }

    /* -------------------------------------
       SVG 그래프
    ------------------------------------- */
    function renderChart() {
      const chart = $('#alertChart');
      const tooltip = $('#alertChartTooltip');
      const viewport = $('.alert-chart-viewport');

      if (!chart || !tooltip || !viewport) return;

      const list = chartData.slice(-selectedHours);

      const width = 1500;
      const height = 236;

      const left = 46;
      const right = 46;
      const top = 24;
      const bottom = 31;

      const plotWidth = width - left - right;
      const plotHeight = height - top - bottom;

      const maxRisk = 1500;
      const maxArea = 3500;

      const step = plotWidth / list.length;
      const barWidth = Math.max(4, step * 0.75);

      let svg = `
        <svg
          viewBox="0 0 ${width} ${height}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
      `;

      /* 가로 점선과 좌우 수치 */
      for (let i = 0; i <= 5; i++) {
        const y = top + (plotHeight * i) / 5;
        const riskValue = maxRisk * (5 - i) / 5;
        const areaValue = maxArea * (5 - i) / 5;

        svg += `
          <line
            x1="${left}"
            y1="${y}"
            x2="${width - right}"
            y2="${y}"
            stroke="#8093ad"
            stroke-dasharray="3 3"
          />

          <text
            x="${left - 8}"
            y="${y + 4}"
            font-size="10"
            fill="#7184a3"
            text-anchor="end"
          >${formatNumber(riskValue)}</text>

          <text
            x="${width - right + 8}"
            y="${y + 4}"
            font-size="10"
            fill="#7184a3"
          >${formatNumber(areaValue)}</text>
        `;
      }

      let linePath = '';

      /* 누적 막대 */
      list.forEach(function (item, index) {
        const x = left + index * step + step / 2;
        let currentY = top + plotHeight;

        const segments = [
          ['caution', '#ffa000'],
          ['warning', '#ff751c'],
          ['critical', '#f44348']
        ];

        segments.forEach(function ([key, color]) {
          const barHeight = item[key] / maxRisk * plotHeight;

          currentY -= barHeight;

          svg += `
            <rect
              x="${x - barWidth / 2}"
              y="${currentY}"
              width="${barWidth}"
              height="${barHeight}"
              fill="${color}"
            />
          `;
        });

        /* 구역 분석 선박 점선 */
        const lineY = top + plotHeight -
          item.area / maxArea * plotHeight;

        linePath +=
          (index === 0 ? 'M' : ' L') +
          x.toFixed(2) + ' ' + lineY.toFixed(2);

        /* 날짜 눈금 */
        const tickInterval = Math.max(
          1,
          Math.round(list.length / 16)
        );

        if (
          index % tickInterval === 0 ||
          index === list.length - 1
        ) {
          const absoluteIndex = 48 - selectedHours + index;
          const date = getChartDate(absoluteIndex);

          svg += `
            <text
              x="${x}"
              y="${height - 10}"
              font-size="9"
              fill="#7184a3"
              text-anchor="middle"
            >${date.month}.${date.day} ${date.hour}시</text>
          `;
        }
      });

      svg += `
        <path
          d="${linePath}"
          fill="none"
          stroke="#2c8bff"
          stroke-width="2"
          stroke-dasharray="5 3"
        />
      `;

      /* 마우스 감지 영역: 그래프 최상단에 배치 */
      list.forEach(function (item, index) {
        const x = left + index * step;

        svg += `
          <rect
            class="alert-chart-hit"
            data-index="${index}"
            x="${x}"
            y="${top}"
            width="${step}"
            height="${plotHeight}"
            fill="transparent"
          />
        `;
      });

      svg += '</svg>';

      chart.innerHTML = svg;

      /* -----------------------------------
         그래프 툴팁
      ----------------------------------- */
      chart.onpointermove = function (event) {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const hit = target.closest('.alert-chart-hit');

        if (!hit) {
          tooltip.hidden = true;
          return;
        }

        const index = Number(hit.dataset.index);
        const item = list[index];

        if (!item) return;

        const absoluteIndex = 48 - selectedHours + index;
        const date = getChartDate(absoluteIndex);

        const values = [
          ['주의', item.caution, '#ffa000'],
          ['경계', item.warning, '#ff751c'],
          ['심각', item.critical, '#f44348'],
          ['구역 분석', item.area, '#2c8bff']
        ];

        tooltip.replaceChildren();

        const title = document.createElement('div');
        title.className = 'alert-tooltip-title';
        title.textContent =
          `${date.month}-${date.day} ${date.hour}시`;

        tooltip.appendChild(title);

        values.forEach(function ([name, value, color]) {
          const row = document.createElement('div');
          row.className = 'alert-tooltip-row';

          const label = document.createElement('span');
          const dot = document.createElement('i');
          dot.style.backgroundColor = color;

          label.appendChild(dot);
          label.appendChild(document.createTextNode(name));

          const number = document.createElement('b');
          number.textContent = formatNumber(value);

          row.appendChild(label);
          row.appendChild(number);

          tooltip.appendChild(row);
        });

        tooltip.hidden = false;

        const rect = viewport.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        tooltip.style.left = Math.max(
          0,
          Math.min(x + 12, rect.width - tooltipWidth)
        ) + 'px';

        tooltip.style.top = Math.max(
          0,
          Math.min(y - 16, rect.height - tooltipHeight)
        ) + 'px';
      };

      chart.onpointerleave = function () {
        tooltip.hidden = true;
      };
    }

    /* -------------------------------------
       고위험 선박 목록
    ------------------------------------- */
    function renderVesselTable() {
      const tbody = $('#alertVesselRows');
      if (!tbody) return;

      tbody.replaceChildren();

      vessels.forEach(function ([mmsi, name], index) {
        const tr = document.createElement('tr');

        const values = [
          index + 1,
          mmsi,
          name,
          index < 8 ? '심각 100' : '심각 95',
          '우리 측 EEZ',
          index < 2
            ? '10. 26. 오후 12:01'
            : '10. 26. 오후 12:00'
        ];

        values.forEach(function (value, columnIndex) {
          const td = document.createElement('td');

          if (columnIndex === 1) {
            td.className = 'alert-mmsi';
          }

          if (columnIndex === 3) {
            const badge = document.createElement('span');
            badge.className = 'alert-risk-tag';
            badge.textContent = value;
            td.appendChild(badge);
          } else {
            td.textContent = value;
          }

          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    }

    /* -------------------------------------
       시간별 고위험 증감
    ------------------------------------- */
    function renderHourlyTable() {
      const tbody = $('#alertHourlyRows');
      if (!tbody) return;

      const counts = [
        835, 902, 895, 908, 923,
        929, 945, 937, 931, 946,
        962, 977, 989, 1004, 1010
      ];

      tbody.replaceChildren();

      counts.forEach(function (count, index) {
        const previous = counts[index + 1];
        const difference = previous === undefined
          ? null
          : count - previous;

        const date = new Date(2026, 9, 26, 12 - index);

        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');

        const tr = document.createElement('tr');

        const timeTd = document.createElement('td');
        timeTd.textContent = `10. ${day}. ${hour}시`;

        const countTd = document.createElement('td');
        const countStrong = document.createElement('strong');
        countStrong.textContent = formatNumber(count);
        countTd.appendChild(countStrong);

        const diffTd = document.createElement('td');

        if (difference !== null) {
          const badge = document.createElement('span');
          badge.className =
            difference > 0 ? 'alert-up' : 'alert-down';

          badge.textContent =
            (difference > 0 ? '▲' : '▼') +
            Math.abs(difference);

          diffTd.appendChild(badge);
        } else {
          diffTd.textContent = '-';
        }

        const areaTd = document.createElement('td');
        areaTd.textContent = formatNumber(1959 + index * 15);

        tr.append(
          timeTd,
          countTd,
          diffTd,
          areaTd
        );

        tbody.appendChild(tr);
      });
    }

    /* -------------------------------------
       기간 및 위험도 선택
    ------------------------------------- */
    function updateAlertBoard() {
      root.querySelectorAll('[data-hours]').forEach(function (button) {
        const active =
          Number(button.dataset.hours) === selectedHours;

        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      root.querySelectorAll('[data-threshold]').forEach(function (button) {
        const active =
          Number(button.dataset.threshold) === selectedThreshold;

        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      const chartTitle = $('#alertChartTitle');

      if (chartTitle) {
        chartTitle.textContent =
          `시간대별 위험도 추이 — 최근 ${selectedHours}시간`;
      }

      const highCount =
        selectedThreshold === 81 ? 76 :
        selectedThreshold === 61 ? 194 : 1204;

      const statHigh = $('#alertStatHigh');

      if (statHigh) {
        statHigh.textContent = formatNumber(highCount);

        const unit = document.createElement('small');
        unit.textContent = '척';
        statHigh.appendChild(unit);
      }

      const vesselTitle = $('#alertVesselTitle');

      if (vesselTitle) {
        vesselTitle.textContent =
          `고위험 선박 상위 20척 / 전체 ${formatNumber(highCount)}척`;
      }

      renderChart();

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons({
          attrs: { 'stroke-width': 1.8 }
        });
      }
    }

    root.querySelectorAll('[data-hours]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedHours = Number(button.dataset.hours);
        updateAlertBoard();
      });
    });

    root.querySelectorAll('[data-threshold]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedThreshold = Number(button.dataset.threshold);
        updateAlertBoard();
      });
    });

    const refreshButton = $('#alertRefresh');

    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        updateAlertBoard();

        const status = $('#alertStatus');
        if (status) {
          status.textContent =
            '화면의 예시 데이터를 다시 표시했습니다.';
        }
      });
    }

    renderVesselTable();
    renderHourlyTable();
    updateAlertBoard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlertBoard);
  } else {
    initAlertBoard();
  }
})();



/* =========================================
   실시간 이벤트 페이지
   화면 구현용 예시 데이터
========================================= */

(function () {
  "use strict";

  const form = document.getElementById("eventSearchForm");
  const tableBody = document.getElementById("eventTableBody");

  if (!form || !tableBody) return;

  const periodSelect = document.getElementById("eventPeriod");
  const riskSelect = document.getElementById("eventRisk");
  const mmsiInput = document.getElementById("eventMmsi");
  const refreshButton = document.getElementById("eventRefresh");
  const autoRefresh = document.getElementById("eventAutoRefresh");
  const updatedLabel = document.getElementById("eventLastUpdated");
  const totalCount = document.getElementById("eventTotalCount");
  const panelTitle = document.getElementById("eventPanelTitle");
  const status = document.getElementById("eventStatus");

  const BASE_TIME = new Date("2026-10-26T13:04:00+09:00");

  const names = [
    "LURONGYU58177",
    "33168",
    "LUWEIJINGYU60585",
    "77777-24-99%",
    "-",
    "LUDONGGANGYU67776",
    "-",
    "LIAOCHANGYU55213",
    "LU KENYU60008",
    "JINHANYU04992",
    "LUWEIJINGYU51065",
    "-",
    "LURONGYU50102",
    "JIRENYU00867",
    "LIAODAZHONGYU15388",
    "ZHEDAIYU04126-99-73%",
    "01955-4--93%",
    "LIAOZHUANGYUYU65310",
    "LIAODAZHONGYU15290",
    "LIAOCHANGYU55291"
  ];

  const mmsis = [
    "412328341",
    "413886168",
    "412329068",
    "413300874",
    "412600531",
    "412325136",
    "412299997",
    "412204146",
    "412333761",
    "412300375",
    "412336029",
    "412329432",
    "412206254",
    "412287663",
    "412207567",
    "412600099",
    "412955004",
    "412205016",
    "412200508",
    "412201163",
    "412033169",
    "412665812",
    "412329353",
    "412327412",
    "412335302"
  ];

  const risks = [
    70, 55, 70, 40, 40,
    45, 40, 70, 70, 45,
    70, 45, 45, 45, 70,
    45, 40, 45, 70, 45,
    40, 40, 70, 70, 38
  ];

  const areas = [
    "EEZ 외",
    "영해",
    "EEZ 외",
    "특정해역 III (서남해)",
    "특정해역 IV (서해)",
    "EEZ 외",
    "특정해역 IV (서해)"
  ];

  const activities = [
    "FISHING",
    "STATIONARY",
    "FISHING",
    "STATIONARY",
    "STATIONARY",
    "SAILING",
    "SAILING"
  ];

  // 같은 데이터가 항상 같은 순서로 표시되도록 생성
  const events = Array.from({ length: 240 }, (_, index) => {
    const date = new Date(
      BASE_TIME.getTime() - Math.floor(index / 6) * 1000
    );

    const risk = risks[index % risks.length];

    return {
      id: index + 1,
      date,
      mmsi: mmsis[index % mmsis.length],
      name: names[index % names.length],
      risk,
      signal: index % 47 === 24 ? "MMSI 변조" : "",
      area: areas[index % areas.length],
      activity: activities[index % activities.length]
    };
  });

  const numberFormat = new Intl.NumberFormat("ko-KR");

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const period = hour < 12 ? "오전" : "오후";
    const displayHour = String(hour % 12 || 12).padStart(2, "0");

    return `${month}. ${day}. ${period} ${displayHour}:${minute}:${second}`;
  }

  function getRiskInfo(score) {
    if (score >= 81) {
      return { label: "심각", className: "critical" };
    }

    if (score >= 61) {
      return { label: "경계", className: "warning" };
    }

    return { label: "주의", className: "caution" };
  }

  function createCell(text, className = "") {
    const cell = document.createElement("td");
    cell.textContent = text;

    if (className) {
      cell.className = className;
    }

    return cell;
  }

  function createRow(event) {
    const row = document.createElement("tr");

    row.appendChild(createCell(formatDate(event.date)));

    const mmsiCell = document.createElement("td");
    const mmsiLink = document.createElement("a");

    mmsiLink.className = "event-mmsi-link";
    mmsiLink.href = "#";
    mmsiLink.textContent = event.mmsi;
    mmsiLink.setAttribute(
      "aria-label",
      `MMSI ${event.mmsi} 상세 조회`
    );

    // 상세 페이지 연결 전 임시 동작
    mmsiLink.addEventListener("click", function (e) {
      e.preventDefault();

      if (status) {
        status.textContent = `MMSI ${event.mmsi} 선택`;
      }
    });

    mmsiCell.appendChild(mmsiLink);
    row.appendChild(mmsiCell);

    row.appendChild(createCell(event.name));

    const riskCell = document.createElement("td");
    const riskInfo = getRiskInfo(event.risk);
    const riskBadge = document.createElement("span");

    riskBadge.className =
      `event-risk-badge ${riskInfo.className}`;
    riskBadge.textContent = `${riskInfo.label} ${event.risk}`;

    riskCell.appendChild(riskBadge);
    row.appendChild(riskCell);

    const signalCell = document.createElement("td");

    if (event.signal) {
      const signalBadge = document.createElement("span");
      signalBadge.className = "event-signal";
      signalBadge.textContent = event.signal;
      signalCell.appendChild(signalBadge);
    } else {
      signalCell.textContent = "-";
    }

    row.appendChild(signalCell);
    row.appendChild(createCell(event.area));
    row.appendChild(
      createCell(event.activity, "event-activity")
    );

    return row;
  }

  function renderEvents() {
    const period = Number(periodSelect.value);
    const risk = riskSelect.value;
    const keyword = mmsiInput.value.trim();

    const minRisk = risk === "all" ? 0 : Number(risk);

    const cutoff = new Date(
      BASE_TIME.getTime() - period * 60 * 60 * 1000
    );

    const filtered = events.filter((event) => {
      const matchPeriod = event.date >= cutoff;
      const matchRisk = event.risk >= minRisk;
      const matchMmsi =
        !keyword || event.mmsi.includes(keyword);

      return matchPeriod && matchRisk && matchMmsi;
    });

    const fragment = document.createDocumentFragment();

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 7;
      cell.className = "event-empty";
      cell.textContent = "조회 조건에 해당하는 이벤트가 없습니다.";

      row.appendChild(cell);
      fragment.appendChild(row);
    } else {
      filtered.forEach((event) => {
        fragment.appendChild(createRow(event));
      });
    }

    tableBody.replaceChildren(fragment);

    // 스크린샷의 전체 건수는 예시 표시값
    const isDefault =
      period === 6 && minRisk === 31 && keyword === "";

    const count = isDefault ? 19244 : filtered.length;

    totalCount.textContent =
      `${numberFormat.format(count)}건`;


    const titleText = panelTitle.querySelector(".event-period-text");

    if (titleText) {
      titleText.textContent =
        `위험분석 로그 — 최근 ${period}시간`;
    }

    const now = new Date();

    updatedLabel.textContent =
      `조회 ${formatDate(now)}`;

    if (status) {
      status.textContent =
        `${filtered.length}개 예시 이벤트가 표시되었습니다.`;
    }
  }

  // 제목의 기간 부분만 변경 가능하도록 설정
  const titleTextNode = document.createElement("span");
  titleTextNode.className = "event-period-text";
  titleTextNode.textContent = "위험분석 로그 — 최근 6시간";

  const existingText = Array.from(panelTitle.childNodes)
    .find((node) => node.nodeType === Node.TEXT_NODE);

  if (existingText) {
    existingText.remove();
  }

  panelTitle.insertBefore(
    titleTextNode,
    totalCount
  );

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    renderEvents();
  });

  periodSelect.addEventListener("change", renderEvents);
  riskSelect.addEventListener("change", renderEvents);

  refreshButton.addEventListener("click", renderEvents);

  let refreshTimer = null;

  function updateAutoRefresh() {
    if (refreshTimer !== null) {
      window.clearInterval(refreshTimer);
      refreshTimer = null;
    }

    if (autoRefresh.checked) {
      refreshTimer = window.setInterval(function () {
        if (!document.hidden) {
          renderEvents();
        }
      }, 30000);
    }
  }

  autoRefresh.addEventListener("change", updateAutoRefresh);

  renderEvents();
  updateAutoRefresh();
})();

/* =========================================
   LIVE 선박정보 페이지
========================================= */

(function () {
  "use strict";

  const page = document.querySelector(".live-page");

  if (!page) return;

  /* 상단 지도 유형 선택 */
  const mapTypeButtons = page.querySelectorAll("[data-map-type]");

  mapTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mapTypeButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  /* 상단 기능 버튼 */
  page.querySelectorAll("[data-live-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
      );
    });
  });

  /* 레이어 패널 접기 */
  page.querySelectorAll("[data-live-toggle]").forEach((button) => {
    const target = document.getElementById(button.dataset.liveToggle);

    if (!target) return;

    button.addEventListener("click", () => {
      const isHidden = target.hidden;

      target.hidden = !isHidden;
      button.setAttribute("aria-expanded", String(isHidden));

      const icon = button.querySelector("svg");

      if (icon) {
        icon.style.transform = isHidden ? "" : "rotate(180deg)";
      }
    });
  });

  /* 날짜 */
  const dateInput = document.getElementById("liveDateInput");
  const selectedDate = document.getElementById("liveSelectedDate");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}. ${month}. ${day}.`;
  }

  function toLocalDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (dateInput && selectedDate) {
    dateInput.addEventListener("change", () => {
      if (!dateInput.value) return;

      const date = new Date(`${dateInput.value}T00:00:00`);
      selectedDate.textContent = formatDate(date);
    });
  }

  /* 날짜 바로가기 */
  page.querySelectorAll("[data-live-days]").forEach((button) => {
    button.addEventListener("click", () => {
      const days = Number(button.dataset.liveDays);
      const date = new Date();

      date.setDate(date.getDate() - days);

      if (dateInput) {
        dateInput.value = toLocalDateValue(date);
      }

      if (selectedDate) {
        selectedDate.textContent = formatDate(date);
      }

      page.querySelectorAll("[data-live-days]").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  /* 시간 슬라이더 */
  const timeSlider = document.getElementById("liveTimeSlider");
  const timeLabel = document.getElementById("liveTimeLabel");

  if (timeSlider && timeLabel) {
    timeSlider.addEventListener("input", () => {
      timeLabel.textContent = `${timeSlider.value}시`;
    });
  }

  /* 비교 모드 */
  const compareButton = document.getElementById("liveCompareBtn");

  if (compareButton) {
    compareButton.addEventListener("click", () => {
      const active = compareButton.classList.toggle("active");

      compareButton.setAttribute("aria-pressed", String(active));
    });
  }

  /* 지도 확대/축소: 배경 연결 전 임시 UI */
  let zoomLevel = 1;

  const mapCanvas = document.getElementById("liveMapCanvas");
  const zoomIn = document.getElementById("liveZoomIn");
  const zoomOut = document.getElementById("liveZoomOut");

  function updateZoom() {
    if (!mapCanvas) return;

    mapCanvas.style.setProperty("--live-zoom", String(zoomLevel));
  }

  if (zoomIn) {
    zoomIn.addEventListener("click", () => {
      zoomLevel = Math.min(zoomLevel + 0.2, 3);
      updateZoom();
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", () => {
      zoomLevel = Math.max(zoomLevel - 0.2, 0.6);
      updateZoom();
    });
  }

  /* KST / UTC 선택 */
  let selectedTimezone = "KST";

  page.querySelectorAll("[data-zone]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTimezone = button.dataset.zone;

      page.querySelectorAll("[data-zone]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      updateClock();
    });
  });

  /* 하단 시계 */
  const clock = document.getElementById("liveClock");

  function updateClock() {
    if (!clock) return;

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: selectedTimezone === "UTC" ? "UTC" : "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });

    clock.textContent = formatter.format(now);
  }

  updateClock();
  window.setInterval(updateClock, 1000);

})();

/* =========================================
   LIVE 선박정보 - 지도 방향 초기화
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const compassBtn = document.getElementById("liveCompassBtn");
  const mapCanvas = document.getElementById("liveMapCanvas");

  if (!compassBtn || !mapCanvas) return;

  compassBtn.addEventListener("click", () => {
    // 배경 이미지 방식에서는 회전 상태가 없으므로
    // 별도 지도 엔진 연결 전까지 방향 초기화 UI로 동작
    mapCanvas.style.backgroundPosition = "center center";
  });
});


/* LIVE LAYERS 꺾쇠 펼침 상태 */

document.querySelectorAll(
  "#liveLayerBody .live-layer-toggle"
).forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));

    // 선박 하위 목록 펼치기 / 접기
    if (button.querySelector(".live-layer-name")?.textContent.trim() === "선박") {
      const children = document.querySelector(
        "#liveLayerBody .live-layer-children"
      );

      if (children) {
        children.hidden = expanded;
      }
    }
  });
});

/* ==========================================
   DARK VESSEL - TAB
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".dark-vessel-page");

  if (!page) return;

  const tabs = page.querySelectorAll(".dv-tab");
  const panels = page.querySelectorAll(".dv-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.dvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.dvPanel !== target;
      });
    });
  });
});

/* =========================================
   중국어선 분석 페이지 - 탭 전환
========================================= */

(function () {
  "use strict";

  function initChinaVesselTabs() {
    const page = document.querySelector(".china-vessel-page");

    if (!page) return;

    const tabs = Array.from(
      page.querySelectorAll("[data-cv-tab]")
    );

    const panels = Array.from(
      page.querySelectorAll("[data-cv-panel]")
    );

    if (!tabs.length || !panels.length) return;

    function activateTab(tabName) {
      tabs.forEach(function (tab) {
        const isActive = tab.dataset.cvTab === tabName;

        tab.classList.toggle("active", isActive);

        if (isActive) {
          tab.setAttribute("aria-current", "page");
        } else {
          tab.removeAttribute("aria-current");
        }
      });

      panels.forEach(function (panel) {
        const isActive = panel.dataset.cvPanel === tabName;

        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab.dataset.cvTab);
      });
    });

    activateTab("overview");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initChinaVesselTabs
    );
  } else {
    initChinaVesselTabs();
  }
})();

/* 어업형태별 탐지 탭 */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".fishery-type-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);

        if (isActive) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

/* 어구 위반 종합 탭 */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".gear-violation-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".gear-correlation-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".mother-vessel-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".ais-signal-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".illegal-sea-page");
  if (!page) return;

  const tabs = page.querySelectorAll("[data-cv-tab]");
  const panels = page.querySelectorAll("[data-cv-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cvTab;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.cvPanel !== target;
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const page = document.querySelector(".fish-page");
  if (!page) return;

  /* =========================================
     탭 메뉴
  ========================================= */

  const tabs = page.querySelectorAll("[data-fish-tab]");
  const panels = page.querySelectorAll("[data-fish-panel]");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.dataset.fishTab;

      tabs.forEach(function (item) {
        const active = item === tab;
        item.classList.toggle("active", active);

        if (active) {
          item.setAttribute("aria-current", "page");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.fishPanel !== target;
      });
    });
  });

  /* =========================================
     어종 선택
  ========================================= */

  const speciesButtons = page.querySelectorAll(".fish-species");
  let selectedSpecies = "고등어";

  speciesButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedSpecies = button.dataset.species;

      speciesButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  /* =========================================
     지도 데모 격자
     실제 FHSI 데이터 연결 전 예시
  ========================================= */

  const map = document.getElementById("fishMap");
  const grid = document.getElementById("fishMapGrid");
  const detail = document.getElementById("fishGridDetail");

  if (!map || !grid || !detail) return;

  const colors = [
    "#1e74d8",
    "#20a9d9",
    "#2fba81",
    "#e9c33c",
    "#ff9e30",
    "#ff463b"
  ];

  // 고정된 패턴을 사용해 화면을 새로고침해도 같은 격자가 표시되도록 함
  function makeScore(row, col) {
    return (row * 17 + col * 29 + row * col * 3) % 101;
  }

  function renderDemoGrid() {
    grid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    const rows = 26;
    const cols = 42;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {

        // 지도 동쪽 해역을 따라 격자 분포를 구성
        const center =
          26 + Math.sin(row * 0.27) * 4;

        const distance = Math.abs(col - center);

        if (distance > 11) continue;

        const score = makeScore(row, col);
        const colorIndex = Math.min(
          colors.length - 1,
          Math.floor(score / 17)
        );

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "fish-grid-cell";
        cell.style.left = `${(col / cols) * 100}%`;
        cell.style.top = `${(row / rows) * 100}%`;
        cell.style.backgroundColor = colors[colorIndex];

        cell.dataset.score = String(score);
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        cell.setAttribute(
          "aria-label",
          `예시 격자 ${row + 1}행 ${col + 1}열, FHSI ${score}`
        );

        cell.addEventListener("click", function () {
          const currentScore = Number(cell.dataset.score);

          detail.innerHTML = `
            <strong>선택 격자 정보 (예시)</strong>
            <div style="margin-top:10px">
              <p>어종: ${selectedSpecies}</p>
              <p>격자 위치: ${row + 1}행 / ${col + 1}열</p>
              <p>FHSI 점수: <strong>${currentScore}</strong></p>
              <p>어장 가능성:
                <strong>
                  ${currentScore >= 75
                    ? "높음"
                    : currentScore >= 50
                      ? "보통"
                      : "낮음"}
                </strong>
              </p>
              <p style="margin-top:10px;color:#71829d">
                실제 수온·염록소·염분·해류 정보는
                분석 API 연결 후 표시됩니다.
              </p>
            </div>
          `;
        });

        fragment.appendChild(cell);
      }
    }

    grid.appendChild(fragment);
  }

  renderDemoGrid();

  /* =========================================
     지도 레이어 체크박스
  ========================================= */

  const showGrid = document.getElementById("fishShowGrid");
  const showFleet = document.getElementById("fishShowFleet");
  const showEffort = document.getElementById("fishShowEffort");

  if (showGrid) {
    showGrid.addEventListener("change", function () {
      grid.hidden = !showGrid.checked;
    });
  }

  // 전선대 / 조업노력은 실제 지도 레이어 연결 시 적용
  if (showFleet) {
    showFleet.addEventListener("change", function () {
      map.dataset.showFleet = String(showFleet.checked);
    });
  }

  if (showEffort) {
    showEffort.addEventListener("change", function () {
      map.dataset.showEffort = String(showEffort.checked);
    });
  }

  /* =========================================
     지도 확대 / 축소 (데모 격자)
  ========================================= */

  let zoom = 1;

  const zoomIn = document.getElementById("fishZoomIn");
  const zoomOut = document.getElementById("fishZoomOut");

  function updateZoom() {
    grid.style.transform = `scale(${zoom})`;
    grid.style.transformOrigin = "center center";
  }

  if (zoomIn) {
    zoomIn.addEventListener("click", function () {
      zoom = Math.min(zoom + 0.2, 2);
      updateZoom();
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", function () {
      zoom = Math.max(zoom - 0.2, 0.6);
      updateZoom();
    });
  }

  /* =========================================
     데이터 조회 (데모)
  ========================================= */

  const searchButton = document.getElementById("fishSearchButton");

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      renderDemoGrid();

      detail.textContent =
        `${selectedSpecies} 기준 예시 격자를 표시했습니다. ` +
        "실제 데이터 조회는 분석 API 연결 후 사용할 수 있습니다.";
    });
  }
});


/* =========================================
   중국항만 — 의심 항만·입항 분석
   화면 구현용 예시 데이터
========================================= */

(() => {
  "use strict";

  const root = document.querySelector(".china-port-page");
  if (!root) return;

  const ports = [
    {
      id: "sha",
      name: "사먼항",
      chinese: "厦门港",
      code: "CNXMN/CNXMG",
      location: "福建省 厦门市",
      lat: 24.48,
      lng: 118.08,
      visits: 91,
      suspicious: 90,
      duration: 67618,
      priority: "상",
      market: "사먼 국제수산성"
    },
    {
      id: "sang",
      name: "상하이항",
      chinese: "上海港",
      code: "CNSHA/CNSHG",
      location: "上海市",
      lat: 31.23,
      lng: 121.49,
      visits: 23,
      suspicious: 23,
      duration: 75336.9,
      priority: "중",
      market: "상하이 수산물 도매시장"
    },
    {
      id: "zhou",
      name: "저우산항",
      chinese: "舟山港",
      code: "CNZOS",
      location: "浙江省 舟山市",
      lat: 29.98,
      lng: 122.21,
      visits: 21,
      suspicious: 20,
      duration: 101918,
      priority: "최우선",
      market: "저우산 국제수산성"
    },
    {
      id: "ning",
      name: "닝보·저우산항",
      chinese: "宁波舟山港",
      code: "CNNGB/CNZOS",
      location: "浙江省 宁波市",
      lat: 29.87,
      lng: 121.55,
      visits: 12,
      suspicious: 12,
      duration: 82125.9,
      priority: "최우선",
      market: "닝보 수산물 도매시장"
    },
    {
      id: "qing",
      name: "칭다오항",
      chinese: "青岛港",
      code: "CNQDG",
      location: "山东省 青岛市",
      lat: 36.07,
      lng: 120.38,
      visits: 6,
      suspicious: 6,
      duration: 83910.2,
      priority: "최우선",
      market: "칭다오 청양 수산물 도매시장"
    },
    {
      id: "dalian",
      name: "다롄항",
      chinese: "大连港",
      code: "CNDLC/CNDAL",
      location: "辽宁省 大连市",
      lat: 38.91,
      lng: 121.61,
      visits: 3,
      suspicious: 2,
      duration: 102926.6,
      priority: "상",
      market: "다롄 라오후 수산물시장"
    },
    {
      id: "weihai",
      name: "웨이하이항",
      chinese: "威海港",
      code: "CNWEI",
      location: "山东省 威海市",
      lat: 37.5,
      lng: 122.12,
      visits: 2,
      suspicious: 2,
      duration: 82762.6,
      priority: "최우선",
      market: "웨이하이 수산물 도매시장"
    },
    {
      id: "yantai",
      name: "옌타이항",
      chinese: "烟台港",
      code: "CNYNT/CNYTG",
      location: "山东省 烟台市",
      lat: 37.46,
      lng: 121.45,
      visits: 2,
      suspicious: 2,
      duration: 99878.5,
      priority: "최우선",
      market: "옌타이 하이중바오 해산물 거래센터"
    },
    {
      id: "rizhao",
      name: "르자오항",
      chinese: "日照港",
      code: "CNNZ",
      location: "山东省 日照市",
      lat: 35.42,
      lng: 119.53,
      visits: 1,
      suspicious: 1,
      duration: 64086.8,
      priority: "중",
      market: "르자오 수산물시장"
    },
    {
      id: "lianyungang",
      name: "롄윈강항",
      chinese: "连云港",
      code: "CNLYG",
      location: "江苏省 连云港市",
      lat: 34.75,
      lng: 119.46,
      visits: 0,
      suspicious: 0,
      duration: 0,
      priority: "중",
      market: "롄윈강 수산물시장"
    },
    {
      id: "fangcheng",
      name: "팡청강항",
      chinese: "防城港",
      code: "CNFZG",
      location: "广西壮族自治区",
      lat: 21.61,
      lng: 108.35,
      visits: 0,
      suspicious: 0,
      duration: 0,
      priority: "상",
      market: "팡청강 수산물시장"
    },
    {
      id: "qinzhou",
      name: "친저우항",
      chinese: "钦州港",
      code: "CNQZJ",
      location: "广西壮族自治区",
      lat: 21.96,
      lng: 108.65,
      visits: 0,
      suspicious: 0,
      duration: 0,
      priority: "중",
      market: "친저우 수산물시장"
    }
  ];

  const network = [
    ["ZHOUDU6", "412410230", "passenger", "저우산항", "의심"],
    ["LUN DU 20", "413694950", "passenger", "사먼항", "의심"],
    ["ZHOU DU 3", "412422970", "passenger", "저우산항", "의심"],
    ["413696820", "413696820", "inactive", "사먼항", "의심"],
    ["ZHOUDU17", "413400540", "passenger", "저우산항", "의심"],
    ["305730000", "305730000", "cargo", "다롄항", "일반"],
    ["SHIBOKEDU16", "413761429", "passenger", "상하이항", "의심"],
    ["352333000", "352333000", "cargo", "저우산항", "일반"],
    ["XIN SHUN QING 1", "413725690", "fishing", "닝보·저우산항", "의심"]
  ];

  const markets = [
    ["저장성", "저우산항 · 선자먼항 · 닝보·저우산항", "저우산 국제수산성"],
    ["저장성", "닝보항 · 베이룬항 · 전하이항", "닝보 수산물 도매시장, 루린시장"],
    ["산둥성", "칭다오항", "칭다오 청양 청산·수산물 도매시장"],
    ["산둥성", "웨이하이항", "웨이하이 수산물 도매시장"],
    ["랴오닝성", "다롄항 · 다롄항", "다롄 라오후 국제수산물시장"],
    ["산둥성", "옌타이항", "옌타이 하이중바오 해산물 거래센터"],
    ["푸젠성", "푸저우항 · 마웨이항", "푸저우 명성 해협 수산물 거래센터"],
    ["푸젠성", "사먼항", "사먼 사상 국제수산물 거래센터"]
  ];

  const $ = (selector) => root.querySelector(selector);

  const priorityClass = (priority) => {
    if (priority === "최우선") return "cp-red";
    if (priority === "상") return "cp-orange";
    return "cp-yellow";
  };

  const pill = (label, className) =>
    `<span class="cp-pill ${className}">${label}</span>`;

  const format = (number) =>
    Number(number).toLocaleString("ko-KR", {
      maximumFractionDigits: 1
    });

  /* ---------------------------------------
     항만 순위
  --------------------------------------- */

  function renderRanking() {
    $("#cpRankingBody").innerHTML = ports.map((port, index) => `
      <tr data-port="${port.id}" tabindex="0"
          aria-label="${port.name} 지도에서 선택">
        <td>${index + 1}</td>
        <td>
          <strong>${port.name}</strong>
          <small>${port.code}</small>
        </td>
        <td>${port.visits}</td>
        <td>${port.suspicious
          ? pill(port.suspicious, "cp-red")
          : "0"}</td>
        <td>${port.duration ? format(port.duration) : "-"}</td>
        <td>0</td>
        <td>${pill(port.priority, priorityClass(port.priority))}</td>
      </tr>
    `).join("");
  }

  /* ---------------------------------------
     타임라인
  --------------------------------------- */

  function renderTimeline() {
    const timelinePorts = ports.filter((port) => port.visits > 0);

    $("#cpTimelineBody").innerHTML = timelinePorts.map((port) => {
      const values = port.id === "ning"
        ? [0, 0, 0, 0, 0, 1, 0]
        : [0, 0, 0, 0, 0, 0, 0];

      return `
        <tr>
          <td>${port.name} (${port.visits})</td>
          ${values.map((value) => `
            <td>${value ? pill(value, "cp-red") : "·"}</td>
          `).join("")}
        </tr>
      `;
    }).join("");
  }

  /* ---------------------------------------
     선박 네트워크
  --------------------------------------- */

  function renderNetwork() {
    $("#cpNetworkBody").innerHTML = network.map((item) => `
      <tr>
        <td>
          <strong>${item[0]}</strong>
          <small>${item[1]}</small>
        </td>
        <td>${item[2]}</td>
        <td>${item[3]}</td>
        <td>${pill("1회", "cp-neutral")}</td>
        <td>${pill(
          item[4],
          item[4] === "의심" ? "cp-red" : "cp-neutral"
        )}</td>
      </tr>
    `).join("");
  }

  /* ---------------------------------------
     어시장 매핑
  --------------------------------------- */

  function renderMarkets() {
    $("#cpMarketBody").innerHTML = markets.map((item, index) => `
      <tr data-market="${index}" tabindex="0"
          aria-label="${item[0]} ${item[2]} 상세 보기">
        <td>${item[0]}</td>
        <td>${item[1]}</td>
        <td>${item[2]}</td>
      </tr>
    `).join("");
  }

  function showMarket(index) {
    const item = markets[index];
    if (!item) return;

    $("#cpMarketDetailTitle").textContent =
      `${item[0]} — ${item[2]}`;

    $("#cpMarketDetailText").textContent =
      `연결 후보 항만: ${item[1]}. ` +
      "지리적 권역에 따른 연결 후보이며 실제 어획물 거래가 확인된 관계는 아닙니다.";

    $("#cpMarketDetail").hidden = false;
  }

  /* ---------------------------------------
     지도
  --------------------------------------- */

  let map = null;
  const markers = new Map();

  function selectPort(portId, moveMap = true) {
    const port = ports.find((item) => item.id === portId);
    if (!port) return;

    $("#cpPortName").textContent = port.name;
    $("#cpPortChinese").textContent = port.chinese;
    $("#cpPortPriority").textContent = port.priority;
    $("#cpPortPriority").className =
      `cp-pill ${priorityClass(port.priority)}`;

    $("#cpPortCode").textContent = port.code;
    $("#cpPortLocation").textContent = port.location;
    $("#cpPortRadius").textContent = "10 km";
    $("#cpPortVisits").textContent =
      `${port.visits} / ${port.suspicious}건`;
    $("#cpPortDuration").textContent =
      port.duration ? `${format(port.duration)} h` : "-";
    $("#cpPortNote").textContent =
      `연결 어시장 — ${port.market}`;

    root.querySelectorAll("[data-port]").forEach((row) => {
      row.setAttribute(
        "aria-selected",
        String(row.dataset.port === portId)
      );
    });

    if (map && moveMap) {
      map.flyTo([port.lat, port.lng], 7, {
        duration: 0.7
      });
    }
  }

  function initializeMap() {
  const mapContainer = document.querySelector("#cpMap");

  if (!mapContainer) return;

  // 중국항만 페이지는 Leaflet 대신 캡처 이미지 사용
  mapContainer.innerHTML = `
    <img
      id="cpMapImage"
      src="./img/chinese-port-map.png"
      alt="중국 동부 연안 주요 항만 지도"
      draggable="false"
    >
  `;

  let scale = 1;

  const mapImage = mapContainer.querySelector("#cpMapImage");

  // 확대 / 축소 버튼
  const zoomControls = document.createElement("div");
  zoomControls.className = "cp-map-zoom";
  zoomControls.setAttribute("role", "group");
  zoomControls.setAttribute("aria-label", "지도 확대 및 축소");

  zoomControls.innerHTML = `
    <button type="button" class="cp-zoom-in" aria-label="지도 확대">+</button>
    <button type="button" class="cp-zoom-out" aria-label="지도 축소">−</button>
  `;

  mapContainer.appendChild(zoomControls);

  const zoomIn = zoomControls.querySelector(".cp-zoom-in");
  const zoomOut = zoomControls.querySelector(".cp-zoom-out");

  function updateZoom() {
    mapImage.style.transform = `scale(${scale})`;
    zoomIn.disabled = scale >= 3;
    zoomOut.disabled = scale <= 1;
  }

  zoomIn.addEventListener("click", () => {
    scale = Math.min(3, scale + 0.2);
    updateZoom();
  });

  zoomOut.addEventListener("click", () => {
    scale = Math.max(1, scale - 0.2);
    updateZoom();
  });

  updateZoom();

  selectPort("zhou", false);
}

  /* ---------------------------------------
     SVG 차트
  --------------------------------------- */

  function renderHorizontalChart(container, data, options = {}) {
    const width = 520;
    const left = 80;
    const right = 40;
    const top = 10;
    const rowHeight = 19;
    const plotWidth = width - left - right;
    const max = options.max || Math.max(...data.map((item) => item.value));
    const height = top + data.length * rowHeight + 24;

    const escapeXml = (value) =>
      String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;"
      })[char]);

    let svg = `
      <svg viewBox="0 0 ${width} ${height}"
           role="img"
           aria-label="${escapeXml(options.label || "막대그래프")}">
    `;

    for (let i = 0; i <= 6; i++) {
      const x = left + plotWidth * i / 6;
      const value = max * i / 6;

      svg += `
        <line x1="${x}" y1="${top}" x2="${x}"
              y2="${height - 20}"
              stroke="#b6c5d9" stroke-dasharray="3 3"/>
        <text x="${x}" y="${height - 5}"
              text-anchor="middle" font-size="9"
              fill="#647895">${options.percent
                ? Math.round(value) + "%"
                : Math.round(value).toLocaleString()}</text>
      `;
    }

    data.forEach((item, index) => {
      const y = top + index * rowHeight + 3;
      const barWidth = Math.max(0, plotWidth * item.value / max);

      svg += `
        <text x="${left - 5}" y="${y + 9}"
              text-anchor="end" font-size="10"
              fill="#647895">${escapeXml(item.name)}</text>
        <rect x="${left}" y="${y}" width="${barWidth}"
              height="12" rx="1"
              fill="${options.color || "#3b82f6"}"/>
      `;

      if (!options.percent) {
        svg += `
          <text x="${Math.min(left + barWidth + 4, width - 36)}"
                y="${y + 9}" font-size="9"
                fill="#334968">${escapeXml(format(item.value))}h</text>
        `;
      }
    });

    svg += "</svg>";
    container.innerHTML = svg;
  }

  function renderCharts() {
    const durationPorts = [...ports]
      .filter((port) => port.duration > 0)
      .sort((a, b) => b.duration - a.duration);

    renderHorizontalChart(
      $("#cpDurationChart"),
      durationPorts.map((port) => ({
        name: port.name,
        value: port.duration
      })),
      {
        max: 120000,
        color: "#3b82f6",
        label: "항만별 평균 체류 시간"
      }
    );

    renderHorizontalChart(
      $("#cpDistributionChart"),
      durationPorts.map((port) => ({
        name: port.name,
        value: 100
      })),
      {
        max: 100,
        percent: true,
        color: "#06b6d4",
        label: "항만별 장기 체류 비율"
      }
    );
  }

  /* ---------------------------------------
     이벤트
  --------------------------------------- */

  function activateRow(event, selector, callback) {
    const row = event.target.closest(selector);
    if (!row) return;

    if (event.type === "keydown" &&
        event.key !== "Enter" &&
        event.key !== " ") return;

    if (event.type === "keydown") event.preventDefault();

    callback(row);
  }

  $("#cpRankingBody").addEventListener("click", (event) => {
    activateRow(event, "tr[data-port]", (row) =>
      selectPort(row.dataset.port)
    );
  });

  $("#cpRankingBody").addEventListener("keydown", (event) => {
    activateRow(event, "tr[data-port]", (row) =>
      selectPort(row.dataset.port)
    );
  });

  $("#cpMarketBody").addEventListener("click", (event) => {
    activateRow(event, "tr[data-market]", (row) =>
      showMarket(Number(row.dataset.market))
    );
  });

  $("#cpMarketBody").addEventListener("keydown", (event) => {
    activateRow(event, "tr[data-market]", (row) =>
      showMarket(Number(row.dataset.market))
    );
  });

  $("#cpMarketClose").addEventListener("click", () => {
    $("#cpMarketDetail").hidden = true;
  });

  $("#cpRefresh").addEventListener("click", () => {
    renderRanking();
    renderTimeline();
    renderNetwork();
    renderMarkets();
    renderCharts();
    selectPort("zhou", false);

    if (map) map.invalidateSize();
  });

  $("#cpPeriod").addEventListener("change", () => {
    // 기간별 API 데이터 연동 전까지는 예시 데이터 유지
    $("#cpRefresh").click();
  });

  /* ---------------------------------------
     초기화
  --------------------------------------- */

  renderRanking();
  renderTimeline();
  renderNetwork();
  renderMarkets();
  renderCharts();
  initializeMap();

})();



/* =========================================
   중국어시장물가 / 수산시장 연계 분석
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".china-market-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);



  /* 어종별 가격 - 화면 구현용 예시 데이터 */
  const prices = [
    {
      name: "갈치", chinese: "大带鱼", code: "LHT", watch: "A",
      price: "41.82 元/公斤", previous: "44.28",
      change: -5.56, group: "갈치류"
    },
    {
      name: "부세", chinese: "大黄花鱼", code: "LYC", watch: "A",
      price: "45.80 元/公斤", previous: "48.35",
      change: -5.27, group: "조기류"
    },
    {
      name: "대두어", chinese: "花鲢活鱼", code: "BHC", watch: "B",
      price: "17.39 元/公斤", previous: "16.94",
      change: 2.68, group: "기타담수어류"
    },
    {
      name: "백련어", chinese: "白鲢活鱼", code: "SVC", watch: "B",
      price: "10.25 元/公斤", previous: "9.97",
      change: 2.79, group: "기타담수어류"
    },
    {
      name: "살오징어", chinese: "太平洋褶柔鱼 / 鱿鱼 / 鲜鱿鱼",
      code: "SQJ", watch: "A",
      price: "—", previous: "—",
      change: null, group: "오징어류"
    }
  ];

  const priceBody = $("#cmPriceBody");
  const pageInfo = $("#cmPageInfo");
  const prevPage = $("#cmPrevPage");
  const nextPage = $("#cmNextPage");

  let page = 1;
  const pageSize = 5;

  function changeBadge(change) {
    if (change === null) return "오늘 값 없음";

    const isDown = change < 0;
    const color = isDown ? "cm-blue" : "cm-yellow";
    const arrow = isDown ? "▼" : "▲";

    return `<span class="cm-badge ${color}">
      ${arrow} ${Math.abs(change).toFixed(2)}%
    </span>`;
  }

  function renderPrices() {
    if (!priceBody) return;

    const pages = Math.ceil(prices.length / pageSize);
    const rows = prices.slice((page - 1) * pageSize, page * pageSize);

    priceBody.innerHTML = rows.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.chinese}</td>
        <td>${item.code}</td>
        <td><span class="cm-badge ${item.watch === "A" ? "cm-red" : "cm-neutral"}">
          ${item.watch}</span></td>
        <td>${item.price}</td>
        <td>${item.previous}</td>
        <td>${changeBadge(item.change)}</td>
        <td>${item.group}</td>
      </tr>
    `).join("");

    if (pageInfo) {
      pageInfo.textContent = `${page} / ${pages} · 전체 ${prices.length}종`;
    }
    if (prevPage) prevPage.disabled = page === 1;
    if (nextPage) nextPage.disabled = page === pages;
  }

  prevPage?.addEventListener("click", () => {
    if (page > 1) {
      page--;
      renderPrices();
    }
  });

  nextPage?.addEventListener("click", () => {
    if (page < Math.ceil(prices.length / pageSize)) {
      page++;
      renderPrices();
    }
  });

  renderPrices();

  /* 수산시장 목록 - 화면 구현용 예시 데이터 */
  const markets = [
    ["광저우 황사수산시장", "广州黄沙水产交易市场", "广东省", "—"],
    ["베이징 징성해선시장", "北京大红门京深海鲜批发市场", "北京市", "—"],
    ["상하이 강양수산시장", "上海江阳水产市场", "上海市", "상하이항"],
    ["주산 국제수산성", "舟山国际水产城", "浙江省", "—"],
    ["복주 해협수산교역센터", "福州海峡水产品交易中心", "福建省", "—"],
    ["대련 요어국제수산시장", "大连辽渔国际水产品市场", "辽宁省", "—"],
    ["청도 사자구 어항", "青岛沙子口国家中心渔港", "山东省", "—"],
    ["주해 백등두수산시장", "珠海白藤头水产品批发市场", "广东省", "—"],
    ["삼아 기차마리해선광장", "三亚海鲜广场", "海南省", "—"]
  ];

  const marketBody = $("#cmMarketBody");

  if (marketBody) {
    marketBody.innerHTML = markets.map((market, index) => `
      <tr tabindex="0" data-index="${index}"
        aria-label="${market[0]} 선택">
        <td><strong>${market[0]}</strong><small>${market[1]}</small></td>
        <td>${market[2]}</td>
        <td>${market[3]}</td>
        <td><span class="cm-badge cm-red">주요</span></td>
      </tr>
    `).join("");

    function selectMarket(row) {
      marketBody.querySelectorAll("tr").forEach((item) => {
        item.classList.toggle("is-selected", item === row);
      });
    }

    marketBody.addEventListener("click", (event) => {
      const row = event.target.closest("tr[data-index]");
      if (row) selectMarket(row);
    });

    marketBody.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const row = event.target.closest("tr[data-index]");
      if (!row) return;
      event.preventDefault();
      selectMarket(row);
    });
  }

  /* 지도 확대 / 축소 / 드래그 */
  const viewport = $("#cmMapViewport");
  const image = $("#cmMapImage");
  const zoomIn = $("#cmZoomIn");
  const zoomOut = $("#cmZoomOut");

  if (viewport && image) {
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;

    function clampOffset() {
      const maxX = viewport.clientWidth * (scale - 1) / 2;
      const maxY = viewport.clientHeight * (scale - 1) / 2;

      offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
      offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
    }

    function updateMap() {
      clampOffset();
      image.style.transform =
        `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

      image.style.cursor = scale > 1
        ? (dragging ? "grabbing" : "grab")
        : "default";

      if (zoomIn) zoomIn.disabled = scale >= 3;
      if (zoomOut) zoomOut.disabled = scale <= 1;
    }

    function setZoom(delta) {
      scale = Math.max(1, Math.min(3, Math.round((scale + delta) * 100) / 100));

      if (scale === 1) {
        offsetX = 0;
        offsetY = 0;
      }

      updateMap();
    }

    zoomIn?.addEventListener("click", () => setZoom(0.25));
    zoomOut?.addEventListener("click", () => setZoom(-0.25));

    viewport.addEventListener("pointerdown", (event) => {
      if (scale <= 1 || event.button !== 0) return;
      dragging = true;
      startX = event.clientX - offsetX;
      startY = event.clientY - offsetY;
      viewport.setPointerCapture(event.pointerId);
      updateMap();
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      offsetX = event.clientX - startX;
      offsetY = event.clientY - startY;
      updateMap();
    });

    function stopDragging() {
      dragging = false;
      updateMap();
    }

    viewport.addEventListener("pointerup", stopDragging);
    viewport.addEventListener("pointercancel", stopDragging);
    window.addEventListener("resize", updateMap);

    image.addEventListener("dragstart", (event) => event.preventDefault());
    updateMap();
  }

  /* 갱신: 정적 시안이므로 재렌더링만 수행 */
  $("#cmRefresh")?.addEventListener("click", () => {
    renderPrices();
  });

  /* 하단 바로가기: 공통 메뉴의 해당 항목으로 이동 */
  function focusSidebarItem(label) {
    const item = [...document.querySelectorAll(".sidebar-submenu .nav-item")]
      .find((element) => element.querySelector("span")?.textContent.trim() === label);

    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      item.focus();
    }
  }

  $("#cmGoPorts")?.addEventListener("click", () => focusSidebarItem("중국항만"));
  $("#cmGoNetwork")?.addEventListener("click", () => focusSidebarItem("공급망그래프"));
});



/* ==========================================
   중국선단관계분석
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".china-network-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);

  /* 보기 탭 */
  const tabs = root.querySelectorAll("[data-cn-view]");
  const graphStage = $("#cnGraphStage");
  const listView = $("#cnListView");
  const reportView = $("#cnReportView");
  const locationPopup = $("#cnLocationPopup");

  function switchView(view) {
    tabs.forEach((tab) => {
      const active = tab.dataset.cnView === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    graphStage.hidden = view !== "graph";
    listView.hidden = view !== "list";
    reportView.hidden = view !== "report";

    if (locationPopup) {
      locationPopup.hidden = view !== "graph";
    }
  }


  /* 우측 선단 선택 */
  root.querySelectorAll(".cn-fleet-item").forEach((item) => {
    item.addEventListener("click", () => {
      root.querySelectorAll(".cn-fleet-item").forEach((button) => {
        button.classList.remove("is-selected");
      });

      item.classList.add("is-selected");

      switchView("graph");

      if (locationPopup) {
        locationPopup.hidden = false;
      }
    });
  });

  /* 위치 팝업 닫기 */
  $("#cnPopupClose")?.addEventListener("click", () => {
    if (locationPopup) locationPopup.hidden = true;
  });

  /* 관계 강도 슬라이더 */
  const minInput = $("#cnRelationMin");
  const maxInput = $("#cnRelationMax");
  const minOutput = $("#cnMinValue");
  const maxOutput = $("#cnMaxValue");

  function updateRange() {
    if (!minInput || !maxInput) return;

    let min = Number(minInput.value);
    let max = Number(maxInput.value);

    if (min > max) {
      if (document.activeElement === minInput) {
        max = min;
        maxInput.value = String(max);
      } else {
        min = max;
        minInput.value = String(min);
      }
    }

    if (minOutput) minOutput.textContent = String(min);
    if (maxOutput) maxOutput.textContent = String(max);
  }

  minInput?.addEventListener("input", updateRange);
  maxInput?.addEventListener("input", updateRange);

  /* 전체 화면 */
  const graphCard = $(".cn-graph-card");

  $("#cnFullscreen")?.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (graphCard?.requestFullscreen) {
        await graphCard.requestFullscreen();
      }
    } catch (error) {
      console.warn("전체 화면 전환 실패:", error);
    }
  });

  /* 필터 초기화 */
  $("#cnReset")?.addEventListener("click", () => {
    ["#cnNetworkType", "#cnFleet", "#cnOwner", "#cnPort"].forEach((selector) => {
      const select = $(selector);
      if (select) select.selectedIndex = 0;
    });

    root.querySelectorAll(".cn-risk-field input").forEach((checkbox, index) => {
      checkbox.checked = index === 0;
    });

    if (minInput) minInput.value = "0.3";
    if (maxInput) maxInput.value = "1";

    $("#cnStartDate").value = "2026-09-26";
    $("#cnEndDate").value = "2026-10-26";

    updateRange();
  });

  /* 정적 시안: 실행 버튼은 현재 설정을 유지 */
  $("#cnGenerate")?.addEventListener("click", () => {
    switchView("graph");
  });

  /* 하이리스크 AIS: 높은 위험등급 체크 */
  $("#cnRiskAis")?.addEventListener("click", () => {
    const boxes = root.querySelectorAll(".cn-risk-field input");
    boxes.forEach((checkbox, index) => {
      checkbox.checked = index === 0;
    });
  });

  updateRange();
  switchView("graph");
});


document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".risk-history-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);

  const periodSelect = $("#rhPeriod");
  const dateSelect = $("#rhDate");
  const typeSelect = $("#rhType");
  const gradeSelect = $("#rhGrade");
  const searchInput = $("#rhSearch");

  const chartBars = $("#rhChartBars");
  const chartContainer = $("#rhChartContainer");
  const tooltip = $("#rhChartTooltip");
  const tableBody = $("#rhTableBody");
  const pagination = $("#rhPagination");

  const PAGE_SIZE = 15;
  const TYPES = ["불법어선", "범죄선박", "불법어구"];

  const colors = {
    불법어선: "vessel",
    범죄선박: "crime",
    불법어구: "gear"
  };

  let currentPage = 1;

  // 첨부 이미지 기준 시안용 날짜별 데이터
  const dailyData = [
    [1,0,2], [0,1,2], [0,1,2], [0,1,2],
    [3,2,2], [4,2,1], [3,2,2], [2,2,3],
    [1,2,4], [3,1,3], [3,2,2], [4,1,2],
    [2,3,2], [3,2,2], [2,3,2], [2,2,3],
    [2,4,1], [1,4,2], [3,2,2], [2,1,4],
    [2,2,3], [1,3,3], [3,3,1], [2,1,0],
    [2,0,1], [2,0,1], [2,0,1], [1,1,1],
    [1,2,0], [1,2,0]
  ].map((values, index) => {
    const date = new Date(2026, 8, 27 + index);
    const iso = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");

    return {
      date: iso,
      vessel: values[0],
      crime: values[1],
      gear: values[2]
    };
  });

  // 첨부 이미지에 표시된 이력 15건
  const initialRows = [
    ["2026-10-26","불법어선","서해 남부","W:71_49",93,"412608829"],
    ["2026-10-26","범죄선박","서해 북부","W:91_57",63,"440737754"],
    ["2026-10-26","범죄선박","서해 중부","W:96_66",33,"440237956"],
    ["2026-10-25","불법어선","서해 중부","W:65_49",62,"412340103"],
    ["2026-10-25","범죄선박","서해 중부","W:64_65",60,"440349822"],
    ["2026-10-25","범죄선박","EEZ 경계","W:78_46",29,"440258781"],
    ["2026-10-24","불법어구","서해 중부","W:60_55",93,"441279606"],
    ["2026-10-24","범죄선박","NLL 인근","W:77_42",58,"440861888"],
    ["2026-10-24","불법어선","서해 북부","W:99_48",30,"412971377"],
    ["2026-10-23","불법어구","EEZ 경계","W:82_65",89,"441300430"],
    ["2026-10-23","불법어선","NLL 인근","W:93_48",66,"412702651"],
    ["2026-10-23","불법어선","EEZ 경계","W:91_50",55,"412473955"],
    ["2026-10-22","불법어구","서해 중부","W:64_44",85,"441321255"],
    ["2026-10-22","불법어선","서해 중부","W:64_58",53,"412986021"],
    ["2026-10-22","불법어선","서해 남부","W:87_47",35,"412433926"]
  ];

  const areas = ["서해 남부", "서해 북부", "서해 중부", "EEZ 경계", "NLL 인근"];

  // 시안용 총 166건 구성
  const records = initialRows.map(makeRecord);

  for (let i = records.length; i < 166; i++) {
    const day = dailyData[29 - (i % 30)];
    const type = TYPES[i % 3];
    const score = 20 + ((i * 17 + 23) % 80);

    records.push(makeRecord([
      day.date,
      type,
      areas[(i * 3) % areas.length],
      `W:${60 + (i % 40)}_${40 + ((i * 7) % 30)}`,
      score,
      String(type === "불법어선" ? 412000000 + i * 2371 :
             type === "범죄선박" ? 440000000 + i * 1739 :
             441000000 + i * 1913)
    ]));
  }

  function getGrade(score) {
    if (score >= 80) return "심각";
    if (score >= 60) return "경계";
    if (score >= 40) return "주의";
    return "관심";
  }

  function makeRecord(row) {
    return {
      date: row[0],
      type: row[1],
      area: row[2],
      grid: row[3],
      score: row[4],
      mmsi: row[5],
      grade: getGrade(row[4])
    };
  }

  function getGradeClass(grade) {
    return {
      "심각": "critical",
      "경계": "warning",
      "주의": "caution",
      "관심": "interest"
    }[grade];
  }

  // 일자 선택 옵션
  [...dailyData].reverse().forEach(day => {
    const option = document.createElement("option");
    option.value = day.date;
    option.textContent = day.date;
    dateSelect.appendChild(option);
  });

  function getPeriodStart() {
    if (periodSelect.value === "all") return null;
    const days = Number(periodSelect.value);
    const start = new Date(2026, 9, 26);
    start.setDate(start.getDate() - days + 1);
    return start.toISOString().slice(0, 10);
  }

  function filteredRecords() {
    const query = searchInput.value.trim().toLowerCase();
    const start = getPeriodStart();

    return records.filter(row => {
      if (start && row.date < start) return false;
      if (dateSelect.value !== "all" && row.date !== dateSelect.value) return false;
      if (typeSelect.value !== "all" && row.type !== typeSelect.value) return false;
      if (gradeSelect.value !== "all" && row.grade !== gradeSelect.value) return false;

      if (query) {
        const text = [
          row.date, row.type, row.area, row.grid,
          row.score, row.grade, row.mmsi
        ].join(" ").toLowerCase();

        if (!text.includes(query)) return false;
      }

      return true;
    });
  }

  function renderKpis(rows) {
    $("#rhTotalCount").textContent = rows.length;
    $("#rhVesselCount").textContent = rows.filter(r => r.type === "불법어선").length;
    $("#rhCrimeCount").textContent = rows.filter(r => r.type === "범죄선박").length;
    $("#rhGearCount").textContent = rows.filter(r => r.type === "불법어구").length;
  }

  // 차트 렌더링
  function renderChart() {
    chartBars.replaceChildren();

    const start = getPeriodStart();
    const days = dailyData.filter(day => {
      if (start && day.date < start) return false;
      if (dateSelect.value !== "all" && day.date !== dateSelect.value) return false;
      return true;
    });

    days.forEach(day => {
      const item = document.createElement("div");
      item.className = "rh-chart-day";
      item.tabIndex = 0;

      const label = day.date.slice(5);
      const values = [day.vessel, day.crime, day.gear];

      const group = document.createElement("div");
      group.className = "rh-chart-group";

      values.forEach((value, index) => {
        const bar = document.createElement("span");
        bar.className = `rh-chart-bar ${["vessel","crime","gear"][index]}`;
        bar.style.setProperty("--value", typeSelect.value === "all" ||
          typeSelect.value === TYPES[index] ? value : 0);
        group.appendChild(bar);
      });

      const dateLabel = document.createElement("span");
      dateLabel.className = "rh-chart-date";
      dateLabel.textContent = label;

      item.append(group, dateLabel);

      item.setAttribute("aria-label",
        `${label}, 불법어선 ${day.vessel}건, 범죄선박 ${day.crime}건, 불법어구 ${day.gear}건`
      );

      item.addEventListener("mouseenter", () => showTooltip(day, item));
      item.addEventListener("focus", () => showTooltip(day, item));
      item.addEventListener("mouseleave", hideTooltip);
      item.addEventListener("blur", hideTooltip);

      chartBars.appendChild(item);
    });
  }

  function showTooltip(day, element) {
    tooltip.innerHTML = `
      <div class="rh-tooltip-date">${day.date.slice(5)}</div>
      <div class="rh-tooltip-row">
        <span class="rh-tooltip-dot vessel"></span>
        <span>불법어선</span>
        <strong>${day.vessel}</strong>
      </div>
      <div class="rh-tooltip-row">
        <span class="rh-tooltip-dot crime"></span>
        <span>범죄선박</span>
        <strong>${day.crime}</strong>
      </div>
      <div class="rh-tooltip-row">
        <span class="rh-tooltip-dot gear"></span>
        <span>불법어구</span>
        <strong>${day.gear}</strong>
      </div>
    `;

    tooltip.hidden = false;

    const parentRect = chartContainer.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;

    let left = rect.left - parentRect.left + rect.width / 2 - width / 2;
    left = Math.max(0, Math.min(left, parentRect.width - width));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(0, rect.top - parentRect.top + 20 - height)}px`;
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  // 테이블
  function renderTable(rows) {
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);

    tableBody.replaceChildren();

    if (!pageRows.length) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="7" class="rh-empty">검색 결과가 없습니다.</td>';
      tableBody.appendChild(tr);
    }

    pageRows.forEach(row => {
      const gradeClass = getGradeClass(row.grade);
      const tr = document.createElement("tr");

      // 내부 시안 데이터만 출력
      tr.innerHTML = `
        <td>${row.date}</td>
        <td><span class="rh-type-badge ${colors[row.type]}">${row.type}</span></td>
        <td>${row.area}</td>
        <td>${row.grid}</td>
        <td><strong class="rh-risk-score ${gradeClass}">${row.score}</strong></td>
        <td><span class="rh-grade-badge ${gradeClass}">${row.grade}</span></td>
        <td>${row.mmsi}</td>
      `;

      tableBody.appendChild(tr);
    });

    $("#rhResultInfo").textContent = rows.length
      ? `전체 ${rows.length}건 중 ${start + 1}–${Math.min(start + PAGE_SIZE, rows.length)}`
      : "전체 0건";

    $("#rhPageInfo").textContent = `${currentPage} / ${totalPages} 페이지`;

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.replaceChildren();

    const addButton = (text, page, disabled = false, active = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.disabled = disabled;
      button.classList.toggle("is-active", active);

      if (active) button.setAttribute("aria-current", "page");

      button.addEventListener("click", () => {
        currentPage = page;
        renderTable(filteredRecords());
      });

      pagination.appendChild(button);
    };

    addButton("«", 1, currentPage === 1);
    addButton("‹", Math.max(1, currentPage - 1), currentPage === 1);

    const first = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const last = Math.min(totalPages, first + 4);

    for (let page = first; page <= last; page++) {
      addButton(String(page), page, false, page === currentPage);
    }

    addButton("›", Math.min(totalPages, currentPage + 1), currentPage === totalPages);
    addButton("»", totalPages, currentPage === totalPages);
  }

  function update() {
    currentPage = 1;
    const rows = filteredRecords();
    renderKpis(rows);
    renderChart();
    renderTable(rows);
    hideTooltip();
  }

  [periodSelect, dateSelect, typeSelect, gradeSelect].forEach(select => {
    select.addEventListener("change", update);
  });

  searchInput.addEventListener("input", update);

  // CSV 내보내기 (Excel에서 열 수 있음)
  $("#rhExportButton").addEventListener("click", () => {
    const rows = filteredRecords();
    const headers = ["일자","유형","해역","격자ID","위험도","등급","대상(MMSI)"];

    const escapeCsv = value =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [
      headers,
      ...rows.map(row => [
        row.date, row.type, row.area, row.grid,
        row.score, row.grade, row.mmsi
      ])
    ].map(row => row.map(escapeCsv).join(",")).join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "위험도_추이_이력.csv";
    link.click();

    URL.revokeObjectURL(url);
  });

  $("#rhPrintButton").addEventListener("click", () => window.print());

  // 최초 표시
  // 첨부 화면의 KPI는 166 / 58 / 52 / 56으로 고정 표시
  renderChart();
  renderTable(records);
  $("#rhTotalCount").textContent = "166";
  $("#rhVesselCount").textContent = "58";
  $("#rhCrimeCount").textContent = "52";
  $("#rhGearCount").textContent = "56";
});



/* ========================================
   단속 우선지역 추천
======================================== */
(() => {
  const page = document.querySelector(".priority-area-page");
  if (!page) return;

  const rows = [
    [1, "W:66_41", "서해 중부", 55, "주의", "1척"],
    [2, "W:96_6", "서해 북부", 47, "주의", "43척"],
    [3, "W:29_19", "서해 남부", 46, "주의", "6척"],
    [4, "W:27_14", "서해 남부", 46, "주의", "7척"],
    [5, "W:25_10", "서해 남부", 44, "주의", "6척"],
    [6, "W:132_11", "서해 북부", 44, "주의", "1척"],
    [7, "W:91_11", "서해 북부", 43, "주의", "1척"],
    [8, "W:22_47", "서해 남부", 42, "주의", "1척"],
    [9, "W:73_68", "서해 중부", 42, "주의", "1척"],
    [10, "W:17_53", "서해 남부", 42, "주의", "1척"],
    [11, "W:8_63", "서해 남부", 42, "주의", "1척"],
    [12, "W:21_48", "서해 남부", 42, "주의", "2척"],
    [13, "W:8_62", "서해 남부", 42, "주의", "1척"],
    [14, "W:73_55", "서해 중부", 42, "주의", "1척"],
    [15, "W:97_7", "서해 북부", 41, "주의", "132척"]
  ];

  const data = rows.map(([rank, id, sea, score, grade, vessels]) => ({
    rank, id, sea, score, grade, vessels,
    factor: "중국어선 밀집",
    action: "관심선박 등록 · 추적"
  }));

  const pageSize = 15;
  let currentPage = 1;
  let filtered = [...data];

  const body = document.getElementById("paTableBody");
  const search = document.getElementById("paSearch");
  const pagination = document.getElementById("paPagination");
  const resultInfo = document.getElementById("paResultInfo");
  const pageInfo = document.getElementById("paPageInfo");

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  function render() {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);

    body.innerHTML = visible.length
      ? visible.map(item => `
          <tr>
            <td class="pa-rank">${item.rank}</td>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.sea)}</td>
            <td class="pa-risk-score">${item.score}</td>
            <td><span class="pa-grade">${escapeHTML(item.grade)}</span></td>
            <td>${escapeHTML(item.vessels)}</td>
            <td>${escapeHTML(item.factor)}</td>
            <td>${escapeHTML(item.action)}</td>
          </tr>
        `).join("")
      : `<tr><td colspan="8" style="text-align:center;padding:25px;">검색 결과가 없습니다.</td></tr>`;

    const first = filtered.length ? start + 1 : 0;
    const last = Math.min(start + pageSize, filtered.length);

    resultInfo.textContent = `현재 제공된 ${filtered.length}건 중 ${first}–${last}`;
    pageInfo.textContent = `${currentPage} / ${totalPages} 페이지`;

    const buttons = [];
    buttons.push(`<button type="button" data-page="prev" ${currentPage === 1 ? "disabled" : ""} aria-label="이전 페이지">‹</button>`);

    for (let p = 1; p <= totalPages; p++) {
      buttons.push(`<button type="button" data-page="${p}" class="${p === currentPage ? "active" : ""}" ${p === currentPage ? 'aria-current="page"' : ""}>${p}</button>`);
    }

    buttons.push(`<button type="button" data-page="next" ${currentPage === totalPages ? "disabled" : ""} aria-label="다음 페이지">›</button>`);
    pagination.innerHTML = buttons.join("");
  }

  search?.addEventListener("input", () => {
    const keyword = search.value.trim().toLowerCase();

    filtered = data.filter(item =>
      [
        item.id, item.sea, item.grade,
        item.factor, item.action, item.vessels
      ].some(value => String(value).toLowerCase().includes(keyword))
    );

    currentPage = 1;
    render();
  });

  pagination?.addEventListener("click", event => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;

    const value = button.dataset.page;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    if (value === "prev") currentPage = Math.max(1, currentPage - 1);
    else if (value === "next") currentPage = Math.min(totalPages, currentPage + 1);
    else currentPage = Number(value);

    render();
  });

  // 해상도 버튼: 선택 표시만 변경
  document.querySelectorAll(".pa-resolution-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".pa-resolution-btn").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  // CSV 내보내기 (엑셀에서 열 수 있음)
  document.getElementById("paExport")?.addEventListener("click", () => {
    const csvRows = [
      ["순위", "격자ID", "해역", "위험지수", "등급", "선박", "주요 위험요인", "권고 조치"],
      ...filtered.map(item => [
        item.rank, item.id, item.sea, item.score,
        item.grade, item.vessels, item.factor, item.action
      ])
    ];

    const csv = "\uFEFF" + csvRows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "단속_우선지역_추천.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  document.getElementById("paPrint")?.addEventListener("click", () => {
    window.print();
  });

  render();
})();


/* =========================================
   괭생이모자반 탐지
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".sargassum-page");
  if (!page) return;

  // 예측 / 결과 / 데이터 탭
  const tabs = page.querySelectorAll("[data-sg-tab]");
  const panels = page.querySelectorAll("[data-sg-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.sgTab;

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.sgPanel !== selected;
      });
    });
  });

  // 표류 모델 선택
  page.querySelectorAll("[data-model]").forEach((button) => {
    button.addEventListener("click", () => {
      page.querySelectorAll("[data-model]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  // 탐지일 빠른 선택
  const dateInput = page.querySelector("#sgDate");

  page.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (dateInput) dateInput.value = button.dataset.date;

      page.querySelectorAll("[data-date]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  // 슬라이더 값 표시
  const ranges = [
    ["sgCurrent", "sgCurrentValue", (v) => Number(v).toFixed(3)],
    ["sgWind", "sgWindValue", (v) => Number(v).toFixed(3)],
    ["sgHours", "sgHoursValue", (v) => `+${v}h`],
    ["sgFar", "sgFarValue", (v) => Number(v).toExponential(1)]
  ];

  ranges.forEach(([inputId, outputId, format]) => {
    const input = page.querySelector(`#${inputId}`);
    const output = page.querySelector(`#${outputId}`);

    if (!input || !output) return;

    const update = () => {
      output.textContent = format(input.value);
    };

    input.addEventListener("input", update);
    update();
  });

  // 지도 이미지 확대 / 축소
  const map = page.querySelector("#sgMapImage");
  const zoomIn = page.querySelector("#sgZoomIn");
  const zoomOut = page.querySelector("#sgZoomOut");

  let scale = 1;

  const updateZoom = () => {
    if (map) map.style.transform = `scale(${scale})`;
    if (zoomIn) zoomIn.disabled = scale >= 2;
    if (zoomOut) zoomOut.disabled = scale <= 1;
  };

  zoomIn?.addEventListener("click", () => {
    scale = Math.min(2, Math.round((scale + 0.2) * 10) / 10);
    updateZoom();
  });

  zoomOut?.addEventListener("click", () => {
    scale = Math.max(1, Math.round((scale - 0.2) * 10) / 10);
    updateZoom();
  });

  updateZoom();

  // 실제 예측 API 미연결
  page.querySelector("#sgRun")?.addEventListener("click", () => {
    window.alert("표류 예측 API 연결 전입니다.");
  });

  page.querySelector("#sgAddPoint")?.addEventListener("click", () => {
    window.alert("현장 신고 등록 기능은 추후 연결 예정입니다.");
  });
});



/* =========================================
   단일 함정 순찰·경로 추천
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".patrol-page");
  if (!page) return;

  // 상단 탭: 화면 이동 없이 활성 표시만 변경
  const tabs = page.querySelectorAll(".patrol-tabs button");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // 지도 확대·축소
  const mapImage = document.getElementById("patrolMapImage");
  let mapScale = 1;

  function updateMapScale() {
    if (mapImage) {
      mapImage.style.transform = `scale(${mapScale})`;
    }
  }

  document.getElementById("patrolZoomIn")?.addEventListener("click", () => {
    mapScale = Math.min(3, +(mapScale + 0.2).toFixed(1));
    updateMapScale();
  });

  document.getElementById("patrolZoomOut")?.addEventListener("click", () => {
    mapScale = Math.max(1, +(mapScale - 0.2).toFixed(1));
    updateMapScale();
  });

  // 경유지 데이터
  const safeStops = [
    ["모항 출항", ""],
    ["어선 3척 (조업 3)", "위험 9 · 3척"],
    ["어선 4척 (조업 4)", "위험 10 · 4척"],
    ["어선 4척 (조업 4)", "위험 10 · 4척"],
    ["어선 5척 (조업 4)", "위험 10 · 5척"],
    ["어선 5척 (조업 1)", "위험 5 · 5척"],
    ["어선 1척", "위험 2 · 1척"],
    ["어선 8척 (조업 6)", "위험 12 · 8척"],
    ["어선 2척 (조업 2)", "위험 7 · 2척"],
    ["어선 3척 (조업 1)", "위험 5 · 3척"],
    ["어선 3척 (조업 2)", "위험 7 · 3척"],
    ["어선 6척 (조업 2)", "위험 7 · 6척"],
    ["어선 2척 (조업 2)", "위험 7 · 2척"],
    ["어선 2척 (조업 2)", "위험 7 · 2척"],
    ["모항 복귀", ""]
  ];

  const enforceStops = [
    ["모항 출항", ""],
    ["BAI LI 16 외 1척", "위험 7 · 2척"],
    ["LIAO DA CHANGYU15410 외 15척", "위험 32 · 16척"],
    ["LUWENYU67579 외 6척", "위험 20 · 7척"],
    ["LIAOYINGYU36589 외 14척", "위험 33 · 15척"],
    ["ZHEYONGYU60651 외 2척", "위험 6 · 3척"],
    ["LURONGYU59561 외 6척", "위험 14 · 7척"],
    ["LURONGYU59009 외 3척", "위험 14 · 4척"],
    ["LIAOWAYU75335 외 7척", "위험 16 · 8척"],
    ["LIAODANYU26830 외 6척", "위험 14 · 7척"],
    ["LURONGYU58190 외 15척", "위험 38 · 16척"],
    ["LURONGYU55757", "위험 10 · 1척"],
    ["LIAOYINGYU36619 외 8척", "위험 62 · 9척"],
    ["모항 복귀", ""]
  ];

  function renderStops(elementId, stops, type) {
    const list = document.getElementById(elementId);
    if (!list) return;

    list.replaceChildren();

    stops.forEach(([name, meta], index) => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.className = "patrol-stop-name";

      const numberSpan = document.createElement("span");
      numberSpan.className = "patrol-stop-number";
      numberSpan.textContent = index + 1;

      nameSpan.append(numberSpan, document.createTextNode(name));

      const metaSpan = document.createElement("span");
      metaSpan.className = `patrol-stop-meta ${type}`;
      metaSpan.textContent = meta;

      li.append(nameSpan, metaSpan);
      list.appendChild(li);
    });
  }

  renderStops("patrolSafeStops", safeStops, "safe");
  renderStops("patrolEnforceStops", enforceStops, "enforce");

  // 단속 대상 선박
  const vessels = [
    ["412018530", "TONG CHENG", 95, "37.03, 126.61"],
    ["412328356", "LURONGYU50889", 90, "37.80, 123.67"],
    ["412328594", "LURONGYU55757", 90, "37.79, 123.77"],
    ["412223052", "LIAOYINGYU36618", 85, "37.89, 123.55"],
    ["412280378", "JIHUANGYU06055", 85, "37.77, 123.71"],
    ["412328357", "LURONGYU50890", 85, "37.80, 123.68"],
    ["412328846", "LUWENYU53568", 80, "37.88, 123.56"],
    ["412338851", "LURONGYU58801", 80, "37.70, 123.76"],
    ["412330539", "LURONGYU59800", 80, "37.73, 123.61"],
    ["412320494", "LURONGYU59010", 80, "36.16, 124.21"],
    ["412337769", "LUGUANGYU62277", 80, "37.49, 123.97"],
    ["412457279", "LURONGYU59968", 80, "36.92, 124.21"],
    ["412229561", "LUQINGXINYU60679", 80, "38.36, 123.44"],
    ["412223053", "LIAOYINGYU36619", 70, "37.88, 123.55"],
    ["412325662", "LUSHOUYU65362", 70, "37.91, 123.64"],
    ["412327412", "LURONGYU58919", 70, "38.16, 123.49"],
    ["412280379", "JIHUANGYU06056", 70, "37.77, 123.71"],
    ["412301003", "JINHANYU04852", 70, "36.78, 124.16"],
    ["412223044", "LIAOYINGYU36078", 70, "36.52, 124.43"],
    ["412320502", "LURONGYU58057", 70, "38.19, 123.51"],
    ["412324880", "AN DONG 68", 65, "37.34, 126.64"],
    ["412362090", "BAI LI 16", 65, "37.16, 126.48"],
    ["412320473", "LURONGYU51355", 65, "36.22, 123.69"],
    ["412327528", "LURONGYU58020", 65, "36.36, 123.53"],
    ["412333768", "LURONGYU52567", 65, "36.46, 123.57"],
    ["412226024", "LIAOYINGYU36081", 60, "37.46, 126.59"],
    ["412622000", "XIE HAI LAN SHENG", 60, "37.25, 126.43"],
    ["412312355", "JIHUANGGANGYU06585", 60, "36.33, 124.16"],
    ["412567935", "LURONGYU52935", 60, "36.22, 124.28"],
    ["412567936", "LURONGYU52936", 60, "36.22, 124.27"]
  ];

  const tbody = document.getElementById("patrolVesselRows");

  if (tbody) {
    vessels.forEach(([mmsi, name, score, position]) => {
      const grade = score >= 81 ? "심각" : score >= 61 ? "경계" : "주의";
      const gradeClass = score >= 81 ? "critical" : score >= 61 ? "warning" : "caution";

      const tr = document.createElement("tr");

      [mmsi, name, "중국", score].forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });

      const gradeCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `patrol-risk-badge ${gradeClass}`;
      badge.textContent = grade;
      gradeCell.appendChild(badge);
      tr.appendChild(gradeCell);

      const noteCell = document.createElement("td");
      noteCell.textContent = "";
      tr.appendChild(noteCell);

      const positionCell = document.createElement("td");
      positionCell.textContent = position;
      tr.appendChild(positionCell);

      tbody.appendChild(tr);
    });
  }
});


/* =========================================
   다함정 협력 최적화
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const multiPage = document.querySelector(".multi-page");
  if (!multiPage) return;

  // 작전 목표 탭
  document.querySelectorAll("#multiMission button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("#multiMission button").forEach(item => {
        item.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  // 지도 확대 / 축소
  const mapImage = document.getElementById("multiMapImage");
  const zoomIn = document.getElementById("multiZoomIn");
  const zoomOut = document.getElementById("multiZoomOut");

  let scale = 1;

  function updateMapZoom() {
    if (mapImage) {
      mapImage.style.transform = `scale(${scale})`;
    }
  }

  zoomIn?.addEventListener("click", () => {
    scale = Math.min(2.5, +(scale + 0.2).toFixed(2));
    updateMapZoom();
  });

  zoomOut?.addEventListener("click", () => {
    scale = Math.max(1, +(scale - 0.2).toFixed(2));
    updateMapZoom();
  });

  // 함정별 경유지
  // 화면 구현용 예시 데이터
  const stopData = {
    multiStops1002: [
      ["모항 출항", ""],
      ["LURONGYU58802 외 1척", "단속"],
      ["LURONGYU59800 외 3척", "단속"],
      ["합동 대응 · LURONGYU50890 외 13척", "합동"],
      ["LUWEIJINGYU51066 외 4척", "단속"],
      ["LUWEIJINGYU51158", "단속"],
      ["합동 대응 · LUQINGXINYU0667 외 17척", "합동"],
      ["LIAOYINGYU36809 외 13척", "단속"],
      ["JINHANYU04978 외 8척", "단속"],
      ["LURONGYU50157 외 5척", "단속"],
      ["어선 2척", "점검"],
      ["모항 복귀", ""],
      ["… 중간 3개 생략", "note"]
    ],
    multiStops1506: [
      ["모항 출항", ""],
      ["LURONGYU59600 외 3척", "단속"],
      ["LURONGYU59372 외 6척", "단속"],
      ["LIAODANYU21097 외 4척", "단속"],
      ["LURONGYU58020 외 15척", "단속"],
      ["LURONGYU58933", "단속"],
      ["어선 2척", "점검"],
      ["어선 2척", "점검"],
      ["어선 1척 (조업 1)", "점검"],
      ["어선 2척 (조업 1)", "점검"],
      ["합동 대응 · LURONGYU50890 외 13척", "합동"],
      ["모항 복귀", ""],
      ["… 중간 1개 생략", "note"]
    ],
    multiStops3001: [
      ["모항 출항", ""],
      ["XIE HAI LAN SHENG 외 1척", "단속"],
      ["어선 2척 (조업 2)", "점검"],
      ["어선 10척 (조업 5)", "점검"],
      ["어선 5척 (조업 2)", "점검"],
      ["어선 4척 (조업 3)", "점검"],
      ["어선 1척", "점검"],
      ["어선 1척 (조업 1)", "점검"],
      ["어선 3척 (조업 1)", "점검"],
      ["어선 1척", "점검"],
      ["어선 1척", "점검"],
      ["모항 복귀", ""]
    ],
    multiStops3005: [
      ["모항 출항", ""],
      ["어선 4척 (조업 4)", "점검"],
      ["어선 3척 (조업 2)", "점검"],
      ["어선 6척 (조업 3)", "점검"],
      ["어선 1척 (조업 1)", "점검"],
      ["어선 1척", "점검"],
      ["어선 2척 (조업 2)", "점검"],
      ["어선 1척", "점검"],
      ["어선 15척 (조업 8)", "점검"],
      ["어선 1척", "점검"],
      ["어선 2척 (조업 2)", "점검"],
      ["모항 복귀", ""]
    ]
  };

  const statusMap = {
    "단속": "enforce",
    "합동": "joint",
    "점검": "safe"
  };

  Object.entries(stopData).forEach(([id, stops]) => {
    const list = document.getElementById(id);
    if (!list) return;

    list.replaceChildren();

    stops.forEach(([name, status], index) => {
      const li = document.createElement("li");

      if (status === "note") {
        li.className = "multi-stop-note";
        li.textContent = name;
        list.appendChild(li);
        return;
      }

      const number = document.createElement("span");
      number.className = "multi-stop-num";
      number.textContent = index + 1;

      const title = document.createElement("span");
      title.className = "multi-stop-name";
      title.textContent = name;

      li.append(number, title);

      if (status) {
        const badge = document.createElement("span");
        badge.className = `multi-stop-status ${statusMap[status] || ""}`;
        badge.textContent = status;
        li.appendChild(badge);
      }

      list.appendChild(li);
    });
  });
});


/* =========================================
   현장함정 즉각대응 SFR-17
========================================= */
(() => {
  const root = document.querySelector(".dispatch-page");
  if (!root) return;

  const alerts = [
    ["412329352", 100, "37°17.5'N 123°53.1'E"],
    ["YONG FA 1", 95, "34°52.4'N 129°1.4'E"],
    ["OUYAI", 95, "34°30.8'N 128°46.9'E"],
    ["412287948", 95, "34°2.2'N 125°7.8'E"],
    ["413525033", 90, "34°3.4'N 125°4.7'E"],
    ["LUSHOUYU60897", 90, "37°20.0'N 123°50.4'E"],
    ["LUSHOUYU60898", 90, "37°36.3'N 123°42.1'E"],
    ["LURONGYU55757", 90, "37°44.0'N 123°49.9'E"],
    ["LURONGYU50890", 85, "37°18.2'N 123°42.0'E"],
    ["LIAOYINGYU3618", 85, "37°22.0'N 123°51.0'E"],
    ["LURONGYU50889", 80, "37°26.1'N 123°56.0'E"],
    ["LURONGYU5801", 80, "37°35.0'N 123°44.0'E"],
    ["LURONGYU59800", 80, "37°42.0'N 123°48.0'E"],
    ["LURONGYU59010", 80, "37°39.0'N 123°43.0'E"],
    ["LUGUANGYU62277", 80, "37°31.0'N 123°55.0'E"]
  ];

  const history = [
    ["#31", "[경로 추천] 목표 3005함 · 목표 (회항) · 285.4km · 6.8h", "3005함", "완료", "–", "SYSTEM", "2026-10-26 15:48:03", "21:48"],
    ["#30", "[경로 추천] 목표 3001함 · 인천 (회항) · 542.8km · 11.5h", "3001함", "완료", "–", "SYSTEM", "2026-10-26 15:46:49", "21:46"],
    ["#29", "[경로 추천] 목표 3001함 · 인천 (회항) · 560.0km · 11.8h", "3001함", "완료", "–", "SYSTEM", "2026-10-26 14:48:58", "20:48"],
    ["#28", "[경로 추천] 목표 3001함 · 인천 (회항) · 560.0km · 11.8h", "3001함", "완료", "–", "SYSTEM", "2026-10-26 14:47:53", "20:47"],
    ["#27", "[즉각대응] APPROACH 지시", "3005함", "완료", "–", "SYSTEM", "2026-10-26 14:32:45", "20:32"],
    ["#26", "[경로 추천] 목표 3005함 · 목표 (회항) · 535.5km · 12.7h", "3005함", "완료", "–", "SYSTEM", "2026-10-26 14:22:27", "20:22"],
    ["#25", "[즉각대응] APPROACH 지시", "3005함", "완료", "PATROL", "SYSTEM", "2026-10-22 19:25:02", "10-23 01:25"],
    ["#24", "[즉각대응] APPROACH 지시", "3005함", "완료", "–", "SYSTEM", "2026-10-22 17:47:52", "10-22 23:47"],
    ["#23", "[즉각대응] APPROACH 지시", "3005함", "취소", "–", "어현상", "2026-10-22 17:32:09", "10-22 23:32"],
    ["#22", "[즉각대응] APPROACH 지시", "3005함", "취소", "–", "어현상", "2026-10-22 13:37:20", "10-22 19:37"],
    ["#21", "[즉각대응] 현장 이동 지시", "1502함", "완료", "–", "SYSTEM", "2026-10-21 11:20:00", "17:20"],
    ["#20", "[즉각대응] 차단·퇴거 지시", "3001함", "완료", "–", "SYSTEM", "2026-10-21 10:18:00", "16:18"],
    ["#19", "[즉각대응] 추적 감시 지시", "1502함", "완료", "–", "SYSTEM", "2026-10-20 15:30:00", "21:30"],
    ["#18", "[즉각대응] 승선 검문 지시", "3001함", "취소", "–", "어현상", "2026-10-20 14:00:00", "20:00"],
    ["#17", "[즉각대응] 현장 이동 지시", "3005함", "완료", "–", "SYSTEM", "2026-10-19 13:00:00", "19:00"],
    ["#16", "[즉각대응] 차단·퇴거 지시", "1502함", "완료", "–", "SYSTEM", "2026-10-18 09:00:00", "15:00"],
    ["#15", "[즉각대응] 추적 감시 지시", "3001함", "완료", "–", "SYSTEM", "2026-10-17 12:00:00", "18:00"]
  ];

  let selectedAlert = 0;
  let selectedVessel = "1502";
  let selectedCommand = "차단·퇴거";
  let selectedChannel = "함정 단말";
  let alertPage = 1;
  let historyPage = 1;

  const $ = (selector) => root.querySelector(selector);

  function renderAlerts() {
    const list = $("#dispatchAlertList");
    if (!list) return;

    list.innerHTML = alerts.map((item, index) => `
      <button type="button"
        class="dispatch-alert-item ${index === selectedAlert ? "active" : ""}"
        data-alert="${index}">
        <div class="dispatch-alert-top">
          <span class="dispatch-alert-rank">${index + 1}</span>
          <strong>${item[0]}</strong>
          <small>중국</small>
          <span class="dispatch-alert-score">${item[1]}</span>
        </div>
        <p>${item[0]} · 무허가 우리 측 EEZ 진입 · 조업 상태 · ${item[2]}</p>
      </button>
    `).join("");

    list.querySelectorAll("[data-alert]").forEach(button => {
      button.addEventListener("click", () => {
        selectedAlert = Number(button.dataset.alert);
        renderAlerts();
        updateMessage();
      });
    });
  }

  function updateMessage() {
    const alert = alerts[selectedAlert];
    const target = alert[0];
    const coord = alert[2];

    $("#dispatchCoordinates").textContent = coord;
    $("#dispatchSend span").textContent = `${selectedVessel}함에 즉시 전송`;

    $("#dispatchMessage").value =
`[해양경찰청 상황실 → ${selectedVessel}함] 현장 즉각대응 지시
· 경보등급 : CRITICAL (위험도 ${alert[1]} · 신뢰도 미제공)
· 사건유형 : 무허가 우리 측 EEZ 진입 + 조업 상태
· 발생위치 : EEZ_OR_BEYOND (${coord})
· 탐지시각 : 2026-10-26 21:44:09
· 대상선박 : ${target} (중국)
· 지시사항 : 대상 선박 진행 방향 차단 후 우리 수역 밖으로 퇴거 조치
· 소요예상 : ${selectedVessel === "1502" ? "60km · ETA 약 55분" : "83km · ETA 약 90분"}
· 소속관서 : 인천해양경찰서
※ 현장 도착 즉시 상황실로 보고, 참조 최우선 1위 (${target})`;
  }

  function bindChoiceGroup(selector, attribute, callback) {
    const group = $(selector);
    if (!group) return;

    group.addEventListener("click", event => {
      const button = event.target.closest(`button[${attribute}]`);
      if (!button) return;

      group.querySelectorAll("button").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      callback(button.getAttribute(attribute));
    });
  }

  function renderHistory() {
    const vessel = $("#dispatchHistoryVessel").value;
    const status = $("#dispatchHistoryStatus").value;
    const from = $("#dispatchDateFrom").value;
    const to = $("#dispatchDateTo").value;

    const filtered = history.filter(item => {
      const date = item[6].slice(0, 10);
      return (!vessel || item[2] === vessel)
        && (!status || item[3] === status)
        && (!from || date >= from)
        && (!to || date <= to);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
    historyPage = Math.min(historyPage, totalPages);

    const start = (historyPage - 1) * 10;
    const rows = filtered.slice(start, start + 10);

    $("#dispatchHistoryBody").innerHTML = rows.map(item => `
      <tr>
        <td><span class="dispatch-history-badge">즉각대응</span> ${item[0]}</td>
        <td title="${item[1]}">${item[1]}</td>
        <td>${item[2]}</td>
        <td><span class="dispatch-status">${item[3]}</span></td>
        <td>${item[4]}</td>
        <td>${item[5]}</td>
        <td>${item[6]}</td>
        <td>${item[7]}</td>
        <td></td>
      </tr>
    `).join("");

    $("#dispatchHistoryTotal").textContent =
      `전체 ${filtered.length}건 중 ${filtered.length ? start + 1 : 0}–${Math.min(start + 10, filtered.length)}`;

    $("#dispatchHistoryPageInfo").textContent =
      `${historyPage} / ${totalPages} 페이지`;

    $("#dispatchHistoryPages").innerHTML = `
      <button type="button" data-page="prev">‹</button>
      ${Array.from({ length: totalPages }, (_, index) => `
        <button type="button"
          data-page="${index + 1}"
          class="${historyPage === index + 1 ? "active" : ""}">
          ${index + 1}
        </button>
      `).join("")}
      <button type="button" data-page="next">›</button>
    `;
  }

  renderAlerts();
  updateMessage();
  renderHistory();

  root.querySelectorAll(".dispatch-vessel").forEach(button => {
    button.addEventListener("click", () => {
      selectedVessel = button.dataset.vessel;

      root.querySelectorAll(".dispatch-vessel").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      updateMessage();
    });
  });

  bindChoiceGroup("#dispatchCommands", "data-command", value => {
    selectedCommand = value;
  });

  bindChoiceGroup("#dispatchChannels", "data-channel", value => {
    selectedChannel = value;
  });

  $("#dispatchRadius").addEventListener("input", event => {
    $("#dispatchRadiusLabel").textContent =
      `반경 ${event.target.value}km · 2척`;
  });

  $("#dispatchCopy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#dispatchMessage").value);
      $("#dispatchFeedback").textContent = "지시 문안을 복사했어.";
    } catch {
      $("#dispatchMessage").select();
      $("#dispatchFeedback").textContent =
        "문안을 선택했어. Ctrl+C 또는 Command+C로 복사해 줘.";
    }
  });

  $("#dispatchSend").addEventListener("click", () => {
    $("#dispatchFeedback").textContent =
      `미리보기: ${selectedVessel}함 · ${selectedCommand} · ${selectedChannel} 선택됨. 실제 전송 API는 연결되지 않았어.`;
  });

  ["#dispatchHistoryVessel", "#dispatchHistoryStatus",
   "#dispatchDateFrom", "#dispatchDateTo"].forEach(selector => {
    $(selector).addEventListener("change", () => {
      historyPage = 1;
      renderHistory();
    });
  });

  $("#dispatchRefresh").addEventListener("click", renderHistory);

  $("#dispatchHistoryPages").addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (!button) return;

    const page = button.dataset.page;
    const totalPages = Math.max(
      1,
      Math.ceil(
        root.querySelectorAll("#dispatchHistoryBody tr").length / 10
      )
    );

    if (page === "prev") historyPage = Math.max(1, historyPage - 1);
    else if (page === "next") historyPage += 1;
    else historyPage = Number(page);

    historyPage = Math.min(historyPage, 2);
    renderHistory();
  });

  $("#dispatchAlertPages").addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (!button) return;

    const page = button.dataset.page;

    if (page === "prev") alertPage = Math.max(1, alertPage - 1);
    else if (page === "next") alertPage = Math.min(58, alertPage + 1);
    else alertPage = Number(page);

    $("#dispatchAlertPages").querySelectorAll("[data-page]").forEach(item => {
      item.classList.toggle("active", item.dataset.page === String(alertPage));
    });

    $("#dispatchPageInfo").textContent = `${alertPage} / 58 페이지`;
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
})();

/* ==========================================
   단속 계획 수립 SFR-06-02
========================================== */
(() => {
  const root = document.querySelector(".enforcement-plan-page");
  if (!root) return;

  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];

  const plans = [
    ["PLN-20260412-0001", "서해 중부", 80, "2026-04-12", 2, "APPROVED", "경보 발령"],
    ["PLN-20260411-0001", "남해", 65, "2026-04-11", 1, "DRAFT", ""],
    ["PLN-20260410-0001", "서해 5도", 85, "2026-04-10", 2, "APPROVED", "주의"],
    ["PLN-20260409-0001", "EEZ 북부", 78, "2026-04-09", 2, "DRAFT", ""],
    ["PLN-20260408-0001", "서해 NLL", 92, "2026-04-08", 3, "APPROVED", "경보 발령"]
  ];

  const criticalIds = [
    "413904344", "412000222", "412000222", "412002731",
    "412226024", "412285205", "412287948", "412320671",
    "412322846", "412331728", "412339210", "412341005",
    "412352901", "412368810", "412372114", "412381026",
    "412391225", "412402117", "412415028", "412429109",
    "412438115", "412441207", "412452339", "412467008",
    "412471120", "412488101", "412491233", "412502116",
    "412518029", "412529108", "412540001"
  ];

  const criticals = criticalIds.map((id, index) => ({
    category: "미배정 CRITICAL",
    score: "심각",
    mmsi: id,
    type: index % 5 === 2 ? "고위험" : "EEZ 침범",
    date: "2026-10-26 22:20:28",
    status: "미배정"
  }));

  let criticalPage = 1;
  const pageSize = 10;

  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));

  function renderPlans() {
    const query = $("#epPlanSearch").value.trim().toLowerCase();

    const filtered = plans.filter(plan =>
      plan.join(" ").toLowerCase().includes(query)
    );

    $("#epPlanBody").innerHTML = filtered.map(plan => `
      <tr>
        <td><span class="ep-plan-id">${escapeHTML(plan[0])}</span></td>
        <td><span class="ep-plan-zone">${escapeHTML(plan[1])}</span></td>
        <td>
          <span class="ep-risk-badge ${plan[2] >= 80 ? "high" : ""}">
            ${plan[2]}점
          </span>
        </td>
        <td>${plan[3]}</td>
        <td><span class="ep-ship-count">${plan[4]}척</span></td>
        <td><span class="ep-status-badge">${plan[5]}</span></td>
        <td>
          ${plan[6] === "경보 발령"
            ? '<span class="ep-alert-badge">경보 발령</span>'
            : escapeHTML(plan[6] || "-")}
        </td>
      </tr>
    `).join("") || `
      <tr><td colspan="7" style="text-align:center;padding:20px">
        검색 결과가 없습니다.
      </td></tr>
    `;
  }

  function renderCriticals() {
    const query = $("#epCriticalSearch").value.trim().toLowerCase();

    const filtered = criticals.filter(item =>
      Object.values(item).join(" ").toLowerCase().includes(query)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    criticalPage = Math.min(criticalPage, totalPages);

    const start = (criticalPage - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);

    $("#epCriticalBody").innerHTML = rows.map(item => `
      <tr>
        <td><span class="ep-critical-badge">${escapeHTML(item.category)}</span></td>
        <td><span class="ep-critical-badge score">${escapeHTML(item.score)}</span></td>
        <td>${escapeHTML(item.mmsi)}</td>
        <td>${escapeHTML(item.type)}</td>
        <td>${escapeHTML(item.date)}</td>
        <td><span class="ep-critical-badge unassigned">${escapeHTML(item.status)}</span></td>
      </tr>
    `).join("") || `
      <tr><td colspan="6" style="text-align:center;padding:20px">
        검색 결과가 없습니다.
      </td></tr>
    `;

    $("#epCriticalRange").textContent =
      `전체 ${filtered.length}건 중 ${filtered.length ? start + 1 : 0}–${Math.min(start + pageSize, filtered.length)}`;

    $("#epCriticalPageInfo").textContent =
      `${criticalPage} / ${totalPages} 페이지`;

    $("#epCriticalPagination").innerHTML = `
      <button type="button" data-page="prev" ${criticalPage === 1 ? "disabled" : ""}>«</button>
      <button type="button" data-page="previous" ${criticalPage === 1 ? "disabled" : ""}>‹</button>
      ${Array.from({ length: totalPages }, (_, index) => `
        <button type="button"
          data-page="${index + 1}"
          class="${criticalPage === index + 1 ? "active" : ""}">
          ${index + 1}
        </button>
      `).join("")}
      <button type="button" data-page="next" ${criticalPage === totalPages ? "disabled" : ""}>›</button>
      <button type="button" data-page="last" ${criticalPage === totalPages ? "disabled" : ""}>»</button>
    `;
  }

  $("#epPlanSearch").addEventListener("input", renderPlans);

  $("#epCriticalSearch").addEventListener("input", () => {
    criticalPage = 1;
    renderCriticals();
  });

  $("#epCriticalPagination").addEventListener("click", event => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;

    const page = button.dataset.page;
    const query = $("#epCriticalSearch").value.trim().toLowerCase();
    const count = criticals.filter(item =>
      Object.values(item).join(" ").toLowerCase().includes(query)
    ).length;
    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    if (page === "prev") criticalPage = 1;
    else if (page === "previous") criticalPage = Math.max(1, criticalPage - 1);
    else if (page === "next") criticalPage = Math.min(totalPages, criticalPage + 1);
    else if (page === "last") criticalPage = totalPages;
    else criticalPage = Number(page);

    renderCriticals();
  });

  // 탭 선택
  $$(".ep-tab").forEach(button => {
    button.addEventListener("click", () => {
      $$(".ep-tab").forEach(tab => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
    });
  });

  // 임계값 모달
  const modal = $("#epThresholdModal");

  function closeModal() {
    modal.hidden = true;
  }

  $("#epThresholdButton").addEventListener("click", () => {
    modal.hidden = false;
  });

  $("#epModalClose").addEventListener("click", closeModal);
  $("#epModalCancel").addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  $("#epModalSave").addEventListener("click", () => {
    const high = Number($("#epHighInput").value);
    const medium = Number($("#epMediumInput").value);
    const low = Number($("#epLowInput").value);

    if (
      [high, medium, low].some(v => !Number.isFinite(v) || v < 0 || v > 100) ||
      !(high > medium && medium > low)
    ) {
      alert("임계값은 0~100 범위에서 즉시 경보 > 주의 알림 > 참고 기록 순으로 입력해 주세요.");
      return;
    }

    $("#epHighValue").textContent = high;
    $("#epMediumValue").textContent = medium;
    $("#epLowValue").textContent = low;
    closeModal();
  });

  // 지도 확대 / 축소
  let zoom = 1;
  const mapImage = $(".ep-map-image");

  function applyZoom() {
    mapImage.style.transform = `scale(${zoom})`;
  }

  $("#epZoomIn").addEventListener("click", () => {
    zoom = Math.min(3, zoom + 0.2);
    applyZoom();
  });

  $("#epZoomOut").addEventListener("click", () => {
    zoom = Math.max(1, zoom - 0.2);
    applyZoom();
  });

  // CSV 다운로드
  function downloadCSV(filename, headers, rows) {
    const csv = [headers, ...rows]
      .map(row => row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  $("#epPlanExport").addEventListener("click", () => {
    downloadCSV(
      "단속계획.csv",
      ["ID", "단속 구역", "위험도", "단속 시간", "참여 함정", "상태", "경보"],
      plans
    );
  });

  $("#epCriticalExport").addEventListener("click", () => {
    downloadCSV(
      "미배정_CRITICAL.csv",
      ["구분", "위험도", "대상(MMSI)", "유형", "탐지시각", "상태"],
      criticals.map(item => Object.values(item))
    );
  });

  $("#epPlanPrint").addEventListener("click", () => window.print());
  $("#epCriticalPrint").addEventListener("click", () => window.print());

  $("#epCreatePlan").addEventListener("click", () => {
    alert("단속 계획 수립 화면 연결 전입니다.");
  });

  renderPlans();
  renderCriticals();

  if (window.lucide) window.lucide.createIcons();
})();


// =========================================
// 상황보고 페이지
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".situation-report-page");
  if (!page) return;

  // 탭 선택
  const tabs = page.querySelectorAll(".sr-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
    });
  });

  // 지도 확대 / 축소
  const mapImage = document.getElementById("srMapImage");
  let zoom = 1;

  const updateZoom = () => {
    if (mapImage) {
      mapImage.style.transform = `scale(${zoom})`;
    }
  };

  document.getElementById("srZoomIn")?.addEventListener("click", () => {
    zoom = Math.min(zoom + 0.2, 2.5);
    updateZoom();
  });

  document.getElementById("srZoomOut")?.addEventListener("click", () => {
    zoom = Math.max(zoom - 0.2, 1);
    updateZoom();
  });

  // 이미지 확대 팝업
  const lightbox = document.getElementById("srLightbox");
  const lightboxImage = document.getElementById("srLightboxImage");

  const closeLightbox = () => {
    if (lightbox) lightbox.hidden = true;
    if (lightboxImage) lightboxImage.removeAttribute("src");
  };

  page.querySelectorAll(".sr-image-open").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;

      lightboxImage.src = button.dataset.image;
      lightbox.hidden = false;
    });
  });

  document.getElementById("srLightboxClose")
    ?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  // 인쇄
  document.getElementById("srPrint")?.addEventListener("click", () => {
    window.print();
  });
});

/* =========================================
   함정 단말 Agent (SFR-16)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".vessel-agent-page");
  if (!page) return;

  const tabs = page.querySelectorAll(".va-tab");
  const panels = page.querySelectorAll(".va-panel");

  // 탭 전환
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.vaTab;

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const active = panel.id === `va-${target}`;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });

  // 새로고침
  const refreshButton = page.querySelector("#vaRefresh");

  refreshButton?.addEventListener("click", () => {
    const icon = refreshButton.querySelector("svg");

    if (icon) {
      icon.style.transition = "transform 0.5s ease";
      icon.style.transform = "rotate(360deg)";

      setTimeout(() => {
        icon.style.transition = "none";
        icon.style.transform = "rotate(0deg)";
      }, 500);
    }

    // 실제 데이터 연동 시 이 위치에서 API 재조회
    // fetchVesselAgentStatus();
  });
});

/* =========================================
   단속 사건 등록·수정 (SFR-11-01)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".enforcement-case-page");
  if (!page) return;

  const tabs = page.querySelectorAll(".ec-tab");
  const panels = page.querySelectorAll(".ec-panel");

  // 탭 전환
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.ecTab;

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const active = panel.id === `ec-${target}`;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });

  // 검색 및 필터
  const filters = {
    search: page.querySelector("#ecSearch"),
    grade: page.querySelector("#ecGrade"),
    ship: page.querySelector("#ecShip"),
    document: page.querySelector("#ecDocument"),
    disposition: page.querySelector("#ecDisposition"),
    result: page.querySelector("#ecResult"),
    status: page.querySelector("#ecStatus")
  };

  const rows = Array.from(
    page.querySelectorAll("#ecTableBody tr")
  );

  const summary = page.querySelector("#ecResultSummary");
  const noResults = page.querySelector("#ecNoResults");

  function filterRows() {
    const query = filters.search.value.trim().toLowerCase();
    const visibleShips = new Set();
    let count = 0;

    rows.forEach((row) => {
      const matchesSearch =
        !query || row.textContent.toLowerCase().includes(query);

      const matchesFields = [
        ["grade", "grade"],
        ["ship", "ship"],
        ["document", "document"],
        ["disposition", "disposition"],
        ["result", "result"],
        ["status", "status"]
      ].every(([filterName, dataName]) => {
        const value = filters[filterName].value;
        return !value || row.dataset[dataName] === value;
      });

      const visible = matchesSearch && matchesFields;
      row.hidden = !visible;

      if (visible) {
        count++;
        if (row.dataset.ship) visibleShips.add(row.dataset.ship);
      }
    });

    summary.textContent =
      `보고 ${count}건 · 함정 ${visibleShips.size}척 · 계류 0건`;

    noResults.hidden = count > 0;
  }

  Object.values(filters).forEach((element) => {
    element.addEventListener("input", filterRows);
    element.addEventListener("change", filterRows);
  });

  // 엑셀 내보내기 (CSV)
  page.querySelector("#ecExcel")?.addEventListener("click", () => {
    const table = page.querySelector(".ec-table");

    const tableRows = [
      ...table.querySelectorAll("thead tr"),
      ...table.querySelectorAll("tbody tr:not([hidden])")
    ];

    const csv = tableRows.map((row) => {
      return Array.from(row.querySelectorAll("th, td"))
        .map((cell) => {
          const text = cell.innerText
            .replace(/\s+/g, " ")
            .trim()
            .replace(/"/g, '""');

          return `"${text}"`;
        })
        .join(",");
    }).join("\r\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "단속_사건_목록.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  });

  // 출력
  page.querySelector("#ecPrint")?.addEventListener("click", () => {
    window.print();
  });

  // 파일 선택
  const uploadButton = page.querySelector("#ecFileUpload");
  const fileInput = page.querySelector("#ecFileInput");

  uploadButton?.addEventListener("click", () => {
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    alert(`선택한 파일: ${file.name}\n실제 업로드는 서버 연동이 필요합니다.`);
    fileInput.value = "";
  });

  // 사건 등록 버튼
  page.querySelector("#ecAddCase")?.addEventListener("click", () => {
    alert("단속 사건 등록 화면 연결이 필요합니다.");
  });

  filterRows();
});

/* =========================================
   단속·탐지 매칭·검증 SFR-11-02
========================================= */
(() => {
  const root = document.querySelector('.matching-verify-page');
  if (!root) return;

  const tableBody = root.querySelector('#mvTableBody');
  const searchInput = root.querySelector('#mvSearch');
  const gradeSelect = root.querySelector('#mvGrade');
  const areaSelect = root.querySelector('#mvArea');
  const emptyMessage = root.querySelector('#mvEmpty');

  const names = [
    'JINYU', 'JINYU', 'MINFUDINGYU07281', '-',
    'LIAODANYU23787', 'TONG CHENG', '-',
    'LIAOCHANGYU55271', 'LIAOCHANGYU55272',
    'LIAOCHANGYU55290', 'LIAOCHANGYU55290',
    'LIAOWAYU15102', 'LIAO CHANG YU 15281',
    'LIAOCHANGYU15286', 'LIAOCHANGYU65131',
    'LURONGYU50927', 'LIAOCHANGYU55241',
    'LIAO DAN YU 21023', 'LIAOCHANGYU65190', '-'
  ];

  const mmsis = [
    '412000222', '412000222', '412002731', '412016502',
    '412212721', '412018530', '412033165',
    '412200648', '412200649', '412201162',
    '412201162', '412002718', '412203462',
    '412203467', '412203972', '412320143',
    '412204168', '412204948', '412205082', '412205255'
  ];

  const confidence = [
    53, 53, 60, 57, 70, 81, 25, 72, 59, 47,
    47, 58, 53, 70, 74, 40, 94, 52, 56, 80
  ];

  const grades = [
    '심각', '주의', '심각', '주의', '주의',
    '심각', '주의', '주의', '주의', '심각',
    '주의', '주의', '주의', '주의', '주의',
    '경계', '주의', '심각', '주의', '주의'
  ];

  const types = [
    'EEZ_INTRUSION', 'GEAR_ILLEGAL', 'EEZ_INTRUSION',
    'GEAR_ILLEGAL', 'HIGH_RISK_VESSEL', 'HIGH_RISK_VESSEL',
    'GEAR_ILLEGAL', 'GEAR_ILLEGAL', 'GEAR_ILLEGAL',
    'HIGH_RISK_VESSEL', 'GEAR_ILLEGAL', 'GEAR_ILLEGAL',
    'GEAR_ILLEGAL', 'GEAR_ILLEGAL', 'GEAR_ILLEGAL',
    'MMSI 변조', 'GEAR_ILLEGAL', 'HIGH_RISK_VESSEL',
    'GEAR_ILLEGAL', 'HIGH_RISK_VESSEL'
  ];

  const ships = [
    '3103함', '3103함', '3103함', '3202함',
    '1002함', '3005함', '5002함', '1506함',
    '1506함', '1002함', '1002함', '1506함',
    '1506함', '1506함', '1506함', '1002함',
    '1506함', '1002함', '1506함', '1002함'
  ];

  const events = names.map((name, index) => ({
    time: '2026-10-26 22:56:26',
    grade: grades[index],
    type: types[index],
    name,
    mmsi: mmsis[index],
    confidence: confidence[index],
    result: '-',
    area: index < 4 ? '관할 서해청' : '관할 중부청',
    ship: ships[index],
    status: '단속 미등록',
    match: 'unregistered'
  }));

  let activeTab = 'all';
  let visibleEvents = [];

  function badge(text, variant = 'neutral') {
    return `<span class="mv-badge mv-badge-${variant}">${text}</span>`;
  }

  function gradeBadge(grade) {
    if (grade === '심각') return badge(grade, 'danger');
    if (grade === '경계') return badge(grade, 'orange');
    return badge(grade, 'warning');
  }

  function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const grade = gradeSelect.value;
    const area = areaSelect.value;

    visibleEvents = events.filter(event => {
      const matchesTab = activeTab === 'all' || event.match === activeTab;
      const matchesKeyword = !keyword ||
        [event.name, event.mmsi, event.type, event.ship]
          .some(value => value.toLowerCase().includes(keyword));
      const matchesGrade = !grade || event.grade === grade;
      const matchesArea = !area || event.area.includes(area);

      return matchesTab && matchesKeyword && matchesGrade && matchesArea;
    });

    tableBody.innerHTML = visibleEvents.map(event => `
      <tr>
        <td>${event.time}</td>
        <td>${gradeBadge(event.grade)}</td>
        <td>${badge(event.type, event.type === 'MMSI 변조' ? 'warning' : 'neutral')}</td>
        <td>${event.name}</td>
        <td>${event.mmsi}</td>
        <td>${event.confidence}%</td>
        <td>${event.result}</td>
        <td>${badge(event.area)}</td>
        <td>${badge('추천 ' + event.ship)}</td>
        <td>${badge(event.status)}</td>
        <td><input type="radio" name="mvEvent" aria-label="${event.name} 선택"></td>
      </tr>
    `).join('');

    emptyMessage.hidden = visibleEvents.length > 0;
  }

  root.querySelectorAll('[data-mv-tab]').forEach(button => {
    button.addEventListener('click', () => {
      root.querySelectorAll('[data-mv-tab]').forEach(tab => {
        tab.classList.toggle('active', tab === button);
      });
      activeTab = button.dataset.mvTab;
      render();
    });
  });

  [searchInput, gradeSelect, areaSelect].forEach(control => {
    control.addEventListener('input', render);
    control.addEventListener('change', render);
  });

  root.querySelector('#mvExcel').addEventListener('click', () => {
    const headers = [
      '발생 시각', '등급', '탐지 유형', '선박명', 'MMSI',
      'AI 신뢰도', '단속 결과', '지방청', '함정명', '매칭 상태'
    ];

    const rows = visibleEvents.map(event => [
      event.time, event.grade, event.type, event.name,
      event.mmsi, event.confidence + '%', event.result,
      event.area, event.ship, event.status
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '단속_탐지_매칭_검증.csv';
    link.click();
    URL.revokeObjectURL(url);
  });

  root.querySelector('#mvPrint').addEventListener('click', () => {
    window.print();
  });

  root.querySelector('#mvRegister').addEventListener('click', () => {
    alert('단속 사건 등록 화면 연결이 필요합니다.');
  });

  render();
})();

/* =========================================
   단속·탐지 이력 조회 SFR-11-03
========================================= */
(() => {
  const root = document.querySelector('.history-page');
  if (!root) return;

  const chartData = [
    { year: 2016, capture: 137, guide: 0, removal: 0, emergency: 0 },
    { year: 2017, capture: 159, guide: 0, removal: 0, emergency: 0 },
    { year: 2018, capture: 107, guide: 0, removal: 0, emergency: 0 },
    { year: 2019, capture: 117, guide: 0, removal: 0, emergency: 0 },
    { year: 2020, capture: 13, guide: 0, removal: 0, emergency: 0 },
    { year: 2021, capture: 62, guide: 0, removal: 0, emergency: 0 },
    { year: 2022, capture: 50, guide: 0, removal: 0, emergency: 0 },
    { year: 2023, capture: 36, guide: 0, removal: 0, emergency: 0 },
    { year: 2024, capture: 36, guide: 0, removal: 0, emergency: 0 },
    { year: 2025, capture: 56, guide: 0, removal: 0, emergency: 0 },
    { year: 2026, capture: 30, guide: 11, removal: 10, emergency: 6 }
  ];

  const chartBars = root.querySelector('#hiChartBars');
  const maxValue = 180;

  chartBars.innerHTML = chartData.map(item => {
    const bars = [
      ['capture', 'red'],
      ['guide', 'yellow'],
      ['removal', 'blue'],
      ['emergency', 'cyan']
    ].map(([key, color]) => `
      <div class="hi-bar ${color}"
           style="height:${item[key] / maxValue * 100}%"></div>
    `).join('');

    return `
      <div class="hi-year-group" tabindex="0">
        ${bars}
        <span class="hi-year-label">${item.year}</span>
        <div class="hi-chart-tooltip">
          <strong>${item.year}</strong>
          <div class="hi-tooltip-row"><i class="hi-dot red"></i>나포 <b>${item.capture}</b></div>
          <div class="hi-tooltip-row"><i class="hi-dot yellow"></i>계도 <b>${item.guide}</b></div>
          <div class="hi-tooltip-row"><i class="hi-dot blue"></i>퇴거·차단 <b>${item.removal}</b></div>
          <div class="hi-tooltip-row"><i class="hi-dot cyan"></i>긴급피난 <b>${item.emergency}</b></div>
        </div>
      </div>
    `;
  }).join('');

  root.querySelectorAll('.hi-chart-grid span').forEach(el => {
    el.dataset.label = el.textContent;
  });

  const records = [
    ['계도',2026,'4.3.(금)','군산서','진당어03666','단속실시간련 · 유망어구 위치 표시 부표 · 6-③','어청도 남서방 48해리 (허가수역 내측 12해리)',1],
    ['계도',2026,'4.3.(금)','군산서','진당어03699','단속실시간련 · 유망어구 위치 표시 부표 · 6-③','어청도 남서방 48해리 (허가수역 내측 12해리)',1],
    ['계도',2026,'4.3.(금)','군산서','요대종어25203','조업일지기록 · 어종별 어획량 일계, 누계, 누락, 오류 · 3-④','어청도 남서방 48해리 (허가수역 내측 12해리)',1],
    ['계도',2026,'4.2.(목)','군산서','노영어52968','선박서류 · 어장용적 및 배치도 미소지 · 1-⑤','어청도 남서방 67해리 (허가수역 내측 9해리)',1],
    ['계도',2026,'4.2.(목)','군산서','노영어52967','선박서류 · 어장용적 및 배치도 미소지 · 1-⑤','어청도 남서방 67해리 (허가수역 내측 9해리)',1],
    ['계도',2026,'4.2.(목)','목포서','진당어03116','조업일지기록 · 공란에 사선 또는 수정선 방법 오류 · 3-①','가거도 남서방 44해리 (허가수역 내측 11해리)',1],
    ['계도',2026,'3.31.(화)','군산서','노영어55690','조업일지기록 · 수정방법오류 및 날짜미기록 · 3-⑫','어청도 서방 66해리 (허가수역 내측 6해리)',1],
    ['계도',2026,'3.23.(월)','목포서','기영어00999','조업일지관리 · 조업일지 상 선장 서명 누락 · 4-②','가거도 남서 44해리 (허가수역 내측 11해리)',1],
    ['계도',2026,'3.11.(수)','목포서','절상어55005','조업일지기록 · 투망, 양망시간 오류 · 3-②','가거도 남서 35해리 (허가수역 내측 17해리)',1],
    ['계도',2026,'1.28.(수)','군산서','요대금어85779','조업일지기록 · 선장서명누락 · 4-②','어청도 남서방 77해리 (허가수역 내측 4해리)',1],
    ['계도',2026,'1.24.(토)','군산서','노영어50907','단속실시간련 · 포획채취금지기간위반 · 6-④','어청도 남서방 69해리 (허가수역 내측 12해리)',1],
    ['긴급피난',2026,'2026-04-09','목포서','노영어54957','기상불량 · 유영 등 · 매일(113) 현장(3)','가거도',108],
    ['긴급피난',2026,'2026-04-04','목포서','노영어54931','기상불량 · 유영 등 · 매일(53)','가거도',51],
    ['긴급피난',2026,'2026-02-06','목포서','노영어50875','기상불량 · 태풍 등 · 매일(294) 현장(2)','홍도 가거도',298],
    ['긴급피난',2026,'2026-01-19','목포서','노영어51333','기상불량 · 태풍 등 · 매일(48)','홍도 가거도',48],
    ['긴급피난',2026,'2026-01-09','목포서','노영어55055','기상불량 · 태풍 등 · 매일(278) 현장(4)','홍도 흑산도 가거도',268],
    ['긴급피난',2026,'2026-01-02','목포서','요동어1142','기상불량 · 동풍조망 · 현장(3)','홍도 관매도',3],
    ['나포',2026,'26.1.24 14:10','3010함','N','제한조건위반 (기타사항)','어청도 남서방 69해리',1],
    ['나포',2026,'26.1.24 19:15','3015함','월영어15006','무허가','218-8 · 가거도 남서방 55해리',1],
    ['나포',2026,'26.1.24 19:22','3015함','민복정어08611','무허가','218-8 · 가거도 남서방 56해리',1]
  ].map(([type,year,date,agency,vessel,content,location,count]) =>
    ({type,year,date,agency,vessel,content,location,count})
  );

  const tableBody = root.querySelector('#hiTableBody');
  const search = root.querySelector('#hiSearch');
  const empty = root.querySelector('#hiEmpty');
  const pageButtons = root.querySelector('#hiPageButtons');
  const countLabel = root.querySelector('#hiCount');
  const pageInfo = root.querySelector('#hiPageInfo');

  let selectedType = '전체';
  let selectedYear = '전체';
  let page = 1;
  const pageSize = 20;
  let filteredRecords = [];

  function tag(type) {
    const variants = {
      '계도': 'tag-yellow',
      '긴급피난': 'tag-cyan',
      '나포': 'tag-red',
      '퇴거·차단': 'tag-blue'
    };
    return `<span class="hi-tag ${variants[type] || ''}">${type}</span>`;
  }

  function render() {
    const keyword = search.value.trim().toLowerCase();

    filteredRecords = records.filter(item =>
      (selectedType === '전체' || item.type === selectedType) &&
      (selectedYear === '전체' || String(item.year) === selectedYear) &&
      (!keyword || [item.vessel,item.content,item.location,item.agency]
        .some(value => value.toLowerCase().includes(keyword)))
    );

    const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
    page = Math.min(page, totalPages);

    const start = (page - 1) * pageSize;
    const pageRecords = filteredRecords.slice(start, start + pageSize);

    tableBody.innerHTML = pageRecords.map(item => `
      <tr>
        <td>${tag(item.type)}</td>
        <td>${item.year}</td>
        <td>${item.date}</td>
        <td>${item.agency}</td>
        <td>${item.vessel}</td>
        <td>${item.content}</td>
        <td>${item.location}</td>
        <td>${item.count}</td>
      </tr>
    `).join('');

    empty.hidden = pageRecords.length > 0;
    countLabel.textContent =
      `표시 ${filteredRecords.length}건 중 ${filteredRecords.length ? start + 1 : 0}–${Math.min(start + pageSize, filteredRecords.length)}`;
    pageInfo.textContent = `${page} / ${totalPages} 페이지`;

    let buttons = `<button data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>‹</button>`;
    for (let p = 1; p <= totalPages; p++) {
      buttons += `<button data-page="${p}" class="${p === page ? 'active' : ''}">${p}</button>`;
    }
    buttons += `<button data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''}>›</button>`;
    pageButtons.innerHTML = buttons;
  }

  root.querySelectorAll('#hiTypeFilters button').forEach(button => {
    button.addEventListener('click', () => {
      selectedType = button.dataset.type;
      root.querySelectorAll('#hiTypeFilters button').forEach(el =>
        el.classList.toggle('active', el === button));
      page = 1;
      render();
    });
  });

  root.querySelectorAll('#hiYearFilters button').forEach(button => {
    button.addEventListener('click', () => {
      selectedYear = button.dataset.year;
      root.querySelectorAll('#hiYearFilters button').forEach(el =>
        el.classList.toggle('active', el === button));
      page = 1;
      render();
    });
  });

  search.addEventListener('input', () => {
    page = 1;
    render();
  });

  pageButtons.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    render();
  });

  root.querySelector('#hiPrint').addEventListener('click', () => window.print());

  root.querySelector('#hiExport').addEventListener('click', () => {
    const rows = [
      ['유형','연도','일시','소속·함정','대상 선박','내용','위치','척수'],
      ...filteredRecords.map(item => [
        item.type,item.year,item.date,item.agency,
        item.vessel,item.content,item.location,item.count
      ])
    ];
    const csv = rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(',')
    ).join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '단속_탐지_이력.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  render();
})();

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('saMonthlyChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const monthlyData = {
    labels: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    datasets: [
      {
        label: '검색',
        data: [52, 67, 116, 71, 49, null, null, null, null, null, null, null],
        borderColor: '#3983FF',
        backgroundColor: '#3983FF',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
        spanGaps: false
      },
      {
        label: '나포',
        data: [4, 1, 6, 3, 0, null, null, null, 0, 0, 0, 0],
        borderColor: '#9053F5',
        backgroundColor: '#9053F5',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
        spanGaps: false
      },
      {
        label: '계도',
        data: [2, 0, 3, 11, 2, null, null, null, 0, 0, 0, 0],
        borderColor: '#0CBA86',
        backgroundColor: '#0CBA86',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
        spanGaps: false
      }
    ]
  };

  new Chart(canvas, {
    type: 'line',
    data: monthlyData,
    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: 'index',
        intersect: false
      },

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          position: 'nearest',

          backgroundColor: '#0D1117',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',

          borderColor: '#476187',
          borderWidth: 1,

          padding: 12,
          cornerRadius: 10,

          titleFont: {
            size: 13,
            weight: '500'
          },

          bodyFont: {
            size: 12,
            weight: '500'
          },

          bodySpacing: 7,
          boxPadding: 5,
          usePointStyle: true,

          callbacks: {
            label(context) {
              return ` ${context.dataset.label}     ${context.parsed.y}`;
            }
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#8193AF',
            font: {
              size: 10
            }
          },
          border: {
            color: '#8A9BB6'
          }
        },

        y: {
          min: 0,
          max: 120,

          ticks: {
            stepSize: 20,
            color: '#8193AF',
            font: {
              size: 10
            }
          },

          grid: {
            color: '#8A9BB6',
            borderDash: [4, 3],
            lineWidth: 1
          },

          border: {
            display: false
          }
        }
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // 보고서 페이지가 아니면 실행하지 않음
  if (!document.getElementById('rpReportList')) return;
  
  const initialReports = [
    {
      id: 'REP-20260917-0001',
      title: '3001함 인천 본부 (서해 EEZ) 순찰경로 검토·확정 보고서',
      date: '2026. 9. 17. 오후 5:27:15',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    },
    {
      id: 'REP-20260910-0001',
      title: '불법조업 외국어선 특별단속 계획',
      date: '2026. 9. 10. 오후 4:41:26',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    },
    {
      id: 'REP-20260909-0001',
      title: '불법조업 외국어선 특별단속 계획',
      date: '2026. 9. 9. 오후 4:50:17',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    },
    {
      id: 'REP-20260908-0001',
      title: '불법조업 외국어선 특별단속 계획',
      date: '2026. 9. 8. 오후 4:57:09',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    },
    {
      id: 'REP-20260902-0001',
      title: '관계부처 합동회의 자료',
      date: '2026. 9. 2. 오후 4:23:53',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    },
    {
      id: 'REP-20260901-0001',
      title: '불법조업 외국어선 특별단속 계획_예방정착중',
      date: '2026. 9. 1. 오전 8:52:52',
      format: 'HWPX',
      status: 'DRAFT',
      description: ''
    }
  ];

  let reports = initialReports.map(report => ({ ...report }));

  const list = document.getElementById('rpReportList');
  const search = document.getElementById('rpSearch');
  const count = document.getElementById('rpCount');
  const empty = document.getElementById('rpEmpty');

  const modal = document.getElementById('rpModal');
  const form = document.getElementById('rpReportForm');
  const titleInput = document.getElementById('rpTitle');
  const descriptionInput = document.getElementById('rpDescription');
  const editIdInput = document.getElementById('rpEditId');

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);

  function refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function renderReports() {
    const keyword = search.value.trim().toLowerCase();

    const filtered = reports.filter(report =>
      `${report.title} ${report.id}`.toLowerCase().includes(keyword)
    );

    count.textContent = `${filtered.length}건`;
    empty.hidden = filtered.length > 0;

    list.innerHTML = filtered.map(report => `
      <article class="rp-report-card">
        <span class="rp-report-status">${escapeHTML(report.status)}</span>

        <h3 class="rp-report-title">
          ${escapeHTML(report.title)}
        </h3>

        <div class="rp-report-id">
          ${escapeHTML(report.id)}
        </div>

        <div class="rp-report-meta">
          <i data-lucide="clock-3"></i>
          <span>${escapeHTML(report.date)}</span>
          <span>·</span>
          <span>${escapeHTML(report.format)}</span>
        </div>

        <div class="rp-report-actions">
          <button
            type="button"
            class="rp-btn"
            data-action="edit"
            data-id="${escapeHTML(report.id)}"
          >
            <i data-lucide="pencil"></i>
            편집
          </button>

          <button
            type="button"
            class="rp-btn rp-btn-download"
            data-action="download"
            data-id="${escapeHTML(report.id)}"
          >
            <i data-lucide="download"></i>
            한글
          </button>

          <button
            type="button"
            class="rp-btn rp-btn-delete"
            data-action="delete"
            data-id="${escapeHTML(report.id)}"
          >
            <i data-lucide="trash-2"></i>
            삭제
          </button>
        </div>
      </article>
    `).join('');

    refreshIcons();
  }

  function openModal(report = null) {
    form.reset();

    editIdInput.value = report?.id || '';
    titleInput.value = report?.title || '';
    descriptionInput.value = report?.description || '';

    document.getElementById('rpModalTitle').textContent =
      report ? '보고서 편집' : '새 보고서';

    modal.hidden = false;
    titleInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
  }

  if (search) {
  search.addEventListener('input', renderReports);
}

 const rpRefresh = document.getElementById('rpRefresh');

if (rpRefresh) {
  rpRefresh.addEventListener('click', () => {
    renderReports();
  });
}
const rpNew = document.getElementById('rpNew');

if (rpNew) {
  rpNew.addEventListener('click', () => {
    openModal();
  });
}

  // 보고서 카드 버튼
  list?.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = button.dataset.id;
    const report = reports.find(item => item.id === id);
    if (!report) return;

    if (button.dataset.action === 'edit') {
      openModal(report);
    }

    if (button.dataset.action === 'download') {
      alert('HWPX 파일 다운로드는 실제 보고서 생성 API 연동이 필요합니다.');
    }

    if (button.dataset.action === 'delete') {
      if (!confirm(`"${report.title}" 보고서를 삭제하시겠습니까?`)) return;

      reports = reports.filter(item => item.id !== id);
      renderReports();
    }
  });

  // 저장
  form?.addEventListener('submit', event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) return;

    const editId = editIdInput.value;

    if (editId) {
      const report = reports.find(item => item.id === editId);
      if (report) {
        report.title = title;
        report.description = descriptionInput.value.trim();
      }
    } else {
      const now = new Date();

      const dateKey = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
      ].join('');

      const sequence = String(
        reports.filter(item => item.id.startsWith(`REP-${dateKey}`)).length + 1
      ).padStart(4, '0');

      reports.unshift({
        id: `REP-${dateKey}-${sequence}`,
        title,
        description: descriptionInput.value.trim(),
        date: now.toLocaleString('ko-KR'),
        format: 'HWPX',
        status: 'DRAFT'
      });
    }

    closeModal();
    search.value = '';
    renderReports();
  });

  document.getElementById('rpModalClose').addEventListener('click', closeModal);
  document.getElementById('rpCancel').addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  
  renderReports();
});

document.addEventListener('DOMContentLoaded', () => {
  const colors = {
    blue: '#3985F9',
    purple: '#9058F5',
    cyan: '#00B8D4',
    green: '#10B981',
    orange: '#FF791C',
    red: '#F84141'
  };

  const types = [
    '2척식저인망(본선)',
    '2척식저인망(부속선)',
    '유망',
    '운반선',
    '위망',
    '1척식저인망'
  ];

  const typeColors = [
    colors.blue,
    colors.purple,
    colors.cyan,
    colors.green,
    colors.orange,
    colors.red
  ];

  // ======================================
  // 도넛 차트
  // ======================================
  const donutCanvas = document.getElementById('permitDonutChart');

  if (donutCanvas && window.Chart) {
    new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: types,
        datasets: [{
          data: [348, 348, 309, 43, 16, 13],
          backgroundColor: typeColors,
          borderColor: '#f0f4fa',
          borderWidth: 2,
          hoverOffset: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '56%',
        layout: {
          padding: 10
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0C1118',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label(context) {
                const total = context.dataset.data.reduce(
                  (sum, value) => sum + value, 0
                );

                const percent = (
                  context.parsed / total * 100
                ).toFixed(2);

                return ` ${context.label}: ${context.parsed}척 (${percent}%)`;
              }
            }
          }
        }
      }
    });
  }

  // ======================================
  // 월별 입역 보고 막대그래프
  // ======================================
  const monthlyCanvas = document.getElementById('permitMonthlyChart');

  if (monthlyCanvas && window.Chart) {
    const monthlyData = [
      {
        label: types[0],
        color: colors.blue,
        data: [1112, 575, 530, 104, 0, 0]
      },
      {
        label: types[1],
        color: colors.purple,
        data: [1112, 575, 530, 104, 0, 0]
      },
      {
        label: types[2],
        color: colors.cyan,
        data: [51, 148, 215, 205, 68, 12]
      },
      {
        label: types[3],
        color: colors.green,
        data: [0, 0, 0, 0, 0, 0]
      },
      {
        label: types[4],
        color: colors.orange,
        data: [25, 0, 0, 0, 0, 0]
      },
      {
        label: types[5],
        color: colors.red,
        data: [59, 37, 25, 18, 0, 0]
      }
    ];

    new Chart(monthlyCanvas, {
      type: 'bar',
      data: {
        labels: ['01월', '02월', '03월', '04월', '05월', '09월'],
        datasets: monthlyData.map(item => ({
          label: item.label,
          data: item.data,
          backgroundColor: item.color,
          borderRadius: 2,
          maxBarThickness: 23,
          categoryPercentage: 0.8,
          barPercentage: 0.95
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        layout: {
          padding: {
            top: 8,
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#7185A3',
              font: { size: 11 }
            },
            border: {
              color: '#476187'
            }
          },
          y: {
            beginAtZero: true,
            max: 1200,
            ticks: {
              stepSize: 200,
              color: '#8294B1',
              font: { size: 11 }
            },
            grid: {
              color: '#8191A9',
              borderDash: [4, 3]
            },
            border: {
              display: false,
              dash: [4, 3]
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'center',
            labels: {
              boxWidth: 9,
              boxHeight: 9,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              color: '#8294B1',
              font: { size: 11 },
              padding: 12
            }
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            position: 'nearest',

            backgroundColor: '#0C1118',
            borderColor: '#34445E',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 16,

            displayColors: true,
            usePointStyle: true,
            boxWidth: 12,
            boxHeight: 12,
            boxPadding: 8,

            titleColor: '#F2F6FF',
            bodyColor: '#F2F6FF',

            titleFont: {
              size: 14,
              weight: 'normal'
            },
            bodyFont: {
              size: 13,
              weight: 'normal'
            },

            titleMarginBottom: 12,
            bodySpacing: 12,

            callbacks: {
              title(items) {
                return items[0]?.label || '';
              },

              label(context) {
                const name = context.dataset.label;
                const value = Number(context.parsed.y).toLocaleString();
                return ` ${name}   ${value}`;
              },

              labelPointStyle() {
                return {
                  pointStyle: 'circle',
                  rotation: 0
                };
              }
            }
          }
        }
      }
    });
  }

  // ======================================
  // 분석 탭
  // 현재 화면은 어업별 분석만 구현
  // ======================================
  const analysisTabs = document.querySelectorAll('.permit-tabs button');

  analysisTabs.forEach(button => {
    button.addEventListener('click', () => {
      if (!button.classList.contains('active')) {
        return;
      }
    });
  });

  // ======================================
  // 지도 전체 / 입역 / 출역
  // ======================================
  const mapTabs = document.querySelectorAll('.permit-map-tabs button');
  const mapModeLabel = document.getElementById('permitMapModeLabel');

  mapTabs.forEach(button => {
    button.addEventListener('click', () => {
      mapTabs.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      if (mapModeLabel) {
        mapModeLabel.textContent = button.dataset.mapMode;
      }
    });
  });

  // ======================================
  // 지도 확대 / 축소
  // ======================================
  const mapImage = document.getElementById('permitMapImage');
  const zoomIn = document.getElementById('permitZoomIn');
  const zoomOut = document.getElementById('permitZoomOut');

  let zoom = 1;

  const applyZoom = () => {
    if (mapImage) {
      mapImage.style.transform = `scale(${zoom})`;
    }
  };

  zoomIn?.addEventListener('click', () => {
    zoom = Math.min(2.5, zoom + 0.2);
    applyZoom();
  });

  zoomOut?.addEventListener('click', () => {
    zoom = Math.max(1, zoom - 0.2);
    applyZoom();
  });

  if (window.lucide) {
    lucide.createIcons();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("vesselTableBody");
  const form = document.getElementById("vesselFilterForm");
  const keyword = document.getElementById("vesselKeyword");
  const typeSelect = document.getElementById("vesselType");
  const areaSelect = document.getElementById("vesselArea");
  const pageNumbers = document.getElementById("vesselPageNumbers");
  const pageStatus = document.getElementById("vesselPageStatus");
  const countLabel = document.getElementById("vesselListCount");
  const pagination = document.querySelector(".vessel-pagination");

  if (!tbody || !form || !pagination) return;

  const vessels = [
    ["C21-10087", "浙岭渔20865", "zhelingyu20865", "zhelingyu20865", "412419348", "PT", "본선", "zhelingyu20866 (추정)", "II,III", "100", "217", "中国温岭", "薛金娥"],
    ["C21-10119", "浙岭渔20617", "zhelingyu20617", "zhelingyu20617", "412419265", "PT", "본선", "zhelingyu20618", "II,III", "100", "216", "中国温岭", "王梦萍"],
    ["C21-10120", "浙岭渔20618", "zhelingyu20618", "zhelingyu20618", "412419266", "PT-S", "부속선", "zhelingyu20617", "II,III", "0", "216", "中国温岭", "王梦萍"],
    ["C21-10143", "浙象渔49003", "zhexiangyu49003", "zhexiangyu49003", "412437071", "PT", "본선", "zhexiangyu49004", "II,III", "100", "216", "中国象山", "章金波"],
    ["C21-10144", "浙象渔49004", "zhexiangyu49004", "zhexiangyu49004", "412437072", "PT-S", "부속선", "zhexiangyu49003", "II,III", "0", "216", "中国象山", "章金波"],
    ["C21-10155", "浙岭渔23887", "zhelingyu23887", "zhelingyu23887", "412419502", "PT", "본선", "zhelingyu23888 (추정)", "II,III", "100", "218", "中国温岭", "王荣洪"],
    ["C21-10190", "浙象渔49021", "zhexiangyu49021", "zhexiangyu49021", "412419702", "PT", "본선", "zhexiangyu49022", "II,III", "100", "216", "中国象山", "柯红军"],
    ["C21-10191", "浙象渔49022", "zhexiangyu49022", "zhexiangyu49022", "412419703", "PT-S", "부속선", "zhexiangyu49021", "II,III", "0", "216", "中国象山", "柯红军"],
    ["C21-10194", "浙岭渔28881", "zhelingyu28881", "zhelingyu28881", "412419688", "PT", "본선", "zhelingyu28882 (추정)", "II,III", "100", "216", "中国温岭", "郭文玉"],
    ["C21-10195", "浙岭渔28882", "zhelingyu28882", "zhelingyu28882", "412419689", "PT-S", "부속선", "zhelingyu28881 (추정)", "II,III", "0", "216", "中国温岭", "江维生"],
    ["C21-10205", "浙岭渔23855", "zhelingyu23855", "zhelingyu23855", "412418917", "PT", "본선", "zhelingyu23856 (추정)", "II,III", "100", "218", "中国温岭", "林跃庆"],
    ["C21-10206", "浙岭渔23856", "zhelingyu23856", "zhelingyu23856", "412419818", "PT-S", "부속선", "zhelingyu23855 (추정)", "II,III", "0", "218", "中国温岭", "林跃强"],
    ["C21-10279", "辽大中渔25087", "liaodazhongyu25087", "liaodazhongyu25087", "412200561", "PT", "본선", "liaodazhongyu25088", "II,III", "100", "175", "中国大连", "吴冬"],
    ["C21-10280", "辽大中渔25088", "liaodazhongyu25088", "liaodazhongyu25088", "412200562", "PT-S", "부속선", "liaodazhongyu25087", "II,III", "0", "175", "中国大连", "吴冬"],
    ["C21-10621", "浙岭渔20866", "zhelingyu20866", "zhelingyu20866", "412419541", "PT-S", "부속선", "zhelingyu20865 (추정)", "II,III", "0", "217", "中国温岭", "陈海华"]
  ];

  const typeNames = {
    "PT": "2척식저인망어업",
    "PT-S": "2척식저인망어업(부속선)",
    "GN": "유망",
    "FC": "운반선",
    "PS": "위망",
    "OT": "1척식저인망"
  };

  const pageSize = 15;
  let currentPage = 1;
  let filtered = [...vessels];

  // HTML 특수문자 처리
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function renderTable() {
    const start = (currentPage - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);

    if (!rows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="14" style="text-align:center;padding:40px;">
            검색 결과가 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rows.map((row, index) => {
      const [
        permit, nameCN, nameEN, callSign, mmsi,
        type, role, roleSub, area, quota, tonnage, port, owner
      ] = row;

      const period = role === "본선"
        ? "2026/01/01 - 2026/04/15"
        : "2026/01/16 - 2026/12/31";

      return `
        <tr>
          <td>${start + index + 1}</td>
          <td class="vessel-permit-number">${escapeHTML(permit)}</td>
          <td>
            <a href="#" class="vessel-name-link" data-vessel="${escapeHTML(permit)}">
              ${escapeHTML(nameCN)}
            </a>
          </td>
          <td>
            <a href="#" class="vessel-name-link" data-vessel="${escapeHTML(permit)}">
              ${escapeHTML(nameEN)}
            </a>
          </td>
          <td>${escapeHTML(callSign)}</td>
          <td>${escapeHTML(mmsi)}</td>
          <td>${escapeHTML(type)} · ${escapeHTML(typeNames[type] || "")}</td>
          <td>
            <span class="vessel-role">${escapeHTML(role)}</span>
            <span class="vessel-role-sub">짝: ${escapeHTML(roleSub)}</span>
          </td>
          <td>${escapeHTML(area)}</td>
          <td class="vessel-period">
            ${period}<br>
            2026/10/16 - 2026/12/31
          </td>
          <td class="vessel-number">${escapeHTML(quota)}</td>
          <td class="vessel-number">${escapeHTML(tonnage)}</td>
          <td>${escapeHTML(port)}</td>
          <td>${escapeHTML(owner)}</td>
        </tr>
      `;
    }).join("");
  }

  function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    let html = "";

    for (let page = 1; page <= totalPages; page++) {
      html += `
        <button
          type="button"
          data-page="${page}"
          class="${page === currentPage ? "active" : ""}"
          ${page === currentPage ? 'aria-current="page"' : ""}
        >${page}</button>
      `;
    }

    pageNumbers.innerHTML = html;
    pageStatus.textContent = `${currentPage} / ${totalPages}`;

    pagination.querySelector('[data-page-action="first"]').disabled =
      currentPage === 1;
    pagination.querySelector('[data-page-action="prev"]').disabled =
      currentPage === 1;
    pagination.querySelector('[data-page-action="next"]').disabled =
      currentPage === totalPages;
    pagination.querySelector('[data-page-action="last"]').disabled =
      currentPage === totalPages;
  }

  function render() {
    renderTable();
    renderPagination();
  }

  function applyFilters() {
    const q = keyword.value.trim().toLowerCase();
    const type = typeSelect.value;
    const area = areaSelect.value;

    filtered = vessels.filter(row => {
      const matchesKeyword =
        !q || row.some(value => String(value).toLowerCase().includes(q));

      const matchesType = !type || row[5] === type;

      const matchesArea =
        !area || row[8].split(",").map(v => v.trim()).includes(area);

      return matchesKeyword && matchesType && matchesArea;
    });

    currentPage = 1;

    countLabel.textContent =
      filtered.length === vessels.length && !q && !type && !area
        ? "1,077건"
        : `${filtered.length.toLocaleString()}건`;

    render();
  }

  keyword.addEventListener("input", applyFilters);
  typeSelect.addEventListener("change", applyFilters);
  areaSelect.addEventListener("change", applyFilters);

  form.addEventListener("submit", event => {
    event.preventDefault();
    applyFilters();
  });

  form.addEventListener("reset", () => {
    requestAnimationFrame(applyFilters);
  });

  pagination.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    if (button.dataset.page) {
      currentPage = Number(button.dataset.page);
    } else {
      switch (button.dataset.pageAction) {
        case "first": currentPage = 1; break;
        case "prev": currentPage = Math.max(1, currentPage - 1); break;
        case "next": currentPage = Math.min(totalPages, currentPage + 1); break;
        case "last": currentPage = totalPages; break;
      }
    }

    render();
  });

  tbody.addEventListener("click", event => {
    const link = event.target.closest("[data-vessel]");
    if (!link) return;

    event.preventDefault();
    // 상세조회 페이지 URL 연결 시 여기에 추가
  });

  render();
});

/* ==========================================
   공동대응시스템 - 전체 목록
========================================== */

(function () {
  const root = document.querySelector(".joint-vessel-page");
  if (!root) return;

  const tbody = root.querySelector("#jointTableBody");
  const searchForm = root.querySelector("#jointSearchForm");
  const summary = root.querySelector("#jointResultSummary");
  const pageNumbers = root.querySelector("#jointPageNumbers");
  const pagination = root.querySelector(".joint-pagination");

  const PAGE_SIZE = 15;
  let currentPage = 1;
  let filteredRows = [];

  const names = [
    "절림어21876",
    "경담어19665",
    "경담어33898",
    "절림어21900",
    "절림어21321",
    "절림어21678",
    "절보어62201",
    "절대어15273",
    "절대어15325",
    "절상어12089",
    "민조어60678",
    "절상어13117",
    "절상어50007",
    "민하어01927",
    "민하어01917"
  ];

  const times = [
    "2026-09-16 08:18",
    "2026-09-16 08:13",
    "2026-09-16 08:10",
    "2026-09-16 08:07",
    "2026-09-16 08:05",
    "2026-09-16 08:00",
    "2026-09-08 11:55",
    "2026-09-08 11:09",
    "2026-09-08 11:09",
    "2026-09-08 10:45",
    "2026-09-08 10:39",
    "2026-09-08 10:30",
    "2026-09-08 10:15",
    "2026-09-08 10:13",
    "2026-09-08 09:45"
  ];

  const rows = names.map((name, index) => ({
    id: index + 1,
    no: index < 6 ? "3696" : index % 3 === 0 ? "3695" : "3694",
    time: times[index],
    subNo: [6, 5, 4, 3, 2, 1, 4, 7, 8, 3, 6, 2, 1, 5, 4][index],
    agency: index < 7 ? "남해어업관리단" : "서해어업관리단",
    patrol: index < 7 ? "무궁화32호" : index % 2 ? "무궁화15호" : "무궁화33호",
    name,
    latitude: index < 7 ? "32-16.5N" : "34-57.7N",
    longitude: index < 7 ? "125-18.6E" : "123-47.4E",
    grid: index < 7 ? "250-5" : "199-2",
    discovery: "잠정조치수역",
    notification: index < 7
      ? "2026-09-18 11:11:53"
      : "2026-09-09 14:15:30",
    read: "미열람",
    documentNo: `DOC-2026-${String(index + 1).padStart(4, "0")}`
  }));

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function renderTable() {
    const total = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRows = filteredRows.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = pageRows.length
      ? pageRows.map(row => `
        <tr>
          <td>${escapeHtml(row.no)}</td>
          <td>${escapeHtml(row.time)}</td>
          <td>${escapeHtml(row.subNo)}</td>
          <td>${escapeHtml(row.agency)}</td>
          <td>${escapeHtml(row.patrol)}</td>
          <td>
            <a href="#" class="joint-vessel-name" data-joint-id="${row.id}">
              ${escapeHtml(row.name)}
            </a>
          </td>
          <td>${escapeHtml(row.latitude)}</td>
          <td>${escapeHtml(row.longitude)}</td>
          <td>${escapeHtml(row.grid)}</td>
          <td>
            <span class="joint-type-badge">
              ${escapeHtml(row.discovery)}
            </span>
            · ${escapeHtml(row.discovery)}
          </td>
          <td>${escapeHtml(row.notification)}</td>
          <td>
            <span class="joint-unread-badge">
              ${escapeHtml(row.read)}
            </span>
          </td>
        </tr>
      `).join("")
      : `<tr><td colspan="12" style="padding:32px;text-align:center;">
          검색 결과가 없습니다.
        </td></tr>`;

    summary.textContent = total
      ? `${start + 1}–${Math.min(start + PAGE_SIZE, total)} / ${total.toLocaleString()}건 (${currentPage}/${totalPages} 페이지) · 미열람 ${filteredRows.filter(row => row.read === "미열람").length}건`
      : "검색 결과 0건";

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const start = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const end = Math.min(start + 9, totalPages);

    pageNumbers.innerHTML = Array.from(
      { length: end - start + 1 },
      (_, index) => {
        const page = start + index;
        return `
          <button
            type="button"
            data-joint-page-number="${page}"
            class="${page === currentPage ? "active" : ""}"
            ${page === currentPage ? 'aria-current="page"' : ""}
          >${page}</button>
        `;
      }
    ).join("");

    pagination.querySelectorAll("[data-joint-page]").forEach(button => {
      const action = button.dataset.jointPage;
      button.disabled =
        (["first", "prev"].includes(action) && currentPage === 1) ||
        (["next", "last"].includes(action) && currentPage === totalPages);
    });
  }

  function applyFilters() {
    const vesselName = root.querySelector("#jointVesselName").value.trim().toLowerCase();
    const documentNo = root.querySelector("#jointDocumentNo").value.trim().toLowerCase();
    const agency = root.querySelector("#jointAgency").value;
    const discovery = root.querySelector("#jointDiscoveryType").value;
    const detail = root.querySelector("#jointDiscoveryDetail").value;
    const read = root.querySelector("#jointEntryStatus").value;

    filteredRows = rows.filter(row =>
      (!vesselName || row.name.toLowerCase().includes(vesselName)) &&
      (!documentNo || row.documentNo.toLowerCase().includes(documentNo)) &&
      (!agency || row.agency === agency) &&
      (!discovery || row.discovery === discovery) &&
      (!detail || row.discovery === detail) &&
      (!read || row.read === read)
    );

    currentPage = 1;
    renderTable();
  }

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    applyFilters();
  });

  searchForm.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      filteredRows = [...rows];
      currentPage = 1;
      renderTable();
    });
  });

  pagination.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
    const number = button.dataset.jointPageNumber;

    if (number) {
      currentPage = Number(number);
    } else {
      switch (button.dataset.jointPage) {
        case "first": currentPage = 1; break;
        case "prev": currentPage = Math.max(1, currentPage - 1); break;
        case "next": currentPage = Math.min(totalPages, currentPage + 1); break;
        case "last": currentPage = totalPages; break;
      }
    }

    renderTable();
  });

  tbody.addEventListener("click", event => {
    const link = event.target.closest(".joint-vessel-name");
    if (!link) return;
    event.preventDefault();
    // 상세조회 페이지 URL 연결 시 여기에 이동 로직 추가
  });

  filteredRows = [...rows];
  renderTable();
})();

/* =========================================
   상세조회 페이지
========================================= */

(function () {
  const root = document.querySelector(".vessel-detail-page");
  if (!root) return;

  const vessels = [
    {
      permit: "C21-10087",
      nameCn: "浙岭渔20865",
      nameEn: "zhelingyu20865",
      type: "2척식저인망어업",
      captain: "薛金娥",
      port: "中国温岭",
      owner: "薛金娥",
      tonnage: "217",
      area: "II, III",
      callsign: "zhelingyu20865",
      mmsi: "412419348"
    },
    {
      permit: "C21-10119",
      nameCn: "浙岭渔20617",
      nameEn: "zhelingyu20617",
      type: "2척식저인망어업",
      captain: "王梦萍",
      port: "中国温岭",
      owner: "王梦萍",
      tonnage: "216",
      area: "II, III",
      callsign: "zhelingyu20617",
      mmsi: "412419265"
    },
    {
      permit: "C21-10120",
      nameCn: "浙岭渔20618",
      nameEn: "zhelingyu20618",
      type: "2척식저인망어업(부속선)",
      captain: "王梦萍",
      port: "中国温岭",
      owner: "王梦萍",
      tonnage: "216",
      area: "II, III",
      callsign: "zhelingyu20618",
      mmsi: "412419266"
    },
    {
      permit: "C21-10143",
      nameCn: "浙象渔49003",
      nameEn: "zhexiangyu49003",
      type: "2척식저인망어업",
      captain: "章金波",
      port: "中国象山",
      owner: "章金波",
      tonnage: "216",
      area: "II, III",
      callsign: "zhexiangyu49003",
      mmsi: "412437071"
    },
    {
      permit: "C21-10144",
      nameCn: "浙象渔49004",
      nameEn: "zhexiangyu49004",
      type: "2척식저인망어업(부속선)",
      captain: "章金波",
      port: "中国象山",
      owner: "章金波",
      tonnage: "216",
      area: "II, III",
      callsign: "zhexiangyu49004",
      mmsi: "412437072"
    }
  ];

  const TOTAL_COUNT = 1077;
  const PAGE_SIZE = 5;
  const TOTAL_PAGES = Math.ceil(TOTAL_COUNT / PAGE_SIZE);

  const cards = root.querySelector("#detailVesselCards");
  const infoBody = root.querySelector("#detailInfoBody");
  const infoTitle = root.querySelector("#detailInfoTitle");
  const pageStatus = root.querySelector("#detailCardPageStatus");
  const currentPageLabel = root.querySelector("#detailCurrentPage");

  let currentPage = 1;
  let selectedIndex = 0;
  let filtered = vessels.slice();
  let isSearching = false;

  const escapeHTML = (value) =>
    String(value ?? "-").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  function getVisibleVessels() {
    if (isSearching) {
      return filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      );
    }

    // 현재 제공된 샘플 데이터는 첫 페이지 5건
    return currentPage === 1 ? vessels : [];
  }

  function renderCards() {
    const visible = getVisibleVessels();

    cards.innerHTML = visible.length
      ? visible.map((v, index) => `
        <button
          type="button"
          class="detail-vessel-card ${index === selectedIndex ? "active" : ""}"
          data-vessel-index="${index}"
          aria-pressed="${index === selectedIndex}"
        >
          <span class="card-no">NO.${(currentPage - 1) * PAGE_SIZE + index + 1}</span>
          <strong class="card-title">허가번호 ${escapeHTML(v.permit)}</strong>
          <span class="card-line">- 구분 : ${escapeHTML(v.type)}</span>
          <span class="card-line">- 어선명 : ${escapeHTML(v.nameCn)}</span>
          <span class="card-line">- 선주명 : ${escapeHTML(v.owner)}</span>
          <span class="card-line">- 조업수역 : ${escapeHTML(v.area)}</span>
          <span class="card-line">- 톤수 : ${escapeHTML(v.tonnage)}</span>
        </button>
      `).join("")
      : `<div class="detail-empty-state" style="grid-column:1/-1">
           표시할 선박 데이터가 없습니다.
         </div>`;

    const totalPages = isSearching
      ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
      : TOTAL_PAGES;

    pageStatus.textContent = `${currentPage} / ${totalPages}`;
    currentPageLabel.textContent = currentPage;

    root.querySelectorAll("[data-detail-page]").forEach((button) => {
      const action = button.dataset.detailPage;
      button.disabled =
        (["first", "prev"].includes(action) && currentPage === 1) ||
        (["next", "last"].includes(action) && currentPage === totalPages);
    });

    if (visible.length) {
      selectedIndex = Math.min(selectedIndex, visible.length - 1);
      renderInfo(visible[selectedIndex]);
    } else {
      infoTitle.textContent = "상세정보";
      infoBody.innerHTML = "";
    }
  }

  function renderInfo(v) {
    infoTitle.textContent = `상세정보 — 허가번호 ${v.permit}`;

    const rows = [
      [
        ["허가년도", "2026"],
        ["허가번호", v.permit],
        ["허가시작일자", "20260210"],
        ["허가종료일자", "20261231"]
      ],
      [
        ["허가유무", "허가"],
        ["허가종료사유", "-"],
        ["어선명(중문)", v.nameCn],
        ["어선명(로마)", v.nameEn]
      ],
      [
        ["어선번호", "(浙岭)渔登(籍)(2024)HY-200158号"],
        ["어업종류", v.type],
        ["국적", "중국"],
        ["조업수역", v.area]
      ],
      [
        ["선적항(중문)", v.port],
        ["선적항(로마)", "zhongguowenling"],
        ["국제총톤수", v.tonnage],
        ["등록총톤수", v.tonnage]
      ],
      [
        ["엔진개수", "1"],
        ["마력", "544"],
        ["속도", "11.5"],
        ["길이", "38.93"]
      ],
      [
        ["폭", "7"],
        ["깊이", "3.7"],
        ["선주명(중문)", v.owner],
        ["선주명(로마)", "xuejine"]
      ],
      [
        ["주소(중문)", "浙江省温岭市石塘镇"],
        ["주소(로마)", "zhejiangshengwenling"],
        ["선장명(중문)", v.captain],
        ["선장명(로마)", "chenxiangyu"]
      ],
      [
        ["승선원", "11"],
        ["호출부호", v.callsign],
        ["긴급호출", "2182"],
        ["무선국", "38.5"]
      ],
      [
        ["냉장수량", "3"],
        ["냉동수량", "0"],
        ["냉장용량", "192.6"],
        ["냉동용량", "0"]
      ],
      [
        ["급수탱크수량", "3"],
        ["급수탱크용량", "31"],
        ["급유탱크수량", "6"],
        ["급유탱크용량", "66.8"]
      ],
      [
        ["부속선척수", "1"],
        ["최대허용어획량", "100"],
        ["", ""],
        ["", ""]
      ]
    ];

    infoBody.innerHTML = rows.map((row) => `
      <tr>
        ${row.map(([label, value]) => `
          <th>${escapeHTML(label)}</th>
          <td>${escapeHTML(value)}</td>
        `).join("")}
      </tr>
    `).join("");
  }

  cards.addEventListener("click", (event) => {
    const card = event.target.closest("[data-vessel-index]");
    if (!card) return;

    selectedIndex = Number(card.dataset.vesselIndex);
    renderCards();
  });

  root.querySelectorAll("[data-detail-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const totalPages = isSearching
        ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
        : TOTAL_PAGES;

      switch (button.dataset.detailPage) {
        case "first":
          currentPage = 1;
          break;
        case "prev":
          currentPage = Math.max(1, currentPage - 1);
          break;
        case "next":
          currentPage = Math.min(totalPages, currentPage + 1);
          break;
        case "last":
          currentPage = totalPages;
          break;
      }

      selectedIndex = 0;
      renderCards();
    });
  });

  root.querySelector("#detailSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const type = root.querySelector("#detailSearchType").value;
    const keyword = root.querySelector("#detailSearchKeyword")
      .value.trim().toLowerCase();
    const filter = root.querySelector("#detailSearchFilter").value;

    const keyMap = {
      permit: "permit",
      name: "nameCn",
      callsign: "callsign",
      mmsi: "mmsi"
    };

    filtered = vessels.filter((v) => {
      const value = String(v[keyMap[type]] || "").toLowerCase();
      const matchesKeyword = !keyword ||
        value.includes(keyword) ||
        (type === "name" && v.nameEn.toLowerCase().includes(keyword));

      const matchesFilter = !filter ||
        (filter === "PT" && v.type === "2척식저인망어업") ||
        (filter === "PT-S" && v.type.includes("부속선")) ||
        (filter !== "PT" && filter !== "PT-S" && v.type.includes(filter));

      return matchesKeyword && matchesFilter;
    });

    isSearching = Boolean(keyword || filter);
    currentPage = 1;
    selectedIndex = 0;
    renderCards();
  });

  renderCards();
})();


/* =========================================
   입출역현황 페이지
========================================= */
(() => {
  const root = document.querySelector(".port-report-page");
  if (!root) return;

  const tbody = root.querySelector("#portReportTableBody");
  const pagination = root.querySelector("#portReportPagination");
  const count = root.querySelector("#portReportCount");
  const form = root.querySelector("#portReportSearchForm");

  const rows = [
    ["C40-8477","jintangyuyun03181","입역","2026-09-25 10:00","E 124°22′0″","N 36°44′0″","160-6","III","2026-09-25 23:00","E 124°32′0″","N 36°44′0″","161-4",11,"-",0],
    ["C40-8477","jintangyuyun03181","출역","2026-09-25 05:00","E 124°19′0″","N 36°45′0″","160-5","III","2026-09-25 03:30","E 124°29′0″","N 36°45′0″","160-6",11,199,260],
    ["C25-16688","jintangyu03886","출역","2026-09-24 12:00","E 124°14′0″","N 36°53′0″","160-2","III","2026-09-24 11:00","E 124°24′0″","N 36°53′0″","160-3",13,199,210],
    ["C25-16923","jintangyu03778","출역","2026-09-24 12:00","E 124°15′0″","N 36°52′0″","160-2","III","2026-09-24 11:00","E 124°25′0″","N 36°52′0″","160-3",13,199,467],
    ["C25-16924","jintangyu03779","출역","2026-09-24 12:00","E 124°15′0″","N 36°52′0″","160-2","III","2026-09-24 10:00","E 124°25′0″","N 36°52′0″","160-3",13,199,200],
    ["C25-16769","jintangyu03887","출역","2026-09-24 10:00","E 124°13′0″","N 36°55′0″","160-2","III","2026-09-24 07:50","E 124°23′0″","N 36°55′0″","160-3",11,199,500],
    ["C40-8477","jintangyuyun03181","입역","2026-09-24 10:00","E 124°22′0″","N 36°45′0″","160-6","III","2026-09-25 02:00","E 124°32′0″","N 36°45′0″","161-4",11,"-",0],
    ["C25-17243","jintangyu03009","출역","2026-09-24 10:00","E 124°13′0″","N 36°55′0″","160-2","III","2026-09-24 08:00","E 124°23′0″","N 36°55′0″","160-3",11,199,500],
    ["C25-17239","jintangyu03699","입역","2026-09-23 12:00","E 124°16′0″","N 36°51′0″","160-2","III","2026-09-24 10:00","E 124°26′0″","N 36°51′0″","160-3",12,"-",0],
    ["C25-16698","jintangyu03666","입역","2026-09-23 12:00","E 124°14′0″","N 36°54′0″","160-2","III","2026-09-24 10:00","E 124°24′0″","N 36°54′0″","160-3",12,"-",0]
  ];

  let filtered = [...rows];
  let page = 1;
  const pageSize = 10;

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[ch]));

  function render() {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.max(1, Math.min(page, totalPages));

    const start = (page - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);

    tbody.innerHTML = visible.map((row, index) => {
      const cells = row.map((value, i) => {
        if (i === 2) {
          const isIn = value === "입역";
          return `<td><span class="port-report-type ${isIn ? "in" : "out"}">${value}</span></td>`;
        }
        return `<td>${escapeHTML(value)}</td>`;
      }).join("");

      return `<tr><td>${start + index + 1}</td>${cells}</tr>`;
    }).join("");

    if (!visible.length) {
      tbody.innerHTML = '<tr><td colspan="16">검색 결과가 없습니다.</td></tr>';
    }

    count.textContent =
      `1~10 / 11,232건 (1/1,124 페이지)`;

    if (filtered.length !== rows.length) {
      count.textContent =
        `${visible.length ? start + 1 : 0}~${start + visible.length} / ${filtered.length}건 (${page}/${totalPages} 페이지)`;
    }

    const items = [
      ["«", 1],
      ["‹", page - 1],
      ...Array.from({ length: totalPages }, (_, i) => [String(i + 1), i + 1]),
      ["›", page + 1],
      ["»", totalPages]
    ];

    pagination.innerHTML = items.map(([label, target]) => `
      <button type="button"
        data-page="${target}"
        class="${label === String(page) ? "active" : ""}"
        ${target < 1 || target > totalPages ? "disabled" : ""}>
        ${label}
      </button>
    `).join("");
  }

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = root.querySelector("#portPermitNo").value.trim().toLowerCase();
    const type = root.querySelector("#portReportType").value;
    const from = root.querySelector("#portStartDate").value;
    const to = root.querySelector("#portEndDate").value;

    filtered = rows.filter((row) => {
      const matchesKeyword = !keyword || row[0].toLowerCase().includes(keyword);
      const matchesType = type === "all" || row[2] === type;
      const date = row[3].slice(0, 10);
      const matchesDate = (!from || date >= from) && (!to || date <= to);

      return matchesKeyword && matchesType && matchesDate;
    });

    page = 1;
    render();
  });

  render();
})();


/* =========================================
   불법어업단속정보 페이지
========================================= */
(() => {
  const root = document.querySelector(".illegal-fishing-page");
  if (!root) return;

  const tbody = root.querySelector("#illegalTableBody");
  const pagination = root.querySelector("#illegalPagination");
  const count = root.querySelector("#illegalListCount");
  const form = root.querySelector("#illegalSearchForm");

  const rows = [
    ["(S)2026-023","노영어55317(鲁荣渔55317)","C21","2척식저인망어업","미설정","서특단3005함,518함","38-00.0N","124-06.0E","특정금지수역 침범조업","처리중","2026-09-16 12:11"],
    ["(S)2026-024","노영어55318(鲁荣渔55318)","C21","2척식저인망어업(부속선)","미설정","서특단3005함,518함","38-00.0N","124-06.0E","특정금지수역 침범조업","처리중","2026-09-16 12:11"],
    ["(S)2026-022","요장어운65118(辽庄渔运65118)","—","통발","미설정","서특단3019함","37-49.0N","124-43.0E","명령불응 조업","통보","2026-09-10 23:30"],
    ["(W)2026-018","요장어55555(辽庄渔55555)","C25-17177","유망어업","대련","무궁화24호","34-35.2N","124-37.2E","위위보고","회신완료","2026-05-16 13:20"],
    ["(S)2026-003","요영어26195(辽营渔26195)","C25-16741","유망어업","영구","무궁화25호","33-55.7N","124-47.1E","조업일지 부실기재","통보","2026-05-12 12:37"],
    ["(S)2026-021","요영어55123(辽营渔55123)","—","통발","영구","서특단3005,501함","38-01.2N","124-31.0E","명령불응 조업","통보","2026-05-08 20:40"],
    ["(S)2026-020","선명이상(船名未详)","—","통발","미설정","서특단3005,526함,SM-02정","38-01.2N","124-31.0E","명령불응 조업","통보","2026-05-08 20:40"],
    ["(W)2026-017","요장어75001(辽庄渔75001)","C25-17116","유망어업","대련","무궁화23호","36-01.0N","125-00.6E","조업일지 부실기재","통보","2026-05-05 05:10"],
    ["(W)2026-016","요와어운55032(辽瓦渔运55032)","C40-8494","일반어획물운반선","대련","무궁화23호","36-09.1N","124-35.0E","조업일지 부실기재","통보","2026-05-05 02:42"],
    ["(W)2026-015","요장어운25267(辽庄渔运25267)","C40-8441","일반어획물운반선","대련","무궁화23호","34-01.1N","124-14.4E","조업일지 미기재","통보","2026-05-02 12:08"]
  ];

  let filtered = [...rows];
  let page = 1;
  const pageSize = 10;

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  function getStatusClass(status) {
    if (status === "처리중") return "processing";
    if (status === "회신완료") return "completed";
    return "notified";
  }

  function render() {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.max(1, Math.min(page, totalPages));

    const start = (page - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);

    tbody.innerHTML = visible.map((row, index) => `
      <tr>
        <td>${start + index + 1}</td>
        <td>${escapeHTML(row[0])}</td>
        <td>
          <span class="illegal-vessel-link">
            ${escapeHTML(row[1])}
          </span>
        </td>
        <td>${escapeHTML(row[2])}</td>
        <td>${escapeHTML(row[3])}</td>
        <td>${escapeHTML(row[4])}</td>
        <td>${escapeHTML(row[5])}</td>
        <td>${escapeHTML(row[6])}</td>
        <td>${escapeHTML(row[7])}</td>
        <td>
          <span class="illegal-violation-badge">
            ${escapeHTML(row[8])}
          </span>
        </td>
        <td>
          <span class="illegal-status-badge ${getStatusClass(row[9])}">
            ${escapeHTML(row[9])}
          </span>
        </td>
        <td>${escapeHTML(row[10])}</td>
      </tr>
    `).join("");

    if (!visible.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12">검색 결과가 없습니다.</td>
        </tr>
      `;
    }

    if (filtered.length === rows.length) {
      count.textContent =
        "1~10 / 4,864건 (1/487 페이지) · 단속시각 2009-01-04 ~ 2026-09-16";
    } else {
      count.textContent =
        `${visible.length ? start + 1 : 0}~${start + visible.length} / ${filtered.length}건 (${page}/${totalPages} 페이지)`;
    }

    const items = [
      ["«", 1],
      ["‹", page - 1],
      ...Array.from({ length: totalPages }, (_, i) => [String(i + 1), i + 1]),
      ["›", page + 1],
      ["»", totalPages]
    ];

    pagination.innerHTML = items.map(([label, target]) => `
      <button
        type="button"
        data-illegal-page="${target}"
        class="${label === String(page) ? "active" : ""}"
        ${target < 1 || target > totalPages ? "disabled" : ""}
      >
        ${label}
      </button>
    `).join("");
  }

  pagination.addEventListener("click", event => {
    const button = event.target.closest("[data-illegal-page]");
    if (!button || button.disabled) return;

    page = Number(button.dataset.illegalPage);
    render();
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const vessel = root.querySelector("#illegalVesselName").value.trim().toLowerCase();
    const documentNo = root.querySelector("#illegalDocumentNo").value.trim().toLowerCase();
    const permit = root.querySelector("#illegalPermitNo").value.trim().toLowerCase();
    const mapNo = root.querySelector("#illegalMapNo").value.trim().toLowerCase();
    const industry = root.querySelector("#illegalIndustry").value;
    const violation = root.querySelector("#illegalViolation").value;
    const status = root.querySelector("#illegalStatus").value;
    const startDate = root.querySelector("#illegalStartDate").value;
    const endDate = root.querySelector("#illegalEndDate").value;

    filtered = rows.filter(row => {
      const date = row[10].slice(0, 10);

      return (
        (!vessel || row[1].toLowerCase().includes(vessel)) &&
        (!documentNo || row[0].toLowerCase().includes(documentNo)) &&
        (!permit || row[2].toLowerCase().includes(permit)) &&
        (!mapNo || row[5].toLowerCase().includes(mapNo)) &&
        (!industry || row[3].includes(industry)) &&
        (!violation || row[8] === violation) &&
        (!status || row[9] === status) &&
        (!startDate || date >= startDate) &&
        (!endDate || date <= endDate)
      );
    });

    page = 1;
    render();
  });

  render();
})();



/* ==========================================
   양무허가 페이지
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".permit-request-page");
  if (!page) return;

  const tbody = page.querySelector("#permitRequestTableBody");
  const form = page.querySelector("#permitRequestSearchForm");
  const pagination = page.querySelector("#permitRequestPagination");
  const count = page.querySelector("#permitRequestCount");

  if (!tbody || !form || !pagination || !count) return;

  // 화면 구성용 샘플 데이터
  const rows = [
    [44, "기황항어07755(冀黄港渔07755)", "2척식저인망어업", "석도", "2026-04-22 15:57", "36-18.1N", "124-28.1E"],
    [45, "기황항어05668(冀黄港渔05668)", "2척식저인망어업", "선해하", "2026-04-08 00:10", "34-22.0N", "124-04.0E"],
    [46, "기황항어05669(冀黄港渔05669)", "2척식저인망어업(부속선)", "선해하", "2026-04-08 00:10", "34-22.0N", "124-04.0E"],
    [47, "민복정어09888(闽福鼎渔09888)", "1척식저인망어업", "미설정", "2026-03-17 05:09", "32-11.5N", "126-16.0E"],
    [48, "민복정어08611(闽福鼎渔08611)", "범장망", "미설정", "2026-01-24 19:22", "33-31.0N", "124-10.0E"],
    [49, "절림어15006(浙康渔15006)", "범장망", "미설정", "2026-01-24 19:15", "33-32.0N", "124-11.0E"],
    [50, "민복정어08627(闽福鼎渔08627)", "범장망", "미설정", "2026-01-04 23:35", "33-36.0N", "124-16.0E"],
    [51, "경담어19988(琼儋渔19988)", "범장망", "미설정", "2026-01-04 22:07", "33-37.0N", "124-16.0E"],
    [52, "요영어61147(辽营渔61147)", "2척식저인망어업", "석도", "2025-12-18 13:04", "34-33.0N", "124-27.0E"],
    [53, "요영어61148(辽营渔61148)", "2척식저인망어업(부속선)", "석도", "2025-12-18 13:04", "34-33.0N", "124-27.0E"]
  ].map(item => ({
    no: item[0],
    vessel: item[1],
    fishery: item[2],
    port: item[3],
    capturedAt: item[4],
    lat: item[5],
    lng: item[6],
    permit: "처리중",
    stages: ["-", "-", "-", "-"]
  }));

  let filteredRows = [...rows];
  let currentPage = 1;
  const pageSize = 10;

  function renderTable() {
    const start = (currentPage - 1) * pageSize;
    const visible = filteredRows.slice(start, start + pageSize);

    tbody.innerHTML = visible.map(row => `
      <tr>
        <td>${row.no}</td>
        <td>
          <a href="#" class="permit-request-vessel">
            ${row.vessel}
          </a>
        </td>
        <td>${row.fishery}</td>
        <td>${row.port}</td>
        <td>${row.capturedAt}</td>
        <td>${row.lat}</td>
        <td>${row.lng}</td>
        ${row.stages.map(stage => `
          <td class="permit-request-empty">${stage}</td>
        `).join("")}
        <td>
          <span class="permit-request-status">${row.permit}</span>
        </td>
      </tr>
    `).join("");

    if (!visible.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="padding:35px;text-align:center;">
            검색 결과가 없습니다.
          </td>
        </tr>
      `;
    }

    // 초기 화면은 첨부 이미지의 목록 수를 표시
    if (filteredRows.length === rows.length) {
      count.textContent =
        "1~10 / 1,068건 (1/107 페이지) · 확인요청 미진행 1,025건";
    } else {
      const from = filteredRows.length ? start + 1 : 0;
      const to = Math.min(start + pageSize, filteredRows.length);
      count.textContent =
        `${from}~${to} / ${filteredRows.length}건`;
    }

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredRows.length / pageSize)
    );

    const initial = filteredRows.length === rows.length;
    const displayPages = initial ? 107 : totalPages;

    const buttons = [
      ["≪", 1],
      ["‹", Math.max(1, currentPage - 1)]
    ];

    for (let i = 1; i <= Math.min(10, displayPages); i++) {
      buttons.push([String(i), i]);
    }

    buttons.push(
      ["›", Math.min(displayPages, currentPage + 1)],
      ["≫", displayPages]
    );

    pagination.innerHTML = buttons.map(([label, pageNo]) => `
      <button
        type="button"
        data-page="${pageNo}"
        class="${label === String(currentPage) ? "active" : ""}"
        ${pageNo === currentPage && !/^\d+$/.test(label) ? "disabled" : ""}
      >
        ${label}
      </button>
    `).join("");
  }

  pagination.addEventListener("click", event => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;

    // 샘플 데이터는 첫 페이지 10건만 제공
    const targetPage = Number(button.dataset.page);
    const maxLoadedPage = Math.max(
      1,
      Math.ceil(filteredRows.length / pageSize)
    );

    currentPage = Math.min(targetPage, maxLoadedPage);
    renderTable();
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const vessel = page.querySelector("#permitRequestVessel").value.trim().toLowerCase();
    const fishery = page.querySelector("#permitRequestFishery").value;
    const status = page.querySelector("#permitRequestStatus").value;
    const stage = page.querySelector("#permitRequestStage").value;
    const startDate = page.querySelector("#permitRequestStart").value;
    const endDate = page.querySelector("#permitRequestEnd").value;

    filteredRows = rows.filter(row => {
      if (vessel && !row.vessel.toLowerCase().includes(vessel)) return false;
      if (fishery && !row.fishery.includes(fishery)) return false;
      if (status && row.permit !== status) return false;
      if (stage && row.permit !== stage) return false;

      const date = row.capturedAt.slice(0, 10);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;

      return true;
    });

    currentPage = 1;
    renderTable();
  });

  // 링크는 화면 확인용
  tbody.addEventListener("click", event => {
    if (event.target.closest(".permit-request-vessel")) {
      event.preventDefault();
    }
  });

  renderTable();
});


/* ==========================================
   북측수역이동 페이지
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".north-movement-page");
  if (!page) return;

  const tbody = page.querySelector("#northMovementTableBody");
  const form = page.querySelector("#northMovementSearchForm");
  const pagination = page.querySelector("#northMovementPagination");
  const count = page.querySelector("#northMovementCount");

  if (!tbody || !form || !pagination || !count) return;

  const rows = [
    {
      no: 1,
      document: "2025-002",
      vessel: "민련어7585(闽连渔7585)",
      mmsi: "",
      fishery: "2척식저인망어업",
      port: "미설정",
      guide: "무궁화21호",
      lat: "34-37.2N",
      lng: "129-02.0E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2025-07-02 07:15"
    },
    {
      no: 2,
      document: "2025-001",
      vessel: "민련어7586(MMSI : 412306888)(闽连渔7586)",
      mmsi: "412306888",
      fishery: "2척식저인망어업(부속선)",
      port: "미설정",
      guide: "무궁화21호",
      lat: "34-37.2N",
      lng: "129-02.0E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2025-07-02 07:00"
    },
    {
      no: 3,
      document: "2024-005",
      vessel: "계원어05957(MMSI : 412600981)(桂远渔05957)",
      mmsi: "412600981",
      fishery: "2척식저인망어업",
      port: "남해하",
      guide: "무궁화21호",
      lat: "34-34.4N",
      lng: "128-40.7E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2024-08-31 15:15"
    },
    {
      no: 4,
      document: "2024-006",
      vessel: "계원어05958(桂远渔05958)",
      mmsi: "",
      fishery: "2척식저인망어업(부속선)",
      port: "남해하",
      guide: "무궁화21호",
      lat: "34-34.4N",
      lng: "128-40.7E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2024-08-31 15:15"
    },
    {
      no: 5,
      document: "2024-003",
      vessel: "계원어007(MMSI : 412000000)()",
      mmsi: "412000000",
      fishery: "2척식저인망어업",
      port: "미설정",
      guide: "무궁화22호",
      lat: "34-33.6N",
      lng: "128-49.2E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2024-08-25 10:49"
    },
    {
      no: 6,
      document: "2024-004",
      vessel: "계원어008()",
      mmsi: "",
      fishery: "2척식저인망어업(부속선)",
      port: "미설정",
      guide: "무궁화22호",
      lat: "34-33.6N",
      lng: "128-49.2E",
      situation: "남하 항해",
      area: "99-8",
      status: "통보",
      date: "2024-08-25 10:49"
    },
    {
      no: 7,
      document: "2024-001",
      vessel: "경창어2025(琼昌渔2025)",
      mmsi: "",
      fishery: "2척식저인망어업",
      port: "미설정",
      guide: "무궁화22호",
      lat: "34-29.5N",
      lng: "128-52.7E",
      situation: "남하 항해",
      area: "106-3",
      status: "통보",
      date: "2024-08-23 08:07"
    },
    {
      no: 8,
      document: "2024-002",
      vessel: "경창어2026(琼昌渔2026)",
      mmsi: "",
      fishery: "2척식저인망어업(부속선)",
      port: "미설정",
      guide: "무궁화22호",
      lat: "34-29.5N",
      lng: "128-52.7E",
      situation: "남하 항해",
      area: "106-3",
      status: "통보",
      date: "2024-08-23 08:07"
    },
    {
      no: 9,
      document: "2022-021",
      vessel: "절원령어857(浙远岭渔857)",
      mmsi: "",
      fishery: "2척식저인망어업",
      port: "태주",
      guide: "무궁화39호",
      lat: "35-29.3N",
      lng: "130-19.9E",
      situation: "남하 항해",
      area: "94-2",
      status: "통보",
      date: "2022-08-30 16:45"
    },
    {
      no: 10,
      document: "2022-022",
      vessel: "절원령어858(浙远岭渔858)",
      mmsi: "",
      fishery: "2척식저인망어업(부속선)",
      port: "태주",
      guide: "무궁화39호",
      lat: "35-29.3N",
      lng: "130-19.9E",
      situation: "남하 항해",
      area: "94-2",
      status: "통보",
      date: "2022-08-30 16:45"
    }
  ];

  let filteredRows = [...rows];
  let currentPage = 1;

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  function renderTable() {
    tbody.innerHTML = filteredRows.map(row => `
      <tr>
        <td>${row.no}</td>
        <td>${escapeHTML(row.document)}</td>
        <td>
          <a href="#" class="north-movement-vessel">
            ${escapeHTML(row.vessel)}
          </a>
          ${row.mmsi ? `
            <span class="north-movement-mmsi">
              MMSI ${escapeHTML(row.mmsi)}
            </span>
          ` : ""}
        </td>
        <td>${escapeHTML(row.fishery)}</td>
        <td>${escapeHTML(row.port)}</td>
        <td>${escapeHTML(row.guide)}</td>
        <td>${escapeHTML(row.lat)}</td>
        <td>${escapeHTML(row.lng)}</td>
        <td>${escapeHTML(row.situation)}</td>
        <td>${escapeHTML(row.area)}</td>
        <td>
          <span class="north-movement-status">
            ${escapeHTML(row.status)}
          </span>
        </td>
        <td>${escapeHTML(row.date)}</td>
      </tr>
    `).join("");

    if (!filteredRows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="padding:35px;text-align:center;">
            검색 결과가 없습니다.
          </td>
        </tr>
      `;
    }

    if (filteredRows.length === rows.length) {
      count.textContent =
        "1~10 / 1,428건 (1/143 페이지) · 전체 1,428건 / 1,445척";
    } else {
      count.textContent =
        `1~${filteredRows.length} / ${filteredRows.length}건`;
    }

    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = `
      <button type="button" disabled>≪</button>
      <button type="button" disabled>‹</button>
      ${Array.from({ length: 10 }, (_, index) => `
        <button
          type="button"
          data-page="${index + 1}"
          class="${index + 1 === currentPage ? "active" : ""}">
          ${index + 1}
        </button>
      `).join("")}
      <button type="button" data-page="next">›</button>
      <button type="button" data-page="last">≫</button>
    `;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const vessel = page.querySelector("#northVessel").value.trim().toLowerCase();
    const guide = page.querySelector("#northGuideShip").value.trim().toLowerCase();
    const fishery = page.querySelector("#northFishery").value;
    const documentNo = page.querySelector("#northDocument").value.trim().toLowerCase();
    const situation = page.querySelector("#northStatus").value;
    const startDate = page.querySelector("#northStartDate").value;
    const endDate = page.querySelector("#northEndDate").value;

    filteredRows = rows.filter(row => {
      if (vessel && !row.vessel.toLowerCase().includes(vessel)) return false;
      if (guide && !row.guide.toLowerCase().includes(guide)) return false;
      if (fishery && row.fishery !== fishery) return false;
      if (documentNo && !row.document.toLowerCase().includes(documentNo)) return false;
      if (situation && row.situation !== situation) return false;

      const date = row.date.slice(0, 10);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;

      return true;
    });

    currentPage = 1;
    renderTable();
  });

  // 샘플 데이터는 1페이지 분량만 있으므로
  // 나머지 페이지 이동은 실제 데이터 연결 후 활성화
  pagination.addEventListener("click", event => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;

    const pageNo = Number(button.dataset.page);
    if (pageNo === 1) {
      currentPage = 1;
      renderTable();
    }
  });

  tbody.addEventListener("click", event => {
    if (event.target.closest(".north-movement-vessel")) {
      event.preventDefault();
    }
  });

  renderTable();
});


/* ==========================================
   북한선박 - 선박 현황
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".nk-vessel-page");
  if (!page) return;

  const tbody = page.querySelector("#nkVesselTableBody");
  const pagination = page.querySelector("#nkVesselPagination");
  const count = page.querySelector("#nkVesselCount");
  const pageCount = page.querySelector("#nkVesselPageCount");
  const search = page.querySelector("#nkMapSearch");
  const mapStage = page.querySelector("#nkMapStage");

  const vessels = [
    {
      mmsi: "445816000",
      name: "TOK SONG",
      photo: 1,
      speed: "11.7",
      navigation: "항행중(동력)",
      departure: "미송신",
      arrival: "NAKHODKA",
      position: "35.029, 122.980",
      type: "운항(AIS)선박"
    },
    {
      mmsi: "445781000",
      name: "RAK WON 2",
      photo: 0,
      speed: "0.1",
      navigation: "항행중(범주)",
      departure: "미송신",
      arrival: "DA LIAN",
      position: "38.853, 121.993",
      type: "표류(정지) 선박"
    },
    {
      mmsi: "445499000",
      name: "HONGDAE2",
      photo: 0,
      speed: "3.4",
      navigation: "미정의",
      departure: "미송신",
      arrival: "LONGKOU",
      position: "38.036, 120.682",
      type: "운항(AIS)선박"
    },
    {
      mmsi: "445088000",
      name: "THAE PHYONG 8",
      photo: 0,
      speed: "6.2",
      navigation: "정박",
      departure: "미송신",
      arrival: "NAKHODKA",
      position: "38.833, 121.928",
      type: "운항(AIS)선박 · 입항 선박"
    },
    {
      mmsi: "445791000",
      name: "TOK HUNG",
      photo: 0,
      speed: "11.0",
      navigation: "항행중(동력)",
      departure: "미송신",
      arrival: "DALIANCN",
      position: "35.874, 123.570",
      type: "운항(AIS)선박"
    }
  ];

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  let filtered = [...vessels];
  let selectedMmsi = null;
  let zoom = 1;

  function renderTable() {
    tbody.innerHTML = filtered.map(v => `
      <tr data-mmsi="${v.mmsi}"
          class="${selectedMmsi === v.mmsi ? "is-selected" : ""}">
        <td>${escapeHTML(v.mmsi)}</td>
        <td>
          <button type="button" class="nk-vessel-link">
            ${escapeHTML(v.name)}
          </button>
        </td>
        <td>${v.photo ? '<span class="nk-photo-badge">▣ 1</span>' : "—"}</td>
        <td>${escapeHTML(v.speed)}</td>
        <td>${escapeHTML(v.navigation)}</td>
        <td>${escapeHTML(v.departure)}</td>
        <td>${escapeHTML(v.arrival)}</td>
        <td>${escapeHTML(v.position)}</td>
        <td><span class="nk-vessel-type">${escapeHTML(v.type)}</span></td>
      </tr>
    `).join("");

    if (!filtered.length) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center;padding:24px;">검색 결과가 없습니다.</td></tr>';
    }

    count.textContent = filtered.length === vessels.length
      ? "전체 101건 중 1-5"
      : `검색 결과 ${filtered.length}건`;

    pageCount.textContent = filtered.length === vessels.length
      ? "1 / 21 페이지"
      : "1 / 1 페이지";

    pagination.innerHTML = `
      <button type="button" disabled>≪</button>
      <button type="button" disabled>‹</button>
      <button type="button" class="active">1</button>
      ${filtered.length === vessels.length
        ? [2, 3, 4, 5].map(n =>
            `<button type="button" disabled title="실제 데이터 연결 후 사용">${n}</button>`
          ).join("")
        : ""}
      <button type="button" disabled>›</button>
      <button type="button" disabled>≫</button>
    `;

    syncMarkers();
  }

  function syncMarkers() {
    page.querySelectorAll(".nk-map-marker").forEach(marker => {
      const visible = filtered.some(v => v.mmsi === marker.dataset.mmsi);
      marker.hidden = !visible;
      marker.style.display = visible ? "" : "none";
      marker.classList.toggle(
        "is-selected",
        marker.dataset.mmsi === selectedMmsi
      );
    });
  }

  function selectVessel(mmsi) {
    selectedMmsi = mmsi;
    renderTable();
  }

  search.addEventListener("input", () => {
    const keyword = search.value.trim().toLowerCase();

    filtered = vessels.filter(v =>
      [v.mmsi, v.name, v.arrival, v.type]
        .some(value => value.toLowerCase().includes(keyword))
    );

    renderTable();
  });

  tbody.addEventListener("click", event => {
    const row = event.target.closest("tr[data-mmsi]");
    if (row) selectVessel(row.dataset.mmsi);
  });

  page.querySelector("#nkMapMarkers").addEventListener("click", event => {
    const marker = event.target.closest(".nk-map-marker");
    if (marker) selectVessel(marker.dataset.mmsi);
  });

  page.querySelector("#nkZoomIn").addEventListener("click", () => {
    zoom = Math.min(2.5, zoom + 0.2);
    mapStage.style.transform = `scale(${zoom})`;
  });

  page.querySelector("#nkZoomOut").addEventListener("click", () => {
    zoom = Math.max(1, zoom - 0.2);
    mapStage.style.transform = `scale(${zoom})`;
  });

  page.querySelector("#nkToggleMap").addEventListener("click", event => {
    page.classList.toggle("map-collapsed");
    const collapsed = page.classList.contains("map-collapsed");
    event.currentTarget.innerHTML = collapsed
      ? '<i data-lucide="map"></i> 지도 펼치기'
      : '<i data-lucide="map"></i> 지도 접기';
    if (window.lucide) lucide.createIcons();
  });

  page.querySelector("#nkNewsToggle").addEventListener("click", event => {
    page.classList.toggle("news-collapsed");
    event.currentTarget.textContent =
      page.classList.contains("news-collapsed") ? "펼치기" : "접기";
  });

  // 정적 화면: 새로고침은 샘플 데이터 및 선택 상태 초기화
  page.querySelector("#nkRefresh").addEventListener("click", () => {
    search.value = "";
    filtered = [...vessels];
    selectedMmsi = null;
    renderTable();
  });

  page.querySelector("#nkNewsRefresh").addEventListener("click", () => {
    page.querySelector("#nkNewsList").scrollTop = 0;
  });

  page.querySelectorAll("#nkTypeFilters .nk-filter-chip")
    .forEach(button => {
      button.addEventListener("click", () => {
        page.querySelectorAll("#nkTypeFilters .nk-filter-chip")
          .forEach(item => item.classList.remove("is-active"));

        button.classList.add("is-active");

        const type = button.dataset.type;

        const typeMap = {
          all: null,
          north: "북한해역선박",
          mca: "MCA진입선박",
          fishing: "입항 선박",
          ais: "AIS미수신선박",
          stopped: "표류(정지) 선박"
        };

        filtered = type === "all"
          ? [...vessels]
          : vessels.filter(v => v.type.includes(typeMap[type]));

        renderTable();
      });
    });

  renderTable();
});



/* =====================================================
   AI국내어선위험분석 - 통합상황판
   공용 fishing-common.js
===================================================== */

(function () {
  "use strict";

  function initDomesticRiskDashboard() {
    const page = document.querySelector(".dr-page");
    if (!page || page.dataset.drInitialized === "true") return;

    page.dataset.drInitialized = "true";

    /* ---------------------------------------
       1. 선박 검색
    --------------------------------------- */

    const searchInput = page.querySelector("#drVesselSearch");
    const riskItems = Array.from(
      page.querySelectorAll(".dr-risk-item")
    );

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const keyword = this.value.trim().toLowerCase();

        riskItems.forEach(function (item) {
          const vesselName = (
            item.dataset.name || ""
          ).toLowerCase();

          item.hidden = !vesselName.includes(keyword);
        });
      });
    }

    /* ---------------------------------------
       2. 위험 어선 선택
    --------------------------------------- */

    const selectedName = page.querySelector("#drSelectedName");
    const selectedScore = page.querySelector("#drSelectedScore");
    const selectedLevel = page.querySelector("#drSelectedLevel");
    const selectedDistance = page.querySelector("#drSelectedDistance");

    riskItems.forEach(function (item) {
      item.addEventListener("click", function () {
        riskItems.forEach(function (riskItem) {
          riskItem.classList.remove("is-selected");
        });

        item.classList.add("is-selected");

        const name = item.dataset.name || "-";
        const score = item.dataset.score || "0";
        const level = item.dataset.level || "위험";
        const distance = item.dataset.distance || "-";

        if (selectedName) {
          selectedName.textContent = name;
        }

        if (selectedScore) {
          selectedScore.textContent = score;
        }

        if (selectedLevel) {
          selectedLevel.textContent = level;

          selectedLevel.className =
            "dr-tag " +
            (level === "긴급"
              ? "dr-tag-red"
              : "dr-tag-orange");
        }

        if (selectedDistance) {
          selectedDistance.textContent =
            "지도상 기준 위치에서 " + distance;
        }
      });
    });

    /* ---------------------------------------
       3. 지도 확대 / 축소
    --------------------------------------- */

    const mapImage = page.querySelector("#drMapImage");
    const zoomIn = page.querySelector("#drZoomIn");
    const zoomOut = page.querySelector("#drZoomOut");

    let mapScale = 1;

    function updateMapZoom() {
      if (!mapImage) return;

      mapImage.style.transform =
        "scale(" + mapScale.toFixed(2) + ")";
    }

    if (zoomIn) {
      zoomIn.addEventListener("click", function () {
        mapScale = Math.min(3, mapScale + 0.2);
        updateMapZoom();
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener("click", function () {
        mapScale = Math.max(1, mapScale - 0.2);
        updateMapZoom();
      });
    }

    /* ---------------------------------------
       4. 위험도 추이 차트
       Chart.js가 있을 때만 실행
    --------------------------------------- */

    const chartCanvas = page.querySelector("#drRiskChart");

    if (chartCanvas && typeof Chart !== "undefined") {
      const labels = [
        "12:00", "14:00", "16:00", "18:00",
        "20:00", "22:00", "00:00", "02:00",
        "04:00", "06:00", "08:00", "10:00", "12:00"
      ];

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "긴급",
            data: [2, 2, 2, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1],
            borderColor: "#ef4444",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35
          },
          {
            label: "위험",
            data: [100, 110, 130, 170, 200, 185, 115, 70, 45, 40, 55, 70, 87],
            borderColor: "#f97316",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35
          },
          {
            label: "주의",
            data: [70, 95, 55, 110, 70, 45, 30, 20, 28, 35, 25, 40, 42],
            borderColor: "#eab308",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35
          },
          {
            label: "통신미응답",
            data: [90, 115, 140, 160, 150, 120, 70, 40, 25, 45, 65, 75, 85],
            borderColor: "#16a34a",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35
          },
          {
            label: "정상",
            data: [190, 205, 195, 175, 130, 100, 60, 35, 30, 45, 70, 95, 105],
            borderColor: "#22c55e",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35
          }
        ]
      };

      new Chart(chartCanvas, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: "#7184a3",
                font: {
                  size: 9
                },
                maxRotation: 0,
                autoSkip: true
              }
            },
            y: {
              beginAtZero: true,
              suggestedMax: 250,
              grid: {
                color: "#dce5f1"
              },
              ticks: {
                color: "#7184a3",
                font: {
                  size: 9
                }
              }
            }
          }
        }
      });
    }

    /* 탭 메뉴 클릭 이벤트는 의도적으로 추가하지 않음 */
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initDomesticRiskDashboard
    );
  } else {
    initDomesticRiskDashboard();
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const mapImage = document.getElementById('passengerMapImage');
  const zoomIn = document.getElementById('passengerZoomIn');
  const zoomOut = document.getElementById('passengerZoomOut');
  const refresh = document.getElementById('passengerRefresh');

  let zoom = 1;

  function updateZoom() {
    if (!mapImage) return;
    mapImage.style.transform = `scale(${zoom})`;
  }

  zoomIn?.addEventListener('click', () => {
    zoom = Math.min(zoom + 0.2, 3);
    updateZoom();
  });

  zoomOut?.addEventListener('click', () => {
    zoom = Math.max(zoom - 0.2, 1);
    updateZoom();
  });

  document.querySelectorAll('.passenger-map-type button')
    .forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.passenger-map-type button')
          .forEach(item => item.classList.remove('active'));

        button.classList.add('active');
      });
    });

  refresh?.addEventListener('click', () => {
    zoom = 1;
    updateZoom();
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const cameras = [
    ["충남 서산 대산항", "충남 서산시 대산읍", "서해"],
    ["목포항 해무관측", "전남 목포시 항동", "서해"],
    ["여수항 해무관측", "전남 여수시 중동", "남해"],
    ["부산항 조위관측소", "부산광역시 중구 중앙동", "남해"],
    ["울산항 해무관측", "울산광역시 남구", "동해"],
    ["묵호항 조위관측소", "강원 동해시 묵호동", "동해"],
    ["오륙도항 조위관측소", "제주 서귀포시 대정읍", "제주"],
    ["독도", "경북 울릉군 울릉읍 독도리", "동해"],
    ["연평도", "인천 옹진군 연평면", "서해"],
    ["인천 연안부두", "인천광역시 중구 연안부두", "서해"],
    ["태안 신진항", "충남 태안군 근흥면", "서해"],
    ["군산 비응항", "전북 군산시 비응도동", "서해"],
    ["목포 북항", "전남 목포시 북항동", "서해"],
    ["신안 가거도", "전남 신안군 흑산면", "서해"],
    ["완도항", "전남 완도군 완도읍", "남해"],
    ["여수 거문도", "전남 여수시 삼산면", "남해"],
    ["여수 오동도 앞", "전남 여수시 수정동", "남해"],
    ["통영항", "경남 통영시", "남해"],
    ["거제 장승포항", "경남 거제시", "남해"],
    ["부산 해운대", "부산광역시 해운대구", "남해"],
    ["울산 방어진항", "울산광역시 동구", "동해"],
    ["포항 영일대", "경북 포항시", "동해"],
    ["속초항", "강원 속초시", "동해"],
    ["강릉 주문진항", "강원 강릉시", "동해"],
    ["제주항", "제주특별자치도 제주시", "제주"],
    ["서귀포항", "제주특별자치도 서귀포시", "제주"]
  ];

  const list = document.getElementById("cctvCameraList");
  const search = document.getElementById("cctvSearch");
  const count = document.getElementById("cctvCount");
  const regionButtons = document.querySelectorAll(
    ".cctv-region-tabs button"
  );

  if (!list) return;

  let currentRegion = "전체";

  function renderCameras() {
    const keyword = (search?.value || "").trim().toLowerCase();

    const filtered = cameras.filter(([name, address, region]) => {
      const matchesRegion =
        currentRegion === "전체" || region === currentRegion;

      const matchesKeyword =
        `${name} ${address}`.toLowerCase().includes(keyword);

      return matchesRegion && matchesKeyword;
    });

    count.textContent = `${filtered.length}개`;

    list.innerHTML = filtered.map(([name, address], index) => `
      <button type="button"
        class="cctv-camera-item"
        data-camera-index="${index}">
        <span class="cctv-camera-icon">
          <i data-lucide="video"></i>
        </span>
        <span class="cctv-camera-text">
          <strong>${name}</strong>
          <small>${address}</small>
        </span>
        <span class="cctv-live-badge">LIVE</span>
      </button>
    `).join("");

    list.querySelectorAll(".cctv-camera-item").forEach((button, index) => {
      button.addEventListener("click", () => {
        list.querySelectorAll(".cctv-camera-item").forEach(item => {
          item.classList.remove("selected");
        });

        button.classList.add("selected");

        const camera = filtered[index];

        document.getElementById("cctvMapTitle").textContent =
          camera[0];

        document.getElementById("cctvCameraInfo").textContent =
          `${camera[0]} · ${camera[1]}`;

        document.getElementById("cctvSelected").textContent =
          camera[0];

        document.getElementById("cctvMapNotice").textContent =
          `${camera[0]} 카메라 선택됨`;
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  regionButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentRegion = button.dataset.region;

      regionButtons.forEach(item => {
        item.classList.toggle("active", item === button);
      });

      renderCameras();
    });
  });

  search?.addEventListener("input", renderCameras);

  renderCameras();
});



document.addEventListener("DOMContentLoaded", () => {
  const map = document.querySelector(".drone-map-image");
  const zoomIn = document.getElementById("droneZoomIn");
  const zoomOut = document.getElementById("droneZoomOut");

  if (!map || !zoomIn || !zoomOut) return;

  let scale = 1;

  const updateZoom = () => {
    map.style.transform = `scale(${scale})`;
    map.style.transformOrigin = "center center";
  };

  zoomIn.addEventListener("click", () => {
    scale = Math.min(2, scale + 0.1);
    updateZoom();
  });

  zoomOut.addEventListener("click", () => {
    scale = Math.max(1, scale - 0.1);
    updateZoom();
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".rescue-page");
  if (!page) return;

  // 계절 탭
  const seasonButtons = page.querySelectorAll(".rescue-season-tabs button");
  const seasonLabel = document.getElementById("rescueSeasonLabel");

  seasonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      seasonButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const labels = {
        all: "전체",
        spring: "봄(3~5월)",
        summer: "여름(6~8월)",
        autumn: "가을(9~11월)",
        winter: "겨울(12~2월)"
      };

      seasonLabel.textContent = labels[button.dataset.season] || "전체";
    });
  });

  // 지도 확대/축소
  const mapImage = document.getElementById("rescueMapImage");
  const zoomIn = document.getElementById("rescueZoomIn");
  const zoomOut = document.getElementById("rescueZoomOut");

  let zoom = 1;

  function updateZoom() {
    if (mapImage) {
      mapImage.style.transform = `scale(${zoom})`;
    }
  }

  zoomIn?.addEventListener("click", () => {
    zoom = Math.min(zoom + 0.2, 2.5);
    updateZoom();
  });

  zoomOut?.addEventListener("click", () => {
    zoom = Math.max(zoom - 0.2, 1);
    updateZoom();
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const mapImage = document.getElementById("smallboatMapImage");
  const zoomIn = document.getElementById("smallboatZoomIn");
  const zoomOut = document.getElementById("smallboatZoomOut");

  if (!mapImage) return;

  let zoom = 1;

  const updateZoom = () => {
    mapImage.style.transform = `scale(${zoom})`;
  };

  zoomIn?.addEventListener("click", () => {
    zoom = Math.min(zoom + 0.2, 2.5);
    updateZoom();
  });

  zoomOut?.addEventListener("click", () => {
    zoom = Math.max(zoom - 0.2, 1);
    updateZoom();
  });
});


/* ==========================================
   3D분석 - 도면 뷰어
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("ship3dCanvas");
  const imageWrap = document.getElementById("ship3dImageWrap");
  const zoomValue = document.getElementById("ship3dZoomValue");

  const zoomIn = document.getElementById("ship3dZoomIn");
  const zoomOut = document.getElementById("ship3dZoomOut");
  const reset = document.getElementById("ship3dReset");

  if (!canvas || !imageWrap) return;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  let dragging = false;
  let startX = 0;
  let startY = 0;

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;
  const STEP = 0.2;

  function render() {
    imageWrap.style.transform =
      `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    if (zoomValue) {
      zoomValue.textContent = `${Math.round(scale * 100)}%`;
    }
  }

  function changeZoom(nextScale) {
    scale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, nextScale)
    );

    render();
  }

  zoomIn?.addEventListener("click", () => {
    changeZoom(scale + STEP);
  });

  zoomOut?.addEventListener("click", () => {
    changeZoom(scale - STEP);
  });

  reset?.addEventListener("click", () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    render();
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      changeZoom(
        scale + (event.deltaY < 0 ? STEP : -STEP)
      );
    },
    { passive: false }
  );

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    dragging = true;

    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;

    canvas.classList.add("is-dragging");
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    render();
  });

  function stopDragging() {
    dragging = false;
    canvas.classList.remove("is-dragging");
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("lostpointercapture", stopDragging);

  render();
});


/* ==========================================
   영상사진 게시판
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".media-board-page");
  if (!page) return;

  const uploadButton = document.getElementById("mediaUploadButton");
  const fileInput = document.getElementById("mediaFileInput");
  const deviceFilter = document.getElementById("mediaDeviceFilter");
  const typeFilter = document.getElementById("mediaTypeFilter");
  const searchInput = document.getElementById("mediaSearchInput");
  const tableBody = document.getElementById("mediaBoardTableBody");

  const totalCount = document.getElementById("mediaTotalCount");
  const droneCount = document.getElementById("mediaDroneCount");
  const aircraftCount = document.getElementById("mediaAircraftCount");
  const satelliteCount = document.getElementById("mediaSatelliteCount");

  const files = [];
  let nextId = 1;
  let sortKey = "no";
  let sortDirection = "desc";

  const deviceLabels = {
    drone: "드론",
    aircraft: "항공기",
    satellite: "위성"
  };

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function updateCounts() {
    totalCount.textContent = files.length;
    droneCount.textContent = files.filter(f => f.device === "drone").length;
    aircraftCount.textContent = files.filter(f => f.device === "aircraft").length;
    satelliteCount.textContent = files.filter(f => f.device === "satellite").length;
  }

  function renderTable() {
    const device = deviceFilter.value;
    const type = typeFilter.value;
    const query = searchInput.value.trim().toLowerCase();

    const filtered = files.filter(file => {
      return (device === "all" || file.device === device) &&
        (type === "all" || file.type === type) &&
        file.name.toLowerCase().includes(query);
    });

    filtered.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      let comparison;
      if (typeof av === "number" && typeof bv === "number") {
        comparison = av - bv;
      } else {
        comparison = String(av).localeCompare(String(bv), "ko");
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    tableBody.replaceChildren();

    if (!filtered.length) {
      const row = document.createElement("tr");
      row.className = "media-board-empty";
      const cell = document.createElement("td");
      cell.colSpan = 8;
      cell.textContent = "데이터가 없습니다.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    filtered.forEach(file => {
      const row = document.createElement("tr");
      const values = [
        file.no,
        file.name,
        deviceLabels[file.device],
        file.type === "image" ? "이미지" : "영상",
        file.dateLabel,
        formatSize(file.size),
        file.resolution
      ];

      values.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (index === 1) {
          cell.className = "media-board-file-name";
          cell.title = value;
        }
        row.appendChild(cell);
      });

      const downloadCell = document.createElement("td");
      const link = document.createElement("a");
      link.className = "media-board-download";
      link.href = file.url;
      link.download = file.name;
      link.textContent = "다운로드";
      downloadCell.appendChild(link);
      row.appendChild(downloadCell);

      tableBody.appendChild(row);
    });
  }

  uploadButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const selectedFiles = Array.from(fileInput.files || []);

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) continue;

      const url = URL.createObjectURL(file);
      let resolution = "-";

      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        resolution = `${image.naturalWidth} × ${image.naturalHeight}`;
      } catch (error) {
        console.warn("이미지 해상도 확인 실패:", file.name);
      }

      const now = new Date();

      files.push({
        no: nextId++,
        name: file.name,
        device: "drone",
        type: "image",
        date: now.getTime(),
        dateLabel: formatDate(now),
        size: file.size,
        resolution,
        url
      });
    }

    fileInput.value = "";
    updateCounts();
    renderTable();
  });

  [deviceFilter, typeFilter].forEach(element => {
    element.addEventListener("change", renderTable);
  });

  searchInput.addEventListener("input", renderTable);

  document.querySelectorAll(".media-board-table [data-sort]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;

      if (sortKey === key) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDirection = "asc";
      }

      renderTable();
    });
  });

  updateCounts();
  renderTable();
});


/* ==========================================
   공지사항
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".notice-page");
  if (!page) return;

  const searchInput = document.getElementById("noticeSearchInput");
  const tableBody = document.getElementById("noticeTableBody");
  const excelButton = document.getElementById("noticeExcelBtn");
  const printButton = document.getElementById("noticePrintBtn");

  const rows = Array.from(tableBody.querySelectorAll("tr")).map(row => {
    const cells = row.querySelectorAll("td");

    return {
      element: row,
      title: cells[0].innerText.trim(),
      author: cells[1].textContent.trim(),
      date: cells[2].textContent.trim(),
      views: Number(cells[3].textContent.trim()),
      pinned: row.classList.contains("notice-pinned")
    };
  });

  let sortKey = "date";
  let sortDirection = "desc";

  function getVisibleRows() {
    const keyword = searchInput.value.trim().toLowerCase();

    return rows.filter(item => {
      return item.title.toLowerCase().includes(keyword) ||
             item.author.toLowerCase().includes(keyword);
    });
  }

  function renderTable() {
    const filtered = getVisibleRows();

    filtered.sort((a, b) => {
      // 고정 공지는 항상 상단
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      let result;

      if (sortKey === "views") {
        result = a.views - b.views;
      } else {
        result = String(a[sortKey]).localeCompare(
          String(b[sortKey]),
          "ko"
        );
      }

      return sortDirection === "asc" ? result : -result;
    });

    tableBody.replaceChildren();

    if (!filtered.length) {
      const tr = document.createElement("tr");
      tr.className = "notice-empty";

      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "검색 결과가 없습니다.";

      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    filtered.forEach(item => {
      tableBody.appendChild(item.element);
    });
  }

  // 검색
  searchInput.addEventListener("input", renderTable);

  // 정렬
  page.querySelectorAll(".notice-sort").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;

      if (sortKey === key) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDirection = key === "date" ? "desc" : "asc";
      }

      renderTable();
    });
  });

  // CSV 내보내기 (엑셀에서 열기 가능)
  excelButton.addEventListener("click", () => {
    const visible = getVisibleRows();

    const escapeCSV = value =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvRows = [
      ["제목", "작성자", "작성일", "조회"],
      ...visible.map(item => [
        item.title,
        item.author,
        item.date,
        item.views
      ])
    ];

    const csv = "\uFEFF" + csvRows
      .map(row => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "공지사항.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  });

  // 인쇄
  printButton.addEventListener("click", () => {
    window.print();
  });

  renderTable();
});


document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board-page");
  if (!board) return;

  const tbody = document.getElementById("boardTableBody");
  const searchInput = document.getElementById("boardSearchInput");

  const rows = Array.from(tbody.querySelectorAll("tr")).map(row => ({
    element: row,
    values: Array.from(row.cells).map(cell => cell.textContent.trim())
  }));

  let sortKey = null;
  let sortDirection = 1;

  function renderRows() {
    const keyword = searchInput.value.trim().toLocaleLowerCase("ko");

    let filtered = rows.filter(item =>
      [item.values[0], item.values[1]]
        .some(value => value.toLocaleLowerCase("ko").includes(keyword))
    );

    if (sortKey !== null) {
      filtered.sort((a, b) => {
        const av = a.values[sortKey];
        const bv = b.values[sortKey];

        if (sortKey >= 3) {
          return (Number(av) - Number(bv)) * sortDirection;
        }

        return av.localeCompare(bv, "ko", { numeric: true }) * sortDirection;
      });
    }

    tbody.replaceChildren();

    if (!filtered.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "검색 결과가 없습니다.";
      td.style.textAlign = "center";
      td.style.padding = "24px";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach(item => tbody.appendChild(item.element));
  }

  searchInput.addEventListener("input", renderRows);

  const keys = {
    title: 0,
    author: 1,
    date: 2,
    comments: 3,
    views: 4
  };

  board.querySelectorAll(".notice-sort").forEach(button => {
    button.addEventListener("click", () => {
      const nextKey = keys[button.dataset.sort];

      sortDirection =
        sortKey === nextKey ? sortDirection * -1 : 1;

      sortKey = nextKey;
      renderRows();
    });
  });

  document.getElementById("boardExcelBtn")
    ?.addEventListener("click", () => {
      const data = [
        ["제목", "작성자", "작성일", "댓글", "조회"],
        ...Array.from(tbody.rows)
          .filter(row => row.cells.length === 5)
          .map(row => Array.from(row.cells, cell => cell.textContent.trim()))
      ];

      const csv = "\uFEFF" + data.map(row =>
        row.map(value =>
          '"' + value.replace(/"/g, '""') + '"'
        ).join(",")
      ).join("\r\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "게시판_목록.csv";
      link.click();

      URL.revokeObjectURL(url);
    });

  document.getElementById("boardPrintBtn")
    ?.addEventListener("click", () => window.print());

  // 실제 작성 화면이 연결되지 않은 상태에서는
  // 글쓰기 버튼을 별도 페이지로 이동시키지 않습니다.
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".resource-page");
  if (!page) return;

  const tbody = document.getElementById("resourceTableBody");
  const searchInput = document.getElementById("resourceSearchInput");

  const rows = Array.from(tbody.querySelectorAll("tr")).map(row => ({
    element: row,
    values: Array.from(row.cells, cell => cell.textContent.trim())
  }));

  const sortKeys = {
    name: 0,
    category: 1,
    format: 2,
    size: 3,
    date: 4
  };

  let currentSort = null;
  let sortDirection = 1;

  function getVisibleRows() {
    const keyword = searchInput.value.trim().toLocaleLowerCase("ko");

    const filtered = rows.filter(item =>
      item.values.some(value =>
        value.toLocaleLowerCase("ko").includes(keyword)
      )
    );

    if (currentSort !== null) {
      filtered.sort((a, b) => {
        const av = a.values[currentSort];
        const bv = b.values[currentSort];

        if (currentSort === 3) {
          return (parseFloat(av) - parseFloat(bv)) * sortDirection;
        }

        return av.localeCompare(bv, "ko", { numeric: true }) * sortDirection;
      });
    }

    return filtered;
  }

  function renderRows() {
    const filtered = getVisibleRows();
    tbody.replaceChildren();

    if (!filtered.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");

      td.colSpan = 5;
      td.textContent = "검색 결과가 없습니다.";
      td.style.textAlign = "center";
      td.style.padding = "24px";

      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach(item => tbody.appendChild(item.element));
  }

  searchInput.addEventListener("input", renderRows);

  page.querySelectorAll(".notice-sort").forEach(button => {
    button.addEventListener("click", () => {
      const nextSort = sortKeys[button.dataset.sort];

      sortDirection =
        currentSort === nextSort ? sortDirection * -1 : 1;

      currentSort = nextSort;
      renderRows();
    });
  });

  // 엑셀에서 열 수 있는 CSV 내보내기
  document.getElementById("resourceExcelBtn")
    ?.addEventListener("click", () => {
      const data = [
        ["자료명", "분류", "형식", "크기", "등록일"],
        ...getVisibleRows().map(item => item.values)
      ];

      const csv = "\uFEFF" + data.map(row =>
        row.map(value =>
          '"' + value.replace(/"/g, '""') + '"'
        ).join(",")
      ).join("\r\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "자료실_목록.csv";
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  // 출력
  document.getElementById("resourcePrintBtn")
    ?.addEventListener("click", () => window.print());
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".qna-page");
  if (!page) return;

  const tbody = document.getElementById("qnaTableBody");
  const searchInput = document.getElementById("qnaSearchInput");

  const rows = Array.from(tbody.querySelectorAll("tr")).map(row => ({
    element: row,
    values: Array.from(row.cells, cell => cell.textContent.trim())
  }));

  const sortKeys = {
    title: 0,
    author: 1,
    date: 2,
    status: 3
  };

  let currentSort = null;
  let sortDirection = 1;

  function getVisibleRows() {
    const keyword = searchInput.value.trim().toLocaleLowerCase("ko");

    const filtered = rows.filter(item =>
      item.values.slice(0, 2).some(value =>
        value.toLocaleLowerCase("ko").includes(keyword)
      )
    );

    if (currentSort !== null) {
      filtered.sort((a, b) =>
        a.values[currentSort].localeCompare(
          b.values[currentSort],
          "ko",
          { numeric: true }
        ) * sortDirection
      );
    }

    return filtered;
  }

  function renderRows() {
    const filtered = getVisibleRows();
    tbody.replaceChildren();

    if (!filtered.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");

      td.colSpan = 4;
      td.textContent = "검색 결과가 없습니다.";
      td.style.textAlign = "center";
      td.style.padding = "24px";

      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach(item => tbody.appendChild(item.element));
  }

  searchInput.addEventListener("input", renderRows);

  // 컬럼 정렬
  page.querySelectorAll(".notice-sort").forEach(button => {
    button.addEventListener("click", () => {
      const nextSort = sortKeys[button.dataset.sort];

      sortDirection =
        currentSort === nextSort ? sortDirection * -1 : 1;

      currentSort = nextSort;
      renderRows();
    });
  });

  // CSV 내보내기
  document.getElementById("qnaExcelBtn")
    ?.addEventListener("click", () => {
      const data = [
        ["제목", "작성자", "작성일", "상태"],
        ...getVisibleRows().map(item => item.values)
      ];

      const csv = "\uFEFF" + data.map(row =>
        row.map(value =>
          '"' + value.replace(/"/g, '""') + '"'
        ).join(",")
      ).join("\r\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "QnA_목록.csv";
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  // 출력
  document.getElementById("qnaPrintBtn")
    ?.addEventListener("click", () => window.print());
});

document.addEventListener('DOMContentLoaded', () => {
  // 퍼블리싱용 정적 데이터. 클릭 기능 없음.
  const process = [
    ['01','원천 수집','AIS·CCTV·위성','완료','blue'],
    ['02','데이터 등록','선박·관측','완료','blue'],
    ['03','메타 자동 생성','출처·시각·위치','완료','blue'],
    ['04','정제·비식별화','중복·좌표·민감','완료','blue'],
    ['05','작업 배정','작업자·규칙','완료','purple'],
    ['06','라벨링','bbox·polygon·event','진행 중','purple'],
    ['07','1차 검수','자동 교차','진행 중','orange'],
    ['08','전문가 검수','해경 심사','대기','orange'],
    ['09','품질 점수','최종 산정','대기','orange'],
    ['10','데이터셋 버전','train/valid/test','대기','green'],
    ['11','LG DAP 학습','DAT·MLDL 재학습','대기','green'],
    ['12','운영 피드백','오탐·미탐','대기','pink'],
    ['13','재라벨링','루프 복귀','대기','pink']
  ];

const adProcessGrid = document.getElementById('adProcessGrid');

if (adProcessGrid) {
  adProcessGrid.innerHTML = process.map(([num, title, desc, status, color]) => `
    <div class="ad-process-card ${color} ${status === '진행 중' ? 'is-current' : ''}">
      <span class="ad-process-num">${num}</span>
      <strong>${title}</strong>
      <small>${desc}</small>
      <span class="ad-process-status">${status === '완료' ? '✓' : '●'} ${status}</span>
    </div>
  `).join('');
}

  const events = [
    ['DARK_VESSEL','850,715'],
    ['GEAR_ILLEGAL','242,223'],
    ['HIGH_RISK_VESSEL','161,771'],
    ['MMSI_TAMPERING','117,585'],
    ['EEZ_INTRUSION','61,986'],
    ['FLEET_CLUSTER','10,138'],
    ['ZONE_DEPARTURE','5,481'],
    ['GEAR_IDENTITY_COLLISION','702'],
    ['ILLEGAL_TRANSSHIP','634']
  ];
  const adEventRows = document.getElementById('adEventRows');

if (adEventRows) {
  adEventRows.innerHTML = events.map(([name, count]) =>
    `<tr><td>${name}</td><td class="ad-right">${count}</td></tr>`
  ).join('');
}

  const models = [
    ['다크베셀 탐지 v3','SNPDB 24h 2026-09-30 · 11,243,571점 / 37,836척','Recall / P@Top-100','0.911 / 0.910','배포'],
    ['어구 위반 분류','GroupKFold k=5 · 5,595','Macro-F1','0.994','배포'],
    ['어업형태 분류','허가 업종 대비 · 평가셋 645척','정확도','0.828','검수'],
    ['중국어선 국적분류','5-fold OOF · 어선 10,375척 · 항적','Recall / F1','0.969 / 0.916','배포'],
    ['환적(STS) 의심','한중어업 일반선 교차검증 · 지속 의심 4,358건','재현율 / 정밀도','0.929 / 0.350','검수'],
    ['AIS 정합성 검토','5분 표 4월 · 83,105척','확정 이상','3,189척 (3.84%)','검수'],
    ['모선 추론','GFW 어구 교차원천 표본','지인망 일치','90.2%','검수']
  ];
  const adModelRows = document.getElementById('adModelRows');

if (adModelRows) {
  adModelRows.innerHTML = models.map(r =>
    `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td class="ad-center"><span class="ad-badge green">${r[3]}</span></td><td class="ad-center"><span class="ad-badge ${r[4] === '배포' ? 'green' : 'blue'}">${r[4]}</span></td></tr>`
  ).join('');
}

  const datasets = [
    ['DS-2026-006','다크베셀 탐지 v3 (24h 선박 단위 · 규칙 참조 라벨)','SIG','37,836','88점','배포','2026-10-04'],
    ['DS-2026-004','어업형태 분류 (허가 업종 대비 · 평가셋 645척)','TRK','645','95점','배포','2026-10-04'],
    ['DS-2026-003','중국어선 국적분류 (항적, MMSI 미사용 · 어선 10,375척)','TRK','10,375','96점','배포','2026-10-04'],
    ['DS-2026-002','한중어업 허가어선 (2026 · 1,077척 · 업종·톤수)','ENF','1,077','96점','배포','2026-10-04'],
    ['DS-2026-007','환적(STS) 지속 의심 후보 (규칙 · 4,358건)','TRK','4,358','87점','검수','2026-10-04'],
    ['DS-2026-001','AIS 정합성 검토셋 (MMSI 중복·위치점프 · 83,105척)','SIG','83,105','93점','검수','2026-10-04'],
    ['DS-2026-009','위성 SAR 다크베셀 표적 (Sentinel-1 · AI2 선정추정)','SAT','2,172','90점','배포','2026-09-10'],
    ['DS-2026-008','SAR 선박인식 학습셋 (AIS 조인 · 선장/선종 검증)','SAT','5,625','84점','검수','2026-08-28']
  ];
  const catColor = {SIG:'blue',TRK:'cyan',ENF:'yellow',SAT:'purple'};
  const adDatasetRows = document.getElementById('adDatasetRows');

    if (adDatasetRows) {
      adDatasetRows.innerHTML = datasets.map(r =>
    `<tr><td class="ad-link">${r[0]}</td><td><strong>${r[1]}</strong></td><td><span class="ad-badge ${catColor[r[2]]}">${r[2]}</span></td><td class="ad-right">${r[3]}</td><td class="ad-center"><span class="ad-badge ${Number.parseInt(r[4]) >= 93 ? 'green' : 'blue'}">${r[4]}</span></td><td class="ad-center"><span class="ad-badge ${r[5] === '배포' ? 'green' : 'blue'}">${r[5]}</span></td><td>${r[6]}</td></tr>`
  ).join('');
}

  const dar = [
    ['01','비정형 단속 정보 조사·수집화','원천데이터 관리 · 한글문서 파싱 · PDF 파싱 · 라벨링 관리','구현','—'],
    ['02','비정상 항적 데이터 구축','원천데이터 관리 · 불법어선/Dark Vessel','구현','—'],
    ['03','AIS 부착 어망 등록 이력','원천데이터 관리 · 중국어선 분석 · 어구 위반 종합','구현','—'],
    ['04','AI 학습용 데이터 구축 기준','AI 데이터 현황 · 품질검수 관리 · 산출물·가이드','구현','—'],
    ['05','AI 학습용 데이터 구축','라벨링 관리 · 정제데이터 관리','구현','—'],
    ['06','AI 학습용 데이터셋 관리','학습데이터셋 관리 · 산출물·가이드','구현','—'],
    ['07','데이터 표준 수립·상위 표준 준수','프로젝트관리 → 메타데이터 (표준 도메인/단어/용어/코드)','구현','—'],
    ['08','데이터 카탈로그·메타데이터 관리','해양 데이터 맵 · 법령저장소 · 메타데이터 5종','구현','—'],
    ['09','데이터 품질 관리 체계','품질검수 관리 · 데이터 모델 검증','구현','—'],
    ['10','데이터 보존기간·파기 정책','시스템 관리 → 데이터 보관·파기','구현','—'],
    ['11','데이터 구조 설계 (트리플 모델)','AI데이터 (3단계 모델) · LLM 운영 관리 → 온톨로지','부분','트리플은 현재 명세 단계 — 그래프 적재 전'],
    ['12','데이터 구조 검증','데이터 모델 검증 (논리·물리·중복 정합성)','구현','—'],
    ['13','데이터 구조 관리 도구','데이터 관리체계 → DAR-13 (방법론) · 데이터 모델 검증','구현','ER 모델링 도구(ERwin·DA#) 자체는 시스템 외부'],
    ['14','데이터 값 검증','데이터 관리체계 → DAR-14 (방법론+DBChecker 절차) · 품질검수 관리','부분','진단 범위(전체/일부) 주관기관 협의 필요'],
    ['15','데이터 관리체계 수립','데이터 관리체계 → DAR-15 (조직·변경·오류개선 절차) · 권한(RBAC)','부분','해경청 담당 부서·지정 인원 확정은 발주기관 승인 대기'],
    ['16','데이터 연계 관리체계 수립','데이터 관리체계 → DAR-16 (AI-HUB 연계 정비·관리자 사이트) · 수집현황 모니터링','부분','한중어업공동단속시스템 원천 연계 API 미연결'],
    ['17','데이터 개방 관리체계','데이터 관리체계 → DAR-17 (기상정보 개방) · 외부 제공 API · 사용 신청/승인','부분','태풍·특보·예보/관측 4종 개방 API-HUB 공유'],
    ['18','DB 설계 및 구축','수집현황 모니터링 · 데이터 모델 검증 · 온톨로지(트리플 그래프 구조)','구현','—']
  ];
  const adDarRows = document.getElementById('adDarRows');

if (adDarRows) {
  adDarRows.innerHTML = dar.map(r =>
    `<tr><td class="ad-link">DAR-${r[0]}</td><td><strong>${r[1]}</strong></td><td>${r[2]}</td><td class="ad-center"><span class="ad-badge ${r[3] === '구현' ? 'green' : 'yellow'}">${r[3]}</span></td><td>${r[4]}</td></tr>`
  ).join('');
}
});


/* =========================================
   학습데이터셋 관리
========================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const page = document.querySelector('.dataset-page');
    if (!page) return;

    const datasets = [
      {
        id: 'DS-2026-009',
        name: '위성 SAR 다크베셀 표적 (Sentinel-1 · AI2 선종추정)',
        category: 'SAT',
        count: 2172,
        quality: 90,
        version: 'v1.0',
        status: '배포',
        updated: '2026-09-10',
        source: 'Sentinel-1 SAR',
        model: 'SAR-AI2'
      },
      {
        id: 'DS-2026-008',
        name: 'SAR 선박인식 학습셋 (AIS 조인 · 선종/선종 검증)',
        category: 'SAT',
        count: 5625,
        quality: 84,
        version: 'v1.0',
        status: '검수',
        updated: '2026-08-28',
        source: 'SAR · AIS',
        model: 'SAR-VES'
      },
      {
        id: 'DS-2026-006',
        name: '다크베셀 탐지 v3 (24h 선박 단위 · 규칙 참조 라벨)',
        category: 'SIG',
        count: 37836,
        quality: 88,
        version: 'v3.0',
        status: '배포',
        updated: '2026-10-04',
        source: 'SNPDB AIS 5분 표',
        model: 'DRK-VES',
        reference: '2026.09.30 (24h · 11,243,571점)'
      },
      {
        id: 'DS-2026-005',
        name: '어구 위반 분류 (gear_pattern, GroupKFold k=5)',
        category: 'TRK',
        count: 5595,
        quality: 99,
        version: 'v1.0',
        status: '배포',
        updated: '2026-07-24',
        source: 'SNPDB AIS',
        model: 'GEAR-CLS'
      },
      {
        id: 'DS-2026-004',
        name: '어업형태 분류 (허가 업종 대비 · 평가셋 645척)',
        category: 'TRK',
        count: 645,
        quality: 95,
        version: 'v1.0',
        status: '배포',
        updated: '2026-10-04',
        source: 'SNPDB AIS · 허가',
        model: 'FISH-CLS'
      },
      {
        id: 'DS-2026-003',
        name: '중국어선 국적분류 (항적, MMSI 미사용 · 어선 10,375척)',
        category: 'TRK',
        count: 10375,
        quality: 96,
        version: 'v1.0',
        status: '배포',
        updated: '2026-10-04',
        source: 'SNPDB AIS',
        model: 'NATION-CLS'
      },
      {
        id: 'DS-2026-002',
        name: '한중어업 허가어선 (2026 · 1,077척 · 업종·톤수)',
        category: 'ENF',
        count: 1077,
        quality: 96,
        version: 'v1.0',
        status: '배포',
        updated: '2026-10-04',
        source: '한중어업 허가자료',
        model: 'PERMIT'
      },
      {
        id: 'DS-2026-007',
        name: '환적(STS) 지속 의심 후보 (규칙 · 4,358건)',
        category: 'TRK',
        count: 4358,
        quality: 87,
        version: 'v0.9',
        status: '검수',
        updated: '2026-10-04',
        source: 'SNPDB AIS',
        model: 'STS-DETECT'
      },
      {
        id: 'DS-2026-001',
        name: 'AIS 정합성 검토셋 (MMSI 중복·위치점프 · 83,105척)',
        category: 'SIG',
        count: 83105,
        quality: 93,
        version: 'v0.9',
        status: '검수',
        updated: '2026-10-04',
        source: 'SNPDB AIS',
        model: 'AIS-INTEGRITY'
      }
    ];

    const tbody = document.getElementById('datasetTableBody');
    const detail = document.getElementById('datasetDetail');
    const count = document.getElementById('datasetCount');

    let currentCategory = 'ALL';
    let selectedId = 'DS-2026-006';

    function qualityClass(score) {
      if (score >= 90) return 'quality-green';
      if (score >= 85) return 'quality-blue';
      return 'quality-yellow';
    }

    function formatNumber(number) {
      return number.toLocaleString('ko-KR');
    }

    function addTextCell(row, text, className) {
      const td = document.createElement('td');
      const span = document.createElement('span');

      span.textContent = text;
      if (className) span.className = className;

      td.appendChild(span);
      row.appendChild(td);
    }

    function addBadgeCell(row, text, className) {
      const td = document.createElement('td');
      const span = document.createElement('span');

      span.className = 'dataset-badge ' + className;
      span.textContent = text;

      td.appendChild(span);
      row.appendChild(td);
    }

    function renderTable() {
      const filtered = datasets.filter(function (item) {
        return currentCategory === 'ALL' ||
               item.category === currentCategory;
      });

      count.textContent = filtered.length;
      tbody.replaceChildren();

      filtered.forEach(function (item) {
        const row = document.createElement('tr');

        row.tabIndex = 0;
        row.setAttribute('aria-selected', String(item.id === selectedId));

        if (item.id === selectedId) {
          row.classList.add('selected');
        }

        addTextCell(row, item.id, 'dataset-id');
        addTextCell(row, item.name, 'dataset-name');
        addBadgeCell(row, item.category, item.category);
        addTextCell(row, formatNumber(item.count));
        addBadgeCell(
          row,
          item.quality + '점',
          qualityClass(item.quality)
        );
        addTextCell(row, item.version);
        addBadgeCell(
          row,
          item.status,
          item.status === '배포' ? 'deployed' : 'review'
        );
        addTextCell(row, item.updated, 'dataset-date');

        row.addEventListener('click', function () {
          selectDataset(item.id);
        });

        row.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectDataset(item.id);
          }
        });

        tbody.appendChild(row);
      });
    }

    function detailField(label, value) {
      const wrapper = document.createElement('div');
      wrapper.className = 'dataset-detail-field';

      const caption = document.createElement('span');
      caption.textContent = label;

      const strong = document.createElement('strong');
      strong.textContent = value;

      wrapper.append(caption, strong);
      return wrapper;
    }

    function renderDetail() {
      const item = datasets.find(function (dataset) {
        return dataset.id === selectedId;
      });

      if (!item) return;

      detail.replaceChildren();

      const id = document.createElement('div');
      id.className = 'dataset-detail-id';
      id.textContent = item.id;

      const name = document.createElement('h3');
      name.className = 'dataset-detail-name';
      name.textContent = item.name;

      const grid = document.createElement('div');
      grid.className = 'dataset-detail-grid';

      grid.append(
        detailField('카테고리', item.category),
        detailField('버전', item.version),
        detailField('원천', item.source),
        detailField('기간', item.reference || '2026년 기준'),
        detailField('전체 건수', formatNumber(item.count)),
        detailField('라벨 완료', '0'),
        detailField('품질점수', item.quality + '점'),
        detailField('상태', item.status)
      );

      const divider = document.createElement('div');
      divider.className = 'dataset-detail-divider';

      const model = document.createElement('div');
      model.className = 'dataset-detail-model';

      const modelLabel = document.createElement('span');
      modelLabel.textContent = '연결 모델';

      const modelValue = document.createElement('strong');
      modelValue.textContent = item.model;

      model.append(modelLabel, modelValue);

      const updated = document.createElement('div');
      updated.className = 'dataset-detail-updated';
      updated.textContent = '최근 갱신: ' + item.updated;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dataset-detail-button';
      button.textContent = '상세 보기';

      button.addEventListener('click', function () {
        alert(item.id + ' 상세 화면은 추후 연결 예정입니다.');
      });

      const note = document.createElement('p');
      note.className = 'dataset-detail-note';
      note.textContent =
        '데이터 사용 신청은 AI-HUB 포털(aihub.kcg.it.kr)에서 처리합니다.';

      detail.append(
        id, name, grid, divider, model, updated, button, note
      );
    }

    function selectDataset(id) {
      selectedId = id;
      renderTable();
      renderDetail();
    }

    // 카테고리 필터
    document.querySelectorAll('.dataset-filter').forEach(function (button) {
      button.addEventListener('click', function () {
        currentCategory = button.dataset.category;

        document.querySelectorAll('.dataset-filter').forEach(function (filter) {
          filter.classList.toggle('active', filter === button);
        });

        const filtered = datasets.filter(function (item) {
          return currentCategory === 'ALL' ||
                 item.category === currentCategory;
        });

        if (filtered.length &&
            !filtered.some(function (item) {
              return item.id === selectedId;
            })) {
          selectedId = filtered[0].id;
        }

        renderTable();
        renderDetail();
      });
    });

    // 상단 탭
    document.querySelectorAll('.dataset-tab').forEach(function (button) {
      button.addEventListener('click', function () {
        const isList = button.dataset.datasetTab === 'list';

        document.getElementById('datasetListView').hidden = !isList;
        document.getElementById('datasetRequirementsView').hidden = isList;

        document.querySelectorAll('.dataset-tab').forEach(function (tab) {
          const active = tab === button;
          tab.classList.toggle('active', active);
          tab.setAttribute('aria-selected', String(active));
        });
      });
    });

    // CSV 다운로드
    document.getElementById('datasetExport').addEventListener('click', function () {
      const rows = [
        ['식별자', '데이터셋명', '카테고리', '건수', '품질', '버전', '상태', '갱신']
      ];

      datasets.forEach(function (item) {
        rows.push([
          item.id, item.name, item.category, item.count,
          item.quality, item.version, item.status, item.updated
        ]);
      });

      const csv = '\uFEFF' + rows.map(function (row) {
        return row.map(function (value) {
          return '"' + String(value).replace(/"/g, '""') + '"';
        }).join(',');
      }).join('\r\n');

      const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = '학습데이터셋_카탈로그.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    });

    // 등록 버튼 (데모)
    document.getElementById('datasetRegister').addEventListener('click', function () {
      alert('데이터셋 등록 기능은 추후 연결 예정입니다.');
    });

    renderTable();
    renderDetail();
  });
})();


/* =========================================
   라벨링 관리 페이지
========================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const page = document.querySelector('.labeling-page');
    if (!page) return;

    // 라벨링 기준서
    const guideButton = document.getElementById('labelingGuideBtn');

    if (guideButton) {
      guideButton.addEventListener('click', function () {
        alert('라벨링 기준서 연결 예정입니다.');
      });
    }

    // 데이터셋 상세 링크 (추후 연결)
    page.querySelectorAll('[data-label-dataset]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const datasetId = link.dataset.labelDataset;
        alert(datasetId + ' 데이터셋 상세 화면은 추후 연결 예정입니다.');
      });
    });
  });
})();



document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);

  const badge = (text, type = "gray") =>
    `<span class="quality-badge ${type}">${text}</span>`;

  const evalRows = [
    ["다크베셀(불법어선 / Dark Vessel)", "다크베셀 v3 (정본)", "Precision@Top-100 · 재현율 · PR-AUC", "train_dark_v3_snpdb.py", "0.139", "관측밀도 참조 라벨 · 운영 임계(test)"],
    ["다크베셀(불법어선 / Dark Vessel)", "다크베셀 재구성오차", "AUC · PR-AUC (12시간 정의와 불일치 — 참고)", "eval_dark_recon_snpdb.py", "0.066", "12시간 다크 라벨 · CL95 임계(test)"],
    ["AIS 신호 이상(AIS신호탐지)", "AIS 무결성", "확장 이상 선박 수 · 비율", "eval_ais_integrity_snpdb.py", "—", "정답 라벨 없음 (규칙 확정)"],
    ["AIS 신호 이상(AIS신호탐지)", "AIS 신호 점수 품질", "AUC · PR-AUC · 임계별 F1", "eval_ais_score_quality.py", "0.361", "MMSI 중복 확장 양성 · 운영 임계 0.5"],
    ["환적 의심 탐지", "환적 규칙 탐지", "지속 의심 항적 · 역할 조건", "eval_transship_snpdb.py", "—", "독립 정답 없음"],
    ["환적 의심 탐지", "환적 × 한중어업 운반선 교차검증", "재현율 · 운반선 관여 정밀도", "crosscheck_transship_kcje.py", "0.444", "한중어업 운반선 만남 기록 대비"],
    ["중국어선 분석", "중국어선 국적 분류", "재현율 · 정밀도 · F1 · AUC (5-fold)", "eval_china_nationality_snpdb.py", "0.910", "MID 412·413·414 국적 · 5-fold OOF · 임계 0.5"],
    ["어구/불법어구(어구 위반 종합)", "어구 패턴", "종류 Macro-F1 · 어구 분포", "train_gear_pattern_snpdb.py", "0.998", "규칙 라벨 재현 (종류 Macro-F1)"],
    ["어업형태·선단(어업형태별 탐지)", "어업형태(업종)", "허가 업종 대비 정확도", "train_fishery_type_snpdb.py", "0.998", "규칙 라벨 재현 (종류 Macro-F1)"],
    ["어업형태·선단(어업형태별 탐지)", "선단 × 선수·선종 교차검증", "업력 일치 · 재현율 (2~20척)", "crosscheck_fleets_kcje.py", "0.579", "한중어업 허가선 선주 등록 관계 (2~20척 선단)"],
    ["모선 추론(어구 상관)", "모선 어구 × GFW", "어구별 GFW 일치율", "crosscheck_motion_gfw.py", "0.322", "GFW 특정 어구 라벨 · 클래스 Macro-F1"],
    ["불법선박 위험해역", "위험 격자 × 단속 위치", "Lift@Top-N · 상위 20% 적중률 · AUC", "crosscheck_risk_grid_enforcement.py", "0.500", "단속·나포 사건 격자 = 양성, 위험 상위 20% 격자 = 예측 양성"]
  ];

  const evalBody = $("#qualityEvalBody");
  if (evalBody) {
    evalBody.innerHTML = evalRows.map(row => `
      <tr>
        <td><strong>${row[0]}</strong></td>
        <td><strong>${row[1]}</strong></td>
        <td>${row[2]}</td>
        <td class="mono">${row[3]}</td>
        <td class="center"><strong>${row[4]}</strong><br><span class="muted">2026-10-05</span></td>
        <td>${row[5]}</td>
        <td class="center muted">—</td>
        <td class="center muted">—</td>
      </tr>
    `).join("");
  }

  const historyRows = [
    ["다크베셀(불법어선 / Dark Vessel)", "2026-07-21", "2026-10-05", 9, ["F1 0.139", "정밀도 0.075", "재현율 0.860", "P@Top-100 0.620"]],
    ["AIS 신호 이상(AIS신호탐지)", "2026-08-08", "2026-10-05", 7, ["F1(임계 0.5) 0.361", "정밀도 0.410", "재현율 0.322"]],
    ["중국어선 분석", "2026-07-21", "2026-10-05", 5, ["F1 0.910", "정밀도 0.869", "재현율 0.956"]],
    ["환적 의심 탐지", "2026-08-08", "2026-10-05", 7, ["F1 0.444", "정밀도(환항) 0.286", "재현율 0.991"]],
    ["어구/불법어구(어구 위반 종합)", "2026-07-21", "2026-10-04", 4, ["어구 분포 표본 3.7%", "자망 22.9%", "선망 0.6%", "미상 72.9%"]],
    ["어업형태·선단(어업형태별 탐지)", "2026-07-21", "2026-10-05", 7, ["업종 Macro-F1 0.639", "선단 F1 0.579"]],
    ["모선 추론(어구 상관)", "2026-08-08", "2026-10-05", 3, ["Macro-F1 0.322", "일치율 0.512"]],
    ["불법선박 위험해역", "2026-08-21", "2026-10-05", 4, ["격자 F1 0.500", "정밀도 0.644", "재현율 0.408"]],
    ["어구·선박 상관접수", "2026-08-08", "2026-09-19", 2, ["영향규칙 해석 대상 36,883 MMSI"]],
    ["불법 조업 이벤트", "2026-08-08", "2026-08-08", 1, ["실측값 없음"]],
    ["어구 정체성 충돌", "2026-08-08", "2026-08-08", 1, ["실측값 없음"]],
    ["물고기 탐지", "2026-08-08", "2026-09-19", 2, ["GFW 조업노력 원천 6,973 레코드 / 3,930 객체별"]],
    ["경찰이동자반", "2026-08-08", "2026-08-08", 1, ["실측값 없음"]]
  ];

  const historyBody = $("#qualityHistoryBody");
  if (historyBody) {
    historyBody.innerHTML = historyRows.map(row => `
      <tr>
        <td><strong>${row[0]}</strong></td>
        <td class="center mono muted">${row[1]}</td>
        <td class="center mono muted">${row[2]}</td>
        <td class="center">${row[3]}</td>
        <td>${row[4].map(v => badge(v, v.includes("0.910") ? "green" : "gray")).join(" ")}</td>
      </tr>
    `).join("");
  }

  const recentHistory = [
    {
      date: "2026-10-05",
      name: "다크베셀(불법어선 / Dark Vessel)",
      note: "SNPDB 5분 표 24h (model_eval dry-run)",
      description: "F1을 정기 평가 지표로 추가 · 24h 창은 양성률이 낮아 정밀도·F1이 낮다. 9월(0.910) 대비 P@Top-100 하락은 추후 대상",
      tags: ["F1 0.139", "정밀도 0.075", "재현율 0.860", "P@Top-100 0.620"]
    },
    {
      date: "2026-10-05",
      name: "중국어선 분석",
      note: "SNPDB 5분 표 24h · 5-fold OOF",
      description: "F1 정기 측정 편입 — 목표 충족 유지",
      tags: ["F1 0.910 (목표 ≥ 0.85)", "정밀도 0.869", "재현율 0.956"]
    },
    {
      date: "2026-10-05",
      name: "환적 의심 탐지",
      note: "hourly 표 · KCJE 운반선 만남(09-23~09-25)",
      description: "KCJE 교차검증을 hourly 표로 옮겨 재현율 높고 정밀도·F1 산출",
      tags: ["F1 0.444", "정밀도(환항) 0.286", "재현율 0.991"]
    },
    {
      date: "2026-10-05",
      name: "어업형태·선단(어업형태별 탐지)",
      note: "SNPDB 24h · 허가 등록 업종",
      description: "허가 업종 대비 Macro-F1(저인망 0.817 · 자망 0.475)과 선단 × 선주 F1을 새로 측정",
      tags: ["업종 Macro-F1 0.639", "선단 F1 0.579"]
    }
  ];

  const filter = $("#qualityHistoryFilter");
  const historyList = $("#qualityHistoryList");

  if (filter && historyList) {
    const names = [...new Set(recentHistory.map(item => item.name))];

    names.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      filter.appendChild(option);
    });

    const renderHistory = () => {
      const selected = filter.value;
      const items = recentHistory.filter(item =>
        selected === "all" || item.name === selected
      );

      historyList.innerHTML = items.map(item => `
        <article class="quality-history-item">
          <div class="quality-history-item-head">
            <span class="quality-history-date">${item.date}</span>
            ${badge("재측정", "cyan")}
            <strong>${item.name}</strong>
            <span class="muted">${item.note}</span>
          </div>
          <p>${item.description}</p>
          <div class="quality-history-tags">
            ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>
        </article>
      `).join("");
    };

    filter.addEventListener("change", renderHistory);
    renderHistory();
  }

  const issues = [
    ["QA-0010", "AI탐지 정기 성능평가 배치", "보완 중", "주간·월간 배치(model_eval) 운영 실행기록 0건 — 운영 prediction 미재배포", "실행기록(iuu_script_run) 점검", "2026-10-04", "운영 재배포 후 첫 실행 확인"],
    ["QA-0009", "환적 — 한중어업 운반선 교차검증", "해결", "규칙 재현(QA-0004) 대신 외부 기록 대조: 재현율 0.929 · 운반선 관여 정밀도 0.350", "KCJE 만남 기록 대조", "2026-10-04", "정기 평가 대상 편입"],
    ["QA-0008", "모선 추론 어구 (GFW 교차, 9월)", "보완 중", "저인망 90.2% 일치 · 유망 7.1% · 위망 0% — 유망·위망 표본 부족 지속", "GFW 교차검증", "2026-10-04", "조업기 표본 확보"],
    ["QA-0007", "다크베셀 v3 (9월 24h)", "해결", "Precision@Top-100 0.910 ±0.006 · 재현율 0.911 — 재구성오차(QA-0001)는 12시간 정의와 불일치", "재분할 5회 평균±표준편차", "2026-10-04", "유지·정기 평가"],
    ["QA-0006", "어업형태 유형·위망 (GFW 교차)", "대체됨", "GFW 공개라벨 교차일치 0% — 표본 희소(급어기)", "GFW 교차검증", "2026-07-24", "조업기 표본 확보"],
    ["QA-0005", "어구 위반 분류 UNKNOWN", "보완 중", "UNKNOWN 70.1% 미라벨 — 규칙 시그니처 미매칭", "GroupKFold", "2026-07-24", "라벨 확대·재학습"],
    ["QA-0004", "환적(STS) 규칙 pseudo-label", "대체됨", "GBM P/R 1.00은 규칙 재현값 — 실제표 아님", "규칙 재현", "2026-07-24", "현장 확정 라벨"],
    ["QA-0003", "AIS 정합성 검토", "미해결", "현재 예시치(illustrative) — 골든셋 미구축", "수동 검수", "2026-07-24", "골든셋 구축"],
    ["QA-0002", "어구·선박 연계(오표소어)", "미해결", "오표소어 어구매핑 관측 연결 불가", "시공간 매칭", "2026-07-24", "조업기 수집"],
    ["QA-0001", "다크베셀 이상탐지(비지도)", "대체됨", "벤치 F1 0.979 — 라벨 없이 재구성오차 CL95 판정", "벤치마크", "2026-07-24", "유지·모니터링"]
  ];

  const issueBody = $("#qualityIssuesBody");
  if (issueBody) {
    issueBody.innerHTML = issues.map(row => {
      const type = row[2] === "해결" ? "green" :
        row[2] === "보완 중" ? "warning" :
        row[2] === "미해결" ? "red" : "gray";

      return `<tr>
        <td class="mono">${row[0]}</td>
        <td><strong>${row[1]}</strong></td>
        <td class="center">${badge(row[2], type)}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td class="mono muted">${row[5]}</td>
        <td>${row[6]}</td>
      </tr>`;
    }).join("");
  }

  const f1Rows = [
    ["중국어선 국적 분류", "중국어선 분석", "MID 412·413·414 국적 · 5-fold OOF · 임계 0.5", "0.869", "0.956", "0.910", "4,766", "24h", "충족", ""],
    ["어업형태 (허가 업종 대비)", "어업형태·선단", "허가 등록 업종 · 산출별 Macro-F1 (저인망·자망)", "0.649", "0.846", "0.639", "198", "24h", "미달", "저인망 F1 0.817 · 자망 0.475 · 커버리지 30.2%"],
    ["선단 탐지", "어업형태·선단", "한중어업 허가선 선주 등록 관계 (2~20척 선단)", "0.760", "0.468", "0.579", "201", "24h", "미달", "정밀도=업력 일치, 재현율=선주 기준"],
    ["불법선박 위험 격자", "불법선박 위험해역", "단속·나포 사건 격자=양성, 위험 상위 20% 격자=예측 양성", "0.644", "0.408", "0.500", "71", "최근 7일", "미달", "사건 가중 적중률(상위 20%)과는 다른 격자 단위 지표"],
    ["환적 의심", "환적 의심 탐지", "한중어업 운반선 만남 기록 대비", "0.286", "0.991", "0.444", "117", "09-23~09-25", "미달", "KCJE 기록이 전수가 아니라 정밀도는 하한"],
    ["AIS 신호 점수", "AIS 신호 이상", "MMSI 중복 확장 양성 · 운영 임계 0.5", "0.410", "0.322", "0.361", "425", "24h", "미달", ""],
    ["모선 추론 모선 어구", "모선 추론", "GFW 특정 어구 라벨 · 클래스 Macro-F1", "0.333", "0.593", "0.322", "89", "24h", "미달", "분류별 종합 표본이라 재현율은 표본 내 값"],
    ["다크베셀 v3", "다크베셀", "관측밀도 참조 라벨 · 운영 임계(test)", "0.075", "0.860", "0.139", "121", "24h", "미달", "24h 양성률이 낮아 정밀도·F1은 참고"],
    ["다크베셀 재구성오차 (참고)", "다크베셀", "12시간 다크 라벨 · CL95 임계(test)", "0.035", "0.538", "0.066", "132", "24h", "미달", "12시간 정의와 맞지 않아 참고 지표"],
    ["어구 패턴", "어구/불법어구", "규칙 라벨 재현 (종류 Macro-F1)", "0.997", "1.000", "0.998", "8,010", "24h", "규칙 재현", "독립 정답이 아니라 규칙을 얼마나 재현하는지"],
    ["어업형태 (규칙 재현)", "어업형태·선단", "규칙 라벨 재현 (종류 Macro-F1)", "0.997", "0.999", "0.998", "8,050", "24h", "규칙 재현", "독립 정답 대비는 허가 업종 대비 행"],
    ["AIS 무결성", "AIS 신호 이상", "정답 라벨 없음 (규칙 확정)", "—", "—", "—", "—", "24h", "정답 없음", "물리 확정 정답 대비는 AIS 신호 점수 행"],
    ["환적 규칙 탐지", "환적 의심 탐지", "독립 정답 없음", "—", "—", "—", "—", "24h", "정답 없음", "정답 대비는 환적 의심 행"]
  ];

  const f1Body = $("#qualityF1Body");
  if (f1Body) {
    f1Body.innerHTML = f1Rows.map(row => {
      const type = row[8] === "충족" ? "green" :
        row[8] === "미달" ? "warning" : "gray";

      return `<tr>
        <td><strong>${row[0]}</strong></td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td class="center mono">${row[3]}</td>
        <td class="center mono">${row[4]}</td>
        <td class="center mono"><strong>${row[5]}</strong></td>
        <td class="center mono muted">${row[6]}</td>
        <td class="center">${row[7]}</td>
        <td class="center">${badge(row[8], type)}</td>
        <td>${row[9]}</td>
      </tr>`;
    }).join("");
  }

  // CSV 내려받기: 화면의 평가 이력 표를 내보냄
  $("#qualityHistoryDownload")?.addEventListener("click", () => {
    const rows = [
      ["메뉴", "최초 점검", "최근 점검", "점검 횟수", "최근 실측 지표"],
      ...historyRows.map(row => [
        row[0], row[1], row[2], row[3], row[4].join(" / ")
      ])
    ];

    const csv = "\uFEFF" + rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "quality-evaluation-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  // 외부 화면 URL은 실제 경로 연결 전까지 비활성 안내
  ["qualityDatasetButton", "qualityHistoryButton"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => {
      alert("실제 연결할 페이지 주소를 지정해 주세요.");
    });
  });

  if (window.lucide) {
    lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".model-link-page");
  if (!page) return;

  const scrollToPanel = (selector) => {
    const target = page.querySelector(selector);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  // 상단 버튼
  page.querySelectorAll("[data-model-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.modelAction;

      if (action === "monitor") {
        scrollToPanel(".model-link-bottom-grid");
      }

      if (action === "registry") {
        scrollToPanel(".model-link-mapping-panel");
      }

      if (action === "train") {
        scrollToPanel(".model-link-bottom-grid");
      }
    });
  });

  // 데이터셋 링크
  page.querySelectorAll("[data-dataset]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const datasetId = link.dataset.dataset;
      const rows = page.querySelectorAll(".model-link-mapping-table tbody tr");

      scrollToPanel(".model-link-mapping-panel");

      rows.forEach(row => {
        const matched = row.textContent.includes(datasetId);

        row.classList.toggle("model-link-row-highlight", matched);
      });
    });
  });

  if (window.lucide) {
    lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".raw-page");
  if (!page) return;

  /* =====================================
     내부 데이터 등록 이력
  ===================================== */
  const history = [
    {
      id: "RAW-2026-018201",
      name: "AIS 한반도 EEZ 1분 샘플링",
      category: "SIG",
      source: "AIS 자체수신",
      method: "스트리밍",
      count: "1,842,310",
      volume: "14.2 GB",
      permission: "내부",
      user: "정보통신과",
      date: "2026-04-19 09:12"
    },
    {
      id: "RAW-2026-018192",
      name: "V-Pass 위치 5분 배치",
      category: "SIG",
      source: "수협 연계",
      method: "배치",
      count: "212,408",
      volume: "1.4 GB",
      permission: "유관기관",
      user: "정보통신과",
      date: "2026-04-19 09:00"
    },
    {
      id: "RAW-2026-018184",
      name: "VTS 레이더 트랙",
      category: "SIG",
      source: "해경 내부",
      method: "스트리밍",
      count: "891,243",
      volume: "7.8 GB",
      permission: "내부",
      user: "경비국",
      date: "2026-04-19 08:55"
    },
    {
      id: "RAW-2026-018171",
      name: "위성 SAR scene 4월 셋북",
      category: "SAT",
      source: "국립해양조사원",
      method: "이벤트",
      count: "124",
      volume: "42.1 GB",
      permission: "유관기관",
      user: "전문가팀",
      date: "2026-04-18 22:14"
    },
    {
      id: "RAW-2026-018162",
      name: "함정 C-04 영상 segment",
      category: "IMG",
      source: "함정 영상",
      method: "배치",
      count: "2,840",
      volume: "18.6 GB",
      permission: "내부",
      user: "서해지방청",
      date: "2026-04-18 18:42"
    },
    {
      id: "RAW-2026-018155",
      name: "드론 항공 영상",
      category: "IMG",
      source: "경비 드론",
      method: "배치",
      count: "420",
      volume: "3.2 GB",
      permission: "내부",
      user: "서해지방청",
      date: "2026-04-18 16:20"
    },
    {
      id: "RAW-2026-018148",
      name: "단속보고서 (월간)",
      category: "TXT",
      source: "경비국 DB",
      method: "API",
      count: "412",
      volume: "8.4 MB",
      permission: "내부·민감",
      user: "경비국",
      date: "2026-04-18 12:00"
    },
    {
      id: "RAW-2026-018143",
      name: "사고·상황보고 텍스트",
      category: "TXT",
      source: "112·상황실",
      method: "이벤트",
      count: "1,820",
      volume: "24.6 MB",
      permission: "민감",
      user: "상황실",
      date: "2026-04-18 09:30"
    },
    {
      id: "RAW-2026-018132",
      name: "단속·사고 이력 (분기)",
      category: "ENF",
      source: "경비국 DB",
      method: "배치",
      count: "4,210",
      volume: "62.4 MB",
      permission: "내부",
      user: "경비국",
      date: "2026-04-17 23:30"
    }
  ];

  const categoryClasses = {
    SIG: "sig",
    SAT: "sat",
    IMG: "img",
    TXT: "txt",
    ENF: "enf"
  };

  const methodClasses = {
    "스트리밍": "stream",
    "배치": "batch",
    "이벤트": "batch",
    "API": "stream"
  };

  const permissionClasses = {
    "내부": "internal",
    "유관기관": "agency",
    "내부·민감": "private",
    "민감": "private"
  };

  const tbody = page.querySelector("#rawHistoryBody");

  if (tbody) {
    history.forEach(item => {
      const tr = document.createElement("tr");

      const cells = [
        item.id,
        item.name,
        item.category,
        item.source,
        item.method,
        item.count,
        item.volume,
        item.permission,
        item.user,
        item.date
      ];

      cells.forEach((value, index) => {
        const td = document.createElement("td");

        if (index === 0) {
          const span = document.createElement("span");
          span.className = "raw-table-link";
          span.textContent = value;
          td.appendChild(span);
        } else if (index === 1) {
          const span = document.createElement("span");
          span.className = "raw-table-name";
          span.textContent = value;
          td.appendChild(span);
        } else if ([2, 4, 7].includes(index)) {
          const span = document.createElement("span");
          const badgeClass =
            index === 2 ? categoryClasses[value] :
            index === 4 ? methodClasses[value] :
            permissionClasses[value];

          span.className = `raw-pill ${badgeClass || ""}`;
          span.textContent = value;
          td.appendChild(span);
        } else {
          td.textContent = value;
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /* =====================================
     내부 / 외부 탭
  ===================================== */
  const tabs = page.querySelectorAll("[data-raw-tab]");
  const internalPanel = page.querySelector("#rawInternalPanel");
  const externalPanel = page.querySelector("#rawExternalPanel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const isInternal = tab.dataset.rawTab === "internal";

      tabs.forEach(button => {
        const active = button === tab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });

      internalPanel.hidden = !isInternal;
      externalPanel.hidden = isInternal;
    });
  });

  /* =====================================
     상세 모달
  ===================================== */
  const modal = page.querySelector("#rawDetailModal");
  const modalTitle = page.querySelector("#rawModalTitle");
  const modalBody = page.querySelector("#rawModalBody");
  let lastFocusedElement = null;

  function openModal(title, details) {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = title;
    modalBody.replaceChildren();

    details.forEach(detail => {
      const p = document.createElement("p");
      p.textContent = detail;
      modalBody.appendChild(p);
    });

    modal.hidden = false;
    modal.querySelector("[data-raw-close]")?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    lastFocusedElement?.focus();
  }

  page.querySelectorAll(".raw-detail-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".raw-source-card");
      const title = card.querySelector("h3").textContent.trim();
      const count = card.querySelector(".raw-source-count").textContent.trim();
      const description = card.querySelector(".raw-source-desc").textContent.trim();
      const status = card.querySelector(".raw-status").textContent.trim();

      const details = [
        `데이터 출처: ${title}`,
        `수집 건수: ${count}`,
        `수집 방식: ${description}`,
        `표시 상태: ${status}`,
        "현재 화면은 시안이며, 상세 API 및 실시간 연결 상태는 제공되지 않습니다."
      ];

      openModal(title, details);
    });
  });

  page.querySelectorAll("[data-raw-close]").forEach(button => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  /* =====================================
     상단 버튼
     실제 API 미연결 안내
  ===================================== */
  const actions = [
    ["rawRulesBtn", "수집 지침"],
    ["rawApiBtn", "API 연결"],
    ["rawRegisterBtn", "원천데이터 등록"]
  ];

  actions.forEach(([id, title]) => {
    page.querySelector(`#${id}`)?.addEventListener("click", () => {
      openModal(title, [
        `${title} 기능은 현재 화면 시안에 포함된 버튼입니다.`,
        "실제 동작에는 관련 페이지 경로 또는 백엔드 API 연결이 필요합니다."
      ]);
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".hwp-page");
  if (!page) return;

  const dropzone = page.querySelector("#hwpDropzone");
  const fileInput = page.querySelector("#hwpFileInput");
  const uploadResult = page.querySelector("#hwpUploadResult");
  const fileName = page.querySelector("#hwpFileName");
  const fileSize = page.querySelector("#hwpFileSize");
  const removeButton = page.querySelector("#hwpFileRemove");

  const allowedExtensions = [
    "hwp",
    "hwpx",
    "pdf",
    "docx",
    "xlsx",
    "xls",
    "hwpml",
    "hwp3"
  ];

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function handleFile(file) {
    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      alert("지원하지 않는 파일 형식입니다.");
      return;
    }

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    uploadResult.hidden = false;

    // 현재는 UI 데모입니다.
    // 실제 파싱은 kordoc 엔진 연동 후 구현합니다.
    console.log("선택한 파일:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
  }

  /* 클릭으로 파일 선택 */
  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  dropzone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", event => {
    handleFile(event.target.files?.[0]);
  });

  /* 드래그 앤 드롭 */
  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "dragend"].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", event => {
    event.preventDefault();
    dropzone.classList.remove("dragover");

    const file = event.dataTransfer?.files?.[0];
    handleFile(file);
  });

  /* 파일 제거 */
  removeButton.addEventListener("click", () => {
    fileInput.value = "";
    fileName.textContent = "";
    fileSize.textContent = "";
    uploadResult.hidden = true;
  });

  /* 코드 복사 */
  page.querySelectorAll(".hwp-copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const targetId = button.dataset.copy;
      const target = document.getElementById(targetId);

      if (!target) return;

      const code = target.textContent;

      try {
        await navigator.clipboard.writeText(code);

        const originalHTML = button.innerHTML;

        button.textContent = "복사 완료";

        setTimeout(() => {
          button.innerHTML = originalHTML;

          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 1500);
      } catch (error) {
        console.error("코드 복사 실패:", error);
        alert("코드를 복사하지 못했습니다.");
      }
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".pdf-page");
  if (!page) return;

  const dropzone = page.querySelector("#pdfDropzone");
  const fileInput = page.querySelector("#pdfFileInput");
  const uploadResult = page.querySelector("#pdfUploadResult");
  const fileName = page.querySelector("#pdfFileName");
  const fileSize = page.querySelector("#pdfFileSize");
  const removeButton = page.querySelector("#pdfFileRemove");

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function handleFile(file) {
    if (!file) return;

    const isPdf =
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("PDF 파일만 업로드할 수 있습니다.");
      return;
    }

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    uploadResult.hidden = false;

    // UI 데모: 실제 서버 업로드/파싱은 수행하지 않음
    console.log("선택한 PDF 파일:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
  }

  /* 클릭하여 선택 */
  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  dropzone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", event => {
    handleFile(event.target.files?.[0]);
  });

  /* 드래그 앤 드롭 */
  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "dragend"].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", event => {
    event.preventDefault();
    dropzone.classList.remove("dragover");

    const file = event.dataTransfer?.files?.[0];
    handleFile(file);
  });

  /* 선택한 파일 제거 */
  removeButton.addEventListener("click", () => {
    fileInput.value = "";
    fileName.textContent = "";
    fileSize.textContent = "";
    uploadResult.hidden = true;
  });

  /* 코드 복사 */
  page.querySelectorAll(".pdf-copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const targetId = button.dataset.copy;
      const target = document.getElementById(targetId);

      if (!target) return;

      try {
        await navigator.clipboard.writeText(target.textContent);

        const originalHTML = button.innerHTML;
        button.textContent = "복사 완료";

        setTimeout(() => {
          button.innerHTML = originalHTML;

          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 1500);
      } catch (error) {
        console.error("코드 복사 실패:", error);
        alert("코드를 복사하지 못했습니다.");
      }
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".law-page");
  if (!page) return;

  const searchForm = page.querySelector("#lawSearchForm");
  const searchInput = page.querySelector("#lawSearchInput");
  const searchResult = page.querySelector("#lawSearchResult");
  const tableRows = [
    ...page.querySelectorAll("#lawSeedTableBody tr")
  ];

  const initialMessage =
    "검색어를 입력하면 법령 본문(조문)을 제공합니다. " +
    "위 예시를 눌러 바로 검색할 수 있습니다.";

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();
  }

  function searchLaw(keyword) {
    const query = normalize(keyword);

    if (!query) {
      searchResult.classList.remove("has-results");
      searchResult.textContent = initialMessage;
      return;
    }

    const matches = tableRows.filter(row => {
      const text = [
        row.dataset.search,
        row.textContent
      ].join(" ");

      return normalize(text).includes(query);
    });

    searchResult.classList.add("has-results");
    searchResult.replaceChildren();

    const summary = document.createElement("div");
    summary.style.marginBottom = "8px";

    const count = document.createElement("strong");
    count.textContent = `“${keyword}” 검색 결과 ${matches.length}건`;

    summary.appendChild(count);
    searchResult.appendChild(summary);

    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.textContent =
        "일치하는 시드 법령이 없습니다. 다른 검색어를 입력해 주세요.";
      searchResult.appendChild(empty);
      return;
    }

    matches.forEach(row => {
      const name = row.querySelector(".law-name")?.textContent.trim();
      const description = row.cells[2]?.textContent.trim();

      const item = document.createElement("div");
      item.className = "law-search-item";
      item.style.padding = "8px 0";
      item.style.borderTop = "1px solid #dbe4f1";

      const title = document.createElement("strong");
      title.textContent = name?.replace(/^›\s*/, "") || "";

      const detail = document.createElement("p");
      detail.textContent = description || "";
      detail.style.marginTop = "4px";
      detail.style.color = "#8193b0";
      detail.style.fontSize = "10px";

      item.append(title, detail);
      searchResult.appendChild(item);
    });

    // 결과 위치로 이동
    searchResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  /* 검색 버튼 */
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchLaw(searchInput.value.trim());
  });

  /* 추천 검색어 */
  page.querySelectorAll("[data-keyword]").forEach(button => {
    button.addEventListener("click", () => {
      const keyword = button.dataset.keyword || "";

      searchInput.value = keyword;
      searchLaw(keyword);
    });
  });

  /* 테이블 행 클릭 */
  tableRows.forEach(row => {
    row.addEventListener("click", () => {
      const name = row
        .querySelector(".law-name")
        ?.textContent
        .trim()
        .replace(/^›\s*/, "");

      if (!name) return;

      searchInput.value = name;
      searchLaw(name);
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".refine-page");
  if (!page) return;

  const maskButton = page.querySelector("#refineMaskButton");
  const batchButton = page.querySelector("#refineBatchButton");
  const toast = page.querySelector("#refineToast");

  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("is-visible");

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3500);
  }

  // 비식별화 지침
  maskButton?.addEventListener("click", () => {
    showToast(
      "비식별화 지침(v1.0) 파일이 연결되지 않았습니다. 실제 문서 경로를 연결해 주세요."
    );
  });

  // 일괄 재정제 (퍼블리싱 데모)
  batchButton?.addEventListener("click", () => {
    if (batchButton.disabled) return;

    batchButton.disabled = true;

    const originalHTML = batchButton.innerHTML;

    batchButton.textContent = "재정제 요청 중...";

    showToast(
      "데모 모드입니다. 실제 정제 작업이나 데이터 변경은 수행하지 않습니다."
    );

    setTimeout(() => {
      batchButton.innerHTML = originalHTML;
      batchButton.disabled = false;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }, 1500);
  });

  // 식별자 링크: 상세 페이지 미연결
  page.querySelectorAll(".refine-id").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      showToast(
        `${link.textContent.trim()} 상세 화면은 아직 연결되지 않았습니다.`
      );
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hubApplicationForm");
  const saveButton = document.getElementById("hubSaveDraft");
  const tabs = document.querySelectorAll("[data-apply-tab]");
  const panels = {
    application: document.getElementById("hubApplicationPanel"),
    pledge: document.getElementById("hubPledgePanel"),
    status: document.getElementById("hubStatusPanel")
  };

  if (!form) return;

  // 탭 전환
  function switchTab(name) {
    tabs.forEach((tab) => {
      const active = tab.dataset.applyTab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    Object.entries(panels).forEach(([key, panel]) => {
      if (!panel) return;
      const active = key === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    document.querySelectorAll(".hub-apply-step").forEach((step, index) => {
      step.classList.toggle(
        "is-current",
        index === (name === "pledge" ? 1 : 0)
      );
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.applyTab);
    });
  });

  document.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.goTab);
    });
  });

  // 필수 입력 검사
  function validateForm() {
    if (!form.reportValidity()) return false;

    const privacyConsent = form.querySelector(
      'input[name="privacyConsent"]:checked'
    );

    if (!privacyConsent || privacyConsent.value !== "agree") {
      alert("개인정보 수집·이용에 동의해 주세요.");
      return false;
    }

    const start = form.elements.periodStart.value;
    const end = form.elements.periodEnd.value;

    if (start && end && start > end) {
      alert("이용 종료일은 시작일 이후여야 합니다.");
      form.elements.periodEnd.focus();
      return false;
    }

    return true;
  }

  // 다음 단계
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    switchTab("pledge");
  });

  // 임시 저장 (현재 브라우저에만 저장)
  saveButton?.addEventListener("click", () => {
    const data = {};

    Array.from(form.elements).forEach((element) => {
      if (!element.name) return;

      if (element.type === "checkbox") {
        data[element.name] = element.checked;
      } else if (element.type === "radio") {
        if (element.checked) {
          data[element.name] = element.value;
        }
      } else {
        data[element.name] = element.value;
      }
    });

    try {
      sessionStorage.setItem(
        "hubApplicationDraft",
        JSON.stringify(data)
      );
      alert("현재 브라우저 세션에 임시 저장되었습니다.");
    } catch (error) {
      alert("임시 저장에 실패했습니다.");
    }
  });

  // 저장된 임시 내용 복원
  try {
    const saved = sessionStorage.getItem("hubApplicationDraft");

    if (saved) {
      const data = JSON.parse(saved);

      Array.from(form.elements).forEach((element) => {
        if (!element.name || !(element.name in data)) return;

        if (element.type === "checkbox") {
          element.checked = Boolean(data[element.name]);
        } else if (element.type === "radio") {
          element.checked = element.value === data[element.name];
        } else {
          element.value = data[element.name];
        }
      });
    }
  } catch (error) {
    console.warn("임시 저장 데이터를 복원하지 못했습니다.", error);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".review-page");
  if (!page) return;

  // 퍼블리싱용 예시 데이터
  const applications = [
    {
      id: "APP-2026-0158",
      title: "다크베셀 SAR 합성 데이터셋 v2",
      organization: "해양경찰연구센터",
      applicant: "김영수 사무관 (사무관)",
      date: "2026-05-19",
      risk: "medium",
      status: "review",
      period: "2026-06-01 ~ 2026-08-31",
      purpose: "야간·악천후 다크베셀 탐지 모델 BHV-ILG 학습 보강",
      category: "SAT",
      size: "8.6 GB",
      memo: "합성 비율·재식별 위험 사전 검토 완료. 적정성 자문 의견 중.",
      terms: true,
      pledge: true
    },
    {
      id: "APP-2026-0156",
      title: "AIS 한반도 EEZ 학습셋 v2.3",
      organization: "해양경찰청 정보통신과",
      applicant: "어현상 경위 (경위)",
      date: "2026-05-18",
      risk: "low",
      status: "review",
      period: "2026-06-01 ~ 2026-08-31",
      purpose: "AIS 기반 선박 탐지 및 항적 분석 모델 검증",
      category: "AIS",
      size: "3.2 GB",
      memo: "데이터 활용 목적과 이용 범위 확인 중.",
      terms: true,
      pledge: true
    },
    {
      id: "APP-2026-0155",
      title: "선박 영상 분석 학습셋",
      organization: "해양경찰교육원",
      applicant: "박민수 경감",
      date: "2026-05-17",
      risk: "low",
      status: "pending",
      period: "2026-06-01 ~ 2026-09-30",
      purpose: "선박 영상 분류 모델 학습",
      category: "VIDEO",
      size: "12.4 GB",
      memo: "보안서약서 제출 대기.",
      terms: true,
      pledge: false
    },
    {
      id: "APP-2026-0154",
      title: "해양 관측 데이터셋",
      organization: "국립해양조사원",
      applicant: "이수진 연구원",
      date: "2026-05-16",
      risk: "low",
      status: "pending",
      period: "2026-06-01 ~ 2026-10-31",
      purpose: "해양 관측 데이터 분석",
      category: "OCEAN",
      size: "5.1 GB",
      memo: "사용 신청서 확인 대기.",
      terms: true,
      pledge: false
    },
    {
      id: "APP-2026-0153",
      title: "연안 해양환경 예측 데이터",
      organization: "해양환경공단",
      applicant: "최지훈 과장",
      date: "2026-05-15",
      risk: "low",
      status: "approved",
      period: "2026-05-20 ~ 2026-08-20",
      purpose: "연안 환경 변화 예측 모델 검증",
      category: "OCEAN",
      size: "6.4 GB",
      memo: "사용 승인 완료.",
      terms: true,
      pledge: true
    },
    {
      id: "APP-2026-0152",
      title: "선박 탐지 위성영상 데이터",
      organization: "해양경찰연구센터",
      applicant: "정하늘 연구원",
      date: "2026-05-14",
      risk: "medium",
      status: "approved",
      period: "2026-05-20 ~ 2026-08-20",
      purpose: "위성영상 기반 선박 탐지 알고리즘 개발",
      category: "SAT",
      size: "9.8 GB",
      memo: "보안 검토 및 승인 완료.",
      terms: true,
      pledge: true
    },
    {
      id: "APP-2026-0151",
      title: "선박 위치정보 통계 데이터",
      organization: "해양수산연구원",
      applicant: "강민재 연구원",
      date: "2026-05-13",
      risk: "low",
      status: "approved",
      period: "2026-05-15 ~ 2026-08-15",
      purpose: "선박 이동 패턴 통계 분석",
      category: "AIS",
      size: "2.1 GB",
      memo: "데이터 이용 승인 완료.",
      terms: true,
      pledge: true
    },
    {
      id: "APP-2026-0150",
      title: "고위험 선박 항적 데이터",
      organization: "외부 연구기관",
      applicant: "윤서준 연구원",
      date: "2026-05-12",
      risk: "high",
      status: "rejected",
      period: "2026-06-01 ~ 2026-12-31",
      purpose: "선박 항적 기반 위험도 분석",
      category: "AIS",
      size: "7.5 GB",
      memo: "민감정보 포함 및 사용 목적 불명확으로 반려.",
      terms: true,
      pledge: true
    }
  ];

  let currentFilter = "review";
  let selectedId = "APP-2026-0158";

  const tableBody = document.getElementById("reviewTableBody");

  const statusLabels = {
    pending: "대기",
    review: "검토중",
    approved: "승인",
    rejected: "반려"
  };

  const riskLabels = {
    low: "낮",
    medium: "중",
    high: "높"
  };

  const riskClasses = {
    low: "is-low",
    medium: "is-medium",
    high: "is-high"
  };

  const statusClasses = {
    pending: "is-pending",
    review: "is-review",
    approved: "is-approved",
    rejected: "is-rejected"
  };

  function getFilteredApplications() {
    if (currentFilter === "all") return applications;

    return applications.filter((item) => {
      return item.status === currentFilter;
    });
  }

  // 상단 건수 갱신
  function updateCounts() {
    const counts = {
      pending: applications.filter(x => x.status === "pending").length,
      review: applications.filter(x => x.status === "review").length,
      approved: applications.filter(x => x.status === "approved").length,
      rejected: applications.filter(x => x.status === "rejected").length,
      all: applications.length
    };

    const ids = {
      pending: ["reviewCountPending", "reviewTabPending"],
      review: ["reviewCountReview", "reviewTabReview"],
      approved: ["reviewCountApproved", "reviewTabApproved"],
      rejected: ["reviewCountRejected", "reviewTabRejected"],
      all: ["reviewCountAll", "reviewTabAll"]
    };

    Object.entries(ids).forEach(([key, elements]) => {
      document.getElementById(elements[0]).textContent =
        `${counts[key]}건`;

      document.getElementById(elements[1]).textContent =
        counts[key];
    });
  }

  // 목록 렌더링
  function renderTable() {
    const items = getFilteredApplications();

    document.getElementById("reviewListCount").textContent =
      items.length;

    if (!items.some(item => item.id === selectedId)) {
      selectedId = items[0]?.id || null;
    }

    tableBody.innerHTML = "";

    if (!items.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:25px;">
            해당 상태의 신청 내역이 없습니다.
          </td>
        </tr>
      `;
      renderDetail();
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("tr");

      row.classList.toggle(
        "is-selected",
        item.id === selectedId
      );

      // 예시 데이터는 내부 상수에서만 사용
      row.innerHTML = `
        <td class="review-table-id">${item.id}</td>
        <td title="${item.title}">${item.title}</td>
        <td title="${item.organization}">${item.organization}</td>
        <td>${item.applicant}</td>
        <td>${item.date}</td>
        <td>
          <span class="review-risk ${riskClasses[item.risk]}">
            ${riskLabels[item.risk]}
          </span>
        </td>
        <td>
          <span class="review-status ${statusClasses[item.status]}">
            ${statusLabels[item.status]}
          </span>
        </td>
      `;

      row.addEventListener("click", () => {
        selectedId = item.id;
        renderTable();
      });

      tableBody.appendChild(row);
    });

    renderDetail();
  }

  // 상세정보 렌더링
  function renderDetail() {
    const item = applications.find(x => x.id === selectedId);
    const panel = document.querySelector(".review-detail-panel");

    if (!item) {
      panel.hidden = true;
      return;
    }

    panel.hidden = false;

    document.getElementById("reviewDetailId").textContent = item.id;
    document.getElementById("reviewDetailTitle").textContent = item.title;

    document.getElementById("reviewDetailMeta").textContent =
      `${item.organization} · ${item.applicant} · 신청일 ${item.date}`;

    document.getElementById("reviewDetailPeriod").textContent =
      item.period;

    document.getElementById("reviewDetailPurpose").textContent =
      item.purpose;

    document.getElementById("reviewDetailCategory").textContent =
      item.category;

    document.getElementById("reviewDetailSize").textContent =
      item.size;

    document.getElementById("reviewDetailMemo").textContent =
      item.memo;

    const status = document.getElementById("reviewDetailStatus");
    status.textContent = statusLabels[item.status];
    status.className = `review-status ${statusClasses[item.status]}`;

    const risk = document.getElementById("reviewDetailRisk");
    risk.textContent = `위험 ${riskLabels[item.risk]}`;
    risk.className = `review-risk ${riskClasses[item.risk]}`;

    // 결재 단계
    const steps = document.querySelectorAll(".review-progress-step");
    const lines = document.querySelectorAll(".review-progress-line");

    const completedCount = {
      pending: 1,
      review: 3,
      approved: 5,
      rejected: 3
    }[item.status];

    steps.forEach((step, index) => {
      step.classList.toggle("is-done", index < completedCount);
      step.querySelector("span").textContent =
        index < completedCount ? "✓" : index + 1;
    });

    lines.forEach((line, index) => {
      line.classList.toggle("is-done", index < completedCount - 1);
    });

    const checks = document.querySelectorAll(".review-check-item");

    checks.forEach((check, index) => {
      const completed = index === 0 ? item.terms : item.pledge;

      check.style.opacity = completed ? "1" : "0.45";
    });
  }

  // 탭 전환
  document.querySelectorAll("[data-review-filter]").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentFilter = tab.dataset.reviewFilter;

      document.querySelectorAll("[data-review-filter]").forEach((button) => {
        button.classList.toggle(
          "is-active",
          button === tab
        );
      });

      renderTable();
    });
  });

  // 승인 등 버튼: 화면 데모용
  document.querySelectorAll("[data-review-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = applications.find(x => x.id === selectedId);
      if (!item) return;

      const action = button.dataset.reviewAction;

      if (action === "approve") {
        if (!confirm("선택한 신청서를 승인 처리할까요?")) return;
        item.status = "approved";
        item.memo = "사용 승인 처리되었습니다.";
      }

      if (action === "reject") {
        const reason = prompt("반려 사유를 입력해 주세요.");
        if (reason === null) return;
        if (!reason.trim()) {
          alert("반려 사유를 입력해 주세요.");
          return;
        }
        item.status = "rejected";
        item.memo = reason.trim();
      }

      if (action === "request") {
        const reason = prompt("보완 요청 내용을 입력해 주세요.");
        if (reason === null) return;
        if (!reason.trim()) {
          alert("보완 요청 내용을 입력해 주세요.");
          return;
        }
        item.status = "pending";
        item.memo = `보완 요청: ${reason.trim()}`;
      }

      if (action === "transfer") {
        alert("AI 허브 이관은 서버 연동 후 사용할 수 있습니다.");
        return;
      }

      updateCounts();
      renderTable();
    });
  });

  updateCounts();
  renderTable();
});


document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".system-page");
  if (!page) return;

  const users = [
    {
      id: "U-001",
      name: "어현상",
      rank: "경위",
      department: "본청 정보통신과",
      role: "data",
      login: "2026-05-19 09:12"
    },
    {
      id: "U-002",
      name: "김영수",
      rank: "사무관",
      department: "본청 정보통신과",
      role: "system",
      login: "2026-05-19 08:58"
    },
    {
      id: "U-003",
      name: "박정훈",
      rank: "경감",
      department: "경비국 단속과",
      role: "inspector",
      login: "2026-05-19 08:42"
    },
    {
      id: "U-004",
      name: "송현우",
      rank: "주무관",
      department: "본청 AI팀",
      role: "model",
      login: "2026-05-19 08:30"
    },
    {
      id: "U-005",
      name: "박덕진",
      rank: "교수",
      department: "외부 자문 (해양·수산)",
      role: "expert",
      login: "2026-05-19 07:55"
    },
    {
      id: "U-006",
      name: "정현우",
      rank: "차장",
      department: "데이터팀",
      role: "data",
      login: "2026-05-19 09:05"
    },
    {
      id: "U-007",
      name: "임성욱",
      rank: "부장",
      department: "PL",
      role: "inspector",
      login: "2026-05-19 08:10"
    }
  ];

  const roleLabels = {
    data: "데이터 관리자",
    system: "시스템 관리자",
    inspector: "검수자",
    model: "모델 운영자",
    expert: "전문가 검수"
  };

  const tableBody = document.getElementById("systemUserTableBody");
  const searchInput = document.getElementById("systemUserSearch");
  const modal = document.getElementById("systemUserModal");
  const form = document.getElementById("systemUserForm");

  let editingId = null;
  let lastFocusedElement = null;

  function renderUsers() {
    const keyword = searchInput.value.trim().toLowerCase();

    const filtered = users.filter(user => {
      const text = [
        user.id,
        user.name,
        user.rank,
        user.department,
        roleLabels[user.role]
      ].join(" ").toLowerCase();

      return text.includes(keyword);
    });

    document.getElementById("systemUserCount").textContent =
      filtered.length;

    tableBody.replaceChildren();

    filtered.forEach(user => {
      const row = document.createElement("tr");

      const cells = [
        user.id,
        "",
        user.department,
        "",
        user.login,
        ""
      ];

      cells.forEach((value, index) => {
        const cell = document.createElement("td");
        if (index === 0) {
          cell.className = "system-user-id";
        }
        if (index === 2) {
          cell.className = "system-department";
        }
        if (index === 4) {
          cell.className = "system-login-date";
        }
        if (index === 5) {
          cell.className = "system-center";
        }
        cell.textContent = value;
        row.appendChild(cell);
      });

      const nameCell = row.children[1];
      const nameWrap = document.createElement("div");
      nameWrap.className = "system-user-name";

      const avatar = document.createElement("span");
      avatar.className = "system-avatar";
      avatar.textContent = user.name.charAt(0);

      const name = document.createElement("strong");
      name.textContent = user.name;

      const rank = document.createElement("small");
      rank.textContent = user.rank;

      nameWrap.append(avatar, name, rank);
      nameCell.appendChild(nameWrap);

      const roleBadge = document.createElement("span");
      roleBadge.className =
        `system-role-badge is-${user.role}`;
      roleBadge.textContent = roleLabels[user.role];
      row.children[3].appendChild(roleBadge);

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "system-edit-button";
      editButton.textContent = "편집";
      editButton.addEventListener("click", () => openModal(user));

      row.children[5].appendChild(editButton);
      tableBody.appendChild(row);
    });

    if (!filtered.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.textContent = "검색 결과가 없습니다.";
      cell.style.textAlign = "center";
      cell.style.padding = "20px";
      row.appendChild(cell);
      tableBody.appendChild(row);
    }
  }

  function openModal(user = null) {
    lastFocusedElement = document.activeElement;
    editingId = user?.id ?? null;

    document.getElementById("systemModalTitle").textContent =
      user ? "사용자 편집" : "사용자 추가";

    document.getElementById("systemFormName").value =
      user?.name ?? "";

    document.getElementById("systemFormRank").value =
      user?.rank ?? "";

    document.getElementById("systemFormDepartment").value =
      user?.department ?? "";

    document.getElementById("systemFormRole").value =
      user?.role ?? "data";

    modal.hidden = false;
    document.getElementById("systemFormName").focus();
  }

  function closeModal() {
    modal.hidden = true;
    editingId = null;
    lastFocusedElement?.focus?.();
  }

  document.getElementById("systemAddUser")
    .addEventListener("click", () => openModal());

  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", closeModal);
  });

  document.getElementById("systemModalClose")
    .addEventListener("click", closeModal);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = {
      name: document.getElementById("systemFormName").value.trim(),
      rank: document.getElementById("systemFormRank").value.trim(),
      department: document.getElementById("systemFormDepartment").value.trim(),
      role: document.getElementById("systemFormRole").value
    };

    if (!data.name || !data.department) return;

    if (editingId) {
      const user = users.find(x => x.id === editingId);
      if (user) Object.assign(user, data);
    } else {
      const maxId = Math.max(
        0,
        ...users.map(x => Number(x.id.replace("U-", "")))
      );

      users.push({
        id: `U-${String(maxId + 1).padStart(3, "0")}`,
        ...data,
        login: "-"
      });
    }

    closeModal();
    renderUsers();
  });

  searchInput.addEventListener("input", renderUsers);

  // 탭 전환
  const panelIds = {
    users: "systemUsersPanel",
    roles: "systemRolesPanel",
    codes: "systemCodesPanel",
    logs: "systemLogsPanel"
  };

  document.querySelectorAll("[data-system-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.systemTab;

      document.querySelectorAll("[data-system-tab]").forEach(button => {
        const active = button === tab;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });

      Object.entries(panelIds).forEach(([key, id]) => {
        const panel = document.getElementById(id);
        panel.hidden = key !== selected;
      });
    });
  });

  // 권한 목록
  const roleBody = document.getElementById("systemRoleTableBody");

  Object.entries(roleLabels).forEach(([key, label]) => {
    const count = users.filter(user => user.role === key).length;
    const row = document.createElement("tr");

    [label, `${label} 역할`, `${count}명`, "조회"].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    roleBody.appendChild(row);
  });

  // 코드 관리 예시
  const codes = [
    ["ROLE", "사용자 역할", "시스템 사용자 역할 분류", "사용"],
    ["DATA_TYPE", "데이터 유형", "AI 데이터셋 유형 관리", "사용"],
    ["APP_STATUS", "신청 상태", "사용 신청 처리 상태 관리", "사용"]
  ];

  const codeBody = document.getElementById("systemCodeTableBody");

  codes.forEach(item => {
    const row = document.createElement("tr");
    item.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    codeBody.appendChild(row);
  });

  // 배치작업 · 로그 예시
  const logs = [
    ["JOB-001", "데이터 동기화", "2026-05-19 09:00", "완료"],
    ["JOB-002", "사용자 권한 점검", "2026-05-19 08:30", "완료"],
    ["JOB-003", "로그 정리", "2026-05-19 02:00", "완료"]
  ];

  const logBody = document.getElementById("systemLogTableBody");

  logs.forEach(item => {
    const row = document.createElement("tr");
    item.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    logBody.appendChild(row);
  });

  renderUsers();
});



