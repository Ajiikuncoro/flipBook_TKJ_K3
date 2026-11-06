// =====================================================
// NETBOOK - MEDIA DAN JARINGAN TELEKOMUNIKASI
// KELOMPOK 3 - 2026 (WITH INTEGRATED TEACHER PANEL)
// SINKRONISASI 22 HALAMAN KURIKULUM + PANEL GURU DINAMIS
// =====================================================

// LINK EVALUASI WAYGROUND RESMI
const waygroundURL = "https://wayground.com/join?gc=63289187";
const ANIMATION_DURATION = 850;

// Elemen HTML Flipbook Utama
const leftContent = document.getElementById("leftContent");
const rightContent = document.getElementById("rightContent");

const flipSheet = document.getElementById("flipSheet");
const flipFront = document.getElementById("flipFront");
const flipBack = document.getElementById("flipBack");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const coverBtn = document.getElementById("coverBtn");

const currentPageText = document.getElementById("currentPage");
const totalPageText = document.getElementById("totalPage");
const progressBar = document.getElementById("progressBar");
const pageLabel = document.getElementById("pageLabel");
const book = document.getElementById("book");
const fullscreenBtn = document.getElementById("fullscreenBtn");

// =====================================================
// STATUS FLIPBOOK DINAMIS
// =====================================================

let isMobile = window.matchMedia("(max-width: 600px)").matches;
let mobilePage = 1;
let spreadStart = 0;
let isAnimating = false;

// Master pages array (berisi 22 halaman kurikulum + halaman materi guru)
let masterPages = [];

// =====================================================
// INDEXEDDB STORAGE (PENYIMPANAN GAMBAR & VIDEO LOKAL)
// =====================================================

const DB_NAME = "NetbookMediaDB";
const DB_VERSION = 1;
const STORE_NAME = "mediaBlobs";

function openMediaDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            resolve(null);
            return;
        }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

async function saveMediaBlob(id, fileOrBlob) {
    try {
        const db = await openMediaDB();
        if (!db) return null;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.put({ id: id, data: fileOrBlob, timestamp: Date.now() });
            tx.oncomplete = () => resolve(id);
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.error("Gagal menyimpan blob ke IndexedDB:", err);
        return null;
    }
}

async function getMediaBlob(id) {
    try {
        const db = await openMediaDB();
        if (!db) return null;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        return null;
    }
}

async function deleteMediaBlob(id) {
    try {
        const db = await openMediaDB();
        if (!db) return;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {}
}

async function clearAllMediaBlobs() {
    try {
        const db = await openMediaDB();
        if (!db) return;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {}
}

// =====================================================
// UTILS & TOAST
// =====================================================

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        videoId = match[2];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
}

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✅" : (type === "error" ? "❌" : "ℹ️");
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// =====================================================
// 22 HALAMAN KURIKULUM RESMI (DARI REPO LIVE)
// =====================================================

function pageFooter(number) {
    return `
        <div class="page-number">
            <span>NETBOOK • MEDIA JARINGAN</span>
            <b>${number}</b>
        </div>
    `;
}

function normalPage(number, title, kicker, content) {
    return `
        <div class="page-kicker">${kicker}</div>
        <h2 class="page-title">${title}</h2>
        ${content}
        ${pageFooter(number)}
    `;
}

function infoBox(title, content) {
    return `
        <div class="info-box">
            <strong>${title}</strong>
            ${content}
        </div>
    `;
}

function contentList(items) {
    return `
        <ul class="content-list">
            ${items.map((item, index) => `
                <li>
                    <span class="check">${index + 1}</span>
                    <span>${item}</span>
                </li>
            `).join("")}
        </ul>
    `;
}

function card(title, description, symbol = "") {
    return `
        <div class="mini-card">
            ${symbol ? `<div class="symbol">${symbol}</div>` : ""}
            <h4>${title}</h4>
            <p>${description}</p>
        </div>
    `;
}

function cardGroup(items) {
    return `
        <div class="cards">
            ${items.map(item =>
                card(item.title, item.description, item.symbol || "")
            ).join("")}
        </div>
    `;
}

function diagramNode(symbol, label) {
    return `
        <div class="diagram-node">
            <div class="diagram-icon">${symbol}</div>
            <small>${label}</small>
        </div>
    `;
}

function simpleDiagram(items) {
    return `
        <div class="diagram">
            ${items.map((item, index) => `
                ${diagramNode(item.symbol, item.label)}
                ${index < items.length - 1
                    ? `<div class="diagram-arrow">→</div>`
                    : ""}
            `).join("")}
        </div>
    `;
}

// =====================================================
// HALAMAN 1 - SAMPUL
// =====================================================

function coverPage(number = 1) {
    return `
        <div class="cover-page">

            <div class="cover-top">
                <span>NETBOOK / 01</span>
                <span>LEARNING MEDIA</span>
            </div>

            <h1 class="cover-title">
                MEDIA DAN
                <span>JARINGAN</span>
                TELEKOMUNIKASI
            </h1>

            <p class="cover-subtitle">
                Media Pembelajaran Interaktif<br>
                Dasar-Dasar Teknik Jaringan Komputer
                dan Telekomunikasi
            </p>

            <div class="network-art">
                <svg viewBox="0 0 300 160"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none">
                    <g stroke="#20d6d2" stroke-width="2">
                        <path d="M150 80 L65 35 L235 35 L150 130"/>
                        <path d="M65 35 L65 125 L235 35"/>
                        <path d="M235 35 L235 125 L65 125"/>
                    </g>
                    <g fill="#20d6d2">
                        <circle cx="150" cy="80" r="15"/>
                        <circle cx="65" cy="35" r="10"/>
                        <circle cx="235" cy="35" r="10"/>
                        <circle cx="65" cy="125" r="10"/>
                        <circle cx="235" cy="125" r="10"/>
                        <circle cx="150" cy="130" r="8"/>
                    </g>
                    <g fill="#081b2b" stroke="#20d6d2" stroke-width="2">
                        <rect x="132" y="65" width="36" height="28" rx="5"/>
                    </g>
                    <g stroke="#20d6d2" stroke-width="2">
                        <path d="M142 100 H158"/>
                        <path d="M150 93 V100"/>
                    </g>
                </svg>
            </div>

            <div class="cover-meta">
                <div>
                    <strong>SMK/MAK KELAS X</strong><br>
                    FASE E
                </div>
                <div>
                    <strong>ELEMEN</strong><br>
                    MEDIA DAN JARINGAN
                </div>
            </div>

            ${pageFooter(number)}
        </div>
    `;
}

// =====================================================
// HALAMAN 2 - TUJUAN PEMBELAJARAN
// =====================================================

function page2(number = 2) {
    return normalPage(number,
        "Tujuan Pembelajaran",
        "01 / LEARNING OBJECTIVES",
        `
        <p class="page-description">
            Setelah mempelajari materi ini, peserta didik diharapkan
            mampu memahami berbagai media transmisi dan penerapannya
            dalam membangun jaringan komputer.
        </p>

        ${contentList([
            "Menjelaskan pengertian dan fungsi media transmisi jaringan.",
            "Mengidentifikasi jenis media transmisi kabel dan nirkabel.",
            "Menjelaskan karakteristik twisted pair, koaksial, dan fiber optik.",
            "Memahami cara kerja dasar media transmisi nirkabel.",
            "Membandingkan kelebihan dan kekurangan setiap media transmisi.",
            "Menentukan media transmisi sesuai kebutuhan jaringan."
        ])}

        ${infoBox(
            "CAPAIAN PEMBELAJARAN",
            "Menerapkan berbagai media dalam membangun jaringan pada teknik jaringan komputer dan telekomunikasi."
        )}
        `
    );
}

// =====================================================
// HALAMAN 3 - PENGERTIAN MEDIA TRANSMISI
// =====================================================

function page3(number = 3) {
    return normalPage(number,
        "Pengertian Media Transmisi",
        "02 / PENGENALAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Media transmisi adalah jalur atau perantara yang digunakan
            untuk mengirimkan data dari satu perangkat ke perangkat
            lainnya dalam jaringan komputer.
        </p>

        ${simpleDiagram([
            { symbol: "💻", label: "Pengirim" },
            { symbol: "〰️", label: "Media Transmisi" },
            { symbol: "🖥️", label: "Penerima" }
        ])}

        <h3 class="section-label">PROSES PENGIRIMAN DATA</h3>

        ${contentList([
            "Perangkat pengirim menghasilkan data atau informasi.",
            "Data diubah menjadi sinyal yang dapat dikirim melalui media transmisi.",
            "Media transmisi membawa sinyal menuju perangkat tujuan.",
            "Perangkat penerima menerima dan mengolah data tersebut."
        ])}

        ${infoBox(
            "CONTOH SEDERHANA",
            "Saat komputer mengirim file melalui kabel LAN, data melewati kabel jaringan sebelum diterima komputer tujuan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 4 - FUNGSI MEDIA TRANSMISI
// =====================================================

function page4(number = 4) {
    return normalPage(number,
        "Fungsi Media Transmisi",
        "02 / PENGENALAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Media transmisi berperan penting dalam proses komunikasi
            karena menjadi penghubung antara perangkat yang saling
            bertukar informasi.
        </p>

        ${cardGroup([
            {
                title: "Pengiriman Data",
                symbol: "📤",
                description: "Menjadi jalur untuk membawa data dari perangkat pengirim menuju penerima."
            },
            {
                title: "Penghubung",
                symbol: "🔗",
                description: "Menghubungkan dua perangkat atau lebih agar dapat berkomunikasi."
            },
            {
                title: "Pertukaran Informasi",
                symbol: "🔄",
                description: "Mendukung proses berbagi file, pesan, dan informasi melalui jaringan."
            },
            {
                title: "Komunikasi Jaringan",
                symbol: "🌐",
                description: "Membantu perangkat mengakses layanan dan sumber daya jaringan."
            }
        ])}

        ${infoBox(
            "HAL YANG PERLU DIPERHATIKAN",
            "Pemilihan media transmisi dapat memengaruhi kecepatan, jangkauan, kestabilan, dan biaya pembangunan jaringan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 5 - JENIS MEDIA TRANSMISI
// =====================================================

function page5(number = 5) {
    return normalPage(number,
        "Jenis Media Transmisi",
        "02 / PENGENALAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Berdasarkan bentuk jalur pengirimannya, media transmisi
            jaringan komputer secara umum dibagi menjadi dua jenis.
        </p>

        ${cardGroup([
            {
                title: "Wired (Kabel)",
                symbol: "🔌",
                description: "Menggunakan kabel fisik sebagai jalur pengiriman data, misalnya twisted pair, koaksial, dan fiber optik."
            },
            {
                title: "Wireless (Nirkabel)",
                symbol: "📶",
                description: "Mengirimkan data tanpa kabel fisik dengan memanfaatkan gelombang elektromagnetik."
            }
        ])}

        ${simpleDiagram([
            { symbol: "🌐", label: "Media Jaringan" },
            { symbol: "🔀", label: "Dua Jenis" },
            { symbol: "🔌", label: "Kabel / Nirkabel" }
        ])}

        ${infoBox(
            "KESIMPULAN",
            "Kedua jenis media memiliki karakteristik yang berbeda. Pemilihannya harus disesuaikan dengan kebutuhan dan kondisi jaringan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 6 - PENGERTIAN TWISTED PAIR
// =====================================================

function page6(number = 6) {
    return normalPage(number,
        "Kabel Twisted Pair",
        "03 / MEDIA TRANSMISI KABEL",
        `
        <p class="page-description">
            Twisted pair merupakan kabel jaringan yang terdiri dari
            pasangan kawat tembaga yang dipilin satu sama lain.
            Pilinan tersebut membantu mengurangi gangguan sinyal.
        </p>

        <div class="cable-visual">
            <div class="cable-line">
                <span>UTP / STP</span>
                <div class="wire"></div>
            </div>
        </div>

        <h3 class="section-label">KARAKTERISTIK</h3>

        ${contentList([
            "Menggunakan penghantar berupa kawat tembaga.",
            "Terdiri dari beberapa pasang kabel yang saling dipilin.",
            "Umumnya digunakan untuk membangun jaringan LAN.",
            "Dapat menggunakan konektor RJ-45 pada jaringan Ethernet."
        ])}

        ${infoBox(
            "PENGGUNAAN",
            "Kabel twisted pair banyak ditemukan pada jaringan komputer di laboratorium, sekolah, kantor, dan rumah."
        )}
        `
    );
}

// =====================================================
// HALAMAN 7 - JENIS TWISTED PAIR
// =====================================================

function page7(number = 7) {
    return normalPage(number,
        "Jenis Kabel Twisted Pair",
        "03 / MEDIA TRANSMISI KABEL",
        `
        <p class="page-description">
            Berdasarkan pelindungnya, kabel twisted pair yang umum
            dikenal terdiri dari UTP dan STP.
        </p>

        ${cardGroup([
            {
                title: "UTP",
                symbol: "🔌",
                description: "Unshielded Twisted Pair tidak memiliki pelindung tambahan berupa lapisan logam. Kabel ini banyak digunakan karena pemasangannya relatif mudah."
            },
            {
                title: "STP",
                symbol: "🛡️",
                description: "Shielded Twisted Pair memiliki pelindung tambahan untuk membantu mengurangi gangguan elektromagnetik dari lingkungan."
            }
        ])}

        <h3 class="section-label">PERBEDAAN UTAMA</h3>

        ${contentList([
            "UTP memiliki struktur lebih sederhana dan umumnya lebih ekonomis.",
            "STP memiliki lapisan pelindung tambahan.",
            "STP dapat digunakan pada lingkungan yang memiliki potensi gangguan elektromagnetik lebih tinggi.",
            "Pemilihan kabel perlu mempertimbangkan lingkungan pemasangan dan kebutuhan jaringan."
        ])}
        `
    );
}

// =====================================================
// HALAMAN 8 - KABEL KOAKSIAL
// =====================================================

function page8(number = 8) {
    return normalPage(number,
        "Kabel Koaksial",
        "03 / MEDIA TRANSMISI KABEL",
        `
        <p class="page-description">
            Kabel koaksial adalah kabel yang memiliki konduktor inti
            di bagian tengah, lapisan isolator, pelindung logam,
            dan lapisan luar.
        </p>

        <div class="cable-visual">
            <div class="cable-line">
                <span>Koaksial</span>
                <div class="wire coax"></div>
            </div>
        </div>

        <h3 class="section-label">BAGIAN KABEL KOAKSIAL</h3>

        ${contentList([
            "<b>Konduktor inti:</b> bagian yang membawa sinyal.",
            "<b>Isolator:</b> memisahkan konduktor inti dari pelindung.",
            "<b>Pelindung logam:</b> membantu mengurangi gangguan dari luar.",
            "<b>Jaket luar:</b> melindungi bagian dalam kabel."
        ])}

        ${infoBox(
            "CONTOH PENGGUNAAN",
            "Kabel koaksial digunakan pada televisi kabel, antena, dan beberapa sistem komunikasi."
        )}
        `
    );
}

// =====================================================
// HALAMAN 9 - PENGERTIAN FIBER OPTIK
// =====================================================

function page9(number = 9) {
    return normalPage(number,
        "Pengertian Fiber Optik",
        "04 / MEDIA TRANSMISI FIBER OPTIK",
        `
        <p class="page-description">
            Fiber optik merupakan media transmisi yang menggunakan
            cahaya untuk membawa informasi melalui serat kaca atau
            plastik khusus yang sangat halus.
        </p>

        <div class="cable-visual">
            <div class="cable-line">
                <span>Fiber Optik</span>
                <div class="wire fiber"></div>
            </div>
        </div>

        ${simpleDiagram([
            { symbol: "💡", label: "Sumber Cahaya" },
            { symbol: "✨", label: "Serat Optik" },
            { symbol: "📡", label: "Penerima" }
        ])}

        <h3 class="section-label">CARA KERJA SINGKAT</h3>

        ${contentList([
            "Perangkat pengirim mengubah informasi menjadi sinyal cahaya.",
            "Cahaya merambat melalui bagian inti serat optik.",
            "Sinyal cahaya diterima oleh perangkat penerima.",
            "Perangkat penerima mengubah sinyal menjadi informasi kembali."
        ])}
        `
    );
}

// =====================================================
// HALAMAN 10 - STRUKTUR FIBER OPTIK
// =====================================================

function page10(number = 10) {
    return normalPage(number,
        "Struktur Fiber Optik",
        "04 / MEDIA TRANSMISI FIBER OPTIK",
        `
        <p class="page-description">
            Kabel fiber optik memiliki beberapa lapisan yang
            bekerja bersama untuk menghantarkan dan melindungi
            cahaya selama proses transmisi.
        </p>

        ${cardGroup([
            {
                title: "Core",
                symbol: "🔵",
                description: "Bagian inti serat optik yang menjadi jalur utama perambatan cahaya."
            },
            {
                title: "Cladding",
                symbol: "⭕",
                description: "Lapisan yang mengelilingi core dan membantu menjaga cahaya tetap merambat di dalam inti."
            },
            {
                title: "Coating",
                symbol: "🛡️",
                description: "Lapisan pelindung yang membantu menjaga serat dari kerusakan."
            },
            {
                title: "Jaket Kabel",
                symbol: "🔒",
                description: "Lapisan terluar yang melindungi bagian kabel dari kondisi lingkungan."
            }
        ])}

        ${infoBox(
            "CATATAN",
            "Core dan cladding merupakan bagian penting dalam proses perambatan cahaya pada serat optik."
        )}
        `
    );
}

// =====================================================
// HALAMAN 11 - KELEBIHAN DAN KEKURANGAN FIBER OPTIK
// =====================================================

function page11(number = 11) {
    return normalPage(number,
        "Kelebihan dan Kekurangan Fiber Optik",
        "04 / MEDIA TRANSMISI FIBER OPTIK",
        `
        <p class="page-description">
            Fiber optik banyak digunakan pada jaringan modern,
            terutama ketika dibutuhkan kapasitas dan jangkauan
            transmisi yang tinggi.
        </p>

        ${cardGroup([
            {
                title: "Kelebihan",
                symbol: "✓",
                description: "Memiliki kapasitas transmisi tinggi, dapat menjangkau jarak jauh, dan tidak mudah terpengaruh gangguan elektromagnetik."
            },
            {
                title: "Kekurangan",
                symbol: "!",
                description: "Biaya perangkat dan instalasi relatif lebih tinggi serta membutuhkan alat dan keterampilan khusus."
            }
        ])}

        <h3 class="section-label">CONTOH PENERAPAN</h3>

        ${contentList([
            "Jaringan internet berbasis fiber optik.",
            "Jaringan backbone antarwilayah.",
            "Penghubung jaringan antargedung.",
            "Infrastruktur jaringan perusahaan dan pusat data."
        ])}

        ${infoBox(
            "KESIMPULAN",
            "Fiber optik cocok digunakan ketika jaringan membutuhkan kapasitas besar dan jangkauan yang luas."
        )}
        `
    );
}

// =====================================================
// HALAMAN 12 - PENGERTIAN MEDIA NIRKABEL
// =====================================================

function page12(number = 12) {
    return normalPage(number,
        "Media Transmisi Nirkabel",
        "05 / MEDIA TRANSMISI NIRKABEL",
        `
        <p class="page-description">
            Media nirkabel atau wireless merupakan media transmisi
            yang mengirimkan data tanpa menggunakan kabel fisik.
            Proses komunikasi memanfaatkan gelombang elektromagnetik.
        </p>

        ${simpleDiagram([
            { symbol: "💻", label: "Perangkat" },
            { symbol: "📶", label: "Gelombang" },
            { symbol: "📱", label: "Penerima" }
        ])}

        <h3 class="section-label">KARAKTERISTIK</h3>

        ${contentList([
            "Tidak memerlukan kabel sebagai jalur langsung komunikasi.",
            "Memanfaatkan gelombang elektromagnetik.",
            "Memungkinkan perangkat terhubung secara lebih fleksibel.",
            "Kualitas koneksi dapat dipengaruhi jarak dan kondisi lingkungan."
        ])}

        ${infoBox(
            "CONTOH SEHARI-HARI",
            "Koneksi Wi-Fi pada laptop dan smartphone merupakan contoh penggunaan media transmisi nirkabel."
        )}
        `
    );
}

// =====================================================
// HALAMAN 13 - JENIS MEDIA NIRKABEL
// =====================================================

function page13(number = 13) {
    return normalPage(number,
        "Jenis Media Nirkabel",
        "05 / MEDIA TRANSMISI NIRKABEL",
        `
        <p class="page-description">
            Media nirkabel menggunakan beberapa jenis gelombang
            untuk mengirimkan informasi dari satu perangkat
            ke perangkat lainnya.
        </p>

        ${cardGroup([
            {
                title: "Gelombang Radio",
                symbol: "📻",
                description: "Digunakan dalam komunikasi radio, Wi-Fi, dan berbagai sistem komunikasi nirkabel."
            },
            {
                title: "Microwave",
                symbol: "📡",
                description: "Digunakan pada komunikasi titik ke titik dan beberapa sistem komunikasi jarak jauh."
            },
            {
                title: "Infrared",
                symbol: "🔴",
                description: "Menggunakan cahaya inframerah dan umumnya digunakan untuk komunikasi jarak dekat."
            },
            {
                title: "Satelit",
                symbol: "🛰️",
                description: "Membantu komunikasi pada wilayah yang luas melalui perangkat dan sistem satelit."
            }
        ])}

        ${infoBox(
            "PERLU DIINGAT",
            "Setiap jenis media nirkabel memiliki karakteristik, jangkauan, dan kebutuhan perangkat yang berbeda."
        )}
        `
    );
}

// =====================================================
// HALAMAN 14 - WI-FI DAN PENERAPANNYA
// =====================================================

function page14(number = 14) {
    return normalPage(number,
        "Wi-Fi dalam Jaringan Komputer",
        "05 / MEDIA TRANSMISI NIRKABEL",
        `
        <p class="page-description">
            Wi-Fi merupakan teknologi jaringan nirkabel yang
            memungkinkan perangkat bertukar data melalui
            gelombang radio tanpa harus menggunakan kabel LAN.
        </p>

        ${simpleDiagram([
            { symbol: "🌐", label: "Internet" },
            { symbol: "📡", label: "Access Point" },
            { symbol: "💻", label: "Pengguna" }
        ])}

        <h3 class="section-label">PERANGKAT YANG DIGUNAKAN</h3>

        ${contentList([
            "<b>Access Point:</b> menyediakan akses jaringan nirkabel.",
            "<b>Wireless Router:</b> menghubungkan jaringan lokal dengan jaringan lain.",
            "<b>Wireless Adapter:</b> memungkinkan perangkat terhubung ke jaringan Wi-Fi.",
            "<b>Antena:</b> membantu memancarkan atau menerima sinyal radio."
        ])}

        ${infoBox(
            "CONTOH PENERAPAN",
            "Wi-Fi digunakan di rumah, sekolah, kampus, kantor, dan tempat umum untuk memberikan akses jaringan kepada banyak perangkat."
        )}
        `
    );
}

// =====================================================
// HALAMAN 15 - PERBANDINGAN MEDIA TRANSMISI
// =====================================================

function page15(number = 15) {
    return normalPage(number,
        "Perbandingan Media Transmisi",
        "06 / ANALISIS MEDIA TRANSMISI",
        `
        <p class="page-description">
            Setiap media transmisi memiliki karakteristik yang
            berbeda. Perbandingan diperlukan agar pemilihan
            media sesuai dengan kebutuhan jaringan.
        </p>

        <table class="compare-table">
            <tr>
                <th>Media</th>
                <th>Jalur</th>
                <th>Contoh</th>
            </tr>
            <tr>
                <td>UTP</td>
                <td>Kabel</td>
                <td>LAN</td>
            </tr>
            <tr>
                <td>Koaksial</td>
                <td>Kabel</td>
                <td>TV Kabel</td>
            </tr>
            <tr>
                <td>Fiber Optik</td>
                <td>Cahaya</td>
                <td>Internet Fiber</td>
            </tr>
            <tr>
                <td>Wi-Fi</td>
                <td>Radio</td>
                <td>Jaringan Nirkabel</td>
            </tr>
        </table>

        ${infoBox(
            "KESIMPULAN",
            "Media kabel menggunakan jalur fisik, sedangkan media nirkabel menggunakan gelombang elektromagnetik untuk mengirimkan data."
        )}
        `
    );
}

// =====================================================
// HALAMAN 16 - KELEBIHAN DAN KEKURANGAN MEDIA
// =====================================================

function page16(number = 16) {
    return normalPage(number,
        "Kelebihan dan Kekurangan Media",
        "06 / ANALISIS MEDIA TRANSMISI",
        `
        <p class="page-description">
            Sebelum membangun jaringan, kita perlu mempertimbangkan
            kelebihan dan kekurangan media yang akan digunakan.
        </p>

        ${cardGroup([
            {
                title: "Media Kabel",
                symbol: "🔌",
                description: "Koneksi dapat lebih stabil dan tidak bergantung pada jangkauan sinyal radio. Namun, pemasangan membutuhkan kabel fisik."
            },
            {
                title: "Media Nirkabel",
                symbol: "📶",
                description: "Lebih fleksibel dan memudahkan perangkat berpindah tempat. Namun, kualitas koneksi dapat dipengaruhi jarak dan penghalang."
            }
        ])}

        <h3 class="section-label">FAKTOR PEMILIHAN</h3>

        ${contentList([
            "Kebutuhan kecepatan dan kapasitas jaringan.",
            "Luas area dan jarak antarperangkat.",
            "Kondisi lingkungan pemasangan.",
            "Biaya perangkat dan instalasi.",
            "Kemudahan perawatan jaringan."
        ])}
        `
    );
}

// =====================================================
// HALAMAN 17 - MEMILIH MEDIA TRANSMISI
// =====================================================

function page17(number = 17) {
    return normalPage(number,
        "Memilih Media yang Tepat",
        "06 / ANALISIS MEDIA TRANSMISI",
        `
        <p class="page-description">
            Pemilihan media transmisi sebaiknya dilakukan berdasarkan
            kebutuhan jaringan, bukan hanya berdasarkan jenis kabel
            atau teknologi yang paling baru.
        </p>

        <div class="case-item">
            <h4>Jaringan Laboratorium Komputer</h4>
            <p>
                Membutuhkan koneksi antarkomputer yang stabil.
                Kabel twisted pair dapat menjadi pilihan untuk
                menghubungkan komputer ke switch.
            </p>
        </div>

        <div class="case-item">
            <h4>Jaringan Antargedung</h4>
            <p>
                Membutuhkan koneksi dengan jangkauan lebih jauh.
                Fiber optik dapat dipertimbangkan karena memiliki
                kapasitas transmisi tinggi.
            </p>
        </div>

        <div class="case-item">
            <h4>Akses Internet Pengguna</h4>
            <p>
                Membutuhkan fleksibilitas untuk banyak perangkat.
                Wi-Fi dapat digunakan agar pengguna terhubung
                tanpa kabel langsung ke router.
            </p>
        </div>

        ${infoBox(
            "INTI PEMILIHAN",
            "Pertimbangkan kebutuhan, jarak, kondisi lokasi, biaya, dan kemudahan pemeliharaan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 18 - PENERAPAN DI SEKOLAH
// =====================================================

function page18(number = 18) {
    return normalPage(number,
        "Penerapan di Lingkungan Sekolah",
        "07 / PENERAPAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Media transmisi digunakan dalam berbagai fasilitas
            sekolah untuk mendukung kegiatan belajar dan
            administrasi.
        </p>

        ${cardGroup([
            {
                title: "Laboratorium Komputer",
                symbol: "💻",
                description: "Kabel UTP dapat menghubungkan komputer siswa dengan switch dalam jaringan lokal."
            },
            {
                title: "Ruang Guru",
                symbol: "🖥️",
                description: "Jaringan kabel atau Wi-Fi dapat digunakan untuk mengakses sistem informasi sekolah."
            },
            {
                title: "Perpustakaan",
                symbol: "📚",
                description: "Wi-Fi dapat mendukung akses katalog digital dan sumber belajar online."
            },
            {
                title: "Antargedung",
                symbol: "🏫",
                description: "Fiber optik dapat digunakan sebagai penghubung jaringan antargedung."
            }
        ])}

        ${infoBox(
            "CONTOH",
            "Sebuah sekolah dapat menggunakan fiber optik sebagai penghubung utama, kabel UTP untuk komputer laboratorium, dan Wi-Fi untuk akses siswa."
        )}
        `
    );
}

// =====================================================
// HALAMAN 19 - PENERAPAN DI RUMAH DAN KANTOR
// =====================================================

function page19(number = 19) {
    return normalPage(number,
        "Penerapan di Rumah dan Kantor",
        "07 / PENERAPAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Penggunaan media transmisi juga dapat ditemukan
            dalam aktivitas sehari-hari di rumah maupun
            lingkungan kerja.
        </p>

        <div class="case-item">
            <h4>Lingkungan Rumah</h4>
            <p>
                Wi-Fi digunakan untuk menghubungkan smartphone,
                laptop, televisi pintar, dan perangkat lainnya.
                Kabel LAN dapat digunakan untuk perangkat
                yang membutuhkan koneksi kabel.
            </p>
        </div>

        <div class="case-item">
            <h4>Lingkungan Kantor</h4>
            <p>
                Kabel twisted pair dapat menghubungkan komputer
                ke jaringan lokal, sedangkan Wi-Fi memberikan
                akses bagi perangkat bergerak.
            </p>
        </div>

        <div class="case-item">
            <h4>Jaringan Perusahaan</h4>
            <p>
                Fiber optik dapat digunakan sebagai jalur
                penghubung utama antarruang atau antargedung
                yang membutuhkan kapasitas besar.
            </p>
        </div>

        ${infoBox(
            "KESIMPULAN",
            "Satu lingkungan dapat menggunakan lebih dari satu jenis media transmisi sesuai fungsi dan kebutuhan perangkat."
        )}
        `
    );
}

// =====================================================
// HALAMAN 20 - STUDI KASUS SEDERHANA
// =====================================================

function page20(number = 20) {
    return normalPage(number,
        "Studi Kasus Pemilihan Media",
        "07 / PENERAPAN MEDIA JARINGAN",
        `
        <p class="page-description">
            Perhatikan contoh kasus berikut untuk memahami
            bagaimana media transmisi dipilih berdasarkan
            kebutuhan jaringan.
        </p>

        <div class="case-item">
            <h4>Kasus: Laboratorium Komputer Sekolah</h4>
            <p>
                Sebuah laboratorium memiliki 30 komputer yang
                perlu terhubung ke jaringan lokal untuk berbagi
                akses internet dan sumber belajar.
            </p>
        </div>

        <h3 class="section-label">ANALISIS KEBUTUHAN</h3>

        ${contentList([
            "Setiap komputer membutuhkan koneksi jaringan.",
            "Koneksi diharapkan stabil selama kegiatan praktikum.",
            "Komputer berada di dalam satu ruangan.",
            "Pengelola membutuhkan instalasi yang mudah dirawat."
        ])}

        ${infoBox(
            "REKOMENDASI",
            "Kabel twisted pair dapat digunakan untuk menghubungkan komputer ke switch karena sesuai untuk jaringan LAN dalam satu ruangan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 21 - RANGKUMAN
// =====================================================

function page21(number = 21) {
    return normalPage(number,
        "Rangkuman Materi",
        "08 / RINGKASAN PEMBELAJARAN",
        `
        <p class="page-description">
            Berikut rangkuman materi media dan jaringan
            telekomunikasi yang telah dipelajari.
        </p>

        <div class="mindmap">
            <div class="mind-center">MEDIA TRANSMISI JARINGAN</div>

            <div class="mind-branches">
                <div class="mind-branch">
                    <h4>MEDIA KABEL</h4>
                    <p>
                        Twisted Pair<br>
                        Koaksial<br>
                        Fiber Optik
                    </p>
                </div>

                <div class="mind-branch">
                    <h4>MEDIA NIRKABEL</h4>
                    <p>
                        Gelombang Radio<br>
                        Microwave<br>
                        Infrared<br>
                        Satelit
                    </p>
                </div>
            </div>
        </div>

        ${contentList([
            "Media transmisi menjadi jalur pengiriman data antarperangkat.",
            "Media kabel menggunakan penghantar fisik.",
            "Media nirkabel menggunakan gelombang elektromagnetik.",
            "Setiap media memiliki kelebihan dan kekurangan.",
            "Pemilihan media harus disesuaikan dengan kebutuhan jaringan."
        ])}

        ${infoBox(
            "PESAN PEMBELAJARAN",
            "Memahami karakteristik media transmisi membantu kita merancang jaringan komputer yang sesuai dengan kebutuhan."
        )}
        `
    );
}

// =====================================================
// HALAMAN 22 - EVALUASI WAYGROUND
// =====================================================

function page22(number = 22) {
    return `
        <div class="quiz-page">
            <div class="quiz-label">09 / EVALUASI PEMBELAJARAN</div>

            <div class="quiz-art">📝</div>

            <h2>
                SAATNYA <span>MENGUJI</span><br>
                PEMAHAMANMU!
            </h2>

            <p>
                Kamu telah menyelesaikan materi Media dan Jaringan
                Telekomunikasi. Sekarang, kerjakan latihan soal
                untuk mengukur pemahamanmu.
            </p>

            <p>
                Bacalah setiap pertanyaan dengan teliti dan
                pilih jawaban yang paling tepat.
            </p>

            <a href="#" class="quiz-button" id="waygroundButton">
                MULAI EVALUASI WAYGROUND →
            </a>

            <div class="quiz-note">
                Klik tombol di atas untuk membuka latihan evaluasi.
            </div>

            ${pageFooter(number)}
        </div>
    `;
}

// =====================================================


// =====================================================
// TEMPLATE HALAMAN KUSTOM GURU (TEKS, GAMBAR, VIDEO)
// =====================================================

function renderCustomPage(pageData, number) {
    let contentHtml = "";

    // Deskripsi utama
    if (pageData.description) {
        contentHtml += `<p class="page-description">${escapeHtml(pageData.description).replace(/\n/g, '<br>')}</p>`;
    }

    // Media Gambar
    if (pageData.materialType === "image" && pageData.resolvedMediaSrc) {
        contentHtml += `
            <div class="custom-page-media-container custom-img-container">
                <img src="${pageData.resolvedMediaSrc}" alt="${escapeHtml(pageData.title)}" class="custom-page-img" />
                ${pageData.mediaCaption ? `<div class="custom-media-caption">${escapeHtml(pageData.mediaCaption)}</div>` : ""}
            </div>
        `;
    }
    // Media Video
    else if (pageData.materialType === "video" && (pageData.resolvedMediaSrc || pageData.videoUrl)) {
        if (pageData.videoSource === "youtube") {
            const embedUrl = getYouTubeEmbedUrl(pageData.videoUrl || pageData.resolvedMediaSrc);
            contentHtml += `
                <div class="custom-page-media-container custom-video-container">
                    <iframe src="${embedUrl}" title="${escapeHtml(pageData.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    ${pageData.mediaCaption ? `<div class="custom-media-caption">${escapeHtml(pageData.mediaCaption)}</div>` : ""}
                </div>
            `;
        } else {
            contentHtml += `
                <div class="custom-page-media-container custom-video-container">
                    <video controls playsinline preload="metadata" src="${pageData.resolvedMediaSrc}">
                        Browser Anda tidak mendukung pemutar video.
                    </video>
                    ${pageData.mediaCaption ? `<div class="custom-media-caption">${escapeHtml(pageData.mediaCaption)}</div>` : ""}
                </div>
            `;
        }
    }

    // Poin-poin checklist
    if (pageData.bullets && pageData.bullets.length > 0) {
        contentHtml += `<ul class="content-list custom-content-list">`;
        pageData.bullets.forEach((point, idx) => {
            const numStr = (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1);
            contentHtml += `
                <li>
                    <span class="check">${numStr}</span>
                    <span>${escapeHtml(point)}</span>
                </li>
            `;
        });
        contentHtml += `</ul>`;
    }

    // Info Box / Catatan Guru
    if (pageData.infoBox && pageData.infoBox.trim() !== "") {
        contentHtml += `
            <div class="info-box custom-info-box">
                <strong>CATATAN GURU</strong>
                ${escapeHtml(pageData.infoBox).replace(/\n/g, '<br>')}
            </div>
        `;
    }

    return `
        <div class="custom-page-wrapper">
            <div class="custom-page-scroll">
                <div class="page-kicker">${escapeHtml(pageData.kicker || "MATERI TAMBAHAN")}</div>
                <h2 class="page-title">${escapeHtml(pageData.title || "Materi Baru")}</h2>
                ${contentHtml}
            </div>
            ${pageFooter(number)}
        </div>
    `;
}

// =====================================================
// DAFTAR METADATA 22 HALAMAN KURIKULUM RESMI
// =====================================================

function getDefaultPagesMeta() {
    return [
        { id: "default_1", defaultNum: 1, title: "Sampul Pembelajaran", kicker: "NETBOOK / 01", isDefault: true, render: (n) => coverPage(n) },
        { id: "default_2", defaultNum: 2, title: "Tujuan Pembelajaran", kicker: "01 / LEARNING OBJECTIVES", isDefault: true, render: (n) => page2(n) },
        { id: "default_3", defaultNum: 3, title: "Pengertian Media Transmisi", kicker: "02 / PENGENALAN MEDIA JARINGAN", isDefault: true, render: (n) => page3(n) },
        { id: "default_4", defaultNum: 4, title: "Fungsi Media Transmisi", kicker: "02 / PENGENALAN MEDIA JARINGAN", isDefault: true, render: (n) => page4(n) },
        { id: "default_5", defaultNum: 5, title: "Jenis Media Transmisi", kicker: "02 / PENGENALAN MEDIA JARINGAN", isDefault: true, render: (n) => page5(n) },
        { id: "default_6", defaultNum: 6, title: "Kabel Twisted Pair", kicker: "03 / MEDIA TRANSMISI KABEL", isDefault: true, render: (n) => page6(n) },
        { id: "default_7", defaultNum: 7, title: "Jenis Kabel Twisted Pair", kicker: "03 / MEDIA TRANSMISI KABEL", isDefault: true, render: (n) => page7(n) },
        { id: "default_8", defaultNum: 8, title: "Kabel Koaksial", kicker: "03 / MEDIA TRANSMISI KABEL", isDefault: true, render: (n) => page8(n) },
        { id: "default_9", defaultNum: 9, title: "Pengertian Fiber Optik", kicker: "04 / MEDIA TRANSMISI FIBER OPTIK", isDefault: true, render: (n) => page9(n) },
        { id: "default_10", defaultNum: 10, title: "Struktur Fiber Optik", kicker: "04 / MEDIA TRANSMISI FIBER OPTIK", isDefault: true, render: (n) => page10(n) },
        { id: "default_11", defaultNum: 11, title: "Kelebihan & Kekurangan Fiber Optik", kicker: "04 / MEDIA TRANSMISI FIBER OPTIK", isDefault: true, render: (n) => page11(n) },
        { id: "default_12", defaultNum: 12, title: "Media Transmisi Nirkabel", kicker: "05 / MEDIA TRANSMISI NIRKABEL", isDefault: true, render: (n) => page12(n) },
        { id: "default_13", defaultNum: 13, title: "Jenis Media Nirkabel", kicker: "05 / MEDIA TRANSMISI NIRKABEL", isDefault: true, render: (n) => page13(n) },
        { id: "default_14", defaultNum: 14, title: "Wi-Fi dalam Jaringan Komputer", kicker: "05 / MEDIA TRANSMISI NIRKABEL", isDefault: true, render: (n) => page14(n) },
        { id: "default_15", defaultNum: 15, title: "Perbandingan Media Transmisi", kicker: "06 / ANALISIS MEDIA TRANSMISI", isDefault: true, render: (n) => page15(n) },
        { id: "default_16", defaultNum: 16, title: "Kelebihan & Kekurangan Media", kicker: "06 / ANALISIS MEDIA TRANSMISI", isDefault: true, render: (n) => page16(n) },
        { id: "default_17", defaultNum: 17, title: "Memilih Media yang Tepat", kicker: "06 / ANALISIS MEDIA TRANSMISI", isDefault: true, render: (n) => page17(n) },
        { id: "default_18", defaultNum: 18, title: "Penerapan di Lingkungan Sekolah", kicker: "07 / PENERAPAN MEDIA JARINGAN", isDefault: true, render: (n) => page18(n) },
        { id: "default_19", defaultNum: 19, title: "Penerapan di Rumah dan Kantor", kicker: "07 / PENERAPAN MEDIA JARINGAN", isDefault: true, render: (n) => page19(n) },
        { id: "default_20", defaultNum: 20, title: "Studi Kasus Pemilihan Media", kicker: "07 / PENERAPAN MEDIA JARINGAN", isDefault: true, render: (n) => page20(n) },
        { id: "default_21", defaultNum: 21, title: "Rangkuman Materi", kicker: "08 / RINGKASAN PEMBELAJARAN", isDefault: true, render: (n) => page21(n) },
        { id: "default_22", defaultNum: 22, title: "Evaluasi Wayground", kicker: "09 / EVALUASI PEMBELAJARAN", isDefault: true, render: (n) => page22(n) }
    ];
}

// =====================================================
// PENYIMPANAN MATERI GURU
// =====================================================

function getCustomPagesFromStorage() {
    try {
        const data = localStorage.getItem("flipbook_custom_pages");
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveCustomPagesToStorage(pages) {
    try {
        localStorage.setItem("flipbook_custom_pages", JSON.stringify(pages));
    } catch (e) {}
}

// Membangun masterPages (22 kurikulum + materi tambahan guru)
async function rebuildMasterPages() {
    const defaultPages = getDefaultPagesMeta();
    const customPages = getCustomPagesFromStorage();

    const customResolvedList = [];
    for (const cp of customPages) {
        let resolvedUrl = "";
        if (cp.materialType === "image") {
            if (cp.imageSource === "url") {
                resolvedUrl = cp.imageUrl || "";
            } else if (cp.mediaBlobId) {
                const blob = await getMediaBlob(cp.mediaBlobId);
                if (blob) resolvedUrl = URL.createObjectURL(blob);
            }
        } else if (cp.materialType === "video") {
            if (cp.videoSource === "youtube") {
                resolvedUrl = cp.videoUrl || "";
            } else if (cp.mediaBlobId) {
                const blob = await getMediaBlob(cp.mediaBlobId);
                if (blob) resolvedUrl = URL.createObjectURL(blob);
            }
        }

        const pageObj = {
            id: cp.id,
            type: "custom",
            title: cp.title,
            kicker: cp.kicker,
            materialType: cp.materialType,
            description: cp.description,
            bullets: cp.bullets || [],
            infoBox: cp.infoBox || "",
            mediaCaption: cp.mediaCaption || "",
            videoSource: cp.videoSource,
            videoUrl: cp.videoUrl,
            placement: cp.placement || "before_quiz",
            resolvedMediaSrc: resolvedUrl,
            rawCustomData: cp,
            render: (num) => renderCustomPage(pageObj, num)
        };
        customResolvedList.push(pageObj);
    }

    // Susun secara otomatis:
    // Halaman 1-21 -> Halaman Kustom (before_quiz) -> Halaman 22 (Wayground) -> Halaman Kustom (end)
    const d1to21 = defaultPages.slice(0, 21);
    const dWayground = defaultPages[21];

    const customBeforeQuiz = customResolvedList.filter(p => p.placement !== "end");
    const customAtEnd = customResolvedList.filter(p => p.placement === "end");

    masterPages = [...d1to21, ...customBeforeQuiz, dWayground, ...customAtEnd];

    // Perbarui counter
    const total = masterPages.length;
    if (totalPageText) totalPageText.textContent = String(total);
    const badge = document.getElementById("panelPageBadge");
    if (badge) badge.textContent = String(total);

    renderPageListTab();
}

function getTotalPages() {
    return masterPages.length || 22;
}

function getLastSpreadStart() {
    return Math.ceil((getTotalPages() - 1) / 2) * 2;
}

// =====================================================
// MERENDER HALAMAN SESUAI NOMOR
// =====================================================

function renderPage(number) {
    if (number === 0 || number > getTotalPages()) {
        return "";
    }

    const page = masterPages[number - 1];
    if (page && typeof page.render === "function") {
        return page.render(number);
    }

    return "";
}

// =====================================================
// PENGATURAN TOMBOL WAYGROUND
// =====================================================

function setupWayground() {
    const waygroundButton = document.getElementById("waygroundButton");
    if (!waygroundButton) return;

    const validLink =
        waygroundURL !== "MASUKKAN_LINK_WAYGROUND_DI_SINI" &&
        /^https?:\/\/(www\.)?(wayground\.com|quizizz\.com)\//i.test(waygroundURL);

    if (validLink) {
        waygroundButton.href = waygroundURL;
        waygroundButton.target = "_blank";
        waygroundButton.rel = "noopener noreferrer";
    } else {
        waygroundButton.href = "#";
        waygroundButton.onclick = function(event) {
            event.preventDefault();
            alert("Link Wayground belum diatur pada script.js.");
        };
    }
}

// =====================================================
// HALAMAN AKTIF & UPDATE DISPLAY
// =====================================================

function getActivePage() {
    if (isMobile) {
        return mobilePage;
    }
    if (spreadStart === 0) {
        return 1;
    }
    return Math.min(getTotalPages(), spreadStart + 1);
}

function isLastPage() {
    const total = getTotalPages();
    if (isMobile) {
        return mobilePage >= total;
    }
    return spreadStart >= getLastSpreadStart();
}

function updateDisplay() {
    flipSheet.className = "flip-sheet";

    if (isMobile) {
        leftContent.innerHTML = "";
        rightContent.innerHTML = renderPage(mobilePage);
    } else {
        const leftNumber = spreadStart;
        const rightNumber = spreadStart + 1;

        leftContent.innerHTML = renderPage(leftNumber);
        rightContent.innerHTML = renderPage(rightNumber);
    }

    const activePage = getActivePage();
    const total = getTotalPages();

    currentPageText.textContent = String(activePage).padStart(2, "0");
    totalPageText.textContent = String(total);

    progressBar.style.width = `${(activePage / total) * 100}%`;

    pageLabel.textContent =
        activePage === total
            ? "EVALUASI WAYGROUND"
            : activePage === 1
                ? "SAMPUL"
                : "MEDIA DAN JARINGAN";

    prevBtn.disabled =
        isMobile ? mobilePage === 1 : spreadStart === 0;

    nextBtn.disabled = isLastPage();

    setupWayground();
}

// Lompat langsung ke halaman yang dipilih di panel
function goToPage(targetPage) {
    const total = getTotalPages();
    targetPage = Math.max(1, Math.min(total, targetPage));

    if (isMobile) {
        mobilePage = targetPage;
    } else {
        if (targetPage === 1) {
            spreadStart = 0;
        } else {
            spreadStart = Math.ceil((targetPage - 1) / 2) * 2;
            spreadStart = Math.min(getLastSpreadStart(), spreadStart);
        }
    }

    updateDisplay();
}

// =====================================================
// ANIMASI FLIP BUKU
// =====================================================

function turnPage(direction) {
    if (isAnimating) return;

    if (direction === "next" && isLastPage()) return;
    if (
        direction === "prev" &&
        (isMobile ? mobilePage === 1 : spreadStart === 0)
    ) return;

    isAnimating = true;

    if (isMobile) {
        const current = mobilePage;
        const target = direction === "next" ? current + 1 : current - 1;

        flipFront.innerHTML = renderPage(current);
        flipBack.innerHTML = renderPage(target);

        flipSheet.className = "flip-sheet active";
        if (direction === "next") {
            flipSheet.classList.add("turn-next");
        } else {
            flipSheet.classList.add("turn-prev");
        }

        mobilePage = target;
    } else {
        if (direction === "next") {
            flipFront.innerHTML = renderPage(spreadStart + 1);
            flipBack.innerHTML = renderPage(spreadStart + 2);
            flipSheet.className = "flip-sheet active turn-next";

            spreadStart = Math.min(
                getLastSpreadStart(),
                spreadStart + 2
            );
        } else {
            flipFront.innerHTML = renderPage(spreadStart);
            flipBack.innerHTML = renderPage(spreadStart - 1);
            flipSheet.className = "flip-sheet active turn-prev";

            spreadStart = Math.max(0, spreadStart - 2);
        }
    }

    setTimeout(() => {
        updateDisplay();
        isAnimating = false;
    }, ANIMATION_DURATION);
}

// =====================================================
// EVENT NAVIGASI
// =====================================================

nextBtn.addEventListener("click", () => turnPage("next"));
prevBtn.addEventListener("click", () => turnPage("prev"));

coverBtn.addEventListener("click", () => {
    if (isAnimating) return;
    mobilePage = 1;
    spreadStart = 0;
    updateDisplay();
});

document.addEventListener("keydown", (event) => {
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.tagName === "SELECT"
    ) return;

    if (event.key === "ArrowRight") {
        turnPage("next");
    }
    if (event.key === "ArrowLeft") {
        turnPage("prev");
    }
});

if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen tidak tersedia:", error);
        }
    });
}

// Responsive switch
const mobileQuery = window.matchMedia("(max-width: 600px)");

function handleResponsive() {
    const newMode = mobileQuery.matches;
    if (newMode === isMobile) return;

    if (isAnimating) {
        flipSheet.className = "flip-sheet";
        isAnimating = false;
    }

    const total = getTotalPages();
    if (newMode) {
        mobilePage = Math.min(
            total,
            spreadStart === 0 ? 1 : spreadStart + 1
        );
    } else {
        spreadStart = Math.ceil((mobilePage - 1) / 2) * 2;
        spreadStart = Math.min(getLastSpreadStart(), spreadStart);
    }

    isMobile = newMode;
    updateDisplay();
}

if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", handleResponsive);
} else {
    mobileQuery.addListener(handleResponsive);
}

// =====================================================
// AUTENTIKASI GURU (LOGIN, LOGOUT, GANTI PIN)
// =====================================================

const DEFAULT_PIN = "guru123";

function getTeacherPin() {
    return localStorage.getItem("flipbook_teacher_pin") || DEFAULT_PIN;
}

function setTeacherPin(newPin) {
    localStorage.setItem("flipbook_teacher_pin", newPin);
}

function isTeacherSessionActive() {
    return sessionStorage.getItem("flipbook_teacher_active") === "true";
}

function setTeacherSessionActive(active) {
    sessionStorage.setItem("flipbook_teacher_active", active ? "true" : "false");
    updateTeacherHeaderButton();
}

function updateTeacherHeaderButton() {
    const openBtn = document.getElementById("openTeacherPanelBtn");
    const activeDot = document.getElementById("teacherActiveDot");
    const lockIcon = document.getElementById("panelLockIcon");

    if (!openBtn) return;

    if (isTeacherSessionActive()) {
        openBtn.classList.add("active-session");
        if (activeDot) activeDot.style.display = "inline-block";
        if (lockIcon) lockIcon.textContent = "🔓";
    } else {
        openBtn.classList.remove("active-session");
        if (activeDot) activeDot.style.display = "none";
        if (lockIcon) lockIcon.textContent = "🔒";
    }
}

// =====================================================
// MODAL CONTROLLERS (LOGIN & PANEL GURU)
// =====================================================

const authModal = document.getElementById("teacherAuthModal");
const panelModal = document.getElementById("teacherPanelModal");
const openTeacherPanelBtn = document.getElementById("openTeacherPanelBtn");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const closePanelModalBtn = document.getElementById("closePanelModalBtn");
const logoutTeacherBtn = document.getElementById("logoutTeacherBtn");

const teacherPinInput = document.getElementById("teacherPinInput");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const submitLoginBtn = document.getElementById("submitLoginBtn");
const authErrorMsg = document.getElementById("authErrorMsg");

function handleTeacherBtnClick(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (isTeacherSessionActive()) {
        openPanel();
    } else {
        openAuth();
    }
}

if (openTeacherPanelBtn) {
    openTeacherPanelBtn.addEventListener("click", handleTeacherBtnClick);
}

function openAuth() {
    const modal = document.getElementById("teacherAuthModal");
    const pinInput = document.getElementById("teacherPinInput");
    const errMsg = document.getElementById("authErrorMsg");
    if (modal) {
        modal.classList.add("active");
        modal.style.display = "flex";
        if (pinInput) {
            pinInput.value = "";
            setTimeout(() => {
                try { pinInput.focus(); } catch (err) {}
            }, 100);
        }
        if (errMsg) errMsg.style.display = "none";
    }
}

function closeAuth() {
    const modal = document.getElementById("teacherAuthModal");
    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "none";
    }
}

if (closeAuthModalBtn) closeAuthModalBtn.addEventListener("click", closeAuth);

if (togglePasswordBtn && teacherPinInput) {
    togglePasswordBtn.addEventListener("click", () => {
        if (teacherPinInput.type === "password") {
            teacherPinInput.type = "text";
            togglePasswordBtn.textContent = "🙈";
        } else {
            teacherPinInput.type = "password";
            togglePasswordBtn.textContent = "👁️";
        }
    });
}

function verifyLogin() {
    const pinInput = document.getElementById("teacherPinInput");
    const errMsg = document.getElementById("authErrorMsg");
    if (!pinInput) return;
    const enteredPin = pinInput.value.trim();
    if (enteredPin === getTeacherPin()) {
        setTeacherSessionActive(true);
        closeAuth();
        openPanel();
        showToast("Berhasil masuk ke Panel Guru!", "success");
    } else {
        if (errMsg) {
            errMsg.textContent = "PIN salah. Gunakan PIN bawaan: guru123";
            errMsg.style.display = "block";
        }
    }
}

if (submitLoginBtn) submitLoginBtn.addEventListener("click", verifyLogin);
if (teacherPinInput) {
    teacherPinInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            verifyLogin();
        }
    });
}

function openPanel() {
    const modal = document.getElementById("teacherPanelModal");
    if (modal) {
        modal.classList.add("active");
        modal.style.display = "flex";
        renderPageListTab();
    }
}

function closePanel() {
    const modal = document.getElementById("teacherPanelModal");
    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "none";
    }
}

if (closePanelModalBtn) closePanelModalBtn.addEventListener("click", closePanel);

// Ekspos fungsi ke global window agar selalu bisa dipanggil langsung
window.handleTeacherBtnClick = handleTeacherBtnClick;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.openPanel = openPanel;
window.closePanel = closePanel;
window.verifyLogin = verifyLogin;

if (logoutTeacherBtn) {
    logoutTeacherBtn.addEventListener("click", () => {
        setTeacherSessionActive(false);
        closePanel();
        showToast("Sesi guru ditutup.", "info");
    });
}

// Tutup modal jika klik backdrop
[authModal, panelModal].forEach(m => {
    if (m) {
        m.addEventListener("click", (e) => {
            if (e.target === m) m.style.display = "none";
        });
    }
});

// =====================================================
// PANEL TABS (SEDERHANA: TAMBAH, KELOLA, GANTI PIN)
// =====================================================

const panelTabs = document.querySelectorAll(".panel-tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

panelTabs.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetTabId = btn.getAttribute("data-tab");

        panelTabs.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => {
            c.classList.remove("active");
            c.style.display = "none";
        });

        btn.classList.add("active");
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) {
            targetContent.classList.add("active");
            targetContent.style.display = "block";
        }

        if (targetTabId === "navList") {
            renderPageListTab();
        }
    });
});

// =====================================================
// FORM PENAMBAHAN MATERI
// =====================================================

let editingPageId = null;
let tempImageBlob = null;
let tempVideoBlob = null;

const materialTypeRadios = document.querySelectorAll("input[name='materialType']");
const imageSection = document.getElementById("imageInputSection");
const videoSection = document.getElementById("videoInputSection");

materialTypeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
        radio.closest(".type-card").classList.add("active");

        const val = e.target.value;
        if (val === "image") {
            imageSection.style.display = "block";
            videoSection.style.display = "none";
        } else if (val === "video") {
            imageSection.style.display = "none";
            videoSection.style.display = "block";
        } else {
            imageSection.style.display = "none";
            videoSection.style.display = "none";
        }
    });
});

// Gambar: Upload vs URL
const imageSourceRadios = document.querySelectorAll("input[name='imageSource']");
const imageUploadWrapper = document.getElementById("imageUploadWrapper");
const imageUrlWrapper = document.getElementById("imageUrlWrapper");

imageSourceRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.value === "upload") {
            imageUploadWrapper.style.display = "block";
            imageUrlWrapper.style.display = "none";
        } else {
            imageUploadWrapper.style.display = "none";
            imageUrlWrapper.style.display = "block";
        }
    });
});

// Video: YouTube vs Upload
const videoSourceRadios = document.querySelectorAll("input[name='videoSource']");
const videoYoutubeWrapper = document.getElementById("videoYoutubeWrapper");
const videoUploadWrapper = document.getElementById("videoUploadWrapper");

videoSourceRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.value === "youtube") {
            videoYoutubeWrapper.style.display = "block";
            videoUploadWrapper.style.display = "none";
        } else {
            videoYoutubeWrapper.style.display = "none";
            videoUploadWrapper.style.display = "block";
        }
    });
});

// Gambar file handler
const imageFileInput = document.getElementById("imageFileInput");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreviewElement = document.getElementById("imagePreviewElement");
const removeImageBtn = document.getElementById("removeImageBtn");

if (imageFileInput) {
    imageFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            tempImageBlob = file;
            imagePreviewElement.src = URL.createObjectURL(file);
            imagePreviewContainer.style.display = "flex";
        }
    });
}

if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => {
        tempImageBlob = null;
        imagePreviewElement.src = "";
        imagePreviewContainer.style.display = "none";
        if (imageFileInput) imageFileInput.value = "";
    });
}

// Video file handler
const videoFileInput = document.getElementById("videoFileInput");
const videoPreviewContainer = document.getElementById("videoPreviewContainer");
const videoPreviewPlayerArea = document.getElementById("videoPreviewPlayerArea");
const removeVideoBtn = document.getElementById("removeVideoBtn");

if (videoFileInput) {
    videoFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            tempVideoBlob = file;
            const url = URL.createObjectURL(file);
            videoPreviewPlayerArea.innerHTML = `<video controls style="max-height:180px; width:100%; border-radius:6px;" src="${url}"></video>`;
            videoPreviewContainer.style.display = "flex";
        }
    });
}

if (removeVideoBtn) {
    removeVideoBtn.addEventListener("click", () => {
        tempVideoBlob = null;
        videoPreviewPlayerArea.innerHTML = "";
        videoPreviewContainer.style.display = "none";
        if (videoFileInput) videoFileInput.value = "";
    });
}

// Reset form
const resetFormBtn = document.getElementById("resetFormBtn");
if (resetFormBtn) resetFormBtn.addEventListener("click", clearMaterialForm);

function clearMaterialForm() {
    editingPageId = null;
    tempImageBlob = null;
    tempVideoBlob = null;

    document.getElementById("editModeBanner").style.display = "none";
    document.getElementById("pageTitle").value = "";
    document.getElementById("pageKicker").value = "04 / MATERI TAMBAHAN";
    document.getElementById("pageDescription").value = "";
    document.getElementById("pageBullets").value = "";
    document.getElementById("pageInfoBox").value = "";
    document.getElementById("imageCaption").value = "";
    document.getElementById("imageUrlInput").value = "";
    document.getElementById("youtubeUrlInput").value = "";
    document.getElementById("videoCaption").value = "";

    if (imageFileInput) imageFileInput.value = "";
    if (videoFileInput) videoFileInput.value = "";
    if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
    if (videoPreviewContainer) videoPreviewContainer.style.display = "none";

    const textRadio = document.querySelector("input[name='materialType'][value='text']");
    if (textRadio) {
        textRadio.checked = true;
        textRadio.dispatchEvent(new Event("change"));
    }
}

const cancelEditBtn = document.getElementById("cancelEditBtn");
if (cancelEditBtn) cancelEditBtn.addEventListener("click", clearMaterialForm);

// Simpan materi
const saveMaterialBtn = document.getElementById("saveMaterialBtn");
if (saveMaterialBtn) saveMaterialBtn.addEventListener("click", saveMaterial);

async function saveMaterial() {
    const title = document.getElementById("pageTitle").value.trim();
    const kicker = document.getElementById("pageKicker").value.trim() || "MATERI TAMBAHAN";
    const description = document.getElementById("pageDescription").value.trim();

    if (!title) {
        alert("Judul materi wajib diisi!");
        document.getElementById("pageTitle").focus();
        return;
    }
    if (!description) {
        alert("Isi materi wajib diisi!");
        document.getElementById("pageDescription").focus();
        return;
    }

    const selectedType = document.querySelector("input[name='materialType']:checked").value;
    const bulletsRaw = document.getElementById("pageBullets").value.trim();
    const bullets = bulletsRaw ? bulletsRaw.split("\n").map(s => s.trim()).filter(Boolean) : [];
    const infoBox = document.getElementById("pageInfoBox").value.trim();
    const placementVal = document.getElementById("pagePlacement").value || "before_quiz";

    let mediaBlobId = null;
    let imageUrl = "";
    let videoUrl = "";
    let mediaCaption = "";
    let imageSource = "upload";
    let videoSource = "youtube";

    if (selectedType === "image") {
        imageSource = document.querySelector("input[name='imageSource']:checked").value;
        mediaCaption = document.getElementById("imageCaption").value.trim();
        if (imageSource === "upload") {
            if (tempImageBlob) {
                mediaBlobId = "img_" + Date.now();
                await saveMediaBlob(mediaBlobId, tempImageBlob);
            }
        } else {
            imageUrl = document.getElementById("imageUrlInput").value.trim();
        }
    } else if (selectedType === "video") {
        videoSource = document.querySelector("input[name='videoSource']:checked").value;
        mediaCaption = document.getElementById("videoCaption").value.trim();
        if (videoSource === "youtube") {
            videoUrl = document.getElementById("youtubeUrlInput").value.trim();
        } else {
            if (tempVideoBlob) {
                mediaBlobId = "vid_" + Date.now();
                await saveMediaBlob(mediaBlobId, tempVideoBlob);
            }
        }
    }

    const customPages = getCustomPagesFromStorage();

    if (editingPageId) {
        const idx = customPages.findIndex(p => p.id === editingPageId);
        if (idx !== -1) {
            const existing = customPages[idx];
            existing.title = title;
            existing.kicker = kicker;
            existing.description = description;
            existing.materialType = selectedType;
            existing.bullets = bullets;
            existing.infoBox = infoBox;
            existing.mediaCaption = mediaCaption;

            if (selectedType === "image") {
                existing.imageSource = imageSource;
                existing.imageUrl = imageUrl;
                if (mediaBlobId) existing.mediaBlobId = mediaBlobId;
            } else if (selectedType === "video") {
                existing.videoSource = videoSource;
                existing.videoUrl = videoUrl;
                if (mediaBlobId) existing.mediaBlobId = mediaBlobId;
            }
        }
        saveCustomPagesToStorage(customPages);
        showToast("Materi berhasil diperbarui!", "success");
    } else {
        const newPage = {
            id: "page_" + Date.now(),
            type: "custom",
            title: title,
            kicker: kicker,
            description: description,
            materialType: selectedType,
            bullets: bullets,
            infoBox: infoBox,
            imageSource: imageSource,
            imageUrl: imageUrl,
            videoSource: videoSource,
            videoUrl: videoUrl,
            mediaBlobId: mediaBlobId,
            mediaCaption: mediaCaption,
            placement: placementVal,
            createdAt: Date.now()
        };
        customPages.push(newPage);
        saveCustomPagesToStorage(customPages);
        showToast("Materi baru berhasil ditambahkan!", "success");
    }

    clearMaterialForm();
    await rebuildMasterPages();
    updateDisplay();

    // Buka tab kelola halaman
    const tabBtnList = document.getElementById("tabBtnList");
    if (tabBtnList) tabBtnList.click();
}

// =====================================================
// TAB 2: DAFTAR SEMUA HALAMAN (KURIKULUM + GURU)
// =====================================================

function renderPageListTab() {
    const container = document.getElementById("pageListContainer");
    if (!container) return;

    container.innerHTML = "";

    masterPages.forEach((page, index) => {
        const pageNum = index + 1;
        const isDefault = page.type !== "custom";

        let mediaTag = "";
        if (!isDefault) {
            if (page.materialType === "image") mediaTag = `<span class="badge-tag tag-media">🖼️ Gambar</span>`;
            else if (page.materialType === "video") mediaTag = `<span class="badge-tag tag-media">🎬 Video</span>`;
            else mediaTag = `<span class="badge-tag tag-media">📝 Teks</span>`;
        } else if (page.id === "default_1") {
            mediaTag = `<span class="badge-tag curriculum">📘 Sampul</span>`;
        } else if (page.id === "default_22") {
            mediaTag = `<span class="badge-tag tag-media">📝 Evaluasi</span>`;
        }

        const card = document.createElement("div");
        card.className = `page-list-item ${isDefault ? "" : "is-custom"}`;

        card.innerHTML = `
            <div class="item-left">
                <div class="item-num">${pageNum}</div>
                <div class="item-info">
                    <div class="item-title">${escapeHtml(page.title || "Halaman " + pageNum)}</div>
                    <div class="item-meta">
                        <span class="badge-tag ${isDefault ? "curriculum" : "teacher-material"}">
                            ${isDefault ? "Kurikulum 22 Halaman" : "Materi Guru"}
                        </span>
                        ${mediaTag}
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <button type="button" class="item-btn btn-view" title="Buka halaman ini di buku" data-action="view" data-page="${pageNum}">
                    📖 Buka
                </button>
                ${!isDefault ? `
                    <button type="button" class="item-btn" title="Edit materi ini" data-action="edit" data-id="${page.id}">
                        ✏️ Edit
                    </button>
                    <button type="button" class="item-btn btn-delete" title="Hapus materi ini" data-action="delete" data-id="${page.id}">
                        🗑️ Hapus
                    </button>
                ` : ""}
            </div>
        `;

        container.appendChild(card);
    });

    container.querySelectorAll(".item-btn").forEach(btn => {
        btn.addEventListener("click", handlePageAction);
    });
}

async function handlePageAction(e) {
    const action = e.currentTarget.getAttribute("data-action");
    const pageNum = parseInt(e.currentTarget.getAttribute("data-page"), 10);
    const id = e.currentTarget.getAttribute("data-id");

    if (action === "view") {
        closePanel();
        goToPage(pageNum);
    } else if (action === "edit") {
        editCustomPage(id);
    } else if (action === "delete") {
        deleteCustomPage(id);
    }
}

function editCustomPage(pageId) {
    const customPages = getCustomPagesFromStorage();
    const page = customPages.find(p => p.id === pageId);
    if (!page) return;

    editingPageId = page.id;

    document.getElementById("editModeBanner").style.display = "flex";
    document.getElementById("editPageTitlePreview").textContent = page.title;

    document.getElementById("pageTitle").value = page.title || "";
    document.getElementById("pageKicker").value = page.kicker || "04 / MATERI TAMBAHAN";
    document.getElementById("pageDescription").value = page.description || "";
    document.getElementById("pageBullets").value = (page.bullets || []).join("\n");
    document.getElementById("pageInfoBox").value = page.infoBox || "";

    const typeRadio = document.querySelector(`input[name='materialType'][value='${page.materialType}']`);
    if (typeRadio) {
        typeRadio.checked = true;
        typeRadio.dispatchEvent(new Event("change"));
    }

    if (page.materialType === "image") {
        const srcRadio = document.querySelector(`input[name='imageSource'][value='${page.imageSource || "upload"}']`);
        if (srcRadio) {
            srcRadio.checked = true;
            srcRadio.dispatchEvent(new Event("change"));
        }
        document.getElementById("imageUrlInput").value = page.imageUrl || "";
        document.getElementById("imageCaption").value = page.mediaCaption || "";
    } else if (page.materialType === "video") {
        const vRadio = document.querySelector(`input[name='videoSource'][value='${page.videoSource || "youtube"}']`);
        if (vRadio) {
            vRadio.checked = true;
            vRadio.dispatchEvent(new Event("change"));
        }
        document.getElementById("youtubeUrlInput").value = page.videoUrl || "";
        document.getElementById("videoCaption").value = page.mediaCaption || "";
    }

    const tabBtnAdd = document.getElementById("tabBtnAdd");
    if (tabBtnAdd) tabBtnAdd.click();
}

async function deleteCustomPage(pageId) {
    if (!confirm("Hapus materi ini dari flipbook?")) return;

    let customPages = getCustomPagesFromStorage();
    const target = customPages.find(p => p.id === pageId);
    if (target && target.mediaBlobId) {
        await deleteMediaBlob(target.mediaBlobId);
    }

    customPages = customPages.filter(p => p.id !== pageId);
    saveCustomPagesToStorage(customPages);

    await rebuildMasterPages();
    updateDisplay();
    showToast("Materi berhasil dihapus.", "info");
}

// =====================================================
// TAB 3: GANTI PIN GURU & RESET
// =====================================================

const saveNewPinBtn = document.getElementById("saveNewPinBtn");
if (saveNewPinBtn) {
    saveNewPinBtn.addEventListener("click", () => {
        const oldPin = document.getElementById("oldPinInput").value.trim();
        const newPin = document.getElementById("newPinInput").value.trim();
        const confirmPin = document.getElementById("confirmPinInput").value.trim();

        if (oldPin !== getTeacherPin()) {
            alert("PIN lama Anda tidak cocok!");
            return;
        }
        if (newPin.length < 4) {
            alert("PIN baru minimal harus 4 karakter!");
            return;
        }
        if (newPin !== confirmPin) {
            alert("Konfirmasi PIN baru tidak sama!");
            return;
        }

        setTeacherPin(newPin);
        document.getElementById("oldPinInput").value = "";
        document.getElementById("newPinInput").value = "";
        document.getElementById("confirmPinInput").value = "";

        showToast("PIN akses guru berhasil diubah!", "success");
    });
}

const resetAllMaterialsBtn = document.getElementById("resetAllMaterialsBtn");
if (resetAllMaterialsBtn) {
    resetAllMaterialsBtn.addEventListener("click", async () => {
        if (!confirm("Hapus semua materi tambahan guru dan kembali ke 22 halaman standar?")) {
            return;
        }

        localStorage.removeItem("flipbook_custom_pages");
        await clearAllMediaBlobs();

        await rebuildMasterPages();
        mobilePage = 1;
        spreadStart = 0;
        updateDisplay();

        showToast("Flipbook kembali ke 22 halaman kurikulum awal.", "info");
    });
}

// =====================================================
// INISIALISASI FLIPBOOK
// =====================================================

async function initializeFlipbook() {
    isMobile = mobileQuery.matches;
    mobilePage = 1;
    spreadStart = 0;

    updateTeacherHeaderButton();
    await rebuildMasterPages();
    updateDisplay();

    console.log("Flipbook 22 Halaman berhasil diinisialisasi.");
    console.log("Total Halaman:", getTotalPages());
}

initializeFlipbook();
