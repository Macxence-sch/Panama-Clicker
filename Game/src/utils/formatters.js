/**
 * formatters.js
 * Utilitaires pour formater les nombres
 */

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) {
    return '0'
  }

  const number = Number(num)

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2).replace('.', ',') + ' Md'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2).replace('.', ',') + ' M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2).replace('.', ',') + ' K'
  }

  // Afficher toujours au moins 1 décimale pour les petits nombres
  if (number % 1 === 0) {
    return number.toFixed(1).replace('.', ',')
  } else {
    return number.toFixed(2).replace('.', ',')
  }
}

export const formatRevenue = (num) => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) {
    return '0'
  }

  const number = Number(num)

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2).replace('.', ',') + ' Md'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2).replace('.', ',') + ' M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2).replace('.', ',') + ' K'
  }

  // Afficher toujours au moins 1 décimale pour les petits nombres
  if (number % 1 === 0) {
    return number.toFixed(1).replace('.', ',')
  } else {
    return number.toFixed(2).replace('.', ',')
  }
}

