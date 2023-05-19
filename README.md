# obi--03--user-management--backend

## set up
```bash

# due to permission problems while using colima, create volume mount dir manually, clean manually in case of clean run
# mkdir database

docker compose up -d

# wait for db to spin up
docker compose logs -f

yarn

# run initial migration
yarn migration:run
```


## start local dev environment

```bash
yarn start:dev
```


## execute test suites

```bash
# unit
yarn test

# e2e
yarn test:e2e

# coverage
yarn test:cov
```

## roadmap
ref: [todo](TODO.md)
