(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    heroImage: $('heroImage'),
    tripTitle: $('tripTitle'),
    tripSubtitle: $('tripSubtitle'),
    tripSummary: $('tripSummary'),
    tripDate: $('tripDate'),
    tripType: $('tripType'),
    tripHighlightBox: $('tripHighlightBox'),
    tripHighlight: $('tripHighlight'),
    returnInfoCard: $('returnInfoCard'),
    returnInfo: $('returnInfo'),
    includedList: $('includedList'),
    notIncludedList: $('notIncludedList'),
    boardingList: $('boardingList'),
    paymentList: $('paymentList'),
    itinerary: $('itinerary'),
    policiesList: $('policiesList'),
    infosList: $('infosList'),
    roomPackagesSection: $('roomPackagesSection'),
    roomPackagesList: $('roomPackagesList'),
    ctaHero: $('ctaHero'),
    ctaSummary: $('ctaSummary'),
    floatingWhats: $('floatingWhats')
  };

  const initNavigation = () => {
    const nav = document.getElementById('siteNav');
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    let lastScrollY = window.scrollY;

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }
  };

  const repairText = (value = '') => {
    const text = String(value || '');
    if (!/[ÃÂâ€]/.test(text)) return text;
    try {
      return decodeURIComponent(escape(text));
    } catch (error) {
      return text;
    }
  };

  const escapeText = (value = '') => repairText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const fillList = (ul, items, icon = 'fa-circle-info') => {
    if (!ul) return;
    ul.innerHTML = '';
    (items || []).forEach((text) => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas ${icon}"></i><span>${escapeText(text)}</span>`;
      ul.appendChild(li);
    });
  };

  const fillPlainList = (ul, items) => {
    if (!ul) return;
    ul.innerHTML = '';
    (items || []).forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
  };


  const boardingTimeValue = (text = '') => {
    const match = String(text || '').match(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?:\D|$)/);
    if (!match) return Number.MAX_SAFE_INTEGER;
    return (Number(match[1]) * 60) + Number(match[2]);
  };

  const sortedBoarding = (items = []) => [...items].sort((a, b) => {
    const timeA = boardingTimeValue(a);
    const timeB = boardingTimeValue(b);
    if (timeA !== timeB) return timeA - timeB;
    return String(a || '').localeCompare(String(b || ''), 'pt-BR');
  });

  const returnLabel = (value = '') => String(value || '')
    .replace(/^retorno\s+previsto\s*(?:às|as)?\s*/i, '')
    .trim();

  const renderItinerary = (steps) => {
    if (!els.itinerary) return;
    els.itinerary.innerHTML = '';
    (steps || []).forEach((item) => {
      const detail = typeof item === 'string' ? item : (item.detail || item.step || '');
      if (!detail) return;
      const row = document.createElement('li');
      row.innerHTML = `<i class="fas fa-location-dot"></i><span>${escapeText(detail)}</span>`;
      els.itinerary.appendChild(row);
    });
  };

  const renderHighlight = (text = '') => {
    const value = String(text || '').trim();
    if (!els.tripHighlightBox || !els.tripHighlight) return;
    els.tripHighlightBox.classList.toggle('hidden', !value);
    els.tripHighlight.textContent = value;
  };

  const priceNumberFromText = (value = '') => {
    const clean = String(value || '')
      .replace(/[^\d,.-]/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');
    const amount = Number(clean);
    return Number.isFinite(amount) ? amount : 0;
  };

  const formatMoney = (value) => Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const formatPercent = (value) => Number(value || 0).toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  });

  const normalizePackage = (room = {}, fallbackPrice = '') => {
    const title = room.titulo || room.title || room.name || 'Pacote';
    const people = Math.max(1, Number(room.pessoas || room.people || 1));
    const discountValue = Number(String(room.desconto ?? room.discountPercent ?? 0).replace(',', '.'));
    const discount = Math.min(100, Math.max(0, Number.isFinite(discountValue) ? discountValue : 0));
    const price = room.valor || room.price || fallbackPrice || '';
    const basePerPerson = Number(room.basePricePerPerson || 0) || priceNumberFromText(price);
    const totalWithoutDiscount = Number(room.totalWithoutDiscount || 0) || (basePerPerson * people);
    const totalWithDiscount = Number(room.totalWithDiscount || 0) || (totalWithoutDiscount * (1 - (discount / 100)));
    const perPerson = Number(room.perPersonWithDiscount || 0) || (people ? totalWithDiscount / people : totalWithDiscount);

    return {
      title,
      people,
      discount,
      price,
      description: room.descricao || room.description || '',
      totalWithoutDiscount,
      totalWithDiscount,
      perPerson
    };
  };

  const parseRoomPackages = (value = '') => String(value || '')
    .split('\n')
    .map((line) => {
      const [rawTitle, rawPrice = '', rawPeople = '', rawDiscount = '', ...rawDescription] = line.split('|');
      const title = rawTitle.trim();
      if (!title) return null;
      const peopleText = rawPeople.trim();
      const hasNumericPeople = /^\d+$/.test(peopleText);
      const people = hasNumericPeople ? Number(peopleText) || 1 : 1;
      const discount = hasNumericPeople ? Number(String(rawDiscount || '').replace(/[^\d,.]+/g, '').replace(',', '.')) || 0 : 0;
      const description = hasNumericPeople
        ? rawDescription.join('|').trim()
        : [rawPeople, rawDiscount, ...rawDescription].join('|').trim();
      return {
        titulo: title,
        valor: rawPrice.trim(),
        pessoas: people,
        desconto: discount,
        descricao: description
      };
    })
    .filter(Boolean);

  const roomPackageList = (rooms) => {
    if (Array.isArray(rooms)) return rooms;
    if (typeof rooms === 'string') return parseRoomPackages(rooms);
    return [];
  };

  const renderRoomPackages = (rooms, fallbackPrice = '') => {
    const packages = roomPackageList(rooms);
    if (!els.roomPackagesSection || !els.roomPackagesList) return;
    els.roomPackagesList.innerHTML = '';
    els.roomPackagesSection.classList.toggle('hidden', !packages.length);

    packages.forEach((room) => {
      const pack = normalizePackage(room, fallbackPrice);
      const card = document.createElement('article');
      card.className = `room-package-card${pack.discount ? ' room-package-card--discount' : ''}`;
      card.innerHTML = `
        ${pack.discount ? `<em>${escapeText(`${formatPercent(pack.discount)}% OFF`)}</em>` : ''}
        <strong>${escapeText(pack.title)}</strong>
        <span>${escapeText(formatMoney(pack.perPerson))}</span>
        <small>por pessoa</small>
        <p>${escapeText(pack.people > 1 ? `${pack.people} pessoas | total ${formatMoney(pack.totalWithDiscount)}` : (pack.price || 'Valor individual'))}</p>
        ${pack.discount ? `<del>${escapeText(formatMoney(pack.totalWithoutDiscount))} no total sem desconto</del>` : ''}
        ${pack.description ? `<small>${escapeText(pack.description)}</small>` : ''}
      `;
      els.roomPackagesList.appendChild(card);
    });
  };

  const wireWhatsLinks = (url) => {
    if (!url) return;
    [els.ctaHero, els.ctaSummary, els.floatingWhats].forEach((link) => {
      if (!link) return;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
    });
  };

  const parseAvailabilityDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const tripIsPubliclyAvailable = (data = {}) => {
    const lifecycle = data.lifecycle || {};
    const status = String(data.status || lifecycle.status || '').toLowerCase();
    if (data.registrationEnabled === false || lifecycle.registrationEnabled === false) return false;
    if (lifecycle.finalizedAt || lifecycle.admFinalizedAt || data.finalizedAt) return false;
    if (status.includes('finaliz') || status.includes('cancel') || status.includes('arquiv')) return false;
    const expiresAt = parseAvailabilityDate(lifecycle.cardExpiresAt || data.cardExpiresAt);
    return !expiresAt || expiresAt > new Date();
  };

  const redirectUnavailableTrip = () => {
    window.location.replace('/');
  };

  const loadTravelData = () => fetch('./data.json', { cache: 'default' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });

  loadTravelData()
    .then((data) => {
      if (!tripIsPubliclyAvailable(data)) {
        redirectUnavailableTrip();
        return;
      }
      if (els.heroImage && data.hero) els.heroImage.style.backgroundImage = `url('${data.hero}')`;
      if (els.tripTitle) els.tripTitle.textContent = repairText(data.title || '');
      if (els.tripSubtitle) {
        els.tripSubtitle.textContent = repairText(data.subtitle || '');
        els.tripSubtitle.classList.toggle('hidden', !data.subtitle);
      }
      if (els.tripSummary) {
        const summary = data.summary || data.resumo || data.highlight || data.description || data.descricao || '';
        els.tripSummary.textContent = repairText(summary);
        els.tripSummary.classList.toggle('hidden', !summary);
      }
      if (els.tripDate) els.tripDate.textContent = repairText(data.date || '');
      if (els.tripType) els.tripType.textContent = repairText(data.type || '');
      if (els.returnInfoCard) els.returnInfoCard.classList.toggle('hidden', !data.returning);
      if (els.returnInfo) els.returnInfo.textContent = data.returning ? repairText(returnLabel(data.returning)) : '';
      fillList(els.includedList, data.included, 'fa-check-circle');
      fillList(els.notIncludedList, data.not_included, 'fa-circle-xmark');
      fillList(els.boardingList, sortedBoarding(data.boarding || []), 'fa-clock');
      fillList(els.paymentList, data.payment, 'fa-credit-card');
      fillPlainList(els.policiesList, data.policies);
      fillList(els.infosList, data.infos, 'fa-circle-info');
      renderHighlight('');
      renderItinerary(data.itinerary);
      renderRoomPackages(data.quartos || data.rooms || [], data.price_full || '');
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      if (els.itinerary) els.itinerary.innerHTML = '<li class="load-error"><i class="fas fa-circle-info"></i><span>Não foi possível carregar as informações. Tente recarregar a página.</span></li>';
    });

  initNavigation();
}());
