"use client";

import { PantallaMensaje } from "@/components/pantalla-mensaje";

// Error Boundary de la app: nunca pantalla en blanco (regla UX 18).
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PantallaMensaje
      titulo="Algo no salió como esperábamos"
      texto="No es tu culpa. Intenta de nuevo y, si sigue pasando, vuelve en unos minutos."
      accion={{ texto: "Intentar de nuevo", onClick: reset }}
    />
  );
}
