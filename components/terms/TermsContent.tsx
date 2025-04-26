'use client';

interface TermsContentProps {
  className?: string;
}

export default function TermsContent({ className = '' }: TermsContentProps) {
  return (
    <div className={`terms-content ${className}`}>
      <h4 className="text-lg font-bold text-[#002C5B] mb-2">TÉRMINOS Y CONDICIONES - POR UNA CAUSA JUSTA</h4>
      <p className="text-sm text-gray-500 mb-6">Última actualización: 26 de abril de 2025</p>
      
      <h5 className="font-bold text-[#002C5B] mb-2">1. DESCRIPCIÓN DEL SERVICIO</h5>
      <p className="mb-4">
        Por Una Causa Justa (en adelante, "Causa Justa", "la plataforma" o "nosotros") es una plataforma digital que tiene como objetivo conectar a personas que desean realizar donaciones con diversas causas benéficas, incluyendo pero no limitado a escuelas, hospitales, organizaciones sin fines de lucro y otras entidades que requieren asistencia financiera para sus proyectos.
      </p>
      <p className="mb-6">
        Causa Justa actúa exclusivamente como un intermediario tecnológico que facilita estas conexiones. La plataforma no retiene los fondos donados, sino que los transfiere directamente a los beneficiarios, descontando únicamente una comisión de servicio del 5% por cada transacción realizada. Esta comisión se utiliza para mantener la operatividad de la plataforma y mejorar continuamente nuestros servicios.
      </p>
      
      <h5 className="font-bold text-[#002C5B] mb-2">2. RESPONSABILIDAD DE LA PLATAFORMA</h5>
      <p className="mb-4">
        Causa Justa no asume responsabilidad por el uso final que cada beneficiario le dé a los fondos recibidos. Nuestra función se limita a proporcionar la infraestructura tecnológica necesaria para facilitar las donaciones.
      </p>
      <p className="mb-6">
        La plataforma realiza verificaciones básicas de las causas registradas, pero no puede garantizar ni se responsabiliza por el cumplimiento de los objetivos declarados por cada beneficiario. Los usuarios que realizan donaciones reconocen y aceptan esta limitación al utilizar nuestros servicios.
      </p>
      
      <h5 className="font-bold text-[#002C5B] mb-2">3. CONDICIONES PARA LOS USUARIOS</h5>
      <h6 className="font-semibold text-[#002C5B] mb-1">3.1 Aceptación de los Términos</h6>
      <p className="mb-4">
        Al acceder y utilizar la plataforma Causa Justa, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que se abstenga de utilizar nuestros servicios.
      </p>
      
      <h6 className="font-semibold text-[#002C5B] mb-1">3.2 Reglas de Conducta</h6>
      <p className="mb-2">Los usuarios de Causa Justa se comprometen a:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>No suplantar la identidad de terceros.</li>
        <li>No crear campañas falsas o engañosas.</li>
        <li>No utilizar la plataforma para actividades ilegales o fraudulentas.</li>
        <li>Proporcionar información veraz y actualizada.</li>
        <li>No utilizar la plataforma para recaudar fondos para actividades políticas, religiosas extremistas o cualquier otra actividad que pueda considerarse discriminatoria o contraria a la ley.</li>
      </ul>

      <h6 className="font-semibold text-[#002C5B] mb-1">3.3 Cuentas de Usuario</h6>
      <p className="mb-6">
        Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta. Causa Justa se reserva el derecho de suspender o eliminar cuentas que violen estos términos.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">4. COMISIONES Y PAGOS</h5>
      <h6 className="font-semibold text-[#002C5B] mb-1">4.1 Estructura de Comisiones</h6>
      <p className="mb-4">
        Causa Justa cobra una comisión fija del 5% sobre cada donación procesada a través de la plataforma. Esta comisión se descuenta automáticamente del monto donado antes de ser transferido al beneficiario.
      </p>

      <h6 className="font-semibold text-[#002C5B] mb-1">4.2 Procesamiento de Pagos</h6>
      <p className="mb-4">
        Los pagos en Causa Justa son procesados exclusivamente por Mercado Pago, un proveedor de servicios de pago de terceros. Al utilizar nuestra plataforma, usted también acepta los términos y condiciones de Mercado Pago, que aplican una comisión adicional del 4.05% por el procesamiento de cada transacción.
      </p>

      <h6 className="font-semibold text-[#002C5B] mb-1">4.3 Moneda y Conversiones</h6>
      <p className="mb-6">
        Todas las donaciones se procesan en pesos argentinos (ARS). Cualquier conversión de moneda está sujeta a las tasas y condiciones establecidas por Mercado Pago.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">5. CANCELACIONES Y DEVOLUCIONES</h5>
      <h6 className="font-semibold text-[#002C5B] mb-1">5.1 No Reembolso</h6>
      <p className="mb-4">
        Las donaciones realizadas a través de Causa Justa son, por defecto, no reembolsables una vez que han sido procesadas. Esto se debe a la naturaleza benéfica de las transacciones y al compromiso adquirido con los beneficiarios.
      </p>

      <h6 className="font-semibold text-[#002C5B] mb-1">5.2 Excepciones</h6>
      <p className="mb-4">
        En circunstancias excepcionales, como errores técnicos demostrables en el procesamiento de pagos o casos de fraude comprobado, Causa Justa podrá considerar la posibilidad de reembolso. Estas situaciones serán evaluadas caso por caso y requerirán la presentación de evidencia que respalde la solicitud.
      </p>

      <h6 className="font-semibold text-[#002C5B] mb-1">5.3 Procedimiento de Solicitud</h6>
      <p className="mb-6">
        Para solicitar la evaluación de un posible reembolso en casos excepcionales, el donante deberá contactar a nuestro equipo de soporte dentro de los 7 días posteriores a la realización de la donación, proporcionando toda la información relevante sobre la transacción.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">6. PROTECCIÓN DE DATOS</h5>
      <p className="mb-4">
        Causa Justa recopila y procesa datos personales de conformidad con su Política de Privacidad. Al utilizar nuestra plataforma, usted consiente la recopilación, uso y procesamiento de sus datos personales según lo establecido en dicha política.
      </p>
      <p className="mb-6">
        Nos comprometemos a implementar medidas de seguridad adecuadas para proteger la información personal de nuestros usuarios y a no compartir estos datos con terceros no autorizados.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">7. MODIFICACIONES A LOS TÉRMINOS</h5>
      <p className="mb-4">
        Causa Justa se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma.
      </p>
      <p className="mb-6">
        Notificaremos a los usuarios sobre cambios significativos mediante un aviso visible en nuestra página web. El uso continuado de nuestros servicios después de cualquier modificación constituye la aceptación de los nuevos términos.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">8. CONTACTO</h5>
      <p className="mb-4">
        Para cualquier consulta, sugerencia o reclamo relacionado con estos Términos y Condiciones o con el funcionamiento de la plataforma, por favor contáctenos a través de:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>Correo electrónico: contacto@porunacausajusta.com</li>
        <li>Formulario de contacto: disponible en nuestra página web</li>
      </ul>

      <h5 className="font-bold text-[#002C5B] mb-2">9. INFORMACIÓN LEGAL</h5>
      <p className="mb-6">
        Por Una Causa Justa es un servicio operado por Mauro Venticinque, CUIT 20-36838751-8, con domicilio legal en la República Argentina.
      </p>

      <h5 className="font-bold text-[#002C5B] mb-2">10. LEGISLACIÓN APLICABLE</h5>
      <p className="mb-6">
        Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
      </p>

      <p className="font-medium">
        Al utilizar la plataforma Por Una Causa Justa, usted reconoce haber leído, entendido y aceptado estos Términos y Condiciones en su totalidad.
      </p>
    </div>
  );
}
