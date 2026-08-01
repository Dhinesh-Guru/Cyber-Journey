/* ==========================================================================
   Cipher Escape (Level 3) - Component: Interactive Story Escape Rooms Engine
   ========================================================================== */

const EscapeRoomsEngine = (function () {
    'use strict';

    function renderRoomsGrid(container, unlockedRoomsSet, completedRoomsSet) {
        if (!container) return;

        container.innerHTML = `
            <div class="rooms-grid-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
                ${CIPHER_ROOMS.map((room, idx) => {
                    const isUnlocked = unlockedRoomsSet.has(room.id) || idx === 0;
                    const isCompleted = completedRoomsSet.has(room.id);

                    return `
                        <div class="cipher-room-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}">
                            <div class="room-header">
                                <span class="room-tag"><i class="fa-solid ${room.badgeIcon}"></i> Chamber 0${idx + 1}</span>
                                <span class="room-status">${isCompleted ? '<i class="fa-solid fa-lock-open text-purple"></i> ESCAPED' : (isUnlocked ? 'UNLOCKED' : 'LOCKED')}</span>
                            </div>

                            <h3 class="room-title">${room.title}</h3>
                            <p class="room-story-snippet">${room.story.substring(0, 90)}...</p>

                            <div class="room-footer">
                                <span class="room-xp"><i class="fa-solid fa-bolt text-purple"></i> +${room.xpReward} XP</span>
                                <button class="cyber-btn-purple btn-enter-room" data-id="${room.id}" ${isUnlocked ? '' : 'disabled'}>
                                    ${isCompleted ? 'RE-ENTER ROOM' : (isUnlocked ? 'ENTER CHAMBER' : 'LOCKED')}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.querySelectorAll('.btn-enter-room').forEach(btn => {
            btn.onclick = (e) => {
                const roomId = e.currentTarget.getAttribute('data-id');
                openRoomStageModal(roomId);
            };
        });
    }

    function openRoomStageModal(roomId) {
        const room = CIPHER_ROOMS.find(r => r.id === roomId);
        if (!room) return;

        const overlay = document.getElementById('cipher-modal');
        const content = document.getElementById('cipher-modal-content');
        if (!overlay || !content) return;

        let activeHintLevel = 0; // Starts at 0 revealed hints!

        function renderRoomContent() {
            content.innerHTML = `
                <div class="cipher-room-stage">
                    <div class="soc-learning-banner" style="background:rgba(176,38,255,0.08); border:1px dashed var(--purple); border-radius:10px; padding:10px 16px; margin-bottom:18px; display:flex; align-items:center; gap:12px; font-size:0.88rem;">
                        <i class="fa-solid fa-lightbulb text-amber" style="font-size:18px;"></i>
                        <div>
                            <strong>Learning Tip:</strong> Need help solving this cipher room? Check out 
                            <a href="#" class="tip-jump-modules text-purple" data-mod="${room.moduleRef}" style="font-weight:700; text-decoration:underline;">${room.moduleTitle}</a> in the Modules section!
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span class="mod-badge-pill"><i class="fa-solid ${room.badgeIcon}"></i> ${room.badgeName}</span>
                        <span class="text-purple" style="font-family:var(--font-heading); font-weight:800;">+${room.xpReward} XP</span>
                    </div>

                    <h2 class="text-purple" style="font-family:var(--font-heading); margin-bottom:12px;">${room.title}</h2>
                    <p style="font-size:0.9rem; line-height:1.6; color:#fff; background:rgba(255,255,255,0.03); padding:14px; border-radius:10px; margin-bottom:16px;">${room.story}</p>

                    <div class="puzzle-box-card" style="background:rgba(13,6,20,0.9); border:1px solid var(--purple); padding:18px; border-radius:12px; margin-bottom:20px;">
                        <h4 class="text-purple" style="margin-bottom:8px;"><i class="fa-solid fa-key"></i> CHAMBER PUZZLE PROMPT</h4>
                        <div style="font-size:0.95rem; line-height:1.6; color:#fff;">${room.puzzlePrompt}</div>
                    </div>

                    <div class="hints-accordion-box" style="margin-bottom:20px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div>
                                <strong style="color:var(--text-muted); font-size:0.85rem;">PROGRESSIVE CHAMBER HINTS (${activeHintLevel}/3 UNLOCKED)</strong>
                                <div style="font-size:0.75rem; color:var(--cyber-amber); margin-top:2px;">⚠️ Note: Unlocking a hint costs -5 XP penalty!</div>
                            </div>
                            <button class="chip-btn btn-unlock-next-hint" ${activeHintLevel >= 3 ? 'disabled' : ''}><i class="fa-solid fa-lightbulb"></i> ${activeHintLevel >= 3 ? 'ALL HINTS UNLOCKED (3/3)' : `UNLOCK HINT (${activeHintLevel + 1}/3)`}</button>
                        </div>
                        
                        <div id="hints-display-area" style="display:flex; flex-direction:column; gap:8px;">
                            ${renderHintsList(room.hints, activeHintLevel)}
                        </div>
                    </div>

                    <div class="submit-answer-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:12px;">
                        <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">Enter Door Passcode / Cipher Decryption Solution:</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="room-answer-input" placeholder="Type answer (e.g. HELLO WORLD)..." class="soc-input" style="flex:1;">
                            <button class="cyber-btn-purple" id="btn-submit-room-answer"><i class="fa-solid fa-door-open"></i> UNLOCK DOOR</button>
                        </div>
                        <div id="room-answer-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                    </div>
                </div>
            `;

            content.querySelectorAll('.tip-jump-modules').forEach(link => {
                link.onclick = (e) => {
                    e.preventDefault();
                    const modId = e.currentTarget.getAttribute('data-mod');
                    hideModal();
                    if (window.CipherEscapeApp) window.CipherEscapeApp.switchToModulesTab(modId);
                };
            });

            const hintBtn = content.querySelector('.btn-unlock-next-hint');
            if (hintBtn) {
                hintBtn.onclick = () => {
                    if (activeHintLevel < 3) {
                        activeHintLevel++;
                        renderRoomContent();
                    }
                };
            }

            const submitBtn = content.querySelector('#btn-submit-room-answer');
            const ansInput = content.querySelector('#room-answer-input');
            const feedback = content.querySelector('#room-answer-feedback');

            if (submitBtn && ansInput && feedback) {
                submitBtn.onclick = () => {
                    const userVal = ansInput.value.trim().toUpperCase();
                    const targetVal = room.targetAnswer.trim().toUpperCase();

                    feedback.style.display = 'block';

                    if (userVal === targetVal) {
                        const hintPenalty = activeHintLevel * 5;
                        const netXP = Math.max(10, room.xpReward - hintPenalty);

                        feedback.className = 'soc-feedback-box success';
                        feedback.innerHTML = `
                            <h3 class="text-purple"><i class="fa-solid fa-door-open"></i> CHAMBER UNLOCKED & ESCAPED!</h3>
                            <p style="margin:8px 0;">Correct solution! You decoded passcode <code>${targetVal}</code>.</p>
                            <p class="highlight">+${netXP} XP Awarded! ${hintPenalty > 0 ? `(-${hintPenalty} XP penalty for ${activeHintLevel} hints used)` : '(No hint penalty!)'}</p>
                        `;

                        if (window.CipherEscapeApp) {
                            window.CipherEscapeApp.awardRoomXP(room.id, netXP, room.badgeId);
                        }

                        setTimeout(() => {
                            hideModal();
                            window.CipherEscapeApp.renderRoomsView();
                        }, 2200);
                    } else {
                        feedback.className = 'soc-feedback-box danger';
                        feedback.innerHTML = `
                            <h4 class="text-danger"><i class="fa-solid fa-lock"></i> DOOR PASSCODE REJECTED</h4>
                            <p>Incorrect solution. Review the hints above or use the Cryptography Workbench tools in the decoders tab!</p>
                        `;
                    }
                };
            }
        }

        renderRoomContent();
        overlay.classList.add('active');
    }

    function renderHintsList(hints, activeLevel) {
        if (activeLevel === 0) {
            return `<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">No hints unlocked yet. Click "UNLOCK HINT" if you get stuck (-5 XP per hint).</div>`;
        }

        return hints.slice(0, activeLevel).map((h, idx) => `
            <div style="background:rgba(176,38,255,0.1); border:1px solid var(--purple); padding:10px 14px; border-radius:8px; font-size:0.88rem;">
                <strong class="text-purple">Hint ${idx + 1} (-5 XP):</strong> ${h.text}
            </div>
        `).join('');
    }

    function hideModal() {
        const overlay = document.getElementById('cipher-modal');
        if (overlay) overlay.classList.remove('active');
    }

    return {
        renderRoomsGrid,
        openRoomStageModal
    };
})();
