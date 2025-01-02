# GESTOR-DE-CITAS.

## ¿CÓMO FUNCIONA ESTA APLICACIÓN?

Se trata de una API de tipo REST en la que se ha aplicado el patrón de diseño MVC

## ¿CÓMO ES LA ORGANIZACIÓN DEL PROYECTO?

Para esta aplicación se ha empleado la metodología DDD y a fecha de hoy *3 de Diciembre de 2024* existen las siguientes conceptos:
1. Usuario/*User*.
2. Barbero/*Barber*.
3. Local/*Site*.
4. Servicio/*Service*.
5. Fecha/*Date*.
6. Reserva/*Booking*.

El directorio del proyecto se organiza de la siguiente manera:

```
.
|-- eslint.config.mjs
|-- package-lock.json
|-- package.json
|-- readme.md
|-- schema_images
|-- src
|   |-- app.ts
|   |-- mySQL.ts
|   |-- barber
|   |   |-- application
|   |   |   |-- create-barber.ts
|   |   |   |-- delete-barber.ts
|   |   |   |-- find-barber.ts
|   |   |   `-- modify-barber.ts
|   |   |-- domain
|   |   |   |-- barber-repository.ts
|   |   |   `-- barber.ts
|   |   `-- infrastructure
|   |       |-- barber-controller.ts
|   |       |-- barber-repository-impl.ts
|   |       |-- barber-router.ts
|   |       |-- barber-schema.ts
|   |       `-- dependencies.ts
|   |-- booking
|   |-- date
|   |-- service
|   |-- site
|   |-- user
|   |-- zsign-up-strategies
|   `-- ztools
|       |-- config.ts
|       |-- middleware.ts
|       |-- stripe-service.ts
|       `-- utils.ts
`-- tsconfig.json
```


## ¿QUÉ TIPO DE ARQUITECTURA UTILIZA Y COMO SE RELACIONAN LOS CONCEPTOS?

El patrón de arquitectura empleado es hexagonal, ya que permite la escalabilidad del proyecto y la mejor organización del cógido.  

En cuanto a la organizacion de las reglas se implementa utilizando el siguiente esquema:

![Esquema que muestra la relacion entre las reglas de negocio de la aplicación](/schema_images/Concepts_relations.png "Reglas de negocio")

## IMPLEMENTACIÓN DEL PROYECTO:

### CONFIGURACIÓN Y VARIABLES DE ENTORNO:

Antes que nada hay que instalar las dependecias del proyecto:

```bash
  npm install
```
Para que el proyecto funcione correctamente hay que configurar las siguentes variables de entorno:

```ini
  # .env file
  PORT=3000;

  # For cors configuration in production mode. The format used must be the following:
  ACCESS_URLS=http://www.example.com,http://www.example2.com,http://www.example3.com,...

  # Token configuration:
  ACCESS_SECRET="SOMEACCESSSECRET"
  REFRESH_SECRET="SOMEREFRESHSECRET"

  # Database configuration for mySQL. For other DBMS change dialect, but keep in mind that some data types will be diferent in other DBMS.
  # In dev mode database will perform a hard reset, so be careful which database you are using. If needed you can define more envs for this aspect.
  DATABASE_NAME="barberdb"
  DATABASE_USERNAME="root"
  DATABASE_PASSWORD="password"
  DATABASE_HOST="127.0.0.1"
  DATABASE_DIALECT="mysql"

  # Only if you use google strategy. Otherwise just ignore these lines:
  # GOOGLE_CLIENT_ID=""
  # GOOGLE_CLIENT_SECRET=""
  # GOOGLE_CALLBACK_URL = ""

  # For payment purposes. Method implemented is Stripe, as it is wide used. If the mode is Debug remember to use the test key, otherwise it will not work.
  STRIPE_SECRET_KEY="sk_test_..."
```
*Nota*:
  - Hay un parametro más que se encuentra en *src/ztools/config.ts*, que es *timeLimit* y se trata de una fecha que establece el tiempo limite para modificar o cancelar una cita por parte del usuario. Su formato es el siguiente:

  ```Typescript
    timeLimit: new Date(0,0,0,0,30,0,0), // Defaults to 30 min. Can implement hours.
  ```

Los comandos para ejectuar el proyecto en modo desarrollo y producción son los clásicos:

```bash
  npm run dev
  npm start
```

*Nota*:
  - En modo desarrollo aprate de hacerse un reset a la base de datos, también se desactivan métodos de seguridad y algunos aspectos más.
  - El logger usado ("Morgan") tiene más información en este modo.

### USUARIO:

En este apartado se describirá el modelo, las rutas y controladores asociados a User:

#### MODELO:

  El modelo se describe a continuación en formato *JSON*:

  ```json
    {
      "userId": "UUID4 Key",
      "username": "exampleuser123",
      "passwordHash": "not wise to show this", 
      "email": "email_example@example.com",
      "phone":"111222444",
      "name?":"John",
      "surname?":"Doe",
      "role": "admin",
      "missingTrack": 0
    }
  ```
*Notas:* 
  - El campo *id* no esta disponible hasta que se creé el usuario en la base de datos.
  - El campo *passwordHash* se omite por seguridad.
  - *Nombre* y *Apellido* son opcionales.
  - El prefijo telefónico se omite.
  - Los *roles* son: *"admin" | "barber" | "user"*

#### RUTAS: 

1. **[POST] REGISTER USER**: ***/api/users/register*** 
    - En esta ruta se harán los registros usando el propio sistema.
2. **[POST] LOGIN USER**: ***/api/users/login*** 
    - En esta ruta se harán los logins asociados al propio sistema.
3. **[GET] REFRESH TOKEN**: ***/api/users/refresh*** 
    - En esta ruta se actualizará el token access en función del token refresh
4. **[GET] FIND USER**: ***/api/users/:id*** 
    - En esta ruta se buscará a un usuario particular.
5. **[GET] FIND USERS**: ***/api/users/*** 
    - En esta ruta se buscarán a todos los usuarios, se pueden usar queries para filtrar (*/?**role=Rol**&**page=int**&**pageSize=int***). 
    - Por defecto devuelve los primeros 50 resultados del rol usuario. Se necesita permisos de admin.
6. **[DELETE] DELETE USER**: ***/api/users/:id*** 
    - En esta ruta se borrará a un usuario.
7. **[PUT] MODIFY USER**: ***/api/users/:id*** 
    - En esta ruta se actualizará un usuario.

*Notas*: 
  - Aunque hay disponibles rutas y estrategias de google en el código, no se ha implementado por la similitud de los datos necesarios a nivel de usuario.

#### CONTROLADORES:
1. **RegisterUser** asociado a *(1)* de rutas: 
    - Crea un usuario nuevo en la base de datos usando el sistema propio, la estructura es como el modelo pero sin el ID.
    - Devuelve una instancia de error si el proceso ha ido mal *(400 o 500)*.
2. **LoginUser asociado** a *(2)* de rutas:
    - Comprueba si el usuario mandado y la contraseña son correctos con la base de datos y crea los *ACCESS TOKEN* y *REFRESH TOKEN*.
    - Devuele una instancia de error en caso negativo *(404 0 500)*.
    - El ACCESS TOKEN se encuentra en *res.header('authorization').
    - El REFRESH TOKEN se encuentra en *res.cookie('refresh')*.
    - El formato del *ACCESS TOKEN* es *{username, userId, role}*.
    - El formato del *REFRESH TOKEN* es identico a ACCESS TOKEN.
    - El tiempo de expiración del *ACCESS TOKEN* es de 20s.
    - El tiempo de expiración del *REFRESH TOKEN* es de 5h.
3. **RefreshToken** asociado a *(3)* de rutas: 
    - Comprueba el token refresh de *req.cookies* para generar un nuevo *ACCESS TOKEN*.
    - Devuelve una instancia de error en caso negativo *401*.
4. **FindUser** asociado a *(4)* de rutas:
    - Devuelve un usuario buscando por *id*.
    - En caso negativo devuele una instancia de error *(404 o 500)*.
5. **FindAllUsers** asociado a *(5)* de rutas:
    - Devuelve todos los usuarios de la base de datos.
    - Contiene opciones de query sobre el rol y la paginación.
    - Solo se puede acceder mediante el *rol* de *admin*.
    - En caso negativo devuelve una instancia de error *(401, 404 o 500)*.
6. **DeleteUser** asociado a *(6)* de rutas:
    - Elimina el usuario con el *id* especificado y devuelve *1 o 0*, dependiendo de si ha borrado el usuario o no.
    - En caso de que no haya eliminado usuario devuelve un error indicando que ya se ha borrado el usuario con código *204*.
    - La otra instancia de error devuelve *500*.
7. **ModifyUser** asociado a *(7)* de rutas:
    - Modifica el usuario con los *campos del modelo* proporcionados (salvo *id*) al usuario mediante el *id* especificado.
    - Estos datos pueden ser **opcionales**.
    - En caso de **no modificar** algún dato se mantiene el **original**.
    - Devuelve instancia de error en caso negativo *(400 o 500)*. 

### LOCAL:

En este apartado se describira la implementación del concepto de local asociado a la API.

#### MODELO:

  ```json
  {
    "siteId": 134,
    "siteName": "BarberLocal nº1",
    "siteDirection": "C/Madrid, nº14", 
    "siteSchedule": "Lunes a Sabado: 10:00h a 16:00h",
    "sitePhone":"(123)999888666",
    "siteDescription": "En este local hacemos lo siguente..."
  }
  ```

#### RUTAS:

1. **[GET] FIND SITE:** ***/api/sites/:id***
  - Esta ruta devuelve un sitio basado en su id.
2. **[GET] FIND SITES:** ***/api/sites***
  - Esta ruta devuelve todos los locales. Acepta queries de paginado (*/?**page=int**&**pageSize=int***). Por defecto devuelve los primeros 50 resultados.
3. **[POST] CREATE SITE:** ***/api/sites*** 
  - En esta ruta se crea un sitio. Necesita rol de admin.
4. **[PUT] MODIFY SITE:** ***/api/sites/:id*** 
  - En esta ruta se modifica un sitio por id. Necesita rol de admin.
5. **[DELETE] DELETE SITE:** ***/api/sites/:id***
  - En esta ruta se elimina un sitio por id. Necesita rol de admin.

#### CONTROLADORES:

1. **findSite** asociado a *(1)* de rutas:
    - Devuelve un sitio buscado por id. El formato es el mismo del modelo.
    - En caso negativo devuelve error con código *404* ó *500*.
2. **findSites** asociado a *(2)* de rutas:
    - Devuelve una lista de sitios dependiendo del los parámetros pasados por la query de la ruta. Por defecto los primeros 50 resultados.
    - En caso negativo devuelve error con código *404* ó *500*.
3. **createSite** asociado a *(3)* de rutas:
    - Crea un sitio utilizando el esquema del modelo sin la id. Son obligatorios todos los campos.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
4. **modifySite** asociado a *(4)* de rutas:
    - Modifica un sitio utilizando el esquema del modelo sin la id. Los campos pasados son *opcionales* y en caso de no modificar nada se mantiene el sitio original.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
5. **deleteSite** asociado a *(5)* de rutas:
    - Elimina un sitio pasandole por parámetros su id asociada.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.

### BARBERO:

En este apartado se describe la implementación del concepto de barbero.

#### MODELO:

  ```json
    {
      "barberId": "UUID4",
      "barberName": "Ramiro",
      "barberSurname": "Fuentes",
      "barberPicture": "<enlace a la imagen>",
      "barberDescription": "Hago cortes del estilo...",
      "siteId": 43
    }    
  ```

#### RUTAS:
1. **[GET] FIND BARBER:** ***/api/barber/:id*** 
  - Esta ruta devuelve un barbero basado en su id y una query del estilo */?getSite=bool*, que se encarga de mostrar el sitio si es true.
2. **[GET] FIND BARBERS:** ***/api/barber*** 
  - Esta ruta devuelve todos los locales. Acepta queries de paginado (*/?**page=int**&**pageSize=int***) y dos queries más */?**getSites=bool**&**siteId=int*** que se encargan de mostrar los sitios y filtrar por sitio respectivamente. Por defecto devuelve los primeros 50 resultados sin incluir los sitios y sin filtrar.
3. **[POST] CREATE BARBERS:** ***/api/barber*** 
  - En esta ruta se crea un barbero. Necesita rol de admin.
4. **[PUT] MODIFY BARBER:** ***/api/barber/:id*** 
  - En esta ruta se modifica un barbero por id. Necesita rol de admin o barbero. En el caso del barbero no se puede modificar el sitio.
5. **[DELETE] DELETE BARBER:** ***/api/barber/:id*** 
  - En esta ruta se elimina un barbero por id. Necesita rol de admin.

#### CONTROLADORES:
1. **findBarber** asociado a *(1)* de rutas:
    - Devuelve un barbero buscado por id. El formato es el mismo del modelo y según la query devuelve los campos del sitio o la id de la referencia.
    - En caso negativo devuelve error con código *404* ó *500*.
2. **findBarbers** asociado a *(2)* de rutas:
    - Devuelve una lista de barberos dependiendo del los parámetros pasados por la query de la ruta. Por defecto los primeros 50 resultados sin filtrar y sin incluir los sitios.
    - En caso negativo devuelve error con código *404* ó *500*.
3. **createBarber** asociado a *(3)* de rutas:
    - Crea un barbero utilizando el esquema del modelo sin la id. Son obligatorios todos los campos.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
4. **modifyBarber** asociado a *(4)* de rutas:
    - Modifica un barbero utilizando el esquema del modelo sin la id. Los campos pasados son *opcionales* y en caso de no modificar nada se mantiene el sitio original. El barbero puede modificar sus datos, pero no el sitio.
    - Se necesita permisos de admin o barbero. Sino devuelve error con código *401*-
    - En caso negativo devuelve error con código *400* ó *500*.
5. **deleteBarber** asociado a *(5)* de rutas:
    - Elimina un barbero pasandole por parámetros su id asociada.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.

### SERVICIO:

En este apartado se describira la implementación del concepto de servicio asociado a la API.

#### MODELO:

  ```json
  {
    "serviceId": 134,
    "serviceType": "Trenzas",
    "servicePrice": 32.45, 
    "serviceDuration": "2024-12-21T00:30:00Z",
    "serviceDescription":"En este servicio hacemos trenzas de esta manera ...",
    "siteId": 1
  }
  ```

#### RUTAS:

1. **[GET] FIND SERVICE:** ***/api/services/:id*** 
  - Esta ruta devuelve un servicio basado en su id.
2. **[GET] FIND SERVICES:** ***/api/services*** 
  - Esta ruta devuelve todos los sitios. Acepta queries de paginado (*/?**page=int**&**pageSize=int***) y filto por la id del sitio (*/?**siteId=int***). Por defecto devuelve los primeros 50 resultados.
3. **[POST] CREATE SERVICE:** ***/api/services*** 
  - En esta ruta se crea un servicio. Necesita rol de admin.
4. **[PUT] MODIFY SERVICE:** ***/api/services/:id*** 
  - En esta ruta se modifica un servicio por id. Necesita rol de admin.
5. **[DELETE] DELETE SERVICE:** ***/api/services/:id*** 
  - En esta ruta se elimina un servicio por id. Necesita rol de admin.

#### CONTROLADORES:

1. **findService** asociado a *(1)* de rutas:
    - Devuelve un servicio buscado por id. El formato es el mismo del modelo.
    - En caso negativo devuelve error con código *404* ó *500*.
2. **findServices** asociado a *(2)* de rutas:
    - Devuelve una lista de servicios dependiendo del los parámetros pasados por la query de la ruta. Por defecto los primeros 50 resultados.
    - En caso negativo devuelve error con código *404* ó *500*.
3. **createService** asociado a *(3)* de rutas:
    - Crea un servicio utilizando el esquema del modelo sin la id. Son obligatorios todos los campos.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
4. **modifyService** asociado a *(4)* de rutas:
    - Modifica un servicio utilizando el esquema del modelo sin la id. Los campos pasados son *opcionales* y en caso de no modificar nada se mantiene el servicio original.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
5. **deleteService** asociado a *(5)* de rutas:
    - Elimina un servicio pasandole por parámetros su id asociada.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.

### FECHAS:

En este apartado se describira la implementación del concepto de fecha asociado a la API.

#### MODELO:
En este concepto tenemos varios modelos, el fundamental es el siguiente:
  ```json
  {
    "dateId": 134,
    "dateDate": "2024-12-3T16:00",
    "dateAvailability": 0, //Availiabilty is an enum that goes from 0 to 4. 0 is empty and 4 is full. The rest are used for info purposes.
    "dateSiteIdRef": 1,
  }
  ```
El siguente es el modelo del horario o *schedule*:
  ```typescript
  const schedule: ScheduleFields[] = 
  [
    { 
      initDate: new Date(0, 0, 1, 9, 0), 
      endDate: new Date(0, 0, 1, 17, 0) 
    }, // Monday 9 AM to 5 PM
    { 
      initDate: new Date(0, 0, 2, 10, 0), 
      endDate: new Date(0, 0, 2, 15, 0) 
    } // Tuesday 10 AM to 3 PM
    //...
  ];
  ```
El grado de disponibilidad también es necesario para obtener la ocupación. El modelo es el siguiente:
  ```typescript
  enum Availability {
    available,
    lowOccupied,
    mediumOccupied,
    highlyOccupied,
    full
  }
  ```
*Notas*
  - Exsiten unos modelos más disponibles en date/infrastructure/date-schema.ts que
  son puramente de validación y conviene consultar para hacer las peticiones.
  - Para el horario se realiza una limpieza en caso de pasar años y meses aleatorios.

#### RUTAS:

1. **[GET] FIND DATE BY ID:** ***/api/dates/:id*** 
  - Esta ruta devuelve una fecha usando su id.
2. **[GET] FIND DATE BY DATE:** ***/api/dates/date*** 
  - Esta ruta devuelve una fecha buscada por la fecha en si y la referencia al local. Estos parámetros se deben incluir en el cuerpo de la petición.
3. **[GET] FIND OCCUPATION BY RANGE:** ***/api/dates/occupation*** 
  - Esta ruta devuelve la ocupación de un rango de fechas especificado por la petición. Los datos se deben incluir en el cuerpo de la misma.
4. **[GET] FIND DATES:** ***/api/dates/*** 
  - Esta ruta devuelve todas las fechas. Admite queries de paginado *(?**page=int**&**pageSize=int**)*, filtrar sitios *(?**siteIdRef=num**)* y rellenar las referencias *(?**getSites=bool**)*. Por defecto devuelve los primeros 50 resultados sin filtrar y sin rellenar. 
5. **[POST] CREATE DAILY DATES:** ***/api/dates/daily*** 
  - En esta ruta se crean fechas para un día en concreto, se ha planteado para utilizar un trigger externo, pero se puede acceder manualmente a ella. Los parámetros se incluyen en el cuerpo. Necesita rol de admin.
6. **[POST] CREATE AUTOMATIC DATES:** ***/api/dates/automatic*** 
  - En esta ruta se crean las fechas de un local de manera automática especificando unos parámetros y el modelo del horario. Necesita rol de admin.
7. **[POST] CREATE MANUAL DATES:** ***/api/dates/manual*** 
  - En esta ruta se crean los horarios del local de forma manual. El modelo es el del concepto de fecha sin el campo id. Necesita rol de admin.
8. **[PUT] MODIFY DATE:** ***/api/services/:id*** 
  - En esta ruta se modifica una fecha por id. Se pueden modificar todos los campos menos el id, o si no se incluye nada deja la fecha original. Necesita rol de admin.
9. **[DELETE] DELETE DATE AUTOMATIC:** ***/api/services/automatic*** 
  - En esta ruta se eliminan los días pasados dado un trigger externo de alguna API capacitada para hacerlo. Necesita rol de admin.
10. **[DELETE] DELETE DATE BY ID:** ***/api/services/:id*** 
  - En esta ruta se elimina una fecha por id. Necesita rol de admin.
11. **[DELETE] DELETE DATE BY SITE:** ***/api/services/site*** 
  - En esta ruta se eliminan fechas de un local. Necesita rol de admin.

#### CONTROLADORES:

1. **getDateById** asociado a *(1)* de rutas:
    - Devuelve una fecha buscada por id. El formato es el mismo del modelo.
    - Admite query de rellenar la rellenar la referencia del sitio.
    - En caso negativo devuelve error con código *404* ó *500*.
2. **getDateByDate** asociado a *(2)* de rutas:
    - Devuelve una fecha buscada por fecha y un local. Los parámetros se pasan por el body y son **{ dateDate, siteIdRef }**.
    - En caso negativo devuelve error con código *404* ó *500*.
3. **getDates** asociado a *(3)* de rutas:
    - Devuelve un conjunto de fechas con posibilidad de especificar queries. Explicado en rutas.
    - En caso negativo devuelve error con código *404* ó *500*.
4. **getOccupation** asociado a *(4)* de rutas:
    - Devuelve la ocupación de un rango de fechas utilizando el modelo de disponibilidad *Availability*. El formato del body debe contener los siguientes elementos: **{ siteIdRef, initDate, endDate }**. La referencia al sitio, la fecha de comienzo y la de final. 
    - En caso negativo devuelve error con código *400* ó *500*.
5. **createDailyDate** asociado a *(5)* de rutas:
    - Crea un conjunto de fechas dada la referencia al local, un horario y unos minutos **{ siteIdRef, schedule, minutes }**. Este controlador esta planteado para emplearse mediante un trigger externo para añadir días en función de los que se eliminan automáticamente *(Sección 9)*
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
6. **createAutomaticDate** asociado a *(6)* de rutas:
    - Crea un conjunto de fechas de manera automática especificando los siguientes parámetros: **{ initDate, months, schedule, minutes, siteIdRef}**. Como novedad aquí se introducen la cantidad de meses y los minutos entre citas.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
7. **createManualDate** asociado a *(7)* de rutas:
    - Crea un conjunto de fechas de manera manual pasandole un array con los campos del modelo de fecha sin incluir el id de la fecha.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
8. **modifyDate** asociado a *(8)* de rutas:
    - Modifica una fecha utilizando el esquema del modelo sin la id. Los campos pasados son *opcionales* y en caso de no modificar nada se mantiene la fecha original.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *400* ó *500*.
9. **deleteAutomaticDate** asociado a *(9)* de rutas:
    - Elimina una fecha de manera automática utilizando un trigger externo. En este caso saca la fecha del trigger y elimina los días anteriores a éste.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.
10. **deleteDateById** asociado a *(10)* de rutas:
    - Elimina una fecha por id.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.
11. **deleteDatesBySite** asociado a *(11)* de rutas:
    - Elimina las fechas del local empleando la referencia del mismo. Se debe incluir en el cuerpo de la petición.
    - Se necesita permisos de admin. Sino devuelve error con código *401*.
    - En caso negativo devuelve error con código *404* ó *500*.


## PREGUNTAS SOBRE EL PROYECTO O CONTACTO:

Tengo el email adjunto al perfil de github.
