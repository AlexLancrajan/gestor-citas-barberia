# GESTOR-DE-CITAS.

## ¿CÓMO FUNCIONA ESTA APLICACIÓN?

Funciona mediante una API REST que se comunica con el servidor en cuestión y una base de datos asociada a través de unas reglas de negocio bien establecidas.

## ¿QUÉ REGLAS DE NEGOCIO EXISTEN EN EL PROYECTO?

A fecha de hoy *15 de Septiembre de 2024* existen las siguientes reglas:

1. Usuario/*User*.
2. Barbero/*Barber*.
3. Local/*Site*.
4. Servicio/*Service*.
5. Fecha/*Date*.
6. Reserva/*Booking*.


## ¿QUÉ TIPO DE ARQUITECTURA UTILIZA Y COMO SE ORGANIZAN LAS REGLAS?

El patrón de arquitectura empleado es hexagonal, ya que permite la escalabilidad del proyecto y la mejor organización del cógido. También cabe destacar que se ha hecho *slicing* para separar mejor las distintas capas de cada concepto.  

En cuanto a la organizacion de las reglas se implementa utilizando el siguiente esquema:

![Esquema que muestra la relacion entre las reglas de negocio de la aplicación](/schema_images/Implementation.png "Reglas de negocio")

## IMPLEMENTACIÓN DEL PROYECTO:

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

1. **[POST] Register**: ***/api/users/register*** 
    - En esta ruta se harán los registros usando el propio sistema.
2. **[POST] Login**: ***/api/users/login*** 
    - En esta ruta se harán los logins asociados al propio sistema.
3. **[GET] Refresh**: ***/api/users/refresh*** 
    - En esta ruta se actualizará el token access en función del token refresh
4. **[POST] Logout**: ***/api/users/logout*** 
    - En esta ruta se hará el logout.
5. **[GET] FindUser**: ***/api/users/:id*** 
    - En esta ruta se buscará a un usuario particular.
6. **[GET] FindUsers**: ***/api/users/*** 
    - En esta ruta se buscarán a todos los usuarios, se pueden usar queries para filtrar (*/?**role=Rol**&**page=int**&**pageSize=int***). 
    - Por defecto devuelve los primeros 50 resultados del rol usuario. Se necesita permisos de admin.
7. **[DELETE] DeleteUser**: ***/api/users/:id*** 
    - En esta ruta se borrará a un usuario.
8. **[PUT] ModifyUser**: ***/api/users/:id*** 
    - En esta ruta se actualizará un usuario.

*Notas*: 
  - Aunque hay disponibles rutas y estrategias de google en el código, no se ha implementado por la similitud de los datos necesarios a nivel de usuario.

#### CONTROLADORES:
1. **RegisterUserFunction** asociado a *(1)* de rutas: 
    - Crea un usuario nuevo en la base de datos usando el sistema propio, la estructura es como el modelo pero sin el ID.
    - Devuelve una instancia de error si el proceso ha ido mal *(400 o 500)*.
2. **LoginUserFunction asociado** a *(2)* de rutas:
    - Comprueba si el usuario mandado y la contraseña son correctos con la base de datos y crea los *ACCESS TOKEN* y *REFRESH TOKEN*.
    - Devuele una instancia de error en caso negativo *(404 0 500)*.
    - El ACCESS TOKEN se encuentra en *res.header('authorization').
    - El REFRESH TOKEN se encuentra en *res.cookie('refresh')*.
    - El formato del *ACCESS TOKEN* es *{username, userId, role}*.
    - El formato del *REFRESH TOKEN* es identico a ACCESS TOKEN.
    - El tiempo de expiración del *ACCESS TOKEN* es de 20s.
    - El tiempo de expiración del *REFRESH TOKEN* es de 5h.
3. **RefreshTokenFunction** asociado a *(3)* de rutas: 
    - Comprueba el token refresh de *req.cookies* para generar un nuevo *ACCESS TOKEN*.
    - Devuelve una instancia de error en caso negativo *401*.
4. **FindUserFunction** asociado a *(4)* de rutas:
    - Devuelve un usuario buscando por *id*.
    - En caso negativo devuele una instancia de error *(404 o 500)*.
5. **FindAllUsersFunction** asociado a *(5)* de rutas:
    - Devuelve todos los usuarios de la base de datos.
    - Contiene opciones de query sobre el rol y la paginación.
    - Solo se puede acceder mediante el *rol* de *admin*.
    - En caso negativo devuelve una instancia de error *(401, 404 o 500)*.
6. **DeleteUserFunction** asociado a *(6)* de rutas:
    - Elimina el usuario con el *id* especificado y devuelve *1 o 0*, dependiendo de si ha borrado el usuario o no.
    - En caso de que no haya eliminado usuario devuelve un error indicando que ya se ha borrado el usuario con código *204*.
    - La otra instancia de error devuelve *500*.
7. **ModifyUserFunction** asociado a *(7)* de rutas:
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

1. **[GET] FIND SITE:** */api/sites/:id*. Esta ruta devuelve un sitio basado en su id.
2. **[GET] FIND SITES:** */api/sites*. Esta ruta devuelve todos los locales. Acepta queriess de paginado (*/?page=int&pageSize=int*). Por defecto devuelve los primeros 50 resultados.
3. **[POST] CREATE SITE:** */api/sites*. En esta ruta se crea un sitio. Necesita rol de admin.
4. **[PUT] CREATE SITE:** */api/sites/:id*. En esta ruta se modifica un sitio por id. Necesita rol de admin.
5. **[DELETE] CREATE SITE:** */api/sites/:id*. En esta ruta se elimina un sitio por id. Necesita rol de admin.

#### CONTROLADORES:

1. **findSiteFunction** asociado a *(1)* de rutas:
    - Devuelve un sitio buscado por id. El formato es el mismo del modelo.
    - En caso negativo devuelve error con código *404* ó *500*.
2. **findSitesFunction** asociado a *(2)* de rutas:
    - Devuelve una lista de sitios dependiendo del los parámetros pasados por la query de la ruta. Por defecto los primeros 50 resultados.
    - En caso negativo devuelve error con código *404* ó *500*.
3. **createSiteFunction** asociado a *(3)* de rutas:
    - Crea un sitio utilizando el esquema del modelo sin la id. Son obligatorios todos los campos.
    - Se necesita permisos de admin. Sino devuelve error con código *401*-
    - En caso negativo devuelve error con código *400* ó *500*.
4. **modifySiteFunction** asociado a *(4)* de rutas:
    - Modifica un sitio utilizando el esquema del modelo sin la id. Los campos pasados son *opcionales* y en caso de no modificar nada se mantiene el sitio original.
    - Se necesita permisos de admin. Sino devuelve error con código *401*-
    - En caso negativo devuelve error con código *400* ó *500*.
5. **deleteSiteFunction** asociado a *(5)* de rutas:
    - Elimina un sitio pasandole por parámetros su id asociada.
    - Se necesita permisos de admin. Sino devuelve error con código *401*-
    - En caso negativo devuelve error con código *404* ó *500*.


## PREGUNTAS SOBRE EL PROYECTO O CONTACTO:

Tengo el email adjunto al perfil de github.
