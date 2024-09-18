function openinvit(){
    home.style.display='none';
    dataNikah1.style.display='flex';
    mempelai.style.display='block'
    dataNikah1.classList.add("angkat");
    var audio = document.getElementById("myAudio");
            audio.currentTime = 0; // Mulai dari detik 0 (awal musik)
            audio.play(); // Putar musik
    AOS.refresh()
}

// Set target date
const targetDate = new Date('2025-06-05T00:00:00').getTime();

// Update the countdown every 1 second
const countdownFunction = setInterval(function() {
    // Get current date and time
    const now = new Date().getTime();

    // Find the distance between now and the target date
    const distance = targetDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in the element with id="countdown"
    document.getElementById("countdown").innerHTML = days + " Hari, " + hours + " Jam, " 
    + minutes + " Menit, " + seconds + " Detik";

    // If the countdown is over, write some text
    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "Waktu habis!";
    }
}, 1000);

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const untuk = urlParams.get('untuk');

    if (untuk) {
        namateman.innerHTML=untuk;
    } else {
        console.log('Parameter "untuk" tidak ditemukan');
    }
};

document.getElementById('rsvpForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah formulir dari pengiriman default

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch('https://apigame-18b26-default-rtdb.firebaseio.com/rsvp.json', {
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
    .catch((error) => {
        Swal.fire({
            title: "Gagal mengirim ucapan",
            text: "Kayanya ada yang salah deh",
            icon: "error"
          });
        console.error('Error:', error);
    });
});

 // URL Firebase tempat data disimpan
 const url = 'https://apigame-18b26-default-rtdb.firebaseio.com/rsvp.json';

 // Mengambil data dari Firebase
 fetch(url)
     .then(response => response.json())
     .then(data => {
         // Mengambil kunci-kunci dari objek data
         const keys = Object.keys(data);

         // Mengambil elemen ul
         const dataList = document.getElementById('dataList');

         // Menghapus konten lama jika ada
         dataList.innerHTML = '';

         // Iterasi setiap entri dan tambahkan ke ul
         keys.forEach(key => {
             const entry = data[key];
             const listItem = document.createElement('li');

             listItem.innerHTML = `
             <div class="border border-primary rounded shadow" style="padding:10px;">
                 <strong>Dari:</strong> ${entry.nama || 'Tidak ada nama'}<br>
                 <strong>Ucapan:</strong> ${entry.ucapan || 'Tidak ada ucapan'}<br>
                 <strong>Konfirmasi kehadiran:</strong> ${entry.kehadiran || 'Tidak ada konfirmasi'}
            </div><br/>
             `;

             dataList.appendChild(listItem);
         });
     })
     .catch(error => {
         console.error('Error fetching data:', error);
     });

     function copy(selector) {
        // Get the text field element
        var textElement = document.querySelector(selector);
        
        // Create a temporary input element to copy text
        var tempInput = document.createElement("input");
        tempInput.value = textElement.textContent.trim();
        document.body.appendChild(tempInput);
        
        // Select the text field
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices
        
        // Copy the text inside the text field
        navigator.clipboard.writeText(tempInput.value);
        
        // Remove the temporary input element
        document.body.removeChild(tempInput);
        
        // Show success alert
        Swal.fire({
            title: "Berhasil menyalin nomor rekening",
            icon: "success"
        });
    }
    
