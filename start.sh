#!/bin/bash

# Назва та URL репозиторію
REPO_NAME="Ayi"
REPO_URL="https://github.com/RastGame/Ayi.git"

# Якщо немає директорії — клонувати
if [ ! -d "$REPO_NAME" ]; then
  git clone "$REPO_URL"
  cd "$REPO_NAME" || exit 1
else
  cd "$REPO_NAME" || exit 1
  git fetch origin
  git reset --hard origin/main
fi

# Встановити pull-URL і відключити push
git remote set-url origin "$REPO_URL"
git remote set-url --push origin DISABLED

# Встановити tracking гілку
git branch --set-upstream-to=origin/main main 2>/dev/null

echo "✅ Repo '$REPO_NAME' оновлено, push заблоковано"
