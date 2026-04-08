document.addEventListener("DOMContentLoaded", () => {
  const valorNeto = document.getElementById("valorNeto");
  const iva = document.getElementById("iva");
  const total = document.getElementById("total");
  const fecha = document.getElementById("fecha");

  if (fecha) {
    const hoy = new Date();
    fecha.value = hoy.toISOString().split("T")[0];
  }

  function formatearUF(valor) {
    return Number(valor || 0).toFixed(2);
  }

  function recalcularTotales() {
    if (!valorNeto || !iva || !total) return;

    const neto = parseFloat(valorNeto.value) || 0;
    const valorIva = neto * 0.19;
    const valorTotal = neto + valorIva;

    iva.value = formatearUF(valorIva);
    total.value = formatearUF(valorTotal);
  }

  if (valorNeto) {
    valorNeto.addEventListener("input", recalcularTotales);
    valorNeto.addEventListener("change", recalcularTotales);
  }

  recalcularTotales();
});

function generarPDF() {
  const elemento = document.getElementById("cotizacion");

  document.body.classList.add("pdf-mode");

  const opciones = {
    margin: [0.04, 0.04, 0.04, 0.04],
    filename: "cotizacion-licman.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 1.6,
      useCORS: true
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