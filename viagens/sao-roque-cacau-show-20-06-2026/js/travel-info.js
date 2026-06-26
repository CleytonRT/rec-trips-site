(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    heroImage: $('heroImage'),
    tripDate: $('tripDate'),
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
    ctaHero: $('ctaHero'),
    ctaSummary: $('ctaSummary'),
    floatingWhats: $('floatingWhats')
  };

  const escapeText = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const fillList = (ul, items) => {
    if (!ul) return;
    ul.innerHTML = '';
    (items || []).forEach((text) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${escapeText(text)}</span>`;
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
      row.innerHTML = `<span>${escapeText(detail)}</span>`;
      els.itinerary.appendChild(row);
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
      fillList(els.includedList, data.included);
      fillList(els.notIncludedList, data.not_included);
      fillList(els.boardingList, [...(data.boarding || []), data.returning].filter(Boolean));
      fillList(els.paymentList, data.payment);
      fillList(els.policiesList, data.policies);
      fillList(els.infosList, data.infos);
      renderItinerary(data.itinerary);
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      if (els.itinerary) els.itinerary.innerHTML = '<li class="load-error"><span>Não foi possível carregar as informações. Tente recarregar a página.</span></li>';
    });
}());
