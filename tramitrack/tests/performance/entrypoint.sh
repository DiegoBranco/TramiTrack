#!/bin/sh
set -e

# Buscar archivos .jmx en /tests/plans/
if [ -z "$(ls /tests/plans/*.jmx 2>/dev/null)" ]; then
    echo "=================================================="
    echo " No se encontraron planes de prueba JMX."
    echo " Saltando ejecución de pruebas de rendimiento."
    echo "=================================================="
    exit 0
fi

echo "=================================================="
echo " Ejecutando pruebas de rendimiento con JMeter"
echo "=================================================="

# Ejecutar JMeter en modo no gráfico
# -n: no gráfico
# -t: archivo de prueba (tomamos el primero encontrado, o podrías parametrizarlo)
# -l: archivo de resultados
# -j: archivo de log
# -e -o: generar reporte HTML

TEST_PLAN=$(ls /tests/plans/*.jmx | head -1)
RESULTS_FILE="/tests/results/resultado-$(date +%Y%m%d-%H%M%S).jtl"
REPORT_DIR="/tests/reports/$(date +%Y%m%d-%H%M%S)"

echo "Plan de pruebas: $TEST_PLAN"
echo "Resultados: $RESULTS_FILE"
echo "Reporte: $REPORT_DIR"

jmeter -n \
    -t "$TEST_PLAN" \
    -l "$RESULTS_FILE" \
    -j /tests/jmeter.log \
    -e -o "$REPORT_DIR"

echo "Pruebas completadas. Reporte disponible en $REPORT_DIR"