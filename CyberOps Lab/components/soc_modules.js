/* ==========================================================================
   CyberOps Lab (Level 2) - Component: 10 SOC Analyst Investigation Modules
   ========================================================================== */

const SOCModulesEngine = (function () {
    'use strict';

    function renderModulesGrid(container, completedModulesSet, userClearance) {
        if (!container) return;

        const isAllCompleted = completedModulesSet.size >= 10;

        const completionBannerHtml = isAllCompleted ? `
            <div class="cyber-completion-banner" style="background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.4); border-radius:12px; padding:16px 20px; margin-bottom:24px; display:flex; align-items:center; gap:16px; width:100%; grid-column:1 / -1;">
                <div style="font-size:32px; color:#00f3ff;"><i class="fa-solid fa-shield-halved"></i></div>
                <div>
                    <h4 style="color:#00f3ff; font-family:'Orbitron',sans-serif; font-size:1.05rem; margin-bottom:4px;">🛡️ ALL SOC INVESTIGATION MISSIONS MASTERED!</h4>
                    <p style="color:#e5e7eb; font-size:0.9rem; margin:0; line-height:1.5;">Exceptional threat hunting! Put your defender skills into practice: launch the <strong>SOC Workstation Apps</strong> (SIEM Log Viewer, PCAP Inspector, Hash Checker, Stateful Firewall) or test your triage speed in the <strong>Incident Response Simulator</strong> to gain bonus XP!</p>
                </div>
            </div>
        ` : '';

        const cardsHtml = CYBEROPS_MODULES.map((mod, idx) => {
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

        container.innerHTML = completionBannerHtml + cardsHtml;

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
