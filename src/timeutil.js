function convertToTimeFormat(inputTime) {
  // Supprime les caractères non numériques (comme 'h') pour obtenir les heures et minutes
  var timeParts = inputTime.replace('h', ':').split(':');

  // Extraire les heures et minutes
  var hours = timeParts[0];
  var minutes = timeParts.length > 1 ? timeParts[1] : '00'; // Assigner '00' si minutes non spécifiées

  // Ajouter un zéro au début si nécessaire pour les heures et les minutes
  hours = hours.padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  // Construire le format final avec secondes (00 par défaut)
  var formattedTime = hours + ':' + minutes + ':00';

  return formattedTime;
}