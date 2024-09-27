# GESTOR-DE-CITAS.

## ¿CÓMO FUNCIONA ESTA APLICACIÓN?

Funciona mediante una API REST que se comunica con el servidor en cuestión y una base de datos asociada a través de unas reglas de negocio bien establecidas.

## ¿QUÉ REGLAS DE NEGOCIO EXISTEN EN EL PROYECTO?

A fecha de hoy *15 de Septiembre de 2024* existen las siguientes reglas:

1. Usuario/*User*.
2. Cita/*Appointment*.
3. Servicio/*Service*.
4. Reserva/*Booking*.
5. Local/*Site*.

## ¿QUÉ TIPO DE ARQUITECTURA UTILIZA Y COMO SE ORGANIZAN LAS REGLAS?

El patrón de arquitectura empleado es hexagonal, ya que permite la escalabilidad del proyecto y la mejor organización del cógido. También cabe destacar que se ha hecho *slicing* para definir mejor las reglas establecidas.  

En cuanto a la organizacion de las reglas se implementa utilizando el siguiente esquema:

![Esquema que muestra la relacion entre las reglas de negocio de la aplicación](/schema_images/Implementation.png "Reglas de negocio")

## IMPLEMENTACIÓN DEL PROYECTO:

### User (Falta test para verificar funcionamiento):

En este apartado se describirá el modelo, las rutas y controladores asociados a User:

#### Modelo:

El modelo se describe a continuación en formato *JSON*:

  ```json
  {
    "userId": 123,
    "username": "exampleuser123",
    "passwordHash": "not wise to show this", 
    "email": "email_example@example.com",
    "phone":"111222444",
    "name?":"John",
    "surname?":"Doe",
    "role": "admin"
  }
  ```
  *Notas:* 
    - El campo *id* no esta disponible hasta que se creé el usuario en la base de datos.
    - El campo *passwordHash* se omite por seguridad.
    - *Nombre* y *Apellido* son opcionales.
    - El prefijo telefónico se omite.
    - Los *roles* son: *"admin" | "barber" | "user"*

#### Rutas: 

  1. **(POST) Register**: */api/users/register*. En esta ruta se harán los registros usando el propio sistema.
  2. **(POST) Login**: */api/users/login*. En esta ruta se harán los logins asociados al propio sistema.
  3. **(POST) Refresh**: */api/users/refresh*. En esta ruta se implementa el método TOKEN REFRESH para autorización.
  4. **(GET) FindUser**: */api/users/:id*. En esta ruta se buscará a un usuario particular.
  5. **(GET) FindUsers**: */api/users/*. En esta ruta se buscarán a todos los usuarios.
  6. **(DELETE) DeleteUser**: */api/users/:id*. En esta ruta se borrará a un usuario.
  7. **(PUT) ModifyUser**: */api/users/:id*. En esta ruta se actualizará un usuario.
  8. **(POST) Google Sign-Up** **POR IMPLEMENTAR**.

**Controladores**
  1. **RegisterUserFunction** asociado a *(1)* de rutas:

  - Crea un usuario nuevo en la base de datos usando el sistema propio.
  - Devuelve una instancia de error si el proceso ha ido mal *(400 o 500)*.

  2. **LoginUserFunction asociado** a *(2)* de rutas:

  - Comprueba si el usuario mandado y la contraseña son correctos con la base de datos y crea los *ACCESS TOKEN* y *REFRESH TOKEN*.
  - Devuele una instancia de error en caso negativo *(404 0 500)*.
  - El REFRESH TOKEN se encuentra en *res.cookie('jwt', REFRESH_TOKEN, ...)*
  - El formato del *ACCESS TOKEN* es *{username, userId, role}*
  - El formato del *REFRESH TOKEN* es *{username}*
  - El tiempo de expiración del *ACCESS TOKEN* es de 20s.
  - El tiempo de expiración del *REFRESH TOKEN* es de 1h.

  3. **RefreshTokenFunction** asociado a *(3)* de rutas: 

  - Comprueba el token refresh de *req.cookies* para generar un nuevo *ACCESS TOKEN*.
  - Devuelve una instancia de error en caso negativo *401*.

  4. **FindUserFunction** asociado a *(4)* de rutas:

  - Devuelve un usuario buscando por *id*.
  - En caso negativo devuele una instancia de error *(404 o 500)*.

  5. **FindAllUsersFunction** asociado a *(5)* de rutas:

  - Devuelve todos los usuarios de la base de datos.
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

  8. **GoogleSignUpFunction** **POR IMPLEMENTAR**



## PREGUNTAS SOBRE EL PROYECTO O CONTACTO:

Tengo el email adjunto al perfil de github.
