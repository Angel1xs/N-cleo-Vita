import plotly.graph_objects as go
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import time
import threading
import textwrap
import plotly.io as pio

# Forzar apertura en navegador
pio.renderers.default = "browser"


# --- Perfiles de resultado final (sin cambios) ---
def get_profile(score):
    if score >= 80:
        return {
            "titulo": "🌍 Renacer Planetario",
            "descripcion": (
                "Las decisiones colectivas priorizaron la descarbonización acelerada, la protección de "
                "ecosistemas clave y la justicia climática. Las ciudades se transformaron con movilidad "
                "limpia y eficiencia energética; la matriz energética se volvió mayoritariamente renovable; "
                "se restauraron bosques, humedales y costas que actúan como sumideros de carbono y barreras "
                "naturales. La contaminación del aire descendió de forma sostenida, mejorando la salud pública "
                "y la productividad. La biodiversidad comenzó a recuperarse y los eventos extremos, aunque "
                "presentes, se volvieron más manejables gracias a la adaptación basada en ciencia y datos. "
                "La cooperación internacional y la innovación abierta permitieron escalar soluciones con "
                "rapidez y transparencia."
            )
        }
    elif 50 <= score < 80:
        return {
            "titulo": "⚖️ Equilibrio Frágil",
            "descripcion": (
                "Se lograron avances parciales y desiguales. Algunas regiones adoptaron tecnologías limpias, "
                "fortalecieron sus infraestructuras y protegieron su patrimonio natural; otras mantuvieron "
                "inercias por falta de financiación, gobernanza o voluntad política. Las emisiones se "
                "estabilizaron pero no disminuyeron lo suficiente, manteniendo al planeta en un estado de "
                "vulnerabilidad crónica. La calidad del aire mejoró en varias megaciudades, pero eventos "
                "extremos y pérdidas de biodiversidad continúan afectando a comunidades vulnerables. "
                "La ventana de oportunidad sigue abierta, pero exige coordinar esfuerzos y cerrar brechas "
                "para evitar retrocesos."
            )
        }
    else:  # score < 50
        return {
            "titulo": "🔥 Colapso Ecosistémico",
            "descripcion": (
                "La inacción y las decisiones cortoplacistas sobrepasaron puntos de no retorno. La deforestación, "
                "la expansión urbana desordenada y la dependencia de combustibles fósiles intensificaron el "
                "calentamiento global. Los sistemas alimentarios y hídricos colapsaron en regiones críticas, las "
                "olas de calor y los incendios se volvieron devastadores y frecuentes, y la pérdida de biodiversidad "
                "desencadenó efectos en cascada sobre los servicios ecosistémicos. La contaminación del aire y el "
                "aumento del nivel del mar desplazaron a millones. La falta de cooperación internacional, datos "
                "abiertos y políticas efectivas condujo a una degradación irreversible del equilibrio planetario, "
                "poniendo en riesgo la continuidad de la vida tal como la conocemos."
            )
        }

# --- ⚙️ PASO 1: ESTRUCTURAR LAS PREGUNTAS DEL CUESTIONARIO ---
cuestionario = [
    {
        "region": "China", "titulo": "Niebla tóxica extrema en 2030",
        "contexto": "Se estima que para 2030, la contaminación atmosférica en China cause semanas de niebla tóxica que afecten salud, agricultura y transporte.",
        "pregunta": "Si fueras líder ambiental global, ¿qué harías?",
        "opciones": [
            {"texto": "Cerrar fábricas temporalmente para purificar el aire, aunque afecte la economía.", "puntos": 2},
            {"texto": "Instalar filtros avanzados solo en zonas urbanas.", "puntos": 1},
            {"texto": "Incentivar el traslado de industrias a zonas rurales para dispersar la contaminación.", "puntos": -1},
            {"texto": "Aumentar la producción industrial y crear más empleo para poder invertir en tecnología ambiental más adelante.", "puntos": -2}
        ]
    },
    {
        "region": "India", "titulo": "Escasez extrema de agua en 2028",
        "contexto": "India enfrenta una crisis hídrica crítica debido a contaminación y sobreexplotación.",
        "pregunta": "¿Qué harías para salvar la situación?",
        "opciones": [
            {"texto": "Construir grandes plantas desalinizadoras, aunque sea costoso.", "puntos": 1},
            {"texto": "Lanzar campañas masivas de concientización, pero sin controles estrictos.", "puntos": 0},
            {"texto": "Subvencionar el uso de agua para industrias clave.", "puntos": -1},
            {"texto": "Crear un sistema de racionamiento de agua para todos, priorizando consumo humano.", "puntos": 2}
        ]
    },
    {
        "region": "Brasil", "titulo": "Amazonía colapsa en 2035",
        "contexto": "La deforestación y el cambio climático podrían destruir gran parte de la Amazonía para 2035.",
        "pregunta": "¿Cómo responderías?",
        "opciones": [
            {"texto": "Prohibir toda tala, incluso para comunidades locales, protegiendo los bosques al costo de empleos.", "puntos": 2},
            {"texto": "Promover “tala sostenible” con cuotas y monitoreo tecnológico.", "puntos": 1},
            {"texto": "Incentivar proyectos agrícolas en áreas ya deforestadas antes que en áreas nuevas.", "puntos": 0},
            {"texto": "Crear programas turísticos que financien la conservación, aunque generen tráfico humano.", "puntos": -1}
        ]
    },
    {
        "region": "Europa", "titulo": "Ola de calor récord en 2027",
        "contexto": "Europa enfrenta olas de calor extremas, afectando agricultura y salud.",
        "pregunta": "¿Qué medida priorizarías?",
        "opciones": [
            {"texto": "Promover el teletrabajo para reducir transporte, aunque afecte sectores presenciales.", "puntos": 1},
            {"texto": "Incentivar el uso de aire acondicionado con energía renovable.", "puntos": 0},
            {"texto": "Plantar bosques urbanos aunque reduzcan espacio urbano.", "puntos": 2},
            {"texto": "Construir infraestructura climática costosa para proteger ciudades clave.", "puntos": -1}
        ]
    },
    {
        "region": "África", "titulo": "Desertificación masiva en 2040",
        "contexto": "África podría perder tierras fértiles por desertificación acelerada.",
        "pregunta": "¿Cómo actuarías?",
        "opciones": [
            {"texto": "Financiar grandes proyectos agrícolas tecnológicos en zonas afectadas.", "puntos": 1},
            {"texto": "Promover técnicas agrícolas tradicionales combinadas con tecnología.", "puntos": 2},
            {"texto": "Incentivar migración hacia zonas más fértiles.", "puntos": -1},
            {"texto": "Crear grandes reservas naturales, restringiendo uso humano.", "puntos": 0}
        ]
    },
    {
        "region": "Estados Unidos", "titulo": "Derrame de petróleo en 2029",
        "contexto": "Un accidente en refinería provoca gran derrame contaminante.",
        "pregunta": "¿Cuál sería tu acción inmediata?",
        "opciones": [
            {"texto": "Ordenar limpieza inmediata, aunque no tenga plan de largo plazo.", "puntos": 1},
            {"texto": "Priorizar compensaciones económicas para afectados antes de restaurar el ecosistema.", "puntos": -1},
            {"texto": "Prohibir temporalmente todas las actividades petroleras en la zona.", "puntos": 2},
            {"texto": "Dejar que empresas privadas gestionen el desastre con incentivos.", "puntos": -2}
        ]
    },
    {
        "region": "Oceanía", "titulo": "Blanqueamiento masivo de corales en 2032",
        "contexto": "Los corales del Pacífico sufren un blanqueamiento sin precedentes.",
        "pregunta": "¿Qué harías para salvarlos?",
        "opciones": [
            {"texto": "Crear áreas de exclusión total de pesca, afectando comunidades costeras.", "puntos": 2},
            {"texto": "Financiación para investigación de corales resistentes al calor, sin prohibir pesca.", "puntos": 1},
            {"texto": "Incentivar el turismo ecológico controlado en zonas coralinas.", "puntos": 0},
            {"texto": "Permitir pesca regulada mientras se promueve restauración coralina.", "puntos": -1}
        ]
    },
    {
        "region": "Medio Oriente", "titulo": "Escasez de energía limpia en 2035",
        "contexto": "Dependencia extrema de petróleo provoca crisis energética.",
        "pregunta": "¿Cómo actuarías?",
        "opciones": [
            {"texto": "Invertir en energía solar, aunque implique recortar presupuesto en otros sectores.", "puntos": 2},
            {"texto": "Crear incentivos para uso doméstico de energía limpia.", "puntos": 1},
            {"texto": "Mantener producción de petróleo mientras se planifican energías limpias.", "puntos": -1},
            {"texto": "Importar energía limpia de otros países en vez de producirla localmente.", "puntos": 0}
        ]
    },
    {
        "region": "Antártida", "titulo": "Deshielo masivo en 2040",
        "contexto": "El deshielo provoca aumento acelerado del nivel del mar.",
        "pregunta": "¿Qué medida tomarías?",
        "opciones": [
            {"
