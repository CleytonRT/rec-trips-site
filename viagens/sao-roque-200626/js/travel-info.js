(function () {
  const $ = (id) => document.getElementById(id);
  const travelJsonURL = 'https://script.google.com/macros/s/AKfycbzu2RBzyKmDmy4DqEI_S2AOOdBz9neX_3BPnu5Cw27-RL0eLMdZKdocDedoPZxNkLdl/exec';
  const tripId = 'sao-roque-200626';

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
    (steps || []).forEach(({ step, detail }) => {
      const row = document.createElement('div');
      row.className = 'step';
      row.innerHTML = `<strong>${step}</strong><p>${detail}</p>`;
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

  const loadTravelJsonp = () => new Promise((resolve, reject) => {
    const callbackName = `recTripsTrip_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const cleanup = () => {
      script.remove();
      delete window[callbackName];
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('Tempo esgotado carregando viagem'));
    }, 7000);

    window[callbackName] = (payload) => {
      window.clearTimeout(timer);
      cleanup();
      resolve(payload);
    };

    const url = new URL(travelJsonURL);
    url.searchParams.set('action', 'site');
    url.searchParams.set('id', tripId);
    url.searchParams.set('callback', callbackName);
    script.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('Falha carregando viagem'));
    };
    script.src = url.toString();
    document.head.appendChild(script);
  });

  const loadTravelData = () => loadTravelJsonp()
    .then((data) => {
      if (!data || data.error) throw new Error('JSON remoto invalido');
      return data;
    })
    .catch(() => fetch('./data.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }));

  loadTravelData()
    .then((data) => {
      if (els.heroImage && data.hero) {
        els.heroImage.style.backgroundImage = `url('${data.hero}')`;
      }

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
      if (els.itinerary) {
        els.itinerary.innerHTML = '<p class="load-error">Não foi possível carregar as informações. Tente recarregar a página.</p>';
      }
    });
})();
