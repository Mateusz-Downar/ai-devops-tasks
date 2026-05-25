/**
 * Pobiera dane użytkownika z zewnętrznego API i zwraca uproszczony obiekt.
 *
 * W przypadku błędu HTTP lub sieci loguje komunikat w konsoli i zwraca `null`
 * zamiast rzucać wyjątek do wywołującego kodu.
 *
 * @param {string|number} userId - Identyfikator użytkownika w systemie.
 * @returns {Promise<UserData|null>} Obiekt z danymi użytkownika lub `null` przy błędzie.
 *
 * @typedef {Object} UserData
 * @property {string} name - Imię i nazwisko użytkownika z API.
 * @property {string} email - Adres e-mail użytkownika.
 * @property {Date} lastLogin - Data ostatniego logowania (z pola `lastLoginTimestamp`).
 *
 * @example
 * const user = await fetchUserData(42);
 * if (user) {
 *   console.log(user.name, user.lastLogin.toISOString());
 * }
 */
function fetchUserData(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return {
        name: data.name,
        email: data.email,
        lastLogin: new Date(data.lastLoginTimestamp),
      };
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      return null;
    });
}
