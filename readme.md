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

En construcción...

## PREGUNTAS SOBRE EL PROYECTO O CONTACTO:

Tengo el email adjunto al perfil de github.
