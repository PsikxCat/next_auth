/**
 * Array de rutas publicas.
 * Estas rutas no requieren autenticacion.
 */
export const publicRoutes: string[] = [
  '/'
]

/**
  * Array de rutas usadas para autenticacion.
  * Estas rutas redirigen a los usuarios autenticados a /settings.
*/
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error'
]

/**
 * Prefijo de las rutas de la API de autenticacion.
 * Las rutas que comienzan con este prefijo son rutas de autenticacion.
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * Ruta por defecto a la que se redirige al usuario al hacer el login.
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/settings'
