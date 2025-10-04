import numpy as np
import matplotlib.pyplot as plt
import imageio.v2 as imageio  # ✅ corrección del warning
import os
import cartopy.crs as ccrs

# Crear carpeta temporal para cuadros
os.makedirs("frames", exist_ok=True)

# Datos resumidos por eras geológicas
# Reduje el número de marcos por era para evitar lentitud
eras = [
    ("Hadeano", 4500, 2300),
    ("Arqueano", 4000, 70),
    ("Proterozoico", 2500, -10),
    ("Paleozoico", 541, 20),
    ("Mesozoico", 252, 25),
    ("Cenozoico", 66, 15),
    # Simulación moderna (Antropoceno y era del satélite Terra)
    ("Antropoceno", 0, 15 + np.linspace(0, 1.2, 5))  # ✅ reducido a 5 cuadros
]

# Coordenadas globales
lons = np.linspace(-180, 180, 180)
lats = np.linspace(-90, 90, 90)
lon_grid, lat_grid = np.meshgrid(lons, lats)

frames = []

print("🚀 Generando animación... esto puede tardar unos minutos la primera vez.")

for name, age, temp in eras:
    # Si es una serie (moderno), iteramos entre los valores
    if isinstance(temp, np.ndarray):
        for t in temp:
            data = t + np.sin(np.radians(lat_grid)) * 8  # gradiente latitudinal
            fig = plt.figure(figsize=(10, 5))
            ax = plt.axes(projection=ccrs.PlateCarree())
            ax.set_global()
            ax.coastlines()
            im = ax.pcolormesh(lon_grid, lat_grid, data, cmap="coolwarm", shading="auto")
            plt.title(f"Era {name} (años antes del presente: {age})", fontsize=13)
            plt.colorbar(im, orientation="horizontal", pad=0.05, label="Temperatura (°C)")
            filename = f"frames/{name}_{np.random.randint(0,999999)}.png"
            plt.savefig(filename, dpi=120)
            plt.close()
            frames.append(imageio.imread(filename))
    else:
        # Eras largas: solo 1 frame por era
        data = temp + np.sin(np.radians(lat_grid)) * 8
        fig = plt.figure(figsize=(10, 5))
        ax = plt.axes(projection=ccrs.PlateCarree())
        ax.set_global()
        ax.coastlines()
        im = ax.pcolormesh(lon_grid, lat_grid, data, cmap="coolwarm", shading="auto")
        plt.title(f"Era {name} (años antes del presente: {age})", fontsize=13)
        plt.colorbar(im, orientation="horizontal", pad=0.05, label="Temperatura (°C)")
        filename = f"frames/{name}.png"
        plt.savefig(filename, dpi=120)
        plt.close()
        frames.append(imageio.imread(filename))

# Crear y guardar GIF animado
output = "historia_tierra_terra.gif"
imageio.mimsave(output, frames, fps=2)

print(f"✅ Animación creada exitosamente: {output}")
print("🌎 Muestra la evolución climática de la Tierra hasta la era moderna (Terra).")
