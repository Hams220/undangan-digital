// Fungsi untuk memulai undangan dan memutar musik
function openinvit() {
    
    document.getElementById('home').style.display = 'none'; // Sembunyikan elemen home
    const dataNikah1 = document.getElementById('dataNikah1');
    const mempelai = document.getElementById('mempelai');

    dataNikah1.style.display = 'flex'; // Tampilkan elemen dataNikah1
    mempelai.style.display = 'block'; // Tampilkan elemen mempelai
    dataNikah1.classList.add("fade-up"); // Tambahkan animasi fade-up ke dataNikah1
    
    AOS.refresh();
    var audio = document.getElementById("myAudio");
    audio.currentTime = 0; // Mulai musik dari detik 0
    audio.play(); // Putar musik
}

let und = '';
let untuk = '';
let htmlrekening = '';
let htmlgallery = '';
let urlgmaps ='';
const hariNama = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const bulanNama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    und = urlParams.get('undangan') || '';
    untuk = urlParams.get('untuk') || '';
    
    document.getElementById('namateman').innerHTML = untuk;

    // Mengambil data berdasarkan undangan dari Firebase
    fetch(`https://posdata-16c78-default-rtdb.firebaseio.com/userdatabaru/${und}.json`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Proses data jika tidak null atau undefined
                Object.keys(data).forEach(key => {
                    let user = data[key];
                    console.log(user);  // Lihat detail data di konsol

                    // Format tanggal acara
                    const tanggal = new Date(user.tanggalAcara);
                    const hari = hariNama[tanggal.getDay()];
                    const tanggalHari = tanggal.getDate();
                    const bulan = bulanNama[tanggal.getMonth()];
                    const tahun = tanggal.getFullYear();
                    const tanggalFormatted = `${hari}, ${tanggalHari} ${bulan} ${tahun}`;
                    
                    // Tampilkan data di DOM
                    document.getElementById('panggilan2manten').innerHTML = `${user.namamantenpanggilpria} & ${user.namaPanggilanWanita}`;
                    document.getElementById('tanggalmenikah').innerHTML = tanggalFormatted;
                    document.getElementById('namalengkappria').innerHTML = user.namamantenpria;
                    document.getElementById('orangtua').innerHTML = `Bapak ${user.namaAyahPria} & Ibu ${user.namaIbuPria}`;
                    document.getElementById('namalengkapwanita').innerHTML = user.namaWanita;
                    document.getElementById('orangtuawanita').innerHTML = `Bapak ${user.namaAyahWanita} & Ibu ${user.namaIbuWanita}`;
                    document.getElementById('akad').innerHTML = `Pukul ${user.akadAcara} - selesai`;
                    document.getElementById('resepsi').innerHTML = `Pukul ${user.resepsiAcara} - selesai`;
                    document.getElementById('lokasi').innerHTML = user.lokasiAcara;
                    urlgmaps = user.urlgmaps;

                    if(user.fotopria == ''){
                        fotopria.src = 'gambar-home.jpg'
                    }else{
                        fotopria.src = user.fotoWanita
                    }

                    if(user.v == ''){
                        fotowanita.src = 'gambar-home.jpg'
                    }else{
                        fotowanita.src = user.fotoWanita
                    }
                    
                    // Proses rekening
                    if (Array.isArray(user.datarek)) {
                        user.datarek.forEach(function (x) {
                            htmlrekening += `
                                <div class="border border-primary rounded shadow" style="padding: 10px; display: flex; justify-content: space-evenly; font-family: Josefin Sans;" data-aos="fade-left">
                                    <div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/640px-BANK_BRI_logo.svg.png" alt="Rekening BRI" class="img-rek rounded">
                                        <p id="rek${x.namabank}">${x.norek}</p><span>A/n ${x.namarek}</span>
                                    </div>
                                    <div style="text-align: center;">
                                        <i class="bi bi-clipboard" onclick="copy('#rek${x.namabank}')"></i>
                                        <span>Salin</span>
                                    </div>
                                </div><br>`;
                        });
                        document.getElementById('datarekening').innerHTML = htmlrekening;
                    } else {
                        console.error('datarek bukan array atau tidak tersedia');
                    }

                    // Proses galeri
                    if (Array.isArray(user.datagallery)) {
                        user.datagallery.forEach(function (i, index) {
                            htmlgallery += `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${i.urlgallery}" class="d-block w-100 rounded-4" alt="...">
                                </div>`;
                        });
                        document.getElementById('carousel1').innerHTML = htmlgallery;
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
                });
            } else {
                document.write('Err: anda harus membuat undangan terlebih dahulu')
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

    Object.keys(data).forEach(key => {
        const entry = data[key];
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div class="border border-primary rounded shadow" style="padding:10px;">
                <strong>Dari:</strong> ${entry.nama || 'Tidak ada nama'}<br>
                <strong>Ucapan:</strong> ${entry.ucapan || 'Tidak ada ucapan'}<br>
                <strong>Konfirmasi kehadiran:</strong> ${entry.kehadiran || 'Tidak ada konfirmasi'}
            </div><br/>`;

        dataList.appendChild(listItem);
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});
};
// Formulir RSVP
document.getElementById('rsvpForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch(`https://apigame-18b26-default-rtdb.firebaseio.com/rsvp/${und}.json`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
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
function copy(selector) {
    const textElement = document.querySelector(selector);

    const tempInput = document.createElement("input");
    tempInput.value = textElement.textContent.trim();
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(tempInput.value);
    document.body.removeChild(tempInput);

    Swal.fire({
        title: "Berhasil menyalin nomor rekening",
        icon: "success"
    });
}
function lihatalamat(){
    location.href=urlgmaps;
}
