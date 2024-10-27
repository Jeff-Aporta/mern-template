Hay que usar redis, para el tratamiento de sesiones.

Recomiendo usar WSL (Windows Subsystem for Linux), puedes instalar Redis en tu entorno Linux. Abre tu terminal de WSL y ejecuta:

```bash
sudo apt update
sudo apt install redis-server
```

Luego, inicia el servicio de Redis:

```bash
sudo service redis-server start
```

Verificar la Instalación

Después de instalar Redis, puedes verificar que está funcionando correctamente ejecutando:

```bash
redis-cli ping
```

Si Redis está funcionando, debería responder con:

```
PONG
```

crear un usuario, en poweshell escribes:

```bash
redis-cli
```

y luego

```bash
ACL SETUSER nombre-del-nuevo-usuario on >la-contraseña-del-usuario ~* +@all
```
ejemplo:
```bash
ACL SETUSER jeff on >1234 ~* +@all
```