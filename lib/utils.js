export function formatNumber(num, decimals = 0) {
  num = Math.round(num * 100) / 100
  return num.toLocaleString('en-US') ;
}

