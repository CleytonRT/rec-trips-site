// travel-info.js — RecTrips (página de Informações da Viagem)
// - Carrega ./data.json
// - Preenche todos os blocos (hero, resumo, listas, roteiro, políticas, infos)
// - Amarra os CTAs (botão do hero, resumo e o botão flutuante do WhatsApp)

(function () {
  // Utilitário rápido
  const $ = (id) => document.getElementById(id);

  // Mapeamento dos elementos da página
  const els = {
    heroImage: $('heroImage'),
    tripTitle: $('tripTitle'),
    tripSubtitle: $('tripSubtitle'),

    tripDate: $('tripDate'),
    tripPrice: $('tripPrice'),
    tripType: $('tripType'),
    tripHighlightBox: $('tripHighlightBox'),
    tripHighlight: $('tripHighlight'),

    returnInfo: $('returnInfo'),

    includedList: $('includedList'),
    notIncludedList: $('notIncludedList'),
    boardingList: $('boardingList'),
    paymentList: $('paymentList'),
    itinerary: $('itinerary'),
    policiesList: $('policiesList'),
    infosList: $('infosList'),

    ctaHero: $('ctaHero'),           // pode não existir (se removeu do HTML)
    ctaSummary: $('ctaSummary'),     // pode não existir
    floatingWhats: $('floatingWhats')// botão flutuante (ícone)
  };

  // Helpers de render
  const fillList = (ul, items) => {
    if (!ul) return;
    ul.innerHTML = '';
    (items || []).forEach(text => {
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

  // Aplica um href de WhatsApp nos CTAs que existirem
  const wireWhatsLinks = (url) => {
    if (!url) return;
    [els.ctaHero, els.ctaSummary, els.floatingWhats].forEach(a => {
      if (a) {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
  };

  // Carrega o JSON da viagem e renderiza
  fetch('./data.json', { cache: 'no-store' })
    .then(r => r.json())
    .then((data) => {
      // HERO
      if (els.heroImage && data.hero) {
        els.heroImage.style.backgroundImage = `url('${data.hero}')`;
      }
      if (els.tripTitle) els.tripTitle.textContent = data.title || '';
      if (els.tripSubtitle) els.tripSubtitle.textContent = data.subtitle || '';

      // Resumo
      if (els.tripDate)  els.tripDate.textContent  = data.date || '';
      if (els.tripPrice) els.tripPrice.textContent = data.price_full || '';
      if (els.tripType)  els.tripType.textContent  = data.type || '';

      // Embarque/retorno
      fillList(els.boardingList, data.boarding);
      if (els.returnInfo) els.returnInfo.textContent = data.returning || '';

      // Listas
      fillList(els.includedList,     data.included);
      fillList(els.notIncludedList,  data.not_included);
      fillList(els.paymentList,      data.payment);
      fillList(els.policiesList,     data.policies);
      fillList(els.infosList,        data.infos);

      // Roteiro (agora de fato renderizado)
      renderHighlight(data.highlight || data.subtitle || data.description || data.descricao);
      renderItinerary(data.itinerary);

      // CTAs (hero, resumo e botão flutuante)
      wireWhatsLinks(data.whatsapp_url);
    })
    .catch((err) => {
      console.error('Erro ao carregar data.json:', err);
      // Fallback visual simples (opcional)
      if (els.itinerary) {
        els.itinerary.innerHTML = '<p style="color:#991b1b">Não foi possível carregar as informações. Tente recarregar a página.</p>';
      }
    });
})();
