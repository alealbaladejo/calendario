import os
from app.routes import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Obtiene el puerto de la variable de entorno
    app.run(host="0.0.0.0", port=port)  # Escucha en todas las interfaces de red
