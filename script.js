document.addEventListener("DOMContentLoaded", () => {
  const valorNeto = document.getElementById("valorNeto");
  const iva = document.getElementById("iva");
  const total = document.getElementById("total");
  const fecha = document.getElementById("fecha");
  const tipoMoneda = document.getElementById("tipoMoneda");

  const labelNeto = document.getElementById("labelNeto");
  const labelIva = document.getElementById("labelIva");
  const labelTotal = document.getElementById("labelTotal");

  if (fecha) {
    const hoy = new Date();
    fecha.value = hoy.toISOString().split("T")[0];
  }

  function formatearValor(valor) {
    const moneda = tipoMoneda ? tipoMoneda.value : "UF";

    if (moneda === "CLP") {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
      }).format(valor || 0);
    }

    return `${Number(valor || 0).toFixed(2)} UF`;
  }

  function actualizarLabels() {
    if (!labelNeto || !labelIva || !labelTotal || !valorNeto) return;

    const moneda = tipoMoneda ? tipoMoneda.value : "UF";

    if (moneda === "CLP") {
      labelNeto.textContent = "Neto (CLP)";
      labelIva.textContent = "IVA 19% (CLP)";
      labelTotal.textContent = "Total a pagar (CLP)";
      valorNeto.placeholder = "0";
    } else {
      labelNeto.textContent = "Neto (UF)";
      labelIva.textContent = "IVA 19% (UF)";
      labelTotal.textContent = "Total a pagar (UF)";
      valorNeto.placeholder = "0.00";
    }
  }

  function recalcularTotales() {
    if (!valorNeto || !iva || !total) return;

    const neto = parseFloat(valorNeto.value) || 0;
    const valorIva = neto * 0.19;
    const valorTotal = neto + valorIva;

    iva.value = formatearValor(valorIva);
    total.value = formatearValor(valorTotal);
  }

  if (valorNeto) {
    valorNeto.addEventListener("input", recalcularTotales);
    valorNeto.addEventListener("change", recalcularTotales);
  }

  if (tipoMoneda) {
    tipoMoneda.addEventListener("change", () => {
      actualizarLabels();
      recalcularTotales();
    });
  }

  actualizarLabels();
  recalcularTotales();
});

function generarPDF() {
  const mensajeAnterior = document.getElementById("mensaje-validacion");
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }

  const esValido = validarCamposObligatorios();

  if (!esValido) {
    const contenedor = document.querySelector(".page");
    const mensaje = document.createElement("div");

    mensaje.id = "mensaje-validacion";
    mensaje.className = "alerta-validacion";
    mensaje.textContent = "Debes completar todos los campos obligatorios antes de generar el PDF.";

    contenedor.insertBefore(mensaje, contenedor.firstChild);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return;
  }

  const elemento = document.getElementById("cotizacion");
  if (!elemento) return;

  document.body.classList.add("pdf-mode");

  const opciones = {
    margin: [0.04, 0.04, 0.04, 0.04],
    filename: "cotizacion-licman.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 1.6,
      useCORS: true,
      scrollY: 0
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"]
    }
  };

  setTimeout(() => {
    html2pdf()
      .set(opciones)
      .from(elemento)
      .save()
      .then(() => {
        document.body.classList.remove("pdf-mode");
      })
      .catch(() => {
        document.body.classList.remove("pdf-mode");
      });
  }, 200);
}

function validarCamposObligatorios() {
  const campos = document.querySelectorAll(".required-field");
  let formularioValido = true;

  campos.forEach((campo) => {
    campo.classList.remove("required-error");

    const valor = campo.value.trim();

    if (!valor) {
      campo.classList.add("required-error");
      formularioValido = false;
    }
  });

  const valorNeto = document.getElementById("valorNeto");
  if (valorNeto) {
    const neto = parseFloat(valorNeto.value) || 0;
    valorNeto.classList.remove("required-error");

    if (neto <= 0) {
      valorNeto.classList.add("required-error");
      formularioValido = false;
    }
  }

  return formularioValido;
}