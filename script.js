const lengthSlider = document.querySelector(".pass-length input"),
  options = document.querySelectorAll(".option input"),
  copyIcon = document.querySelector(".input-box span"),
  passwordInput = document.querySelector(".input-box input"),
  passIndicator = document.querySelector(".pass-indicator"),
  generateBtn = document.querySelector(".generate-btn");

const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "^!$%&|[](){}:;.,*+-#@<>~"
};

const generatePassword = () => {
  let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    passLength = parseInt(lengthSlider.value);

  // Verificar quais opções estão selecionadas
  let selectedOptions = 0;
  options.forEach((option) => {
    if (option.checked && option.id !== "exc-duplicate" && option.id !== "spaces") {
      staticPassword += characters[option.id];
      selectedOptions++;
    }
  });

  // Adicionar espaços ao conjunto de caracteres, se selecionado
  if (document.getElementById("spaces").checked) {
    staticPassword += " ";
  }

  // Verificar se pelo menos uma opção de caracteres está selecionada
  if (selectedOptions === 0) {
    alert("Por favor, selecione pelo menos uma opção de caracteres (letras, números ou símbolos).");
    return;
  }

  // Verificar a opção "Exclude Duplicate"
  excludeDuplicate = document.getElementById("exc-duplicate").checked;
  if (excludeDuplicate) {
    const availableChars = staticPassword.length;
    if (passLength > availableChars) {
      alert(`O comprimento da senha (${passLength}) é maior que o número de caracteres disponíveis (${availableChars}) com a opção "Excluir Duplicatas" ativada. Reduza o comprimento ou desative essa opção.`);
      return;
    }
  }

  // Gerar a senha
  for (let i = 0; i < passLength; i++) {
    let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
    if (excludeDuplicate) {
      if (!randomPassword.includes(randomChar) || randomChar === " ") {
        randomPassword += randomChar;
      } else {
        i--;
      }
    } else {
      randomPassword += randomChar;
    }
  }

  passwordInput.value = randomPassword;
  updatePassIndicator(randomPassword);
};

const updatePassIndicator = (password) => {
  // Calcular a força da senha com base no comprimento e na complexidade
  let strengthScore = 0;
  const lengthScore = password.length;

  // Pontuação por complexidade
  if (/[a-z]/.test(password)) strengthScore += 1; // Letras minúsculas
  if (/[A-Z]/.test(password)) strengthScore += 1; // Letras maiúsculas
  if (/[0-9]/.test(password)) strengthScore += 1; // Números
  if (/[^a-zA-Z0-9\s]/.test(password)) strengthScore += 1; // Símbolos
  if (/\s/.test(password)) strengthScore += 1; // Espaços

  // Ajustar a força com base no comprimento e na complexidade
  if (lengthScore <= 8 || strengthScore <= 2) {
    passIndicator.id = "weak";
  } else if (lengthScore <= 16 || strengthScore <= 3) {
    passIndicator.id = "medium";
  } else {
    passIndicator.id = "strong";
  }
};

const updateSlider = () => {
  document.querySelector(".pass-length span").innerText = lengthSlider.value;
  generatePassword();
};

const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value).then(() => {
    copyIcon.innerText = "check";
    copyIcon.style.color = "#4285F4";
    setTimeout(() => {
      copyIcon.innerText = "copy_all";
      copyIcon.style.color = "#707070";
    }, 1500);
  }).catch(err => {
    console.error("Erro ao copiar a senha:", err);
    alert("Falha ao copiar a senha. Tente novamente.");
  });
};

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);

// Inicializar o slider
updateSlider();