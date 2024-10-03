// Fungsi untuk memulai undangan dan memutar musik
 function openinvit() {
            // Inisialisasi AOS jika dibutuhkan
            AOS.refresh();

            // Menjalankan audio
            var audio = document.getElementById('audioElement');
            audio.play();

            // Tambahkan kelas untuk animasi
            var home = document.getElementById('home');
            if (home) {
                home.classList.add('fadeUp');
            }
        }

let und = '';
let untuk = '';
let htmlrekening = '';
let htmlgallery1 = '';
let htmlgallery2 = '';
let urlgmaps = '';
let eventData = {}; // Variabel global untuk menyimpan data acara
const hariNama = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const bulanNama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function loadPage() {
    const urlParams = new URLSearchParams(window.location.search);
    und = urlParams.get('undangan') || '';
    untuk = urlParams.get('untuk') || '';

    document.getElementById('namateman').innerHTML = untuk;

    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();
    // Mengambil data berdasarkan undangan dari Firebase
    fetch(`https://posdata-16c78-default-rtdb.firebaseio.com/userdatabaru/${und}.json`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                eventData = data; // Simpan data di variabel global
                console.log(eventData);  // Lihat detail data di konsol

                // Format tanggal acara
                const tanggal = new Date(eventData.tanggalAcara);
                const hari = hariNama[tanggal.getDay()];
                const tanggalHari = tanggal.getDate();
                const bulan = bulanNama[tanggal.getMonth()];
                const tahun = tanggal.getFullYear();
                const tanggalFormatted = `${hari}, ${tanggalHari} ${bulan} ${tahun}`;

                // Tampilkan data di DOM
                document.getElementById('panggilan2manten').innerHTML = `${eventData.namamantenpanggilpria} & ${eventData.namaPanggilanWanita}`;
                document.getElementById('tanggalmenikah').innerHTML = tanggalFormatted;
                document.getElementById('namalengkappria').innerHTML = eventData.namamantenpria;
                document.getElementById('orangtua').innerHTML = `Bapak ${eventData.namaAyahPria} & Ibu ${eventData.namaIbuPria}`;
                document.getElementById('namalengkapwanita').innerHTML = eventData.namaWanita;
                document.getElementById('orangtuawanita').innerHTML = `Bapak ${eventData.namaAyahWanita} & Ibu ${eventData.namaIbuWanita}`;
                document.getElementById('akad').innerHTML = `${eventData.akadAcara}`;
                document.getElementById('resepsi').innerHTML = `${eventData.resepsiAcara}`;
                document.getElementById('lokasi').innerHTML = eventData.lokasiAcara;
                urlgmaps = eventData.urlgmaps;

                fotopria.src = eventData.fotopria || 'gambar-home.jpg';
                fotowanita.src = eventData.fotoWanita || 'gambar-home.jpg';

                // Proses rekening
                if (Array.isArray(eventData.datarek)) {
                    let iconbank = '';
                    eventData.datarek.forEach(function (x) {
                        if (x.namaBank === 'Bca') {
                            iconbank = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1598px-Bank_Central_Asia.svg.png';
                        } else if (x.namaBank === 'Bri') {
                            iconbank = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/640px-BANK_BRI_logo.svg.png';
                        } else if (x.namaBank === 'Bni') {
                            iconbank = 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1024px-BNI_logo.svg.png';
                        } else if (x.namaBank === 'Dana') {
                            iconbank = 'dana.jpg';
                        }
                        htmlrekening += `
                        <div class="border border-info rounded-4 shadow" style="padding: 10px; display: flex; justify-content: space-evenly; font-family: Josefin Sans;" data-aos="fade-up">
                            <div>
                                <img src="${iconbank}" alt="Rekening ${x.namaBank}" class="img-rek rounded">
                                <p id="rek${x.namaBank}">${x.norek}</p><span>A/n ${x.namarek}</span>
                            </div>
                            <div style="text-align: center;">
                                <i class="bi bi-clipboard" onclick="copy('${x.norek}')"></i>
                                <span>Salin</span>
                            </div>
                        </div><br>`;
                    });
                    document.getElementById('datarekening').innerHTML = htmlrekening;
                } else {
                    console.error('datarek bukan array atau tidak tersedia');
                }

                // Proses galeri
                if (Array.isArray(eventData.datagallery)) {
                    eventData.datagallery.forEach(function (i, index) {
                        // Tiga item pertama ke carousel1
                        if (index < 3) {
                            htmlgallery1 += `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${i.urlgallery}" class="d-block w-100 rounded-4" alt="...">
                            </div>`;
                        }
                        // Sisanya ke carousel2
                        else {
                            htmlgallery2 += `
                            <div class="carousel-item ${index === 3 ? 'active' : ''}">
                                <img src="${i.urlgallery}" class="d-block w-100 rounded-4" alt="...">
                            </div>`;
                        }
                    });

                    // Jika galeri di carousel1 dan carousel2 tersedia, render ke DOM
                    if (htmlgallery1) {
                        document.getElementById('carousel1').innerHTML = htmlgallery1;
                    }

                    if (htmlgallery2) {
                        document.getElementById('carousel2').innerHTML = htmlgallery2;
                    }
                } else {
                    console.error('datagallery bukan array atau tidak tersedia');
                }

                // Update countdown setiap 1 detik
                const countdownFunction = setInterval(function () {
                    const now = new Date().getTime();
                    const distance = tanggal - now;

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    document.getElementById("countdown").innerHTML = `${days} Hari, ${hours} Jam, ${minutes} Menit, ${seconds} Detik`;

                    if (distance < 0) {
                        clearInterval(countdownFunction);
                        document.getElementById("countdown").innerHTML = "Waktu habis!";
                    }
                }, 1000);
            } else {
                console.log('Err: anda harus membuat undangan terlebih dahulu')
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerHTML = 'Terjadi kesalahan, silakan coba lagi nanti.';
        });

    // Mengambil data dari Firebase dan menampilkannya
    fetch(`https://apigame-18b26-default-rtdb.firebaseio.com/rsvp/${und}.json`)
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('dataList');
            dataList.innerHTML = ''; // Kosongkan konten lama

            // Pastikan data tidak null atau undefined
            if (data) {
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        let entry = data[key];
                        const listItem = document.createElement('li');
                        listItem.setAttribute('data-aos', 'fade-right');

                        listItem.innerHTML = `
                <div class="card rounded-3 border border-primary shadow"
                    style="padding: 10px; font-family: Josefin Sans; font-size: 11px; position: relative;" data-aos="fade-right">
                    Nama : ${entry.nama || 'Tidak ada nama'}<br>
                    Konfirmasi kehadiran : ${entry.kehadiran || 'Tidak ada konfirmasi'}<br>
                    Ucapan: ${entry.ucapan || 'Tidak ada ucapan'}
                    <div style="position: absolute; right: 10px; bottom: 10px; font-size: 15px;">
                        <i class="bi bi-heart"></i>
                        <i class="bi bi-chat-left"></i>
                    </div>
                </div><br>`;

                        dataList.appendChild(listItem);
                    }
                }
            } else {
                console.log('Data tidak ditemukan');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function trigertosaveDate() {
    // Pastikan variabel eventData terisi
    if (!eventData.namamantenpanggilpria || !eventData.tanggalAcara || !eventData.lokasiAcara) {
        console.error('Data acara tidak lengkap:', eventData);
        return; // Hentikan eksekusi jika ada data yang tidak lengkap
    }

    // Cek apakah tanggalAcara adalah string yang valid
    const tanggalAcara = new Date(eventData.tanggalAcara);
    if (isNaN(tanggalAcara)) {
        console.error('Tanggal acara tidak valid:', eventData.tanggalAcara);
        return; // Hentikan eksekusi jika tanggal tidak valid
    }

    const eventTitle = eventData.namamantenpanggilpria; // Judul acara
    const startDateTime = tanggalAcara.toISOString().replace(/-|:|\.\d+/g, ""); // Format untuk Google Calendar
    const endDateTime = tanggalAcara.toISOString().replace(/-|:|\.\d+/g, ""); // Contoh: set akhir acara sama dengan mulai (ubah sesuai kebutuhan)
    const location = eventData.lokasiAcara; // Lokasi acara
    const description = "Kami mengundang Anda untuk menghadiri acara pernikahan kami.";
    
    saveToGoogleCalendar(eventTitle, startDateTime, endDateTime, location, description);
}

let kehadiran = "";

// Formulir RSVP
document.getElementById('rsvpForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Tambahkan kehadiran ke dalam data
    data.kehadiran = kehadiran;

    // Validasi: Cek jika ada data yang kosong
    if (!data.nama || !data.ucapan || !data.kehadiran) {
        Swal.fire({
            title: "Data tidak lengkap",
            text: "Harap lengkapi semua field sebelum mengirim!",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return; // Hentikan eksekusi jika validasi gagal
    }

    // Lanjutkan pengiriman jika semua data valid
    fetch(`https://apigame-18b26-default-rtdb.firebaseio.com/rsvp/${und}.json`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            loadPage();
            Swal.fire({
                title: "Berhasil mengirim ucapan",
                text: "Silahkan refresh halaman untuk melihat ucapan anda di bawah",
                icon: "success"
            });
            console.log('Success:', data);
        })
        .catch(error => {
            Swal.fire({
                title: "Gagal mengirim ucapan",
                text: "Kayanya ada yang salah deh",
                icon: "error"
            });
            console.error('Error:', error);
        });
});




// Fungsi untuk menyalin teks
function copy(norek) {
    // Membuat elemen textarea untuk menyalin teks
    const tempInput = document.createElement("textarea");
    tempInput.value = norek;
    document.body.appendChild(tempInput);

    // Menyalin teks ke clipboard
    tempInput.select();
    document.execCommand("copy");

    // Menghapus elemen textarea setelah penyalinan selesai
    document.body.removeChild(tempInput);

    // Menampilkan notifikasi menggunakan SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Tersalin',
        text: `Nomor rekening ${norek} berhasil disalin!`,
        showConfirmButton: false,
        timer: 1500
    });
}
function lihatalamat() {
    location.href = urlgmaps;
}

function setkehadiran(jawaban) {
    kehadiran = jawaban;
    console.log(jawaban)
}
function saveToGoogleCalendar(eventTitle, startDateTime, endDateTime, location, description) {
    // Format tanggal ke format Google Calendar (YYYYMMDDTHHmmSSZ)
    const start = new Date(startDateTime).toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(endDateTime).toISOString().replace(/-|:|\.\d+/g, "");

    // Encode the parameters to be URL-safe
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    // Membuka link Google Calendar di tab baru
    window.open(calendarUrl, '_blank');
}

loadPage()
