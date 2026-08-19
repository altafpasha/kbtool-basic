/* ============================================================
   KBTool — app.js
   Button-driven transaction ID formatter and copier
   ============================================================ */

(function () {
  'use strict';

  // ── DOM refs ────────────────────────────────────────────────
  const loanIdInput   = document.getElementById('loan-id');
  const idsInput      = document.getElementById('ids-input');
  const outputBox     = document.getElementById('output');
  const btnConvert    = document.getElementById('btn-convert');
  const btnReset      = document.getElementById('btn-reset');
  const btnCopyResult = document.getElementById('btn-copy-result');
  const resetCounter  = document.getElementById('reset-counter');

  const toastCopied   = document.getElementById('toast-copied');
  const toastEmpty    = document.getElementById('toast-empty');
  const toastDup      = document.getElementById('toast-duplicate');
  const toastDupIds   = document.getElementById('toast-dup-ids');
  const closeDupToast = document.getElementById('close-dup-toast');

  // ── State ───────────────────────────────────────────────────
  let currentResult = '';
  let resetCount    = 0;
  let copiedTimer   = null;
  let emptyTimer    = null;
  let dupTimer      = null;

  // ── Helpers ─────────────────────────────────────────────────

  /**
   * Parse raw input into an array of non-empty IDs.
   */
  function parseIds(raw) {
    if (!raw) return [];
    return raw
      .trim()
      .split(/[,\s\n\r\t]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0);
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
   * Returns { result, duplicates, empty }.
   */
  function buildResult(rawIds, loanId) {
    const arr = parseIds(rawIds);

    if (arr.length === 0) {
      return { result: '', duplicates: [], empty: true };
    }

    const dups = findDuplicates(arr);
    if (dups.length > 0) {
      return { result: '', duplicates: dups, empty: false };
    }

    let formatted = `${arr.length}:${arr.join(',')}`;
    if (loanId && loanId.trim()) {
      formatted = `${loanId.trim()}:${formatted}`;
    }
    return { result: formatted, duplicates: [], empty: false };
  }

  // ── Toast helpers ────────────────────────────────────────────

  function showCopiedToast() {
    if (copiedTimer) clearTimeout(copiedTimer);

    // Show toast
    if (toastCopied) toastCopied.hidden = false;

    // Button feedback
    if (btnConvert) {
      btnConvert.innerHTML = '<i class="fas fa-check"></i> Copied!';
      btnConvert.classList.add('btn-copied');
    }
    if (btnCopyResult) {
      btnCopyResult.innerHTML = '<i class="fas fa-check"></i> Copied';
      btnCopyResult.classList.add('btn-copied');
    }

    copiedTimer = setTimeout(() => {
      if (toastCopied) toastCopied.hidden = true;
      if (btnConvert) {
        btnConvert.innerHTML = '<i class="fas fa-copy"></i> Convert &amp; Copy <i class="fas fa-arrow-right btn-arrow"></i>';
        btnConvert.classList.remove('btn-copied');
      }
      if (btnCopyResult) {
        btnCopyResult.innerHTML = '<i class="fas fa-copy"></i> Copy';
        btnCopyResult.classList.remove('btn-copied');
      }
    }, 2000);
  }

  function showEmptyToast() {
    if (emptyTimer) clearTimeout(emptyTimer);
    if (toastEmpty) {
      toastEmpty.hidden = false;
      emptyTimer = setTimeout(() => {
        toastEmpty.hidden = true;
      }, 3000);
    }
  }

  function showDuplicateToast(dups) {
    if (dupTimer) clearTimeout(dupTimer);
    if (toastDup && toastDupIds) {
      toastDupIds.textContent = 'Duplicates: ' + dups.join(', ');
      toastDup.hidden = false;
      dupTimer = setTimeout(() => {
        toastDup.hidden = true;
      }, 5000);
    }
  }

  if (closeDupToast && toastDup) {
    closeDupToast.addEventListener('click', () => {
      toastDup.hidden = true;
      if (dupTimer) clearTimeout(dupTimer);
    });
  }

  // ── Output rendering ─────────────────────────────────────────

  function renderOutput(value) {
    currentResult = value || '';
    if (value) {
      outputBox.classList.add('has-value');
      outputBox.textContent = value;
      if (btnCopyResult) btnCopyResult.disabled = false;
    } else {
      outputBox.classList.remove('has-value');
      outputBox.innerHTML = '<span class="output-placeholder">Result will appear here…</span>';
      if (btnCopyResult) btnCopyResult.disabled = true;
    }
  }

  // ── Copy to clipboard ────────────────────────────────────────

  function copyToClipboard(text) {
    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(showCopiedToast)
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(ta);
      if (successful) showCopiedToast();
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
  }

  // ── Core action ──────────────────────────────────────────────

  function convertAndCopy() {
    const { result, duplicates, empty } = buildResult(idsInput.value, loanIdInput.value);

    if (empty) {
      showEmptyToast();
      idsInput.focus();
      return;
    }

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
    if (resetCounter) resetCounter.textContent = resetCount;
    idsInput.focus();
  }

  // ── Event listeners ──────────────────────────────────────────

  if (btnConvert) {
    btnConvert.addEventListener('click', convertAndCopy);
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetFields);
  }

  if (btnCopyResult) {
    btnCopyResult.addEventListener('click', () => {
      if (currentResult) {
        copyToClipboard(currentResult);
      }
    });
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to convert & copy
  idsInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      convertAndCopy();
    }
  });

  loanIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      idsInput.focus();
    }
  });

})();
