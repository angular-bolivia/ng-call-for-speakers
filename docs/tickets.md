# Backlog de Tickets: Convocatoria de Speakers - Angular Bolivia

Este documento contiene la lista detallada de tareas (tickets) necesarias para llevar a cabo la implementación de la plataforma. Cada ticket incluye una descripción del trabajo y sus criterios de aceptación.

---

## Índice de Tickets

### Épica 1: Configuración de Entornos e Infraestructura
* **[TSK-01]** Inicialización del proyecto Angular 18+ y Estilos Base
* **[TSK-02]** Inicialización e integración de Firebase (Auth, Firestore, Storage)

### Épica 2: Portal Público (Landing Page y Formulario)
* **[TSK-03]** Maquetación y Diseño de la Landing Page (Información y Beneficios)
* **[TSK-04]** Formulario Paso 1: Información Personal y Carga de Foto
* **[TSK-05]** Formulario Paso 2: Detalles de la Charla y Opciones Interactivas
* **[TSK-06]** Formulario Paso 3: Enlaces Sociales, Términos y Envío Final

### Épica 3: Seguridad y Administración
* **[TSK-07]** Implementación y Despliegue de Reglas de Seguridad (Rules)
* **[TSK-08]** Autenticación y Login del Panel de Administración
* **[TSK-09]** Panel de Administración: Dashboard de Candidatos y Control de Estados

### Épica 4: Despliegue y Pruebas
* **[TSK-10]** Pruebas de Integración y Despliegue en Firebase Hosting

---

## Detalle de Tickets

### Épica 1: Configuración de Entornos e Infraestructura

#### **[TSK-01] Inicialización del proyecto Angular 18+ y Estilos Base**
- **Descripción**: Crear la estructura inicial del proyecto Angular utilizando prácticas modernas (Standalone components y enrutamiento modularizado). Configurar el sistema de diseño visual (CSS vanilla, variables CSS para colores HSL, tipografía premium e interactividad).
- **Criterios de Aceptación**:
  - [ ] El proyecto compila correctamente utilizando Angular 18+.
  - [ ] No se utilizan módulos (`NgModule`); todos los componentes nuevos son Standalone.
  - [ ] Archivo `styles.css` contiene la definición de la paleta de colores HSL corporativa (rojo/ginda, azul oscuro, gris, etc.) y soporta variables reutilizables.
  - [ ] La estructura de rutas está definida para: `/` (Landing/Form), `/admin/login` (Login admin), y `/admin/dashboard` (Dashboard admin) con lazy loading.

#### **[TSK-02] Inicialización e integración de Firebase (Auth, Firestore, Storage)**
- **Descripción**: Configurar la conexión con Firebase en la aplicación Angular utilizando `@angular/fire` o el SDK modular. Establecer servicios dedicados para interactuar con Firestore, Storage y Auth de forma centralizada usando Signals de Angular para exponer los estados.
- **Criterios de Aceptación**:
  - [ ] Firebase SDK configurado correctamente en el entorno de desarrollo.
  - [ ] Servicio `FirebaseService` o equivalente creado para encapsular inicializaciones.
  - [ ] Servicio expone señales de Angular (`Signals`) para el estado de autenticación (ej: `currentUser()`).
  - [ ] Configurado archivo local de entorno (`environment.ts`) con las credenciales públicas de Firebase.

---

### Épica 2: Portal Público (Landing Page y Formulario)

#### **[TSK-03] Maquetación y Diseño de la Landing Page (Información y Beneficios)**
- **Descripción**: Diseñar e implementar la página de inicio atractiva, responsiva y con una estética moderna. Debe incluir la información institucional de Angular Bolivia, temas sugeridos en formato de chips interactivos, beneficios del speaker, requisitos del evento y una llamada a la acción (CTA) clara para ir al formulario de aplicación.
- **Criterios de Aceptación**:
  - [ ] La página renderiza el texto institucional de Angular Bolivia sin errores ortográficos.
  - [ ] Se muestran los "Temas Relacionados" (Angular, Web, IA, UX/UI, etc.) como componentes de etiqueta (tags/chips) legibles.
  - [ ] Se especifican detalladamente los términos de disponibilidad y el canal de YouTube descritos en los requisitos del usuario.
  - [ ] Botón de "CTA" visible que abre/desplaza el scroll hacia el formulario de postulación con una transición suave.
  - [ ] Diseño 100% responsivo comprobado en móvil y escritorio.

#### **[TSK-04] Formulario Paso 1: Información Personal y Carga de Foto**
- **Descripción**: Crear la primera sección del formulario multi-paso utilizando Reactive Forms. Incluye: Nombre completo, País de origen, País de residencia, Correo electrónico, Celular, Acerca de ti (Bio), y Carga de foto de perfil. La foto debe subirse temporalmente o de manera asíncrona a Firebase Storage mostrando el avance.
- **Criterios de Aceptación**:
  - [ ] El paso contiene controles validados para: `nombre`, `email`, `celular`, `paisOrigen`, `paisResidencia`, `bio` y `foto`.
  - [ ] El validador de foto solo acepta formatos `.png`, `.jpg`, `.jpeg` y restringe el peso a menos de 2MB.
  - [ ] Se implementa un selector visual tipo drag-and-drop o botón personalizado para cargar la imagen con previsualización circular inmediata.
  - [ ] Los mensajes de error solo aparecen tras interactuar con los campos (usando `:user-invalid` en CSS o validación de control en `blur`).
  - [ ] Al presionar "Siguiente", no se permite avanzar si hay errores en este paso.

#### **[TSK-05] Formulario Paso 2: Detalles de la Charla y Opciones Interactivas**
- **Descripción**: Implementar la segunda sección del formulario dedicada a los datos de la propuesta de la charla/taller. Campos: Título de la charla, Descripción de la charla, Duración (15, 30, 60 mins), Formato (Taller o Charla), y Nivel de la charla (beginner, intermediate, advanced).
- **Criterios de Aceptación**:
  - [ ] Selector interactivo para la duración: 15, 30 o 60 minutos (ej. botones tipo tarjeta seleccionables con hover animado).
  - [ ] Opciones claras para Taller o Charla (ej. switch deslizante).
  - [ ] Título de charla validado con un mínimo de 10 caracteres y descripción con un mínimo de 50 caracteres (mostrar contador dinámico de caracteres).
  - [ ] Los campos muestran retroalimentación visual interactiva en caso de error tras perder el foco (`blur`).
  - [ ] Botón de "Atrás" que permite regresar al Paso 1 conservando los datos previamente ingresados.

#### **[TSK-06] Formulario Paso 3: Enlaces Sociales, Términos y Envío Final**
- **Descripción**: Implementar el paso final del formulario wizard. Campos: Redes Sociales (Twitter/X, LinkedIn, GitHub), Web, Repositorio, y aceptación obligatoria de los Términos y Condiciones. Al enviar, los datos consolidados y la foto se guardan en Cloud Firestore y Cloud Storage respectivamente, y se redirige a una pantalla de éxito.
- **Criterios de Aceptación**:
  - [ ] Campos opcionales para redes sociales, web y repositorio con validador de formato URL.
  - [ ] El checkbox de Términos y Condiciones debe contener los párrafos exactos solicitados:
    - *Lista de espera*: "Si tu charla no fue seleccionada..."
    - *Grabación en YouTube*: "De transmitir el meetup..."
    - *Cumplimiento de tiempo*: "Para cumplir con el cronograma..."
  - [ ] El botón "Enviar Aplicación" está deshabilitado hasta que todos los pasos estén válidos y se acepten los términos.
  - [ ] El envío genera un documento en Firestore (`applicants/`) con estado inicial `'pending'` y guarda la URL pública del archivo en Storage.
  - [ ] Se muestra una pantalla con animación de éxito al finalizar la transacción.

---

### Épica 3: Seguridad y Administración

#### **[TSK-07] Configuración de Reglas de Seguridad (Rules)**
- **Descripción**: Escribir, probar y desplegar los archivos `firestore.rules` y `storage.rules` para proteger la información personal y las propuestas. Solo los administradores autenticados podrán leer las aplicaciones, mientras que el público solo podrá crear propuestas y subir imágenes bajo las restricciones de tamaño y formato establecidas.
- **Criterios de Aceptación**:
  - [ ] `firestore.rules` restringe lectura/escritura general. Solo permite `create` público a `/applicants/{id}` si los datos cumplen el esquema detallado en el plan.
  - [ ] `firestore.rules` permite `read`, `update` y `delete` únicamente a usuarios autenticados administradores.
  - [ ] `storage.rules` restringe acceso a `/speaker-photos/`. Permite `write` público solo si el tamaño es `< 2MB` y el tipo mime es `image/*`.
  - [ ] Las reglas se validan sintácticamente y se prueban en un entorno local (Firebase Emulator Suite) o consola seca sin errores.

#### **[TSK-08] Autenticación y Login del Panel de Administración**
- **Descripción**: Crear una interfaz de login simple y segura para administradores en `/admin/login`. Integrar con Firebase Authentication (Email/Password) y crear un Guard de rutas (`AuthGuard`) para proteger las vistas de administración.
- **Criterios de Aceptación**:
  - [ ] Página `/admin/login` cuenta con formulario reactivo de email y password.
  - [ ] Al loguearse exitosamente, el usuario es redirigido a `/admin/dashboard`.
  - [ ] Rutas protegidas (`/admin/dashboard` y sub-rutas) redirigen automáticamente a `/admin/login` si el usuario no está autenticado.
  - [ ] Se muestra un indicador de carga mientras se verifica el estado de autenticación inicial.
  - [ ] Botón de "Logout" en el panel que destruye la sesión y limpia el estado.

#### **[TSK-09] Panel de Administración: Dashboard de Candidatos y Control de Estados**
- **Descripción**: Crear la interfaz interactiva para revisar los candidatos postulados. Debe mostrar una lista filtrable y con buscador. Al seleccionar un candidato, el administrador podrá ver su foto, biografía y detalles completos, así como cambiar su estado (`pending`, `accepted`, `waitlist`, `rejected`) o agregar notas internas.
- **Criterios de Aceptación**:
  - [ ] El dashboard carga la lista de aplicantes en tiempo real desde Firestore.
  - [ ] Filtros funcionales por estado de la solicitud (`pending`, `accepted`, `waitlist`, `rejected`).
  - [ ] Campo de búsqueda por nombre de candidato o título de la charla.
  - [ ] Al seleccionar un candidato, se despliega una vista detallada (modal o panel lateral).
  - [ ] El administrador puede modificar el estado de la postulación y guardar notas internas en la base de datos (con validación de seguridad de Firebase).

---

### Épica 4: Despliegue y Pruebas

#### **[TSK-10] Pruebas de Integración y Despliegue en Firebase Hosting**
- **Descripción**: Realizar la compilación de producción del sitio de Angular, configurar Firebase Hosting y desplegar el frontend junto con las reglas de base de datos y storage actualizadas.
- **Criterios de Aceptación**:
  - [ ] La compilación para producción (`npm run build`) se ejecuta sin errores de TypeScript o de minificación.
  - [ ] Configurado archivo `firebase.json` con la ruta de la carpeta de distribución (`dist/`).
  - [ ] Despliegue exitoso en Firebase Hosting mediante el comando `firebase deploy`.
  - [ ] La aplicación web es accesible públicamente desde la URL del hosting de Firebase, y todas las rutas (incluyendo recarga directa en el navegador de rutas internas) funcionan sin error 404 (configurada regla de redirección rewrite en `firebase.json`).
