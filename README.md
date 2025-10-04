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
            {"texto": "Incentivar el traslado de industrias a zonas rurales para dispersar la contaminación.",
             "puntos": -1},
            {
                "texto": "Aumentar la producción industrial y crear más empleo para poder invertir en tecnología ambiental más adelante.",
                "puntos": -2}
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
            {
                "texto": "Prohibir toda tala, incluso para comunidades locales, protegiendo los bosques al costo de empleos.",
                "puntos": 2},
            {"texto": "Promover “tala sostenible” con cuotas y monitoreo tecnológico.", "puntos": 1},
            {"texto": "Incentivar proyectos agrícolas en áreas ya deforestadas antes que en áreas nuevas.",
             "puntos": 0},
            {"texto": "Crear programas turísticos que financien la conservación, aunque generen tráfico humano.",
             "puntos": -1}
        ]
    },
    {
        "region": "Europa", "titulo": "Ola de calor récord en 2027",
        "contexto": "Europa enfrenta olas de calor extremas, afectando agricultura y salud.",
        "pregunta": "¿Qué medida priorizarías?",
        "opciones": [
            {"texto": "Promover el teletrabajo para reducir transporte, aunque afecte sectores presenciales.",
             "puntos": 1},
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
            {"texto": "Priorizar compensaciones económicas para afectados antes de restaurar el ecosistema.",
             "puntos": -1},
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
            {"texto": "Financiación para investigación de corales resistentes al calor, sin prohibir pesca.",
             "puntos": 1},
            {"texto": "Incentivar el turismo ecológico controlado en zonas coralinas.", "puntos": 0},
            {"texto": "Permitir pesca regulada mientras se promueve restauración coralina.", "puntos": -1}
        ]
    },
    {
        "region": "Medio Oriente", "titulo": "Escasez de energía limpia en 2035",
        "contexto": "Dependencia extrema de petróleo provoca crisis energética.",
        "pregunta": "¿Cómo actuarías?",
        "opciones": [
            {"texto": "Invertir en energía solar, aunque implique recortar presupuesto en otros sectores.",
             "puntos": 2},
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
            {"texto": "Crear un tratado global urgente para reducir emisiones.", "puntos": 2},
            {"texto": "Financiar investigaciones para revertir el deshielo.", "puntos": 1},
            {"texto": "Construir barreras costeras en zonas vulnerables.", "puntos": 0},
            {"texto": "Priorizar desarrollo económico sobre medidas ambientales.", "puntos": -2}
        ]
    },
    {
        "region": "Planeta Tierra", "titulo": "Crisis global en 2050",
        "contexto": "Predicciones indican que habrá una crisis ambiental global si no se actúa antes.",
        "pregunta": "Si fueras líder mundial, ¿qué decisión tomarías?",
        "opciones": [
            {"texto": "Firmar un acuerdo global con metas claras y sanciones.", "puntos": 2},
            {"texto": "Incentivar innovación tecnológica sin compromisos estrictos.", "puntos": 1},
            {"texto": "Fortalecer políticas locales y dejar que cada país actúe según sus prioridades.", "puntos": 0},
            {"texto": "Aumentar producción industrial para financiar futuras soluciones ambientales.", "puntos": -2}
        ]
    }
]

# --- Lógica de la simulación (sin cambios) ---
LIGHTING_DAY = dict(ambient=0.8, diffuse=1, specular=0.5, roughness=0.5, fresnel=0.2)
LIGHTING_NIGHT = dict(ambient=0.1, diffuse=0.2, specular=0.1, roughness=0.5, fresnel=0.2)
light_is_on = True
last_action_time = time.time()
lock = threading.Lock()


def load_texture_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img = img.transpose(Image.FLIP_TOP_BOTTOM)
        img = img.resize((800, 400), Image.LANCZOS)
        colors = np.array(img.getdata(), dtype=np.uint8).reshape((img.height, img.width, 3))
        color_strings = np.apply_along_axis(lambda rgb: f'rgb({rgb[0]},{rgb[1]},{rgb[2]})', 2, colors)
        print("Textura de la Tierra cargada y procesada exitosamente.")
        return color_strings
    except Exception as e:
        print(f"Error al cargar la textura: {e}")
        return None


def day_night_cycle(fig):
    global light_is_on, last_action_time
    while True:
        time.sleep(1)
        with lock:
            time_elapsed = time.time() - last_action_time
            if time_elapsed > 30 and light_is_on:
                print("... Anocheciendo ...")
                fig.update_traces(lighting=LIGHTING_NIGHT)
                light_is_on = False
            elif time_elapsed > 60 and not light_is_on:
                print("... Amaneciendo ...")
                fig.update_traces(lighting=LIGHTING_DAY)
                light_is_on = True
                last_action_time = time.time()


# --- Configuración del estado del juego (AÑOS AJUSTADOS) ---
START_YEAR = 2025
END_YEAR = START_YEAR + len(cuestionario)  # El final ahora depende del número de preguntas
current_year = START_YEAR
total_steps = END_YEAR - START_YEAR
current_score = 100


def show_final_result(fig):
    profile = get_profile(current_score)
    wrapped_desc = '<br>'.join(textwrap.wrap(profile["descripcion"], width=60))
    final_text = f"<b>{profile['titulo']}</b><br>Puntaje Final: {current_score}<br><br>{wrapped_desc}"
    fig.update_layout(
        annotations=[
            fig.layout.annotations[0],
            dict(
                text=final_text, align='center', showarrow=False, xref='paper', yref='paper',
                x=0.5, y=0.5, font=dict(size=16, color='white'),
                bgcolor="rgba(0, 0, 0, 0.8)", bordercolor="white", borderwidth=2, borderpad=10
            )
        ]
    )


def avanzar_un_anio(score_change):
    global current_year, last_action_time, light_is_on, current_score, fig, theta, phi, n_lat, n_lon
    with lock:
        if current_year < END_YEAR:
            current_year += 1
            current_score = max(0, min(100, current_score + score_change))
            damage_factor = 1 + (100 - current_score) / 50.0
            step = current_year - START_YEAR
            lat_center, lon_center = infection_center
            x_sphere, y_sphere, z_sphere = np.cos(theta) * np.sin(phi), np.sin(theta) * np.sin(phi), np.cos(phi)
            x_inf, y_inf, z_inf = np.cos(lon_center) * np.sin(lat_center), np.sin(lon_center) * np.sin(
                lat_center), np.cos(lat_center)
            dist_3d = np.sqrt((x_sphere - x_inf) ** 2 + (y_sphere - y_inf) ** 2 + (z_sphere - z_inf) ** 2)
            wave_front = infection_speed * step * damage_factor * (n_lon / (total_steps * 2))
            infection_intensity = np.exp(-((dist_3d - wave_front) ** 2) * 100)
            infection_intensity = np.clip(infection_intensity, 0, 1)
            fig.update_traces(selector=dict(name="Infección"), surfacecolor=infection_intensity)
            fig.update_layout(annotations=[
                dict(text=f"<b>Año: {current_year}</b><br>Puntaje: {current_score}", align='left', showarrow=False,
                     xref='paper', yref='paper',
                     x=0.95, y=0.95, font=dict(size=16, color='white'), bgcolor="rgba(0,0,0,0.5)", borderpad=4)
            ])
            print(f"Año: {current_year}, Puntaje: {current_score} ({'+' if score_change >= 0 else ''}{score_change})")
            last_action_time = time.time()
            if not light_is_on:
                fig.update_traces(lighting=LIGHTING_DAY)
                light_is_on = True
            if current_year == END_YEAR:
                print("\n--- SIMULACIÓN FINALIZADA ---")
                show_final_result(fig)


# --- Carga de assets y creación de la figura ---
earth_texture_url = "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg"
earth_texture = load_texture_from_url(earth_texture_url)
if earth_texture is not None:
    n_lat, n_lon = earth_texture.shape
else:
    n_lon, n_lat = 800, 400
theta = np.linspace(0, 2 * np.pi, n_lon)
phi = np.linspace(0, np.pi, n_lat)
theta, phi = np.meshgrid(theta, phi)
r = 1
x, y, z = r * np.cos(theta) * np.sin(phi), r * np.sin(theta) * np.sin(phi), r * np.cos(phi)
infection_center = (np.pi / 3, np.pi / 3)
infection_speed = 0.05
initial_infection = np.zeros((n_lat, n_lon))

fig = go.Figure(
    data=[
        go.Surface(x=x, y=y, z=z, surfacecolor=earth_texture, cmin=0, cmax=1, showscale=False, name="Tierra",
                   lighting=LIGHTING_DAY),
        go.Surface(x=x, y=y, z=z, surfacecolor=initial_infection,
                   colorscale=[[0, 'rgba(0,0,0,0)'], [1, 'rgba(255,0,0,0.8)']], cmin=0, cmax=1, showscale=False,
                   name="Infección", lighting=LIGHTING_DAY)
    ],
    layout=go.Layout(
        title=f"🌍 Simulación de Impacto Planetario ({START_YEAR}-{END_YEAR})", margin=dict(l=0, r=0, b=0, t=50),
        scene=dict(xaxis=dict(showbackground=False, visible=False), yaxis=dict(showbackground=False, visible=False),
                   zaxis=dict(showbackground=False, visible=False), aspectmode='data', bgcolor='rgb(10, 10, 20)'),
        annotations=[dict(text=f"<b>Año: {START_YEAR}</b><br>Puntaje: {current_score}", align='left', showarrow=False,
                          xref='paper', yref='paper', x=0.95, y=0.95, font=dict(size=16, color='white'),
                          bgcolor="rgba(0,0,0,0.5)", borderpad=4)]
    )
)


# --- ⚙️ PASO 2: CREAR LA FUNCIÓN PARA EL CUESTIONARIO INTERACTIVO ---
def iniciar_cuestionario():
    """
    Función principal que guía al usuario a través de las preguntas en la consola.
    """
    print("\n--- BIENVENIDO A LA SIMULACIÓN DE IMPACTO PLANETARIO ---")
    print("Tus decisiones determinarán el futuro del planeta. Responde sabiamente.")
    time.sleep(3)

    opciones_map = {'a': 0, 'b': 1, 'c': 2, 'd': 3}

    for i, pregunta_actual in enumerate(cuestionario):
        print("\n" + "=" * 50)
        print(f"PREGUNTA {i + 1}/{len(cuestionario)} - {pregunta_actual['region'].upper()}")
        print("=" * 50)
        print(f"Contexto: {pregunta_actual['contexto']}")
        print(f"\nPregunta: {pregunta_actual['pregunta']}")

        # Imprimir opciones
        for letra, opcion in zip(opciones_map.keys(), pregunta_actual['opciones']):
            print(f"  {letra}) {opcion['texto']}")

        # Validar respuesta del usuario
        while True:
            respuesta = input("\nElige una opción (a, b, c, d): ").lower()
            if respuesta in opciones_map:
                break
            else:
                print("Respuesta no válida. Por favor, elige a, b, c o d.")

        puntos = pregunta_actual['opciones'][opciones_map[respuesta]]['puntos']

        # Llamar a la función principal para actualizar la simulación
        avanzar_un_anio(score_change=puntos)


# --- Iniciar hilo de día/noche ---
cycle_thread = threading.Thread(target=day_night_cycle, args=(fig,), daemon=True)
cycle_thread.start()

# --- Mostrar figura y ejecutar el cuestionario ---
fig.show()

# Iniciar la lógica interactiva del cuestionario
iniciar_cuestionario()

print("\n¡Cuestionario completado! Revisa la ventana de la simulación para ver el resultado final.")
input("Presiona Enter para salir...")
