const INSTALL_CMD =
  'curl -fsSL https://raw.githubusercontent.com/dawnpetal/VelocityUI/main/install.sh | bash';
const UNINSTALL_CMD =
  'curl -fsSL https://raw.githubusercontent.com/dawnpetal/VelocityUI/main/uninstall.sh | bash';

function bindCopy(btnId, cmd, fallbackId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (btn.classList.contains('copied')) return;

    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      const target = document.getElementById(fallbackId);
      if (!target) return;
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }

    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Copied!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.setAttribute(
        'aria-label',
        btnId === 'copyInstallBtn' ? 'Copy install command' : 'Copy uninstall command',
      );
    }, 2200);
  });
}

export function initCopy() {
  bindCopy('copyBtn', INSTALL_CMD, 'termCmd');
  bindCopy('copyInstallBtn', INSTALL_CMD, 'termInstallCmd');
  bindCopy('copyUninstallBtn', UNINSTALL_CMD, 'termUninstallCmd');
}
