(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    heroImage: $('heroImage'),
    tripDate: $('tripDate'),
    tripPriceLabel: $('tripPriceLabel'),
    tripPrice: $('tripPrice'),
    tripType: $('tripType'),
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
      if (els.tripDate) els.tripDate.textContent = data.date || '';
      if (els.tripPrice) els.tripPrice.textContent = data.price_full || '';
      if (els.tripType) els.tripType.textContent = data.type || '';
      if (els.returnInfo) els.returnInfo.textContent = data.returning || '';
      fillList(els.includedList, data.included, 'fa-check-circle');
      fillList(els.notIncludedList, data.not_included, 'fa-circle-xmark');
      fillList(els.boardingList, [...(data.boarding || []), data.returning].filter(Boolean), 'fa-clock');
      fillList(els.paymentList, data.payment, 'fa-credit-card');
      fillPlainList(els.policiesList, data.policies);
      fillList(els.infosList, data.infos, 'fa-circle-info');
      renderItinerary(data.itinerary);
      renderRoomPackages(data.quartos || data.rooms || []);
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      if (els.itinerary) els.itinerary.innerHTML = '<li class="load-error"><i class="fas fa-circle-info"></i><span>Não foi possível carregar as informações. Tente recarregar a página.</span></li>';
    });
}());
