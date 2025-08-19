document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-plan').forEach(button => {
      button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        const planName = this.closest('.plan').querySelector('h3').textContent;
        showToast(`Plano ${planName} selecionado! Redirecionando...`, "success");
        setTimeout(() => {
          console.log(`Redirecionando para o plano: ${plan}`);
        }, 1500);
      });
    });
  });