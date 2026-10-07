param([Parameter(Mandatory=$true)][string]$Nombre)

$ruta = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
if (-not (Test-Path $ruta)) { Write-Host "No encuentro .env.local en $ruta" -ForegroundColor Red; exit 1 }

$lineas = [System.IO.File]::ReadAllLines($ruta)
$indice = -1
for ($i = 0; $i -lt $lineas.Length; $i++) {
  if ($lineas[$i] -match ("^" + [regex]::Escape($Nombre) + "=")) { $indice = $i; break }
}
if ($indice -lt 0) { Write-Host "La variable $Nombre no existe en .env.local" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Pega la clave de $Nombre y presiona Enter." -ForegroundColor Cyan
Write-Host "(No se va a ver nada en pantalla mientras pegas: es normal, es por seguridad.)"
$segura = Read-Host "Clave" -AsSecureString
$valor = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)).Trim().Trim('"').Trim("'")

if ([string]::IsNullOrWhiteSpace($valor)) { Write-Host "No pegaste nada. No se guardo nada." -ForegroundColor Red; exit 1 }
if ($valor -match "\s") { Write-Host "La clave tiene espacios adentro, algo se copio mal. No se guardo nada." -ForegroundColor Red; exit 1 }

$lineas[$indice] = "$Nombre=$valor"
[System.IO.File]::WriteAllLines($ruta, $lineas, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ""
Write-Host "Listo: $Nombre guardada (largo: $($valor.Length) caracteres)." -ForegroundColor Green
