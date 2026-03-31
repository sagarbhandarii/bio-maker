const i18n = {
  en: {
    pageTitle: "Biodata",
    subtitle: "Marriage Profile",
    name: "Full Name",
    dob: "Date of Birth",
    birthTime: "Birth Time",
    birthPlace: "Birth Place",
    height: "Height",
    education: "Education",
    occupation: "Occupation",
    income: "Annual Income",
    religion: "Religion",
    caste: "Caste",
    subCaste: "Sub-caste",
    address: "Address",
    contact: "Contact Number",
    email: "Email",
    expectations: "Expectations",
    notProvided: "Not provided"
  },
  mr: {
    pageTitle: "बायोडाटा",
    subtitle: "विवाह परिचय",
    name: "पूर्ण नाव",
    dob: "जन्मतारीख",
    birthTime: "जन्मवेळ",
    birthPlace: "जन्मठिकाण",
    height: "उंची",
    education: "शिक्षण",
    occupation: "व्यवसाय",
    income: "वार्षिक उत्पन्न",
    religion: "धर्म",
    caste: "जात",
    subCaste: "उपजात",
    address: "पत्ता",
    contact: "संपर्क क्रमांक",
    email: "ई-मेल",
    expectations: "अपेक्षा",
    notProvided: "माहिती उपलब्ध नाही"
  }
};

const fields = [
  "name", "dob", "birthTime", "birthPlace", "height", "education", "occupation",
  "income", "religion", "caste", "subCaste", "address", "contact", "email", "expectations"
];

const form = document.getElementById("biodataForm");
const languageSelect = document.getElementById("language");
const previewBtn = document.getElementById("previewBtn");
const pdfBtn = document.getElementById("pdfBtn");
const card = document.getElementById("biodataCard");

function formatDate(dateString, lang) {
  if (!dateString) return i18n[lang].notProvided;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(lang === "mr" ? "mr-IN" : "en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function getValue(id, lang) {
  const val = (form.elements[id]?.value || "").trim();
  if (!val) return i18n[lang].notProvided;
  if (id === "dob") return formatDate(val, lang);
  return val;
}

function renderBiodata() {
  const lang = languageSelect.value;
  const t = i18n[lang];

  document.querySelectorAll("[data-i18n]").forEach((label) => {
    const key = label.dataset.i18n;
    label.textContent = t[key];
  });

  const rows = fields.map((key) => {
    const formId = key === "name" ? "fullName" : key;
    return `
      <div class="label">${t[key]}</div>
      <div>${getValue(formId, lang)}</div>
    `;
  }).join("");

  card.setAttribute("lang", lang);
  card.innerHTML = `
    <header class="card-header">
      <h2>${t.pageTitle}</h2>
      <p>${t.subtitle}</p>
    </header>
    <section class="data-grid">${rows}</section>
  `;
}

previewBtn.addEventListener("click", () => {
  if (!form.reportValidity()) return;
  renderBiodata();
});

pdfBtn.addEventListener("click", async () => {
  if (!form.reportValidity()) return;
  renderBiodata();

  const lang = languageSelect.value;
  const fileName = lang === "mr" ? "marathi-biodata.pdf" : "english-biodata.pdf";

  const options = {
    margin: [8, 8, 8, 8],
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  await html2pdf().set(options).from(card).save();
});

languageSelect.addEventListener("change", renderBiodata);

renderBiodata();
