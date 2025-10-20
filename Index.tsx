<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUC-AI.COM – AI Consulting</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#7c3aed',
                        secondary: '#06b6d4',
                    },
                    fontFamily: {
                        poppins: ['Poppins', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style>
        /* Smooth transitions for all elements */
        * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 1) Keyframes definieren */
@keyframes popIn {
            0%   { transform: scale(.96); opacity: .2; }
            60%  { transform: scale(1.04); opacity: 1; }
            100% { transform: scale(1); }
        }
        @keyframes glowPulse {
            0%   { box-shadow: 0 0 0 rgba(74,214,217,0); }
            50%  { box-shadow: 0 0 24px rgba(74,214,217,.6); }
            100% { box-shadow: 0 0 0 rgba(74,214,217,0); }
        }

        /* 2) Wiederverwendbare Klassen */
        .anim-pop    { animation: popIn .36s ease-out; }
        .anim-glow   { animation: glowPulse 1s ease-out; }
        .glow {
            box-shadow: 0 0 20px rgba(74, 214, 217, 0.3);
            transition: box-shadow 0.5s ease;
        }
        /* Smooth hover effects */
        .hover-scale {
            transform-origin: center;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-scale:hover {
            transform: scale(1.05);
        }
        /* Smooth button hover */
        button {
            will-change: transform;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        button:hover {
            transform: translateY(-2px);
        }
@keyframes colorCycle {
            0% { color: #7c3aed; }
            50% { color: #06b6d4; }
            100% { color: #7c3aed; }
        }
        .logo-animation {
            animation: colorCycle 3s ease-in-out infinite;
        }
.gradient-text {
            background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        #vanta-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.15;
            transition: opacity 1s ease;
        }
        /* Smooth scrolling behavior */
        html {
            scroll-behavior: smooth;
        }
        /* Fade in animation */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        body {
            animation: fadeIn 0.6s ease-in;
        }
</style>
</head>
<body class="font-sans bg-white text-gray-800">
<div id="vanta-bg"></div>

    <!-- Navigation -->
    <nav class="container mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
            <div>
                <a href="https://luc-ai.com" class="text-2xl font-bold text-primary hovered-element logo-animation">LUC-AI.COM</a>
</div>
            <div class="hidden md:flex space-x-8">
                <a href="https://luc-ai.com" class="hover:text-primary transition">Home</a>
                <a href="https://luc-ai.com/solutions" class="hover:text-primary transition">Lösungen</a>
                <a href="https://luc-ai.com/about" class="hover:text-primary transition">Über mich</a>
                <a href="https://luc-ai.com/blog" class="hover:text-primary transition">Blog</a>
                <a href="https://luc-ai.com#contact" class="hover:text-primary transition">Kontakt</a>
            </div>
<div class="md:hidden">
    <button id="mobileMenuBtn">
        <i data-feather="menu"></i>
    </button>
    <div id="mobileMenu" class="hidden absolute right-6 top-20 bg-white shadow-lg rounded-lg p-4 w-48 z-50">
        <a href="https://luc-ai.com" class="block py-2 hover:text-primary">Home</a>
        <a href="https://luc-ai.com/solutions" class="block py-2 hover:text-primary">Lösungen</a>
        <a href="https://luc-ai.com/about" class="block py-2 hover:text-primary">Über mich</a>
        <a href="https://luc-ai.com/blog" class="block py-2 hover:text-primary">Blog</a>
        <a href="https://luc-ai.com#contact" class="block py-2 hover:text-primary">Kontakt</a>
    </div>
</div>
</div>
    </nav>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-20 md:py-32 text-center">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                AI, die <span class="gradient-text">spricht</span>, <span class="gradient-text">denkt</span> und <span class="gradient-text">verkauft</span> – für dein Business.
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Erlebe, wie dein Unternehmen mit echten KI-Agenten arbeitet.
            </p>
            <button id="liveTestBtn" class="bg-primary hover:bg-violet-600 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105 glow">
                Live testen
            </button>

            <div id="callModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:50;">
                <div style="max-width:420px; margin:10% auto; background:#fff; padding:24px; border-radius:12px;">
                            <h3 style="margin-top:0; font-size:1.25rem; font-weight:600; text-align:center;">Sofort-Demo: KI ruft dich an</h3>
                    <p class="text-gray-600 mb-4 text-center mx-auto">
Gib deine Nummer im internationalen Format ein (z. B. +4917612345678).</p>
                            <form id="callForm" class="text-center">
<input id="phoneInput" type="tel" placeholder="+49…" required style="width:100%; padding:12px; margin:8px 0; border:1px solid #e5e7eb; border-radius:8px;">
                        <div class="flex justify-center mt-4">
<button type="submit" class="bg-primary hover:bg-violet-600 text-white font-medium py-2 px-6 rounded-full transition-all">Anrufen lassen</button>
                            <button type="button" id="cancelBtn" class="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition-all">Abbrechen</button>
                        </div>
                    </form>
                    <div id="callStatus" style="margin-top:16px; font-size:14px; color:#7c3aed;">
                            </div>
</div>
    </section>

    <!-- About Section -->
    <section id="about" class="bg-gray-50 py-20">
        <div class="container mx-auto px-6 max-w-4xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-6">Über mich</h2>
                <div class="w-24 h-1 bg-secondary mx-auto"></div>
            </div>
            <div class="bg-white p-8 md:p-12 rounded-xl shadow-sm text-center md:text-left">
                <p class="text-xl leading-relaxed text-gray-700 mx-auto max-w-2xl text-center">
Ich bin <span class="font-semibold text-primary">LUCA</span>, AI Consultant.
Ich entwickle Systeme, die deine Stimme skalieren – von Kundenservice bis Sales. Meine Mission ist es, KI-Lösungen zu schaffen, die nicht nur funktionieren, sondern sich natürlich in deine Businessprozesse integrieren.
                </p>
</div>
        </div>
    </section>
    <!-- Demo Section -->
    <section id="demo" class="py-20">
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row items-center gap-12">
                <div class="md:w-1/2 text-center">
                    <h2 class="text-3xl font-bold mb-6">Live Demo</h2>
                    <p class="text-gray-600 mb-8">
                        Mein Voice-Agent ruft dich SOFORT an.
                    </p>
                    <div class="flex justify-center">
<button id="demoBtn" class="bg-secondary hover:bg-cyan-600 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105 glow">
                            Starte Live-Demo
                        </button>
                    </div>
<div id="demoModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:50;">
                        <div style="max-width:420px; margin:10% auto; background:#fff; padding:24px; border-radius:12px;">
                            <h3 style="margin-top:0; font-size:1.25rem; font-weight:600; text-align:center;">Live-Demo: KI ruft dich an</h3>
                            <p class="text-gray-600 mb-4 text-center">Gib deine Nummer im internationalen Format ein (z. B. +4917612345678).</p>
                            <form id="demoForm" class="text-center">
                                <input id="demoPhoneInput" type="tel" placeholder="+49…" required style="width:100%; padding:12px; margin:8px 0; border:1px solid #e5e7eb; border-radius:8px;">
                                <div class="flex justify-center mt-4">
                                    <button type="submit" class="bg-secondary hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-full transition-all">Anrufen lassen</button>
                                    <button type="button" id="cancelDemoBtn" class="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition-all">Abbrechen</button>
                                </div>
                            </form>
                            <div id="demoStatus" style="margin-top:16px; font-size:14px; color:#06b6d4;"></div>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <div class="bg-gradient-to-br from-primary to-secondary p-1 rounded-xl">
                        <div class="bg-white p-6 rounded-lg">
                            <div class="flex items-center mb-4">
                                <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div class="h-64 flex items-center justify-center">
                                <div class="text-center">
                                    <div class="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                        <i data-feather="mic" class="text-white w-8 h-8"></i>
                                    </div>
                            <p class="text-gray-500 mb-4 text-center mx-auto">Authentische KI-Konversation starten</p>
<div class="flex justify-center">
                                        <button id="audioToggle" class="bg-primary hover:bg-violet-600 text-white font-medium py-2 px-6 rounded-full transition-all flex items-center gap-2 hovered-element">
                                            <span id="audioText" class="hovered-element">Play Demo</span>
                                            <i data-feather="play" id="audioIcon"></i>
                                        </button>
</div>
<audio id="demoAudio" src="https://huggingface.co/spaces/LucaOstellari/ai-whisperer-luca-s-digital-genius/resolve/main/audio/ElevenLabs_2025-10-19T22_04_02_Susi_pvc_sp109_s50_sb75_se0_b_m2.mp3"></audio>
<script>
                                        document.addEventListener('DOMContentLoaded', function() {
                                            const audioToggle = document.getElementById('audioToggle');
                                            const demoAudio = document.getElementById('demoAudio');
                                            const audioText = document.getElementById('audioText');
                                            const audioIcon = document.getElementById('audioIcon');

                                            audioToggle.addEventListener('click', function() {
                                                if (demoAudio.paused) {
                                                    demoAudio.play();
                                                    audioText.textContent = 'Stop Demo';
                                                    audioIcon.setAttribute('data-feather', 'pause');
                                                } else {
                                                    demoAudio.pause();
                                                    demoAudio.currentTime = 0;
                                                    audioText.textContent = 'Play Demo';
                                                    audioIcon.setAttribute('data-feather', 'play');
                                                }
                                                feather.replace();
                                            });

                                            demoAudio.addEventListener('ended', function() {
                                                audioText.textContent = 'Play Demo';
                                                audioIcon.setAttribute('data-feather', 'play');
                                                feather.replace();
                                            });
                                        });
</script>
</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<!-- Contact Section -->
    <section id="contact" class="bg-gray-50 py-20">
        <div class="container mx-auto px-6 max-w-2xl">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4 hovered-element">Kontakt für persönliches Gespräch</h2>
<p class="text-gray-600">
                    Hinterlasse deine Daten – um einen <span class="gradient-text">kostenlosen persönlichen</span> Termin zu vereinbaren.
</p>
            </div>
            <form class="bg-white p-8 rounded-xl shadow-sm">
                <div class="mb-6">
                    <label for="name" class="block text-gray-700 mb-2">Name</label>
                    <input type="text" id="name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <div class="mb-6">
                    <label for="company" class="block text-gray-700 mb-2">Unternehmen</label>
                    <input type="text" id="company" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <div class="mb-6">
                    <label for="phone" class="block text-gray-700 mb-2">Telefonnummer</label>
                    <input type="tel" id="phone" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <div class="mb-8">
                    <label for="email" class="block text-gray-700 mb-2">E-Mail</label>
                    <input type="email" id="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-violet-600 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-[1.02] hover-float">
Jetzt kontaktieren
                </button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-gray-200">
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-6 md:mb-0">
                    <p class="text-gray-500">© 2025 LUC.AI – <a href="https://luc-ai.com" class="hover:text-primary">luc-ai.com</a></p>
</div>
                <div class="flex space-x-6">
                    <a href="#" class="text-gray-500 hover:text-primary transition">
                        <i data-feather="linkedin"></i>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary transition">
                        <i data-feather="mail"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>
    <script>
        // Helper, damit die Animation mehrfach hintereinander abgespielt werden kann:
        function playAnim(el, className){
            el.classList.remove(className); // reset
            void el.offsetWidth;            // reflow trick
            el.classList.add(className);
        }

        document.addEventListener('DOMContentLoaded', function() {
            feather.replace();

            // Add click animation to logo
            const logo = document.querySelector('.hovered-element');
            logo.addEventListener('click', () => {
                playAnim(logo, 'anim-pop');
                playAnim(logo, 'anim-glow');
            });
const btn = document.getElementById('liveTestBtn');
            const demoBtn = document.getElementById('demoBtn');
const modal = document.getElementById('callModal');
            const form = document.getElementById('callForm');
            const cancel = document.getElementById('cancelBtn');
            const statusEl = document.getElementById('callStatus');
            const phoneEl = document.getElementById('phoneInput');

            btn.onclick = () => { statusEl.textContent = ""; modal.style.display = 'block'; }
            cancel.onclick = () => { modal.style.display = 'none'; }
            // Demo Modal Logic
            const demoModal = document.getElementById('demoModal');
            const demoForm = document.getElementById('demoForm');
            const cancelDemo = document.getElementById('cancelDemoBtn');
            const demoStatus = document.getElementById('demoStatus');
            const demoPhoneEl = document.getElementById('demoPhoneInput');

            demoBtn.onclick = () => { demoStatus.textContent = ""; demoModal.style.display = 'block'; }
            cancelDemo.onclick = () => { demoModal.style.display = 'none'; }

            demoForm.onsubmit = async (e) => {
                e.preventDefault();
                const phone = demoPhoneEl.value.trim();
                if (!/^\+\d{6,15}$/.test(phone)) {
                    demoStatus.textContent = "Bitte gültige internationale Nummer (E.164) angeben.";
                    return;
                }
                demoStatus.textContent = "Verbinde…";
                try {
                    const res = await fetch('/api/start-demo', {
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({ phone })
                    });
                    if (!res.ok) throw new Error(await res.text());
                    demoStatus.textContent = "Perfekt! Dein KI-Agent ruft dich gleich an.";
                    demoPhoneEl.value = "";
                    setTimeout(() => demoModal.style.display = 'none', 3000);
                } catch (err) {
                    demoStatus.textContent = "Fehler beim Starten der Demo: " + err.message;
                }
            }

            form.onsubmit = async (e) => {
e.preventDefault();
                const phone = phoneEl.value.trim();
                if (!/^\+\d{6,15}$/.test(phone)) {
                    statusEl.textContent = "Bitte gültige internationale Nummer (E.164) angeben.";
                    return;
                }
                statusEl.textContent = "Verbinde…";
                try {
                    const res = await fetch('/api/start-call', {
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({ phone })
                    });
                    if (!res.ok) throw new Error(await res.text());
                    statusEl.textContent = "Perfekt! Dein KI-Agent ruft dich gleich an.";
                    phoneEl.value = "";
                    setTimeout(() => modal.style.display = 'none', 3000);
                } catch (err) {
                    statusEl.textContent = "Fehler beim Starten des Anrufs: " + err.message;
                }
            }
            const globe = VANTA.GLOBE({
el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x7c3aed,
                backgroundColor: 0xffffff,
                size: 0.8
            });

            // Smooth resize handling
            window.addEventListener('resize', function() {
                globe.resize();
            });
// Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        });
    </script>
</body>
</html>
