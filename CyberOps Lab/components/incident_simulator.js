/* ==========================================================================
   CyberOps Lab (Level 2) - Component: Randomized Incident Response Simulator
   ========================================================================== */

const IncidentSimulatorEngine = (function () {
    'use strict';

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function initIncidentSimulator(container) {
        if (!container) return;

        // Select 1 random incident scenario from SOC_INCIDENT_SCENARIOS
        const activeScenario = SOC_INCIDENT_SCENARIOS[Math.floor(Math.random() * SOC_INCIDENT_SCENARIOS.length)];

        // Prepare questions with shuffled options, preserving correct option reference
        const preparedQuestions = activeScenario.questions.map((q, idx) => {
            const correctText = q.options[q.correctIndex];
            const shuffled = shuffleArray(q.options);
            const newCorrectIdx = shuffled.indexOf(correctText);
            return {
                id: q.id,
                question: q.question,
                options: shuffled,
                correctIndex: newCorrectIdx
            };
        });

        container.innerHTML = `
            <div class="soc-app-wrapper incident-sim-card">
                <div class="soc-learning-banner" style="background:rgba(0,243,255,0.08); border:1px dashed var(--cyan); border-radius:10px; padding:10px 16px; margin-bottom:18px; display:flex; align-items:center; gap:12px; font-size:0.88rem;">
                    <i class="fa-solid fa-lightbulb text-amber" style="font-size:18px;"></i>
                    <div>
                        <strong>Learning Tip:</strong> Master all 10 SOC Modules to easily solve real-world incident response challenges! 
                        <a href="#" class="tip-jump-modules text-cyan" data-mod="${activeScenario.moduleRef}" style="font-weight:700; text-decoration:underline;">Review ${activeScenario.moduleTitle}</a>
                    </div>
                </div>

                <div class="soc-app-header">
                    <h3><i class="fa-solid fa-user-ninja text-cyan"></i> Enterprise Incident Response Triage Mission</h3>
                    <p>Conduct triage investigation for this live enterprise breach and submit your official 5-question SOC Incident Report.</p>
                </div>

                <div class="mission-brief-card" style="background:rgba(255,42,109,0.08); border:1px solid var(--cyber-danger); padding:16px; border-radius:12px; margin-bottom:20px;">
                    <h4 class="text-danger" style="margin-bottom:8px;"><i class="fa-solid fa-triangle-exclamation"></i> ${activeScenario.title}</h4>
                    <p style="font-size:0.9rem; line-height:1.6; color:#fff;">${activeScenario.briefing}</p>
                </div>

                <div class="incident-report-form">
                    <h4 class="text-cyan" style="margin-bottom:14px;"><i class="fa-solid fa-clipboard-check"></i> Submit Official SOC 5-Point Incident Report</h4>
                    
                    ${preparedQuestions.map((q, qIdx) => `
                        <div class="form-row" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">${q.question}</label>
                            <select class="soc-select incident-q-sel" data-qidx="${qIdx}" style="width:100%;">
                                <option value="">Select answer option...</option>
                                ${q.options.map((opt, oIdx) => `
                                    <option value="${oIdx}">${opt}</option>
                                `).join('')}
                            </select>
                        </div>
                    `).join('')}

                    <div style="display:flex; gap:12px; margin-top:20px;">
                        <button class="cyber-btn-cyan" id="btn-submit-incident-report" style="flex:1; padding:12px;"><i class="fa-solid fa-paper-plane"></i> SUBMIT INCIDENT REPORT</button>
                        <button class="soc-tab-btn" id="btn-new-random-incident" style="padding:12px;"><i class="fa-solid fa-rotate"></i> NEW RANDOM INCIDENT</button>
                    </div>
                </div>

                <div id="incident-report-result" class="soc-feedback-box" style="display:none; margin-top:20px;"></div>
            </div>
        `;

        container.querySelectorAll('.tip-jump-modules').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const modId = e.currentTarget.getAttribute('data-mod');
                if (window.CyberOpsApp) window.CyberOpsApp.switchToModulesTab(modId);
            };
        });

        container.querySelector('#btn-new-random-incident').onclick = () => {
            initIncidentSimulator(container);
        };

        const resBox = container.querySelector('#incident-report-result');

        container.querySelector('#btn-submit-incident-report').onclick = () => {
            const selects = container.querySelectorAll('.incident-q-sel');
            let correctAnswers = 0;
            let allAnswered = true;

            selects.forEach((sel, idx) => {
                const selectedVal = sel.value;
                if (selectedVal === '') {
                    allAnswered = false;
                } else if (parseInt(selectedVal) === preparedQuestions[idx].correctIndex) {
                    correctAnswers++;
                }
            });

            if (!allAnswered) {
                resBox.style.display = 'block';
                resBox.className = 'soc-feedback-box danger';
                resBox.innerHTML = `<p class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> Please answer all 5 report questions before submitting.</p>`;
                return;
            }

            resBox.style.display = 'block';

            let quizRes = { gainedXP: 0, isNewHigh: false, currentCorrect: correctAnswers, previousBest: 0, totalQuizEarnedXP: 0 };

            if (window.CyberOpsApp) {
                quizRes = window.CyberOpsApp.awardQuizXP(activeScenario.id, correctAnswers, preparedQuestions.length, 150, 'threat_hunter');
            }

            if (correctAnswers >= 4) {
                resBox.className = 'soc-feedback-box success';
                resBox.innerHTML = `
                    <h3 class="text-cyan"><i class="fa-solid fa-award"></i> INCIDENT REPORT APPROVED! (SCORE: ${correctAnswers}/5)</h3>
                    <p style="margin:10px 0;">Outstanding triage analysis for <strong>${activeScenario.title}</strong>!</p>
                    ${quizRes.isNewHigh ? `
                        <p class="highlight" style="font-size:1.1rem;">+${quizRes.gainedXP} NEW XP Earned! (Best Score: ${quizRes.currentCorrect}/5 — Total Mission XP: ${quizRes.totalQuizEarnedXP}/150 XP)</p>
                    ` : `
                        <p style="color:var(--text-muted); font-size:0.9rem;">(Previous Best Score: ${quizRes.previousBest}/5 — No duplicate XP awarded)</p>
                    `}
                `;
            } else {
                resBox.className = 'soc-feedback-box danger';
                resBox.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-circle-xmark"></i> INCIDENT REPORT REJECTED (SCORE: ${correctAnswers}/5)</h4>
                    <p>Some findings in your report were inaccurate. Review <strong>${activeScenario.moduleTitle}</strong> for details before resubmitting.</p>
                `;
            }
        };
    }

    return {
        initIncidentSimulator
    };
})();
