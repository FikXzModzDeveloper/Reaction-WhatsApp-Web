const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    html.classList.remove('light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        html.classList.add('dark');
        html.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});

const emojiBtns = document.querySelectorAll('.emoji-btn');
const emojiInput = document.getElementById('emojiInput');
const clearEmojis = document.getElementById('clearEmojis');

emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-emoji');
        emojiInput.value += emoji;
    });
});

clearEmojis.addEventListener('click', () => {
    emojiInput.value = '';
    emojiInput.focus();
});

const form = document.getElementById('reactionForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('span');
const btnIcon = submitBtn.querySelector('.fa-paper-plane');
const resultDiv = document.getElementById('statusResult');

const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.innerText = message;
    
    if(type === 'success') {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-400"></i>';
    } else {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-400"></i>';
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
};

const updateResultUI = (success, title, msg) => {
    resultDiv.classList.remove('hidden');
    const icon = resultDiv.querySelector('i');
    const titleEl = resultDiv.querySelector('h4');
    const descEl = resultDiv.querySelector('p');
    const container = resultDiv.querySelector('div');

    titleEl.textContent = title;
    descEl.textContent = msg;

    if (success) {
        container.className = 'p-4 rounded-xl flex items-start gap-3 text-sm animate-fade-in border bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
        icon.className = 'fa-solid fa-circle-check mt-0.5 text-lg text-green-500';
    } else {
        container.className = 'p-4 rounded-xl flex items-start gap-3 text-sm animate-fade-in border bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
        icon.className = 'fa-solid fa-circle-xmark mt-0.5 text-lg text-red-500';
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const link = document.getElementById('urlInput').value.trim();
    const rawEmojis = emojiInput.value.trim();

    if (!link) {
        showToast('Link WhatsApp wajib diisi', 'error');
        return;
    }

    if (!rawEmojis) {
        showToast('Pilih atau ketik emoji dulu', 'error');
        return;
    }

    const formattedEmojis = Array.from(rawEmojis).join(',');

    submitBtn.disabled = true;
    btnText.innerText = 'Memproses...';
    btnIcon.classList.add('hidden');
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    resultDiv.classList.add('hidden');

    const apiUrl = `https://api.fikmydomainsz.xyz/tools/reactchannel?link=${encodeURIComponent(link)}&emojis=${encodeURIComponent(formattedEmojis)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status) {
            updateResultUI(true, 'Berhasil!', data.message || 'Reaksi telah dikirim ke channel.');
            showToast('Reaksi berhasil dikirim!');
        } else {
            updateResultUI(false, 'Gagal', (data.error || 'Terjadi kesalahan'));
        }

    } catch (error) {
        updateResultUI(false, 'Error Sistem', 'Gagal menghubungi server API. Cek koneksi internet Anda.');
        showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.innerText = 'Kirim Sekarang';
        btnIcon.classList.remove('hidden');
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});
