// Estado del booking multi-step en hero.
const bookingState = {
  pickup: '',
  destination: '',
  tripType: 'One Way',
  passengers: '1-4',
  when: 'Book Now',
  date: '',
  time: '',
  returnDate: '',
  returnTime: '',
  firstTripPromo: false
};

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('familyTaxiTheme');
const initialTheme = savedTheme || (prefersDark.matches ? 'night' : 'day');

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const langSwitch = document.getElementById('langSwitch');
const langButtons = Array.from(document.querySelectorAll('.lang-switch__btn'));
const pickupInput = document.getElementById('pickup');
const destinationInput = document.getElementById('destination');
const contactForm = document.getElementById('contactForm');
const bookingSteps = Array.from(document.querySelectorAll('.booking-step'));
const progressBar = document.getElementById('bookingProgress');
const startBookingButtons = Array.from(document.querySelectorAll('.js-start-booking'));
const promoBannerOffer = document.getElementById('promoBannerOffer');
const bookingPromoNotice = document.getElementById('bookingPromoNotice');
const scheduleFields = document.getElementById('scheduleFields');
const returnFields = document.getElementById('returnFields');
const tripDateInput = document.getElementById('tripDate');
const tripTimeInput = document.getElementById('tripTime');
const returnDateInput = document.getElementById('returnDate');
const returnTimeInput = document.getElementById('returnTime');
const confirmWhatsAppBtn = document.getElementById('confirmWhatsApp');
const summaryPromo = document.getElementById('summaryPromo');
const pageDescriptionMeta = document.querySelector('meta[name="description"]');

let currentStep = 1;
let currentLanguage = localStorage.getItem('familyTaxiLang') === 'en' ? 'en' : 'es';

const translations = {
  es: {
    pageTitle: 'Family Taxi | Reservas y traslados al aeropuerto',
    pageDescription: 'Reserva traslados a JFK y LaGuardia con Family Taxi. Hero tipo app + landing moderna con testimonios, contacto y WhatsApp.',
    langAria: 'Selector de idioma',
    themeAria: 'Cambiar modo de color',
    themeDay: 'Día',
    themeNight: 'Noche',
    heroEyebrow: 'Reserva de aeropuerto • New York',
    heroTitle: 'Siempre listos para llevarte donde necesites',
    heroText: 'Traslados premium a JFK y LaGuardia desde Bronx, Manhattan, Queens, Brooklyn y Staten Island. Atención real 24/7 y confirmación rápida por WhatsApp.',
    badge1: 'SUV 6 pasajeros',
    badge2: 'Silla para niños',
    badge3: 'Efectivo + Zelle',
    ctaOrder: 'ORDENAR AHORA',
    bookingProgressAria: 'Progreso de reserva',
    socialProofAria: 'Prueba social',
    socialTitle: '+200 viajes completados',
    socialSubtitle: 'Clientes satisfechos en NYC',
    step1Label: 'Paso 1',
    step1Title: '¿A dónde vas?',
    pickupLabel: 'Punto de recogida',
    pickupPlaceholder: 'Ej: Bronx, NY',
    destinationLabel: 'Destino',
    destinationPlaceholder: 'Ej: Aeropuerto JFK',
    step2Label: 'Paso 2',
    step2Title: 'Detalles del viaje',
    tripTypeCaption: 'Tipo de viaje',
    oneWay: 'Solo ida',
    roundTrip: 'Viaje redondo',
    passengersCaption: 'Pasajeros',
    step3Label: 'Paso 3',
    step3Title: '¿Cuándo?',
    bookNow: 'Ahora',
    schedule: 'Programar',
    dateLabel: 'Fecha',
    timeLabel: 'Hora',
    returnDateLabel: 'Fecha de regreso',
    returnTimeLabel: 'Hora de regreso',
    step4Label: 'Paso 4',
    step4Title: 'Confirmar',
    summaryOrigin: 'Origen',
    summaryDestination: 'Destino',
    summaryPassengers: 'Pasajeros',
    summaryType: 'Tipo',
    summaryDate: 'Fecha',
    summaryReturn: 'Regreso',
    buttonNext: 'SIGUIENTE',
    buttonBack: 'ATRÁS',
    confirmWhatsApp: 'Confirmar y enviar a WhatsApp',
    howTitle: 'Cómo funciona',
    howSubtitle: 'Reserva en minutos con un flujo claro, rápido y pensado para aeropuerto.',
    howRouteTitle: 'Elige tu ruta',
    howRouteText: 'Ingresa origen y destino para empezar tu solicitud de traslado de forma inmediata.',
    howDetailsTitle: 'Selecciona detalles del viaje',
    howDetailsText: 'Define ida o viaje redondo, cantidad de pasajeros y horario de reserva.',
    howConfirmTitle: 'Confirma por WhatsApp',
    howConfirmText: 'Revisa tu resumen y confirma en WhatsApp con el mensaje prellenado listo para enviar.',
    peopleLoveTitle: 'La gente nos recomienda',
    ratingReview: 'Calificación y reseña',
    testimonialQuote: 'Reservé mi traslado al aeropuerto a las 4:30 am y el conductor llegó 10 minutos antes. El auto estaba impecable y el servicio fue muy profesional. Me dio mucha tranquilidad saber que no perdería mi vuelo.',
    travelerRole: 'Viajera frecuente',
    bannerAlt: 'Banner de Family Taxi',
    faqsTitle: 'Preguntas frecuentes',
    faqsSubtitle: 'Preguntas principales sobre reservas y traslados al aeropuerto.',
    faq1Q: '¿Con cuánto tiempo de anticipación debo reservar?',
    faq1A: 'Recomendamos reservar con al menos 2 horas de anticipación. Para madrugadas o viajes especiales, mejor con 24 horas.',
    faq2Q: '¿Hacen traslados a JFK y LaGuardia?',
    faq2A: 'Sí, realizamos viajes diarios hacia y desde JFK y LaGuardia desde los cinco boroughs de New York.',
    faq3Q: '¿Puedo pedir viaje redondo?',
    faq3A: 'Sí. Puedes seleccionar Round Trip y programar ida y regreso con fecha y hora.',
    faq4Q: '¿Qué métodos de pago aceptan?',
    faq4A: 'Aceptamos efectivo y Zelle. Si necesitas otra opción, escríbenos por WhatsApp antes de confirmar.',
    faq5Q: '¿Tienen sillas para niños?',
    faq5A: 'Sí, contamos con sillas para niños bajo solicitud previa en la reserva.',
    mapTitle: 'Mapa de New York',
    contactTitle: 'Contáctanos',
    namePlaceholder: 'Nombre',
    emailPlaceholder: 'Correo',
    messagePlaceholder: 'Mensaje',
    submitButton: 'Enviar',
    footerTagline: 'Diseñado para traslados al aeropuerto en New York.',
    footerLinks: 'Enlaces',
    footerHome: 'Inicio',
    footerHow: 'Cómo funciona',
    footerTestimonials: 'Testimonios',
    footerFaqs: 'FAQs',
    footerContact: 'Contacto',
    footerContactHeading: 'Contacto',
    footerCoverage: 'New York City: Bronx, Manhattan, Queens, Brooklyn y Staten Island.',
    footerLegalHeading: 'Legal y redes',
    footerPrivacy: 'Política de privacidad',
    footerTerms: 'Términos y condiciones',
    footerRights: '©2026 Family Taxi. Todos los derechos reservados.',
    whatsappFloat: 'WhatsApp',
    whatsappAria: 'Abrir WhatsApp',
    noAplica: 'No aplica',
    promoLabel: 'Promo',
    promoFirstTrip: 'Primer viaje -15% #PRIMER_VIAJE',
    promoNone: 'Sin promo',
    promoBannerAria: 'Aplicar promoción de primer viaje y reservar',
    alerts: {
      fillPickupDestination: 'Completa origen y destino para continuar.',
      selectDateTime: 'Selecciona fecha y hora para continuar.',
      selectReturnDateTime: 'Selecciona fecha y hora de regreso para viaje redondo.',
      returnBeforeDeparture: 'La fecha y hora de regreso no puede ser anterior a la ida.',
      completeBeforeConfirm: 'Completa fecha y hora antes de confirmar.',
      completeReturnBeforeConfirm: 'Completa fecha y hora de regreso antes de confirmar.'
    },
    wa: {
      opening: 'Hola, quiero reservar un viaje.',
      origin: 'Origen',
      destination: 'Destino',
      passengers: 'Pasajeros',
      type: 'Tipo',
      departureDate: 'Fecha ida',
      returnDate: 'Fecha vuelta',
      name: 'Nombre',
      email: 'Email',
      message: 'Mensaje'
    }
  },
  en: {
    pageTitle: 'Family Taxi | Booking & Airport Rides',
    pageDescription: 'Book transfers to JFK and LaGuardia with Family Taxi. App-style hero + modern landing with testimonials, contact, and WhatsApp.',
    langAria: 'Language selector',
    themeAria: 'Toggle color theme',
    themeDay: 'Day',
    themeNight: 'Night',
    heroEyebrow: 'Airport Booking • New York',
    heroTitle: 'Always there to take you anywhere',
    heroText: 'Premium transfers to JFK and LaGuardia from Bronx, Manhattan, Queens, Brooklyn, and Staten Island. Real 24/7 support and fast WhatsApp confirmation.',
    badge1: 'SUV for 6 passengers',
    badge2: 'Child seat available',
    badge3: 'Cash + Zelle',
    ctaOrder: 'BOOK NOW',
    bookingProgressAria: 'Booking progress',
    socialProofAria: 'Social proof',
    socialTitle: '+200 completed rides',
    socialSubtitle: 'Happy customers in NYC',
    step1Label: 'Step 1',
    step1Title: 'Where to?',
    pickupLabel: 'Pick-up location',
    pickupPlaceholder: 'Ex: Bronx, NY',
    destinationLabel: 'Destination',
    destinationPlaceholder: 'Ex: JFK Airport',
    step2Label: 'Step 2',
    step2Title: 'Trip Details',
    tripTypeCaption: 'Trip type',
    oneWay: 'One Way',
    roundTrip: 'Round Trip',
    passengersCaption: 'Passengers',
    step3Label: 'Step 3',
    step3Title: 'When?',
    bookNow: 'Book Now',
    schedule: 'Schedule',
    dateLabel: 'Date',
    timeLabel: 'Time',
    returnDateLabel: 'Return Date',
    returnTimeLabel: 'Return Time',
    step4Label: 'Step 4',
    step4Title: 'Confirm',
    summaryOrigin: 'Origin',
    summaryDestination: 'Destination',
    summaryPassengers: 'Passengers',
    summaryType: 'Type',
    summaryDate: 'Date',
    summaryReturn: 'Return',
    buttonNext: 'NEXT',
    buttonBack: 'BACK',
    confirmWhatsApp: 'Confirm & Send to WhatsApp',
    howTitle: 'How It Works',
    howSubtitle: 'Book in minutes with a clear and fast airport-focused flow.',
    howRouteTitle: 'Choose Your Route',
    howRouteText: 'Enter pick-up and destination to start your transfer request right away.',
    howDetailsTitle: 'Select Trip Details',
    howDetailsText: 'Choose one-way or round trip, number of passengers, and booking time.',
    howConfirmTitle: 'Confirm via WhatsApp',
    howConfirmText: 'Review your summary and confirm on WhatsApp with a prefilled message ready to send.',
    peopleLoveTitle: 'People Love Us',
    ratingReview: 'Rating & Review',
    testimonialQuote: 'I booked my airport transfer at 4:30 am and the driver arrived 10 minutes early. The car was spotless and the service was very professional. It gave me peace of mind knowing I would not miss my flight.',
    travelerRole: 'Frequent Traveler',
    bannerAlt: 'Family Taxi banner',
    faqsTitle: 'FAQs',
    faqsSubtitle: 'Main questions about bookings and airport transfers.',
    faq1Q: 'How far in advance should I book?',
    faq1A: 'We recommend booking at least 2 hours in advance. For early-morning or special trips, 24 hours is best.',
    faq2Q: 'Do you provide rides to JFK and LaGuardia?',
    faq2A: 'Yes, we provide daily rides to and from JFK and LaGuardia from all five New York boroughs.',
    faq3Q: 'Can I book a round trip?',
    faq3A: 'Yes. You can select Round Trip and schedule both departure and return with date and time.',
    faq4Q: 'Which payment methods do you accept?',
    faq4A: 'We accept cash and Zelle. If you need another option, message us on WhatsApp before confirming.',
    faq5Q: 'Do you have child seats?',
    faq5A: 'Yes, child seats are available upon request during booking.',
    mapTitle: 'New York map',
    contactTitle: 'Contact Us',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    messagePlaceholder: 'Message',
    submitButton: 'Submit',
    footerTagline: 'Designed for airport transfers in New York.',
    footerLinks: 'Links',
    footerHome: 'Home',
    footerHow: 'How it works',
    footerTestimonials: 'Testimonials',
    footerFaqs: 'FAQs',
    footerContact: 'Contact',
    footerContactHeading: 'Contact',
    footerCoverage: 'New York City: Bronx, Manhattan, Queens, Brooklyn and Staten Island.',
    footerLegalHeading: 'Legal & Social',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms & Conditions',
    footerRights: '©2026 Family Taxi. All rights reserved.',
    whatsappFloat: 'WhatsApp',
    whatsappAria: 'Open WhatsApp',
    noAplica: 'Not applicable',
    promoLabel: 'Promo',
    promoFirstTrip: 'First trip -15% #PRIMER_VIAJE',
    promoNone: 'No promo',
    promoBannerAria: 'Apply first-trip promo and book',
    alerts: {
      fillPickupDestination: 'Complete pick-up and destination to continue.',
      selectDateTime: 'Select date and time to continue.',
      selectReturnDateTime: 'Select return date and time for round trip.',
      returnBeforeDeparture: 'Return date and time cannot be earlier than departure.',
      completeBeforeConfirm: 'Complete date and time before confirming.',
      completeReturnBeforeConfirm: 'Complete return date and time before confirming.'
    },
    wa: {
      opening: 'Hi, I want to book a ride.',
      origin: 'Origin',
      destination: 'Destination',
      passengers: 'Passengers',
      type: 'Type',
      departureDate: 'Departure date',
      returnDate: 'Return date',
      name: 'Name',
      email: 'Email',
      message: 'Message'
    }
  }
};

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setTextAt(selector, index, value) {
  const elements = document.querySelectorAll(selector);
  if (elements[index]) {
    elements[index].textContent = value;
  }
}

function setTextAll(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function getTripTypeLabel(value) {
  const t = translations[currentLanguage];
  return value === 'Round Trip' ? t.roundTrip : t.oneWay;
}

function getWhenLabel(value) {
  const t = translations[currentLanguage];
  return value === 'Schedule' ? t.schedule : t.bookNow;
}

function updateLanguageSwitchUI() {
  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function applyLanguage(lang) {
  currentLanguage = lang === 'en' ? 'en' : 'es';
  localStorage.setItem('familyTaxiLang', currentLanguage);

  const t = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = t.pageTitle;
  if (pageDescriptionMeta) {
    pageDescriptionMeta.setAttribute('content', t.pageDescription);
  }

  if (langSwitch) {
    langSwitch.setAttribute('aria-label', t.langAria);
  }
  themeToggle.setAttribute('aria-label', t.themeAria);
  setText('.theme-toggle__sun', t.themeDay);
  setText('.theme-toggle__moon', t.themeNight);

  setText('.eyebrow', t.heroEyebrow);
  setText('.hero-copy h1', t.heroTitle);
  setText('.hero-copy__text', t.heroText);
  setTextAt('.hero-copy__badges span', 0, t.badge1);
  setTextAt('.hero-copy__badges span', 1, t.badge2);
  setTextAt('.hero-copy__badges span', 2, t.badge3);
  setTextAll('.js-start-booking', t.ctaOrder);

  const bookingProgress = document.querySelector('.booking-progress');
  if (bookingProgress) {
    bookingProgress.setAttribute('aria-label', t.bookingProgressAria);
  }

  setText('.booking-step[data-step="1"] .booking-card__step', t.step1Label);
  setText('.booking-step[data-step="1"] h2', t.step1Title);
  setText('label[for="pickup"]', t.pickupLabel);
  pickupInput.setAttribute('placeholder', t.pickupPlaceholder);
  setText('label[for="destination"]', t.destinationLabel);
  destinationInput.setAttribute('placeholder', t.destinationPlaceholder);

  const socialProof = document.querySelector('.hero-social-proof');
  if (socialProof) {
    socialProof.setAttribute('aria-label', t.socialProofAria);
  }
  setText('.hero-social-proof__title', t.socialTitle);
  setText('.hero-social-proof__subtitle', t.socialSubtitle);

  setText('.booking-step[data-step="2"] .booking-card__step', t.step2Label);
  setText('.booking-step[data-step="2"] h2', t.step2Title);
  setTextAt('.booking-step[data-step="2"] .field-caption', 0, t.tripTypeCaption);
  setTextAt('.booking-step[data-step="2"] .field-caption', 1, t.passengersCaption);
  setText('[data-trip-type="One Way"]', t.oneWay);
  setText('[data-trip-type="Round Trip"]', t.roundTrip);

  setText('.booking-step[data-step="3"] .booking-card__step', t.step3Label);
  setText('.booking-step[data-step="3"] h2', t.step3Title);
  setText('[data-when="Book Now"]', t.bookNow);
  setText('[data-when="Schedule"]', t.schedule);
  setText('label[for="tripDate"]', t.dateLabel);
  setText('label[for="tripTime"]', t.timeLabel);
  setText('label[for="returnDate"]', t.returnDateLabel);
  setText('label[for="returnTime"]', t.returnTimeLabel);

  setText('.booking-step[data-step="4"] .booking-card__step', t.step4Label);
  setText('.booking-step[data-step="4"] h2', t.step4Title);
  setTextAt('.summary-list span', 0, t.summaryOrigin);
  setTextAt('.summary-list span', 1, t.summaryDestination);
  setTextAt('.summary-list span', 2, t.summaryPassengers);
  setTextAt('.summary-list span', 3, t.summaryType);
  setTextAt('.summary-list span', 4, t.summaryDate);
  setTextAt('.summary-list span', 5, t.summaryReturn);
  setText('#summaryPromoLabel', t.promoLabel);

  document.querySelectorAll('[data-action="next"]').forEach((button) => {
    button.textContent = t.buttonNext;
  });
  document.querySelectorAll('[data-action="back"]').forEach((button) => {
    button.textContent = t.buttonBack;
  });
  confirmWhatsAppBtn.textContent = t.confirmWhatsApp;

  setText('#how-it-works .how-header h2', t.howTitle);
  setText('#how-it-works .how-header p', t.howSubtitle);
  setTextAt('#how-it-works .how-content h3', 0, t.howRouteTitle);
  setTextAt('#how-it-works .how-content p', 0, t.howRouteText);
  setTextAt('#how-it-works .how-content h3', 1, t.howDetailsTitle);
  setTextAt('#how-it-works .how-content p', 1, t.howDetailsText);
  setTextAt('#how-it-works .how-content h3', 2, t.howConfirmTitle);
  setTextAt('#how-it-works .how-content p', 2, t.howConfirmText);

  setText('#testimonials .testimonials-copy h2', t.peopleLoveTitle);
  setText('#testimonials .testimonials-kicker', t.ratingReview);
  setText('#testimonials .testimonials-quote', t.testimonialQuote);
  setText('#testimonials .testimonials-author p', t.travelerRole);

  const promoImage = document.querySelector('.promo-banner img');
  if (promoImage) {
    promoImage.setAttribute('alt', t.bannerAlt);
  }
  if (promoBannerOffer) {
    promoBannerOffer.setAttribute('aria-label', t.promoBannerAria);
  }

  setText('#faqs .faq-header h2', t.faqsTitle);
  setText('#faqs .faq-header p', t.faqsSubtitle);
  setTextAt('#faqs .faq-item summary', 0, t.faq1Q);
  setTextAt('#faqs .faq-item p', 0, t.faq1A);
  setTextAt('#faqs .faq-item summary', 1, t.faq2Q);
  setTextAt('#faqs .faq-item p', 1, t.faq2A);
  setTextAt('#faqs .faq-item summary', 2, t.faq3Q);
  setTextAt('#faqs .faq-item p', 2, t.faq3A);
  setTextAt('#faqs .faq-item summary', 3, t.faq4Q);
  setTextAt('#faqs .faq-item p', 3, t.faq4A);
  setTextAt('#faqs .faq-item summary', 4, t.faq5Q);
  setTextAt('#faqs .faq-item p', 4, t.faq5A);

  const mapFrame = document.querySelector('.contact-card__map iframe');
  if (mapFrame) {
    mapFrame.setAttribute('title', t.mapTitle);
  }
  setText('#contact .contact-card__content h2', t.contactTitle);
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  if (nameInput) {
    nameInput.setAttribute('placeholder', t.namePlaceholder);
  }
  if (emailInput) {
    emailInput.setAttribute('placeholder', t.emailPlaceholder);
  }
  if (messageInput) {
    messageInput.setAttribute('placeholder', t.messagePlaceholder);
  }
  setText('#contact .contact-form .btn-primary', t.submitButton);

  setText('.footer-brand p', t.footerTagline);
  setTextAt('.footer-links h3', 0, t.footerLinks);
  setTextAt('.footer-links a', 0, t.footerHome);
  setTextAt('.footer-links a', 1, t.footerHow);
  setTextAt('.footer-links a', 2, t.footerTestimonials);
  setTextAt('.footer-links a', 3, t.footerFaqs);
  setTextAt('.footer-links a', 4, t.footerContact);
  setText('.footer-contact h3', t.footerContactHeading);
  setText('.footer-contact p', t.footerCoverage);
  setTextAt('.footer-links h3', 1, t.footerLegalHeading);
  setTextAt('.footer-links a', 5, t.footerPrivacy);
  setTextAt('.footer-links a', 6, t.footerTerms);
  setTextAt('.footer__bottom p', 0, t.footerRights);
  setTextAt('.footer__bottom p', 1, t.footerTagline);

  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.textContent = t.whatsappFloat;
    whatsappFloat.setAttribute('aria-label', t.whatsappAria);
  }

  if (bookingPromoNotice) {
    bookingPromoNotice.textContent = bookingState.firstTripPromo ? t.promoFirstTrip : t.promoNone;
  }

  renderStep();
  updateLanguageSwitchUI();
}

function renderPromoNotice() {
  if (!bookingPromoNotice) {
    return;
  }

  const t = translations[currentLanguage];
  bookingPromoNotice.textContent = bookingState.firstTripPromo ? t.promoFirstTrip : t.promoNone;
  bookingPromoNotice.classList.toggle('is-hidden', !bookingState.firstTripPromo);
}

function applyTheme(theme) {
  body.classList.remove('theme-day', 'theme-night');
  body.classList.add(theme === 'day' ? 'theme-day' : 'theme-night');
  localStorage.setItem('familyTaxiTheme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'day' ? 'true' : 'false');
}

applyTheme(initialTheme);

// Cambia entre day/night manualmente.
themeToggle.addEventListener('click', () => {
  const isDay = body.classList.contains('theme-day');
  applyTheme(isDay ? 'night' : 'day');
});

// Si no hay preferencia guardada, sigue cambios del sistema.
prefersDark.addEventListener('change', (event) => {
  if (!localStorage.getItem('familyTaxiTheme')) {
    applyTheme(event.matches ? 'night' : 'day');
  }
});

function updateProgress() {
  progressBar.style.width = `${(currentStep / 4) * 100}%`;
}

function isReturnBeforeDeparture() {
  if (!bookingState.date || !bookingState.time || !bookingState.returnDate || !bookingState.returnTime) {
    return false;
  }

  const departureDateTime = new Date(`${bookingState.date}T${bookingState.time}`);
  const returnDateTime = new Date(`${bookingState.returnDate}T${bookingState.returnTime}`);

  return returnDateTime < departureDateTime;
}

function updateScheduleVisibility() {
  const showSchedule = bookingState.when === 'Schedule';
  const showReturn = showSchedule && bookingState.tripType === 'Round Trip';

  scheduleFields.classList.toggle('is-hidden', !showSchedule);
  returnFields.classList.toggle('is-hidden', !showReturn);

  if (!showSchedule) {
    bookingState.date = '';
    bookingState.time = '';
    bookingState.returnDate = '';
    bookingState.returnTime = '';
    tripDateInput.value = '';
    tripTimeInput.value = '';
    returnDateInput.value = '';
    returnTimeInput.value = '';
  }

  if (showSchedule && bookingState.tripType !== 'Round Trip') {
    bookingState.returnDate = '';
    bookingState.returnTime = '';
    returnDateInput.value = '';
    returnTimeInput.value = '';
  }
}

function renderStep() {
  const t = translations[currentLanguage];
  bookingSteps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);
    step.classList.toggle('is-active', stepNumber === currentStep);
  });
  updateProgress();

  if (currentStep === 4) {
    document.getElementById('summaryPickup').textContent = bookingState.pickup || '-';
    document.getElementById('summaryDestination').textContent = bookingState.destination || '-';
    document.getElementById('summaryPassengers').textContent = bookingState.passengers;
    document.getElementById('summaryType').textContent = `${getTripTypeLabel(bookingState.tripType)} / ${getWhenLabel(bookingState.when)}`;
    document.getElementById('summaryDate').textContent = bookingState.when === 'Schedule'
      ? `${bookingState.date || '-'} ${bookingState.time || ''}`.trim()
      : t.bookNow;
    document.getElementById('summaryReturn').textContent =
      bookingState.when === 'Schedule' && bookingState.tripType === 'Round Trip'
        ? `${bookingState.returnDate || '-'} ${bookingState.returnTime || ''}`.trim()
        : t.noAplica;
    if (summaryPromo) {
      summaryPromo.textContent = bookingState.firstTripPromo ? t.promoFirstTrip : t.promoNone;
    }
  }
}

function emphasizeStepOne() {
  if (!pickupInput) {
    return;
  }

  pickupInput.classList.remove('is-step-cue');
  void pickupInput.offsetWidth;
  pickupInput.classList.add('is-step-cue');

  window.setTimeout(() => {
    pickupInput.classList.remove('is-step-cue');
  }, 900);
}

function guideToStepOne(event) {
  if (event) {
    event.preventDefault();
  }

  emphasizeStepOne();
}

function activateFirstTripPromo(event) {
  if (event) {
    event.preventDefault();
  }

  bookingState.firstTripPromo = true;
  renderPromoNotice();
  guideToStepOne();
}

function validateStep() {
  const t = translations[currentLanguage];

  if (currentStep === 1) {
    bookingState.pickup = pickupInput.value.trim();
    bookingState.destination = destinationInput.value.trim();

    if (!bookingState.pickup || !bookingState.destination) {
      alert(t.alerts.fillPickupDestination);
      return false;
    }
  }

  if (currentStep === 3 && bookingState.when === 'Schedule') {
    bookingState.date = tripDateInput.value;
    bookingState.time = tripTimeInput.value;

    if (!bookingState.date || !bookingState.time) {
      alert(t.alerts.selectDateTime);
      return false;
    }

    if (bookingState.tripType === 'Round Trip') {
      bookingState.returnDate = returnDateInput.value;
      bookingState.returnTime = returnTimeInput.value;

      if (!bookingState.returnDate || !bookingState.returnTime) {
        alert(t.alerts.selectReturnDateTime);
        return false;
      }

      if (isReturnBeforeDeparture()) {
        alert(t.alerts.returnBeforeDeparture);
        return false;
      }
    }
  }

  return true;
}

document.querySelectorAll('[data-action="next"]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!validateStep()) {
      return;
    }
    if (currentStep < 4) {
      currentStep += 1;
      renderStep();
    }
  });
});

document.querySelectorAll('[data-action="back"]').forEach((button) => {
  button.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep -= 1;
      renderStep();
    }
  });
});

function bindChipGroup(containerId, key, dataAttr) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.addEventListener('click', (event) => {
    const target = event.target.closest(`button[${dataAttr}]`);
    if (!target) {
      return;
    }

    container.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('is-selected'));
    target.classList.add('is-selected');

    if (key === 'tripType') {
      bookingState.tripType = target.dataset.tripType;
      updateScheduleVisibility();
    }
    if (key === 'passengers') {
      bookingState.passengers = target.dataset.passengers;
    }
    if (key === 'when') {
      bookingState.when = target.dataset.when;
      updateScheduleVisibility();
    }
  });
}

bindChipGroup('tripTypeOptions', 'tripType', 'data-trip-type');
bindChipGroup('passengerOptions', 'passengers', 'data-passengers');
bindChipGroup('whenOptions', 'when', 'data-when');

if (langSwitch) {
  langSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('.lang-switch__btn');
    if (!button) {
      return;
    }
    applyLanguage(button.dataset.lang);
  });
}

startBookingButtons.forEach((button) => {
  button.addEventListener('click', guideToStepOne);
});

if (promoBannerOffer) {
  promoBannerOffer.addEventListener('click', activateFirstTripPromo);
}

pickupInput.addEventListener('focus', emphasizeStepOne);

tripDateInput.addEventListener('change', () => {
  bookingState.date = tripDateInput.value;
  returnDateInput.min = bookingState.date || '';
});

tripTimeInput.addEventListener('change', () => {
  bookingState.time = tripTimeInput.value;
});

returnDateInput.addEventListener('change', () => {
  bookingState.returnDate = returnDateInput.value;
});

returnTimeInput.addEventListener('change', () => {
  bookingState.returnTime = returnTimeInput.value;
});

confirmWhatsAppBtn.addEventListener('click', () => {
  const t = translations[currentLanguage];

  if (bookingState.when === 'Schedule' && (!bookingState.date || !bookingState.time)) {
    alert(t.alerts.completeBeforeConfirm);
    return;
  }

  if (
    bookingState.when === 'Schedule' &&
    bookingState.tripType === 'Round Trip' &&
    (!bookingState.returnDate || !bookingState.returnTime)
  ) {
    alert(t.alerts.completeReturnBeforeConfirm);
    return;
  }

  if (
    bookingState.when === 'Schedule' &&
    bookingState.tripType === 'Round Trip' &&
    isReturnBeforeDeparture()
  ) {
    alert(t.alerts.returnBeforeDeparture);
    return;
  }

  const text = [
    t.wa.opening,
    `${t.wa.origin}: ${bookingState.pickup}`,
    `${t.wa.destination}: ${bookingState.destination}`,
    `${t.wa.passengers}: ${bookingState.passengers}`,
    `${t.wa.type}: ${getTripTypeLabel(bookingState.tripType)} - ${getWhenLabel(bookingState.when)}`,
    `${t.wa.departureDate}: ${bookingState.when === 'Schedule' ? `${bookingState.date} ${bookingState.time}` : t.bookNow}`,
    `${t.wa.returnDate}: ${bookingState.when === 'Schedule' && bookingState.tripType === 'Round Trip' ? `${bookingState.returnDate} ${bookingState.returnTime}` : t.noAplica}`,
    `${t.promoLabel}: ${bookingState.firstTripPromo ? t.promoFirstTrip : t.promoNone}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/13475935721?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

updateScheduleVisibility();
applyLanguage(currentLanguage);
renderPromoNotice();

// Formulario de contacto: envía mensaje a WhatsApp con datos del booking + formulario.
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const t = translations[currentLanguage];

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const text = [
    t.wa.opening,
    `${t.wa.origin}: ${bookingState.pickup || '-'}`,
    `${t.wa.destination}: ${bookingState.destination || '-'}`,
    `${t.wa.name}: ${name || '-'}`,
    `${t.wa.email}: ${email || '-'}`,
    `${t.wa.message}: ${message || '-'}`,
    `${t.promoLabel}: ${bookingState.firstTripPromo ? t.promoFirstTrip : t.promoNone}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/13475935721?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

// Animación suave de aparición al hacer scroll.
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const observer = new IntersectionObserver(
  (entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => observer.observe(element));

// Movimiento orgánico en testimonios: cada avatar reacciona distinto al cursor.
const testimonialsVisual = document.querySelector('.testimonials-visual');
const testimonialAvatars = Array.from(document.querySelectorAll('.testimonials-visual .avatar'));

if (testimonialsVisual && testimonialAvatars.length > 0) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    testimonialAvatars.forEach((avatar) => {
      avatar.style.setProperty('--parallax-x', '0px');
      avatar.style.setProperty('--parallax-y', '0px');
    });
  } else {
    const influenceRadius = 220;
    const maxPush = 22;
    const globalDrift = 4;
    const avatarStates = testimonialAvatars.map((avatar, index) => ({
      avatar,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      stiffness: 0.08 + index * 0.007,
      damping: 0.78 + (index % 3) * 0.04,
      jitterPhase: Math.random() * Math.PI * 2,
      jitterSpeed: 0.001 + Math.random() * 0.0015,
      pushStrength: 0.75 + Math.random() * 0.55
    }));

    let pointer = null;
    let rafId = null;

    function scheduleFrame() {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateAvatars);
      }
    }

    function updateAvatars(timestamp) {
      rafId = null;
      const rect = testimonialsVisual.getBoundingClientRect();
      let hasMotion = false;

      avatarStates.forEach((state, index) => {
        const avatarRect = state.avatar.getBoundingClientRect();
        const centerX = avatarRect.left + avatarRect.width / 2;
        const centerY = avatarRect.top + avatarRect.height / 2;

        const driftX = Math.sin(timestamp * state.jitterSpeed + state.jitterPhase + index) * globalDrift;
        const driftY = Math.cos(timestamp * state.jitterSpeed * 0.86 + state.jitterPhase) * (globalDrift * 0.8);

        state.targetX = driftX;
        state.targetY = driftY;

        if (pointer) {
          const dx = pointer.x - centerX;
          const dy = pointer.y - centerY;
          const distance = Math.hypot(dx, dy) || 1;
          const influence = Math.max(0, 1 - distance / influenceRadius);

          if (influence > 0) {
            const repel = influence * maxPush * state.pushStrength;
            state.targetX += (-dx / distance) * repel;
            state.targetY += (-dy / distance) * repel;
          }
        }

        state.vx += (state.targetX - state.x) * state.stiffness;
        state.vy += (state.targetY - state.y) * state.stiffness;
        state.vx *= state.damping;
        state.vy *= state.damping;
        state.x += state.vx;
        state.y += state.vy;

        state.avatar.style.setProperty('--parallax-x', `${state.x.toFixed(2)}px`);
        state.avatar.style.setProperty('--parallax-y', `${state.y.toFixed(2)}px`);

        if (
          Math.abs(state.x) > 0.08 ||
          Math.abs(state.y) > 0.08 ||
          Math.abs(state.vx) > 0.08 ||
          Math.abs(state.vy) > 0.08 ||
          pointer
        ) {
          hasMotion = true;
        }
      });

      if (hasMotion && rect.width > 0 && rect.height > 0) {
        scheduleFrame();
      }
    }

    testimonialsVisual.addEventListener('pointermove', (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      scheduleFrame();
    });

    testimonialsVisual.addEventListener('pointerleave', () => {
      pointer = null;
      scheduleFrame();
    });

    scheduleFrame();
  }
}