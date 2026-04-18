// Controla o menu movel em telas menores.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    mainNav.classList.toggle("nav--open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("nav--open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Move o braco da maquina do hero de acordo com o cursor dentro do card.
const heroCard = document.querySelector(".hero-card");
const heroMachineLower = document.getElementById("heroMachineLower");
const heroMachineUpper = document.getElementById("heroMachineUpper");

if (heroCard && heroMachineLower && heroMachineUpper) {
  const resetHeroMachine = () => {
    heroMachineLower.style.transform = "rotate(-3deg)";
    heroMachineUpper.style.transform = "rotate(2deg)";
  };

  const updateHeroMachine = (clientX, clientY) => {
    const cardRect = heroCard.getBoundingClientRect();
    const xRatio = (clientX - cardRect.left) / cardRect.width;
    const yRatio = (clientY - cardRect.top) / cardRect.height;
    const clampedX = Math.max(0, Math.min(xRatio, 1));
    const clampedY = Math.max(0, Math.min(yRatio, 1));

    const lowerRotation = -14 + (clampedX * 24);
    const upperRotation = 16 - (clampedY * 30) - (clampedX * 6);

    heroMachineLower.style.transform = `rotate(${lowerRotation}deg)`;
    heroMachineUpper.style.transform = `rotate(${upperRotation}deg)`;
  };

  heroCard.addEventListener("mousemove", (event) => {
    updateHeroMachine(event.clientX, event.clientY);
  });

  heroCard.addEventListener("mouseleave", resetHeroMachine);

  heroCard.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length > 0) {
        updateHeroMachine(event.touches[0].clientX, event.touches[0].clientY);
      }
    },
    { passive: true }
  );

  heroCard.addEventListener("touchend", resetHeroMachine);

  resetHeroMachine();
}

// Faz a mini plataforma alinhar com links especificos do menu superior.
const liftTrack = document.querySelector(".lift-track");
const miniLift = document.getElementById("miniLift");

if (liftTrack && miniLift && mainNav) {
  const trackedLinks = Array.from(document.querySelectorAll(".nav a[data-lift-stop]"));

  const updateLiftPosition = (clientX) => {
    const trackRect = liftTrack.getBoundingClientRect();
    const liftWidth = miniLift.offsetWidth;
    const relativeX = clientX - trackRect.left;
    const clampedX = Math.max(0, Math.min(relativeX - liftWidth / 2, trackRect.width - liftWidth));

    miniLift.style.transform = `translateX(${clampedX}px)`;
  };

  const moveLiftToLink = (link) => {
    const navRect = mainNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const trackRect = liftTrack.getBoundingClientRect();
    const linkCenterInNav = (linkRect.left - navRect.left) + (linkRect.width / 2);
    const projectedX = trackRect.left + (linkCenterInNav / navRect.width) * trackRect.width;

    updateLiftPosition(projectedX);
  };

  const resetLiftPosition = () => {
    miniLift.style.transform = "translateX(0)";
  };

  trackedLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      moveLiftToLink(link);
    });

    link.addEventListener("mousemove", () => {
      moveLiftToLink(link);
    });

    link.addEventListener("focus", () => {
      moveLiftToLink(link);
    });
  });

  mainNav.addEventListener("mouseleave", resetLiftPosition);

  window.addEventListener("resize", () => {
    const activeLink = trackedLinks.find((link) => link.matches(":hover, :focus"));

    if (activeLink) {
      moveLiftToLink(activeLink);
      return;
    }

    resetLiftPosition();
  });
}

// Direciona o formulario para o WhatsApp da empresa com os dados preenchidos.
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const whatsappMessage = encodeURIComponent(
      `Olá, CCL Manutenções!\n\n` +
      `Estou entrando em contato pelo site.\n\n` +
      `Nome: ${name}\n` +
      `E-mail: ${email}\n` +
      `Telefone: ${phone}\n\n` +
      `Problema/solicitação:\n${message}`
    );

    window.open(
      `https://wa.me/5535999383014?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
    contactForm.reset();
  });
}
