info() {
  yellow='\033[1;33m'
  reset='\033[0m'
  printf "${yellow} INFO${reset}:: $@\n"
}

err() {
  red='\033[1;31m'
  reset='\033[0m'
  printf "${red}ERROR${reset}:: $@\n"
}

if [ -z "$1" ]
then
  err "specify database url, e.g. \n\n          npm start postgres://postgres:abc123@localhost:5432/compasia"
  exit 1
fi

info "Preparing backend"
cd backend \
  && npm install \
  && echo "DATABASE_URL=\"$1\"" > .env \
  && cd ../ || exit 1

echo ""
info "Trying to revert one migration"
cd backend && npm run migration:down && cd ../ || exit 1

echo ""
info "Applying one migration"
cd backend && npm run migration:up && cd ../ || exit 1

echo ""
info "Seeding database"
cd backend && npm run seed && cd ../ || exit 1


echo ""
info "Prepating frontend"
cd frontend \
  && npm install \
  && echo "REACT_APP_BACKEND_URL=http://localhost:3001" > .env \
  && cd ../ || exit 1

echo ""
info "Starting backend and frontend"
npm run dev

