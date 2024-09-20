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
let htmlgallery1 = '';
let htmlgallery2 = '';
let urlgmaps ='';
const hariNama = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const bulanNama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function loadPage () {
    const urlParams = new URLSearchParams(window.location.search);
    und = urlParams.get('undangan') || '';
    untuk = urlParams.get('untuk') || '';
    
    document.getElementById('namateman').innerHTML = untuk;

    // Mengambil data berdasarkan undangan dari Firebase
    fetch(`https://posdata-16c78-default-rtdb.firebaseio.com/userdatabaru/${und}.json`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                    let user = data;
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
                    document.getElementById('akad').innerHTML = `${user.akadAcara}`;
                    document.getElementById('resepsi').innerHTML = `${user.resepsiAcara}`;
                    document.getElementById('lokasi').innerHTML = user.lokasiAcara;
                    urlgmaps = user.urlgmaps;

                    if(user.fotopria == ''){
                        fotopria.src = 'gambar-home.jpg'
                    }else{
                        fotopria.src = user.fotopria;
                    }

                    if(user.fotoWanita == ''){
                        fotowanita.src = 'gambar-home.jpg'
                    }else{
                        fotowanita.src = user.fotoWanita;
                    }
                    
                    // Proses rekening
                    if (Array.isArray(user.datarek)) {
                        let iconbank = '';
                        user.datarek.forEach(function (x) {
                            if(x.namaBank == 'Bca'){
                                iconbank = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1598px-Bank_Central_Asia.svg.png';
                            }else if(x.namaBank == 'Bri'){
                                iconbank = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/640px-BANK_BRI_logo.svg.png';
                            }else if(x.namaBank == 'Bni'){
                                iconbank = 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1024px-BNI_logo.svg.png';
                            }else if(x.namaBank == 'Dana'){
                                iconbank = 'dana.jpg';
                            }
                            htmlrekening += `
                                <div class="border border-primary rounded shadow" style="padding: 10px; display: flex; justify-content: space-evenly; font-family: Josefin Sans;" data-aos="fade-left">
                                    <div>
                                        <img src="${iconbank}" alt="Rekening BRI" class="img-rek rounded">
                                        <p id="rek${x.namaBank}">${x.norek}</p><span>A/n ${x.namarek}</span>
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

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let entry = data[key];
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div class="border border-primary rounded shadow" style="padding:10px;">
                <strong>Dari:</strong> ${entry.nama || 'Tidak ada nama'}<br>
                <strong>Ucapan:</strong> ${entry.ucapan || 'Tidak ada ucapan'}<br>
                <strong>Konfirmasi kehadiran:</strong> ${entry.kehadiran || 'Tidak ada konfirmasi'}
            </div><br/>`;

        dataList.appendChild(listItem);
    }
};
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
loadPage()
