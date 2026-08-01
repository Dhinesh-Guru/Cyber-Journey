/* ==========================================================================
   Cipher Escape (Level 3) - Component: Interactive Decoder Workbench Tools
   ========================================================================== */

const CipherToolsEngine = (function () {
    'use strict';

    function createTipBannerHtml(moduleRef, moduleTitle) {
        return `
            <div class="soc-learning-banner" style="background:rgba(176,38,255,0.08); border:1px dashed var(--purple); border-radius:10px; padding:10px 16px; margin-bottom:18px; display:flex; align-items:center; gap:12px; font-size:0.88rem;">
                <i class="fa-solid fa-lightbulb text-amber" style="font-size:18px;"></i>
                <div>
                    <strong>Learning Tip:</strong> Want to master this topic before taking decoder challenges? Check out 
                    <a href="#" class="tip-jump-modules text-purple" data-mod="${moduleRef}" style="font-weight:700; text-decoration:underline;">${moduleTitle}</a> in the Cipher Modules section!
                </div>
            </div>
        `;
    }

    function attachTipListener(container) {
        container.querySelectorAll('.tip-jump-modules').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const modId = e.currentTarget.getAttribute('data-mod');
                if (window.CipherEscapeApp) window.CipherEscapeApp.switchToModulesTab(modId);
            };
        });
    }

    // --- Audio Morse Code Sound Generator ---
    function playMorseAudio(morseText) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            let time = ctx.currentTime + 0.1;

            for (let i = 0; i < morseText.length; i++) {
                const char = morseText[i];
                if (char === '.' || char === '-') {
                    const duration = (char === '.') ? 0.1 : 0.3;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(650, time);

                    gain.gain.setValueAtTime(0, time);
                    gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
                    gain.gain.setValueAtTime(0.15, time + duration - 0.01);
                    gain.gain.linearRampToValueAtTime(0, time + duration);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(time);
                    osc.stop(time + duration);
                    time += duration + 0.1;
                } else if (char === ' ') {
                    time += 0.2;
                }
            }
        } catch (e) {
            console.error('AudioContext error playing morse audio', e);
        }
    }

    // --- 1. Caesar Shift Decoder Wheel & Challenge ---
    function initCaesarTool(container) {
        if (!container) return;

        const caesarChallenges = [
            { cipher: 'UGETGV', targetShift: 2, wordToTest: 'UGETGV', expected: 'SECRET' },
            { cipher: 'GCFIV', targetShift: 4, wordToTest: 'GCFIV', expected: 'CYBER' },
            { cipher: 'LZFWI', targetShift: 5, wordToTest: 'LZFWI', expected: 'GUARD' },
            { cipher: 'KHOOR ZRUOG', targetShift: 3, wordToTest: 'KHOOR', expected: 'HELLO' },
            { cipher: 'IYHCL', targetShift: 7, wordToTest: 'IYHCL', expected: 'BRAVE' }
        ];

        let activeChallenge = caesarChallenges[Math.floor(Math.random() * caesarChallenges.length)];

        function renderCaesarStage() {
            container.innerHTML = `
                <div class="soc-app-wrapper">
                    ${createTipBannerHtml('cip_m1', 'Module 1: Caesar & Substitution Ciphers')}

                    <div class="soc-app-header">
                        <h3><i class="fa-solid fa-repeat text-purple"></i> Interactive Caesar Shift Decoder Wheel</h3>
                        <p>Drag the shift offset slider from +1 to test different shift keys (+1 to +25) to reveal the decrypted message!</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                        <div>
                            <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">Ciphertext to Decrypt:</label>
                            <input type="text" id="caesar-input" value="${activeChallenge.cipher}" class="soc-input" style="width:100%; font-family:monospace;">
                        </div>

                        <div style="display:flex; align-items:center; gap:14px;">
                            <label style="font-weight:700; color:#fff;">Shift Offset (+1 to +25):</label>
                            <input type="range" id="caesar-shift-slider" min="1" max="25" value="1" style="flex:1;">
                            <span id="caesar-shift-val" class="text-purple" style="font-family:var(--font-heading); font-weight:800; font-size:1.1rem; width:40px;">+1</span>
                        </div>

                        <div style="background:rgba(176,38,255,0.1); border:1px solid var(--purple); padding:16px; border-radius:10px;">
                            <strong class="text-purple" style="display:block; margin-bottom:6px;">Decrypted Output (Drag slider to test shifts):</strong>
                            <div id="caesar-output" style="font-family:monospace; font-weight:700; font-size:1.1rem; color:#fff; word-break:break-all;"></div>
                        </div>
                    </div>

                    <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 class="text-purple"><i class="fa-solid fa-user-ninja"></i> Caesar Shift Challenge</h4>
                            <button class="chip-btn" id="btn-new-caesar-challenge"><i class="fa-solid fa-rotate"></i> NEW RANDOM CIPHER</button>
                        </div>
                        <p style="font-size:0.88rem; margin-bottom:10px;">Drag the slider above to find the shift key for ciphertext <code class="cipher-box">${activeChallenge.wordToTest}</code> and enter the decrypted word below (uppercase or lowercase):</p>
                        
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" id="caesar-ans-input" placeholder="Type decrypted word (e.g. ${activeChallenge.expected.toLowerCase()} or ${activeChallenge.expected})..." class="soc-input" style="flex:1;">
                            <button class="cyber-btn-purple" id="btn-submit-caesar-challenge"><i class="fa-solid fa-paper-plane"></i> VERIFY SOLUTION</button>
                        </div>

                        <div id="caesar-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                    </div>
                </div>
            `;

            attachTipListener(container);

            const input = container.querySelector('#caesar-input');
            const slider = container.querySelector('#caesar-shift-slider');
            const shiftVal = container.querySelector('#caesar-shift-val');
            const output = container.querySelector('#caesar-output');

            function updateCaesar() {
                const shift = parseInt(slider.value);
                shiftVal.textContent = `+${shift}`;

                const text = input.value;
                let result = '';

                for (let i = 0; i < text.length; i++) {
                    let char = text[i];
                    if (char.match(/[a-z]/i)) {
                        const code = text.charCodeAt(i);
                        if (code >= 65 && code <= 90) {
                            char = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                        } else if (code >= 97 && code <= 122) {
                            char = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                        }
                    }
                    result += char;
                }

                output.textContent = result;
            }

            input.addEventListener('input', updateCaesar);
            slider.addEventListener('input', updateCaesar);
            updateCaesar();

            container.querySelector('#btn-new-caesar-challenge').onclick = () => {
                activeChallenge = caesarChallenges[Math.floor(Math.random() * caesarChallenges.length)];
                renderCaesarStage();
            };

            container.querySelector('#btn-submit-caesar-challenge').onclick = () => {
                const ans = container.querySelector('#caesar-ans-input').value.trim().toUpperCase();
                const feedback = container.querySelector('#caesar-challenge-feedback');
                feedback.style.display = 'block';

                if (ans === activeChallenge.expected.toUpperCase()) {
                    feedback.className = 'soc-feedback-box success';
                    feedback.innerHTML = `
                        <h4 class="text-purple"><i class="fa-solid fa-circle-check"></i> CAESAR DECRYPTION CONFIRMED!</h4>
                        <p>Correct! <code>${activeChallenge.wordToTest}</code> shifted backward by ${activeChallenge.targetShift} positions yields <code>${activeChallenge.expected}</code>.</p>
                    `;
                } else {
                    feedback.className = 'soc-feedback-box danger';
                    feedback.innerHTML = `
                        <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT DECRYPTION</h4>
                        <p>Drag the slider to shift offset +${activeChallenge.targetShift} to reveal the decrypted word: <strong>${activeChallenge.expected}</strong> (or <strong>${activeChallenge.expected.toLowerCase()}</strong>).</p>
                    `;
                }
            };
        }

        renderCaesarStage();
    }

    // --- 2. Morse Code Audio & Signal Interpreter ---
    function initMorseTool(container) {
        if (!container) return;

        const morseChallenges = [
            { morse: '... --- ...', expected: 'SOS', desc: 'Universal SOS Distress Signal' },
            { morse: '-.-. -.-- -... . .-', expected: 'CYBER', desc: '5-letter cybersecurity word' },
            { morse: '-.-. --- -.. .', expected: 'CODE', desc: '4-letter programming term' },
            { morse: '-... .-. . .- -.-', expected: 'BREAK', desc: '5-letter cipher breaking term' },
            { morse: '.... . .-.. .--.', expected: 'HELP', desc: '4-letter emergency word' }
        ];

        let activeChallenge = morseChallenges[Math.floor(Math.random() * morseChallenges.length)];

        const morseMap = {
            '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
            '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
            '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
            '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
            '-.--': 'Y', '--..': 'Z'
        };

        function renderMorseStage() {
            container.innerHTML = `
                <div class="soc-app-wrapper">
                    ${createTipBannerHtml('cip_m2', 'Module 2: Morse Code & Signal Encoding')}

                    <div class="soc-app-header">
                        <h3><i class="fa-solid fa-rss text-purple"></i> Morse Code Audio & Signal Interpreter</h3>
                        <p>Listen to the audio telegraph signal or type dots (.) and dashes (-) to translate into cleartext.</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="cyber-btn-purple" id="btn-play-morse-audio" style="padding:10px 16px;"><i class="fa-solid fa-volume-high"></i> PLAY MORSE AUDIO SIGNAL</button>
                            <span class="text-purple" style="font-family:monospace; font-weight:700;">Signal Code: ${activeChallenge.morse}</span>
                        </div>

                        <div>
                            <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">Morse Code Symbols Input (use spaces between letters):</label>
                            <input type="text" id="morse-input" placeholder="Type Morse dots (.) and dashes (-) here to test..." class="soc-input" style="width:100%; font-family:monospace;">
                        </div>

                        <div style="background:rgba(176,38,255,0.1); border:1px solid var(--purple); padding:16px; border-radius:10px;">
                            <strong class="text-purple" style="display:block; margin-bottom:6px;">Translated Message:</strong>
                            <div id="morse-output" style="font-family:monospace; font-weight:700; font-size:1.1rem; color:#fff;">[TYPE MORSE SYMBOLS ABOVE TO TRANSLATE]</div>
                        </div>
                    </div>

                    <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 class="text-purple"><i class="fa-solid fa-user-ninja"></i> Morse Signal Challenge</h4>
                            <button class="chip-btn" id="btn-new-morse-challenge"><i class="fa-solid fa-rotate"></i> NEW RANDOM MORSE SIGNAL</button>
                        </div>
                        <p style="font-size:0.88rem; margin-bottom:10px;">Listen to or read Morse signal <code class="cipher-box">${activeChallenge.morse}</code> and enter the translated word below:</p>
                        
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" id="morse-ans-input" placeholder="Enter translated word..." class="soc-input" style="flex:1;">
                            <button class="cyber-btn-purple" id="btn-submit-morse-challenge"><i class="fa-solid fa-paper-plane"></i> VERIFY SIGNAL</button>
                        </div>

                        <div id="morse-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                    </div>
                </div>
            `;

            attachTipListener(container);

            const input = container.querySelector('#morse-input');
            const output = container.querySelector('#morse-output');

            function updateMorse() {
                const raw = input.value.trim();
                if (!raw) {
                    output.textContent = '[TYPE MORSE SYMBOLS ABOVE TO TRANSLATE]';
                    return;
                }
                const words = raw.split('  ');

                const translated = words.map(w => {
                    const letters = w.split(' ');
                    return letters.map(l => morseMap[l] || '?').join('');
                }).join(' ');

                output.textContent = translated || '[TYPE MORSE SYMBOLS ABOVE TO TRANSLATE]';
            }

            input.addEventListener('input', updateMorse);

            container.querySelector('#btn-play-morse-audio').onclick = () => {
                playMorseAudio(activeChallenge.morse);
            };

            container.querySelector('#btn-new-morse-challenge').onclick = () => {
                activeChallenge = morseChallenges[Math.floor(Math.random() * morseChallenges.length)];
                renderMorseStage();
            };

            container.querySelector('#btn-submit-morse-challenge').onclick = () => {
                const ans = container.querySelector('#morse-ans-input').value.trim().toUpperCase();
                const feedback = container.querySelector('#morse-challenge-feedback');
                feedback.style.display = 'block';

                if (ans === activeChallenge.expected) {
                    feedback.className = 'soc-feedback-box success';
                    feedback.innerHTML = `
                        <h4 class="text-purple"><i class="fa-solid fa-circle-check"></i> MORSE SIGNAL TRANSLATION CONFIRMED!</h4>
                        <p>Correct! <code>${activeChallenge.morse}</code> translates to <code>${activeChallenge.expected}</code> (${activeChallenge.desc}).</p>
                    `;
                } else {
                    feedback.className = 'soc-feedback-box danger';
                    feedback.innerHTML = `
                        <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT TRANSLATION</h4>
                        <p>Listen to the audio or type <code>${activeChallenge.morse}</code> into the Morse translator box above!</p>
                    `;
                }
            };
        }

        renderMorseStage();
    }

    // --- 3. Binary & Hex Translator & Challenge ---
    function initBinaryTool(container) {
        if (!container) return;

        const binaryChallenges = [
            { binary: '01000001', expected: 'A' },
            { binary: '01000011', expected: 'C' },
            { binary: '01011000', expected: 'X' },
            { binary: '01000110 01010010', expected: 'FR' },
            { binary: '01000011 01011001', expected: 'CY' }
        ];

        let activeChallenge = binaryChallenges[Math.floor(Math.random() * binaryChallenges.length)];

        function renderBinaryStage() {
            container.innerHTML = `
                <div class="soc-app-wrapper">
                    ${createTipBannerHtml('cip_m3', 'Module 3: Binary & Machine Representations')}

                    <div class="soc-app-header">
                        <h3><i class="fa-solid fa-code text-purple"></i> Binary & Hexadecimal ASCII Translator</h3>
                        <p>Convert 8-bit binary bytes (01000001) or Hexadecimal codes into ASCII text.</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                        <div>
                            <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">8-Bit Binary Bytes (space-separated):</label>
                            <input type="text" id="binary-input" placeholder="Paste 8-bit binary bytes here to translate..." class="soc-input" style="width:100%; font-family:monospace;">
                        </div>

                        <div style="background:rgba(176,38,255,0.1); border:1px solid var(--purple); padding:16px; border-radius:10px;">
                            <strong class="text-purple" style="display:block; margin-bottom:6px;">ASCII Output:</strong>
                            <div id="binary-output" style="font-family:monospace; font-weight:700; font-size:1.1rem; color:#fff;">[PASTE BINARY BYTES ABOVE TO TRANSLATE]</div>
                        </div>
                    </div>

                    <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 class="text-purple"><i class="fa-solid fa-user-ninja"></i> Binary Byte Challenge</h4>
                            <button class="chip-btn" id="btn-new-binary-challenge"><i class="fa-solid fa-rotate"></i> NEW RANDOM BINARY BYTE</button>
                        </div>
                        <p style="font-size:0.88rem; margin-bottom:10px;">Paste binary code <code class="cipher-box">${activeChallenge.binary}</code> into the translator box above and enter the decoded ASCII letter(s) below:</p>
                        
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" id="binary-ans-input" placeholder="Enter translated ASCII letter(s)..." class="soc-input" style="flex:1;">
                            <button class="cyber-btn-purple" id="btn-submit-binary-challenge"><i class="fa-solid fa-paper-plane"></i> VERIFY BYTE</button>
                        </div>

                        <div id="binary-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                    </div>
                </div>
            `;

            attachTipListener(container);

            const input = container.querySelector('#binary-input');
            const output = container.querySelector('#binary-output');

            function updateBinary() {
                const val = input.value.trim();
                if (!val) {
                    output.textContent = '[PASTE BINARY BYTES ABOVE TO TRANSLATE]';
                    return;
                }
                const bytes = val.split(/\s+/);
                const ascii = bytes.map(b => {
                    const num = parseInt(b, 2);
                    return isNaN(num) ? '?' : String.fromCharCode(num);
                }).join('');

                output.textContent = ascii || '[PASTE BINARY BYTES ABOVE TO TRANSLATE]';
            }

            input.addEventListener('input', updateBinary);

            container.querySelector('#btn-new-binary-challenge').onclick = () => {
                activeChallenge = binaryChallenges[Math.floor(Math.random() * binaryChallenges.length)];
                renderBinaryStage();
            };

            container.querySelector('#btn-submit-binary-challenge').onclick = () => {
                const ans = container.querySelector('#binary-ans-input').value.trim().toUpperCase();
                const feedback = container.querySelector('#binary-challenge-feedback');
                feedback.style.display = 'block';

                if (ans === activeChallenge.expected) {
                    feedback.className = 'soc-feedback-box success';
                    feedback.innerHTML = `
                        <h4 class="text-purple"><i class="fa-solid fa-circle-check"></i> BINARY TRANSLATION CONFIRMED!</h4>
                        <p>Correct! 8-bit binary <code>${activeChallenge.binary}</code> translates to ASCII <code>${activeChallenge.expected}</code>.</p>
                    `;
                } else {
                    feedback.className = 'soc-feedback-box danger';
                    feedback.innerHTML = `
                        <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT TRANSLATION</h4>
                        <p>Paste <code>${activeChallenge.binary}</code> into the Binary Translator box above!</p>
                    `;
                }
            };
        }

        renderBinaryStage();
    }

    // --- 4. Base64 & Vigenère Key Decryptor & Challenge ---
    function initBase64Tool(container) {
        if (!container) return;

        const base64Challenges = [
            { b64: 'Q1lCRVI=', expected: 'CYBER' },
            { b64: 'U0VDUkVU', expected: 'SECRET' },
            { b64: 'UEFTU1dPUkQ=', expected: 'PASSWORD' },
            { b64: 'RlJFRURPTQ==', expected: 'FREEDOM' },
            { b64: 'RU5DUllQVA==', expected: 'ENCRYPT' }
        ];

        let activeChallenge = base64Challenges[Math.floor(Math.random() * base64Challenges.length)];

        function renderBase64Stage() {
            container.innerHTML = `
                <div class="soc-app-wrapper">
                    ${createTipBannerHtml('cip_m4', 'Module 4: Base64 & Web Encodings')}

                    <div class="soc-app-header">
                        <h3><i class="fa-solid fa-cube text-purple"></i> Base64 & Vigenère Key Decryptor</h3>
                        <p>Decode Base64 data strings or apply Vigenère keyword decryption live.</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                        <div>
                            <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">Base64 Encoded Input:</label>
                            <input type="text" id="b64-input" placeholder="Paste Base64 encoded string here..." class="soc-input" style="width:100%; font-family:monospace;">
                        </div>

                        <div style="background:rgba(176,38,255,0.1); border:1px solid var(--purple); padding:16px; border-radius:10px;">
                            <strong class="text-purple" style="display:block; margin-bottom:6px;">Base64 Decoded Output:</strong>
                            <div id="b64-output" style="font-family:monospace; font-weight:700; font-size:1.1rem; color:#fff;">[PASTE BASE64 STRING ABOVE TO DECODE]</div>
                        </div>
                    </div>

                    <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 class="text-purple"><i class="fa-solid fa-user-ninja"></i> Base64 Challenge</h4>
                            <button class="chip-btn" id="btn-new-b64-challenge"><i class="fa-solid fa-rotate"></i> NEW RANDOM BASE64 STRING</button>
                        </div>
                        <p style="font-size:0.88rem; margin-bottom:10px;">Paste Base64 string <code class="cipher-box">${activeChallenge.b64}</code> into the decoder input box above and enter the decoded word below:</p>
                        
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" id="b64-ans-input" placeholder="Type decoded word..." class="soc-input" style="flex:1;">
                            <button class="cyber-btn-purple" id="btn-submit-b64-challenge"><i class="fa-solid fa-paper-plane"></i> VERIFY DECODING</button>
                        </div>

                        <div id="b64-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                    </div>
                </div>
            `;

            attachTipListener(container);

            const input = container.querySelector('#b64-input');
            const output = container.querySelector('#b64-output');

            function updateB64() {
                const val = input.value.trim();
                if (!val) {
                    output.textContent = '[PASTE BASE64 STRING ABOVE TO DECODE]';
                    return;
                }
                try {
                    const decoded = atob(val);
                    output.textContent = decoded;
                } catch (e) {
                    output.textContent = '[INVALID BASE64 STRING]';
                }
            }

            input.addEventListener('input', updateB64);

            container.querySelector('#btn-new-b64-challenge').onclick = () => {
                activeChallenge = base64Challenges[Math.floor(Math.random() * base64Challenges.length)];
                renderBase64Stage();
            };

            container.querySelector('#btn-submit-b64-challenge').onclick = () => {
                const ans = container.querySelector('#b64-ans-input').value.trim().toUpperCase();
                const feedback = container.querySelector('#b64-challenge-feedback');
                feedback.style.display = 'block';

                if (ans === activeChallenge.expected) {
                    feedback.className = 'soc-feedback-box success';
                    feedback.innerHTML = `
                        <h4 class="text-purple"><i class="fa-solid fa-circle-check"></i> BASE64 DECODING CONFIRMED!</h4>
                        <p>Correct! <code>${activeChallenge.b64}</code> decodes to <code>${activeChallenge.expected}</code>.</p>
                    `;
                } else {
                    feedback.className = 'soc-feedback-box danger';
                    feedback.innerHTML = `
                        <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT DECODING</h4>
                        <p>Paste <code>${activeChallenge.b64}</code> into the Base64 decoder box above!</p>
                    `;
                }
            };
        }

        renderBase64Stage();
    }

    return {
        initCaesarTool,
        initMorseTool,
        initBinaryTool,
        initBase64Tool
    };
})();
