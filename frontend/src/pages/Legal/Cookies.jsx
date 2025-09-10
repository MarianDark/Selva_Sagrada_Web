export default function Cookies() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-sm leading-relaxed text-zinc-700">
      <h1 className="text-2xl font-semibold">Política de Cookies – Selva Sagrada</h1>

      <p className="text-zinc-600">Última actualización: [DD/MM/AAAA]</p>

      <section>
        <h2 className="text-lg font-medium mb-2">Información en cumplimiento de la normativa</h2>
        <p>
          Esta política explica qué son las cookies, para qué se utilizan en la web de
          <strong> Selva Sagrada</strong> y cómo puedes gestionarlas. Las cookies son pequeños
          archivos de texto que se almacenan en tu navegador cuando visitas sitios web y permiten,
          entre otras cosas, recordar tus preferencias o analizar el uso del sitio.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">¿Qué son las cookies y para qué las usamos?</h2>
        <p>
          Usamos cookies para habilitar funciones esenciales del sitio (por ejemplo, iniciar sesión o
          realizar una reserva), recordar tus preferencias (idioma, región) y comprender cómo se
          utiliza la web con fines estadísticos y de mejora continua. Las cookies no contienen
          malware, pero pueden impactar tu privacidad al recoger información de uso (hábitos de
          navegación, preferencias, etc.).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">¿Qué información guardan?</h2>
        <p>
          Normalmente almacenan datos técnicos, identificadores anónimos, preferencias y estadísticas
          de uso. No recopilamos categorías especiales de datos personales a través de cookies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Tipos de cookies</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Técnicas</strong>: necesarias para el funcionamiento del sitio y la prestación de
            servicios (gestión de sesión, seguridad, reservas, carrito).
          </li>
          <li>
            <strong>Personalización</strong>: recuerdan tus preferencias (idioma, zona horaria,
            configuración de interfaz).
          </li>
          <li>
            <strong>Análisis</strong>: miden la actividad del sitio y ayudan a entender cómo lo usan
            los visitantes (páginas más vistas, tiempo en página), con el fin de mejorar la
            experiencia.
          </li>
          <li>
            <strong>Publicitarias</strong>: gestionan espacios publicitarios.
          </li>
          <li>
            <strong>Publicidad comportamental</strong>: muestran anuncios adaptados a un perfil
            elaborado según tus hábitos de navegación.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Propias y de terceros</h2>
        <p>
          <strong>Propias</strong>: generadas por el dominio de Selva Sagrada. <br />
          <strong>De terceros</strong>: generadas por proveedores externos (p. ej., analítica, reproductores
          embebidos). Estos terceros pueden usar sus propias cookies con finalidades que ellos
          determinan y están sujetas a sus políticas.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Cookies que puede utilizar este sitio</h2>
        <p>
          La lista es orientativa y puede variar según funcionalidades activas. Mantendremos esta
          sección actualizada cuando incorporemos cambios relevantes.
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="min-w-full border text-xs">
            <thead className="bg-zinc-100">
              <tr>
                <th className="border px-3 py-2 text-left">Nombre</th>
                <th className="border px-3 py-2 text-left">Tipo / Titular</th>
                <th className="border px-3 py-2 text-left">Finalidad</th>
                <th className="border px-3 py-2 text-left">Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">ss_session</td>
                <td className="border px-3 py-2">Técnica / Propia</td>
                <td className="border px-3 py-2">
                  Mantiene la sesión del usuario autenticado y la seguridad del sitio.
                </td>
                <td className="border px-3 py-2">Sesión</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">cookie_consent</td>
                <td className="border px-3 py-2">Técnica / Propia</td>
                <td className="border px-3 py-2">Guarda el estado de consentimiento de cookies.</td>
                <td className="border px-3 py-2">6–12 meses</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">locale</td>
                <td className="border px-3 py-2">Personalización / Propia</td>
                <td className="border px-3 py-2">Recuerda el idioma o región preferidos.</td>
                <td className="border px-3 py-2">1 año</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">_ga, _gid (ejemplo)</td>
                <td className="border px-3 py-2">Análisis / Terceros</td>
                <td className="border px-3 py-2">
                  Métricas de navegación anónimas para mejorar la web (Google Analytics u otros).
                </td>
                <td className="border px-3 py-2">24 h – 2 años</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">ads_* (ejemplo)</td>
                <td className="border px-3 py-2">Publicidad / Terceros</td>
                <td className="border px-3 py-2">Gestiona y mide la eficacia publicitaria.</td>
                <td className="border px-3 py-2">Variable</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-zinc-600">
          Si incorporamos herramientas de terceros, añadiremos aquí enlaces a sus políticas (p. ej.,
          “Política de cookies de [Proveedor]”).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Gestión del consentimiento</h2>
        <p>
          Mostramos un aviso/banner de cookies al acceder por primera vez. Puedes aceptar, rechazar
          o configurar categorías no esenciales en cualquier momento desde{' '}
          <a href="/ajustes-cookies" className="text-blue-600 hover:underline">
            Ajustes de cookies
          </a>{' '}
          (si está disponible). Las cookies técnicas no se pueden deshabilitar porque son necesarias
          para el funcionamiento del sitio.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">¿Cómo configurar o bloquear cookies?</h2>
        <p>
          Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador. Ten
          en cuenta que, si bloqueas algunas cookies, ciertas funciones podrían no estar disponibles.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            Internet Explorer:{' '}
            <a
              href="http://windows.microsoft.com/es-xl/internet-explorer/delete-manage-cookies#ie=ie-10"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ayuda IE
            </a>
          </li>
          <li>
            Firefox:{' '}
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ayuda Firefox
            </a>
          </li>
          <li>
            Chrome:{' '}
            <a
              href="https://support.google.com/chrome/answer/95647?hl=es"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ayuda Chrome
            </a>
          </li>
          <li>
            Safari:{' '}
            <a
              href="https://www.apple.com/legal/privacy/es/cookies/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ayuda Safari
            </a>
          </li>
        </ul>
        <p className="mt-2">
          También puedes borrar las cookies almacenadas desde las opciones de tu navegador.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Cambios en la política</h2>
        <p>
          Podemos actualizar esta política para reflejar cambios legales o técnicos. Te recomendamos
          revisarla periódicamente. La versión vigente será la publicada en esta página.
        </p>
      </section>
    </div>
  )
}
