/* ==========================================================================
   Cipher Escape (Level 3) - Component: Cryptography Learning Modules Engine
   ========================================================================== */

const CipherModulesEngine = (function () {
    'use strict';

    function renderModulesGrid(container, completedModulesSet, userClearance) {
        if (!container) return;

        const isAllCompleted = completedModulesSet.size >= 5;

        const completionBannerHtml = isAllCompleted ? `
            <div class="cyber-completion-banner" style="background:rgba(176,38,255,0.08); border:1px solid rgba(176,38,255,0.4); border-radius:12px; padding:16px 20px; margin-bottom:24px; display:flex; align-items:center; gap:16px; width:100%; grid-column:1 / -1;">
                <div style="font-size:32px; color:#b026ff;"><i class="fa-solid fa-key"></i></div>
                <div>
                    <h4 style="color:#b026ff; font-family:'Orbitron',sans-serif; font-size:1.05rem; margin-bottom:4px;">🔐 ALL CRYPTOGRAPHY MODULES MASTERED!</h4>
                    <p style="color:#e5e7eb; font-size:0.9rem; margin:0; line-height:1.5;">Masterful cryptanalysis! Test your skills live: step into the <strong>10 Story Escape Chambers</strong> to crack encrypted blast doors or practice with interactive decrypters in the <strong>Decoder Workbench Tools</strong> (Caesar Wheel, Morse Code Audio Player, Binary/Hex Translator)!</p>
                </div>
            </div>
        ` : '';

        const cardsHtml = CIPHER_MODULES.map((mod, idx) => {
            const isCompleted = completedModulesSet.has(mod.id);
            const isUnlocked = idx === 0 || completedModulesSet.has(CIPHER_MODULES[idx - 1]?.id);

            return `
                <div class="cipher-module-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}">
                    <div class="mod-header">
                        <span class="mod-badge-pill"><i class="fa-solid ${mod.badgeIcon}"></i> ${mod.badgeName}</span>
                        <span class="mod-status-tag">${isCompleted ? '<i class="fa-solid fa-circle-check text-purple"></i> COMPLETED' : (isUnlocked ? 'READY' : 'LOCKED')}</span>
                    </div>

                    <h3 class="mod-title">${mod.title}</h3>
                    <p class="mod-summary">${mod.summary}</p>

                    <div class="mod-footer">
                        <span class="mod-xp"><i class="fa-solid fa-bolt text-purple"></i> +${mod.xpReward} XP</span>
                        <button class="cyber-btn-purple btn-launch-cipher-mod" data-id="${mod.id}" ${isUnlocked ? '' : 'disabled'}>
                            ${isCompleted ? 'REVIEW MODULE' : (isUnlocked ? 'START MODULE' : 'LOCKED')}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = completionBannerHtml + cardsHtml;

        container.querySelectorAll('.btn-launch-cipher-mod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modId = e.currentTarget.getAttribute('data-id');
                window.CipherEscapeApp.openModuleModal(modId);
            });
        });
    }

    return {
        renderModulesGrid
    };
})();
