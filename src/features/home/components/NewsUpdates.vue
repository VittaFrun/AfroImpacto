<template>
  <v-container id="faq" fluid class="faq-section py-12 py-md-16">
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4">
          Preguntas <span class="text-primary font-weight-bold mb-6">Frecuentes</span>
        </h2>
        <p class="section-subtext text-body-1">
          Encuentra respuestas a las dudas más comunes sobre nuestra plataforma y cómo participar.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="px-md-0 px-2">
      <v-col cols="12" xl="10">
        <v-expansion-panels
          v-model="expandedPanels"
          multiple
          variant="accordion"
          class="faq-panels"
        >
          <v-expansion-panel
            v-for="(faq, index) in faqs"
            :key="index"
            :value="index"
            class="faq-panel"
          >
            <v-expansion-panel-title class="faq-question">
              <div class="d-flex align-center">
                <v-icon 
                  :color="expandedPanels.includes(index) ? 'primary' : 'grey-darken-1'" 
                  class="mr-4"
                  size="24"
                >
                  {{ expandedPanels.includes(index) ? 'mdi-help-circle' : 'mdi-help-circle-outline' }}
                </v-icon>
                <span class="faq-question-text">{{ faq.pregunta }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="faq-answer">
              <div class="d-flex align-start">
                <v-icon color="primary" class="mr-3 mt-1" size="20">mdi-information</v-icon>
                <div class="faq-answer-content">
                  <p v-for="(parrafo, pIndex) in faq.respuesta" :key="pIndex" class="mb-3">
                    {{ parrafo }}
                  </p>
                  <div v-if="faq.links && faq.links.length > 0" class="faq-links mt-4">
                    <v-chip
                      v-for="(link, lIndex) in faq.links"
                      :key="lIndex"
                      :to="link.url"
                      color="primary"
                      variant="outlined"
                      size="small"
                      class="mr-2 mb-2"
                    >
                      <v-icon start size="16">{{ link.icon }}</v-icon>
                      {{ link.text }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Sección de contacto adicional -->
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" class="text-center">
        <v-card class="faq-contact-card pa-6" elevation="4">
          <v-icon color="primary" size="48" class="mb-4">mdi-email-outline</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">¿No encuentras tu respuesta?</h3>
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Estamos aquí para ayudarte. Contáctanos y responderemos todas tus dudas.
          </p>
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-email"
            href="mailto:contacto@afroimpacto.org"
            class="contact-btn"
          >
            Contáctanos
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ROUTES } from '@/constants/routes';

export default {
  name: 'NewsUpdates',
  data() {
    return {
      expandedPanels: [],
      faqs: [
        {
          pregunta: '¿Qué es AfroImpacto y cuál es su misión?',
          respuesta: [
            'AfroImpacto es una plataforma digital diseñada para conectar voluntarios con proyectos de impacto social enfocados en el empoderamiento de comunidades afrodescendientes.',
            'Nuestra misión es facilitar la participación ciudadana en iniciativas que transformen vidas, fortalezcan la identidad afro y promuevan el desarrollo sostenible en estas comunidades.'
          ]
        },
        {
          pregunta: '¿Cómo puedo registrarme como voluntario?',
          respuesta: [
            'Registrarte es muy sencillo. Haz clic en el botón "Registrarse" en la parte superior de la página y selecciona la opción "Voluntario".',
            'Completa el formulario con tus datos personales, habilidades y disponibilidad. Una vez registrado, podrás explorar proyectos disponibles e inscribirte en aquellos que te interesen.'
          ],
          links: [
            { text: 'Registrarse como Voluntario', url: `${ROUTES.AUTH.REGISTER}?role=voluntario`, icon: 'mdi-account-plus' }
          ]
        },
        {
          pregunta: '¿Qué tipo de proyectos puedo encontrar en la plataforma?',
          respuesta: [
            'Encontrarás proyectos diversos que abordan educación, salud, emprendimiento, cultura, medio ambiente, deporte y tecnología.',
            'Cada proyecto está diseñado para generar impacto positivo, desde talleres educativos hasta iniciativas de desarrollo económico local.'
          ]
        },
        {
          pregunta: '¿Hay algún costo para participar como voluntario?',
          respuesta: [
            'No, la participación como voluntario es completamente gratuita. AfroImpacto es una plataforma sin fines de lucro que busca facilitar la conexión entre voluntarios y proyectos de impacto social.',
            'Algunos proyectos pueden ofrecer beneficios como transporte, alimentación o certificados de participación, pero esto depende de cada organización y proyecto específico.'
          ]
        },
        {
          pregunta: '¿Cómo se gestionan las horas voluntariadas?',
          respuesta: [
            'Los voluntarios pueden registrar sus horas trabajadas directamente en la plataforma desde su área de trabajo del proyecto.',
            'Las organizaciones pueden verificar estas horas para mantener un registro preciso del tiempo invertido. Las horas verificadas pueden ser utilizadas para certificados o reconocimientos.'
          ]
        },
        {
          pregunta: '¿Puedo participar en múltiples proyectos a la vez?',
          respuesta: [
            'Sí, puedes participar en varios proyectos simultáneamente siempre que tengas la disponibilidad y capacidad para comprometerte con cada uno.',
            'La plataforma te permite gestionar tus proyectos desde tu área personal, donde puedes ver todos tus proyectos activos, tareas asignadas y horas registradas.'
          ]
        },
        {
          pregunta: '¿Qué pasa si tengo problemas técnicos o necesito ayuda?',
          respuesta: [
            'Puedes contactarnos directamente a través del correo electrónico contacto@afroimpacto.org o usando el formulario de contacto en el pie de página.',
            'Nuestro equipo está disponible para ayudarte con cualquier duda técnica, sobre el uso de la plataforma o sobre los proyectos disponibles.'
          ],
          links: [
            { text: 'Contactar Soporte', url: 'mailto:contacto@afroimpacto.org', icon: 'mdi-email' }
          ]
        },
        {
          pregunta: '¿Cómo funcionan los roles y permisos en los proyectos?',
          respuesta: [
            'Cada proyecto puede tener roles específicos como "Coordinador", "Facilitador", "Asistente", etc. Estos roles definen las responsabilidades y permisos dentro del proyecto.',
            'Los roles pueden ser asignados por la organización cuando te inscribes en un proyecto o cuando te asignan a tareas específicas. Cada rol tiene diferentes niveles de acceso y responsabilidades.'
          ]
        },
        {
          pregunta: '¿Los proyectos tienen fechas límite o duración específica?',
          respuesta: [
            'Sí, cada proyecto tiene fechas de inicio y fin definidas por la organización. Además, los proyectos pueden tener múltiples fases con sus propias fechas.',
            'Puedes ver las fechas de cada proyecto antes de inscribirte, y recibirás notificaciones sobre fechas importantes y vencimientos de tareas asignadas.'
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Colores de la paleta (referencia):
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos)
*/

.faq-section {
  background: linear-gradient(to bottom, #ffffff 20%, #fcfae9 100%);
  padding-bottom: 100px;
}

.section-heading {
  color: #2c3e50;
  line-height: 1.2;
  letter-spacing: -0.8px !important;
  font-size: 3.2rem !important;
}

.section-subtext {
  color: #424242 !important;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.15rem;
}

/* Paneles de FAQ */
.faq-panels {
  background: transparent !important;
  box-shadow: none !important;
}

.faq-panel {
  background: #ffffff !important;
  border-radius: 16px !important;
  margin-bottom: 16px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.faq-panel:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
}

.faq-panel.v-expansion-panel--active {
  box-shadow: 0 12px 28px rgba(24, 185, 126, 0.15) !important;
  border-color: rgba(24, 185, 126, 0.2);
}

.faq-question {
  background: #ffffff !important;
  padding: 20px 24px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
  min-height: 72px !important;
}

.faq-question-text {
  flex: 1;
  line-height: 1.5;
}

.faq-answer {
  background: #f8f9fa !important;
  padding: 20px 24px 24px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.faq-answer-content {
  flex: 1;
  color: #555 !important;
  line-height: 1.7;
  font-size: 1rem;
}

.faq-answer-content p {
  margin-bottom: 12px;
}

.faq-answer-content p:last-child {
  margin-bottom: 0;
}

.faq-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.faq-links .v-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-links .v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 185, 126, 0.3);
}

/* Tarjeta de contacto */
.faq-contact-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9f6 100%) !important;
  border-radius: 20px !important;
  border: 2px solid rgba(24, 185, 126, 0.1);
  transition: all 0.3s ease;
}

.faq-contact-card:hover {
  box-shadow: 0 12px 32px rgba(24, 185, 126, 0.2) !important;
  transform: translateY(-4px);
  border-color: rgba(24, 185, 126, 0.3);
}

.contact-btn {
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 0 32px !important;
  height: 48px !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(24, 185, 126, 0.4) !important;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  box-shadow: 0 6px 18px rgba(24, 185, 126, 0.6) !important;
  transform: translateY(-2px);
}

/* Responsive Adjustments */
@media (max-width: 959px) {
  .section-heading {
    font-size: 2.8rem !important;
  }
  .section-subtext {
    font-size: 1rem;
  }
  .faq-question {
    padding: 18px 20px !important;
    font-size: 1rem !important;
    min-height: 64px !important;
  }
  .faq-answer {
    padding: 18px 20px !important;
  }
  .faq-answer-content {
    font-size: 0.95rem;
  }
}

@media (max-width: 599px) {
  .faq-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .faq-panel {
    margin-bottom: 12px !important;
    border-radius: 12px !important;
  }
  .faq-question {
    padding: 16px !important;
    font-size: 0.95rem !important;
    min-height: 56px !important;
  }
  .faq-question .v-icon {
    font-size: 20px !important;
    margin-right: 12px !important;
  }
  .faq-answer {
    padding: 16px !important;
  }
  .faq-answer-content {
    font-size: 0.9rem;
  }
  .faq-contact-card {
    padding: 24px !important;
  }
  .contact-btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>