import { PantallaMensaje } from "@/components/pantalla-mensaje";

export default function NotFound() {
  return (
    <PantallaMensaje
      titulo="No encontramos esa página"
      texto="Puede que el link esté mal escrito o que ya no exista."
      accion={{ texto: "Volver al inicio", href: "/" }}
    />
  );
}
