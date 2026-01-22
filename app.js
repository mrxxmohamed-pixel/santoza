const ADMIN_PASSWORD = "santoza2024";
const VISIBLE_LIMIT = 8;
const STORAGE_KEYS = {
  products: "santoza_products",
  whatsapp: "santoza_whatsapp",
  logo: "santoza_logo",
};
const memoryStore = {};

const defaultProducts = [
  {
    name: "شوكولا بندق فاخرة",
    code: "ST-101",
    description: "شوكولا بالحليب مع بندق محمص وتغليف أنيق.",
    priceTry: 145,
    priceSyp: 52000,
    image: "",
  },
  {
    name: "شوكولا داكنة 70%",
    code: "ST-108",
    description: "قطع شوكولا داكنة لعشاق النكهة الغنية.",
    priceTry: 110,
    priceSyp: 40000,
    image: "",
  },
  {
    name: "سكاكر فواكه مشكلة",
    code: "ST-114",
    description: "سكاكر بنكهات فواكه طبيعية وألوان جذابة.",
    priceTry: 95,
    priceSyp: 35000,
    image: "",
  },
  {
    name: "لوح شوكولا بالبندق",
    code: "ST-121",
    description: "لوح شوكولا غني بحبيبات بندق كاملة.",
    priceTry: 160,
    priceSyp: 58000,
    image: "",
  },
  {
    name: "ترافل شوكولا كريمية",
    code: "ST-133",
    description: "حبات ترافل بقلب كريمي وقوام ناعم.",
    priceTry: 125,
    priceSyp: 47000,
    image: "",
  },
  {
    name: "سكاكر نعناع منعشة",
    code: "ST-140",
    description: "سكاكر بنكهة نعناع قوية ولمسة باردة.",
    priceTry: 90,
    priceSyp: 32000,
    image: "",
  },
  {
    name: "شوكولا بالحليب الكلاسيكية",
    code: "ST-155",
    description: "شوكولا بالحليب بطعم متوازن ومحبوب.",
    priceTry: 220,
    priceSyp: 79000,
    image: "",
  },
  {
    name: "سكاكر هلامية",
    code: "ST-166",
    description: "سكاكر جيلي بنكهات متنوعة وملمس طري.",
    priceTry: 70,
    priceSyp: 25000,
    image: "",
  },
];

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const adminClose = document.getElementById("adminClose");
const productForm = document.getElementById("productForm");
const showMoreBtn = document.getElementById("showMoreBtn");
const productGrid = document.getElementById("productGrid");
const whatsappDisplay = document.getElementById("whatsappNumberDisplay");
const whatsappInput = document.getElementById("whatsappInput");
const saveWhatsappBtn = document.getElementById("saveWhatsapp");
const whatsappFooter = document.getElementById("whatsappFooter");
const whatsappFloat = document.getElementById("whatsappFloat");
const adminProductList = document.getElementById("adminProductList");
const productImageInput = document.getElementById("productImageFile");
const logoInput = document.getElementById("logoInput");
const brandLogo = document.getElementById("brandLogo");
const logoFallback = document.getElementById("logoFallback");
const detailsPanel = document.getElementById("productDetails");
const detailsClose = document.getElementById("detailsClose");
const detailsBackBtn = document.getElementById("detailsBackBtn");
const detailsImage = document.getElementById("detailsImage");
const detailsImageFallback = document.getElementById("detailsImageFallback");
const detailsName = document.getElementById("detailsName");
const detailsDescription = document.getElementById("detailsDescription");
const detailsCode = document.getElementById("detailsCode");
const detailsPriceTry = document.getElementById("detailsPriceTry");
const detailsPriceSyp = document.getElementById("detailsPriceSyp");
const detailsOrderBtn = document.getElementById("detailsOrderBtn");
const detailsList = document.getElementById("detailsList");

let products = loadProducts();
let showAll = false;

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return memoryStore[key] || null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    memoryStore[key] = value;
    return false;
  }
}

function loadProducts() {
  const stored = safeGetItem(STORAGE_KEYS.products);
  if (!stored) return defaultProducts;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts;
  } catch (error) {
    return defaultProducts;
  }
}

function saveProducts() {
  return safeSetItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function sanitizeWhatsApp(value) {
  return (value || "").replace(/[^0-9]/g, "");
}

function getWhatsApp() {
  const stored = safeGetItem(STORAGE_KEYS.whatsapp);
  const cleaned = sanitizeWhatsApp(stored);
  return cleaned || "905551234567";
}

function setWhatsApp(value) {
  const cleaned = sanitizeWhatsApp(value);
  const finalNumber = cleaned || "905551234567";
  const saved = safeSetItem(STORAGE_KEYS.whatsapp, finalNumber);
  if (!saved) {
    window.alert("تعذر حفظ رقم واتساب. حاول برقم أقصر أو امسح التخزين المحلي.");
  }
  updateWhatsAppUI();
}

function formatWhatsAppDisplay(number) {
  if (!number) return "";
  return number.startsWith("+") ? number : `+${number}`;
}

function updateWhatsAppUI() {
  const number = getWhatsApp();
  if (whatsappDisplay) {
    whatsappDisplay.textContent = formatWhatsAppDisplay(number);
  }
  if (whatsappInput) {
    whatsappInput.value = number;
  }
  const generalLink = buildWhatsAppLink("مرحباً، أود الاستفسار عن توزيع السكاكر والشوكولا من SANTOZA.");
  whatsappFooter.href = generalLink;
  whatsappFloat.href = generalLink;
}

function buildWhatsAppLink(message) {
  const number = getWhatsApp();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

function buildOrderMessage(product) {
  const lines = [
    "مرحباً، أريد طلب المنتج التالي من SANTOZA:",
    `الاسم: ${product.name}`,
    `رقم المنتج: ${product.code}`,
  ];

  if (product.priceTry) {
    lines.push(`السعر بالتركي: ${product.priceTry} ل.ت`);
  }

  if (product.priceSyp) {
    lines.push(`السعر بالسوري: ${product.priceSyp} ل.س`);
  }

  return lines.join("\n");
}

function buildDetailLines(product) {
  const lines = [
    "الحد الأدنى للطلب يتم تحديده عند التأكيد.",
    "التغليف متوفر بعلب أو كراتين حسب الكمية.",
    "التخزين: مكان بارد وجاف بعيد عن أشعة الشمس.",
    "تأكيد التوفر والتسليم خلال دقائق عبر واتساب.",
  ];

  if (product.priceTry || product.priceSyp) {
    lines.unshift("الأسعار المعروضة قابلة للتحديث حسب الكمية.");
  } else {
    lines.unshift("السعر يعتمد على الكمية والموسم.");
  }

  return lines;
}

function updateDetailsImage(product) {
  if (!detailsImage || !detailsImageFallback) return;

  if (product.image) {
    detailsImage.src = product.image;
    detailsImage.alt = product.name ? `صورة ${product.name}` : "صورة المنتج";
    detailsImage.style.display = "block";
    detailsImageFallback.style.display = "none";
  } else {
    detailsImage.removeAttribute("src");
    detailsImage.alt = "";
    detailsImage.style.display = "none";
    detailsImageFallback.style.display = "grid";
  }
}

function openProductDetails(product) {
  if (!detailsPanel) return;

  updateDetailsImage(product);
  if (detailsName) {
    detailsName.textContent = product.name || "منتج";
  }
  if (detailsDescription) {
    detailsDescription.textContent = product.description || "وصف مختصر متاح عند الطلب.";
  }
  if (detailsCode) {
    detailsCode.textContent = product.code ? `رقم المنتج: ${product.code}` : "رقم المنتج غير متوفر";
  }
  if (detailsPriceTry) {
    detailsPriceTry.textContent = product.priceTry ? `${product.priceTry} ل.ت` : "السعر حسب الطلب";
  }
  if (detailsPriceSyp) {
    if (product.priceSyp) {
      detailsPriceSyp.textContent = `${product.priceSyp} ل.س`;
      detailsPriceSyp.style.display = "inline-flex";
    } else {
      detailsPriceSyp.textContent = "";
      detailsPriceSyp.style.display = "none";
    }
  }
  if (detailsOrderBtn) {
    detailsOrderBtn.href = buildWhatsAppLink(buildOrderMessage(product));
  }
  if (detailsList) {
    detailsList.innerHTML = "";
    buildDetailLines(product).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      detailsList.appendChild(item);
    });
  }

  detailsPanel.classList.remove("hidden");
  detailsPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("details-open");
}

function closeProductDetails() {
  if (!detailsPanel) return;
  detailsPanel.classList.add("hidden");
  detailsPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("details-open");
}

function createCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.style.setProperty("--delay", `${Math.min(index, 10) * 0.08}s`);

  const image = document.createElement("div");
  image.className = "product-image";
  if (product.image) {
    image.classList.add("has-image");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name ? `صورة ${product.name}` : "صورة المنتج";
    img.loading = "lazy";
    image.appendChild(img);
  } else {
    image.classList.add("placeholder");
  }

  const info = document.createElement("div");
  info.className = "product-info";

  const title = document.createElement("h3");
  title.textContent = product.name;

  const desc = document.createElement("p");
  desc.textContent = product.description || "وصف مختصر متاح عند الطلب.";

  info.appendChild(title);
  info.appendChild(desc);

  const meta = document.createElement("div");
  meta.className = "product-meta";

  const code = document.createElement("span");
  code.className = "product-code";
  code.textContent = `رقم المنتج: ${product.code}`;

  const priceWrap = document.createElement("div");
  priceWrap.className = "price-wrap";

  const tryPrice = document.createElement("span");
  tryPrice.textContent = product.priceTry ? `${product.priceTry} ل.ت` : "السعر حسب الطلب";

  const sypPrice = document.createElement("span");
  sypPrice.textContent = product.priceSyp ? `${product.priceSyp} ل.س` : "";

  priceWrap.appendChild(tryPrice);
  if (product.priceSyp) {
    priceWrap.appendChild(sypPrice);
  }

  meta.appendChild(code);
  meta.appendChild(priceWrap);

  const orderBtn = document.createElement("a");
  orderBtn.className = "btn btn-primary";
  orderBtn.textContent = "اطلب عبر واتساب";
  orderBtn.href = buildWhatsAppLink(buildOrderMessage(product));
  orderBtn.target = "_blank";
  orderBtn.rel = "noopener";

  const detailsBtn = document.createElement("button");
  detailsBtn.type = "button";
  detailsBtn.className = "btn btn-ghost";
  detailsBtn.textContent = "تفاصيل المنتج";
  detailsBtn.dataset.action = "view-details";
  detailsBtn.dataset.code = product.code;

  const actions = document.createElement("div");
  actions.className = "product-actions";
  actions.appendChild(orderBtn);
  actions.appendChild(detailsBtn);

  card.appendChild(image);
  card.appendChild(info);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

function renderProducts() {
  productGrid.innerHTML = "";
  const visibleProducts = showAll ? products : products.slice(0, VISIBLE_LIMIT);
  visibleProducts.forEach((product, index) => {
    productGrid.appendChild(createCard(product, index));
  });

  if (products.length > VISIBLE_LIMIT && !showAll) {
    showMoreBtn.style.display = "inline-flex";
  } else {
    showMoreBtn.style.display = "none";
  }
}

function renderAdminProducts() {
  if (!adminProductList) return;
  adminProductList.innerHTML = "";

  if (!products.length) {
    const empty = document.createElement("div");
    empty.className = "admin-product-empty";
    empty.textContent = "لا توجد منتجات حالياً.";
    adminProductList.appendChild(empty);
    return;
  }

  products.forEach((product, index) => {
    const item = document.createElement("div");
    item.className = "admin-product-item";

    const meta = document.createElement("div");
    meta.className = "admin-product-meta";

    const title = document.createElement("span");
    title.className = "admin-product-title";
    title.textContent = product.name || "منتج بدون اسم";

    const code = document.createElement("span");
    code.className = "admin-product-code";
    code.textContent = product.code ? `رقم المنتج: ${product.code}` : "بدون رقم";

    meta.appendChild(title);
    meta.appendChild(code);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-ghost btn-danger";
    deleteBtn.textContent = "حذف";
    deleteBtn.dataset.action = "delete-product";
    deleteBtn.dataset.index = String(index);

    item.appendChild(meta);
    item.appendChild(deleteBtn);
    adminProductList.appendChild(item);
  });
}

function openAdminPanel() {
  adminPanel.classList.remove("hidden");
  document.body.classList.add("admin-open");
}

function closeAdminPanel() {
  adminPanel.classList.add("hidden");
  document.body.classList.remove("admin-open");
}

adminToggle.addEventListener("click", () => {
  const password = window.prompt("الرجاء إدخال كلمة المرور للدخول للإدارة:");
  if (password === null) return;
  if (password === ADMIN_PASSWORD) {
    openAdminPanel();
  } else {
    window.alert("كلمة المرور غير صحيحة.");
  }
});

adminClose.addEventListener("click", closeAdminPanel);

showMoreBtn.addEventListener("click", () => {
  showAll = true;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='view-details']");
  if (!button) return;

  const code = button.dataset.code;
  if (!code) return;

  const product = products.find((item) => item.code === code);
  if (!product) return;
  openProductDetails(product);
});

if (detailsClose) {
  detailsClose.addEventListener("click", closeProductDetails);
}

if (detailsBackBtn) {
  detailsBackBtn.addEventListener("click", closeProductDetails);
}

if (detailsPanel) {
  detailsPanel.addEventListener("click", (event) => {
    if (event.target === detailsPanel) {
      closeProductDetails();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailsPanel && !detailsPanel.classList.contains("hidden")) {
    closeProductDetails();
  }
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const code = document.getElementById("productCode").value.trim();
  const priceTry = document.getElementById("productPriceTry").value.trim();
  const priceSyp = document.getElementById("productPriceSyp").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const imageFile = productImageInput.files && productImageInput.files[0];

  if (!name || !code) {
    window.alert("يرجى إدخال اسم المنتج ورقمه.");
    return;
  }

  if (!imageFile) {
    window.alert("يرجى اختيار صورة المنتج من الاستديو.");
    return;
  }

  const finalizeProduct = (imageData) => {
    const newProduct = {
      name,
      code,
      description,
      priceTry: priceTry ? Number(priceTry) : null,
      priceSyp: priceSyp ? Number(priceSyp) : null,
      image: imageData || "",
    };

    products.unshift(newProduct);
    if (!saveProducts()) {
      products.shift();
      window.alert("تعذر حفظ المنتج. حاول تقليل حجم الصورة أو امسح التخزين المحلي.");
      return;
    }
    showAll = products.length <= VISIBLE_LIMIT ? false : showAll;
    renderProducts();
    renderAdminProducts();
    productForm.reset();
  };

  const reader = new FileReader();
  reader.onload = () => finalizeProduct(reader.result);
  reader.onerror = () => {
    window.alert("تعذر قراءة صورة المنتج. حاول مرة أخرى.");
  };
  reader.readAsDataURL(imageFile);
});

if (adminProductList) {
  adminProductList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='delete-product']");
    if (!button) return;

    const index = Number(button.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= products.length) {
      return;
    }

    const name = products[index]?.name || "هذا المنتج";
    const shouldDelete = window.confirm(`هل تريد حذف ${name}؟`);
    if (!shouldDelete) return;

    const [removed] = products.splice(index, 1);
    if (!saveProducts()) {
      products.splice(index, 0, removed);
      window.alert("تعذر حفظ الحذف. حاول مرة أخرى.");
      return;
    }
    renderProducts();
    renderAdminProducts();
  });
}

saveWhatsappBtn.addEventListener("click", () => {
  setWhatsApp(whatsappInput.value.trim());
});

logoInput.addEventListener("change", () => {
  const file = logoInput.files && logoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const saved = safeSetItem(STORAGE_KEYS.logo, reader.result);
    if (!saved) {
      window.alert("تعذر حفظ الشعار. حاول استخدام صورة أصغر.");
      return;
    }
    loadLogo();
  };
  reader.readAsDataURL(file);
});

function loadLogo() {
  const stored = safeGetItem(STORAGE_KEYS.logo);
  if (stored) {
    brandLogo.src = stored;
    brandLogo.style.display = "block";
    logoFallback.style.display = "none";
  } else {
    brandLogo.removeAttribute("src");
    brandLogo.style.display = "none";
    logoFallback.style.display = "grid";
  }
}

updateWhatsAppUI();
loadLogo();
renderProducts();
renderAdminProducts();
