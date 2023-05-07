exitWithError() {
  echo "Specify migration type and path, eg $0 create|generate <MigrationName>"
  exit 1
}

if [ -z "$1" ]
then
  exitWithError
fi

if [ -z "$2" ]
then
  exitWithError
fi

if [ "$1" = "generate" ]
then
  npm run build && npx typeorm migration:generate -d dist/src/database/database.source.js "src/database/migrations/$2"
elif [ "$1" = "create" ]
then
  npx typeorm migration:create "src/database/migrations/$2"
fi

npx prettier --write "src/database/migrations/*$2.ts" > /dev/null