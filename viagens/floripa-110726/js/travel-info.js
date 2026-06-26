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

  const fillList = (ul, items) => {
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
    (steps || []).forEach((item, index) => {
      const step = typeof item === 'string' ? `Item ${index + 1}` : item.step;
      const detail = typeof item === 'string' ? item : item.detail;
      const row = document.createElement('div');
      row.className = 'step';
      row.innerHTML = `<strong>${step || `Item ${index + 1}`}</strong><p>${detail || ''}</p>`;
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
      fillList(els.boardingList, data.boarding);
      fillList(els.paymentList, data.payment);
      fillList(els.policiesList, data.policies);
      fillList(els.infosList, data.infos);
      renderItinerary(data.itinerary);
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      if (els.itinerary) els.itinerary.innerHTML = '<p class="load-error">Nao foi possivel carregar as informacoes. Tente recarregar a pagina.</p>';
    });
}());