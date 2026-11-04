// =====================================================
// FLIPBOOK MEDIA PEMBELAJARAN INTERAKTIF
// MEDIA DAN JARINGAN TELEKOMUNIKASI
// KELOMPOK 3 - 2026
// =====================================================

// MASUKKAN LINK QUIZIZZ ASLI DI SINI
const quizizzURL = "MASUKKAN_LINK_QUIZIZZ_DI_SINI";

const TOTAL_PAGES = 10;

// Elemen HTML
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

totalPageText.textContent = TOTAL_PAGES;

// =====================================================
// STATUS FLIPBOOK
// =====================================================

let isMobile = window.matchMedia("(max-width: 600px)").matches;

// Mobile: halaman aktif 1-10
let mobilePage = 1;

// Desktop: halaman kiri dan kanan.
// 0 berarti halaman kosong sebelum cover.
let spreadStart = 0;

let isAnimating = false;

const ANIMATION_DURATION = 850;

// =====================================================
// KOMPONEN NOMOR HALAMAN
// =====================================================

function pageFooter(number) {
    return `
        <div class="page-number">
            <span>NETBOOK • MEDIA JARINGAN</span>
            <b>${number}</b>
        </div>
    `;
}

// =====================================================
// TEMPLATE HALAMAN MATERI
// =====================================================

function normalPage(number, title, kicker, content) {
    return `
        <div class="page-kicker">${kicker}</div>
        <h2 class="page-title">${title}</h2>
        ${content}
        ${pageFooter(number)}
    `;
}

// =====================================================
// HALAMAN 1 - COVER
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
                    <strong>ELEmen</strong><br>
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
            Setelah mempelajari materi ini, siswa diharapkan
            mampu memahami berbagai media transmisi jaringan
            dan penggunaannya.
        </p>

        <div class="content-list">

            <li>
                <span class="check">01</span>
                <span>Menjelaskan pengertian dan fungsi media transmisi dalam jaringan komputer.</span>
            </li>

            <li>
                <span class="check">02</span>
                <span>Mengidentifikasi jenis media transmisi kabel dan nirkabel.</span>
            </li>

            <li>
                <span class="check">03</span>
                <span>Membedakan karakteristik twisted pair, koaksial, dan fiber optik.</span>
            </li>

            <li>
                <span class="check">04</span>
                <span>Menganalisis kelebihan dan kekurangan media kabel dan nirkabel.</span>
            </li>

            <li>
                <span class="check">05</span>
                <span>Memilih media transmisi sesuai kebutuhan jaringan sederhana.</span>
            </li>

        </div>

        <div class="info-box">
            <strong>CAPAIAN PEMBELAJARAN</strong>
            Menerapkan berbagai media dalam membangun jaringan
            pada teknik jaringan komputer dan telekomunikasi.
        </div>
        `
    );
}

// =====================================================
// HALAMAN 3 - PENGENALAN MEDIA JARINGAN
// =====================================================

function page3() {
    return normalPage(
        3,
        "Pengenalan Media Jaringan",
        "02 / NETWORK TRANSMISSION",
        `
        <p class="page-description">
            Media transmisi adalah jalur yang digunakan
            untuk mengirimkan data dari satu perangkat
            ke perangkat lainnya dalam jaringan komputer.
        </p>

        <div class="section-label">BAGAIMANA DATA DIKIRIM?</div>

        <div class="diagram">

            <div class="diagram-node">
                <div class="diagram-icon">💻</div>
                <small>Pengirim</small>
            </div>

            <div class="diagram-arrow">→</div>

            <div class="diagram-node">
                <div class="diagram-icon">〰️</div>
                <small>Media</small>
            </div>

            <div class="diagram-arrow">→</div>

            <div class="diagram-node">
                <div class="diagram-icon">🖥️</div>
                <small>Penerima</small>
            </div>

        </div>

        <h3 class="section-label">FUNGSI MEDIA TRANSMISI</h3>

        <ul class="content-list">
            <li>
                <span class="check">✓</span>
                <span>Menjadi jalur pengiriman data antarperangkat.</span>
            </li>

            <li>
                <span class="check">✓</span>
                <span>Menghubungkan komputer dalam suatu jaringan.</span>
            </li>

            <li>
                <span class="check">✓</span>
                <span>Membantu proses komunikasi dan pertukaran informasi.</span>
            </li>
        </ul>

        <div class="info-box">
            <strong>CONTOH SEHARI-HARI</strong>
            Ketika komputer mengakses internet melalui Wi-Fi,
            data dikirim menggunakan gelombang radio.
            Sementara koneksi LAN menggunakan kabel jaringan.
        </div>

        <p class="page-description" style="margin-top:9px">
            Secara umum, media transmisi dibagi menjadi dua,
            yaitu media kabel (wired) dan media nirkabel
            (wireless).
        </p>
        `
    );
}

// =====================================================
// HALAMAN 4 - TWISTED PAIR DAN KOAKSIAL
// =====================================================

function page4() {
    return normalPage(
        4,
        "Media Kabel: Twisted Pair dan Koaksial",
        "03 / WIRED TRANSMISSION",
        `
        <p class="page-description">
            Media kabel mengirimkan data melalui penghantar
            fisik yang menghubungkan perangkat jaringan.
        </p>

        <div class="cable-visual">

            <div class="cable-line">
                <span>UTP / STP</span>
                <div class="wire"></div>
            </div>

            <div class="cable-line">
                <span>Koaksial</span>
                <div class="wire coax"></div>
            </div>

        </div>

        <h3 class="section-label">1. TWISTED PAIR</h3>

        <p class="page-description">
            Kabel twisted pair terdiri dari pasangan kawat
            tembaga yang dipilin untuk membantu mengurangi
            gangguan sinyal.
        </p>

        <div class="cards">

            <div class="mini-card">
                <div class="symbol">🔌</div>
                <h4>UTP</h4>
                <p>
                    Tidak memiliki pelindung tambahan.
                    Umum digunakan pada jaringan LAN.
                </p>
            </div>

            <div class="mini-card">
                <div class="symbol">🛡️</div>
                <h4>STP</h4>
                <p>
                    Memiliki lapisan pelindung untuk
                    membantu mengurangi interferensi.
                </p>
            </div>

        </div>

        <div class="info-box">
            <strong>KONEKTOR</strong>
            Twisted pair umumnya menggunakan konektor RJ-45
            pada jaringan Ethernet.
        </div>

        <h3 class="section-label" style="margin-top:10px">
            2. KABEL KOAKSIAL
        </h3>

        <p class="page-description">
            Kabel koaksial memiliki konduktor inti,
            isolator, pelindung logam, dan lapisan luar.
            Digunakan antara lain pada televisi kabel
            dan sistem komunikasi tertentu.
        </p>

        <div class="info-box">
            <strong>KONEKTOR</strong>
            Contoh konektor yang digunakan adalah BNC.
        </div>
        `
    );
}

// =====================================================
// HALAMAN 5 - FIBER OPTIK
// =====================================================

function page5() {
    return normalPage(
        5,
        "Media Kabel: Fiber Optik",
        "04 / OPTICAL FIBER",
        `
        <p class="page-description">
            Fiber optik adalah media transmisi yang
            menggunakan cahaya untuk membawa informasi
            melalui serat kaca atau plastik khusus.
        </p>

        <div class="cable-visual">

            <div class="cable-line">
                <span>Struktur</span>
                <div class="wire fiber"></div>
            </div>

            <div class="diagram">
                <div class="diagram-node">
                    <div class="diagram-icon">💡</div>
                    <small>Sumber cahaya</small>
                </div>

                <div class="diagram-arrow">→</div>

                <div class="diagram-node">
                    <div class="diagram-icon">✨</div>
                    <small>Serat optik</small>
                </div>

                <div class="diagram-arrow">→</div>

                <div class="diagram-node">
                    <div class="diagram-icon">📡</div>
                    <small>Penerima</small>
                </div>
            </div>

        </div>

        <h3 class="section-label">STRUKTUR DASAR</h3>

        <ul class="content-list">

            <li>
                <span class="check">1</span>
                <span><b>Core:</b> bagian inti tempat cahaya merambat.</span>
            </li>

            <li>
                <span class="check">2</span>
                <span><b>Cladding:</b> lapisan yang membantu menjaga cahaya tetap berada dalam inti.</span>
            </li>

            <li>
                <span class="check">3</span>
                <span><b>Coating:</b> lapisan pelindung serat.</span>
            </li>

        </ul>

        <div class="cards">

            <div class="mini-card">
                <h4>KELEBIHAN</h4>
                <p>
                    Kecepatan dan kapasitas tinggi,
                    dapat menjangkau jarak jauh,
                    serta tahan terhadap interferensi elektromagnetik.
                </p>
            </div>

            <div class="mini-card">
                <h4>KEKURANGAN</h4>
                <p>
                    Biaya perangkat dan instalasi
                    relatif lebih tinggi serta
                    membutuhkan penanganan khusus.
                </p>
            </div>

        </div>

        <div class="info-box">
            <strong>CONTOH PENERAPAN</strong>
            Digunakan pada jaringan backbone,
            jaringan antargedung, dan layanan internet
            berbasis fiber optik.
        </div>
        `
    );
}

// =====================================================
// HALAMAN 6 - MEDIA NIRKABEL
// =====================================================

function page6() {
    return normalPage(
        6,
        "Media Transmisi Nirkabel",
        "05 / WIRELESS TRANSMISSION",
        `
        <p class="page-description">
            Media nirkabel adalah media transmisi yang
            mengirimkan data tanpa menggunakan kabel fisik.
            Pengiriman data memanfaatkan gelombang
            elektromagnetik.
        </p>

        <div class="cards">

            <div class="mini-card">
                <div class="symbol">📶</div>
                <h4>RADIO / WI-FI</h4>
                <p>
                    Menggunakan gelombang radio untuk
                    menghubungkan perangkat secara nirkabel.
                    Contohnya jaringan Wi-Fi.
                </p>
            </div>

            <div class="mini-card">
                <div class="symbol">📡</div>
                <h4>MICROWAVE</h4>
                <p>
                    Menggunakan gelombang mikro.
                    Umumnya digunakan untuk komunikasi
                    antartitik dengan jalur yang sesuai.
                </p>
            </div>

            <div class="mini-card">
                <div class="symbol">🔴</div>
                <h4>INFRAMERAH</h4>
                <p>
                    Menggunakan radiasi inframerah.
                    Umumnya digunakan pada komunikasi
                    jarak dekat.
                </p>
            </div>

            <div class="mini-card">
                <div class="symbol">📱</div>
                <h4>PERANGKAT</h4>
                <p>
                    Contoh perangkat penerima dan pengirim
                    adalah smartphone, laptop, dan access point.
                </p>
            </div>

        </div>

        <h3 class="section-label" style="margin-top:12px">
            CARA KERJA SEDERHANA
        </h3>

        <div class="diagram">

            <div class="diagram-node">
                <div class="diagram-icon">💻</div>
                <small>Pengirim</small>
            </div>

            <div class="diagram-arrow">〰</div>

            <div class="diagram-node">
                <div class="diagram-icon">📶</div>
                <small>Gelombang</small>
            </div>

            <div class="diagram-arrow">〰</div>

            <div class="diagram-node">
                <div class="diagram-icon">📱</div>
                <small>Penerima</small>
            </div>

        </div>

        <div class="info-box">
            <strong>KEUNGGULAN</strong>
            Fleksibel, mendukung mobilitas, dan tidak
            memerlukan pemasangan kabel ke setiap perangkat.
        </div>

        <p class="page-description" style="margin-top:8px">
            Kualitas koneksi nirkabel dapat dipengaruhi
            jarak, penghalang, interferensi, dan kondisi
            lingkungan.
        </p>
        `
    );
}

// =====================================================
// HALAMAN 7 - PERBANDINGAN MEDIA
// =====================================================

function page7() {
    return normalPage(
        7,
        "Perbandingan Media Kabel dan Nirkabel",
        "06 / MEDIA COMPARISON",
        `
        <p class="page-description">
            Setiap media memiliki karakteristik yang berbeda.
            Pemilihannya harus disesuaikan dengan kebutuhan
            jaringan.
        </p>

        <table class="compare-table">

            <thead>
                <tr>
                    <th>ASPEK</th>
                    <th>KABEL</th>
                    <th>NIRKABEL</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>Kecepatan</td>
                    <td>Umumnya stabil</td>
                    <td>Bervariasi</td>
                </tr>

                <tr>
                    <td>Jangkauan</td>
                    <td>Tergantung jenis kabel</td>
                    <td>Tergantung sinyal</td>
                </tr>

                <tr>
                    <td>Biaya</td>
                    <td>Instalasi kabel</td>
                    <td>Perangkat nirkabel</td>
                </tr>

                <tr>
                    <td>Pemasangan</td>
                    <td>Perlu jalur kabel</td>
                    <td>Lebih fleksibel</td>
                </tr>

                <tr>
                    <td>Keamanan</td>
                    <td>Akses fisik perlu dijaga</td>
                    <td>Perlu enkripsi</td>
                </tr>
            </tbody>

        </table>

        <div class="info-box">
            <strong>HAL YANG PERLU DIINGAT</strong>
            Media kabel umumnya memberikan koneksi yang
            lebih konsisten. Media nirkabel memberikan
            fleksibilitas dan mobilitas lebih tinggi.
        </div>

        <p class="page-description" style="margin-top:10px">
            Tidak ada satu media yang selalu paling baik.
            Pilihan bergantung pada kebutuhan, kondisi
            lingkungan, anggaran, dan tujuan jaringan.
        </p>
        `
    );
}

// =====================================================
// HALAMAN 8 - PENERAPAN MEDIA
// =====================================================

function page8() {
    return normalPage(
        8,
        "Penerapan Media dalam Jaringan",
        "07 / REAL WORLD APPLICATION",
        `
        <p class="page-description">
            Pemilihan media transmisi harus memperhatikan
            kebutuhan pengguna, jarak, dan kondisi lokasi.
        </p>

        <div class="case-item">
            <h4>01. LABORATORIUM KOMPUTER SEKOLAH</h4>
            <p>
                <b class="recommendation">Rekomendasi: Kabel UTP.</b>
                <br>
                Setiap komputer dapat dihubungkan ke switch
                menggunakan kabel UTP. Pilihan ini sesuai
                untuk koneksi lokal yang stabil dan mudah
                dikelola.
            </p>
        </div>

        <div class="case-item">
            <h4>02. JARINGAN ANTARGEDUNG</h4>
            <p>
                <b class="recommendation">Rekomendasi: Fiber optik.</b>
                <br>
                Fiber optik cocok dipertimbangkan untuk
                menghubungkan gedung yang berjauhan karena
                mendukung kapasitas tinggi dan memiliki
                ketahanan terhadap interferensi listrik.
            </p>
        </div>

        <div class="case-item">
            <h4>03. AREA PUBLIK</h4>
            <p>
                <b class="recommendation">Rekomendasi: Wi-Fi.</b>
                <br>
                Access point dapat menyediakan akses
                jaringan bagi banyak pengguna tanpa harus
                menghubungkan kabel langsung ke setiap
                perangkat.
            </p>
        </div>

        <div class="info-box">
            <strong>KESIMPULAN KASUS</strong>
            Media transmisi harus dipilih berdasarkan
            kebutuhan jaringan, bukan hanya berdasarkan
            kecepatan atau harga.
        </div>
        `
    );
}

// =====================================================
// HALAMAN 9 - RINGKASAN
// =====================================================

function page9() {
    return normalPage(
        9,
        "Ringkasan Materi",
        "08 / LEARNING SUMMARY",
        `
        <p class="page-description">
            Berikut rangkuman materi yang sudah dipelajari
            dari awal hingga akhir.
        </p>

        <div class="mindmap">

            <div class="mind-center">
                MEDIA TRANSMISI JARINGAN
            </div>

            <div class="mind-branches">

                <div class="mind-branch">
                    <h4>MEDIA KABEL</h4>
                    <p>
                        Twisted Pair<br>
                        UTP / STP<br>
                        Koaksial<br>
                        Fiber Optik
                    </p>
                </div>

                <div class="mind-branch">
                    <h4>MEDIA NIRKABEL</h4>
                    <p>
                        Gelombang Radio<br>
                        Wi-Fi<br>
                        Microwave<br>
                        Inframerah
                    </p>
                </div>

            </div>

        </div>

        <div class="content-list">

            <li>
                <span class="check">1</span>
                <span>Media transmisi merupakan jalur untuk mengirimkan data.</span>
            </li>

            <li>
                <span class="check">2</span>
                <span>Media kabel menggunakan penghantar fisik.</span>
            </li>

            <li>
                <span class="check">3</span>
                <span>Fiber optik mengirimkan informasi menggunakan cahaya.</span>
            </li>

            <li>
                <span class="check">4</span>
                <span>Media nirkabel menggunakan gelombang elektromagnetik.</span>
            </li>

            <li>
                <span class="check">5</span>
                <span>Pemilihan media harus sesuai dengan kebutuhan jaringan.</span>
            </li>

        </div>

        <div class="info-box">
            <strong>SIAP UNTUK EVALUASI?</strong>
            Sekarang, uji pemahamanmu melalui latihan
            Quizizz pada halaman berikutnya!
        </div>
        `
    );
}

// =====================================================
// HALAMAN 10 - QUIZIZZ
// =====================================================

function page10() {
    return `
        <div class="quiz-page">

            <div class="quiz-label">
                09 / LEARNING EVALUATION
            </div>

            <div class="quiz-art">
                📝
            </div>

            <h2>
                SEBERAPA JAUH KAMU
                <span>MEMAHAMI MATERI INI?</span>
            </h2>

            <p>
                Selamat! Kamu sudah mempelajari berbagai
                jenis media transmisi jaringan komputer.
                Sekarang waktunya menguji pemahamanmu.
            </p>

            <p>
                Kerjakan latihan Quizizz untuk mengetahui
                sejauh mana kamu memahami materi yang
                telah dipelajari.
            </p>

            <a href="#" id="quizButton"
               class="quiz-button"
               target="_blank"
               rel="noopener noreferrer">
                ▶ MULAI LATIHAN QUIZIZZ
            </a>

            <div class="quiz-note">
                Latihan • Evaluasi • Ukur Pemahaman
            </div>

            <div style="margin-top:15px;font-size:8px;color:#20d6d2">
                GOOD LUCK & KEEP LEARNING!
            </div>

            ${pageFooter(10)}

        </div>
    `;
}

// =====================================================
// FUNGSI MENGHASILKAN HALAMAN
// =====================================================

function renderPage(number) {

    switch (number) {

        case 0:
            return `
                <div class="page-inner"
                     style="background:#e8e6dc">
                </div>
            `;

        case 1:
            return coverPage();

        case 2:
            return page2();

        case 3:
            return page3();

        case 4:
            return page4();

        case 5:
            return page5();

        case 6:
            return page6();

        case 7:
            return page7();

        case 8:
            return page8();

        case 9:
            return page9();

        case 10:
            return page10();

        default:
            return "";
    }
}

// =====================================================
// PENGATURAN TOMBOL QUIZIZZ
// =====================================================

function setupQuizizz() {

    const quizButton = document.getElementById("quizButton");

    if (!quizButton) return;

    const validURL =
        quizizzURL !== "MASUKKAN_LINK_QUIZIZZ_DI_SINI" &&
        /^https:\/\/(www\.)?quizizz\.com\//i.test(quizizzURL);

    if (validURL) {

        quizButton.href = quizizzURL;

    } else {

        quizButton.href = "#";

        quizButton.addEventListener("click", function(event) {
            event.preventDefault();

            alert(
                "Link Quizizz belum dimasukkan. " +
                "Silakan masukkan link Quizizz asli " +
                "pada variabel quizizzURL di script.js."
            );
        });
    }
}

// =====================================================
// MENGATUR TAMPILAN HALAMAN
// =====================================================

function updateDisplay() {

    if (isMobile) {

        leftContent.innerHTML = "";
        rightContent.innerHTML = renderPage(mobilePage);

        currentPageText.textContent = mobilePage;

        progressBar.style.width =
            (mobilePage / TOTAL_PAGES * 100) + "%";

        pageLabel.textContent =
            mobilePage === 1 ? "COVER" :
            mobilePage === 10 ? "EVALUASI QUIZIZZ" :
            "HALAMAN " + mobilePage;

    } else {

        const leftNumber = spreadStart;
        const rightNumber = spreadStart + 1;

        leftContent.innerHTML = renderPage(leftNumber);
        rightContent.innerHTML = renderPage(rightNumber);

        // Halaman aktif yang ditampilkan
        const activeNumber =
            rightNumber <= TOTAL_PAGES ?
            rightNumber : leftNumber;

        currentPageText.textContent = activeNumber;

        progressBar.style.width =
            (activeNumber / TOTAL_PAGES * 100) + "%";

        pageLabel.textContent =
            spreadStart === 0 ? "COVER" :
            activeNumber === 10 ? "EVALUASI QUIZIZZ" :
            "HALAMAN " + activeNumber;
    }

    prevBtn.disabled = isFirstPage();
    nextBtn.disabled = isLastPage();

    setupQuizizz();
}

// =====================================================
// CEK HALAMAN PERTAMA DAN TERAKHIR
// =====================================================

function isFirstPage() {

    if (isMobile) {
        return mobilePage === 1;
    }

    return spreadStart === 0;
}

function isLastPage() {

    if (isMobile) {
        return mobilePage === TOTAL_PAGES;
    }

    return spreadStart >= 10;
}

// =====================================================
// ANIMASI MEMBALIK HALAMAN
// =====================================================

function turnPage(direction) {

    if (isAnimating) return;

    if (direction === "next" && isLastPage()) return;
    if (direction === "prev" && isFirstPage()) return;

    isAnimating = true;

    if (isMobile) {

        const current = mobilePage;

        if (direction === "next") {

            flipFront.innerHTML = renderPage(current);
            flipBack.innerHTML = renderPage(current + 1);

            flipSheet.className = "flip-sheet active turn-next";

        } else {

            flipFront.innerHTML = renderPage(current);
            flipBack.innerHTML = renderPage(current - 1);

            flipSheet.className = "flip-sheet active turn-prev";
        }

    } else {

        if (direction === "next") {

            flipFront.innerHTML = renderPage(spreadStart + 1);
            flipBack.innerHTML = renderPage(spreadStart + 2);

            flipSheet.className = "flip-sheet active turn-next";

        } else {

            flipFront.innerHTML = renderPage(spreadStart);
            flipBack.innerHTML = renderPage(spreadStart - 1);

            flipSheet.className = "flip-sheet active turn-prev";
        }
    }

    setTimeout(() => {

        if (isMobile) {

            if (direction === "next") {
                mobilePage++;
            } else {
                mobilePage--;
            }

        } else {

            if (direction === "next") {
                spreadStart += 2;
            } else {
                spreadStart -= 2;
            }
        }

        flipSheet.className = "flip-sheet";

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
// KEMBALI KE COVER
// =====================================================

coverBtn.addEventListener("click", () => {

    if (isAnimating) return;

    if (isMobile) {

        mobilePage = 1;

    } else {

        spreadStart = 0;
    }

    updateDisplay();
});

// =====================================================
// NAVIGASI KEYBOARD
// =====================================================

document.addEventListener("keydown", function(event) {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) return;

    if (event.key === "ArrowRight") {

        event.preventDefault();
        turnPage("next");

    } else if (event.key === "ArrowLeft") {

        event.preventDefault();
        turnPage("prev");

    }
});

// =====================================================
// FULLSCREEN
// =====================================================

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

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
// RESPONSIVE: DETEKSI UKURAN LAYAR
// =====================================================

const mobileQuery = window.matchMedia("(max-width: 600px)");

function handleResponsive() {

    const newMode = mobileQuery.matches;

    if (newMode === isMobile) return;

    isMobile = newMode;

    // Menentukan halaman aktif saat berpindah mode
    if (isMobile) {

        // Mode HP: satu halaman
        mobilePage = Math.min(
            TOTAL_PAGES,
            spreadStart + 1
        );

        if (mobilePage < 1) {
            mobilePage = 1;
        }

    } else {

        // Mode laptop/PC: dua halaman
        // Menyesuaikan ke pasangan halaman terdekat
        spreadStart = Math.floor(mobilePage / 2) * 2;

    }

    // Menghapus animasi yang sedang aktif
    flipSheet.className = "flip-sheet";

    // Memperbarui tampilan flipbook
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
    console.log("Mode tampilan:", isMobile ? "Single Page" : "Double Page");
}

initializeFlipbook();

// =====================================================
// SELESAI
// =====================================================