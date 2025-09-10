export default function Privacidad() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-sm leading-relaxed text-zinc-700">
      <h1 className="text-2xl font-semibold">Política de Privacidad – Selva Sagrada</h1>
      <p className="text-zinc-600 mt-1">Última actualización: [DD/MM/AAAA]</p>

      {/* Índice */}
      <nav className="mt-4">
        <ul className="list-disc pl-5 space-y-1">
          <li><a className="text-blue-600 hover:underline" href="#resumen">Resumen (tabla)</a></li>
          <li><a className="text-blue-600 hover:underline" href="#responsable">Responsable</a></li>
          <li><a className="text-blue-600 hover:underline" href="#finalidades">Finalidades y base legal</a></li>
          <li><a className="text-blue-600 hover:underline" href="#categorias">Categorías de datos</a></li>
          <li><a className="text-blue-600 hover:underline" href="#destinatarios">Destinatarios</a></li>
          <li><a className="text-blue-600 hover:underline" href="#transferencias">Transferencias internacionales</a></li>
          <li><a className="text-blue-600 hover:underline" href="#conservacion">Plazos de conservación</a></li>
          <li><a className="text-blue-600 hover:underline" href="#derechos">Sus derechos</a></li>
          <li><a className="text-blue-600 hover:underline" href="#menores">Menores de edad</a></li>
          <li><a className="text-blue-600 hover:underline" href="#perfiles">Perfiles y decisiones automatizadas</a></li>
          <li><a className="text-blue-600 hover:underline" href="#permisos">Permisos específicos (consentimientos)</a></li>
          <li><a className="text-blue-600 hover:underline" href="#reclamaciones">Reclamaciones</a></li>
        </ul>
      </nav>

      {/* Resumen tabla */}
      <section id="resumen" className="mt-8">
        <h2 className="text-lg font-medium mb-2">Resumen – Información básica</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <tbody>
              <tr>
                <td className="border px-3 py-2 font-medium">Responsable</td>
                <td className="border px-3 py-2">
                  SELVA SAGRADA – Terapias Holísticas<br />
                  [Nombre del titular / CIF/NIF]<br />
                  [Dirección completa] · [Email de contacto]
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-medium">Finalidades</td>
                <td className="border px-3 py-2">
                  Gestión de solicitudes y reservas; prestación de servicios; comunicaciones informativas y (si lo consiente) comerciales; administración del sitio web y seguridad.
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-medium">Base legal</td>
                <td className="border px-3 py-2">
                  Consentimiento; ejecución de contrato; cumplimiento de obligaciones legales; interés legítimo en seguridad y mejora del servicio.
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-medium">Destinatarios</td>
                <td className="border px-3 py-2">Proveedores necesarios (hosting, emailing, reservas, gestoría), bajo contratos de encargo; sin cesiones salvo obligación legal.</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-medium">Derechos</td>
                <td className="border px-3 py-2">
                  Acceso, rectificación, supresión, oposición, limitación, portabilidad, y revocación del consentimiento. Contacto: [Email responsable].
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-medium">Conservación</td>
                <td className="border px-3 py-2">Mientras dure la relación y plazos legales aplicables. Posterior bloqueo/eliminación segura.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Responsable */}
      <section id="responsable" className="mt-8">
        <h2 className="text-lg font-medium mb-2">1) Responsable del tratamiento</h2>
        <p>
          <strong>SELVA SAGRADA – Terapias Holísticas</strong><br />
          [Nombre del titular o representante legal] · [CIF/NIF]<br />
          [Dirección completa] · [Email] · [Teléfono]<br />
          Sitio web: <a className="text-blue-600 hover:underline" href="https://www.selvasagrada.com">www.selvasagrada.com</a>
        </p>
        <p className="mt-2">
          Nos importa su privacidad. Usaremos un lenguaje claro y le facilitaremos opciones para controlar sus datos.
        </p>
      </section>

      {/* Finalidades y base legal */}
      <section id="finalidades" className="mt-8">
        <h2 className="text-lg font-medium mb-2">2) Finalidades y bases legales</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Atención y reservas:</strong> gestionar solicitudes, citas y comunicación previa a la sesión. <em>Base legal:</em> ejecución de contrato y consentimiento.</li>
          <li><strong>Prestación de servicios terapéuticos:</strong> administración de la relación profesional. <em>Base legal:</em> ejecución de contrato.</li>
          <li><strong>Comunicaciones informativas/comerciales:</strong> envío de novedades y actividades, solo con su consentimiento expreso, revocable en cualquier momento.</li>
          <li><strong>Seguridad y mantenimiento del sitio:</strong> prevención del fraude, registros técnicos y mejora del servicio. <em>Base legal:</em> interés legítimo.</li>
          <li><strong>Cumplimiento normativo:</strong> obligaciones fiscales/contables. <em>Base legal:</em> obligación legal.</li>
        </ul>
      </section>

      {/* Categorías */}
      <section id="categorias" className="mt-8">
        <h2 className="text-lg font-medium mb-2">3) Categorías de datos tratados</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Identificativos y de contacto:</strong> nombre, email, teléfono.</li>
          <li><strong>Datos de uso/tecnológicos:</strong> logs, cookies (ver <a className="text-blue-600 hover:underline" href="/politica-cookies">Política de Cookies</a>).</li>
          <li><strong>Datos de salud (sensibles):</strong> solo si son imprescindibles para el servicio y con su consentimiento explícito. Puede negarse sin que ello afecte a la navegación.</li>
          <li><strong>Imagen/redes sociales:</strong> solo con consentimiento específico y finalidades informadas.</li>
        </ul>
      </section>

      {/* Destinatarios */}
      <section id="destinatarios" className="mt-8">
        <h2 className="text-lg font-medium mb-2">4) Destinatarios</h2>
        <p>
          No cederemos sus datos a terceros salvo obligación legal. Tendrán acceso los proveedores que precisamos para operar (alojamiento web, correo transaccional, plataforma de reservas, gestoría, analítica), bajo contratos de encargo de tratamiento y garantías de confidencialidad.
        </p>
      </section>

      {/* Transferencias */}
      <section id="transferencias" className="mt-8">
        <h2 className="text-lg font-medium mb-2">5) Transferencias internacionales</h2>
        <p>
          Si algún proveedor ubicara datos fuera del EEE, exigiremos garantías adecuadas (p. ej., cláusulas contractuales tipo). Evitaremos envíos a países sin nivel adecuado de protección. En su caso, se informará con detalle.
        </p>
      </section>

      {/* Conservación */}
      <section id="conservacion" className="mt-8">
        <h2 className="text-lg font-medium mb-2">6) Plazos de conservación</h2>
        <p>
          Conservaremos los datos mientras dure la relación y los plazos legales aplicables (fiscales/contables). Una vez vencidos, bloquearemos y eliminaremos los datos de forma segura.
        </p>
      </section>

      {/* Derechos */}
      <section id="derechos" className="mt-8">
        <h2 className="text-lg font-medium mb-2">7) Derechos de la persona interesada</h2>
        <p>Puede ejercer en cualquier momento:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Acceso</strong> a sus datos.</li>
          <li><strong>Rectificación</strong> de datos inexactos.</li>
          <li><strong>Supresión</strong> (cuando proceda).</li>
          <li><strong>Limitación</strong> del tratamiento.</li>
          <li><strong>Oposición</strong> al tratamiento.</li>
          <li><strong>Portabilidad</strong> de sus datos.</li>
          <li><strong>Revocación del consentimiento</strong> en cualquier momento.</li>
        </ul>
        <p className="mt-2">
          Para ejercerlos, escriba a <strong>[Email responsable]</strong> o a la dirección indicada en <a className="text-blue-600 hover:underline" href="#responsable">Responsable</a>, adjuntando copia de documento identificativo. Responderemos en los plazos legales.
        </p>
      </section>

      {/* Menores */}
      <section id="menores" className="mt-8">
        <h2 className="text-lg font-medium mb-2">8) Datos de menores</h2>
        <p>
          Si el usuario es <strong>menor de 14 años</strong> o incapaz, el tratamiento requerirá consentimiento del padre/madre o tutor legal. Nos reservamos el derecho a solicitar documentación acreditativa.
        </p>
      </section>

      {/* Perfiles */}
      <section id="perfiles" className="mt-8">
        <h2 className="text-lg font-medium mb-2">9) Elaboración de perfiles y decisiones automatizadas</h2>
        <p>
          No tomamos decisiones automatizadas con efectos legales. Podremos realizar segmentaciones básicas (p. ej., por tipo de servicio contratado) para mejorar la comunicación, siempre con garantías y posibilidad de oposición.
        </p>
      </section>

      {/* Permisos específicos */}
      <section id="permisos" className="mt-8">
        <h2 className="text-lg font-medium mb-2">10) Permisos y consentimientos específicos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Datos de salud:</strong> solo si son imprescindibles para la sesión, con consentimiento explícito y revocable.</li>
          <li><strong>WhatsApp u otras mensajerías:</strong> previo consentimiento para comunicaciones operativas (recordatorios, cambios de cita).</li>
          <li><strong>Imagen y redes sociales:</strong> publicación únicamente con consentimiento informado y revocable.</li>
          <li><strong>Publicidad y newsletters:</strong> envío solo si marca la casilla correspondiente; siempre podrá darse de baja.</li>
          <li><strong>Cesiones y transferencias:</strong> se solicitará autorización cuando sea necesario y se informará del destinatario/país y finalidad.</li>
        </ul>
        <p className="mt-2">
          Podrá gestionar su consentimiento desde su perfil (si existe) o contactándonos en <strong>[Email responsable]</strong>.
        </p>
      </section>

      {/* Reclamaciones */}
      <section id="reclamaciones" className="mt-8">
        <h2 className="text-lg font-medium mb-2">11) Reclamaciones ante la autoridad de control</h2>
        <p>
          Si considera que no hemos atendido correctamente sus derechos, puede presentar una reclamación ante la
          <strong> Agencia Española de Protección de Datos (AEPD)</strong>:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Sede electrónica: <a className="text-blue-600 hover:underline" href="https://www.aepd.es" target="_blank" rel="noreferrer">www.aepd.es</a></li>
          <li>Dirección: C/ Jorge Juan, 6, 28001 Madrid</li>
          <li>Tel.: 901 100 099 / 912 663 517</li>
        </ul>
      </section>

      <p className="mt-8 text-zinc-600">
        Revisamos esta política periódicamente para adaptarla a cambios legales o técnicos. La versión vigente es la publicada en esta página.
      </p>
    </div>
  )
}
