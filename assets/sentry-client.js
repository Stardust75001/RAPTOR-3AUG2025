// Fonction de récupération des issues depuis Sentry
async function fetchSentryIssues(projectSlug) {
  const SENTRY_API_URL = `https://sentry.io/api/0/projects/ton-org/${projectSlug}/issues/`;

  try {
    const response = await fetch(SENTRY_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer VOTRE_TOKEN_SENTRY',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`[Sentry] Erreur HTTP : ${response.status}`);
      return { error: `Erreur HTTP ${response.status}` };
    }

    const text = await response.text();

    if (!text || text.trim() === '' || text.trim() === '{}') {
      console.error('[Sentry] Réponse JSON vide ou malformée');
      return { error: 'Réponse vide ou invalide' };
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('[Sentry] Erreur de parsing JSON :', parseError);
      return { error: 'Format JSON invalide', details: parseError };
    }

    return json;

  } catch (fetchError) {
    console.error('[Sentry] Erreur réseau ou fetch :', fetchError);
    return { error: 'Erreur réseau', details: fetchError };
  }
}

// Code exécuté automatiquement au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  const issues = await fetchSentryIssues('TON_SLUG_PROJET_SENTRY');
  if (issues.error) {
    console.warn('Erreur Sentry détectée :', issues);
  } else {
    console.log('Issues Sentry :', issues);
  }
});