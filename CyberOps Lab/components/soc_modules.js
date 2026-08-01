/* ==========================================================================
   CyberOps Lab (Level 2) - Component: 10 SOC Analyst Investigation Modules
   ========================================================================== */

const SOCModulesEngine = (function () {
    'use strict';

    function renderModulesGrid(container, completedModulesSet, userClearance) {
        if (!container) return;

        container.innerHTML = CYBEROPS_MODULES.map((mod, idx) => {
            const isCompleted = completedModulesSet.has(mod.id);
            const isUnlocked = idx === 0 || completedModulesSet.has(CYBEROPS_MODULES[idx - 1]?.id);

            return `
                <div class="soc-module-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}">
                    <div class="mod-header">
                        <span class="mod-badge-pill"><i class="fa-solid ${mod.badgeIcon}"></i> ${mod.badgeName}</span>
                        <span class="mod-status-tag">${isCompleted ? '<i class="fa-solid fa-circle-check text-cyan"></i> COMPLETED' : (isUnlocked ? 'READY' : 'LOCKED')}</span>
                    </div>

                    <h3 class="mod-title">${mod.title}</h3>
                    <p class="mod-summary">${mod.summary}</p>

                    <div class="mod-footer">
                        <span class="mod-xp"><i class="fa-solid fa-bolt text-cyan"></i> +${mod.xpReward} XP</span>
                        <button class="cyber-btn-cyan btn-launch-module" data-id="${mod.id}" ${isUnlocked ? '' : 'disabled'}>
                            ${isCompleted ? 'REVIEW MODULE' : (isUnlocked ? 'START MISSION' : 'LOCKED')}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach launch listeners
        container.querySelectorAll('.btn-launch-module').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modId = e.currentTarget.getAttribute('data-id');
                window.CyberOpsApp.openModuleModal(modId);
            });
        });
    }

    return {
        renderModulesGrid
    };
})();
