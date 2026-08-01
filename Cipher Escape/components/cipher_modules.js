/* ==========================================================================
   Cipher Escape (Level 3) - Component: Cryptography Learning Modules Engine
   ========================================================================== */

const CipherModulesEngine = (function () {
    'use strict';

    function renderModulesGrid(container, completedModulesSet, userClearance) {
        if (!container) return;

        const isPreunlocked = (userClearance === 'intermediate' || userClearance === 'advanced');

        container.innerHTML = CIPHER_MODULES.map((mod, idx) => {
            const isCompleted = completedModulesSet.has(mod.id);
            const isUnlocked = isPreunlocked || idx === 0 || completedModulesSet.has(CIPHER_MODULES[idx - 1]?.id);

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
