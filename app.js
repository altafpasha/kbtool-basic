/* ============================================================
   KBTool — app.js
   All logic ported from the React Transaction component
   ============================================================ */

(function () {
  'use strict';

  // ── DOM refs ────────────────────────────────────────────────
  const loanIdInput     = document.getElementById('loan-id');
  const idsInput        = document.getElementById('ids-input');
  const outputBox       = document.getElementById('output');
  const btnConvert      = document.getElementById('btn-convert');
  const btnReset        = document.getElementById('btn-reset');
  const resetCounter    = document.getElementById('reset-counter');
  const toggleAuto      = document.getElementById('toggle-auto');
  const toggleAutoReset = document.getElementById('toggle-autoreset');
  const autoLabel       = document.getElementById('auto-label');

  const toastCopied   = document.getElementById('toast-copied');
  const toastDup      = document.getElementById('toast-duplicate');
  const toastDupIds   = document.getElementById('toast-dup-ids');
  const closeDupToast = document.getElementById('close-dup-toast');

  // ── State ───────────────────────────────────────────────────
  let resetCount      = 0;
  let copiedTimer     = null;
  let dupTimer        = null;
  let autoResetTimer  = null;

  // ── Helpers ─────────────────────────────────────────────────

  /**
   * Parse raw input into an array of non-empty IDs.
   */
  function parseIds(raw) {
    return raw.trim().split(/[,\s]+/).filter(id => id !== '');
  }

  /**
   * Find duplicate IDs. Returns an array of duplicated values.
   */
  function findDuplicates(arr) {
    const counts = {};
    const dups   = [];
    for (const id of arr) {
      counts[id] = (counts[id] || 0) + 1;
      if (counts[id] === 2) dups.push(id);
    }
    return dups;
  }

  /**
   * Build formatted result string.
   * Returns { result, duplicates }.
   */
  function buildResult(rawIds, loanId) {
    const arr  = parseIds(rawIds);
    const dups = findDuplicates(arr);

    if (dups.length > 0) {
      return { result: '', duplicates: dups };
    }

    if (arr.length === 0) return { result: '', duplicates: [] };

    let formatted = `${arr.length}:${arr.join(',')}`;
    if (loanId.trim()) {
      formatted = `${loanId.trim()}:${formatted}`;
    }
    return { result: formatted, duplicates: [] };
  }

  // ── Toast helpers ────────────────────────────────────────────

  function showCopiedToast() {
    if (copiedTimer) clearTimeout(copiedTimer);

    // Toast
    toastCopied.hidden = false;

    // Button feedback
    btnConvert.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btnConvert.classList.add('btn-copied');

    copiedTimer = setTimeout(() => {
      toastCopied.hidden = true;
      btnConvert.innerHTML = '<i class="fas fa-copy"></i> Convert &amp; Copy';
      btnConvert.classList.remove('btn-copied');
    }, 2000);
  }

  function showDuplicateToast(dups) {
    if (dupTimer) clearTimeout(dupTimer);
    toastDupIds.textContent = 'Duplicates: ' + dups.join(', ');
    toastDup.hidden = false;
    dupTimer = setTimeout(() => { toastDup.hidden = true; }, 5000);
  }

  closeDupToast.addEventListener('click', () => {
    toastDup.hidden = true;
    if (dupTimer) clearTimeout(dupTimer);
  });

  // ── Output rendering ─────────────────────────────────────────

  function renderOutput(value) {
    if (value) {
      outputBox.classList.add('has-value');
      outputBox.textContent = value;
    } else {
      outputBox.classList.remove('has-value');
      outputBox.innerHTML = '<span class="output-placeholder">Result will be displayed here…</span>';
    }
  }

  // ── Copy to clipboard ────────────────────────────────────────

  function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(showCopiedToast)
      .catch(() => {
        // Fallback for older browsers / non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopiedToast();
      });

    if (toggleAutoReset.checked) {
      if (autoResetTimer) clearTimeout(autoResetTimer);
      autoResetTimer = setTimeout(resetFields, 5000);
    }
  }

  // ── Core action ──────────────────────────────────────────────

  function convertAndCopy() {
    const { result, duplicates } = buildResult(idsInput.value, loanIdInput.value);

    if (duplicates.length > 0) {
      showDuplicateToast(duplicates);
      renderOutput('');
      return;
    }

    renderOutput(result);
    copyToClipboard(result);
  }

  // ── Reset ────────────────────────────────────────────────────

  function resetFields() {
    loanIdInput.value = '';
    idsInput.value    = '';
    renderOutput('');
    resetCount++;
    resetCounter.textContent = resetCount;
  }

  // ── Event listeners ──────────────────────────────────────────

  btnConvert.addEventListener('click', convertAndCopy);

  btnReset.addEventListener('click', resetFields);

  // Auto-label update
  toggleAuto.addEventListener('change', () => {
    autoLabel.textContent = toggleAuto.checked ? 'Auto' : 'Manual';
  });

  // Auto-mode: convert on every keystroke
  idsInput.addEventListener('input', () => {
    if (toggleAuto.checked) convertAndCopy();
  });

  // Auto-mode: convert on paste
  idsInput.addEventListener('paste', (e) => {
    if (!toggleAuto.checked) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    idsInput.value = pasted;
    convertAndCopy();
  });

  // Auto-mode: convert on loan ID change
  loanIdInput.addEventListener('input', () => {
    if (toggleAuto.checked && idsInput.value.trim()) convertAndCopy();
  });

  // Enter key trigger
  idsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      convertAndCopy();
    }
  });
  loanIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') convertAndCopy();
  });

})();
