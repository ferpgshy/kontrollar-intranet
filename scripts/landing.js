document.addEventListener('DOMContentLoaded', function() {
    // Eventos para os botões de plano
    document.querySelectorAll('.btn-plan').forEach(button => {
      button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        const planName = this.closest('.plan').querySelector('h3').textContent;
        showToast(`Plano ${planName} selecionado! Redirecionando...`, "success");
        
        // Simular redirecionamento após 1.5 segundos
        setTimeout(() => {
          // Aqui viria a lógica de redirecionamento para checkout
          // window.location.href = `checkout.html?plan=${plan}`;
          console.log(`Redirecionando para o plano: ${plan}`);
        }, 1500);
      });
    });
  });