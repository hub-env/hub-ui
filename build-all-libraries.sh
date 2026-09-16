#!/bin/bash

# Script para construir todas las bibliotecas de ng-hub-ui
# Build script for all ng-hub-ui libraries

echo "🚀 Iniciando construcción de todas las bibliotecas..."
echo "🚀 Starting build for all libraries..."

# Every library registered as an `ng build` target in angular.json.
#
# BUILD ORDER MATTERS: "utils" MUST be built first. Seventeen libraries override
# `ng-hub-ui-utils` to ../../dist/utils in their tsconfig.lib.json, so the utils
# package has to exist in dist/ before they compile. "signature" carries the only
# other inter-library dependency — it also maps `ng-hub-ui-forms` to
# ../../dist/forms — and the alphabetical order below already builds forms first.
#
# `ds` and `installer` are deliberately absent: neither is an angular.json
# project. They build through their own commands and are handled below, the same
# way scripts/publish.js treats them.
LIBRARIES=(
    "utils"
    "action-sheet"
    "avatar"
    "badges"
    "board"
    "breadcrumbs"
    "buttons"
    "calendar"
    "forms"
    "history"
    "icons"
    "loading"
    "metrics"
    "milestones"
    "modal"
    "nav"
    "paginable"
    "panels"
    "portal"
    "signature"
    "skeleton"
    "sortable"
    "stepper"
    "toast"
)

# Libraries with a bespoke build, keyed by the command that produces their
# publishable output. Kept in sync with `directPublishLibraries` in publish.js.
DIRECT_BUILDS=(
    "ds:npm --prefix projects/ds run build:styles"
    "installer:./node_modules/.bin/tsc -p projects/installer/tsconfig.schematics.json"
)

# Contador de éxito/fallo
# Success/failure counter
SUCCESS_COUNT=0
FAILED_LIBRARIES=()

TOTAL=$(( ${#LIBRARIES[@]} + ${#DIRECT_BUILDS[@]} ))

echo ""
echo "📦 Bibliotecas a construir: $TOTAL"
echo "📦 Libraries to build: $TOTAL"
echo ""

# Construir cada biblioteca
# Build each library
for library in "${LIBRARIES[@]}"; do
    echo "🔨 Construyendo $library..."
    echo "🔨 Building $library..."
    
    if ng build $library --configuration production; then
        echo "✅ $library construida exitosamente"
        echo "✅ $library built successfully"
        ((SUCCESS_COUNT++))
    else
        echo "❌ Error construyendo $library"
        echo "❌ Error building $library"
        FAILED_LIBRARIES+=("$library")
    fi
    
    echo ""
done

# Bibliotecas con build propio
# Libraries with their own build step
for entry in "${DIRECT_BUILDS[@]}"; do
    library="${entry%%:*}"
    command="${entry#*:}"

    echo "🔨 Construyendo $library..."
    echo "🔨 Building $library..."

    if eval "$command"; then
        echo "✅ $library construida exitosamente"
        echo "✅ $library built successfully"
        ((SUCCESS_COUNT++))
    else
        echo "❌ Error construyendo $library"
        echo "❌ Error building $library"
        FAILED_LIBRARIES+=("$library")
    fi

    echo ""
done

# Resumen final
# Final summary
echo "=================================="
echo "📊 RESUMEN / SUMMARY"
echo "=================================="
echo "✅ Exitosas / Successful: $SUCCESS_COUNT/$TOTAL"

if [ ${#FAILED_LIBRARIES[@]} -gt 0 ]; then
    echo "❌ Fallidas / Failed: ${#FAILED_LIBRARIES[@]}"
    echo "   Bibliotecas fallidas / Failed libraries:"
    for failed in "${FAILED_LIBRARIES[@]}"; do
        echo "   - $failed"
    done
    exit 1
else
    echo "🎉 ¡Todas las bibliotecas fueron construidas exitosamente!"
    echo "🎉 All libraries built successfully!"
    exit 0
fi
