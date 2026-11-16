---
title: VoiceGraph: cómo construí un asistente de voz con LangGraph para demostrar grafos con estado
description: Construí VoiceGraph, un asistente de voz con RAG orquestado como grafo de estado en LangGraph, para mostrar en mi portafolio branching, retries y checkpointing reales, no solo un chatbot.
date: 2026-09-20
category: Inteligencia artificial
tags: [langgraph, ia, rag, fastapi, arquitectura]
cover: /assets/img/cover-default.jpg
coverAlt: Diagrama de un grafo de nodos conectados representando un flujo conversacional
author: Javier Delgado
translationKey: voicegraph-langgraph-assistant
featured: true
draft: false
keyPoints:
  - LangGraph modela la conversación como un grafo de estado con nodos, edges condicionales, retries y checkpointing, no como una cadena lineal de prompts.
  - El panel de visualización en vivo (qué nodo se ejecuta, qué edge se toma, cómo cambia el estado) es la pieza central: convierte el demo en algo que se explica solo.
  - Elegí App Runner sobre Lambda porque el streaming es por SSE y porque reutilizo un backend multi-app que ya corre ahí, sin infraestructura nueva.
  - Diseñé el backend como servicio standalone desde el día uno, con `APIRouter` y config con prefijo propio, pensando en la migración a un gateway multi-app.
  - Construí un endpoint que corre la misma tarea con un pipeline lineal y con el grafo, lado a lado, para que la diferencia entre ambos enfoques sea visible y no solo una afirmación.
---

**VoiceGraph** es un asistente de voz con RAG que construí como proyecto de portafolio, pero el objetivo real no era "hacer un chatbot": era demostrar dominio de **LangGraph** de forma que un reclutador técnico lo viera funcionando, no que tuviera que creerme la palabra. Este artículo cuenta el diseño del grafo, por qué elegí App Runner en vez de Lambda, cómo construí el backend para que sobreviviera una migración de proyecto standalone a gateway multi-app, y la comparativa lineal vs grafo que terminó siendo la pieza más útil del demo.

Puedes probar el proyecto en vivo en **[javierdelgado.com.ve/voicegraph](https://javierdelgado.com.ve/voicegraph/)**.

## El problema con "otro chatbot con RAG"

Cualquiera puede envolver un LLM con una búsqueda vectorial y llamarlo "asistente inteligente". Eso no demuestra nada sobre orquestación: es un `if/else` con marketing. Lo que quería mostrar era otra cosa: una conversación real tiene ramas (¿el usuario quiere charlar, cambiar de tema, cambiar de nivel, o terminar?), pasos que pueden fallar y necesitan reintentarse, y estado que persiste entre turnos. Eso es exactamente lo que LangGraph modela de forma explícita como grafo, en vez de esconderlo dentro de un script largo.

La decisión de diseño más importante fue esta: **el frontend tiene que visualizar el grafo ejecutándose en vivo** — qué nodo está activo, qué edge se tomó, cómo se ve el estado en cada paso — porque ese panel es lo que convierte "confía en que uso LangGraph" en "mira, esto es un grafo con estado".

## Diseño del grafo

El estado (`GraphState`, un `TypedDict`) lleva lo que cualquier conversación necesita, más los campos que hacen visible la orquestación:

```
conversation_id: str
messages: Annotated[list[BaseMessage], add_messages]
input_audio: bytes | None
input_text: str | None
retrieved_context: list[dict] | None
intent: Literal["chat", "change_topic", "change_level", "end_conversation"] | None
response_text: str | None
response_audio: bytes | None
student_level: Literal["beginner", "intermediate", "advanced"]
error: str | None
retry_count: dict[str, int]
```

El grafo tiene 9 nodos: `transcribe_audio → classify_intent → {retrieve_context → generate_response, handle_change_level, handle_change_topic, end_conversation} → synthesize_speech → END`, con `handle_error` como terminal de fallback. Algunas decisiones que dieron trabajo real:

- **`classify_intent` es el nodo que justifica el grafo.** Es el punto donde un pipeline lineal de `if/else` se vuelve frágil rápido: cada intención nueva es una rama nueva, y con LangGraph eso es un edge condicional más, no un `elif` más en una función que ya tiene quince.
- **Retries como self-loop, no como `try/except` anidado.** Cada nodo con llamada de red incrementa `retry_count[nodo]`; si supera el máximo, enruta a `handle_error`. Esto lo hace visible en el panel: cuando un nodo falla y reintenta, se ve como una arista que vuelve sobre sí misma, no como una excepción silenciosa en un log.
- **Checkpointing con `MemorySaver`**, usando `conversation_id` como `thread_id`. Para un demo de tráfico bajo es suficiente y lo documenté como trade-off explícito: si esto escalara a más de una instancia, `MemorySaver` no persiste entre procesos y habría que mover a un checkpointer con Redis o Postgres. Es, a propósito, un buen punto de conversación en una entrevista.

Un detalle que vale la pena anotar porque no es obvio la primera vez: **todo nodo que retorna éxito tiene que limpiar explícitamente `error` y el sentinel de retry** (`"error": None, "__retry_target__": None"`). Si no lo hace, el edge condicional sigue viendo el error anterior como verdadero y el grafo entra en loop infinito. Es el tipo de bug que solo aparece la segunda vez que un nodo falla y se recupera, no la primera.

## El panel de visualización: la pieza que realmente importa

El transporte es **SSE**, no WebSocket. El backend usa el streaming nativo de LangGraph (`astream(stream_mode="debug")`) y traduce cada paso a eventos: `node_start`, `node_end`, `edge_taken`, `final`. No hace falta instrumentar cada nodo a mano con eventos custom — LangGraph ya expone el estado después de cada paso, solo hay que traducirlo.

En el frontend, `GraphVisualizer` dibuja el grafo con Mermaid (usando `draw_mermaid()`, que LangGraph expone directamente sobre el grafo ya compilado) y resalta el nodo activo mientras llegan los eventos. `StatePanel` muestra el JSON del estado actual y el historial de transiciones. Con esto, un visitante del portafolio ve literalmente los nodos iluminándose en orden, no una respuesta de chat que aparece por arte de magia.

Un matiz gracioso: con los providers en modo mock (útil para desarrollo sin API keys) cada nodo corre en microsegundos, así que todos los eventos SSE de un turno llegan en el mismo tick de red — animar "nodo por nodo" se vuelve un parpadeo imperceptible. La solución fue encolar los eventos en el frontend y drenarlos con un pacing artificial (~350ms por paso), sin tocar el backend ni afectar el modo con providers reales, donde las llamadas de red ya dan tiempo de sobra.

## Comparar lineal vs grafo, en vivo

La pieza que más convence sin necesidad de explicar nada es el endpoint `POST /compare/linear`: corre el mismo turno de conversación (mismo intent → extract → retrieve → generate) pero como una función lineal, sin edges condicionales, sin retries y sin checkpointing — el mismo trabajo, sin la estructura del grafo alrededor. El frontend lo muestra lado a lado con la versión orquestada por LangGraph.

No es una comparación de "cuál es más rápido" (para una sola llamada, la diferencia es marginal). Es una comparación de **qué pasa cuando algo falla o cuando la conversación se ramifica**: en la versión lineal, cada caso nuevo es una condición más apilada en una función; en la versión con grafo, es una arista más en una estructura que ya sabe reintentar y ya sabe en qué nodo estás.

## App Runner, no Lambda

El streaming SSE fue la restricción que decidió esto. Ya tengo un backend multi-app (el de `levelup`) corriendo en **AWS App Runner**, con Dockerfile probado y healthcheck. Ese mismo backend migró antes de WebSocket a SSE precisamente por incompatibilidad de App Runner con conexiones persistentes tipo WebSocket — así que VoiceGraph siguió el mismo patrón desde el inicio en vez de descubrir el problema tarde.

Lambda quedó descartado por tres razones concretas:

1. **Cold starts inaceptables** para un demo interactivo que un reclutador prueba una sola vez y no va a esperar.
2. **Requiere un adaptador ASGI** (Mangum) y empaquetado de dependencias pesadas (LangGraph, LangChain) en capas o contenedor — complejidad extra sin beneficio para este caso de uso.
3. **No hay ningún patrón de Lambda para servir APIs** ya probado en mi infraestructura — la única Lambda que tengo corriendo es auxiliar (notificaciones), no un servicio HTTP con estado conversacional.

Con App Runner, integrar VoiceGraph al backend existente es, al final, un `app.mount("/portfolio-langgraph", ...)`. Cero infraestructura nueva, cero costo adicional de servicio.

## Diseñar para la migración desde el primer commit

Aquí está la decisión de arquitectura que más se nota con el tiempo: aunque VoiceGraph se desarrolla como repo standalone (con su propio `main.py`, `Dockerfile` y `uvicorn`), sabía desde el principio que el destino final era vivir como sub-app dentro del gateway FastAPI multi-app que ya tengo en producción. Así que el backend se construyó con dos reglas simples:

- **Los endpoints se definen como `APIRouter`**, nunca atados directamente a la instancia raíz de `FastAPI()`. El mismo router se puede incluir en la app standalone de desarrollo o en la sub-app montada del gateway sin reescribir una línea.
- **La configuración usa un prefijo de variables de entorno propio** (`VG_*`), para no chocar con las demás apps del gateway (`levelup`, `shopify`, `whatsapp_agent_voice`) cuando conviva con ellas bajo el mismo proceso.

Esto significa que la migración final (renombrar la carpeta destino, copiar el código, cambiar `main.py` para que use `root_path="/portfolio-langgraph"` en vez de ser la app raíz, y montar con `app.mount()`) es mecánica, no un rediseño. El código de negocio — grafo, nodos, providers, RAG — no cambia una línea; solo cambia cómo se expone.

## Providers reales detrás de un feature flag

Para poder desarrollar y testear sin gastar en llamadas a APIs externas, todo el backend corre con `VG_USE_MOCK_PROVIDERS=true` por defecto: LLM, STT, TTS y vector store son deterministas y no tocan la red. Los providers reales (OpenAI para chat/Whisper/TTS, Pinecone para el vector store) están detrás del mismo flag, con una interfaz base compartida (`BaseChatLLM`, etc.) para que cambiar de mock a real — o de un proveedor a otro en el futuro — no toque los nodos del grafo.

La base de conocimiento del RAG (`knowledge_base/*.md`) es contenido editorial propio: quién soy, mis proyectos, y las decisiones de arquitectura de este mismo proyecto. Es deliberado — así el asistente puede responder preguntas sobre VoiceGraph usando VoiceGraph, que es el tipo de detalle que un reclutador técnico sí nota.

## Preguntas frecuentes

### ¿Por qué usar LangGraph en vez de encadenar llamadas a un LLM directamente?

Porque una conversación real tiene ramas, reintentos y estado que persiste entre turnos. Modelar eso como funciones anidadas con `if/else` funciona al principio, pero cada caso nuevo aumenta la complejidad de forma lineal con el número de ramas. LangGraph hace esa estructura explícita: nodos, edges condicionales y checkpointing son parte del modelo, no un efecto secundario del código.

### ¿Por qué elegir App Runner en vez de Lambda para un backend con IA?

Porque el transporte es streaming (SSE) y porque ya existe un backend en App Runner al que integrarse sin costo de infraestructura nuevo. Lambda tiene sentido para trabajo corto y sin estado; para un servicio conversacional con cold starts que importan y dependencias pesadas como LangGraph, un contenedor de larga duración es más simple y más barato de operar.

### ¿Vale la pena construir el panel de visualización del grafo, o es solo estética?

Para un proyecto de portafolio, no es solo estética: es la diferencia entre decir "usé LangGraph" y mostrarlo. El panel convierte una afirmación técnica en algo que se verifica mirando la pantalla — el nodo activo cambia, el edge se resalta, el estado se actualiza. Para un producto real sin ese objetivo de demostración, la prioridad cambiaría (probablemente hacia logs estructurados y trazas en un sistema como LangSmith, que también integré aquí).

## Conclusión

VoiceGraph no es un chatbot con una capa de RAG encima; es un ejercicio deliberado de mostrar cómo se ve una conversación modelada como grafo de estado — con ramas, reintentos, checkpointing y una comparación directa contra el enfoque lineal para que la diferencia no quede en abstracto. Construirlo como servicio standalone pero con la migración a producción pensada desde el día uno (`APIRouter`, config con prefijo propio) hizo que integrarlo al backend existente en App Runner fuera un paso mecánico, no una reescritura.

Si quieres verlo en acción, el demo está en **[javierdelgado.com.ve/voicegraph](https://javierdelgado.com.ve/voicegraph/)**.
