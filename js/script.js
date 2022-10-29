
function navigateToFormStep(stepNumber) {
  /**
   *Oculte todas as etapas do formulário.
   */
  document.querySelectorAll(".form-step").forEach((formStepElement) => {
    formStepElement.classList.add("d-none")
  })
  /**
   * Marque todas as etapas do formulário como inacabadas.
   */
  document.querySelectorAll(".form-stepper-list").forEach((formStepHeader) => {
    formStepHeader.classList.add("form-stepper-unfinished")
    formStepHeader.classList.remove("form-stepper-active", "form-stepper-completed")
  })
  /**
   * Mostra a etapa do formulário atual (conforme passada para a função).
   */
  document.querySelector("#step-" + stepNumber).classList.remove("d-none")
  /**
   *Selecione o círculo de etapa do formulário (barra de progresso).
   */
  const formStepCircle = document.querySelector('li[step="' + stepNumber + '"]:checked')
  /**
   * Marque a etapa de formulário atual como ativa.
   */
  formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-completed")
  formStepCircle.classList.add("form-stepper-active")
  /**
   * Percorra os círculos de cada etapa do formulário.
    * Este loop continuará até o número do passo atual.
    * Exemplo: Se o passo atual for 3,
    * então o loop realizará as operações para os passos 1 e 2.
   */
  for (let index = 0; index < stepNumber; index++) {
    /**
     * Selecione o círculo de etapa do formulário (barra de progresso).
     */
    const formStepCircle = document.querySelector('li[step="' + index + '"]:checked')
    /**
     * Verifique se o elemento existe. Se sim, então prossiga.
     */
    if (formStepCircle) {
      /**
       * Marque a etapa do formulário como concluída.
       */
      formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-active")
      formStepCircle.classList.add("form-stepper-completed")
    }
  }
}
/**
 * Selecione todos os botões de navegação do formulário e percorra-os.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".btn-navigate-form-step").forEach((formNavigationBtn) => {
    /**
     * Adicione um evento de evento de clique ao botão.
     */
    // formNavigationBtn.addEventListener("click", () => {
    //     /**
    //      * Obtenha o valor da etapa.
    //      */
    //     const stepNumber = parseInt(formNavigationBtn.getAttribute("step_number"));
    //     /**
    //      * Chame a função para navegar até a etapa do formulário de destino.
    //      */
    //     navigateToFormStep(stepNumber);
    // });
  });
})

var currentTab = 0;
showTab(currentTab);
function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";

  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }

  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  fixStepIndicator(n)
}
async function nextPrev(n) {
  if ((n == 1 || n === undefined) && !validateForm()) {
    swal({
      title: "Olá!",
      text: "Por favor, selecione as notas de 0 a 5, para poder avançar!",
      button: "Ok",
      icon: "warning",
    });
    return false;
  }
  if (n === undefined) {
    try {
      console.log('realizando a chamada')
      await submitForm()
      window.location.reload();
      //reload
    } catch (error) {
      console.log('chamada realizada')
      alert('Ocorreu um erro :', error)
    }
  } else {
    var x = document.getElementsByClassName("tab");
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;

    showTab(currentTab);
  }
}


async function submitForm() {
  const receptionAttendance = document.querySelector('input[name="receptionAttendance"]:checked')?.value
  const receptionTime = document.querySelector('input[name="receptionTime"]:checked')?.value
  const receptionNote = document.querySelector('textarea[name="receptionNote"]')?.value
  const collectAttendante = document.querySelector('input[name="collectAttendante"]:checked')?.value
  const collectTime = document.querySelector('input[name="collectTime"]:checked')?.value
  const collectNote = document.querySelector('textarea[name="collectNote"]')?.value
  const telContact = document.querySelector('input[name="telContact"]')?.value
  const sugestNote = document.querySelector('textarea[name="sugestNote"]')?.value
  const physiotherapyAttendance = document.querySelector('input[name="physiotherapyAttendance"]:checked')?.value
  const physiotherapyTime = document.querySelector('input[name="physiotherapyTime"]:checked')?.value
  const physiotherapyNote = document.querySelector('textarea[name="physiotherapyNote"]')?.value
  const pathname = window.location.pathname
  const data = {
    receptionAttendance: receptionAttendance && Number(receptionAttendance),
    receptionTime: receptionTime && Number(receptionTime),
    receptionNote,
    collectAttendante: collectAttendante && Number(collectAttendante),
    collectTime: collectTime && Number(collectTime),
    collectNote,
    telContact: telContact && Number(telContact),
    sugestNote,
    type: pathname === "/fisio.html" ? "fisioterapia" : "laboratorio",
    physiotherapyAttendance: physiotherapyAttendance && Number(physiotherapyAttendance),
    physiotherapyTime: physiotherapyTime && Number(physiotherapyTime),
    physiotherapyNote
  }

  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3333/",
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json",
      success: function (result) {
        if (result.error) {
          return reject(error)
        } else {
          return resolve(result)
        }
      }
    })
  })
}

function validateForm() {
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  // y = x[currentTab].getElementsByTagName("input");
  y = x[currentTab].querySelectorAll('input:checked');
  // for (i = 0; i < y.length; i++) {

  //   if (y[i].value == "") {    
  //     y[i].className += " invalid";
  //     valid = false;
  //   }
  // }
  if(x.length -1 === currentTab){ 
    return valid;
  }
  if (y.length <= 1) {
    valid = false
  }
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid;
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}
