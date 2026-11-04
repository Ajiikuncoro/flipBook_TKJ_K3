// =====================================================
// NETBOOK - MEDIA DAN JARINGAN TELEKOMUNIKASI
// KELOMPOK 3 - 2026
// =====================================================

// GANTI DENGAN LINK EVALUASI WAYGROUND KELOMPOK
const waygroundURL = "https://wayground.com/join?gc=63289187";

const TOTAL_PAGES = 22;
const ANIMATION_DURATION = 850;

// =====================================================
// ELEMEN HTML
// =====================================================

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

const fullscreenBtn = document.getElementById("fullscreenBtn");

// =====================================================
// STATUS FLIPBOOK
// =====================================================

// Mobile: satu halaman ditampilkan
let isMobile = window.matchMedia("(max-width: 600px)").matches;
let mobilePage = 1;

// Desktop: dua halaman ditampilkan sekaligus.
// 0 adalah halaman kosong sebelum sampul.
let spreadStart = 0;

let isAnimating = false;

const LAST_SPREAD_START = Math.ceil((TOTAL_PAGES - 1) / 2) * 2;

totalPageText.textContent = TOTAL_PAGES;

// =====================================================
// KOMPONEN HALAMAN
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

function coverPage() {
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

            ${pageFooter(1)}
        </div>
    `;
}

// =====================================================
// HALAMAN 2 - TUJUAN PEMBELAJARAN
// =====================================================

function page2() {
    return normalPage(
        2,
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

function page3() {
    return normalPage(
        3,
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

function page4() {
    return normalPage(
        4,
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

function page5() {
    return normalPage(
        5,
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

function page6() {
    return normalPage(
        6,
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

function page7() {
    return normalPage(
        7,
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

function page8() {
    return normalPage(
        8,
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

function page9() {
    return normalPage(
        9,
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

function page10() {
    return normalPage(
        10,
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

function page11() {
    return normalPage(
        11,
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

function page12() {
    return normalPage(
        12,
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

function page13() {
    return normalPage(
        13,
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

function page14() {
    return normalPage(
        14,
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

function page15() {
    return normalPage(
        15,
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

function page16() {
    return normalPage(
        16,
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

function page17() {
    return normalPage(
        17,
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

function page18() {
    return normalPage(
        18,
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

function page19() {
    return normalPage(
        19,
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

function page20() {
    return normalPage(
        20,
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

function page21() {
    return normalPage(
        21,
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

function page22() {
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

            ${pageFooter(22)}
        </div>
    `;
}

// =====================================================
// MENAMPILKAN HALAMAN
// =====================================================

function renderPage(number) {
    const pageFunctions = {
        1: coverPage,
        2: page2,
        3: page3,
        4: page4,
        5: page5,
        6: page6,
        7: page7,
        8: page8,
        9: page9,
        10: page10,
        11: page11,
        12: page12,
        13: page13,
        14: page14,
        15: page15,
        16: page16,
        17: page17,
        18: page18,
        19: page19,
        20: page20,
        21: page21,
        22: page22
    };

    if (number === 0 || number > TOTAL_PAGES) {
        return "";
    }

    return pageFunctions[number] ? pageFunctions[number]() : "";
}

// =====================================================
// LINK WAYGROUND
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
            alert(
                "Link Wayground belum diatur. Masukkan link evaluasi pada variabel waygroundURL di file script.js."
            );
        };
    }
}

// =====================================================
// HALAMAN AKTIF
// =====================================================

function getActivePage() {
    if (isMobile) {
        return mobilePage;
    }

    if (spreadStart === 0) {
        return 1;
    }

    return Math.min(TOTAL_PAGES, spreadStart + 1);
}

// =====================================================
// MEMPERBARUI TAMPILAN
// =====================================================

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

    currentPageText.textContent = String(activePage).padStart(2, "0");
    totalPageText.textContent = String(TOTAL_PAGES);

    progressBar.style.width =
        `${(activePage / TOTAL_PAGES) * 100}%`;

    pageLabel.textContent =
        activePage === TOTAL_PAGES
            ? "EVALUASI WAYGROUND"
            : activePage === 1
                ? "SAMPUL"
                : "MEDIA DAN JARINGAN";

    prevBtn.disabled =
        isMobile ? mobilePage === 1 : spreadStart === 0;

    nextBtn.disabled = isLastPage();

    setupWayground();
}

// =====================================================
// CEK HALAMAN TERAKHIR
// =====================================================

function isLastPage() {
    if (isMobile) {
        return mobilePage >= TOTAL_PAGES;
    }

    return spreadStart >= LAST_SPREAD_START;
}

// =====================================================
// NAVIGASI HALAMAN
// =====================================================

function turnPage(direction) {
    if (isAnimating) return;

    if (direction === "next" && isLastPage()) return;

    if (
        direction === "prev" &&
        (isMobile ? mobilePage === 1 : spreadStart === 0)
    ) {
        return;
    }

    isAnimating = true;

    if (isMobile) {
        const current = mobilePage;
        const target = direction === "next"
            ? current + 1
            : current - 1;

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
                LAST_SPREAD_START,
                spreadStart + 2
            );

        } else {
            flipFront.innerHTML = renderPage(spreadStart);
            flipBack.innerHTML = renderPage(spreadStart - 1);

            flipSheet.className = "flip-sheet active turn-prev";

            spreadStart = Math.max(0, spreadStart - 2);
        }
    }

    // Tampilan utama diperbarui setelah animasi selesai.
    setTimeout(() => {
        updateDisplay();
        isAnimating = false;
    }, ANIMATION_DURATION);
}

// =====================================================
// TOMBOL NAVIGASI
// =====================================================

nextBtn.addEventListener("click", () => {
    turnPage("next");
});

prevBtn.addEventListener("click", () => {
    turnPage("prev");
});

// =====================================================
// KEMBALI KE SAMPUL
// =====================================================

coverBtn.addEventListener("click", () => {
    if (isAnimating) return;

    mobilePage = 1;
    spreadStart = 0;

    updateDisplay();
});

// =====================================================
// FULLSCREEN
// =====================================================

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

// =====================================================
// NAVIGASI KEYBOARD
// =====================================================

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        turnPage("next");
    }

    if (event.key === "ArrowLeft") {
        turnPage("prev");
    }
});

// =====================================================
// RESPONSIVE: HP DAN LAPTOP
// =====================================================

const mobileQuery = window.matchMedia("(max-width: 600px)");

function handleResponsive() {
    const newMode = mobileQuery.matches;

    if (newMode === isMobile) return;

    if (isAnimating) {
        flipSheet.className = "flip-sheet";
        isAnimating = false;
    }

    if (newMode) {
        // Desktop ke HP.
        // Tampilkan halaman kanan yang sebelumnya terlihat.
        mobilePage = Math.min(
            TOTAL_PAGES,
            spreadStart === 0 ? 1 : spreadStart + 1
        );

    } else {
        // HP ke desktop.
        // Sesuaikan ke pasangan halaman terdekat.
        spreadStart = Math.ceil((mobilePage - 1) / 2) * 2;

        spreadStart = Math.min(
            LAST_SPREAD_START,
            spreadStart
        );
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
// INISIALISASI FLIPBOOK
// =====================================================

function initializeFlipbook() {
    isMobile = mobileQuery.matches;

    mobilePage = 1;
    spreadStart = 0;

    updateDisplay();

    console.log("Flipbook berhasil diinisialisasi.");
    console.log("Jumlah halaman:", TOTAL_PAGES);
    console.log(
        "Mode tampilan:",
        isMobile ? "Single Page" : "Double Page"
    );
}

initializeFlipbook();
