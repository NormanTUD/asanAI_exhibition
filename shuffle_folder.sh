#!/bin/bash

# Überprüfen, ob ein Verzeichnis übergeben wurde
if [ -z "$1" ]; then
    echo "Bitte gib ein Verzeichnis an."
    exit 1
fi

# Verzeichnis aus dem ersten Argument laden
directory="$1"

# Überprüfen, ob das angegebene Verzeichnis existiert
if [ ! -d "$directory" ]; then
    echo "Das Verzeichnis $directory existiert nicht."
    exit 1
fi

# Liste aller Dateien im Verzeichnis
files=("$directory"/*)

# Überprüfen, ob Dateien im Verzeichnis vorhanden sind
if [ ${#files[@]} -eq 0 ]; then
    echo "Keine Dateien im Verzeichnis $directory gefunden."
    exit 1
fi

# Erzeuge temporäre Dateinamen
temp_files=()
for file in "${files[@]}"; do
    temp_file="${file}.tmp"
    cp "$file" "$temp_file"  # Inhalt sichern
    temp_files+=("$temp_file")
done

# Original-Dateinamen mischen
shuffled_files=("${files[@]}")
shuffled_files=( $(shuf -e "${shuffled_files[@]}") )

# Alte Dateien löschen und durch gemischte Dateinamen ersetzen
for i in "${!files[@]}"; do
    mv "${temp_files[$i]}" "${shuffled_files[$i]}"  # Inhalt auf neuen Namen setzen
done

# Temporäre Dateien entfernen
for file in "${files[@]}"; do
    rm -f "${file}.tmp"
done

echo "Dateien wurden zufällig umbenannt."
