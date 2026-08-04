(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    heroImage: $('heroImage'),
    tripTitle: $('tripTitle'),
    tripSubtitle: $('tripSubtitle'),
    tripSummary: $('tripSummary'),
    tripDate: $('tripDate'),
    tripPriceLabel: $('tripPriceLabel'),
    tripPrice: $('tripPrice'),
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

    if (!nav) return;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 90;
      nav.classList.toggle('site-nav--hidden', scrollingDown);
      lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });
  };

  const escapeText = (value = '') => String(value)
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
  const renderRoomPackages = (rooms) => {
    const packages = rooms || [];
    if (!els.roomPackagesSection || !els.roomPackagesList) return;
    els.roomPackagesList.innerHTML = '';
    els.roomPackagesSection.classList.toggle('hidden', !packages.length);
    if (els.tripPriceLabel) els.tripPriceLabel.textContent = packages.length ? 'A partir de' : 'Valor';

    packages.forEach((room) => {
      const card = document.createElement('article');
      card.className = 'room-package-card';
      card.innerHTML = `
        <strong>${escapeText(room.titulo || room.title || '')}</strong>
        <span>${escapeText(room.valor || room.price || '')}</span>
        <small>${escapeText(room.descricao || room.description || '')}</small>
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

  const loadTravelData = () => fetch('./data.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });

  loadTravelData()
    .then((data) => {
      if (els.heroImage && data.hero) els.heroImage.style.backgroundImage = `url('${data.hero}')`;
      if (els.tripTitle) els.tripTitle.textContent = data.title || '';
      if (els.tripSubtitle) {
        els.tripSubtitle.textContent = data.subtitle || '';
        els.tripSubtitle.classList.toggle('hidden', !data.subtitle);
      }
      if (els.tripSummary) {
        const summary = data.summary || data.resumo || data.highlight || data.description || data.descricao || '';
        els.tripSummary.textContent = summary;
        els.tripSummary.classList.toggle('hidden', !summary);
      }
      if (els.tripDate) els.tripDate.textContent = data.date || '';
      if (els.tripPrice) els.tripPrice.textContent = data.price_full || '';
      if (els.tripType) els.tripType.textContent = data.type || '';
      if (els.returnInfoCard) els.returnInfoCard.classList.toggle('hidden', !data.returning);
      if (els.returnInfo) els.returnInfo.textContent = data.returning ? returnLabel(data.returning) : '';
      fillList(els.includedList, data.included, 'fa-check-circle');
      fillList(els.notIncludedList, data.not_included, 'fa-circle-xmark');
      fillList(els.boardingList, sortedBoarding(data.boarding || []), 'fa-clock');
      fillList(els.paymentList, data.payment, 'fa-credit-card');
      fillPlainList(els.policiesList, data.policies);
      fillList(els.infosList, data.infos, 'fa-circle-info');
      renderHighlight('');
      renderItinerary(data.itinerary);
      renderRoomPackages(data.quartos || data.rooms || []);
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      if (els.itinerary) els.itinerary.innerHTML = '<li class="load-error"><i class="fas fa-circle-info"></i><span>Não foi possível carregar as informações. Tente recarregar a página.</span></li>';
    });

  initNavigation();
}());
