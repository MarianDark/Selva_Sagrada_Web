export default function AvisoLegal() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-sm leading-relaxed text-zinc-700">
      <h1 className="text-2xl font-semibold mb-4">Aviso Legal y Protección de Datos – Selva Sagrada</h1>

      <section>
        <h2 className="text-lg font-medium mb-2">Responsable del tratamiento</h2>
        <p>
          <strong>SELVA SAGRADA – Terapias Holísticas</strong><br />
          [Nombre del titular o representante legal]<br />
          [Dirección completa del centro o domicilio social]<br />
          [Correo electrónico de contacto]<br />
          [NIF/CIF del responsable]
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Finalidad del tratamiento</h2>
        <p>Los datos personales que nos facilite serán utilizados con las siguientes finalidades:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Gestionar solicitudes de información, reservas e inscripciones.</li>
          <li>Prestar los servicios contratados y mantener la relación profesional.</li>
          <li>Enviar comunicaciones informativas o comerciales relacionadas con nuestras actividades, siempre con su consentimiento expreso.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Legitimación</h2>
        <p>La base legal para el tratamiento de sus datos es:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Su <strong>consentimiento expreso</strong> al marcar las casillas habilitadas en los formularios.</li>
          <li>La <strong>ejecución de un contrato</strong> para la prestación de servicios solicitados.</li>
          <li>El <strong>cumplimiento de obligaciones legales</strong> aplicables a Selva Sagrada.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Destinatarios</h2>
        <p>
          Sus datos no se cederán a terceros, salvo obligación legal. 
          En algunos casos, podrán acceder a ellos proveedores que prestan servicios necesarios para nuestra actividad 
          (ej.: gestoría, alojamiento web, mailing, plataformas de reservas), siempre bajo contrato de confidencialidad.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Derechos del interesado</h2>
        <p>Como usuario tiene derecho a:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Acceder a los datos personales que tratamos sobre usted.</li>
          <li>Rectificar datos inexactos o incompletos.</li>
          <li>Solicitar la supresión de sus datos cuando ya no sean necesarios.</li>
          <li>Limitar el tratamiento de sus datos en determinadas circunstancias.</li>
          <li>Oponerse al tratamiento por motivos relacionados con su situación particular.</li>
          <li>Solicitar la portabilidad de sus datos a otro responsable.</li>
        </ul>
        <p className="mt-2">
          Para ejercer estos derechos puede enviar una solicitud junto con copia de un documento acreditativo de identidad 
          a la dirección indicada en el apartado <strong>Responsable del tratamiento</strong> o al correo electrónico de contacto.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Conservación de los datos</h2>
        <p>
          Los datos se conservarán durante el tiempo estrictamente necesario para cumplir la finalidad para la que se recabaron 
          y para determinar posibles responsabilidades legales.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Medidas de seguridad</h2>
        <p>
          Selva Sagrada se compromete a tratar sus datos de forma confidencial, adoptando las medidas técnicas y organizativas 
          necesarias para garantizar la seguridad de la información y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Información adicional</h2>
        <p>
          Puede consultar la información adicional y detallada en el apartado 
          <a href="/politica-privacidad" className="text-blue-600 hover:underline"> “Política de Privacidad”</a> disponible en nuestra web.
        </p>
      </section>
    </div>
  )
}
