# Mi cartera — panel personal de inversiones

## Qué construí
Una página web personal (no un servicio de terceros) que muestra mis inversiones reales —CEDEARs, una acción y un bono que sigo desde mi cuenta de Santander Valores— agrupadas por tipo, con precio actual, variación del día, y un gráfico por activo que compara el precio de hoy contra el promedio de sus últimas 200 ruedas para estimar si viene en tendencia alcista, bajista o lateral. Es para uso personal: la puedo abrir cuando quiera, sin depender de entrar a la web de otra persona.

## Cómo se lo pedí
Prompts principales, en el orden en que los fui dando (resumidos donde eran muy largos, pero textuales en lo importante):

1. *"Tengo unas inversiones en Banco Santander, algunos bonos, CDR y acciones, algunas obligaciones negociables [...] me gustaría que dos veces al día controles cómo viene el mercado [...] quiero que lo hagas de manera automática [...] que no tenga que usar una página de otra persona, que yo lo pueda utilizar cuando quiera."*
2. *"Por ahora quiero hacer la página web personal, pero en un futuro me gustaría [...] decirte, por mensaje de voz, cuando compro alguna acción, a qué precio y qué cantidad [...] para que vos me puedas calcular la ganancia total [...] quiero que lo tenga en cuenta para que en una siguiente iteración futura [...] esto se pueda hacer y el proyecto no quede muy limitado."*
3. *"Recordá que no soy una persona con habilidades técnicas de desarrollo [...] cuando me expliques sé menos técnico y explicame la lógica, quiero entender."*
4. *"Mi cuenta de inversión está en Santander Valores (contexto Argentina). CEDEARs de YPF, PAMPA, GLD, JNJ, KO, LLY, MCD, PG. Acciones: PAMP. Bonos del tesoro nacional, A028 [...] que no se limite a esta lista y que en un futuro me permita agregar más y modificar."*
5. *"Me gustaría que sea un poco más interactivo, ponele otros colores, necesito verlo con gráficos y que siempre me vayas midiendo lo actual versus las últimas doscientas ruedas y sacarme un estimado [...] cuál es la tendencia de cada uno."*
6. *"Cada vez que hagas una iteración, hacé un commit [...] con comentarios en español y lógicos [...] y andá pusheando cuando vos quieras [...] cuando el proyecto esté terminado, yo hago un último commit final."*
7. *"Me gusta cómo quedó, le cambiaría el formato de las letras y los números, y le pondré [...] colores más fuertes, no tan suaves. [...] decime por qué no te pudiste conectar a Rava [...] y qué otra cosa me proponés."*
8. *"[Error de Windows Script Host al hacer doble clic] fijate qué pasó y arreglalo. Mejorá la estructura del repo porque recordá que la carpeta es para todo el curso [...] la primera parte de la página es muy simple [...] hacelo más 'mercado de valores'."*

## Qué funciona
- Trae precios reales (fuente: Yahoo Finance) para 9 de los 10 activos que sigo, con la variación del día.
- Calcula el promedio real de las últimas 200 ruedas de cada activo y muestra una estimación de tendencia (alcista / bajista / lateral), con su gráfico correspondiente al abrir cada fila.
- Cinta de cotizaciones estilo "mercado de valores" arriba de todo, con mini-gráfico por activo.
- Se actualiza corriendo `scripts/actualizar.bat` (doble clic, sin usar la consola).
- Queda publicada en un link fijo que abro desde cualquier dispositivo cuando quiero.
- Los datos personales (montos, cantidades compradas) nunca se suben al repositorio público — el `.gitignore` los excluye automáticamente; el repo solo tiene la lista de qué instrumentos sigo.
- Historial de commits en español, uno por cada iteración pedida, para poder seguir el proceso.

## Qué falta o qué falló
- El bono **A028** (Bono del Tesoro Nacional) no tiene ticker en Yahoo Finance — queda pendiente encontrarle una fuente de precio.
- **No logré conectar con Rava Bursátil.** Esa web arma los precios con JavaScript que corre recién en el navegador; cuando mi programa pide la página, todavía no están escritos ahí. Probé también abrirla con un navegador automatizado (que sí podría ver ese contenido), pero la conexión no se completó en el intento que hice. Yahoo Finance, en cambio, tiene un canal público pensado para ser consultado por programas, por eso funciona.
- **Falta la actualización automática dos veces al día** — hoy se corre a mano con el `.bat`.
- **Falta el módulo de carga de compras/ventas por voz** y el cálculo de ganancia real — el diseño de datos ya está pensado para incorporarlo, pero no está implementado.
- Un primer intento de mostrar la página falló porque mandé el diseño separado de sus datos (no se veía nada) — se resolvió uniendo todo en un solo archivo.
- Un intento de correr el script haciendo doble clic falló porque Windows lo abría con una herramienta vieja (Windows Script Host) en vez de Node — se resolvió agregando `scripts/actualizar.bat`.

## Qué aprendí
*(Nota: esta sección la tenés que completar/ajustar vos con tu propia reflexión — la consigna pide que sea honesta y tuya. Dejo un borrador a partir de lo que fuimos charlando, para que lo edites.)*

Entendí que "trabajar con un agente" no es solo pedirle texto: el agente puede buscar datos afuera, correr programas, calcular cosas y hasta subir el trabajo a GitHub por mí, pero cada uno de esos pasos tiene límites (por ejemplo, no puede leer cualquier página web, y no maneja mis contraseñas). También entendí que tuve que tomar decisiones activas sobre privacidad (qué datos no subir al repositorio público) en vez de asumir que "automático" significa "sin pensar". Iterar de a poco —primero la lista de activos, después el diseño, después los gráficos— me permitió corregir el rumbo varias veces en vez de intentar pedir todo junto.
