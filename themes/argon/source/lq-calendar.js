(function () {
  const WEEKDAY_LABELS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  function padValue(value) {
    return String(value).padStart(2, '0');
  }

  function formatIsoDate(date) {
    return `${date.getFullYear()}-${padValue(date.getMonth() + 1)}-${padValue(date.getDate())}`;
  }

  function getSolarForDate(date) {
    return window.Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function joinDisplay(parts) {
    return parts.filter(Boolean).join(' · ');
  }

  function buildCalendarCellLabel(lunar) {
    const festivals = []
      .concat(lunar.getFestivals ? lunar.getFestivals() : [])
      .concat(lunar.getOtherFestivals ? lunar.getOtherFestivals() : []);
    const term = lunar.getJieQi ? lunar.getJieQi() : '';

    if (festivals.length > 0) {
      return festivals[0];
    }
    if (term) {
      return term;
    }
    return lunar.getDayInChinese();
  }

  function formatCalendarDetail(date) {
    const solar = getSolarForDate(date);
    const lunar = solar.getLunar();
    const festivals = []
      .concat(lunar.getFestivals ? lunar.getFestivals() : [])
      .concat(lunar.getOtherFestivals ? lunar.getOtherFestivals() : []);
    const yi = lunar.getDayYi ? lunar.getDayYi() : [];
    const ji = lunar.getDayJi ? lunar.getDayJi() : [];

    return {
      iso: formatIsoDate(date),
      fullDate: `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`,
      lunarText: joinDisplay([
        `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
        lunar.getYearShengXiao ? lunar.getYearShengXiao() : '',
      ]),
      weekday: WEEKDAY_LABELS[(date.getDay() + 6) % 7],
      term: lunar.getJieQi ? lunar.getJieQi() : '',
      festival: festivals.join(' / '),
      yi: yi.length ? yi.join(' ') : '无',
      ji: ji.length ? ji.join(' ') : '无',
      cellLabel: buildCalendarCellLabel(lunar),
    };
  }

  function setDetailRow(root, key, value) {
    const row = root.querySelector(`[data-calendar-row="${key}"]`);
    const field = root.querySelector(`[data-calendar-detail-${key}]`);
    if (!row || !field) {
      return;
    }
    if (!value) {
      row.hidden = true;
      field.textContent = '';
      return;
    }
    row.hidden = false;
    field.textContent = value;
  }

  function updateCalendarDetail(root, state, date) {
    const detail = formatCalendarDetail(date);
    state.selectedIso = detail.iso;

    root.querySelector('[data-calendar-detail-date]')?.replaceChildren(document.createTextNode(detail.fullDate));
    root.querySelector('[data-calendar-detail-lunar]')?.replaceChildren(document.createTextNode(detail.lunarText));
    root.querySelector('[data-calendar-detail-weekday]')?.replaceChildren(document.createTextNode(detail.weekday));
    setDetailRow(root, 'term', detail.term);
    setDetailRow(root, 'festival', detail.festival);
    root.querySelector('[data-calendar-detail-yi]')?.replaceChildren(document.createTextNode(detail.yi));
    root.querySelector('[data-calendar-detail-ji]')?.replaceChildren(document.createTextNode(detail.ji));
  }

  function renderCalendarMonth(root, state) {
    const grid = root.querySelector('[data-calendar-grid]');
    const label = root.querySelector('[data-calendar-month-label]');
    if (!grid || !label) {
      return;
    }

    grid.innerHTML = '';
    label.textContent = `${state.viewYear} 年 ${state.viewMonth + 1} 月`;

    const daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
    const todayIso = formatIsoDate(new Date());

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(state.viewYear, state.viewMonth, day);
      const detail = formatCalendarDetail(currentDate);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lq-calendar__cell';
      button.dataset.calendarDate = detail.iso;
      button.innerHTML = `
        <span class="lq-calendar__solar">${day}</span>
        <span class="lq-calendar__meta">${detail.cellLabel}</span>
      `;

      if (detail.iso === todayIso) {
        button.classList.add('is-today');
      }
      if (detail.iso === state.selectedIso) {
        button.classList.add('is-selected');
      }

      button.addEventListener('click', () => {
        state.selectedIso = detail.iso;
        updateCalendarDetail(root, state, currentDate);
        renderCalendarMonth(root, state);
      });

      grid.appendChild(button);
    }
  }

  function shiftCalendarMonth(state, offset) {
    const next = new Date(state.viewYear, state.viewMonth + offset, 1);
    const today = new Date();
    const isCurrentMonth = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    const selectedDate = isCurrentMonth ? today : next;
    state.viewYear = next.getFullYear();
    state.viewMonth = next.getMonth();
    state.selectedIso = formatIsoDate(selectedDate);
    return selectedDate;
  }

  function mountCalendar(root) {
    if (!root || root.dataset.calendarBound === 'true') {
      return;
    }
    if (!window.Solar || typeof window.Solar.fromYmd !== 'function') {
      return;
    }

    root.dataset.calendarBound = 'true';

    const today = new Date();
    const state = {
      viewYear: today.getFullYear(),
      viewMonth: today.getMonth(),
      selectedIso: formatIsoDate(today),
    };

    root.querySelectorAll('[data-calendar-nav]').forEach(button => {
      button.addEventListener('click', () => {
        const offset = button.dataset.calendarNav === 'prev' ? -1 : 1;
        const nextDate = shiftCalendarMonth(state, offset);
        updateCalendarDetail(root, state, nextDate);
        renderCalendarMonth(root, state);
      });
    });

    updateCalendarDetail(root, state, today);
    renderCalendarMonth(root, state);
  }

  function initLqCalendar() {
    document.querySelectorAll('[data-lq-calendar]').forEach(mountCalendar);
  }

  window.initLqCalendar = initLqCalendar;
})();
